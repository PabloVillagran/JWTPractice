require('dotenv').config()

////Setup DB
const mongoose = require('mongoose')
const DB_URL = process.env.DB_URL+process.env.LOGIN_DB //obtiene string de conexión de archivo .env
mongoose.connect(DB_URL) //conecta a base de datos
const dbConnection = mongoose.connection //obtiene puntero de conexión

dbConnection.on('error', (error)=>{
    console.log(error)// reporta error de conexión a base de datos
})

dbConnection.once('connected', ()=>{
    console.log('Connected to '+ DB_URL)// realiza test de conexión a base de datos
})

////Setup Express server
const express = require('express')
const port = 9001
const app = express()
app.use(express.json())

const routes = require('./routes/login')
app.use('/api', routes) //Setup router file

app.listen(port, () =>{ //Inicia el servidor con las configuraciones indicadas
    console.log('Listening on port ', port) 
})
