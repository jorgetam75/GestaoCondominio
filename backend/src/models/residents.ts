import { query } from '../database/connection.js';

export async function createResident(
  unit_id: string,
  name: string,
  email: string,
  phone?: string,
  is_owner: boolean = false
) {
  const result = await query(
    `INSERT INTO residents (unit_id, name, email, phone, is_owner)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [unit_id, name, email, phone, is_owner]
  );
  return result.rows[0];
}

export async function getResident(id: string) {
  const result = await query(
    `SELECT r.*, u.unit_number, u.floor, u.building_id, b.name as building_name
     FROM residents r
     JOIN units u ON r.unit_id = u.id
     JOIN buildings b ON u.building_id = b.id
     WHERE r.id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function listResidentsByUnit(unit_id: string) {
  const result = await query(
    `SELECT * FROM residents WHERE unit_id = $1 ORDER BY is_owner DESC, name`,
    [unit_id]
  );
  return result.rows;
}

export async function listResidentsByBuilding(building_id: string, limit = 50, offset = 0) {
  const result = await query(
    `SELECT r.*, u.unit_number, u.floor
     FROM residents r
     JOIN units u ON r.unit_id = u.id
     WHERE u.building_id = $1
     ORDER BY r.created_at DESC
     LIMIT $2 OFFSET $3`,
    [building_id, limit, offset]
  );
  const countResult = await query(
    `SELECT COUNT(DISTINCT r.id) FROM residents r
     JOIN units u ON r.unit_id = u.id
     WHERE u.building_id = $1`,
    [building_id]
  );
  return {
    residents: result.rows,
    total: parseInt(countResult.rows[0].count),
  };
}

const ALLOWED_RESIDENT_FIELDS = ['name', 'email', 'phone', 'is_owner'];

export async function updateResident(id: string, updates: any) {
  const fields = [];
  const values: any[] = [];
  let paramNum = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && ALLOWED_RESIDENT_FIELDS.includes(key)) {
      fields.push(`${key} = $${paramNum}`);
      values.push(value);
      paramNum++;
    }
  });

  values.push(id);
  fields.push(`updated_at = NOW()`);

  if (fields.length === 1) {
    return getResident(id);
  }

  const result = await query(
    `UPDATE residents SET ${fields.join(', ')} WHERE id = $${paramNum} RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function deleteResident(id: string) {
  const result = await query(
    `DELETE FROM residents WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

export async function getResidentByEmail(email: string) {
  const result = await query(
    `SELECT * FROM residents WHERE email = $1`,
    [email]
  );
  return result.rows[0];
}
