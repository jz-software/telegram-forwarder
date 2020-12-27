const WizardScene = require('telegraf/scenes/wizard');
const exampleWizard = new WizardScene(
  'auth',
  ctx => {
    ctx.wizard.state.client.stdout.on('end', function(){
      ctx.reply('🚫 Sorry, there was an error, please try again');
      return ctx.scene.leave();
    });
    return ctx.wizard.next();
  },
  ctx => {
    if(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(ctx.message.text)){
      ctx.wizard.state.client.stdin.write(`${ctx.message.text}\n`);
      ctx.reply("🔢 Send me the code you received");
      return ctx.wizard.next();
    } else {
      ctx.reply('📵 Sorry, this phone number is not valid. Please try again');
    }
  },
  ctx => {
    ctx.wizard.state.client.stdout.on('data', function(data){
      const message = data.toString().trim();
      if(message==='auth:success'){
        ctx.reply(`✅ You were authenticated successfully`);
        ctx.wizard.state.client.stdin.write(`\n`);
      } else {
        ctx.reply('🚫 Sorry, there was an error, please try again');
      }
    });
    ctx.wizard.state.client.stdin.write(`${ctx.message.text}\n`);
    return ctx.scene.leave();
  }
);

module.exports = exampleWizard;