import Command from "../library/Command.js";
import { SlashCommandBuilder } from "discord.js";

export default class League extends Command {
    constructor (client) {
        super(client, "league");
    }

    buildSlashOptions () {
        return new SlashCommandBuilder()
            .setName("league")
            .setDescription("Lookup a single league.")
            .addStringOption(option =>
                option.setName("name")
                    .setDescription("The name of the league.")
                    .setRequired(true)
                .setAutocomplete(true));
    }

    async run (interaction) {
        await interaction.reply("Pong!");
    }
}