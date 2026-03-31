const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'perpustakaan',
  password: 'postgres243',
  port: 5432,
});

module.exports = pool;