const express = require('express')
const controller = require('../controller/controller.js')

const app = express()

app.get('/', controller.getIndex)
app.get('/test_query', controller.testQuery)
app.get(`/ping_node/:id`, controller.pingNode)

module.exports = app