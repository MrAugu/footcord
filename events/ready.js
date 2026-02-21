import Event from "../library/Event.js";
import logger from "../utils/winston.js";
import { REST, Routes } from "discord.js";
export default class Ready extends Event {
	constructor(client) {
		super(client, "ready");
	}

	async run(readyClient) {
		logger.info(`Successfully logged in as ${readyClient.user.tag} (${readyClient.user.id}).`);
    	logger.info(`Shard ${process.env.SHARDS} is ready.`);
    	logger.debug(`Handling guilds: ${this.client.guilds.cache.map(guild => guild.id).join(", ")}`);

		if (process.env.NODE_ENV === "development") {
			logger.debug("Loading commands for all testing guilds.");

			const rest = new REST().setToken(process.env.DISCORD_TOKEN);
			for (const guild of this.client.guilds.cache.values()) {
				rest.put(Routes.applicationGuildCommands(readyClient.user.id, guild.id), {
					body: this.client.slashCommandJson
				}).then((response) => logger.debug(`Sent and set slash commands for guild ${guild.id}.`, { response }))
					.catch(err => {
						logger.error(`Error sending slash commands for guild ${guild.id}.`, { error: err });
					});
			}
		}
	}
}