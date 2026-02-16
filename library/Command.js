export default class Command {
    constructor (client, name) {
        this.client = client;
        this.name = name;
    };

    buildSlashOptions () {
        throw Error("Please override the build function for this command.");
    }

    async run () {
        throw Error("Please override the run function for the .");
    }
}