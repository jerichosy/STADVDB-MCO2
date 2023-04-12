const express = require('express')
const controller = require('../controller/controller.js')

const app = express()

app.get('/', controller.getIndex)

module.exports = app