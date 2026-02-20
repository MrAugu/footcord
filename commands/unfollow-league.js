import Command from "../library/Command.js";

export default class UnfollowLeague extends Command {
	constructor(client) {
		super(client, "unfollow-league");
	}

	buildSlashOptions(commandBuilder) {
		return commandBuilder
			.addSubcommand(sub =>
				sub
					.setName("league")
					.setDescription("Unfollow league to stop receiving updates")
					.addIntegerOption(opt =>
						opt.setName("name")
							.setDescription("The name of the league")
							.setRequired(true)
							.setAutocomplete(true)
					)
					.addStringOption(opt =>
						opt
							.setName("dm")
							.setDescription("Enable or disable notifications for you")
							.setRequired(true)
							.addChoices(
								{ name: "Disable notifications for direct messages", value: "enable_dm" },
								{ name: "Disable notifications for a channel in this server", value: "not_enable_dm" }
							)
					)
			);
	}

	async run(interaction) {
		console.log("WIP");
		await interaction.reply("Pong!");
	}
}