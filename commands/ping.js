import Command from "../library/Command.js";
import { SlashCommandBuilder } from "discord.js";

export default class Ping extends Command {
    constructor (client) {
        super(client, "ping");
    }

    buildSlashOptions () {
        return new SlashCommandBuilder()
            .setName("ping")
            .setDescription("pong");
    }

    async run (interaction) {
        await interaction.reply("Pong!");
    }
}