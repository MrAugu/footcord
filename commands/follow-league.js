import Command from "../library/Command.js";
import { ChannelType } from "discord.js";

export default class FollowLeague extends Command {
	constructor(client) {
		super(client, "follow-league");
	}

	buildSlashOptions(commandBuilder) {
		return commandBuilder
			.addSubcommand(sub =>
				sub
					.setName("league")
					.setDescription("Follow a league to receive updates.")
					.addIntegerOption(opt =>
						opt.setName("name")
							.setDescription("The name of the league/country")
							.setRequired(true)
							.setAutocomplete(true)
					)
					.addBooleanOption(opt =>
						opt
							.setName("dm")
							.setDescription("Subscribe to direct message notifications for this league")
							.setRequired(false)
					)
					.addChannelOption(opt =>
						opt
							.setName("channel")
							.setDescription("Channel where updates will be sent")
							.setRequired(false)
							.addChannelTypes(ChannelType.GuildText)
					)
			);
	}

	async run(interaction) {
		await interaction.reply("Pong!");
	}
}