const express = require('express')
//const router = express.Router()
const controller = require('../controller/controller.js')

const app = express()

app.get('/', controller.getIndex);
app.get('/filter', controller.getIndex);
app.get('/editMovie?:id?:year', controller.getEditMovie);
app.get('/deleteMovie?:id?:year', controller.getDeleteMovie);
app.get('/test_query', controller.testQuery);
app.get(`/ping_node/:id`, controller.pingNode);
app.get('/syncfragment3', controller.syncFragmentNode3);
app.get('/syncfragment2', controller.syncFragmentNode2);
app.get('/synccentral', controller.syncCentral);

app.post('/update', controller.postUpdateMovie);
app.post('/add', controller.postAddMovie);

module.exports = app