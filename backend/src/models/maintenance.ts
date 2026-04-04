import { query } from '../database/connection.js';

export async function createMaintenanceRequest(
  unit_id: string,
  description: string,
  priority: string,
  created_by: string
) {
  const result = await query(
    `INSERT INTO maintenance_requests (unit_id, description, priority, created_by, status)
     VALUES ($1, $2, $3, $4, 'pending')
     RETURNING *`,
    [unit_id, description, priority, created_by]
  );
  return result.rows[0];
}

export async function getMaintenanceRequest(id: string) {
  const result = await query(
    `SELECT m.*, u.unit_number, u.floor, b.name as building_name
     FROM maintenance_requests m
     JOIN units u ON m.unit_id = u.id
     JOIN buildings b ON u.building_id = b.id
     WHERE m.id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function listMaintenanceByUnit(unit_id: string, limit = 50, offset = 0) {
  const result = await query(
    `SELECT * FROM maintenance_requests 
     WHERE unit_id = $1 
     ORDER BY created_at DESC 
     LIMIT $2 OFFSET $3`,
    [unit_id, limit, offset]
  );
  const countResult = await query(
    `SELECT COUNT(*) FROM maintenance_requests WHERE unit_id = $1`,
    [unit_id]
  );
  return {
    requests: result.rows,
    total: parseInt(countResult.rows[0].count),
  };
}

export async function listMaintenanceByBuilding(building_id: string, status?: string, limit = 50, offset = 0) {
  let whereClause = 'WHERE u.building_id = $1';
  let params: any[] = [building_id];
  let paramNum = 2;

  if (status) {
    whereClause += ` AND m.status = $${paramNum}`;
    params.push(status);
    paramNum++;
  }

  const result = await query(
    `SELECT m.*, u.unit_number, u.floor
     FROM maintenance_requests m
     JOIN units u ON m.unit_id = u.id
     ${whereClause}
     ORDER BY m.priority DESC, m.created_at DESC
     LIMIT $${paramNum} OFFSET $${paramNum + 1}`,
    [...params, limit, offset]
  );

  const countResult = await query(
    `SELECT COUNT(*) FROM maintenance_requests m
     JOIN units u ON m.unit_id = u.id
     ${whereClause}`,
    params
  );

  return {
    requests: result.rows,
    total: parseInt(countResult.rows[0].count),
  };
}

const ALLOWED_MAINTENANCE_FIELDS = ['description', 'status', 'priority', 'assigned_to'];

export async function updateMaintenanceRequest(id: string, updates: any) {
  const fields = [];
  const values: any[] = [];
  let paramNum = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && ALLOWED_MAINTENANCE_FIELDS.includes(key)) {
      if (key === 'status' && value === 'completed') {
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
    return getMaintenanceRequest(id);
  }

  const result = await query(
    `UPDATE maintenance_requests SET ${fields.join(', ')} WHERE id = $${paramNum} RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function deleteMaintenanceRequest(id: string) {
  const result = await query(
    `DELETE FROM maintenance_requests WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

export async function getBuildingMaintenanceStats(building_id: string) {
  const result = await query(
    `SELECT 
       COUNT(*) FILTER (WHERE status = 'pending') as pending,
       COUNT(*) FILTER (WHERE status = 'assigned') as assigned,
       COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
       COUNT(*) FILTER (WHERE status = 'completed') as completed,
       COUNT(*) as total
     FROM maintenance_requests m
     JOIN units u ON m.unit_id = u.id
     WHERE u.building_id = $1`,
    [building_id]
  );
  return result.rows[0];
}
