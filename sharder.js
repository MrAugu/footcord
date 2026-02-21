import { ShardingManager } from "discord.js";
import logger from "./utils/winston.js";
import dotenv from "dotenv";

dotenv.config();

const manager = new ShardingManager("app.js", {
	token: process.env.DISCORD_TOKEN,
	totalShards: 2,
	shardList: [0, 1]
});

manager.on("shardCreate", (shard) => {
	logger.info("ShardingManager spawned shard.", {
		shardId: shard.id
	});
});

manager.spawn();