import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { LucideLayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import ResultsCard from "@/components/statistics/results-card";
import AccuracyCard from "@/components/statistics/accuracy-card";
import TimeTakenCard from "@/components/statistics/time-taken-card";
import QuestionsList from "@/components/statistics/questions-list";
import { auth } from "@/auth";

type Props = {
  params: {
    gameId: string;
  };
};

const Statistics = async ({ params }: Props) => {
  const { gameId } = await params;

  // check auth
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      gameQuestion: {
        include: {
          question: true, // Включаем связанные вопросы
        },
      },
    },
  });

  if (!game) {
    return redirect("/");
  }

  // Объединяем данные из `questions` и `gameQuestions`
  const questions = game.gameQuestion.map((gq) => ({
    id: gq.question.id,
    question: gq.question.question,
    options: gq.question.options,
    topicId: gq.question.topicId,
    answer: gq.question.answer,
    userAnswer: gq.userAnswer ?? null, // Добавляем userAnswer
    isCorrect: gq.isCorrect ?? null,   // Добавляем isCorrect
  }));

  const totalCorrect = questions.filter((q) => q.isCorrect).length;
  const accuracy = (totalCorrect / questions.length) * 100;

  return (
    <div className="mt-8 p-8 mx-auto max-w-7xl">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Результаты</h2>
        <div className="flex items-center space-x-2">
          <Link href="/app/quiz" className={buttonVariants()}>
            <LucideLayoutDashboard className="mr-2" />
            К списку тем
          </Link>
        </div>
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-7">
        {/* <ResultsCard accuracy={accuracy} /> */}
        <TimeTakenCard
          timeEnded={new Date(game.timeEnded ?? 0)}
          timeStarted={new Date(game.timeStarted ?? 0)}
        />
      </div>
      <QuestionsList questions={questions} />
    </div>
  );
};

export default Statistics;
