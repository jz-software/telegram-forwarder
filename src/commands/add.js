const db = require('../db');

module.exports = {
    name: 'add',
    description: 'Create a new redirect',
    public: true, 
    execute(ctx, params){
        const { splitArgs } = ctx.state.command;
        const { client } = params;
        if(splitArgs.length===1){
            params.client.getDialogs()
                .then((dialogs) => ctx.scene.enter('add', { dialogs, client }))
                .catch((error) => ctx.reply('⚠️ Sorry, there was an error while retrieving your chats, try again'))
        } else {
            splitArgs[1] = splitArgs[1].startsWith('-100') ? splitArgs[1].substring(4) : splitArgs[1];
            splitArgs[1] = splitArgs[1].replace(/\D/g,'');
            db.query({
                text: 'INSERT INTO redirect(title, origin, destination) VALUES($1, $2, $3)',
                values: splitArgs
            }, (err, res) => {
                if(err){
                    ctx.reply(err.message)
                } else {
                    ctx.reply('📨 Redirect added successfully');
                }
            })
        }
    }
}