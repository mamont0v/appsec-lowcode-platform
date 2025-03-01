"use client"; // Клиентский компонент

import React, { useEffect, useState } from "react";
import MCQ from "@/components/quiz/mcq";

type Question = {
  id: string;
  question: string;
  options: string[];
};

type GameData = {
  id: string;
  userId: string;
  topicId: string;
  timeStarted: Date;
  timeEnded: Date | null;
  score: number;
  questions: Question[];
};

type Props = {
  initialGameData: GameData;
};

const MCQClient = ({ initialGameData }: Props) => {
  const [game, setGame] = useState<GameData>(initialGameData);

  useEffect(() => {
    // Здесь можно добавить логику для клиента при изменении состояния
  }, [game]);

  return <MCQ game={game} />;
};

export default MCQClient;