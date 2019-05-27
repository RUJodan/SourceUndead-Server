import { Pool } from 'pg';
import logger from 'winston';
import settings from './settings';

// create config object
const dbConfig = {
  host: settings.PGHOST,
  user: settings.PGUSER,
  password: settings.PGPASSWORD,
  database: settings.PGDATABASE,
};

// create db connection pool
const pool = new Pool(dbConfig);
/*
  Function to take in a basic SQL query, and return results if it's a select
  @param sql string to run query
 */
async function query(sql, params) {
  let results;

  try {
    results = await pool.query(sql, params);
  } catch (error) {
    logger.error(`PG Query failed: ${error}`);
  }

  return results;
}

// export db methods for use
export default query;
