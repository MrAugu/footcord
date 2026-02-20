import Command from "../library/Command.js";
import { SlashCommandBuilder } from "discord.js";

export default class Teams extends Command {
	constructor(client) {
		super(client, "teams");
	}

	buildSlashOptions() {
		return new SlashCommandBuilder()
			.setName("teams")
			.setDescription("List all teams in a specific league.")
			.addStringOption(option =>
				option.setName("name")
					.setDescription("The name of the league or country.")
					.setRequired(true)
					.setAutocomplete(true));
	}

	async run(interaction) {
		console.log("WIP");
		await interaction.reply("Pong!");
	}
}