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
					.addBooleanOption(opt =>
						opt
							.setName("dm")
							.setDescription("Unsubscribe from direct message league notifications")
							.setRequired(false)
					)
			);
	}

	async run(interaction) {
		await interaction.reply("Pong!");
	}
}