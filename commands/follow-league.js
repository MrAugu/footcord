import Command from "../library/Command.js";
import { ChannelType } from "discord.js";

export default class FollowLeague extends Command {
	constructor(client) {
		super(client, "follow-league");
	}

	buildSlashOptions(commandBuilder) {
		return commandBuilder
			.addSubcommand(sub =>
				sub
					.setName("league")
					.setDescription("Follow a league to receive updates.")
					.addIntegerOption(opt =>
						opt.setName("name")
							.setDescription("The name of the league/country")
							.setRequired(true)
							.setAutocomplete(true)
					)
					.addChannelOption(opt =>
						opt
							.setName("channel")
							.setDescription("Channel where updates will be sent")
							.setRequired(true)
							.addChannelTypes(ChannelType.GuildText)
					)
			);
	}

	async run(interaction) {
		const leagueId = interaction.options.getInteger("name");
		const channelId = interaction.options.getChannel("channel").id;

		try {
			const existingFollow = await this.client.sql`SELECT * FROM league_notification_preferences WHERE target_id = ${interaction.guild.id} AND target_type = 'guild' AND leagueid = ${leagueId}`;
			if (existingFollow.length > 0) return interaction.reply(":x: This server is already following the league. Please unfollow the current league before following a new one.")
				.catch(error => this.handleError("Follow League Command - Reply Error", error));
		} catch (error) {
			this.logger.error("Database error when checking existing league follow", { error });

			return interaction.reply(":warning: Something went wrong when trying to follow the league. Please try again later.")
				.catch(error => this.handleError("Follow League Command - Reply Error", error));
		}

		try {
			await this.client.sql`
		INSERT INTO league_notification_preferences (target_type, target_id, leagueid, standings_frequency, standings_channel, silenced)
		VALUES ('guild', ${interaction.guild.id}, ${leagueId}, 'daily', ${channelId}, false)
		`;

			return interaction.reply(":white_check_mark: Successfully followed the league! You will start receiving updates in the selected channel.")
				.catch(error => this.handleError("Follow League Command - Reply Error", error));
		} catch (error) {
			this.logger.error("Database error when inserting league follow", { error });

			return interaction.reply(":warning: Something went wrong when trying to follow the league. Please try again later.")
				.catch(this.handleError("Follow League Command - Reply Error", error));
		}
	}
}