const express = require('express')
const controller = require('../controller/controller.js')

const app = express()

app.get('/', controller.getIndex)
app.get('/test_query', controller.testQuery)

module.exports = app