import MCQ from "@/components/MCQ";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    gameId: string;
  };
};

const MCQPage = async ({ params }: Props) => {
 
  // check auth
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  const { gameId } = await params;

  // Найти игру и связанные вопросы
  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      gameQuestion: {
        include: {
          question: {
            select: {
              id: true,
              question: true,
              options: true,
              topic: true
            },
          },
        },
      },
    },
  });

  if (!game) {
    return redirect("/quiz");
  }

  // Преобразовать данные в ожидаемый формат
  const transformedGame = {
    id: game.id,
    userId: session.user.id,  // Пример: используется текущий пользователь
    topicId: game.topicId,
    timeStarted: game.timeStarted,
    timeEnded: game.timeEnded || null,
    score: game.score || 0,
    questions: game.gameQuestion.map((gq) => ({
      id: gq.question.id,
      question: gq.question.question,
      options: gq.question.options,
    })),
  };

  return <MCQ game={transformedGame} />;
};

export default MCQPage;
