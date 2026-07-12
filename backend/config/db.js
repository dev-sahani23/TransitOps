const { PrismaClient } = require('@prisma/client');

// Use a singleton instance in development to prevent too many connections
// during hot-reloading (if any) or module re-evaluations.
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

module.exports = prisma;
