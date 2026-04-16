import { query } from '../database/connection.js';

export async function createBuilding(
  name: string,
  address: string,
  city: string,
  state?: string,
  zip_code?: string
) {
  const result = await query(
    `INSERT INTO buildings (name, address, city, state, zip_code)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, address, city, state, zip_code]
  );
  return result.rows[0];
}

export async function getBuilding(id: string) {
  const result = await query(
    `SELECT * FROM buildings WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function listBuildings(limit = 50, offset = 0) {
  const result = await query(
    `SELECT *, COUNT(*) OVER() AS __total
     FROM buildings
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  const total =
    result.rows.length > 0 ? parseInt(String(result.rows[0].__total), 10) : 0;
  const buildings = result.rows.map((row: Record<string, unknown>) => {
    const { __total, ...rest } = row;
    return rest;
  });
  return { buildings, total };
}

const ALLOWED_BUILDING_FIELDS = ['name', 'address', 'city', 'state', 'zip_code'];

export async function updateBuilding(id: string, updates: any) {
  const fields = [];
  const values: any[] = [];
  let paramNum = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && ALLOWED_BUILDING_FIELDS.includes(key)) {
      fields.push(`${key} = $${paramNum}`);
      values.push(value);
      paramNum++;
    }
  });

  values.push(id);
  fields.push(`updated_at = NOW()`);

  if (fields.length === 1) {
    return getBuilding(id);
  }

  const result = await query(
    `UPDATE buildings SET ${fields.join(', ')} WHERE id = $${paramNum} RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function deleteBuilding(id: string) {
  const result = await query(
    `DELETE FROM buildings WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

export async function getBuildingWithStats(id: string) {
  const result = await query(
    `SELECT b.*,
 (SELECT COUNT(*)::text FROM units u WHERE u.building_id = b.id) AS unit_count,
       (SELECT COUNT(DISTINCT r.id)::text FROM residents r
        JOIN units u ON r.unit_id = u.id
        WHERE u.building_id = b.id) AS resident_count
     FROM buildings b
     WHERE b.id = $1`,
    [id]
  );
  const row = result.rows[0];
  if (!row) return null;

  return {
    ...row,
    unit_count: parseInt(String(row.unit_count), 10),
    resident_count: parseInt(String(row.resident_count), 10),
  };
}
