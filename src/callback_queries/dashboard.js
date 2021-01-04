const db = require('../db');
const { Markup, Extra } = require('telegraf');

module.exports = {
    name: /^dashboard.*$/,
    execute(ctx){
        ctx.answerCbQuery();
        const id = ctx.match[0].split('-')[1];
        db.query('SELECT * FROM redirect WHERE id = $1', [id], (err, res) => {
            const data = res.rows[0];
            const message = `📩 ${data.title}`
                + `\n\nOrigin: ${data.origin}`
                + `\nDestination: ${data.destination}`
                + `\nActive: ${data.active}`
            const extra = Extra.markup(Markup.inlineKeyboard([
                [Markup.callbackButton('🗑 Remove', `remove-${data.id}`)],
                [Markup.callbackButton(data.active ? '🚫 Deactivate' : '✅ Activate', `edit-${data.id};active;${!data.active}`)]
            ]))
            ctx.editMessageText(message, extra);
        })
    }
}