import findCountryByLocale from "../utils/locale.js";
import { getAutocompleteLeaguesAsync } from "../utils/grpc.js";

export default async function handler(client, interaction) {
	const {commandName} = interaction;
	const subcommand = interaction.options.getSubcommand(false);
	const fullName = subcommand
		? `${commandName}-${subcommand}`
		: commandName;

	if (fullName === "league" || fullName === "follow-league") {
		const typedValue = interaction.options.getFocused() || findCountryByLocale(interaction.locale);

		try {
			const matches = await getAutocompleteLeaguesAsync(client.gRpcClient, typedValue, 10).catch(console.error);
			const leagues = matches?.league_suggestions?.map(league => ({
				name: `${league.type === "League" ? "⚽" : "🏆"} ${league.name} - ${league.country}`,
				value: `${league.id}`
			}));

			interaction.respond(leagues).catch(console.error);
		}   catch (error) {
			interaction.respond([]).catch(console.error);
			console.error(error);
		}
	}
}