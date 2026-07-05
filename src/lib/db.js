import pg from 'pg';

const { Pool } = pg;

let pool;

if (!pool) {
  const connectionString = process.env.DATABASE_URL;

  const config = connectionString 
    ? { connectionString } 
    : {
        host: process.env.PGHOST || 'localhost',
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
        database: process.env.PGDATABASE || 'matias_funrun',
        port: parseInt(process.env.PGPORT || '5432', 10),
      };

  pool = new Pool(config);
}

/**
 * Executes a parameterized SQL query against the database pool.
 * Uses prepared statements / parameters to prevent SQL injection.
 * 
 * @param {string} text - SQL query template (e.g. 'SELECT * FROM runners WHERE id = $1')
 * @param {Array} [params] - Parameters matching placeholders in query
 * @returns {Promise<pg.QueryResult>} Results of query execution
 */
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    // Optional query logging in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Executed query', { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default pool;
