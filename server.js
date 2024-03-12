
// Importa Express
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const token = require('./tokenMarco.js');


// Crea una instancia de Express
const app = express();
const port = 3500; // Puerto en el que se ejecutará el servidor


app.use(cors());



// Definir una ruta de ejemplo
app.get('/token', async (req, res) => {
    try {

        const data = await token();



        res.send(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
});



// Definir una ruta de ejemplo
app.get('/', async (req, res) => {
    try {
     

        res.send(req);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
});

// Definir una ruta de ejemplo
app.post('/', async (req, res) => {
    try {
        const data = await token();



        res.send(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});


