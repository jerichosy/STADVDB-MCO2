const {node1, node2, node3, node_utils} = require('../models/nodes');
const sync = require('../models/synchronizer')
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

    getEditMovie: async function(req, res){
        const query = `SELECT * FROM movies where id = ` + req.query.id;
        const movie = await db_queries.genericQuery(query, process.env.NODE_NO, req.query.year);
        res.render('edit', movie[0]) 
    },

    postUpdateMovie: async function (req, res) {
        console.log("-------------------------UPDATE----------------")
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

            await db_queries.updateQuery(query, req.body.oldyear, year, process.env.NODE_NO, req.body)
            await sync.sync_central();
            await sync.sync_fragment(node2, 2);
            await sync.sync_fragment(node3, 3);
        }
        else{
            const queryDel = `DELETE FROM movies WHERE id = ` + req.body.id;
            const queryIns = `INSERT INTO movies (id, title, year, genre, director, actor) VALUES ('` + req.body.id + `','` + req.body.title + `','` + req.body.newyear  + `','` +
            req.body.genre + `', '` + req.body.director + `', '`  + req.body.actor + `')`;
            
            if (process.env.NODE_NO == 1){
                await db_queries.deleteQuery(queryDel, req.body.oldyear, 1)
                await db_queries.insertQuery(queryIns, req.body.newyear, 1)
            }
            else {
                // delete from current frag node
                if (req.body.oldyear < 1980) {
                    await db_queries.deleteQuery(queryDel, req.body.oldyear, 2);
                }
                else {
                    await db_queries.deleteQuery(queryDel, req.body.oldyear, 3);
                } 
                console.log("SHOULD SYNC AFTER DELETE");
                await sync.sync_central();
                await sync.sync_fragment(node2, 2);
                await sync.sync_fragment(node3, 3);

                if (await node_utils.pingNode(1)) {
                    await db_queries.insertQuery(queryIns, req.body.newyear, 1)
                    console.log("SHOULD SYNC AFTER INSERT");
                } 
                else {
                    if(req.body.newyear < 1980 && req.body.oldyear >= 1980) {
                        await db_queries.insertQuery(queryIns, req.body.newyear, 2)
                    }
                    else {
                        await db_queries.insertQuery(queryIns, req.body.newyear, 3)
                    }
                }
                await sync.sync_central();
                await sync.sync_fragment(node2, 2);
                await sync.sync_fragment(node3, 3);
            }
               
        }
            
        
        res.redirect('/');
    },

    postAddMovie: async function (req, res) {
        let query = `INSERT INTO movies (title, year, genre, director, actor) VALUES ('` + req.body.title + `','` + req.body.year  + `','` +
                        req.body.genre + `', '` + req.body.director + `', '`  + req.body.actor + `')`;
        
        const queryForLastID = `SELECT MAX(id) AS id FROM movies`;
        console.log(process.env.NODE_NO) 
        let lastID, fields1, fields2;

        if(await node_utils.pingNode(1)) {
            console.log("1st");
            [lastID, fields1] = await node1.query(queryForLastID);
            if (process.env.NODE_NO == "2"){
                [lastSelfID, fields2] = await node2.query(queryForLastID);
            }
            else if (process.env.NODE_NO == "3") {
                [lastSelfID, fields2] = await node3.query(queryForLastID);     
            }
        }
        else if(process.env.NODE_NO == "3" && await node_utils.pingNode(2)) {
            console.log("2nd");
            [lastID, fields] = await node2.query(queryForLastID);
            [lastSelfID, fields2] = await node3.query(queryForLastID);
        }
        else if(process.env.NODE_NO == "2" && await node_utils.pingNode(3)) {
            console.log("3rd");
            [lastID, fields] = await node3.query(queryForLastID);
            [lastSelfID, fields2] = await node2.query(queryForLastID);
        }

        if(lastID[0].id <= lastSelfID[0].id){
            await db_queries.insertQuery(query, req.body.year, process.env.NODE_NO)
            await sync.sync_central();
            await sync.sync_fragment(node2, 2);
            await sync.sync_fragment(node3, 3);
        }
        else if (lastID[0].id > lastSelfID[0].id){
            lastSelfID = lastID[0].id + 1
            query = `INSERT INTO movies (id, title, year, genre, director, actor) VALUES ('` + lastSelfID + `','` + req.body.title + `','` + req.body.year  + `','` +
                req.body.genre + `', '` + req.body.director + `', '`  + req.body.actor + `')`;
            await db_queries.insertQuery(query, req.body.year, process.env.NODE_NO);
            await sync.sync_central();
            await sync.sync_fragment(node2, 2);
            await sync.sync_fragment(node3, 3);
        }

        res.redirect('/');
    },

    getDeleteMovie: async function(req, res){
        const query = `DELETE FROM movies WHERE id = ` + req.query.id;
        
        await db_queries.deleteQuery(query, req.body.year, process.env.NODE_NO)
        await sync.sync_central();
        await sync.sync_fragment(node2, 2);
        await sync.sync_fragment(node3, 3);
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
    },
    
    syncFragmentNode2: async function (req, res) {
        await sync.sync_fragment(node2, 2);
        res.redirect('/');
    },
    syncFragmentNode3: async function (req, res) {
        await sync.sync_fragment(node3, 3);
        res.redirect('/');
    },

    syncCentral: async function (req, res) {
        await sync.sync_central();
        res.redirect('/');
    }
}

module.exports = controller;