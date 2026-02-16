export default async function handler (client, interaction) {
    const command = client.commands[interaction.commandName];

    if (command) {
        try {
            await command.run(interaction);
        } catch (error) {
            if (interaction.isRepliable()) return interaction.reply(":warning: Something went wrong, please contact us!");
        }
    } else {
        if (interaction.isRepliable()) return interaction.reply(":warning: Something went terribly wrong, please contact us!");
    }
}