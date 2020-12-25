const WizardScene = require('telegraf/scenes/wizard');
const exampleWizard = new WizardScene(
  'example-wizard',
  ctx => {
    ctx.reply("What's your name?");
    ctx.wizard.state.data = {};
    return ctx.wizard.next();
  },
  ctx => {
    ctx.wizard.state.data.name = ctx.message.text;
    ctx.reply(`Your name is ${ctx.wizard.state.data.name}`);
    return ctx.scene.leave();
  }
);

module.exports = exampleWizard;