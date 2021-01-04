const db = require('../db');
const dashboard = require('./dashboard');

module.exports = {
    name: /^edit.*$/,
    execute(ctx){
        ctx.answerCbQuery();
        const params = ctx.match[0].split('-')[1].split(';');
        db.query(`UPDATE redirect SET ${params[1]} = ${params[2]} WHERE id = $1`, [params[0]], (err, res) => {
            if (err) throw err;
            ctx.match[0] = `dashboard-${params[0]}`;
            dashboard.execute(ctx);
        })
    }
}