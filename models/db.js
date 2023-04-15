const {node1, node2, node3, node_utils} = require('./nodes.js'); 
const transaction_utils = require('./transaction.js');
const db_queries = {
    selectQuery: async function (addtlQuery, from, to) {
        
        console.log(from)
        console.log(to)

        if(from < 1980 && to < 1980){
            console.log("Getting from Node 2");
            if(await node_utils.pingNode(2)){
                const [movies, fields] = await node2
                .query(`SELECT * FROM movies ` + addtlQuery +  ` ORDER BY YEAR DESC LIMIT 200`);
                return movies
            }
            else{
                if(await node_utils.pingNode(1)){
                    const [movies, fields] = await node1
                    .query(`SELECT * FROM movies ` + addtlQuery +  ` ORDER BY YEAR DESC LIMIT 200`);
                    return movies
                }
                else{
                    console.log(`No nodes available. Please try again later.`);
                }
            }
        }
        else if (from >= 1980 && to >= 1980) {
            console.log("Getting from Node 3");
            if (await node_utils.pingNode(3)) {
                const [movies, fields] = await node3
                .query(`SELECT * FROM movies ` + addtlQuery +  ` LIMIT 200`);
                return movies
            }
            else {
                if (await node_utils.pingNode(1)) {
                    const [movies, fields] = await node1
                        .query(`SELECT * FROM movies ` + addtlQuery +  ` LIMIT 200`); 
                        return movies
                }
                else {
                    console.log(`No nodes available. Please try again later.`);
                }
            }
        }
        else {
            console.log("Getting from Node 1")
            if (await node_utils.pingNode(1)) {
                const [movies, fields] = await node1
                    .query(`SELECT * FROM movies ` + addtlQuery +  ` ORDER BY YEAR DESC LIMIT 200`); 
                    return movies
            }
            else {
                if(await node_utils.pingNode(2) && await node_utils.pingNode(3)) {
                    const [movies2, fields2] = await node2
                        .query(`SELECT * FROM movies ` + addtlQuery +  ` LIMIT 100`);
        
                    const [movies3, fields3] = await node3
                        .query(`SELECT * FROM movies ` + addtlQuery +  ` LIMIT 100`); 
                    
                    return movies2.concat(movies3)
                }
                else {
                    console.log(`No nodes available. Please try again later.`);
                }
            }
        }
    },

    insertQuery: async function(query, year, nodenum) {
               
        if (nodenum == 1 && await node_utils.pingNode(1)) {
            await transaction_utils.do_transaction(nodenum, query)
        }
        else {
            if (year < 1980 && await node_utils.pingNode(2)){
                await transaction_utils.do_transaction(2, query)
            }
            else if (year >= 1980 && await node_utils.pingNode(3)) {
                await transaction_utils.do_transaction(3, query)
            }
            else {
                console.log("No nodes available. Please try again later.")
            }
        }
        
    },

    updateQuery: async function(query, oldyear, newyear) {
        //if node 1 is alive
            // if new year > 1980 && old year < 1980
                // delete transaction
                // insert transaction
            // else if new year < 1980 && old year > 1980
                // delete transaction
                // insert transaction
            // else no change in year
                // update node 1
                // log to what node #
        // else
            // if new year > 1980 && old year < 1980
                // delete transaction
                // insert transaction
                // log to node 1
            // else if new year < 1980 && old year > 1980
                // delete transaction
                // insert transaction
            // else no change in year
                // update node 1
                // log to what node #
        
        // NEED LOG
        if(await node_utils.pingNode(1)) {
            if(oldyear == newyear){
                await node1.query(query);
                if(oldyear < 1980){
                    await node2.query(query);
                }
                else{
                    await node3.query(query);
                }

                //OR
                //log and sync
            }
            else if (oldyear < 1980 && newyear > 1980){
                
                //log to node 3
                //sync?
            }

        }
        else if (year < 1980) {
            if(await node_utils.pingNode(2)){
                await node2.query(query);
                //log to main
                //sync
            }
            else{

            }
        }
        else if (year >= 1980) {
            if(await node_utils.pingNode(3)){
                await node3.query(query);
                //log to main
                //sync
            }
            else{
                
            }
        }
        else {
            console.log(`No nodes available. Please try again later.`);
        }

    },

    deleteQuery: async function(query, year, nodenum) {
        
        if (nodenum == 1 && await node_utils.pingNode(1)) {
            await transaction_utils.do_transaction(nodenum, query)
        }
        else {
            if (year < 1980 && await node_utils.pingNode(2)){
                await transaction_utils.do_transaction(2, query)
            }
            else if (year >= 1980 && await node_utils.pingNode(3)) {
                await transaction_utils.do_transaction(3, query)
            }
            else {
                console.log("No nodes available. Please try again later.")
            }
        }

    },
}

module.exports = db_queries




/*
    Insert
    Node 1 is down
    Im in 105 (Node 1 & Node 3)
        Insert defaults to Node 3
        Log that insert
        Replicate (Sync)
*/