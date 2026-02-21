import findCountryByLocale from "../utils/locale.js";
import { getAutocompleteLeaguesAsync, getAutocompleteTeamsAsync } from "../utils/grpc.js";
import logger from "../utils/winston.js";
import handleError from "../utils/handleError.js";

export default async function handler(client, interaction) {
	const {commandName} = interaction;
	const subcommand = interaction.options.getSubcommand(false);
	const fullName = subcommand
		? `${commandName}-${subcommand}`
		: commandName;

	if (fullName === "league" || fullName === "follow-league") {
		const typedValue = interaction.options.getFocused() || findCountryByLocale(interaction.locale);

		try {
			const matches = await getAutocompleteLeaguesAsync(client.gRpcClient, typedValue, 10);

			const leagues = matches?.league_suggestions?.map(league => ({
				name: `${league.type === "League" ? "⚽" : "🏆"} ${league.name} - ${league.country}`,
				value: `${league.id}`
			}));

			interaction.respond(leagues)
				.catch(error => handleError("Autocomplete Respond Error", error));
		}   catch (error) {
			logger.error("gRPC Autocomplete Leagues Error", { error });
			interaction.respond([])
				.catch(error => handleError("Autocomplete Respond Error", error));
		}
	}

	if (fullName === "follow-team") {
		const typedValue = interaction.options.getFocused() || findCountryByLocale(interaction.locale);

		try {
			const matches = await getAutocompleteTeamsAsync(client.gRpcClient, typedValue, 25);

			const teams = matches?.team_suggestions?.map(team => ({
				name: `${team.name} - ${team.country}`,
				value: `${team.id}`
			}));

			interaction.respond(teams)
				.catch(error => handleError("Autocomplete Respond Error", error));
		}   catch (error) {
			logger.error("gRPC Autocomplete Leagues Error", { error });
			interaction.respond([])
				.catch(error => handleError("Autocomplete Respond Error", error));
		}
	}
}