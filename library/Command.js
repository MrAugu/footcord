export default class Command {
    constructor (name) {
        this.name = name;
    };

    buildSlash () {
        throw Error("Please override the build function for this command.");
    }

    async run () {
        throw Error("Please override the run function for the .");
    }
}