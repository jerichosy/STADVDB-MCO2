const { node1, node2, node3, node_utils } = require('./nodes.js');

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
    }
}

module.exports = transaction_utils;
