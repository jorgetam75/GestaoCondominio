import { query } from '../database/connection.js';

export async function createComplaint(
  unit_id: string,
  description: string,
  created_by: string
) {
  const result = await query(
    `INSERT INTO complaints (unit_id, description, created_by, status)
     VALUES ($1, $2, $3, 'open')
     RETURNING *`,
    [unit_id, description, created_by]
  );
  return result.rows[0];
}

export async function getComplaint(id: string) {
  const result = await query(
    `SELECT c.*, u.unit_number, u.floor, b.name as building_name
     FROM complaints c
     JOIN units u ON c.unit_id = u.id
     JOIN buildings b ON u.building_id = b.id
     WHERE c.id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function listComplaintsByUnit(unit_id: string, limit = 50, offset = 0) {
  const result = await query(
    `SELECT * FROM complaints 
     WHERE unit_id = $1 
     ORDER BY created_at DESC 
     LIMIT $2 OFFSET $3`,
    [unit_id, limit, offset]
  );
  const countResult = await query(
    `SELECT COUNT(*) FROM complaints WHERE unit_id = $1`,
    [unit_id]
  );
  return {
    complaints: result.rows,
    total: parseInt(countResult.rows[0].count),
  };
}

export async function listComplaintsByBuilding(building_id: string, status?: string, limit = 50, offset = 0) {
  let whereClause = 'WHERE u.building_id = $1';
  let params: any[] = [building_id];
  let paramNum = 2;

  if (status) {
    whereClause += ` AND c.status = $${paramNum}`;
    params.push(status);
    paramNum++;
  }

  const result = await query(
    `SELECT c.*, u.unit_number, u.floor
     FROM complaints c
     JOIN units u ON c.unit_id = u.id
     ${whereClause}
     ORDER BY c.created_at DESC
     LIMIT $${paramNum} OFFSET $${paramNum + 1}`,
    [...params, limit, offset]
  );

  const countResult = await query(
    `SELECT COUNT(*) FROM complaints c
     JOIN units u ON c.unit_id = u.id
     ${whereClause}`,
    params
  );

  return {
    complaints: result.rows,
    total: parseInt(countResult.rows[0].count),
  };
}

const ALLOWED_COMPLAINT_FIELDS = ['description', 'status', 'assigned_to'];

export async function updateComplaint(id: string, updates: any) {
  const fields = [];
  const values: any[] = [];
  let paramNum = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && ALLOWED_COMPLAINT_FIELDS.includes(key)) {
      if ((key === 'status' && value === 'resolved') || value === 'closed') {
        fields.push(`${key} = $${paramNum}`);
        fields.push(`resolved_at = NOW()`);
        values.push(value);
        paramNum++;
      } else {
        fields.push(`${key} = $${paramNum}`);
        values.push(value);
        paramNum++;
      }
    }
  });

  values.push(id);
  fields.push(`updated_at = NOW()`);

  if (fields.length === 1) {
    return getComplaint(id);
  }

  const result = await query(
    `UPDATE complaints SET ${fields.join(', ')} WHERE id = $${paramNum} RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function deleteComplaint(id: string) {
  const result = await query(
    `DELETE FROM complaints WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}
