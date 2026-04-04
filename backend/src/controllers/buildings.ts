import { Request, Response } from 'express';
import * as buildingsModel from '../models/buildings.js';

export async function createBuilding(req: Request, res: Response): Promise<void> {
  try {
    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { name, address, city, state, zip_code } = req.body;

    if (!name || !address || !city) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const building = await buildingsModel.createBuilding(name, address, city, state, zip_code);
    res.status(201).json(building);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create building' });
  }
}

export async function getBuilding(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const building = await buildingsModel.getBuildingWithStats(id);

    if (!building) {
      res.status(404).json({ error: 'Building not found' });
      return;
    }

    res.json(building);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch building' });
  }
}

export async function listBuildings(req: Request, res: Response): Promise<void> {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const { buildings, total } = await buildingsModel.listBuildings(limit, offset);

    res.json({
      buildings,
      pagination: {
        limit,
        offset,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list buildings' });
  }
}

export async function updateBuilding(req: Request, res: Response): Promise<void> {
  try {
    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const updates = req.body;

    const building = await buildingsModel.getBuilding(id);
    if (!building) {
      res.status(404).json({ error: 'Building not found' });
      return;
    }

    const updated = await buildingsModel.updateBuilding(id, updates);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update building' });
  }
}

export async function deleteBuilding(req: Request, res: Response): Promise<void> {
  try {
    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const building = await buildingsModel.getBuilding(id);
    if (!building) {
      res.status(404).json({ error: 'Building not found' });
      return;
    }

    await buildingsModel.deleteBuilding(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete building' });
  }
}
