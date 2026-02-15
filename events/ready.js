import Event from "../library/Command.js";

export default class Ready extends Event {
    constructor () {
        super("ready");
    }

    async run (readyClient) {
        console.log("Ready!", readyClient);
    }
}