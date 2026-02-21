import logger from "../utils/winston.js";
import handleError from "../utils/handleError.js";

export default async function handler(client, interaction) {
	const {commandName} = interaction;
	const subcommand = interaction.options.getSubcommand(false);
	const fullName = subcommand
		? `${commandName}-${subcommand}`
		: commandName;

	const command = client.commands[fullName];

	if (command) {
		try {
			await command.run(interaction);
		} catch (error) {
			logger.error("Error on slash command execution.", { error });
			if (interaction.isRepliable()) return interaction.reply(":warning: Something has gone wrong when running this command. Please contact us if the issue persists.")
				.catch(error => handleError("Slash Command Handler - Reply Error", error));
		}
	} else {
		logger.error("Requested slash command not found.", { command: fullName });
		if (interaction.isRepliable()) return interaction.reply(":warning: Command not found in the system. Please contact us if this issue persists.")
			.catch(error => handleError("Slash Command Handler - Reply Error", error));
	}
}