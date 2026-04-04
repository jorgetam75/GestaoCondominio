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
    `SELECT * FROM buildings ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  const countResult = await query(`SELECT COUNT(*) FROM buildings`);
  return {
    buildings: result.rows,
    total: parseInt(countResult.rows[0].count),
  };
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
  const building = await getBuilding(id);
  if (!building) return null;

  const unitsResult = await query(
    `SELECT COUNT(*) FROM units WHERE building_id = $1`,
    [id]
  );

  const residentsResult = await query(
    `SELECT COUNT(DISTINCT r.id) FROM residents r
     JOIN units u ON r.unit_id = u.id
     WHERE u.building_id = $1`,
    [id]
  );

  return {
    ...building,
    unit_count: parseInt(unitsResult.rows[0].count),
    resident_count: parseInt(residentsResult.rows[0].count),
  };
}
