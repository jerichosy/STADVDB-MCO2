const {node1, node_utils} = require('../models/nodes');

const controller = {
    getIndex: async function (req, res) {
        const [movies, fields] = await node1.promise().query(`SELECT * FROM movies LIMIT 100`);
        
        res.render('index', {movies})
    },

    getFiltered: async function (req, res) {
        console.log(req.query);
        let from = req.query.yearFrom;
        let to = req.query.yearTo;

        if (from == '')
            from = -1;
        if (to == '')
            to = 9999;

        const [movies, fields] = await node1.promise()
            .query(`SELECT * FROM movies WHERE year >=` + from + ` AND year <=` + to + ` LIMIT 100`);
        res.render('index', {movies});
    },

    getEditMovie: async function(req, res){
        const query = `SELECT * FROM movies where id = ` + req.query.id;
        const [movie, fields] = await node1.promise().query(query);

        res.render('edit', movie[0]) 
    },
    
    postUpdateMovie: async function (req, res) {
        var id = req.get('referer');
        id = id.replace("http://localhost:3000" + "/editMovie?id=", ""); // change to current node's URI

        const query = `UPDATE movies SET title = '` + req.body.title + `', year = ` + req.body.year + `, genre = '` + 
                        req.body.genre + `', director = '` + req.body.director + `', actor = '` + req.body.actor + `' WHERE id = ` + id;
        const [movie, fields] = await node1.promise().query(query);
        console.log(movie)
        res.redirect('/');
    },

    postAddMovie: async function (req, res) {
        // INSERT INTO movies (title, year, genre, director, actor) VALUES ('The Matrix', 1999, 'Sci-Fi', 'Lana Wachowski', 'Keanu Reeves');
        console.log(req.body)
        const query = `INSERT INTO movies (title, year, genre, director, actor) VALUES ('` + req.body.title + `','` + req.body.year  + `','` +
                        req.body.genre + `', '` + req.body.director + `', '`  + req.body.actor + `')`;
        const [movie, fields] = await node1.promise().query(query);
        console.log(query)
        res.redirect('/');
    },

    getDeleteMovie: async function(req, res){
        const query = `DELETE FROM movies WHERE id = ` + req.query.id;
        const [movie, fields] = await node1.promise().query(query);

        res.redirect('index');
    },

    testQuery: async function (req, res) {
        const [rows, fields] = await node1.promise().query(`SELECT * FROM movies`);
        res.send(rows);
    }, 

    pingNode: async function (req, res) {
        const id = req.params.id;
        const result = await nodes.node_utils.pingNode(id);
        res.send(result);
    }
}

module.exports = controller;