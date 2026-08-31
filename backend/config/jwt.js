export const secret = process.env.JWT_SECRET || 'fallback_secret';
export const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
