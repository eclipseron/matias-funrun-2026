import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-matias-funrun-2026-fallback';
const COOKIE_NAME = 'admin_session';

/**
 * Signs a JWT token containing admin payload.
 * 
 * @param {Object} payload - User session data
 * @returns {string} Signed JWT token
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

/**
 * Verifies the JWT session token.
 * 
 * @param {string} token - The signed JWT token
 * @returns {Object|null} The decoded payload or null if verification fails
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Authenticates an administrator by querying their record in the database.
 * Matches passwords using bcrypt and records the last_login timestamp on success.
 * 
 * @param {string} username - Input username
 * @param {string} password - Input plain text password
 * @returns {Promise<Object|null>} Admin session details or null if auth fails
 */
export async function authenticateAdmin(username, password) {
  try {
    const sql = 'SELECT id, name, username, password FROM admins WHERE username = $1';
    const res = await query(sql, [username.trim()]);

    if (res.rowCount === 0) {
      return null;
    }

    const admin = res.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return null;
    }

    // Update last_login timestamp in database
    await query('UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [admin.id]);

    return {
      id: admin.id,
      name: admin.name,
      username: admin.username,
    };
  } catch (error) {
    console.error('Database authentication error:', error);
    throw error;
  }
}

export { COOKIE_NAME };
