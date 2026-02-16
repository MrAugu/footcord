export default async function handler (client, interaction) {
	const command = client.commands[interaction.commandName];

	if (command) {
		try {
			await command.run(interaction);
		} catch (error) {
			console.log("ERROR: command error", error);
			if (interaction.isRepliable()) return interaction.reply(":warning: Something has gone wrong when running this command. Please contact us if the issue persists.");
		}
	} else {
		console.log("ERROR:Command not found.");
		if (interaction.isRepliable()) return interaction.reply(":warning: Command not found in the system. Please contact us if this issue persists.");
	}
}