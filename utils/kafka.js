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
			const data = JSON.parse(message.value.toString());

			if (!client.user) {
				return logger.warn("Client user not ready, ignored notification events.", { data });
			}

			if (client.guilds.cache.get(data.guild_id)) {
				logger.debug("Contains guild.");
				const guild = client.guilds.cache.get(data.guild_id);
				const channel = guild.channels.cache.get(data.channel_id);

				channel.send(`-Notification type: ${data.notification_type}
- Home Team: ${data.home_team.name} (ID: ${data.home_team.id})
- Away Team: ${data.away_team.name} (ID: ${data.away_team.id})
- Minute?: ${data.elapsed || "N/A"}
- Status?: ${data.status || "N/A"}
- Team?: ${ data?.team?.name || "N/A"}
- Player?: ${data?.player?.name || "N/A"}
- Comments?: ${data.comments || "N/A"}
- Goals: ${data?.goals?.home || "X"} - ${data?.goals?.away || "X"}`);
			}
		}
	});
}

