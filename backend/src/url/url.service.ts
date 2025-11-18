import { Injectable } from '@nestjs/common';
import { pool } from '../db/pool';
import { generateShortCode } from '../utils/codeGenerator';

@Injectable()
export class UrlService {
  async createShortUrl(
    originalUrl: string,
    customAlias?: string,
    expiresAt?: string | null,
    allowDuplicates = false,
  ) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      if (!allowDuplicates && !customAlias) {
        const existing = await client.query(
          `SELECT * FROM short_urls
           WHERE original_url = $1
             AND (expires_at IS NULL OR expires_at > NOW())
           LIMIT 1`,
          [originalUrl],
        );
        if (existing.rows.length > 0) {
          await client.query('COMMIT');
          return existing.rows[0];
        }
      }

      let shortCode = customAlias || generateShortCode();
      let inserted: any;

      while (true) {
        try {
          const result = await client.query(
            `INSERT INTO short_urls
                (short_code, original_url, custom_alias, expires_at, allow_duplicates)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [shortCode, originalUrl, !!customAlias, expiresAt || null, allowDuplicates],
          );
          inserted = result.rows[0];
          break;
        } catch (e: any) {
          if (e.code === '23505' && !customAlias) {
            shortCode = generateShortCode();
            continue;
          }
          throw e;
        }
      }

      await client.query('COMMIT');
      return inserted;
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error in UrlService.createShortUrl:', err);
      throw err;
    } finally {
      client.release();
    }
  }

  async getByShortCode(shortCode: string) {
    const result = await pool.query(
      `SELECT * FROM short_urls
       WHERE short_code = $1
         AND (expires_at IS NULL OR expires_at > NOW())
       LIMIT 1`,
      [shortCode],
    );
    return result.rows[0] || null;
  }

  async registerHit(shortUrlId: number, meta: { referrer?: string; userAgent?: string; ip?: string }) {
    await pool.query(
      `INSERT INTO url_hits (short_url_id, referrer, user_agent, ip)
       VALUES ($1, $2, $3, $4)`,
      [shortUrlId, meta.referrer || null, meta.userAgent || null, meta.ip || null],
    );
    await pool.query(
      `UPDATE short_urls
         SET total_hits = total_hits + 1,
             last_hit_at = NOW()
       WHERE id = $1`,
      [shortUrlId],
    );
  }

  async getStats(shortCode: string) {
    const result = await pool.query(
      `SELECT short_code, original_url, created_at, expires_at, total_hits, last_hit_at
       FROM short_urls
       WHERE short_code = $1`,
      [shortCode],
    );
    return result.rows[0] || null;
  }
}
