import dotenv from "dotenv";
dotenv.config();
import { Client, Events, GatewayIntentBits } from "discord.js";

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

import Ready from "./events/ready.js";
const ReadyEvent = new Ready({ name: "ready" });

client.once(Events.ClientReady, (readyClient) => ReadyEvent.run(readyClient));

client.login(process.env.DISCORD_TOKEN);