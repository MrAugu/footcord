import Command from "../library/Command.js";
import { ChannelType } from "discord.js";

export default class FollowTeam extends Command {
	constructor(client) {
		super(client, "follow-team");
	}

	buildSlashOptions(commandBuilder) {
		return commandBuilder
			.addSubcommand(sub =>
				sub
					.setName("team")
					.setDescription("Follow a team to receive updates")
					.addIntegerOption(opt =>
						opt.setName("name")
							.setDescription("The name of the team")
							.setRequired(true)
							.setAutocomplete(true)
					)
					.addBooleanOption(opt =>
						opt
							.setName("dm")
							.setDescription("Subscribe to direct message notifications for this team")
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