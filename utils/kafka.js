import logger from "./winston.js";

export default async function kafka(client, consumer) {
	await consumer.connect()
		.then(() => logger.info("Kafka consumer connected."))
		.catch((error) => {
			logger.error("Kafka consumer failed to connect.", { error });
			process.exit(1);
		});

	await consumer.subscribe({ topic: "notifications", fromBeginning: true });

	await consumer.run({
		eachMessage: async({ message }) => {
			console.log(message);
		}
	});
}