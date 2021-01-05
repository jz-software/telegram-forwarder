const WizardScene = require('telegraf/scenes/wizard');
const { Markup, Extra } = require('telegraf');
const Composer = require('telegraf/composer');
const db = require('../db');

function createKeyboard(arr, dialogs, callbackQuery){
  let filtered_dialogs = dialogs.slice(arr[0], arr[1]);
  const buttons = [];
  filtered_dialogs.forEach(element => {
    buttons.push([Markup.callbackButton(element.name, `${callbackQuery};${element.user_id}`)]);
  });
  buttons.push([Markup.callbackButton(' < ', `key-prev`), Markup.callbackButton(' > ', `key-next`)])
  return Extra.markup(Markup.inlineKeyboard(buttons))
}

const handler = new Composer();
handler.action(/^key.*$/, (ctx) => {
  ctx.answerCbQuery();
  const toAdd = ctx.match[0].split('-')[1] === 'prev' ? -5 : 5;
  ctx.wizard.state.arr[0]+=toAdd;
  ctx.wizard.state.arr[1]+=toAdd;
  ctx.editMessageText(ctx.wizard.state.message+ctx.wizard.state.currentRequirement, createKeyboard(ctx.wizard.state.arr, ctx.wizard.state.dialogs, ctx.wizard.state.currentCallbackQuery));
})
handler.action(/^submitOrigin.*$/, (ctx) => {
  ctx.answerCbQuery();
  const originId = ctx.match[0].split(';')[1].startsWith('-100') ? ctx.match[0].split(';')[1].substring(4) : ctx.match[0].split(';')[1];
  ctx.wizard.state.submit.push(originId);
  ctx.wizard.state.origin = ctx.match[0].split(';')[1];
  ctx.wizard.state.currentCallbackQuery = 'submitDestination';
  ctx.wizard.state.message += `\n\nOrigin: ${ctx.wizard.state.submit[0]}`;
  ctx.wizard.state.currentRequirement = '\n\nPlease select the destination chat';
  const { arr, dialogs, currentCallbackQuery, message, currentRequirement } = ctx.wizard.state;
  ctx.editMessageText(message+currentRequirement, createKeyboard(arr, dialogs, currentCallbackQuery));
  return ctx.wizard.next();
})
handler.action(/^submitDestination.*$/, (ctx) => {
  ctx.answerCbQuery();
  ctx.wizard.state.submit.push(ctx.match[0].split(';')[1]);
  ctx.wizard.state.message += `\nDestination: ${ctx.wizard.state.submit[1]}`;
  ctx.wizard.state.currentRequirement = '\n\nPlease send a title for this redirect';
  const { message, currentRequirement } = ctx.wizard.state;
  ctx.editMessageText(message+currentRequirement);
  return ctx.wizard.next();
})
handler.on('text', (ctx) => {
  ctx.wizard.state.submit.push(ctx.message.text);
  ctx.wizard.state.message += `\nTitle: ${ctx.wizard.state.submit[2]}`;
  const { message } = ctx.wizard.state;
  ctx.reply(message+'\n\nDo you want to redirect all the previous messages?', 
    Extra.markup(Markup.inlineKeyboard([
      [Markup.callbackButton('Yes', `previous-true`)],
      [Markup.callbackButton('No', 'previous-false')]
    ]))
  )
  return ctx.wizard.next();
})
handler.action(/^previous.*$/, (ctx) => {
  const prev = ctx.match[0].split('-')[1];
  ctx.wizard.state.prev = prev;
  ctx.wizard.state.message += `\nRecover previous messages: ${prev}`;
  const { message } = ctx.wizard.state;
  ctx.editMessageText(message+'\n\nPlease confirm', Extra.markup(Markup.inlineKeyboard([Markup.callbackButton('Confirm', `submitAll`)])));
  return ctx.wizard.next();
})
handler.action('submitAll', (ctx) => {
  if(ctx.wizard.state.prev == 'true'){
    const script = ctx.wizard.state.client.redirectPreviousMessages(ctx.wizard.state.origin, ctx.wizard.state.submit[1]);
    script.stdout.on('end', function(){
      ctx.wizard.state.client.create();
    })
  }
  db.query('INSERT INTO redirect(origin, destination, title) values ($1, $2, $3)', ctx.wizard.state.submit, (err, res) => {
    if (err) throw err;
    ctx.answerCbQuery();
    ctx.editMessageReplyMarkup(null);
    ctx.wizard.state.client.process.kill('SIGINT');
    ctx.wizard.state.client.create();
    ctx.reply('📨 Redirect added successfully');
    return ctx.scene.leave();
  })
})

const exampleWizard = new WizardScene(
  'add',
  ctx => {
    ctx.wizard.state.arr = [0, 5];
    ctx.wizard.state.submit = [];
    ctx.wizard.state.origin = null;
    ctx.wizard.state.currentCallbackQuery = 'submitOrigin';
    ctx.wizard.state.message = '💬 Redirect creation wizard';
    ctx.wizard.state.currentRequirement = '\n\nPlease select the origin chat';
    const { arr, dialogs, currentCallbackQuery, message, currentRequirement } = ctx.wizard.state;
    ctx.reply(message+currentRequirement, createKeyboard(arr, dialogs, currentCallbackQuery));
    return ctx.wizard.next();
  },
  handler,
  handler,
  handler,
  handler,
  handler
);

module.exports = exampleWizard;