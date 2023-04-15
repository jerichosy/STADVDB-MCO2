const {node1, node2, node3, node_utils} = require('../models/nodes');
const db_queries = require('../models/db');
const dotenv = require(`dotenv`).config();

const controller = {

    getIndex: async function (req, res) {
        var addtlQuery = "";
        let from = req.query.yearFrom;
        let to = req.query.yearTo;

        console.log(node_utils.pingNode(1));

        if (from == '' || from == null || from == 'undefined')
            from = -1;
        if (to == '' || to == null || to == 'undefined')
            to = 9999;

        addtlQuery += `WHERE year >=` + from + ` AND year <=` + to + ``
        
        var movies = await db_queries.selectQuery(addtlQuery, from, to, process.env.NODE_NO)
                
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

        const [movies, fields] = await node1
            .query(`SELECT * FROM movies WHERE year >=` + from + ` AND year <=` + to + ` LIMIT 100`);
        res.render('index', {movies});
    },

    getEditMovie: async function(req, res){
        const query = `SELECT * FROM movies where id = ` + req.query.id;
        const [movie, fields] = await node1.query(query);

        res.render('edit', movie[0]) 
    },
    
    // postUpdateMovie: async function (req, res) {
    //     // var id = req.get('referer');
    //     // console.log(id);
    //     // id = id.replace("http://" + process.env.THIS_HOST + ":" + process.env.THIS_PORT +"/editMovie?id=", ""); // change to current node's URI
    //     // console.log(id);
    //     let id = req.body.id;
    //     console.log(id);
    //     if(req.body.newyear === ""){
    //         year = req.body.oldyear
    //     }
    //     else{
    //         year = req.body.newyear
    //     }
            
    //     const query = `UPDATE movies SET title = '` + req.body.title + `', year = ` + year + `, genre = '` + 
    //                     req.body.genre + `', director = '` + req.body.director + `', actor = '` + req.body.actor + `' WHERE id = ` + id;
    //     const [movie, fields] = await node1.query(query);
    //     console.log(movie)
    //     res.redirect('/');
    // },

    postUpdateMovie: async function (req, res) {
        // var id = req.get('referer');
        // id = id.replace("http://localhost:3000" + "/editMovie?id=", ""); // change to current node's URI

        let id = req.body.id;
        console.log(id)

        if(req.body.newyear === ""){
            year = req.body.oldyear
        }
        else{
            year = req.body.newyear
        }
        //no node change update
        if((req.body.oldyear < 1980 && req.body.newyear < 1980) || (req.body.oldyear >= 1980 && req.body.newyear >= 1980)){
            const query = `UPDATE movies SET title = '` + req.body.title + `', year = ` + year + `, genre = '` + 
                        req.body.genre + `', director = '` + req.body.director + `', actor = '` + req.body.actor + `' WHERE id = ` + id;

            var movies = db_queries.updateQuery(query, req.body.oldyear, year, process.env.NODE_NO, req.body)
            console.log(movies)
        }
        else{
            const query = `DELETE FROM movies WHERE id = ` + req.query.id;
        
            db_queries.deleteQuery(query, req.body.oldyear, process.env.NODE_NO)
        }
            
        
        res.redirect('/');
    },

    postAddMovie: async function (req, res) {
        // INSERT INTO movies (title, year, genre, director, actor) VALUES ('The Matrix', 1999, 'Sci-Fi', 'Lana Wachowski', 'Keanu Reeves');
        console.log(req.body)
        const query = `INSERT INTO movies (title, year, genre, director, actor) VALUES ('` + req.body.title + `','` + req.body.year  + `','` +
                        req.body.genre + `', '` + req.body.director + `', '`  + req.body.actor + `')`;
        
        db_queries.insertQuery(query, req.body.year, process.env.NODE_NO)
        res.redirect('/');
    },

    getDeleteMovie: async function(req, res){
        const query = `DELETE FROM movies WHERE id = ` + req.query.id;
        
        db_queries.deleteQuery(query, req.body.year, process.env.NODE_NO)
        res.redirect('/');
    },

    testQuery: async function (req, res) {
        const [rows, fields] = await node1.query(`SELECT * FROM movies`);
        res.send(rows);
    }, 

    pingNode: async function (req, res) {
        const id = req.params.id;
        const result = await node_utils.pingNode(id);
        res.send(result);
    }
}

module.exports = controller;