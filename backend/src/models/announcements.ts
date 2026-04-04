import { query } from '../database/connection.js';

export async function createAnnouncement(
  building_id: string,
  title: string,
  content: string,
  created_by: string
) {
  const result = await query(
    `INSERT INTO announcements (building_id, title, content, created_by)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [building_id, title, content, created_by]
  );
  return result.rows[0];
}

export async function getAnnouncement(id: string) {
  const result = await query(
    `SELECT a.*, b.name as building_name
     FROM announcements a
     JOIN buildings b ON a.building_id = b.id
     WHERE a.id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function listAnnouncementsByBuilding(building_id: string, limit = 50, offset = 0) {
  const result = await query(
    `SELECT * FROM announcements 
     WHERE building_id = $1 
     ORDER BY created_at DESC 
     LIMIT $2 OFFSET $3`,
    [building_id, limit, offset]
  );
  const countResult = await query(
    `SELECT COUNT(*) FROM announcements WHERE building_id = $1`,
    [building_id]
  );
  return {
    announcements: result.rows,
    total: parseInt(countResult.rows[0].count),
  };
}

const ALLOWED_ANNOUNCEMENT_FIELDS = ['title', 'content'];

export async function updateAnnouncement(id: string, updates: any) {
  const fields = [];
  const values: any[] = [];
  let paramNum = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && ALLOWED_ANNOUNCEMENT_FIELDS.includes(key)) {
      fields.push(`${key} = $${paramNum}`);
      values.push(value);
      paramNum++;
    }
  });

  values.push(id);
  fields.push(`updated_at = NOW()`);

  if (fields.length === 1) {
    return getAnnouncement(id);
  }

  const result = await query(
    `UPDATE announcements SET ${fields.join(', ')} WHERE id = $${paramNum} RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function deleteAnnouncement(id: string) {
  const result = await query(
    `DELETE FROM announcements WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}
