const WizardScene = require('telegraf/scenes/wizard');
const exampleWizard = new WizardScene(
  'auth',
  ctx => {
    return ctx.wizard.next();
  },
  ctx => {
    ctx.wizard.state.client.stdin.write(`${ctx.message.text}\n`);
    ctx.reply("🔢 Send me the code you received");
    return ctx.wizard.next();
  },
  ctx => {
    ctx.wizard.state.client.stdout.on('data', function(data){
      const message = data.toString().trim();
      ctx.wizard.state.client.stdin.write(`\n`);
    });
    ctx.wizard.state.client.stdin.write(`${ctx.message.text.substring(1)}\n`);
    ctx.reply(`✅ You were authenticated successfully`);
    return ctx.scene.leave();
  }
);

module.exports = exampleWizard;