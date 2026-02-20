import Command from "../library/Command.js";
import { ChannelType } from "discord.js";

export default class SettingsInjured extends Command {
	constructor(client) {
		super(client, "settings-injured");
	}

	buildSlashOptions(commandBuilder) {
		return commandBuilder
			.addSubcommand(sub =>
				sub.setName("lineup")
					// eslint-disable-next-line max-len
					.setDescription("Set up your linup notification preferences such as notifications for starting lineup.")
					.addStringOption(option =>
						option.setName("team")
						//eslint-disable-next-line max-len
							.setDescription("Teams whose lineup preferences you want to change. Type 'all' to set for all followed.")
							.setRequired(true)
							.setAutocomplete(true))
					.addStringOption(opt =>
						opt
							.setName("option")
							.setDescription("Whether you want to receive starting lineup notifications for the team.")
							.setRequired(true)
							.addChoices(
								{ name: "Enable starting lineup notifications", value: "enable" },
								{ name: "Disable starting lineup notifications", value: "disable" }
							)
					)
					.addChannelOption(opt =>
						opt
							.setName("channel")
							.setDescription("Channel where lineup updates will be sent")
							.setRequired(false)
							.addChannelTypes(ChannelType.GuildText)
					)
			);
	}

	async run(interaction) {
		await interaction.reply("Pong!");
	}
}