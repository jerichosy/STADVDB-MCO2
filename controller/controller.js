const nodes = require('../models/nodes');

const controller = {
    getIndex: function (req, res) {
        res.render('index')
    },

    testQuery: async function (req, res) {
        const [rows, fields] = await nodes.node1.promise().query(`SELECT * FROM movies`);
        res.send(rows);
    },

    pingNode: async function (req, res) {
        const id = req.params.id;
        const result = await nodes.node_utils.pingNode(id);
        res.send(result);
    }
}

module.exports = controller;