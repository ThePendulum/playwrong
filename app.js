import { chromium } from 'playwright';
import Bottleneck from 'bottleneck';
import why from 'why-is-node-running';

const limiter = new Bottleneck({
    maxConcurrent: 2,
    minTime: 100,
});

const clients = new Map();

async function getClient(scope = 'main') {
    if (clients.has(scope)) {
	return clients.get(scope);
    }

    const browser = await chromium.launch({
	    headless: false,
    });

    const client = { browser };

    if (scope) {
	clients.set(scope, client);
    }

    return client;
}

async function closeAllBrowsers() {
    await Promise.all(Array.from(clients.values()).map(async (client) => client.browser.close()));
}

async function fetchPage() {
    return limiter.schedule(async () => {
	const { browser } = await getClient();
	const context = await browser.newContext();
	const page = await context.newPage();

	const url = `https://tools-httpstatus.pickup-services.com/200?sleep=${Math.floor(Math.random() * 500)}`;
	const res = await page.goto(url);

	console.log(res.status(), url);

	await page.close();
	await context.close();
    });
}

let done = false;

async function monitor() {
    setTimeout(() => {
	why();

	if (!done) {
	    monitor();
	}
    }, 5000);
}

async function init() {
    await Promise.all(Array.from({ length: 5 }).map(async () => {
	await fetchPage();
    }));

    monitor();

    await closeAllBrowsers();

    done = true;
}

init();
