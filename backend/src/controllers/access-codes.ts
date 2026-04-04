import { Request, Response } from 'express';
import * as accessCodesModel from '../models/access-codes.js';

export async function createAccessCode(req: Request, res: Response): Promise<void> {
  try {
    if (!['ADMIN', 'MANAGER'].includes(req.user?.role || '')) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { unit_id, code, qr_code, expires_at } = req.body;

    if (!unit_id || !code) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const accessCode = await accessCodesModel.createAccessCode(
      unit_id,
      code,
      req.user!.sub,
      qr_code,
      expires_at
    );
    res.status(201).json(accessCode);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create access code' });
  }
}

export async function getAccessCode(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const accessCode = await accessCodesModel.getAccessCode(id);

    if (!accessCode) {
      res.status(404).json({ error: 'Access code not found' });
      return;
    }

    res.json(accessCode);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch access code' });
  }
}

export async function verifyAccessCode(req: Request, res: Response): Promise<void> {
  try {
    const { code } = req.body;

    if (!code) {
      res.status(400).json({ error: 'Code is required' });
      return;
    }

    const accessCode = await accessCodesModel.getAccessCodeByCode(code);

    if (!accessCode) {
      res.status(404).json({ error: 'Invalid or expired access code' });
      return;
    }

    res.json({
      valid: true,
      access_code: accessCode,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify access code' });
  }
}

export async function listAccessCodesByUnit(req: Request, res: Response): Promise<void> {
  try {
    const { unit_id } = req.params;
    const codes = await accessCodesModel.listAccessCodesByUnit(unit_id);

    res.json({ codes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list access codes' });
  }
}

export async function listAccessCodesByBuilding(req: Request, res: Response): Promise<void> {
  try {
    if (!['ADMIN', 'MANAGER'].includes(req.user?.role || '')) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { building_id } = req.params;
    const codes = await accessCodesModel.listAccessCodesByBuilding(building_id);

    res.json({ codes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list access codes' });
  }
}

export async function expireAccessCode(req: Request, res: Response): Promise<void> {
  try {
    if (!['ADMIN', 'MANAGER'].includes(req.user?.role || '')) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const accessCode = await accessCodesModel.getAccessCode(id);
    if (!accessCode) {
      res.status(404).json({ error: 'Access code not found' });
      return;
    }

    const updated = await accessCodesModel.expireAccessCode(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to expire access code' });
  }
}

export async function deleteAccessCode(req: Request, res: Response): Promise<void> {
  try {
    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const accessCode = await accessCodesModel.getAccessCode(id);
    if (!accessCode) {
      res.status(404).json({ error: 'Access code not found' });
      return;
    }

    await accessCodesModel.deleteAccessCode(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete access code' });
  }
}
