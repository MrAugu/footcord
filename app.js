import dotenv from "dotenv";
dotenv.config();
import { Client, Events, GatewayIntentBits, REST, Routes, ActivityType, SlashCommandBuilder } from "discord.js";
import sql from "./utils/db.js";

import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";

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

const rest = new REST().setToken(process.env.DISCORD_TOKEN);
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

client.gRpcClient = gRpcClient;

// Data Caching -- to remove
client.sql = sql;
client.commands = {};
client.footballCache = {
	teams: [],
	venues: [],
	countries: [],
	leagues: [],
	players: []
};

// Events
import ReadyEvent from "./events/ready.js";
const ReadyEventInstance = new ReadyEvent(client);

import InteractionCreate from "./events/InteractionCreate.js";
const InteractionCreateInstance = new InteractionCreate(client);

// Top Level Commands
import Ping from "./commands/ping.js";
const PingInstance = new Ping(client);
slashCommands.push(PingInstance.buildSlashOptions().toJSON());

import League from "./commands/league.js";
const LagueInstance = new League(client);
slashCommands.push(LagueInstance.buildSlashOptions().toJSON());

// Subcommand Reunions
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

import UnfollowLeague from "./commands/unfollow-leagues.js";
import UnfollowTeam from "./commands/unfollow-team.js";
const UnfollowLeagueInstance = new UnfollowLeague(client);
const UnfollowTeamInstance = new UnfollowTeam(client);

let unfollowCommandBuilder = new SlashCommandBuilder()
	.setName("unfollow")
	.setDescription("Unfollow a league or team to stop receiving updates and notifications.");
unfollowCommandBuilder = UnfollowLeagueInstance.buildSlashOptions(unfollowCommandBuilder);
unfollowCommandBuilder = UnfollowTeamInstance.buildSlashOptions(unfollowCommandBuilder);
slashCommands.push(unfollowCommandBuilder.toJSON());

// Registering Commands
client.commands[PingInstance.name] = PingInstance;
client.commands[LagueInstance.name] = LagueInstance;


console.log(`Started refreshing ${slashCommands.length} application (/) commands.`);
rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.TEST_GUILD), {
	body: slashCommands
}).then((response) => console.log("LOG: Refreshed slash commands.", response.map(cmd => cmd.name)))
	.catch(err => console.error("Error refreshing slash commands", err));

client.once(Events.ClientReady, (readyClient) => ReadyEventInstance.run(readyClient));
client.on(Events.InteractionCreate, (interaction) => InteractionCreateInstance.run(interaction));
client.on(Events.Debug, (...args) => process.env.DEBUG ? console.log(...args) : {});
client.on(Events.Error, (...args) => console.error("Error Event Received", ...args));

(client.sql`SELECT * FROM teams;`).then(data => {
	for (const row of data) {
		client.footballCache.teams.push(row);
	}
	console.log(`LOG: Cached ${data.length} teams from database.`);
});

(client.sql`SELECT * FROM venues;`).then(data => {
	for (const row of data) {
		client.footballCache.venues.push(row);
	}
	console.log(`LOG: Cached ${data.length} venues from database.`);
});

(client.sql`SELECT * FROM leagues;`).then(data => {
	for (const row of data) {
		client.footballCache.leagues.push(row);
	}
	console.log(`LOG: Cached ${data.length} leagues from database.`);
});

(client.sql`SELECT * FROM countries;`).then(data => {
	for (const row of data) {
		client.footballCache.countries.push(row);
	}
	console.log(`LOG: Cached ${data.length} countries from database.`);
});

client.login(process.env.DISCORD_TOKEN);