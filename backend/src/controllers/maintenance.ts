import { Request, Response } from 'express';
import * as maintenanceModel from '../models/maintenance.js';

export async function createMaintenanceRequest(req: Request, res: Response): Promise<void> {
  try {
    const { unit_id, description, priority } = req.body;

    if (!unit_id || !description || !priority) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const request = await maintenanceModel.createMaintenanceRequest(
      unit_id,
      description,
      priority,
      req.user!.sub
    );
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create maintenance request' });
  }
}

export async function getMaintenanceRequest(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const request = await maintenanceModel.getMaintenanceRequest(id);

    if (!request) {
      res.status(404).json({ error: 'Maintenance request not found' });
      return;
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch maintenance request' });
  }
}

export async function listMaintenanceByUnit(req: Request, res: Response): Promise<void> {
  try {
    const { unit_id } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const { requests, total } = await maintenanceModel.listMaintenanceByUnit(unit_id, limit, offset);

    res.json({
      requests,
      pagination: {
        limit,
        offset,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list maintenance requests' });
  }
}

export async function listMaintenanceByBuilding(req: Request, res: Response): Promise<void> {
  try {
    if (!['admin', 'manager'].includes(req.user?.role || '')) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { building_id } = req.params;
    const status = req.query.status as string;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const { requests, total } = await maintenanceModel.listMaintenanceByBuilding(
      building_id,
      status,
      limit,
      offset
    );

    res.json({
      requests,
      pagination: {
        limit,
        offset,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list maintenance requests' });
  }
}

export async function updateMaintenanceRequest(req: Request, res: Response): Promise<void> {
  try {
    if (!['admin', 'manager'].includes(req.user?.role || '')) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const updates = req.body;

    const request = await maintenanceModel.getMaintenanceRequest(id);
    if (!request) {
      res.status(404).json({ error: 'Maintenance request not found' });
      return;
    }

    const updated = await maintenanceModel.updateMaintenanceRequest(id, updates);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update maintenance request' });
  }
}

export async function getMaintenanceStats(req: Request, res: Response): Promise<void> {
  try {
    if (!['admin', 'manager'].includes(req.user?.role || '')) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { building_id } = req.params;
    const stats = await maintenanceModel.getBuildingMaintenanceStats(building_id);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get maintenance stats' });
  }
}

export async function deleteMaintenanceRequest(req: Request, res: Response): Promise<void> {
  try {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const request = await maintenanceModel.getMaintenanceRequest(id);
    if (!request) {
      res.status(404).json({ error: 'Maintenance request not found' });
      return;
    }

    await maintenanceModel.deleteMaintenanceRequest(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete maintenance request' });
  }
}
