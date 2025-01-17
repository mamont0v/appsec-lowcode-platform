const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Создаем топики
  const topic1 = await prisma.topic.create({
    data: {
      id: "topic1",
      name: "CEHv11",
      category: "Ethical Hacking",
      version: 1,
      description: "Certified Ethical Hacker v11 Exam"
    },
  });

  const topic2 = await prisma.topic.create({
    data: {
      id: "topic2",
      name: "OSCP",
      category: "Penetration Testing",
      version: 1,
      description: "Offensive Security Certified Professional Exam"
    },
  });

  // Создаем вопросы
  const question1 = await prisma.questions.create({
    data: {
      id: "question1",
      question: "What is the default port for HTTP?",
      answer: "80",
      topicId: topic1.id,
      options: ["80", "443", "22", "8080"]
    },
  });

  const question2 = await prisma.questions.create({
    data: {
      id: "question2",
      question: "What is the key difference between symmetric and asymmetric encryption?",
      answer: "Key usage",
      topicId: topic1.id,
      options: [
        "Encryption speed",
        "Key usage",
        "Algorithm complexity",
        "Resource requirements"
      ]
    },
  });

  const question3 = await prisma.questions.create({
    data: {
      id: "question3",
      question: "Which tool is primarily used for buffer overflow exploitation?",
      answer: "Metasploit",
      topicId: topic2.id,
      options: ["Metasploit", "Wireshark", "Burp Suite", "Nmap"]
    },
  });

  // Создаем игру
  const game1 = await prisma.game.create({
    data: {
      id: "game1",
      userId: "user1", // Убедитесь, что user1 существует
      topicId: topic1.id,
      timeStarted: new Date("2024-11-15T10:00:00.000Z"),
      timeEnded: new Date("2024-11-15T10:30:00.000Z"),
      score: 3,
    },
  });

  // Связь вопросов с игрой
  await prisma.gameQuestion.createMany({
    data: [
      {
        id: "gameQuestion1",
        gameId: game1.id,
        questionId: question1.id,
      },
      {
        id: "gameQuestion2",
        gameId: game1.id,
        questionId: question2.id,
      },
    ],
  });

  // Создаем topicCount
  await prisma.topicCount.createMany({
    data: [
      { id: "count1", topic: topic1.id, count: 10 },
      { id: "count2", topic: topic2.id, count: 5 },
    ],
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
