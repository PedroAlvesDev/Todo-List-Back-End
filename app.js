// Importando o express
const express = require('express');
const uuid = require('uuid');
const PORT = 8000;

// inicializar o express
const app = express();

// Conseguir receber body como json dentro das nossas rotas
app.use(express.json());

const users = [];

// GET http://localhost:8000/test
app.get('/test', (request, response) => {
    response.status(200).json({ message: 'Hello Wolrd from express app!!!' });
});

// Listar Usuários cadastrados/criados
app.get('/users', (request, response) => {
    const queryString = request.query;
    const headers = request.headers;
    const body = request.body;

    console.log('Query String --->', queryString);
    console.log('Headers --->', headers.teste);
    console.log('Body --->', body);


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

// Toda rota de TASKS/TODO vamos precisar enviar "username"  via HEADERS
app.get('/tasks', (request, response) => {
    const headers = request.headers;
    console.log(headers);

    // Com o username que veio dos headers, procurar este user no array de users - OK
    // Se encontratmos o usuário, basta retornar as tasks dele pelo response - OK

    const foundUser = users.find((user) => {
        return user.username === headers.username;
    });

    // Se eu NÃO encontrar o user
    if (!foundUser) {
        return response.status(400).json({ message: `User with username ${headers.username} not found` });
    };

    response.status(200).json({ results: foundUser.tasks });
});

app.post('/tasks', (request, response) => {
    // Com o username que veio dos headers, procurar este user no array de users - OK
    // Receber as infos para criação da task (via BODY - title e deadline) - OK
    // Montar um objeto com a nova task e inserir dentro do array de tasks - OK
    // Retornar um response de sucesso com status 201 passando a task de criada - OK
    const headers = request.headers;
    const foundUser = users.find((user) => {
        return user.username === headers.username;
    });
    // Se NÃO ENCONTRAR o user
    if (!foundUser) {
        return response.status(400).json({ message: `User with username ${headers.username} not found` });
    };

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

app.listen(PORT, () => console.log(`App rodando na porta ${PORT}`));

