const { node1, node2, node3, node_utils } = require('./nodes.js');

function sleep(milliseconds) {  
    return new Promise(resolve => setTimeout(resolve, milliseconds));  
 }  

const transaction_utils = {
    do_transaction: async function (node, query) {
        let connection;
        try {
            connection = await node_utils.getConnection(parseInt(node));
            await connection.beginTransaction();

            var [result, fields] =  await connection.query(query);

            await connection.commit();

            console.log('success!');
            return result
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            throw error;
        } finally {
            if (connection) {
                await connection.release();
            }
        }
    },
    do_transaction_delay: async function (node, query) {
        let connection;
        try {
            connection = await node_utils.getConnection(parseInt(node));
            await connection.beginTransaction();

            var [result, fields] =  await connection.query(query);
            
            await sleep(5000);
            
            await connection.commit();

            console.log('success!');
            return result
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            throw error;
        } finally {
            if (connection) {
                await connection.release();
            }
        }
    },
    update_movie_transaction: async function (nodenum, data) {
        let connection;
        try {
            connection = await node_utils.getConnection(parseInt(nodenum));
            await connection.beginTransaction();
            const selectQuery = 'SELECT * FROM movies WHERE id =' + data.id + ` FOR UPDATE`;
            await connection.query(selectQuery);

            const updateQuery = `UPDATE movies SET title = '` + data.title + `', year = ` + data.newyear + `, genre = '` + 
            data.genre + `', director = '` + data.director + `', actor = '` + data.actor + `' WHERE id = ` + data.id;
            await connection.query(updateQuery);
            
            await connection.commit();

            console.log('Successfully updated row id '+ data.id + 'on Node ' + nodenum);
        } catch (error) {
            console.log(error);
            if (connection) {
                await connection.rollback();
            }
            throw error;
        } finally {
            if (connection) {
                await connection.release();
            }
        }
    }

}

module.exports = transaction_utils;
