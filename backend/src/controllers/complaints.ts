import { Request, Response } from 'express';
import * as complaintsModel from '../models/complaints.js';

export async function createComplaint(req: Request, res: Response): Promise<void> {
  try {
    const { unit_id, description } = req.body;

    if (!unit_id || !description) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const complaint = await complaintsModel.createComplaint(
      unit_id,
      description,
      req.user!.sub
    );
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create complaint' });
  }
}

export async function getComplaint(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const complaint = await complaintsModel.getComplaint(id);

    if (!complaint) {
      res.status(404).json({ error: 'Complaint not found' });
      return;
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch complaint' });
  }
}

export async function listComplaintsByUnit(req: Request, res: Response): Promise<void> {
  try {
    const { unit_id } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const { complaints, total } = await complaintsModel.listComplaintsByUnit(unit_id, limit, offset);

    res.json({
      complaints,
      pagination: {
        limit,
        offset,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list complaints' });
  }
}

export async function listComplaintsByBuilding(req: Request, res: Response): Promise<void> {
  try {
    if (!['admin', 'manager'].includes(req.user?.role || '')) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { building_id } = req.params;
    const status = req.query.status as string;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const { complaints, total } = await complaintsModel.listComplaintsByBuilding(
      building_id,
      status,
      limit,
      offset
    );

    res.json({
      complaints,
      pagination: {
        limit,
        offset,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list complaints' });
  }
}

export async function updateComplaint(req: Request, res: Response): Promise<void> {
  try {
    if (!['admin', 'manager'].includes(req.user?.role || '')) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const updates = req.body;

    const complaint = await complaintsModel.getComplaint(id);
    if (!complaint) {
      res.status(404).json({ error: 'Complaint not found' });
      return;
    }

    const updated = await complaintsModel.updateComplaint(id, updates);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update complaint' });
  }
}

export async function deleteComplaint(req: Request, res: Response): Promise<void> {
  try {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const complaint = await complaintsModel.getComplaint(id);
    if (!complaint) {
      res.status(404).json({ error: 'Complaint not found' });
      return;
    }

    await complaintsModel.deleteComplaint(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete complaint' });
  }
}
