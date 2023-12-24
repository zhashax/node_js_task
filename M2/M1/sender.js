const amqp = require('amqplib');

const queueName = 'tasks';

async function sendMessage(input) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName);

  const message = { input }; 

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  console.log('Message sent:', message);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500); 
}

const userInput = process.argv[2]; 
sendMessage(userInput);
