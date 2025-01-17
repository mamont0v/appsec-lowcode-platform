"use client";
import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type QuestionWithUserAnswer = {
  id: string;
  question: string;
  options: string[];
  answer: string;
  userAnswer: string | null; // Ответ пользователя
  isCorrect: boolean | null; // Показывает, был ли ответ верным
};

type Props = {
  questions: QuestionWithUserAnswer[];
};

const QuestionsList = ({ questions }: Props) => {
  return (
    <Table className="mt-4">
      <TableCaption>Конец списка</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[10px]">№</TableHead>
          <TableHead>Вопрос & Правильный ответ </TableHead>
          <TableHead>Ваш ответ</TableHead>
          <TableHead className="text-right">Правильность</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map(({ question, answer, userAnswer, isCorrect }, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>
              {question} <br />
              <span className="font-semibold black">Правильный ответ: {answer}</span>
            </TableCell>
            <TableCell className="font-semibold">{userAnswer || "No Answer"}</TableCell>
            <TableCell
              className={`text-right font-semibold ${
                isCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {isCorrect ? "Правильно" : "Неправильно"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default QuestionsList;
