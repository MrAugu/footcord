export default class Event {
    constructor (client, name) {
        this.client = client;
        this.name = name;
    }

    async run () {
        throw Error("Please override the run function for the event.");
    }
}