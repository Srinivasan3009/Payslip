const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'employee',
  connectionLimit: 5
});

module.exports = pool;
