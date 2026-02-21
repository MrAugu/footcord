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
			if (existingFollow.length > 0) return interaction.reply(`${process.env.CROSS_EMOJI} This server is already following the team.`)
				.catch(error => this.handleError("Follow Team Command - Reply Error", error));
		} catch (error) {
			this.logger.error("Database error when checking existing team follow", { error });

			return interaction.reply(`${process.env.WARNING_EMOJI} Something went wrong when trying to follow the team. Please contact us.\n${process.env.SUPPORT_GUILD_INVITE}`)
				.catch(error => this.handleError("Follow Team Command - Reply Error", error));
		}

		const user_preference_json = {
			"lineup": {
				"enabled": true,
				"channel": channelId
			},
			"injuries": {
				"enabled": true,
				"channel": channelId
			},
			"events": {
				"goal": true,
				"var": true,
				"red_card": true,
				"yellow_card": true,
				"substitution": false,
				"match_start": true,
				"match_end": true,
				"channel": channelId
			},
			"summary": {
				"prematch": true,
				"halftime": true,
				"postmatch": true,
				"channel": channelId
			},
			"match_reminder": {
				"enabled": true,
				"time": "1h",
				"channel": channelId,
				"role_mentions": []
			}
		};

		try {
			await this.client.sql`
				INSERT INTO team_notification_preferences (target_type, target_id, teamid, silenced, preferences)
				VALUES ('guild', ${interaction.guild.id}, ${teamId}, false, ${user_preference_json})
			`;

			return interaction.reply(`${process.env.WARNING_EMOJI} Something went wrong when trying to follow the team. Please contact us.\n${process.env.SUPPORT_GUILD_INVITE}`)
				.catch(error => this.handleError("Follow Team Command - Reply Error", error));
		} catch (error) {
			this.logger.error("Database error when inserting team follow", { error });

			return interaction.reply(`${process.env.WARNING_EMOJI} Something went wrong when trying to follow the team. Please contact us.\n${process.env.SUPPORT_GUILD_INVITE}`)
				.catch(error => this.handleError("Follow Team Command - Reply Error", error));
		}
	}
}