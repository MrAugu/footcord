import Command from "../library/Command.js";
import { ChannelType } from "discord.js";

export default class SettingsStandings extends Command {
	constructor(client) {
		super(client, "settings-match-events");
	}

	buildSlashOptions(commandBuilder) {
		return commandBuilder
			.addSubcommand(sub =>
				sub.setName("settings-match-events")
					// eslint-disable-next-line max-len
					.setDescription("Set up your match event preference such as notifications for goals, red cards, etc.")
					.addStringOption(option =>
						option.setName("team")
						//eslint-disable-next-line max-len
							.setDescription("Teams whose match events you want to set preferences for. Type 'all' to set for all followed.")
							.setRequired(true)
							.setAutocomplete(true))
					.addStringOption(opt =>
						opt
							.setName("event")
							.setDescription("The event type you want to receive notifications for.")
							.setRequired(true)
							.addChoices(
								{ name: "Goal notifications", value: "goal" },
								{ name: "Red card notifications", value: "red_card" },
								{ name: "Yellow card notifications", value: "yellow_card" },
								{ name: "Substitution notifications", value: "substitution" },
								{ name: "Match start notifications", value: "match_start" },
								{ name: "Match end notifications", value: "match_end" },
								{ name: "Disable all notifications for this team", value: "disable_all" }
							)
					)
					.addStringOption(opt =>
						opt
							.setName("preference")
							.setDescription("The preference for the selected event type.")
							.setRequired(true)
							.addChoices(
								{ name: "Enabled", value: "enabled" },
								{ name: "Disabled", value: "disabled" }
							)
					)
					.addChannelOption(opt =>
						opt
							.setName("channel")
							.setDescription("Channel where all match events will be sent for this team")
							.setRequired(false)
							.addChannelTypes(ChannelType.GuildText)
					)
			);
	}

	async run(interaction) {
		await interaction.reply("Pong!");
	}
}