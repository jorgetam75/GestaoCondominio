import { Request, Response } from 'express';
import * as residentsModel from '../models/residents.js';

export async function createResident(req: Request, res: Response): Promise<void> {
  try {
    if (!['admin', 'manager'].includes(req.user?.role || '')) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { unit_id, name, email, phone, is_owner } = req.body;

    if (!unit_id || !name || !email) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Check if email already exists
    const existing = await residentsModel.getResidentByEmail(email);
    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const resident = await residentsModel.createResident(unit_id, name, email, phone, is_owner);
    res.status(201).json(resident);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create resident' });
  }
}

export async function getResident(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const resident = await residentsModel.getResident(id);

    if (!resident) {
      res.status(404).json({ error: 'Resident not found' });
      return;
    }

    res.json(resident);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resident' });
  }
}

export async function listResidentsByUnit(req: Request, res: Response): Promise<void> {
  try {
    const { unit_id } = req.params;
    const residents = await residentsModel.listResidentsByUnit(unit_id);

    res.json({ residents });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list residents' });
  }
}

export async function listResidentsByBuilding(req: Request, res: Response): Promise<void> {
  try {
    const { building_id } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const { residents, total } = await residentsModel.listResidentsByBuilding(building_id, limit, offset);

    res.json({
      residents,
      pagination: {
        limit,
        offset,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list residents' });
  }
}

export async function updateResident(req: Request, res: Response): Promise<void> {
  try {
    if (!['admin', 'manager'].includes(req.user?.role || '')) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const updates = req.body;

    const resident = await residentsModel.getResident(id);
    if (!resident) {
      res.status(404).json({ error: 'Resident not found' });
      return;
    }

    const updated = await residentsModel.updateResident(id, updates);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update resident' });
  }
}

export async function deleteResident(req: Request, res: Response): Promise<void> {
  try {
    if (!['admin', 'manager'].includes(req.user?.role || '')) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const resident = await residentsModel.getResident(id);
    if (!resident) {
      res.status(404).json({ error: 'Resident not found' });
      return;
    }

    await residentsModel.deleteResident(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete resident' });
  }
}
