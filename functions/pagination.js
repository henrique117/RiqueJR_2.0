const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

// Coded by Pedro-Ba | "https://github.com/Pedro-Ba/DiscBot/blob/master/functions/pagination.js"

module.exports = async (interaction, pages, time = 30000) => {
    try {
        if (!interaction || !pages > 0 || !pages) throw new Error('Vish KK');

        if (pages.length == 1) {
            return await interaction.editReply({ embeds: [pages[0].data], components: [], fetchReply: true });
        }

        var index = 0;

        const first = new ButtonBuilder()
            .setCustomId('pagefirst')
            .setEmoji('⏮️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);

        const prev = new ButtonBuilder()
            .setCustomId('pageprev')
            .setEmoji('⬅️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);

        const pageCount = new ButtonBuilder()
            .setCustomId('pagecount')
            .setLabel(`${index + 1}/${pages.length}`)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);

        const next = new ButtonBuilder()
            .setCustomId('pagenext')
            .setEmoji('➡️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false);

        const last = new ButtonBuilder()
            .setCustomId('pagelast')
            .setEmoji('⏩')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false);

        const buttons = new ActionRowBuilder().addComponents([first, prev, pageCount, next, last]);

        const msg = await interaction.reply({ embeds: [pages[index].data], components: [buttons], fetchReply: true });

        const collector = await msg.createMessageComponentCollector({
            ComponentType: ComponentType.Button,
            time
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) return await i.reply({ content: `You can't use this.`, ephemeral: true });

            await i.deferUpdate();

            if (i.customId == 'pagefirst') {
                index = 0;
                pageCount.setLabel(`${index + 1}/${pages.length}`);
            }

            if (i.customId == 'pageprev') {
                if (index > 0) index--;
                pageCount.setLabel(`${index + 1}/${pages.length}`);
            } else if (i.customId == 'pagenext') {
                if (index < pages.length - 1) {
                    index++;
                    pageCount.setLabel(`${index + 1}/${pages.length}`);
                }
            } else if (i.customId == 'pagelast') {
                index = pages.length - 1;
                pageCount.setLabel(`${index + 1}/${pages.length}`);
            }

            if (index == 0) {
                first.setDisabled(true);
                prev.setDisabled(true);
            } else {
                first.setDisabled(false);
                prev.setDisabled(false);
            }

            if (index == pages.length - 1) {
                last.setDisabled(true);
                next.setDisabled(true);
            } else {
                last.setDisabled(false);
                next.setDisabled(false);
            }

            await msg.edit({ embeds: [pages[index].data], components: [buttons] }).catch(err => console.log(err));

            collector.resetTimer();

        });

        collector.on("end", async () => {
            await msg.edit({ embeds: [pages[index].data], components: [] });
        })

        return msg;
    } catch (e) {
        console.error(e);
    }
}