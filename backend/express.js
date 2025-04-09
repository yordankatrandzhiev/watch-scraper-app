const express = require("express");
const cheerio = require("cheerio");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
app.use(cors());

app.get("/api/watches", async (req, res) => {
  try {
    const html = await scrapeAllLots(); // 👈 Use Puppeteer to get full page HTML
    const $ = cheerio.load(html);
    const lots = [];

    $('div[data-testid^="lot-card-container-"]').each((i, el) => {
      const container = $(el);
      const anchor = container.find("a.c-lot-card");

      const title = anchor.find("p.c-lot-card__title").text().trim();
      const price = anchor.find("p.c-lot-card__price").text().trim();
      const timeLeft = anchor.find("time").text().trim();
      const imageUrl = anchor.find("img.c-lot-card__image-element").attr("src");
      const link = anchor.attr("href");

      lots.push({
        title,
        price,
        timeLeft,
        imageUrl,
        url: `${link}`,
      });
    });

    // Sort the lots array by timeLeft
    lots.sort((a, b) => {
      const parseTimeLeft = (time) => {
        if (!time || typeof time !== "string") return Infinity; // Handle missing or invalid timeLeft

        const match = time.match(/(\d+)\s*(min|hour|day)/i);
        if (!match) return Infinity; // Default for unrecognized formats

        const value = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();

        if (unit === "min") return value;
        if (unit === "hour") return value * 60;
        if (unit === "day") return value * 1440;

        return Infinity; // Default for unexpected units
      };

      return parseTimeLeft(a.timeLeft) - parseTimeLeft(b.timeLeft);
    });

    console.log(`✅ Scraped ${lots.length} watches`);

    res.json(lots);
  } catch (err) {
    console.error("❌ Scraping error:", err.message);
    res.status(500).send("Scraping failed");
  }
});

async function scrapeAllLots() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(
    "https://www.catawiki.com/en/c/333-watches?filters=909%255B%255D%3D60960%26budget%255B%255D%3D-100%26bidding_end_days%255B%255D%3D20250408",
    {
      waitUntil: "networkidle2",
    }
  );

  // Scroll to load more items
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await new Promise((resolve) => setTimeout(resolve, 1500)); // 👈 fallback instead of page.waitForTimeout
  }

  const html = await page.content();
  await browser.close();

  return html;
}

app.listen(3000, () => {
  console.log("✅ Server is running on http://localhost:3000");
});
