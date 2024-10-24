const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function connectPrisma() {
  try {
    await prisma.$connect();
    console.log('connected to db');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

connectPrisma();

module.exports = prisma;
