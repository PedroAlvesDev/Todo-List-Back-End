// Importando o express
const express = require('express');
const uuid = require('uuid');
const PORT = 8000;

// inicializar o express
const app = express();

// Conseguir receber body como json dentro das nossas rotas
app.use(express.json());

const users = [
    {
        id: '1234', // gerado automaticamente
        name: 'Henrique', // será informado pela requisição
        username: 'henrique-alves', // será informado pela requisição
        tasks: [], // iniciar vazio
    },
];

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

    if(bodyRequest.name === "" || bodyRequest.username === "") {
        return response.status(400).json({ message: 'Field name & username are both required' });
    };


    const foundUser = users.find((user) => {
        return user.username === bodyRequest.username;
    });

    if(foundUser) {
        return response.status(400).json({ message: `User with username ${bodyRequest.username} already exists` });
    };

    const newUser = {
        id: uuid.v4(),
        name: bodyRequest.name,
        username: bodyRequest.username,
        tasks: [],
    };

    users.push(newUser);

    response.status(201).json(newUser);
});

app.listen(PORT, () => console.log(`App rodando na porta ${PORT}`));

