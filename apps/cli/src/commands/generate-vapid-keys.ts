import webPush from 'web-push';

export default async (): Promise<void> => {
  const vapidKeys = webPush.generateVAPIDKeys();

  process.stdout.write(`Public key: ${vapidKeys.publicKey}\n`);
  process.stdout.write(`Private key: ${vapidKeys.privateKey}\n`);
};
