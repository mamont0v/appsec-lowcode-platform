const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.questions.create({
    data: {
      question: "Which tool is primarily used for buffer overflow exploitation?",
      answer: "Metasploit",
      topicId: "cm3mxlja5000014478mio6tiy",
      options: ["Metasploit", "Wireshark", "Burp Suite", "Nmap"]
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
