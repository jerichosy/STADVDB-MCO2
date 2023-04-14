const express = require('express')
//const router = express.Router()
const controller = require('../controller/controller.js')

const app = express()

app.get('/', controller.getIndex)
app.get('/editMovie?:id', controller.getEditMovie);
app.get('/deleteMovie?:id', controller.getDeleteMovie);

module.exports = app