import { query } from '../database/connection.js';

export async function createUnit(
  building_id: string,
  unit_number: string,
  floor: number,
  type: string = 'apartment'
) {
  const result = await query(
    `INSERT INTO units (building_id, unit_number, floor, type)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [building_id, unit_number, floor, type]
  );
  return result.rows[0];
}

export async function getUnit(id: string) {
  const result = await query(
    `SELECT * FROM units WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function listUnitsByBuilding(building_id: string, limit = 50, offset = 0) {
  const result = await query(
    `SELECT * FROM units WHERE building_id = $1 ORDER BY floor, unit_number LIMIT $2 OFFSET $3`,
    [building_id, limit, offset]
  );
  const countResult = await query(
    `SELECT COUNT(*) FROM units WHERE building_id = $1`,
    [building_id]
  );
  return {
    units: result.rows,
    total: parseInt(countResult.rows[0].count),
  };
}

export async function updateUnit(id: string, updates: any) {
  const fields = [];
  const values: any[] = [];
  let paramNum = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && key !== 'id' && key !== 'building_id') {
      fields.push(`${key} = $${paramNum}`);
      values.push(value);
      paramNum++;
    }
  });

  values.push(id);
  fields.push(`updated_at = NOW()`);

  if (fields.length === 1) {
    return getUnit(id);
  }

  const result = await query(
    `UPDATE units SET ${fields.join(', ')} WHERE id = $${paramNum} RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function deleteUnit(id: string) {
  const result = await query(
    `DELETE FROM units WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

export async function getUnitWithResidents(id: string) {
  const unit = await getUnit(id);
  if (!unit) return null;

  const residentsResult = await query(
    `SELECT * FROM residents WHERE unit_id = $1 ORDER BY is_owner DESC, name`,
    [id]
  );

  return {
    ...unit,
    residents: residentsResult.rows,
  };
}
