const fs = require("fs");
const axios = require("axios");
const { HttpsProxyAgent } = require('https-proxy-agent')


class Spoilerplus {
    browser = null;
    page = null;
    proxies = [
        'http://user49013:Oh9ediTxVN@154.202.0.14:49013',
        'http://user49026:9RjpSArKKs@23.157.216.182:49026',
        'http://user49117:5UIsBqQKiF@23.142.82.246:49117'
    ];

    sleep = (waitTimeInMs) => new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

    constructor(browser) {
        this.browser = browser;
        this.page = null;
    }

    async getProxy() {
        return this.proxies[Math.floor(Math.random() * this.proxies.length)];
    }


    async _init() {
        this.page = await this.browser.newPage();

        await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await this.page.setViewport({ width: 836, height: 1080 });

        await this.page.setRequestInterception(true);
        this.page.on('request', async (request) => {

            if (request.url().includes('spoilerplus') && (request.resourceType() === 'document' || request.url().includes('.js') || request.url().includes('.css'))) {
                const response = await axios.get(request.url(), {
                    proxy: false,
                    headers: {
                        'Referer': 'https://spoilerplus.tv/',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    },
                    httpsAgent: new HttpsProxyAgent(
                        await this.getProxy()
                    )
                });

                const data = response.data;

                await request.respond({
                    status: 200,
                    headers: response.headers,
                    body: data,
                });

                return;
            }

            if (request.resourceType() === 'image' && request.url().includes('cdn1.mangarawspoiler.co')) {
                const url = `https://image.klmanga.onl/image?url=${request.url()}`;

                const response = await axios.get(url, {
                    responseType: 'arraybuffer',
                });

                const data = Buffer.from(response.data, 'binary');

                await request.respond({
                    status: 200,
                    headers: response.headers,
                    body: data,
                });

                return
            }

            await request.continue();
        });
    }

    async getImages(url, path) {
        await this._init();
        await this.page.goto(url, {
            waitUntil: 'domcontentloaded', 
        });

        const elements = await this.page.$$("#post-comic .ct");

        const images = [];

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            await element.scrollIntoView();


            await element.waitForSelector("canvas", {
                visible: true,
                timeout: 10000,
            });

            const canvas = await element.$("canvas");


            await this.page.waitForFunction(
                (element) => {
                    const canvas = element.querySelector("canvas");

                    return canvas && canvas.height > 1;
                },
                {
                    timeout: 10000,
                    polling: 50
                },
                element
            );


            const image = await this.page.evaluate((canvas) => {
                return canvas.toDataURL();
            }, canvas);

            const base64Image = image.replace(/^data:image\/png;base64,/, "");


            const ROOT_DIR = `./public/images/${path}`;

            if (!fs.existsSync(ROOT_DIR)) {
                await fs.promises.mkdir(ROOT_DIR, { recursive: true });
            }

            fs.writeFileSync(`${ROOT_DIR}/${i}.JPEG`, base64Image, 'base64');

            images.push(`${process.env.APP_URL}/images/${path}/${i}.JPEG`);

            await this.page.evaluate(() => {
                window.scrollBy(0, window.innerHeight);
            });
        }

        await this.page.close();

        return images;
    }
}

module.exports = Spoilerplus;