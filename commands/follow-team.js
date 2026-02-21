import Command from "../library/Command.js";
import { ChannelType } from "discord.js";

export default class FollowTeam extends Command {
	constructor(client) {
		super(client, "follow-team");
	}

	buildSlashOptions(commandBuilder) {
		return commandBuilder
			.addSubcommand(sub =>
				sub
					.setName("team")
					.setDescription("Follow a team to receive updates")
					.addIntegerOption(opt =>
						opt.setName("name")
							.setDescription("The name of the team")
							.setRequired(true)
							.setAutocomplete(true)
					)
					.addChannelOption(opt =>
						opt
							.setName("channel")
							.setDescription("Channel where match events, lineups, injured and summaries will be sent")
							.setRequired(true)
							.addChannelTypes(ChannelType.GuildText)
					)
			);
	}

	async run(interaction) {
		const teamId = interaction.options.getInteger("name");
		const channelId = interaction.options.getChannel("channel").id;

		try {
			const existingFollow = await this.client.sql`SELECT * FROM team_notification_preferences WHERE target_type = 'guild' AND target_id = ${interaction.guild.id} AND teamid = ${teamId}::int4`;
			if (existingFollow.length > 0) return interaction.reply(":x: This server is already following the team.")
				.catch(error => this.handleError("Follow Team Command - Reply Error", error));
		} catch (error) {
			this.logger.error("Database error when checking existing team follow", { error });

			return interaction.reply(":warning: Something went wrong when trying to follow the team. Please try again later.")
				.catch(error => this.handleError("Follow Team Command - Reply Error", error));
		}

		try {
			await this.client.sql`
				INSERT INTO team_notification_preferences (target_type, target_id, teamid, lineup_notifications_enabled, lineup_notifications_channel,
				injured_notifications_enabled, injured_notifications_channel, event_goal_enabled, event_red_card_enabled, event_yellow_card_enabled,
				event_substitution_enabled, event_match_start_enabled,
				event_match_end_enabled, event_channel, summary_prematch_enabled, summary_half_time_enabled, summary_postmatch_enabled, summary_channel, silenced)
				VALUES ('guild', ${interaction.guild.id}, ${teamId}, true, ${channelId}, true, ${channelId}, true, true, true,
				true, true, true, ${channelId}, true, true, true, ${channelId}, false)
			`;

			return interaction.reply(":white_check_mark: Successfully followed the team! You will start receiving updates in the selected channel.")
				.catch(error => this.handleError("Follow Team Command - Reply Error", error));
		} catch (error) {
			this.logger.error("Database error when inserting team follow", { error });

			return interaction.reply(":warning: Something went wrong when trying to follow the team. Please try again later.")
				.catch(error => this.handleError("Follow Team Command - Reply Error", error));
		}
	}
}