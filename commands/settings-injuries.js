import Command from "../library/Command.js";
import { ChannelType } from "discord.js";

export default class SettingsInjuries extends Command {
	constructor(client) {
		super(client, "settings-injuries");
	}

	buildSlashOptions(commandBuilder) {
		return commandBuilder
			.addSubcommand(sub =>
				sub.setName("injuries")
					.setDescription("Set up your injuries notification preferences.")
					.addStringOption(option =>
						option.setName("team")
						//eslint-disable-next-line max-len
							.setDescription("Teams whose injuries preferences you want to change. Type 'all' to set for all followed.")
							.setRequired(true)
							.setAutocomplete(true))
					.addStringOption(opt =>
						opt
							.setName("option")
							.setDescription("Whether you want to receive injuries notifications for the team.")
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