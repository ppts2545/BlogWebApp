
const mysql = require('mysql2')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Po13166m',
    database: 'Blog_db'
})

connection.connect((err) => {
    if (err) throw err;
    console.log('✅ Connected to MySQL database')
});

module.exports = connection;