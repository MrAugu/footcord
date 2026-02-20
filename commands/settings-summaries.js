import Command from "../library/Command.js";
import { ChannelType } from "discord.js";

export default class SettingsSummaries extends Command {
	constructor(client) {
		super(client, "settings-summaries");
	}

	buildSlashOptions(commandBuilder) {
		return commandBuilder
			.addSubcommand(sub =>
				sub
					.setName("summaries")
					.setDescription("Set the summaries update preferences for a league")
					.addIntegerOption(opt =>
						opt.setName("team")
							// eslint-disable-next-line max-len
							.setDescription("Teams whose match events you want to set summaries for. Type 'all' to set for all followed.")
							.setRequired(true)
							.setAutocomplete(true)
					)
					.addStringOption(opt =>
						opt
							.setName("type")
							.setDescription("The the type of summary you want to change the preferences for")
							.setRequired(false)
							.addChoices(
								{ name: "Pre-Match", value: "pre-match" },
								{ name: "Half-Time", value: "half-time" },
								{ name: "Post-Match", value: "post-match" }
							)
					)
					.addStringOption(opt =>
						opt
							.setName("option")
							.setDescription("The option you want to change for the selected summary type")
							.setRequired(false)
							.addChoices(
								{ name: "Enable summary notifications", value: "enable" },
								{ name: "Disable summary notifications", value: "disable" }
							)
					)
					.addChannelOption(opt =>
						opt
							.setName("channel")
							.setDescription("Channel where all summaries will be sent for this team")
							.setRequired(false)
							.addChannelTypes(ChannelType.GuildText)
					)
			);
	}

	async run(interaction) {
		console.log("WIP");
		await interaction.reply("Pong!");
	}
}