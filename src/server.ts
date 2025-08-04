import 'dotenv/config'
import bigInt from 'big-integer'
import express from 'express'
import {Api, type TelegramClient} from 'telegram'
import Client from "./server/client.js";

// @ts-ignore
const PORT = parseInt(process.env.PORT, 10) || 3000;

async function clearEmojiStatus(client: TelegramClient) {
  await client.invoke(
    new Api.account.UpdateEmojiStatus({
      emojiStatus: new Api.EmojiStatusEmpty
    })
  )
}

async function setEmojiStatus(client: TelegramClient, documentId: bigint) {
  await client.invoke(
    new Api.account.UpdateEmojiStatus({
      emojiStatus: new Api.EmojiStatus({
        documentId: bigInt(documentId)
      })
    })
  )
}

console.log('Initializing...');

const client = await Client();

const app = express();

app.get('/', async (req, res) => {
  if (req.query?.documentId === 'clear') {
    console.log('Status cleared!');
    res.send('Status cleared!');
    // noinspection ES6MissingAwait
    clearEmojiStatus(client);
    return;
  }

  let documentId = req.query?.documentId as string;

  if (!documentId || !/^\d{19}$/.test(documentId)) {
    res.sendStatus(404);
    return;
  }

  console.log('Status updated to: ', documentId);
  res.send('Status updated to: ' + documentId);

  try {
    // @ts-ignore
    await setEmojiStatus(client, bigInt(documentId));
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT);

console.log('Listening on port ' + PORT);