const db = require('../db')
const { Markup, Extra } = require('telegraf');

module.exports = {
    name: 'dashboard',
    description: 'Manage all your redirects',
    public: true, 
    execute(ctx){
        const buttons = [];
        db.query('SELECT * FROM redirect', [], (err, res) => {
            if (err) throw err;
            res.rows.forEach(element => {
                buttons.push([Markup.callbackButton(element.title, `dashboard-${element.id}`)]);
            });
            ctx.replyWithMarkdown('⚙️ Here are all your redirects', Extra.markup(Markup.inlineKeyboard(buttons)));
        })
    }
}