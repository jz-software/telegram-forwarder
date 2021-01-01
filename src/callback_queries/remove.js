const db = require('../db');

module.exports = {
    name: /^remove.*$/,
    execute(ctx){
        ctx.answerCbQuery();
        const id = ctx.match[0].split('-')[1];
        db.query('DELETE FROM redirect WHERE id = $1', [id], (err, res) => {
            if (err) throw err;
            ctx.editMessageText('🗑 Redirect deleted successfully');
        })
    }
}