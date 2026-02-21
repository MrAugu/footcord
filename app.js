import dotenv from "dotenv";
dotenv.config();
import { Client, Events, GatewayIntentBits, ActivityType, SlashCommandBuilder } from "discord.js";
import sql from "./utils/db.js";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import logger from "./utils/winston.js";
import { Kafka } from "kafkajs";
import kafkaHandler from "./utils/kafka.js";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.DirectMessagePolls,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.GuildMessagePolls,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.GuildWebhooks
	],
	presence: {
		activities: [
			{
				type: ActivityType.Watching,
				name: "⚽ Live Football Stats",
				state: "Real Time Updates 🏅"
			}
		],
		status: "online"
	}
});

const slashCommands = [];

// Initializing gRPC client
const PROTO_PATH = path.resolve("service.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true
});
const serviceProto = grpc.loadPackageDefinition(packageDefinition).DataService;
const gRpcClient = new serviceProto.DataService(
	process.env.DATA_SERVICE_HOSTNAME || "localhost:50051",
	grpc.credentials.createInsecure()
);

gRpcClient.waitForReady(Date.now() + 3000, (err) => {
	if (err) {
		logger.error("Failed to connect to gRPC server:", err);
		process.exit(1);
	} else {
		logger.info("Successfully connected to gRPC server.");
	}
});

const kafka = new Kafka({
	clientId: `bot-${process.env.SHARDS}`,
	brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: `shard-${process.env.SHARDS}` });
kafkaHandler(client, consumer);

client.gRpcClient = gRpcClient;
client.sql = sql;
client.commands = {};

// Events
import ReadyEvent from "./events/ready.js";
const ReadyEventInstance = new ReadyEvent(client);

import InteractionCreate from "./events/InteractionCreate.js";
const InteractionCreateInstance = new InteractionCreate(client);

// Ping Command
import Ping from "./commands/ping.js";
const PingInstance = new Ping(client);
slashCommands.push(PingInstance.buildSlashOptions().toJSON());

// League Command
import League from "./commands/league.js";
const LagueInstance = new League(client);
slashCommands.push(LagueInstance.buildSlashOptions().toJSON());

// Follow Commands
import FollowLeague from "./commands/follow-league.js";
import FollowTeam from "./commands/follow-team.js";
const FollowLeagueInstance = new FollowLeague(client);
const FollowTeamInstance = new FollowTeam(client);

let followCommandBuilder = new SlashCommandBuilder()
	.setName("follow")
	.setDescription("Follow a league or team to receive updates and notifications.");

followCommandBuilder = FollowLeagueInstance.buildSlashOptions(followCommandBuilder);
followCommandBuilder = FollowTeamInstance.buildSlashOptions(followCommandBuilder);
slashCommands.push(followCommandBuilder.toJSON());

// Unfollow Commands
import UnfollowLeague from "./commands/unfollow-league.js";
import UnfollowTeam from "./commands/unfollow-team.js";
const UnfollowLeagueInstance = new UnfollowLeague(client);
const UnfollowTeamInstance = new UnfollowTeam(client);

let unfollowCommandBuilder = new SlashCommandBuilder()
	.setName("unfollow")
	.setDescription("Unfollow a league or team to stop receiving updates and notifications.");
unfollowCommandBuilder = UnfollowLeagueInstance.buildSlashOptions(unfollowCommandBuilder);
unfollowCommandBuilder = UnfollowTeamInstance.buildSlashOptions(unfollowCommandBuilder);
slashCommands.push(unfollowCommandBuilder.toJSON());

// Notification Commands
import NotificationUser from "./commands/notifications-user.js";
import NotificationsServer from "./commands/notifications-server.js";
const NotificationUserInstance = new NotificationUser(client);
const NotificationServerInstance = new NotificationsServer(client);

let notificationCommandBuilder = new SlashCommandBuilder();
notificationCommandBuilder.setName("notifications")
	.setDescription("Temporarily enable or disable all notifications for you/your server.");

notificationCommandBuilder = NotificationUserInstance.buildSlashOptions(notificationCommandBuilder);
notificationCommandBuilder = NotificationServerInstance.buildSlashOptions(notificationCommandBuilder);
slashCommands.push(notificationCommandBuilder.toJSON());

// Settings Commands
let settingsCommandBuilder = new SlashCommandBuilder()
	.setName("settings")
	.setDescription("Update notification settings.");

import SettingsStandings from "./commands/settings-standings.js";
import SettingsSummaries from "./commands/settings-summaries.js";
import SettingsMatchEvents from "./commands/settings-match-events.js";
import SettingsInjuries from "./commands/settings-injuries.js";
import SettingsLineups from "./commands/settings-lineup.js";

const SettingsMatchEventsInstance = new SettingsMatchEvents(client);
const SettingsStandingsInstance = new SettingsStandings(client);
const SettingsSummariesInstance = new SettingsSummaries(client);
const SettingsInjuriesInstance = new SettingsInjuries(client);
const SettingsLineupInstance = new SettingsLineups(client);

settingsCommandBuilder = SettingsStandingsInstance.buildSlashOptions(settingsCommandBuilder);
settingsCommandBuilder = SettingsMatchEventsInstance.buildSlashOptions(settingsCommandBuilder);
settingsCommandBuilder = SettingsSummariesInstance.buildSlashOptions(settingsCommandBuilder);
settingsCommandBuilder = SettingsInjuriesInstance.buildSlashOptions(settingsCommandBuilder);
settingsCommandBuilder = SettingsLineupInstance.buildSlashOptions(settingsCommandBuilder);

slashCommands.push(settingsCommandBuilder.toJSON());

// Help Command
import Help from "./commands/help.js";
const HelpInstance = new Help(client);
slashCommands.push(HelpInstance.buildSlashOptions().toJSON());

// Teaminfo Command
import TeamInfo from "./commands/teaminfo.js";
const TeamInfoInstance = new TeamInfo(client);
slashCommands.push(TeamInfoInstance.buildSlashOptions().toJSON());

// Teams Command
import Teams from "./commands/teams.js";
const TeamsInstance = new Teams(client);
slashCommands.push(TeamsInstance.buildSlashOptions().toJSON());

// Registering Commands
client.commands[PingInstance.name] = PingInstance;
client.commands[LagueInstance.name] = LagueInstance;
client.commands[FollowLeagueInstance.name] = FollowLeagueInstance;
client.commands[FollowTeamInstance.name] = FollowTeamInstance;
client.commands[UnfollowLeagueInstance.name] = UnfollowLeagueInstance;
client.commands[UnfollowTeamInstance.name] = UnfollowTeamInstance;
client.commands[NotificationUserInstance.name] = NotificationUserInstance;
client.commands[NotificationServerInstance.name] = NotificationServerInstance;
client.commands[SettingsMatchEventsInstance.name] = SettingsMatchEventsInstance;
client.commands[SettingsStandingsInstance.name] = SettingsStandingsInstance;
client.commands[SettingsSummariesInstance.name] = SettingsSummariesInstance;
client.commands[SettingsInjuriesInstance.name] = SettingsInjuriesInstance;
client.commands[SettingsLineupInstance.name] = SettingsLineupInstance;
client.commands[HelpInstance.name] = HelpInstance;
client.commands[TeamInfoInstance.name] = TeamInfoInstance;
client.commands[TeamsInstance.name] = TeamsInstance;

client.slashCommandJson = slashCommands;

client.once(Events.ClientReady, (readyClient) => ReadyEventInstance.run(readyClient));
client.on(Events.InteractionCreate, (interaction) => InteractionCreateInstance.run(interaction));
client.on(Events.Debug, (message) => logger.debug(`Discord.js debug text: ${message}`));
client.on(Events.Error, (...args) => logger.error("Discord.js client error event", { ...args }));

client.login(process.env.DISCORD_TOKEN);