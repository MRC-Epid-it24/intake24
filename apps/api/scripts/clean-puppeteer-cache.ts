import puppeteer from 'puppeteer';

async function main() {
  await puppeteer.trimCache();
}

main().catch((err) => {
  console.error(err);

  process.exitCode = process.exitCode ?? 1;
  process.exit();
});
