export default class Event {
    constructor (name) {
        this.name = name;
    }

    async run () {
        throw Error("Please override the run function for the event.");
    }
}