import Command from "../library/Command.js";

export default class UnfollowTeam extends Command {
	constructor(client) {
		super(client, "unfollow-team");
	}

	buildSlashOptions(commandBuilder) {
		return commandBuilder
			.addSubcommand(sub =>
				sub
					.setName("team")
					.setDescription("Unfollow team to stop receiving updates")
					.addIntegerOption(opt =>
						opt.setName("name")
							.setDescription("The name of the team")
							.setRequired(true)
							.setAutocomplete(true)
					)
					.addBooleanOption(opt =>
						opt
							.setName("dm")
							.setDescription("Unsubscribe from direct message team notifications")
							.setRequired(false)
					)
			);
	}

	async run(interaction) {
		await interaction.reply("Pong!");
	}
}