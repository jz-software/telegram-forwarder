module.exports = {
    name: 'auth',
    description: 'Authenticate',
    public: true, 
    execute(ctx, params){
        const { client } = params;
        ctx.scene.enter('auth', { client });
        ctx.reply('📱 Send me your phone number');
    }
}