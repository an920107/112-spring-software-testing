import puppeteer from "puppeteer";

(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({width: 1080, height: 1024});

    // Navigate the page to a URL
    await page.goto('https://pptr.dev/');

    // Click search button
    const searchBox = await page.waitForSelector(".DocSearch-Button");
    await searchBox?.click();

    // Type into search box
    const searchInput = await page.waitForSelector("#docsearch-input");
    await page.type("#docsearch-input", "chipi chipi chapa chapa", {delay: 100});
    
    // Get the `Docs` result section
    const searchDocResult = await page.waitForSelector("li#docsearch-item-5");
    await searchDocResult?.click();

    // Locate the title
    const h1Element = await page.waitForSelector("h1");
    
    // Print the title
    console.log(await page.evaluate(el => el?.textContent, h1Element));

    // Close the browser
    await browser.close();
})();
