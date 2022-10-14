const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ComponentType, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Replies with server information'),
    async execute(client, interaction) {
        try {
            const serverRoles = interaction.guild.roles.cache.map(role => role.name).join(', @');
            const botUser = client.user
            const owner = await interaction.guild.fetchOwner(); 
            const afktime = String(interaction.guild.afkTimeout / 60)
            const botservertime = new Date(interaction.guild.joinedTimestamp).toLocaleString();
            const embed = new EmbedBuilder()
                .setColor('#FFFF00')
                .setTitle('Server and user informations!')
                .setImage(interaction.guild.iconURL())
                .setDescription('Roles:\n' + String(serverRoles))
                .setTimestamp()
                .setFooter({ text: "Server info, requested by: " + interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                .addFields( 
                    { name: "Name:", value: interaction.guild.name + `\n(${interaction.guild.nameAcronym})`, inline:true },
                    { name: "Owner:", value: String(owner.user.tag), inline:true },
                    { name: "Member count:", value: `${interaction.guild.memberCount} / ` + interaction.guild.maximumMembers, inline:true },
                    { name: "Creation date:", value: `<t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:R>`, inline:true },
                    { name: "ID:", value: String(interaction.guild.id), inline:true },
                    { name: "Description:", value: String(interaction.guild.description) },
                    { name: "Premium count / tier:", value: `${interaction.guild.premiumSubscriptionCount} / ` + String(interaction.guild.premiumTier), inline:true },
                    { name: "Premium progress:", value: (interaction.guild.premiumProgressBarEnabled ? "True" : "False"), inline:true },
                    { name: 'Bot:', value: botUser.toString(), inline:true },
                    { name: "Bot join date:", value: botservertime, inline:true },
                    { name: '\u200B', value: '\u200B', inline:true },
                    { name: "Update channel:", value: String(interaction.guild.publicUpdatesChannel), inline:true },
                    { name: "Rules channel:", value: String(interaction.guild.rulesChannel), inline:true },
                    { name: "Systems channel:", value: `${interaction.guild.systemChannel}`, inline:true },
                    { name: "Afk voice channel:", value: String(interaction.guild.afkChannel), inline:true },
                    { name: "Afk timeout (min):", value: afktime, inline:true },
                    { name: "Explicit content filter level:", value: `${interaction.guild.explicitContentFilter}`, inline:true },
                    { name: "MFA and NSFW level:", value: `${interaction.guild.mfaLevel} / ` + String(interaction.guild.nsfwLevel), inline:true },
                    { name: "Verification level:", value: String(interaction.guild.verificationLevel), inline:true },
                    { name: "Preferred server locale:", value: String(interaction.guild.preferredLocale), inline:true },
                    { name: "Verified:", value: (interaction.guild.verified ? "True" : "False"), inline:true },
                    { name: "Partnered:", value: (interaction.guild.partnered ? "True" : "False"), inline:true },
                )
            await interaction.reply({ embeds: [embed] })
        } catch (err) {
            console.log("Something Went Wrong => ", err);
            await interaction.reply('Something went wrong. Please try again later.')
        }
    }
};