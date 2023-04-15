const { node1, node2, node3, node_utils } = require('./nodes.js');

const transaction_utils = {
    do_transaction: async function (node, query) {
        let connection;
        try {
            connection = await node_utils.getConnection(parseInt(node));
            // console.log(await node1.getConnection())
            // console.log(node)
            // console.log(connection)
            await connection.beginTransaction();

            await connection.query(query);
            
            // const log = 'Post ' + insertPostResult.insertId + ' added';
            // await connection.query('INSERT INTO log SET data=?', log);

            await connection.commit();

            console.log('success!');
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
    
        // if (connection) {
        //     try {
        //         connection.beginTransaction();
        //         // QUERY HERE
        //         // LOG HERE
        //         connection.commit();
        //         connection.release();
        //     }
        //     catch (err) {
        //         connection.rollback();
        //         connection.release();
        //         throw err;
        //     }
        // }
        // else {
        //     console.log("Connection Error!")
        // }

        // general idea
        // connect to node
        // await connection.beginTransaction()
        // do query here
        // await connection.comit()
        // await connection.release()
        // if ever transaction failed during the transaction, Rollback
    }
}

module.exports = transaction_utils;
