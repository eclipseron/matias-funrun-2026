import mysql from 'mysql2/promise';

let pool = global._mysqlPool;

if (!pool) {
  const connectionString = process.env.DATABASE_URL;

  // mysql2 supports passing connection string directly, or an options object
  const config = connectionString 
    ? connectionString 
    : {
        host: process.env.MYSQLHOST || 'localhost',
        user: process.env.MYSQLUSER || 'root',
        password: process.env.MYSQLPASSWORD || 'root',
        database: process.env.MYSQLDATABASE || 'matias_funrun',
        port: parseInt(process.env.MYSQLPORT || '3306', 10),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      };

  pool = mysql.createPool(config);
  if (process.env.NODE_ENV !== 'production') {
    global._mysqlPool = pool;
  }
}

/**
 * Executes a parameterized SQL query against the MySQL pool.
 * Uses prepared statements (execute) to prevent SQL injection.
 * 
 * Normalizes output to match PostgreSQL structure to minimize caller changes:
 * - SELECT queries return { rows: [data], rowCount: count }
 * - INSERT/UPDATE/DELETE queries return { rows: [], rowCount: affectedRows, insertId }
 * 
 * @param {string} text - SQL query (uses '?' for parameters)
 * @param {Array} [params] - Values matching placeholders
 * @returns {Promise<{rows: Array, rowCount: number, insertId?: number}>}
 */
export async function query(text, params) {
  const start = Date.now();
  try {
    const [result] = await pool.execute(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Executed MySQL query', { duration });
    }

    if (Array.isArray(result)) {
      return { rows: result, rowCount: result.length };
    } else {
      return { 
        rows: [], 
        rowCount: result.affectedRows, 
        insertId: result.insertId 
      };
    }
  } catch (error) {
    console.error('MySQL query error:', error);
    throw error;
  }
}

export default pool;
