const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');
const winston = require('winston');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Настройка логгера
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

app.post('/process', async (req, res) => {
  try {
    // Ваша обработка HTTP запроса
    const result = await processRequest(req.body);

    // Отправка задания в RabbitMQ
    await sendMessageToQueue(result);

    // Ответ клиенту
    res.json({ status: 'Task accepted for processing' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function processRequest(data) {
  // Ваша обработка данных
  // Например, асинхронный запрос к базе данных
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data.input * 2);
    }, 0);
  });
}

async function sendMessageToQueue(message) {
  const queueName = 'tasks';
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName);
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify({ result: message })));
}

app.listen(port, () => {
  logger.info(`M1 listening at http://localhost:${port}`);
});
