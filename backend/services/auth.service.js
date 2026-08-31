import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { secret, expiresIn  } from '../config/jwt.js';

export const register = async (data) => {
  const { name, email, password, role } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email is already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'DRIVER',
    },
  });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, secret, { expiresIn });

  const { password: _, ...userWithoutPassword } = user;
  return { token, user: userWithoutPassword };
};

export const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
