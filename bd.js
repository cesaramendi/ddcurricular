const mysql = require('mysql');
const util = require('util');


const pool = mysql.createPool({
  connectionLimit: 1000,
  host: 'www.db4free.net',
  user: 'aramendi',
  port: 3307,
  password: '22552994',
  database: 'interoperables',
})

// const pool = mysql.createPool({
//   connectionLimit: 1000,
//   host: 'localhost',
//   user: 'root',
//   port: '',
//   password: '',
//   database: 'interoperables',
// })

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.')
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.')
    }
  }
  if (connection) connection.release()
  return
})

pool.query = util.promisify(pool.query);

module.exports = pool;
