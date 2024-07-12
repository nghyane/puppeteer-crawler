const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer');
const puppeteer = require('puppeteer-extra');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const express = require('express');
const dotenv = require('dotenv');
const cron = require('node-cron');
const fs = require('fs');

dotenv.config();

const Spoilerplus = require('./spoilerplus');

puppeteer.use(
    AdblockerPlugin({
        interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY
    })
);
puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security', 
            '--enable-features=NetworkService',
            '--ignore-certificate-errors',
            '--disable-infobars',
            '--disable-features=site-per-process,TranslateUI,BlinkGenPropertyTrees,AudioServiceOutOfProcess,WebXR,WebXRGamepadSupport,OpenVR',
        ]
    });

    const spoilerplus = new Spoilerplus(browser);
    const app = express();

    app.get('/', (req, res) => {
        res.json({
            message: 'OK'
        });
    });

    app.get('/spoilerplus', async (req, res) => {
        const url = req.query.url;
        const path = req.query.path || 'tmp';

        if (!url) {
            return res.status(400).json({
                message: 'URL is required'
            });
        }

        try {
            const data = await spoilerplus.getImages(url, path);

            res.json({
                message: 'OK',
                data: data
            });
        } catch (error) {
            res.status(500).json({
                message: 'An error occurred',
                error: error.message
            });
        }
    });

    app.use(express.static('public'));


    app.listen(process.env.PORT || 3000, () => {
        console.log('Server is running on http://localhost:3000');
    });

    cron.schedule('*/30 * * * *', async () => {
        const ROOT_DIR = './public/images';

        const files = await fs.promises.readdir(ROOT_DIR);

        for (const file of files) {
            const path = `${ROOT_DIR}/${file}`;

            const stat = await fs.promises.stat(path);

            if (stat.isDirectory()) {
                const files = await fs.promises.readdir(path);

                for (const file of files) {
                    await fs.promises.unlink(`${path}/${file}`);
                }

                await fs.promises.rmdir(path);
            }
        }
    });

    process.on('SIGINT', async () => {
        await browser.close();
        process.exit();
    });
})();
