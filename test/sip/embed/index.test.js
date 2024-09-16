// const { setBrowserPermission, visitIndexPage } = require("./steps/common");

// const { IframeWidget } = require("./steps/IframeWidget");

// describe("Index page test", () => {
//     beforeAll(async () => {
//         await setBrowserPermission();
//         await visitIndexPage();
//     });

//     it('should display "RingCentral Embeddable" text on page', async () => {
//         const title = await page.$eval("h1", (el) => el.innerText);
//         expect(title).toContain("RingCentral Embeddable");
//     });

//     it("should get SignIn in widget iframe", async () => {
//         const widgetIframe = new IframeWidget();
//         await widgetIframe.loadElement();
//         await widgetIframe.waitForLoginPage();
//         await page.waitForTimeout(1000);
//         const loginText = await widgetIframe.getLoginButtonText();
//         expect(loginText).toEqual("Sign In");
//     });
// });

const { setBrowserPermission, visitIndexPage } = require("./steps/common");
const { IframeWidget } = require("./steps/IframeWidget");
const { test, expect } = require("@playwright/test");

test.describe("Index page test", () => {
    test.beforeAll(async () => {
        await setBrowserPermission();
        await visitIndexPage();
    });

    test('should display "RingCentral Embeddable" text on page', async ({
        page,
    }) => {
        const title = await page.$eval("h1", (el) => el.innerText);
        expect(title).toContain("RingCentral Embeddable");
    });

    test("should get Sign In in widget iframe", async ({ page }) => {
        const widgetIframe = new IframeWidget();
        await widgetIframe.loadElement();
        await widgetIframe.waitForLoginPage();
        await page.waitForTimeout(1000);
        const loginText = await widgetIframe.getLoginButtonText();
        expect(loginText).toEqual("Sign In");
    });
});
