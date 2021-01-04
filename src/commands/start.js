module.exports = {
    name: 'start',
    description: 'Receive a greeting from the bot',
    public: true, 
    execute(ctx){
        const message = '👋 Hi, I can redirect messages from various chats, channels and groups to your own ones.'
            + '\nIf you\'re using this bot for the first time please authenticate with /auth.'
            + ' You can create new redirects using /add and manage them with /dashboard.'
        ctx.replyWithMarkdown(message);
    }
}