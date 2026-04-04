import { Request, Response } from 'express';
import * as unitsModel from '../models/units.js';

export async function createUnit(req: Request, res: Response): Promise<void> {
  try {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { building_id, unit_number, floor, type } = req.body;

    if (!building_id || !unit_number || floor === undefined) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const unit = await unitsModel.createUnit(building_id, unit_number, floor, type || 'apartment');
    res.status(201).json(unit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create unit' });
  }
}

export async function getUnit(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const unit = await unitsModel.getUnitWithResidents(id);

    if (!unit) {
      res.status(404).json({ error: 'Unit not found' });
      return;
    }

    res.json(unit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unit' });
  }
}

export async function listUnitsByBuilding(req: Request, res: Response): Promise<void> {
  try {
    const { building_id } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const { units, total } = await unitsModel.listUnitsByBuilding(building_id, limit, offset);

    res.json({
      units,
      pagination: {
        limit,
        offset,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list units' });
  }
}

export async function updateUnit(req: Request, res: Response): Promise<void> {
  try {
    if (!['admin', 'manager'].includes(req.user?.role || '')) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const updates = req.body;

    const unit = await unitsModel.getUnit(id);
    if (!unit) {
      res.status(404).json({ error: 'Unit not found' });
      return;
    }

    const updated = await unitsModel.updateUnit(id, updates);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update unit' });
  }
}

export async function deleteUnit(req: Request, res: Response): Promise<void> {
  try {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const unit = await unitsModel.getUnit(id);
    if (!unit) {
      res.status(404).json({ error: 'Unit not found' });
      return;
    }

    await unitsModel.deleteUnit(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete unit' });
  }
}
