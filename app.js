import dotenv from "dotenv";
dotenv.config();
import { Client, Events, GatewayIntentBits, REST, Routes, ActivityType } from "discord.js";
import sql from "./utils/db.js";

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
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

// Commands
import Ping from "./commands/ping.js";
const PingInstance = new Ping(client);
slashCommands.push(PingInstance.buildSlashOptions().toJSON());

import League from "./commands/league.js";
const LagueInstance = new League(client);
slashCommands.push(LagueInstance.buildSlashOptions().toJSON());

// Registering Commands
client.commands[PingInstance.name] = PingInstance;

console.log(`Started refreshing ${slashCommands.length} application (/) commands.`);
rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.TEST_GUILD), { body: slashCommands }).then((response) => console.log("LOG: Refreshed slash commands."));

client.once(Events.ClientReady, (readyClient) => ReadyEventInstance.run(readyClient));
client.on(Events.InteractionCreate, (interaction) => InteractionCreateInstance.run(interaction));

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