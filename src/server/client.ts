import {StringSession} from "telegram/sessions/index.js";
import {TelegramClient} from "telegram";
import prompts from "prompts";

// @ts-ignore
const API_ID = parseInt(process.env.API_ID, 10);
const API_HASH = process.env.API_HASH as string;
const API_SESSION = process.env.API_SESSION as string;

export default async function Client(): Promise<TelegramClient> {
  const session = new StringSession(API_SESSION)

  const client = new TelegramClient(session, API_ID, API_HASH, {
    connectionRetries: 5,
  });

  const isInteractive = process.argv.includes('--interactive');

  await client.start(
    isInteractive
      ? INTERACTIVE_CLIENT
      : AUTOMATED_CLIENT
  );

  console.log('Logged in!');

  if (isInteractive && !API_SESSION) {
    console.log('Please save the session to the ENV variable:');
    console.log(client.session.save());
  }

  return client;
}

const INTERACTIVE_CLIENT = {
  phoneNumber: async () => {
    const response = await prompts({
      type: 'text',
      name: 'value',
      message: 'Please enter your number:',
    })
    return response.value
  },
  password: async () => {
    const response = await prompts({
      type: 'password',
      name: 'value',
      message: 'Please enter your password:',
    })
    return response.value
  },
  phoneCode: async () => {
    const response = await prompts({
      type: 'text',
      name: 'value',
      message: 'Please enter the code you received:',
    })
    return response.value
  },
  onError: (err: any) => console.log(err),
}

const loginCallback = async () => {
  console.error('Not logged in!')
  process.exit(1)
}

const AUTOMATED_CLIENT = {
  phoneNumber: loginCallback,
  password: loginCallback,
  phoneCode: loginCallback,
  onError: (err: any) => console.log(err),
}