import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { OAuth2Client } from 'google-auth-library'
import User from '../models/User'
import Settings from '../models/Settings'
import { generateToken } from '../middleware/auth'
import { AuthRequest } from '../middleware/auth'

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body
    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(400).json({ message: 'User already exists' })
    }
    const salt = await bcrypt.genSalt(12)
    const hashed = await bcrypt.hash(password, salt)
    const user = await User.create({ email, password: hashed, name, role: 'user' })
    await Settings.create({ userId: user._id })
    const token = generateToken(user._id.toString())
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const token = generateToken(user._id.toString())
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    if (!payload || !payload.email) {
      return res.status(400).json({ message: 'Invalid Google token' })
    }
    let user = await User.findOne({ googleId: payload.sub })
    if (!user) {
      user = await User.findOne({ email: payload.email })
      if (user) {
        user.googleId = payload.sub
        user.avatar = payload.picture
        await user.save()
      } else {
        user = await User.create({
          email: payload.email,
          name: payload.name || 'User',
          avatar: payload.picture,
          googleId: payload.sub,
          role: 'user',
        })
        await Settings.create({ userId: user._id })
      }
    }
    const token = generateToken(user._id.toString())
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const guestLogin = async (_req: Request, res: Response) => {
  try {
    const guestId = `guest_${Date.now()}`
    const user = await User.create({
      name: `Guest_${guestId.slice(-6)}`,
      role: 'guest',
    })
    await Settings.create({ userId: user._id })
    const token = generateToken(user._id.toString())
    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role },
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user
    res.json({
      user: {
        id: user!._id,
        name: user!.name,
        email: user!.email,
        role: user!.role,
        avatar: user!.avatar,
        preferences: user!.preferences,
      },
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, preferences } = req.body
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { ...(name && { name }), ...(preferences && { preferences }) },
      { new: true }
    )
    res.json({
      user: {
        id: user!._id,
        name: user!.name,
        email: user!.email,
        role: user!.role,
        avatar: user!.avatar,
        preferences: user!.preferences,
      },
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
