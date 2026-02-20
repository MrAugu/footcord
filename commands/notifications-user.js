import Command from "../library/Command.js";

export default class NotificationsUser extends Command {
	constructor(client) {
		super(client, "notifications-user");
	}

	buildSlashOptions(commandBuilder) {
		return commandBuilder
			.addSubcommand(sub =>
				sub
					.setName("user")
					.setDescription("Temporarily mute/unmute all notifications for you")
					.addStringOption(opt =>
						opt
							.setName("choice")
							.setDescription("Enable or disable notifications for you")
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