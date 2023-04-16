const {node1, node2, node3, node_utils} = require('./nodes.js'); 
const transaction_utils = require('./transaction.js');

const db_queries = {
    genericQuery: async function (query, nodenum, year) {
        let result;
        if (nodenum == 1 && await node_utils.pingNode(1)) {
            console.log(`Generic query to Node 1 because nodenum = ${nodenum}`)
            result = await transaction_utils.do_transaction(nodenum, query)
        }
        else {
            if (year < 1980 && await node_utils.pingNode(2)){
                console.log(`Generic query to Node 2 because year = ${year}`)
                result = await transaction_utils.do_transaction(2, query)
            }
            else if (year >= 1980 && await node_utils.pingNode(3)) {
                console.log(`Generic query to Node 3 because year = ${year}`)
                result = await transaction_utils.do_transaction(3, query)
            }
            else if (await node_utils.pingNode(1)){
                console.log("Generic query to Node 1 because Node 2 or 3 is down")
                result = await transaction_utils.do_transaction(1, query)
            }
            else {
                console.log("No nodes available. Please try again later.")
            }
        }
        return result
    },

    // this is okay na
    selectQuery: async function (addtlQuery, from, to, nodenum) {
        // If we're node 1, prefer Node 1 if alive
        if (nodenum == 1 && await node_utils.pingNode(1)) {
            console.log(`Getting from Node 1 because nodenum = ${nodenum}`);
            const [movies, fields] = await node1
                .query(`SELECT * FROM movies ` + addtlQuery +  ` ORDER BY id DESC LIMIT 200`);
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
                    .query(`SELECT * FROM movies ` + addtlQuery +  ` ORDER BY id DESC LIMIT 200`);
                    return movies
                }
                else{
                    console.log("Getting from Node 1 because Node 2 is down");
                    if(await node_utils.pingNode(1)){
                        const [movies, fields] = await node1
                        .query(`SELECT * FROM movies ` + addtlQuery +  ` ORDER BY id DESC LIMIT 200`);
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
                    console.log("Getting from Node 1 because Node 3 is down");
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
                console.log(`Getting from Node 1 because year range (${from} - ${to})`)
                if (await node_utils.pingNode(1)) {
                    const [movies, fields] = await node1
                        .query(`SELECT * FROM movies ` + addtlQuery +  ` ORDER BY id DESC LIMIT 200`); 
                        return movies
                }
                else {
                    console.log("Getting from Node 2 and 3 because Node 1 is down and year range");
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

    insertQuery: async function(query, year, nodenum) {
               
        if (nodenum == 1 && await node_utils.pingNode(1)) {
            console.log(`Inserting to Node 1 because nodenum = ${nodenum}`);
            await transaction_utils.do_transaction(nodenum, query)
        }
        else {
            if (nodenum == 1) {
                console.log("Inserting to Node 1 failed because Node 1 is down");
            }
            if (year < 1980 && await node_utils.pingNode(2)){
                console.log(`Inserting to Node 2 because year = ${year}`);
                await transaction_utils.do_transaction(2, query)
            }
            else if (year >= 1980 && await node_utils.pingNode(3)) {
                console.log(`Inserting to Node 3 because year = ${year}`);
                await transaction_utils.do_transaction(3, query)
            }
            else if (await node_utils.pingNode(1)){
                console.log("Inserting to Node 1 because Node 2 or 3 is down");
                await transaction_utils.do_transaction(1, query)
            }
            else {
                console.log("No nodes available. Please try again later.")
            }
        }
        
    },

    updateQuery: async function(query, oldyear, newyear, nodenum, body) {
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

        //with year change but no node change, since no changes are handled in controller
        else if (oldyear < 1980 && newyear < 1980){
            // keep in node 2
            if (await node_utils.pingNode(2)) {
                await transaction_utils.do_transaction(2, query)
            }
            else if (await node_utils.pingNode(1)){
                await transaction_utils.do_transaction(1, query)
            }
            else{
                console.log("No nodes available. Please try again later.")
            }
        }
        else if (oldyear >= 1980 && newyear >= 1980){
            // keep in node 3
            if (await node_utils.pingNode(3)) {
                await transaction_utils.do_transaction(3, query)
            }
            else if (await node_utils.pingNode(1)){
                await transaction_utils.do_transaction(1, query)
            }
            else{
                console.log("No nodes available. Please try again later.")
            }
        }
    },

    updateQuery_delay: async function(query, oldyear, newyear, nodenum, body) {
        //no changing of year
        if (nodenum == 1 && await node_utils.pingNode(1)) {
            await transaction_utils.do_transaction_delay(nodenum, query)
        }
        else if(oldyear == newyear){    // if no change to year
            if(oldyear < 1980 && await node_utils.pingNode(2)){
                await transaction_utils.do_transaction_delay(2, query)
            }
            else if(oldyear >= 1980 && await node_utils.pingNode(3)){
                await transaction_utils.do_transaction_delay(3, query)
            }
            else if (await node_utils.pingNode(1)){
                await transaction_utils.do_transaction_delay(1, query)
            }
            else{
                console.log("No nodes available. Please try again later.")
            }
        }

        //with year change but no node change, since no changes are handled in controller
        else if (oldyear < 1980 && newyear < 1980){
            // keep in node 2
            if (await node_utils.pingNode(2)) {
                await transaction_utils.do_transaction_delay(2, query)
            }
            else if (await node_utils.pingNode(1)){
                await transaction_utils.do_transaction_delay(1, query)
            }
            else{
                console.log("No nodes available. Please try again later.")
            }
        }
        else if (oldyear >= 1980 && newyear >= 1980){
            // keep in node 3
            if (await node_utils.pingNode(3)) {
                await transaction_utils.do_transaction_delay(3, query)
            }
            else if (await node_utils.pingNode(1)){
                await transaction_utils.do_transaction_delay(1, query)
            }
            else{
                console.log("No nodes available. Please try again later.")
            }
        }
    },

    deleteQuery: async function(query, year, nodenum) {
        if (nodenum == 1 && await node_utils.pingNode(1)) {
            console.log(`Deleting from Node 1 because nodenum = ${nodenum}`)
            await transaction_utils.do_transaction(nodenum, query)
        }
        else {
            if (year < 1980 && await node_utils.pingNode(2)){
                console.log(`Deleting from Node 2 because year = ${year}`)
                await transaction_utils.do_transaction(2, query)
            }
            else if (year >= 1980 && await node_utils.pingNode(3)) {
                console.log(`Deleting from Node 3 because year = ${year}`)
                await transaction_utils.do_transaction(3, query)
            }
            else if (await node_utils.pingNode(1)){
                console.log("Deleting from Node 1 because Node 2 or 3 is down")
                await transaction_utils.do_transaction(1, query)
            }
            else {
                console.log("No nodes available. Please try again later.")
            }
        }

    },
}

module.exports = db_queries