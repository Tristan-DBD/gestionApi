import bcrypt from 'bcrypt'
import prisma from '../config/db'
import jwt from 'jsonwebtoken'

export const authService = {
  async login(name: string, pin: string) {
    const user = await prisma.teams.findUnique({
      where: {
        name,
      },
    })
    if (!user) {
      return { success: false, status: 404, message: 'Team not found' }
    }
    const isPasswordValid = await bcrypt.compare(pin, user.pin_hash)
    if (!isPasswordValid) {
      return { success: false, status: 401, message: 'Invalid password' }
    }
    const token = jwt.sign({ id: user.uuid }, process.env.JWT_SECRET!, { expiresIn: '1h' })
    return { success: true, status: 200, data: token }
  },
}
