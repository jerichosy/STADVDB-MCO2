const {node1, node2, node3, node_utils} = require('./nodes.js'); 
const transaction_utils = require('./transaction.js');

const db_queries = {
    // this is okay na
    selectQuery: async function (addtlQuery, from, to, nodenum) {
        // If we're node 1, prefer Node 1 if alive
        if (nodenum == 1 && await node_utils.pingNode(1)) {
            console.log("Getting from Node 1");
            const [movies, fields] = await node1
                .query(`SELECT * FROM movies ` + addtlQuery +  ` ORDER BY YEAR DESC LIMIT 200`);
            return movies
        }
        // Otherwise, we use the year range to determine which node to query
        // This is because nodenum is still 1 if node 1 is down
        // And also, if we're either on Node 2 or Node 3, we still need to check the year range to see if we can query ourselves
        else {
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
            // Incase of a range that spans both nodes, we query Node 1 (if it's alive) or both Node 2 and Node 3 and concatenate the results
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
        }
    },

    insertQuery: async function(query, year, nodenum) { //TODO: FIX IDS
               
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
            else if (await node_utils.pingNode(1)){
                await transaction_utils.do_transaction(1, query)
            }
            else {
                console.log("No nodes available. Please try again later.")
            }
        }
        
    },
    // Node 2: 5
    // Node 1: 1 2 3 4 5
    // Node 3: 1 2 3 4 

    updateQuery: async function(query, oldyear, newyear, nodenum, body) {
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
        
        
        // if (nodenum == 1 && await node_utils.pingNode(1)) {
        //     await transaction_utils.do_transaction(nodenum, query)
        // }
        // else {
        //     if (year < 1980 && await node_utils.pingNode(2)){
        //         await transaction_utils.do_transaction(2, query)
        //     }
        //     else if (year >= 1980 && await node_utils.pingNode(3)) {
        //         await transaction_utils.do_transaction(3, query)
        //     }
        //     else {
        //         console.log("No nodes available. Please try again later.")
        //     }
        // }
        
        //no changing of year
        if (nodenum == 1 && await node_utils.pingNode(1)) {
            await transaction_utils.do_transaction(nodenum, query)
        }
        else if(oldyear == newyear){    // if no change to year
            if(oldyear < 1980 && await node_utils.pingNode(2)){
                await transaction_utils.do_transaction(2, query)
            }
            else if(oldyear >= 1980 && await node_utils.pingNode(3)){
                await transaction_utils.do_transaction(3, query)
            }
            else if (await node_utils.pingNode(1)){
                await transaction_utils.do_transaction(1, query)
            }
            else{
                console.log("No nodes available. Please try again later.")
            }
        }

        // if year changed 1979 1981
        else if (oldyear < 1980 && newyear >= 1980){
            // delete from node 2, add to node 3
            if (await node_utils.pingNode(2) && await node_utils.pingNode(3)){
                var delQ = `DELETE FROM movies WHERE id = ` + body.id;
                this.deleteQuery(delQ, oldyear, 2)
                
                var insQ = `INSERT INTO movies (title, year, genre, director, actor) VALUES ('` + body.title + `','` + newyear  + `','` +
                body.genre + `', '` + body.director + `', '`  + body.actor + `')`;
                
                this.insertQuery(insQ, newyear, 3);
            }
            else if(await node_utils.pingNode(1)){
                await transaction_utils.do_transaction(1, query)

            }
            else{
                console.log("No nodes available. Please try again later.")
            }
            


            
        }
        else if (oldyear >= 1980 && newyear < 1980){
            // delete from node 3, add to node 2
        }
        else if (oldyear < 1980 && newyear < 1980){
            // keep in node 2
            if (await node_utils.pingNode(2)) {

            }
            else if (await node_utils.pingNode(1)){
                
            }
        }
        else if (oldyear >= 1980 && newyear >= 1980 && await node_utils.pingNode(3)){
            // keep in node 3
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
            else if (await node_utils.pingNode(1)){
                await transaction_utils.do_transaction(1, query)
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