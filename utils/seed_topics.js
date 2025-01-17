const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Создаем топики
  await prisma.topic.create({
    data: {
      name: "CEHv11",
      category: "Ethical Hacking",
      version: 1,
      description: "Certified Ethical Hacker v11 Exam"
    },
  });

  await prisma.topic.create({
    data: {
      name: "OSCP",
      category: "Penetration Testing",
      version: 1,
      description: "Offensive Security Certified Professional Exam"
    },
  });
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
