import Command from "../library/Command.js";
import { ChannelType } from "discord.js";

export default class SettingsStandings extends Command {
	constructor(client) {
		super(client, "settings-standings");
	}

	buildSlashOptions(commandBuilder) {
		return commandBuilder
			.addSubcommand(sub =>
				sub
					.setName("standings")
					.setDescription("Set the standings update preferences for a league")
					.addIntegerOption(opt =>
						opt.setName("name")
							.setDescription("The name of the league")
							.setRequired(true)
							.setAutocomplete(true)
					)
					.addStringOption(opt =>
						opt
							.setName("frequency")
							.setDescription("The frequency of standings updates")
							.setRequired(false)
							.addChoices(
								{ name: "Daily", value: "daily" },
								{ name: "Weekly", value: "weekly" },
								{ name: "Monthly", value: "monthly" },
								{ name: "Disable", value: "disable" }
							)
					)
					.addChannelOption(opt =>
						opt
							.setName("channel")
							.setDescription("Channel where standings will be sent for this league")
							.setRequired(false)
							.addChannelTypes(ChannelType.GuildText)
					)
			);
	}

	async run(interaction) {
		await interaction.reply("Pong!");
	}
}