import { Request, Response } from 'express';
import * as announcementsModel from '../models/announcements.js';

export async function createAnnouncement(req: Request, res: Response): Promise<void> {
  try {
    if (!['ADMIN', 'MANAGER'].includes(req.user?.role || '')) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { building_id, title, content } = req.body;

    if (!building_id || !title || !content) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const announcement = await announcementsModel.createAnnouncement(
      building_id,
      title,
      content,
      req.user!.sub
    );
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create announcement' });
  }
}

export async function getAnnouncement(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const announcement = await announcementsModel.getAnnouncement(id);

    if (!announcement) {
      res.status(404).json({ error: 'Announcement not found' });
      return;
    }

    res.json(announcement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcement' });
  }
}

export async function listAnnouncementsByBuilding(req: Request, res: Response): Promise<void> {
  try {
    const { building_id } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const { announcements, total } = await announcementsModel.listAnnouncementsByBuilding(
      building_id,
      limit,
      offset
    );

    res.json({
      announcements,
      pagination: {
        limit,
        offset,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list announcements' });
  }
}

export async function updateAnnouncement(req: Request, res: Response): Promise<void> {
  try {
    if (!['ADMIN', 'MANAGER'].includes(req.user?.role || '')) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const updates = req.body;

    const announcement = await announcementsModel.getAnnouncement(id);
    if (!announcement) {
      res.status(404).json({ error: 'Announcement not found' });
      return;
    }

    const updated = await announcementsModel.updateAnnouncement(id, updates);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update announcement' });
  }
}

export async function deleteAnnouncement(req: Request, res: Response): Promise<void> {
  try {
    if (!['ADMIN', 'MANAGER'].includes(req.user?.role || '')) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const announcement = await announcementsModel.getAnnouncement(id);
    if (!announcement) {
      res.status(404).json({ error: 'Announcement not found' });
      return;
    }

    await announcementsModel.deleteAnnouncement(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
}
