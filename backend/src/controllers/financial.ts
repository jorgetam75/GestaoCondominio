import { Request, Response } from 'express';
import * as financialModel from '../models/financial.js';

export async function createFinancialRecord(req: Request, res: Response): Promise<void> {
  try {
    if (!['admin', 'manager'].includes(req.user?.role || '')) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { unit_id, description, amount, type, due_date, paid_date } = req.body;

    if (!unit_id || !description || amount === undefined || !type) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const record = await financialModel.createFinancialRecord(
      unit_id,
      description,
      amount,
      type,
      req.user!.sub,
      due_date,
      paid_date
    );
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create financial record' });
  }
}

export async function getFinancialRecord(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const record = await financialModel.getFinancialRecord(id);

    if (!record) {
      res.status(404).json({ error: 'Financial record not found' });
      return;
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch financial record' });
  }
}

export async function listFinancialByUnit(req: Request, res: Response): Promise<void> {
  try {
    const { unit_id } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const { records, total } = await financialModel.listFinancialByUnit(unit_id, limit, offset);

    res.json({
      records,
      pagination: {
        limit,
        offset,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list financial records' });
  }
}

export async function listFinancialByBuilding(req: Request, res: Response): Promise<void> {
  try {
    const { building_id } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
    const offset = parseInt(req.query.offset as string) || 0;

    const { records, total } = await financialModel.listFinancialByBuilding(building_id, limit, offset);

    res.json({
      records,
      pagination: {
        limit,
        offset,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list financial records' });
  }
}

export async function updateFinancialRecord(req: Request, res: Response): Promise<void> {
  try {
    if (!['admin', 'manager'].includes(req.user?.role || '')) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const updates = req.body;

    const record = await financialModel.getFinancialRecord(id);
    if (!record) {
      res.status(404).json({ error: 'Financial record not found' });
      return;
    }

    const updated = await financialModel.updateFinancialRecord(id, updates);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update financial record' });
  }
}

export async function getBuildingFinancialReport(req: Request, res: Response): Promise<void> {
  try {
    if (!['admin', 'manager'].includes(req.user?.role || '')) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { building_id } = req.params;
    const report = await financialModel.getBuildingFinancialReport(building_id);

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate financial report' });
  }
}

export async function deleteFinancialRecord(req: Request, res: Response): Promise<void> {
  try {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const record = await financialModel.getFinancialRecord(id);
    if (!record) {
      res.status(404).json({ error: 'Financial record not found' });
      return;
    }

    await financialModel.deleteFinancialRecord(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete financial record' });
  }
}
