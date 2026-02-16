import stringSimilarity from "string-similarity";
import findCountryByLocale from "../utils/locale.js";


export default async function handler (client, interaction) {
    if (interaction.commandName === "league") {
        const leagueNames = client.footballCache.leagues.map(league => `${league.id}/${league.name}${league.country?.name ? (league.name.includes(league.country?.name) ? "" : " - " + league.country?.name || "") : " - World"}`);
            const focused = interaction.options.getFocused() || findCountryByLocale(interaction.locale);

            const matches = stringSimilarity
                .findBestMatch(focused, leagueNames)
                .ratings
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 10)
                .map((c) => {
                    const [id, name] = c.target.split("/")
                    console.log(id, name);
                    return { name: name, value: id };
                });

            await interaction.respond(matches);
    }
}