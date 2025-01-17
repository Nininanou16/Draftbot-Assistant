import { SlashCommandBuilder } from '@discordjs/builders';
import { Context } from '../../libs/Context.js';
import { Reminder } from '../../libs/Reminder.js';
import { DB_Reminder } from '../../libs/Interfaces.js';
import { TextBasedChannel, User } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('remove_reminder')
	.setDescription('Supprime un rappel')
    .addStringOption(option => option
        .setName("message")
        .setDescription("Le message du rappel")
        .setRequired(true)
    );
export async function execute(ctx: Context) {
    await ctx.interaction.deferReply();
    let opt = {
        msg: ctx.interaction.options.getString("message")
    }
    if (ctx.db.getData(`/reminders`).filter((r: DB_Reminder) => r.author_id == ctx.interaction.user.id && r.message == opt.msg).length == 0) {
        await ctx.interaction.editReply(":warning: Aucun rappel ne correspond à ce message");
        return;
    }
    for (let reminder of (ctx.db.getData(`/reminders`) as DB_Reminder[]).filter((r: DB_Reminder) => r.author_id == ctx.interaction.user.id && r.message == opt.msg)) {
        let channel: TextBasedChannel | User;
        let fetched = await ctx.client.channels.fetch(reminder.channel.id);
		if (fetched.isText()) {
			channel = fetched
		} else {
			channel = await ctx.client.users.fetch(reminder.channel.id)
		}
        new Reminder({
            ctx: ctx,
            channel: channel,
            dead_line_timestamp: reminder.dead_line_timestamp,
            message: reminder.message,
            author: await ctx.client.users.fetch(reminder.author_id)
        }).delete();
    }
    await ctx.interaction.editReply("Rappel(s) supprimé(s) !");
}