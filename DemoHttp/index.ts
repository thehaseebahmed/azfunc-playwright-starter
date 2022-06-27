import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { chromium } from "playwright";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  let browser;

  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(req.query.url || "https://google.com/");
    const screenshot = await page.screenshot({ fullPage: true });

    context.res = {
      body: screenshot,
      headers: {
        "content-type": "image/png",
      },
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: { mesage: "Something went wrong. Please try again." },
      headers: {
        "content-type": "application/json",
      },
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export default httpTrigger;
