import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const TEMP_DIR_BASE = 'E:/temp';  // Замените на ваш путь

export async function GET(req: Request, { params }: { params: { taskId: string } }) {
    try {
        const { taskId } = await params;

        if (!taskId) {
            return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
        }

        // Формируем путь, используя taskId
        const taskTempDir = path.join(TEMP_DIR_BASE, taskId);

        // Проверка, существует ли директория задачи
        if (!fs.existsSync(taskTempDir)) {
            return NextResponse.json({ error: 'Task directory not found' }, { status: 404 });
        }

        // Поиск файлов с шаблоном report*.json
        const files = fs.readdirSync(taskTempDir).filter(file => file.startsWith('report'));

        if (files.length === 0) {
            return NextResponse.json({ error: 'No report files found' }, { status: 404 });
        }

        // Предположим, что вы хотите отправить первый найденный файл
        const filePath = path.join(taskTempDir, files[0]);
        const fileBuffer = fs.readFileSync(filePath);

        // Отправка файла с правильными заголовками
        return new Response(fileBuffer, {
            headers: {
                'Content-Type': 'application/octet-stream',  // Указываем generic binary MIME type
                'Content-Disposition': `attachment; filename="${files[0]}"`,
            },
        });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
