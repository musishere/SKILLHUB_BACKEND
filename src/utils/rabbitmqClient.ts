// RabbitMQ Client Utility
// Handles connection, publishing, consuming, and health checks
import amqp from "amqplib";
import { config } from "../config";

let connection: amqp.Connection;
let channel: amqp.Channel;

export async function connectRabbitMQ() {
  connection = await amqp.connect(config.RABBITMQ_URL);
  channel = await connection.createChannel();
}

export async function publishToQueue(queue: string, message: any) {
  if (!channel) await connectRabbitMQ();
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
}

export async function consumeQueue(
  queue: string,
  handler: (msg: any) => Promise<void>
) {
  if (!channel) await connectRabbitMQ();
  await channel.assertQueue(queue, { durable: true });
  channel.consume(queue, async (msg) => {
    if (msg) {
      await handler(JSON.parse(msg.content.toString()));
      channel.ack(msg);
    }
  });
}

export async function rabbitMQHealthCheck() {
  try {
    if (!connection) await connectRabbitMQ();
    await channel.assertQueue("health_check");
    return true;
  } catch (err) {
    return false;
  }
}
