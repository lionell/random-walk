const puppeteer = require('puppeteer');
const http = require('http');

let externalIP = 'UNKNOWN';
http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, resp => {
    resp.on('data', ip => {
        externalIP = ip;
    });
});

Array.prototype.asyncMap = function(func) {
    return Promise.all(this.map(func));
};

Array.prototype.asyncFilter = async function(func) {
    const ok = await this.asyncMap(func);
    return this.filter((_, i) => ok[i]);
};

const randint = lim => Math.floor(Math.random() * lim);
const random = l => l[randint(l.length)];
const sleep = millis => new Promise(resolve => setTimeout(resolve, millis));
const checkURL = async (link, domain, visited) => {
    return !visited.includes(link.href)
        && link.href.includes(domain)
        && !link.href.endsWith('.pdf')
        && !link.href.includes('#');
};

let visited = [];

const walk = async (page, origin, timeout) => {
    const domain = (new URL(origin)).hostname;

    const findLinks = async page => {
        const selector = 'a[href]';
        await page.waitForSelector(selector);
        const as = await page.$$(selector);

        console.log(`Going through ${as.length} URLs`);
        const ok = await as.asyncFilter(async h => await h.evaluate(checkURL, domain, visited));
        if (ok.length == 0) {
            console.log('No links to follow. Trying to backtrack');
            page.goBack();
            return await findLinks(page);
        }
        return ok;
    };

    const start = Date.now();
    let hops = 0;
    while (Date.now() - start < timeout) {
        const current = await page.url();
        console.log(`I'm at ${current}`);
        visited.push(current);

        const links = await findLinks(page);
        console.log(`Found ${links.length} URLs to follow`);

        await random(links).evaluate(n => n.click());
        await page.waitForTimeout(3 * 1000 + randint(5 * 1000));
        hops++;
    }
    return hops;
};

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.exercise = async (req, res) => {
    const target = req.query.target || req.body.target;
    const timeout = (req.query.timeout || req.body.timeout || 3 * 60) * 1000;

    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        defaultViewport: { width: 1280, height: 720 },
        headless: true
    });

    let received = 0;
    const page = await browser.newPage();
    page.setCacheEnabled(false);
    page.setDefaultTimeout(3 * 60 * 1000);
    page.on('response', async resp => {
        try { received += Buffer.byteLength(await resp.buffer()); }
        catch (_) { }
    });

    try {
        await page.goto(target, { waitUntil: 'domcontentloaded'});
        const hops = await walk(page, await page.url(), timeout);
        res.set('Hops', hops).set('Status', 'OK');
    } catch(err) {
        console.log(err);
        res.set('Status', err.toString());
    } finally {
        const finalURL = await page.url();
        const img = await page.screenshot();
        await browser.close();

        res.set('Final-URL', finalURL);
        res.set('External-IP', externalIP);
        res.set('Bytes-Received', received);
        console.log(res.getHeaders());
        res.type('png').send(img);
    }
};
