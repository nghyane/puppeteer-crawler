// https://www.bing.com/search?q=Bing+AI&showconv=1&FORM=hpcodx

const puppeteer = require('puppeteer-extra');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');


puppeteer.use(
    AdblockerPlugin({
        blockTrackers: true
    })
);

puppeteer.use(StealthPlugin());

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: "./user_data",
    });

    const page = (await browser.pages())[0];

    await page.goto('https://www.bing.com/chat', {
        waitUntil: 'domcontentloaded',
    });

    await delay(1000);

    const MANGA_NAME = "ハーレム王の異世界プレス漫遊記　～最強無双のおじさんはあらゆる種族を嫁にする～.";

    const text = `
Find and compile detailed information about the manga ${MANGA_NAME}.

Please provide the following information:
- The initial release date of the manga.
- The scheduled or actual release date of the final volume, if available.

Provide a detailed summary of the manga's plot, including:
- The setting: Describe the world or universe where the story takes place.
- Main characters: Provide information about the central characters, including their roles, relationships, and character development.
- Significant events: Outline key plot points, major turning points, and any important conflicts or resolutions that drive the story forward. 

The summary should cover the major arcs and developments, capturing the essence of the story and its progression. (minimum 600 words)

Describe the genre and main themes of the manga.

Provide information about the author, including their name and any relevant details about their background, if available.

`;


    const searchbox = await page.waitForSelector(">>> #searchbox", { timeout: 0 });


    await page.evaluate((searchbox, text) => {
        searchbox.value = text;
    }, searchbox, text);

    await page.focus(">>> #searchbox");

    await page.keyboard.type("  ", { delay: 160 });


    await page.keyboard.press('Enter', { delay: 160 });

    await page.waitForSelector(">>> cib-message-group.response-message-group");

    await page.waitForSelector(">>> .privacy-statement", { timeout: 0 });

    const shared_element = await page.waitForSelector(">>> cib-shared > div > div > div.ac-textBlock", { timeout: 0 });

    // remove tag sup before get textContent
    await shared_element.evaluate(el => {
        let sups = el.querySelectorAll("sup");
        for (let i = 0; i < sups.length; i++) {
            sups[i].remove();
        }
    });

    let value = await shared_element.evaluate(el => el.textContent);


    console.log(value);

    // await browser.close();
})();