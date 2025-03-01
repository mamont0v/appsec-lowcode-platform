#!/bin/bash

# Установка зависимостей
npm i --legacy-peer-deps

# Сборка проекта
npm run build

# Создание необходимых директорий
mkdir -p .next/standalone/public

# Копирование статических файлов
cp -R public/* .next/standalone/public/
cp -R .next/static .next/standalone/.next/static

# Запуск приложения через PM2
pm2 start node .next/standalone/server.js --name "appsec"
