# Используем официальный образ Golang для сборки
FROM golang:latest AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем утилиту
RUN go install github.com/BishopFox/sj@latest

# Используем минимальный образ для финального контейнера
FROM debian:latest

# Копируем бинарник из builder-образа
COPY --from=builder /go/bin/sj /usr/local/bin/sj

# Делаем бинарник исполняемым
RUN chmod +x /usr/local/bin/sj

# Указываем команду по умолчанию
ENTRYPOINT ["sj"]
