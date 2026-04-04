import { query } from '../database/connection.js';

export async function createAccessCode(
  unit_id: string,
  code: string,
  created_by: string,
  qr_code?: string,
  expires_at?: string
) {
  const result = await query(
    `INSERT INTO access_codes (unit_id, code, created_by, qr_code, expires_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [unit_id, code, created_by, qr_code, expires_at]
  );
  return result.rows[0];
}

export async function getAccessCode(id: string) {
  const result = await query(
    `SELECT a.*, u.unit_number, b.name as building_name
     FROM access_codes a
     JOIN units u ON a.unit_id = u.id
     JOIN buildings b ON u.building_id = b.id
     WHERE a.id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function getAccessCodeByCode(code: string) {
  const result = await query(
    `SELECT a.*, u.unit_number, b.name as building_name
     FROM access_codes a
     JOIN units u ON a.unit_id = u.id
     JOIN buildings b ON u.building_id = b.id
     WHERE a.code = $1
     AND (a.expires_at IS NULL OR a.expires_at > NOW())`,
    [code]
  );
  return result.rows[0];
}

export async function listAccessCodesByUnit(unit_id: string) {
  const result = await query(
    `SELECT * FROM access_codes 
     WHERE unit_id = $1 
     AND (expires_at IS NULL OR expires_at > NOW())
     ORDER BY created_at DESC`,
    [unit_id]
  );
  return result.rows;
}

export async function listAccessCodesByBuilding(building_id: string) {
  const result = await query(
    `SELECT a.* FROM access_codes a
     JOIN units u ON a.unit_id = u.id
     WHERE u.building_id = $1
     AND (a.expires_at IS NULL OR a.expires_at > NOW())
     ORDER BY a.created_at DESC`,
    [building_id]
  );
  return result.rows;
}

export async function deleteAccessCode(id: string) {
  const result = await query(
    `DELETE FROM access_codes WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

export async function expireAccessCode(id: string) {
  const result = await query(
    `UPDATE access_codes SET expires_at = NOW() WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}
