const WizardScene = require('telegraf/scenes/wizard');
const exampleWizard = new WizardScene(
  'auth',
  ctx => {
    return ctx.wizard.next();
  },
  ctx => {
    ctx.wizard.state.client.stdin.write(`${ctx.message.text}\n`);
    ctx.reply("Send me the code you received");
    return ctx.wizard.next();
  },
  ctx => {
    ctx.wizard.state.client.stdout.on('data', function(data){
      const message = data.toString().trim();
      ctx.reply(`You were authenticated successfuly\n\n${message}`);
      ctx.wizard.state.client.stdin.write(`\n`);
    });
    ctx.wizard.state.client.stdin.write(`${ctx.message.text.substring(1)}\n`);
    return ctx.scene.leave();
  }
);

module.exports = exampleWizard;