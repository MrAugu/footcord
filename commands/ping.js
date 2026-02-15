import Command from "../library/Command.js";
import { SlashCommandSlashCommandBuilder } from "discord.js";

export default class Ping extends Command {
    constructor () {
        super({
            name: "ping"
        });
    }

    buildSlash () {
        return new SlashCommandSlashCommandBuilder()
            .setName("ping")
            .setDescription("pong");
    }

    async run (interaction) {
        await interaction.reply("Pong!");
    }
}