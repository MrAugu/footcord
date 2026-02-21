import winston from "winston";

const { combine, timestamp, errors, json, colorize, simple, printf } = winston.format;
const isProd = process.env.NODE_ENV === "production";

const devFormat = printf(({ timestamp, level, message, stack }) => {
	return stack
	  ? `${timestamp} ${level}: ${message}\n${stack}` // error stack on newline
	  : `${timestamp} ${level}: ${message}`;
});


const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || "info",
	defaultMeta: {
		service: "user-service",
		environment: process.env.NODE_ENV || "development",
		"shard_id": process.env.SHARDS
	},
	format: isProd
		? combine(
			timestamp({ format: "YYYY-MM-DDTHH:mm:ss.SSSZ" }),
			errors({ stack: true }),
			json()
		)
		: combine(
			timestamp(),
			errors({ stack: true }),
			colorize(),
			(process.env.LOG_JSON === true ? simple() : devFormat)
		),
	transports: [
		new winston.transports.Console()
	]
});

export default logger;