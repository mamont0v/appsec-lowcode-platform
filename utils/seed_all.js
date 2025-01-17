const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Чтение файла formatted_questions.json
    const fileData = fs.readFileSync('formatted_questions.json', 'utf8');

    // Парсинг данных
    const jsonData = JSON.parse(fileData);

    // Проверка структуры данных
    if (!jsonData.data || !Array.isArray(jsonData.data)) {
      throw new Error('Неправильная структура JSON файла');
    }

    // Вставка данных в базу Prisma
    for (const question of jsonData.data) {
      await prisma.questions.create({
        data: {
          question: question.question,
          answer: question.answer,
          topicId: question.topicId,
          options: question.options,
        },
      });
      console.log(`Вопрос "${question.question}" успешно добавлен.`);
    }

    console.log('Все вопросы успешно добавлены.');
  } catch (error) {
    console.error('Ошибка при обработке:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
