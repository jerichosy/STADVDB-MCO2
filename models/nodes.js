const mysql = require('mysql2/promise');
const dotenv = require(`dotenv`).config();


// Create the connection pool. The pool-specific settings are the defaults
const node1 = mysql.createPool({
    // host: process.env.DB_REMOTE_HOST,
    // port: process.env.DB_REMOTE_PORT_01,
    
    host: process.env.DB_HOST_01,
    port: process.env.DB_PORT_01,
    user: process.env.DB_USER_01,
    password: process.env.DB_PASS,
    database: 'movies',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0
});

// Create the connection pool. The pool-specific settings are the defaults
const node2 = mysql.createPool({
    // host: process.env.DB_REMOTE_HOST,
    // port: process.env.DB_REMOTE_PORT_02,

    host: process.env.DB_HOST_02,
    port: process.env.DB_PORT_02,
    user: process.env.DB_USER_02,
    password: process.env.DB_PASS,
    database: 'movies',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0
});

// Create the connection pool. The pool-specific settings are the defaults
const node3 = mysql.createPool({
    // host: process.env.DB_REMOTE_HOST,
    // port: process.env.DB_REMOTE_PORT_03,

    host: process.env.DB_HOST_03,
    port: process.env.DB_PORT_03,
    user: process.env.DB_USER_03,
    password: process.env.DB_PASS,
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
            const [rows, fields] = await nodes[n - 1].query(`SELECT 1`);
            return true;
        }
        catch (err) {
            console.log(`Error: Node ${n} is not available`);
            return false;
        }
    },

    getConnection: async function(n) {
        switch (n) {
            case 1: return await node1.getConnection();
            case 2: return await node2.getConnection();
            case 3: return await node3.getConnection();
        }
    }
}

module.exports = {
    node1: node1,
    node2: node2,
    node3: node3,
    node_utils
}
