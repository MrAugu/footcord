import Command from "../library/Command.js";
import { SlashCommandBuilder } from "discord.js";
import { getLeagueInfoAsync } from "../utils/grpc.js";

export default class League extends Command {
	constructor (client) {
		super(client, "league");
	}

	buildSlashOptions () {
		return new SlashCommandBuilder()
			.setName("league")
			.setDescription("Lookup a single league information, standings and recent fixtures.")
			.addStringOption(option =>
				option.setName("name")
					.setDescription("The name of the league or country.")
					.setRequired(true)
					.setAutocomplete(true));
	}

	async run (interaction) {
		let leagueId = interaction.options.getString("name");
		leagueId = parseInt(leagueId);
    
		const leagueInfo = await getLeagueInfoAsync(this.client.gRpcClient, leagueId).catch(()=>undefined);
		console.log(leagueInfo);

		await interaction.reply("Pong!");
	}
}