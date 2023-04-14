const node1 = require('../models/db');

const controller = {
    getIndex: async function (req, res) {

        const [movies, fields] = await node1.promise().query(`SELECT * FROM movies LIMIT 50`);
        
        res.render('index', {movies})
    },

    getEditMovie: async function(req, res){
        const query1 = `SELECT * FROM movies where id = ` + req.query.id;
        console.log(query1);
        const [movie, fields] = await node1.promise().query(query1);

        res.render('edit', movie[0]) 
    },

    getDeleteMovie: async function(req, res){

    },

    testQuery: async function (req, res) {
        const [rows, fields] = await node1.promise().query(`SELECT * FROM movies`);
        res.send(rows);
    }
}

module.exports = controller;