// Importa Express
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const token = require('./tokenMarco.js');
const request = require('./requestAPI.js');

let token_marco = null;

// Crea una instancia de Express
const app = express();

app.use(bodyParser.json());
const port = 3500; // Puerto en el que se ejecutará el servidor

app.use(cors());

app.all('*', async (req, res) => {

    const requestedPath = req.originalUrl;
    const requestedMethod = req.method;
    const requestBody = req.body;    
    

    if (token_marco == null) {
        const tokenERP = await token();

        token_marco = tokenERP.token.access_token;
    }


    if(requestedPath=='/token'){
        res.send(token_marco);

        return;
    }
    
    const response = await request({ type: requestedMethod, metodo: requestedPath, data: requestBody }, token_marco)

    console.log(token_marco);

    res.send(response);


});


// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});


