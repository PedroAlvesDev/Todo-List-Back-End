// Importando o express
const express = require('express');
const uuid = require('uuid');
const PORT = 8000;

// inicializar o express
const app = express();

// MIDDLEWARES
// MIDDLEWARE DE USUARIO
const findUserFromRequestHeaders = (request, response, next) => {
    // Podemos usar este filtro para verificar se o usuário passado nos headers existe
    const headers = request.headers;
    const foundUser = users.find((user) => {
        return user.username === headers.username;
    });
    if (!foundUser) {
        return response.status(400).json({ message: `User with username ${headers.username} not found` });
    };

    request.foundUser = foundUser;

    next();
};

// MIDDLEWARE DE TASK
const findTaskInsideUser = (request, response, next) => {
    const params = request.params;
    const foundUser = request.foundUser;
    const foundTask = foundUser.tasks.find((task) => {
        return task.id === params.id;
    });

    if(!foundTask) {
        return response.status(400).json({ message: `Task with id ${params.id} not found` });
    };

    request.foundTask = foundTask;

    next();
};

// Conseguir receber body como json dentro das nossas rotas
app.use(express.json());

const users = [];



// GET http://localhost:8000/test
app.get('/test', (request, response) => {
    response.status(200).json({ message: 'Hello Wolrd from express app!!!' });
});

// Listar Usuários cadastrados/criados
app.get('/users', (request, response) => {
    response.status(200).json({ results: users });
});

// Adicionar/Criar um novo usuário dentro da nossa lista de users
app.post('/users', (request, response) => {
    // Validar se os campos name e username estão vazios
    // Gerar um id aleatório - OK
    // Pegar da requisição o nome e username do usuário - Semi OK
    // Verificar se um usuário com o username informado já existe - OK
    // Criar um novo objeto de usuário - OK
    // Salvo/Insiro esse novo objeto dentro do array users - OK
    // Responder a requisição com o novo usuário criado - OK
    const bodyRequest = request.body;

    if (bodyRequest.name === "" || bodyRequest.username === "") {
        return response.status(400).json({ message: 'Field name & username are both required' });
    };


    const foundUser = users.find((user) => {
        return user.username === bodyRequest.username;
    });

    if (foundUser) {
        return response.status(400).json({ message: `User with username ${bodyRequest.username} already exists` });
    };

    const newUser = {
        id: uuid.v4(),
        name: bodyRequest.name,
        username: bodyRequest.username,
        tasks: [], // iniciar vazio
    };

    users.push(newUser);

    response.status(201).json(newUser);
});

// Filtro de REQUESTS - MIDDLEWARE
app.use(findUserFromRequestHeaders );

// Toda rota de TASKS/TODO vamos precisar enviar "username"  via HEADERS
app.get('/tasks', (request, response) => {
    const foundUser =  request.foundUser;
    response.status(200).json({ results: foundUser.tasks });
});

app.post('/tasks', (request, response) => {
    // Com o username que veio dos headers, procurar este user no array de users - OK
    // Receber as infos para criação da task (via BODY - title e deadline) - OK
    // Montar um objeto com a nova task e inserir dentro do array de tasks - OK
    // Retornar um response de sucesso com status 201 passando a task de criada - OK
    const foundUser =  request.foundUser;

    const body = request.body;
    const newTask = {
        id: uuid.v4(),
        title: body.title,
        done: false,
        deadline: new Date(body.deadline),
        created_at: new Date(),
    };

    // Inserindo nova Task no array de tasks do usuário encontrado
    foundUser.tasks.push(newTask);

    response.status(201).json(newTask);
});

app.get('/tasks/:id', findTaskInsideUser, (request, response) => {
    // Pegar o username dos headers e busca-lo no nosso users - OK
    // Pegar o ID da task que veio via params e vamos busca-la dentro do array de tasks do user encontrado - OK
    // Se encontrarmos a task, retorna-la no response - OK
    const foundTask = request.foundTask;
    response.status(200).json({foundTask});
});

app.put('/tasks/:id', findTaskInsideUser, (request, response) => {
    // Pegar e validar o user pelo username dos headers - OK
    // Pegar o task que está dentro do usuario encontrado pelo ID que vieram por params - OK
    // Se encontrar a task substituir o title e o deadline que vieram no body - OK
    // Retornar um 200 com a task editada - OK
    const foundTask = request.foundTask;

    const body = request.body;
    foundTask.title = body.title;
    foundTask.deadline = new Date(body.deadline);

    response.status(200).json(foundTask);
});

app.patch('/tasks/:id', findTaskInsideUser, (request, response) => {
    const foundTask = request.foundTask;
    // Invertendo o valor booleano que o campo done possui
    foundTask.done = !foundTask.done;

    response.status(200).json(foundTask);
});

app.delete('/tasks/:id', (request, response) => {
    // Pegar e validar o user pelo username dos headers - OK
    // Encontrar o indice da task pelo ID informado nos params - OK
    // Pegar o indice encontrado e dar splice no array de tasks - OK
    // Retornar um response - OK
    const foundUser =  request.foundUser;

    const params = request.params;
    // Retorna o Index da task caso ela seja encontrada
    // Retorna -1 caso ela não encontre o elemento no array
    const foundIndex = foundUser.tasks.findIndex((task) => {
        return task.id === params.id;
    });
    if(foundIndex === -1) {
        return response.status(400).json({ message: `Task with id ${params.id} not found` });
    };

    foundUser.tasks.splice(foundIndex, 1);

    response.status(204).send();
});

app.listen(PORT, () => console.log(`App rodando na porta ${PORT}`));
