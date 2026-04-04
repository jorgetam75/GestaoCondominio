import { query } from '../database/connection.js';

export async function createFinancialRecord(
  unit_id: string,
  description: string,
  amount: number,
  type: string,
  created_by: string,
  due_date?: string,
  paid_date?: string
) {
  const result = await query(
    `INSERT INTO financial_records (unit_id, description, amount, type, due_date, paid_date, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [unit_id, description, amount, type, due_date, paid_date, created_by]
  );
  return result.rows[0];
}

export async function getFinancialRecord(id: string) {
  const result = await query(
    `SELECT f.*, u.unit_number, b.name as building_name
     FROM financial_records f
     JOIN units u ON f.unit_id = u.id
     JOIN buildings b ON u.building_id = b.id
     WHERE f.id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function listFinancialByUnit(unit_id: string, limit = 50, offset = 0) {
  const result = await query(
    `SELECT * FROM financial_records WHERE unit_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [unit_id, limit, offset]
  );
  const countResult = await query(
    `SELECT COUNT(*) FROM financial_records WHERE unit_id = $1`,
    [unit_id]
  );
  return {
    records: result.rows,
    total: parseInt(countResult.rows[0].count),
  };
}

export async function listFinancialByBuilding(building_id: string, limit = 100, offset = 0) {
  const result = await query(
    `SELECT f.*, u.unit_number
     FROM financial_records f
     JOIN units u ON f.unit_id = u.id
     WHERE u.building_id = $1
     ORDER BY f.created_at DESC
     LIMIT $2 OFFSET $3`,
    [building_id, limit, offset]
  );
  const countResult = await query(
    `SELECT COUNT(*) FROM financial_records f
     JOIN units u ON f.unit_id = u.id
     WHERE u.building_id = $1`,
    [building_id]
  );
  return {
    records: result.rows,
    total: parseInt(countResult.rows[0].count),
  };
}

export async function updateFinancialRecord(id: string, updates: any) {
  const fields = [];
  const values: any[] = [];
  let paramNum = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && !['id', 'unit_id', 'created_by'].includes(key)) {
      fields.push(`${key} = $${paramNum}`);
      values.push(value);
      paramNum++;
    }
  });

  values.push(id);
  fields.push(`updated_at = NOW()`);

  if (fields.length === 1) {
    return getFinancialRecord(id);
  }

  const result = await query(
    `UPDATE financial_records SET ${fields.join(', ')} WHERE id = $${paramNum} RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function getBuildingFinancialReport(building_id: string) {
  const result = await query(
    `SELECT 
       SUM(CASE WHEN type = 'invoice' AND paid_date IS NULL THEN amount ELSE 0 END) as outstanding,
       SUM(CASE WHEN type = 'invoice' AND paid_date IS NOT NULL THEN amount ELSE 0 END) as paid,
       SUM(CASE WHEN type = 'invoice' AND paid_date IS NULL AND due_date < NOW() THEN amount ELSE 0 END) as overdue,
       COUNT(*) as total_records
     FROM financial_records f
     JOIN units u ON f.unit_id = u.id
     WHERE u.building_id = $1`,
    [building_id]
  );
  return result.rows[0];
}

export async function deleteFinancialRecord(id: string) {
  const result = await query(
    `DELETE FROM financial_records WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}
