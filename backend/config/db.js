const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.MYSQLHOST || process.env.DB_HOST,
    user: process.env.MYSQLUSER || process.env.DB_USER,
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME,
    port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();

        console.log("MySQL Connected Successfully");

        connection.release();
    } catch (error) {
        console.error("MySQL Connection Error:");
        console.error("Code:", error.code);
        console.error("Message:", error.message);
        console.error("Host:", process.env.MYSQLHOST);
        console.error("Port:", process.env.MYSQLPORT);
        console.error("Database:", process.env.MYSQLDATABASE);
        console.error("User:", process.env.MYSQLUSER);
    }
};

testConnection();

module.exports = pool;