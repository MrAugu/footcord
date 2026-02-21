import logger from "./winston.js";

export default function errorIo(location, error) {
	logger.warn("An error occurred during calls.", { error });
}