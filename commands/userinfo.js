const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Replies with user or server info')
        .addUserOption(option => option.setName('user').setDescription('User target')),
    async execute(client, interaction) {
        try {
            if (!interaction.options.getUser('user')) {return await interaction.reply("Please specify the user.")}
            const user = interaction.options.getUser('user');
            const userMember = interaction.guild.members.cache.get(user.id);
            const roleOfMember = userMember.roles.cache.map((role) => role.toString()).join(', ');
            const embed = new EmbedBuilder()
                .setColor('#ffffff')
                .setTitle('Profile')
                .setThumbnail(user.displayAvatarURL())
                .setDescription("User information, requested by: " + interaction.user.tag + "\n\n**Current Server Roles:**\n"+String(roleOfMember))
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .setTimestamp()
                .setFooter({ text: user.tag, iconURL: user.displayAvatarURL() })
                .addFields(
                    {name: "Nickname", value: userMember.nickname ? userMember.nickname : "-", inline: true},
                    {name: "Tag:", value: user.tag, inline: true},
                    {name: '\u200B', value: '\u200B', inline: true},
                    {name: "Bot?", value: (user.bot ? "True" : "False"), inline: true},
                    {name: 'User ID:', value: String(user.id), inline: true},
                    {name: '\u200B', value: '\u200B', inline: true},
                    {name: "User created", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true},
                    {name: '\u200B', value: '\u200B', inline: true},
                    {name: "User joined", value: `<t:${Math.floor(userMember.joinedTimestamp / 1000)}:R>`, inline: true},
                )
            await interaction.reply({ embeds: [embed] })
          } catch (err) {
            console.log("Something Went Wrong => ", err);
          }
    }
};