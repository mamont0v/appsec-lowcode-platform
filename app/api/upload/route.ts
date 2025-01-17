import { NextResponse } from 'next/server';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { Worker } from 'bullmq';
import { promisify } from 'util';
import { exec } from 'child_process';


const execAsync = promisify(exec);

const QUEUE_NAME = 'upload_queue';
const TEMP_DIR_BASE = 'E:/temp';


// Настройка подключения к Redis и очереди BullMQ
const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
};
const uploadQueue = new Queue(QUEUE_NAME, { connection });

// Генерация временной директории
function createDirTemp(taskId: string) {
    const tempFilePath = path.join(TEMP_DIR_BASE, taskId);
    if (!fs.existsSync(tempFilePath)) {
        fs.mkdirSync(tempFilePath, { recursive: true });
    }
    return tempFilePath;
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Генерация уникального UUID для этой задачи
        const taskId = uuidv4();
        const tempFilePath = createDirTemp(taskId);  // Создаем директорию для задачи

        const filePath = path.join(tempFilePath, file.name);

        const buffer = await file.arrayBuffer();
        await fs.promises.writeFile(filePath, Buffer.from(buffer));

        // Добавление задачи в очередь
        await uploadQueue.add(
            'processFile',
            { filePath, taskId },
            {
                removeOnComplete: true,
                removeOnFail: true
            }
        );

        return NextResponse.json({ message: 'File is being processed', taskId }, { status: 202 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}



export async function GET(req: Request, { params }: { params: { taskId: string } }) {
    const taskId = params.taskId;
    const taskTempDir = path.join(TEMP_DIR_BASE, taskId);

    // Проверка, существует ли директория задачи
    if (!fs.existsSync(taskTempDir)) {
        return NextResponse.json({ error: 'Task directory not found' }, { status: 404 });
    }

    // Поиск файлов с шаблоном report*.json
    const files = fs.readdirSync(taskTempDir).filter(file => file.startsWith('report') && file.endsWith('.json'));

    if (files.length > 0) {
        const reportFilePath = path.join(taskTempDir, files[0]);

        // Проверка, существует ли файл отчета
        if (fs.existsSync(reportFilePath)) {
            const fileStream = fs.createReadStream(reportFilePath);
            return new NextResponse(fileStream, {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Disposition': `attachment; filename="${files[0]}"`,
                },
            });
        } else {
            return NextResponse.json({ error: 'Report generation failed' }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: 'Report not found or task is still processing' }, { status: 404 });
    }
}

const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
        const { filePath, taskId } = job.data;
        const taskTempDir = path.join(TEMP_DIR_BASE, taskId);

        // Создание временной директории для задачи
        if (!fs.existsSync(taskTempDir)) {
            fs.mkdirSync(taskTempDir, { recursive: true });
        }

        // Директория для отчета
        const containerDir = path.join(taskTempDir);
        if (!fs.existsSync(containerDir)) {
            fs.mkdirSync(containerDir, { recursive: true });
        }

        // Команда для запуска контейнера
        const dockerRunCommand = `docker run --name vacuum-container-${taskId} -v "E:/temp/${taskId}:/work:rw" dshanley/vacuum report /work/${path.basename(filePath)} /work/report`;

        try {
            // Запуск контейнера
            await execAsync(dockerRunCommand);

            // Поиск файлов с шаблоном report*.json
            const files = fs.readdirSync(containerDir).filter(file => file.startsWith('report') && file.endsWith('.json'));

            // Если найден хотя бы один файл
            if (files.length > 0) {
                const generatedReportPath = path.join(containerDir, files[0]);

                // Проверка существования файла
                if (fs.existsSync(generatedReportPath)) {
                    // Копирование отчета в нужную директорию
                    const dockerCpCommand = `docker cp vacuum-container-${taskId}:/work/${files[0]} ${generatedReportPath}`;
                    await execAsync(dockerCpCommand);

                    return { taskId, reportPath: generatedReportPath };
                } else {
                    throw new Error('Report generation failed');
                }
            } else {
                throw new Error('No report file found');
            }
        } catch (error) {
            console.error(`Job ${job.id} failed with error:`, error);
            throw error;
        } finally {
            // Очистка контейнера после выполнения
            await execAsync(`docker rm vacuum-container-${taskId}`);
        }
    },
    { connection: { host: 'localhost', port: 6379 } }
);

worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, error) => {
    console.error(`Job ${job.id} failed with error:`, error);
});