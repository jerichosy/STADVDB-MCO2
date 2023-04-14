const mysql = require('mysql2');

// Create the connection pool. The pool-specific settings are the defaults
const node1 = mysql.createPool({
    // host: 'ccscloud3.dlsu.edu.ph',
    // port: 39003,
    // user: 'node_01',
    host: 'localhost',
    port: 3310,
    user: 'root',
    password: '12345',
    database: 'movies',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0
});

// Create the connection pool. The pool-specific settings are the defaults
const node2 = mysql.createPool({
    host: 'ccscloud3.dlsu.edu.ph',
    port: 39004,
    user: 'node_02',
    password: '12345',
    database: 'movies',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0
});

// Create the connection pool. The pool-specific settings are the defaults
const node3 = mysql.createPool({
    host: 'ccscloud3.dlsu.edu.ph',
    port: 39005,
    user: 'node_03',
    password: '12345',
    database: 'movies',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0
});

const nodes = [node1, node2, node3];

const node_utils = {
    pingNode: async function (n) {
        try {
            const [rows, fields] = await nodes[n - 1].promise().query(`SELECT 1`);  // TODO: Is promise() necessary?
            return true;
        }
        catch (err) {
            console.log(`Error: Node ${n} is not available`);
            return false;
        }
    }
}

module.exports = {
    node1: node1,
    node_utils
}