import { PrismaClient } from "@prisma/client";

declare var global: { prisma?: PrismaClient };

const prisma: PrismaClient = (() => {
  if (process.env.NODE_ENV == "production") {
    return new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }

    return global.prisma;
  }
})();

export default prisma;
