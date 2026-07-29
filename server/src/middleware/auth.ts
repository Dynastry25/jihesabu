import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User'

export interface AuthRequest extends Request {
  user?: IUser
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' })
  }
}

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : undefined
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
      const user = await User.findById(decoded.id)
      if (user) req.user = user
    } catch {
      // Silently fail for optional auth
    }
  }
  next()
}

export const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions)
}
