/* eslint-disable indent */
import Command from "../library/Command.js";
import { SlashCommandBuilder } from "discord.js";

export default class Teaminfo extends Command {
	constructor(client) {
		super(client, "teaminfo");
	}

	buildSlashOptions() {
		return new SlashCommandBuilder()
			.setName("teaminfo")
			.setDescription("Show detailed information about a specific team.")
            .addStringOption(option =>
                option.setName("name")
                    .setDescription("The name of the team.")
                    .setRequired(true)
                    .setAutocomplete(true));
	}

	async run(interaction) {
		await interaction.reply("Pong!");
	}
}