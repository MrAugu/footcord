import Command from "../library/Command.js";

export default class NotificationsServer extends Command {
	constructor(client) {
		super(client, "notifications-server");
	}

	buildSlashOptions(commandBuilder) {
		return commandBuilder
			.addSubcommand(sub =>
				sub
					.setName("server")
					.setDescription("Temporarily mute/unmute all notifications for this server")
					.addStringOption(opt =>
						opt
							.setName("choice")
							.setDescription("Enable or disable all notifications for this server")
							.setRequired(true)
							.addChoices(
								{ name: "Mute", value: "mute" },
								{ name: "Unmute", value: "unmute" }
							)
					)
			);
	}

	async run(interaction) {
		await interaction.reply("Pong!");
	}
}