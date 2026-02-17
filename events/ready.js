import Event from "../library/Event.js";
import { ActivityType } from "discord.js";

export default class Ready extends Event {
	constructor(client) {
		super(client, "ready");
	}

	async run(readyClient) {
		// eslint-disable-next-line no-undef
		setTimeout(async() => {
			if (this.client.footballCache.leagues.length > 0 && this.client.footballCache.countries.length > 0) {
				this.client.footballCache.leagues = this.client.footballCache.leagues.map(league => ({
					...league,
					country: this.client.footballCache.countries.find(country => country.code === league.country_code) || {}
				}));
				console.log("LOG: Matched countries to leagues.");
			}
		}, 1000);
		console.log("LOG: Bot is ready!");
	}
}