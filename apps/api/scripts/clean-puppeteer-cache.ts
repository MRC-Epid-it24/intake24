import puppeteer from 'puppeteer';

const main = async () => {
  await puppeteer.trimCache();
};

main().catch((err) => {
  console.error(err);

  process.exitCode = process.exitCode ?? 1;
  process.exit();
});
