// Safe fallback client when Prisma is not installed or configured
// Allows graceful fallback to high-fidelity in-memory store
export const prisma: any = null;

export default prisma;

