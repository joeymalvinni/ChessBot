const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong'),
    async execute(client, interaction) {
        try {
            const msg = await interaction.reply({ content: "Pong!", fetchReply: true });
            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(':ping_pong: Pong!')
                .setDescription(`\nBot Latency: \`${msg.createdTimestamp - interaction.createdTimestamp}ms\` \n Websocket Latency: \`${client.ws.ping}ms\``)
                .setTimestamp();
            await interaction.editReply({ content: "", embeds: [exampleEmbed]});
          } catch (err) {
            console.log("Something Went Wrong => ", err);
          }
    }
};
