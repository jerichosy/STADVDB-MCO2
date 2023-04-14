const node1 = require('../models/db');

const controller = {
    getIndex: function (req, res) {
        res.render('index')
    },

    testQuery: async function (req, res) {
        const [rows, fields] = await node1.promise().query(`SELECT * FROM movies`);
        res.send(rows);
    }
}

module.exports = controller;