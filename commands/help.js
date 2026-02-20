import Command from "../library/Command.js";
import { SlashCommandBuilder } from "discord.js";

export default class Help extends Command {
	constructor(client) {
		super(client, "help");
	}

	buildSlashOptions() {
		return new SlashCommandBuilder()
			.setName("help")
			.setDescription("Help command to show all available commands and their descriptions.");
	}

	async run(interaction) {
		await interaction.reply("Pong!");
	}
}