import { Request, Response } from 'express';
import { query } from '../database/connection.js';
import { config } from '../config/index.js';
import {
  verifyPassword,
  generateTokens,
  verifyToken,
} from '../services/auth.js';
import { loginBodySchema, verifyBodySchema } from '../validation/auth.js';

/**
 * Login endpoint - returns JWT access token
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const parsed = loginBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: config.isProduction ? 'Invalid request' : 'Validation failed',
        ...(config.isProduction ? {} : { details: parsed.error.flatten() }),
      });
      return;
    }
    const email = parsed.data.email.trim().toLowerCase();
    const { password } = parsed.data;

    // Find user by email
    const result = await query(
      `SELECT u.id, u.email, u.password_hash, u.role, u.is_active,
              r.id as resident_id, m.id as manager_id, a.id as admin_id
       FROM users u
       LEFT JOIN residents r ON u.resident_id = r.id
       LEFT JOIN managers m ON u.manager_id = m.id
       LEFT JOIN admins a ON u.admin_id = a.id
       WHERE u.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
      return;
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.is_active) {
      res.status(401).json({
        success: false,
        error: 'User account is inactive',
      });
      return;
    }

    // Verify password
    const passwordValid = await verifyPassword(password, user.password_hash);
    if (!passwordValid) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
      return;
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // Return user info and tokens
    res.json({
      success: true,
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          resident_id: user.resident_id,
          manager_id: user.manager_id,
          admin_id: user.admin_id,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Verify token endpoint - confirms token validity
 */
export async function verifyTokenEndpoint(req: Request, res: Response): Promise<void> {
  try {
    const bodyParsed = verifyBodySchema.safeParse(req.body ?? {});
    if (!bodyParsed.success) {
      res.status(400).json({
        success: false,
        error: config.isProduction ? 'Invalid request' : 'Validation failed',
        ...(config.isProduction ? {} : { details: bodyParsed.error.flatten() }),
      });
      return;
    }

    const token =
      req.headers.authorization?.split(' ')[1] || bodyParsed.data.token;

    if (!token) {
      res.status(400).json({
        success: false,
        error: 'No token provided',
      });
      return;
    }

    const payload = verifyToken(token);

    if (!payload) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        valid: true,
        user: {
          id: payload.sub,
          email: payload.email,
          role: payload.role,
        },
      },
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Logout endpoint
 * Note: JWT is stateless, so logout is mainly a frontend operation
 * This endpoint can be used for logging/audit purposes
 */
export async function logout(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.sub;

    if (userId) {
      // Log the logout action
      await query(
        `INSERT INTO activity_logs (user_id, action, entity_type)
         VALUES ($1, $2, $3)`,
        [userId, 'logout', 'user']
      );
    }

    res.json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Get current user from token
 */
export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
      return;
    }

    // Query full user details in case data has changed
    const result = await query(
      `SELECT u.id, u.email, u.role, u.is_active,
              a.name as admin_name, m.name as manager_name, r.name as resident_name,
              m.building_id, r.unit_id
       FROM users u
       LEFT JOIN admins a ON u.admin_id = a.id
       LEFT JOIN managers m ON u.manager_id = m.id
       LEFT JOIN residents r ON u.resident_id = r.id
       WHERE u.id = $1`,
      [req.user.sub]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    const user = result.rows[0];

    if (!user.is_active) {
      res.status(401).json({
        success: false,
        error: 'User account is inactive',
      });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
