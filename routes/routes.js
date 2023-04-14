const express = require('express')
//const router = express.Router()
const controller = require('../controller/controller.js')

const app = express()

app.get('/', controller.getIndex)
app.get('/editMovie?:id', controller.getEditMovie);
app.get('/deleteMovie?:id', controller.getDeleteMovie);
app.get('/test_query', controller.testQuery)
app.get(`/ping_node/:id`, controller.pingNode)

module.exports = app