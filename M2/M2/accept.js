const amqp = require('amqplib');

const queueName = 'tasks';

async function processTask(task) {
  console.log('Processing task:', task);

  const result = task.input * 2;

  console.log('Task result:', result);
}

async function startConsumer() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName);

  channel.consume(queueName, msg => {
    const task = JSON.parse(msg.content.toString());
    processTask(task);
    channel.ack(msg);
  });
}

startConsumer();
