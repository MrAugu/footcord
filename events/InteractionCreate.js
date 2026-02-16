import Event from "../library/Command.js";
import slashCommandHandler from "../handlers/slashCommandHandler.js";
import autocompleteHandler from "../handlers/autocompleteHandler.js";

export default class Ready extends Event {
    constructor (client) {
        super(client, "interactionCreate");
    }

    async run (interaction) {
        if (interaction.isCommand()) {
            try {
                slashCommandHandler(this.client, interaction);
            } catch (error) {
                return console.error("Slash Command Handler Error", error);
            }
        }

        if (interaction.isAutocomplete()) {
            try {
                autocompleteHandler(this.client, interaction);
            } catch (error) {
                return console.error("Autocomplete Handler Error", error);
            }
        }
    }
}