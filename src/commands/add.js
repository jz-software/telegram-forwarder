const db = require('../db')

module.exports = {
    name: 'add',
    description: 'Create a new redirect',
    public: true, 
    execute(ctx){
        db.query({
            text: 'INSERT INTO redirect(title, origin, destination) VALUES($1, $2, $3)',
            values: ctx.state.command.splitArgs
        }, (err, res) => {
            if(err){
                ctx.reply(err.message)
            }
        })
    }
}