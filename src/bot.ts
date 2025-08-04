import 'dotenv/config'
import {Telegraf} from "telegraf";

const BOT_TOKEN = process.env.BOT_TOKEN as string;
const MY_ID = parseInt(process.env.MY_ID as string, 10);

const bot = new Telegraf(BOT_TOKEN);

bot.use(async (ctx, next) => {
  // @ts-ignore
  const updateMessage: any = ctx.update?.message;

  console.log(updateMessage);

  if (
    !updateMessage ||
    updateMessage?.from?.id !== MY_ID ||
    updateMessage?.chat?.id !== MY_ID
  ) {
    return;
  }

  await next()
})

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a custom emoji and I\'ll send it\'s code!'));
bot.on('message', async (ctx) => {
  // @ts-ignore
  const entities = ctx.message.entities || [];

  const emojiEntities = entities.filter((entity: any) => entity.type === 'custom_emoji');

  const response = emojiEntities.reduce((acc: any, entity: any) => {
    acc += '`' + entity.custom_emoji_id + '`\n';

    return acc;
  }, '')

  ctx.reply(
    response,
    {
      parse_mode: 'Markdown'
    }
  );
});

bot.launch();
