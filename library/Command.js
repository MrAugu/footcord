import logger from "../utils/winston.js";
import handleError from "../utils/handleError.js";

export default class Command {
	constructor(client, name) {
		this.client = client;
		this.name = name;
		this.logger = logger;
		this.handleError = handleError;
	};

	buildSlashOptions() {
		throw Error("Please override the build function for this command.");
	}

	async run() {
		throw Error("Please override the run function for the .");
	}
}