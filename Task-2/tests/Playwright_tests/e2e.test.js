const { test, describe, beforeEach, afterEach, beforeAll, afterAll, expect } = require('@playwright/test');
const { chromium } = require('playwright');

const host = 'http://localhost:3000'; // Application host (NOT service host - that can be anything)

let browser;
let context;
let page;

let user = {
    email : "",
    password : "123456",
    confirmPass : "123456",
};

describe("e2e tests", () => {
    beforeAll(async () => {
        browser = await chromium.launch();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });

    
    describe("authentication", () => {
        test('Register make correct api call', async()=>{
            await page.goto(host);
            await page.click('text=Register');
            await page.waitForSelector('form');

            let random = Math.floor(Math.random()* 10000);
            user.email = `email${random}@abv.bg`;

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.locator('#repeat-pass').fill(user.confirmPass);

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/register') && response.status()== 200),
                page.click('[type="submit"]')
            ]);
            let userData = await response.json();

            await expect(response.ok()).toBeTruthy();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
        });

        test('Login makes correct API call', async () =>{
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/login') && response.status() == 200),
                page.click('[type="submit"]')
            ]);
            let userData = await response.json();
            
            await expect(response.ok()).toBeTruthy();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);


        });

        test('Logout makes the correct API call', async()=>{
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/logout') && response.status() == 204),
                page.click('text=Logout')
            ]);
            await expect(response.ok()).toBeTruthy();
            await page.waitForSelector('text=Login');
            await expect(page.url()).toBe(host + '/');
        })
    })

    describe("navbar", () => {
        
        
        
        test('Logged in user sees correct buttons', async ()=>{
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');


            await expect(page.locator('nav >> text=Dashboard')).toBeVisible();
            await expect(page.locator('nav >> text=My Books')).toBeVisible();
            await expect(page.locator('nav >> text=Add Book')).toBeVisible();
            await expect(page.locator('nav >> text=Logout')).toBeVisible();
            await expect(page.locator('Nav >> text=Login')).toBeHidden();
            await expect(page.locator('Nav >> text=Register')).toBeHidden();
        });

        test('Guest user sees the correct buttons on navbar', async()=>{
            await page.goto(host);

            await expect(page.locator('nav >> text=Dashboard')).toBeVisible();
            await expect(page.locator('nav >> text=My Books')).toBeHidden();
            await expect(page.locator('nav >> text=Add Book')).toBeHidden();
            await expect(page.locator('nav >> text=Logout')).toBeHidden();
            await expect(page.locator('Nav >> text=Login')).toBeVisible();
            await expect(page.locator('Nav >> text=Register')).toBeVisible();
        })
        
    });

    describe("CRUD", () => {
        beforeEach(async()=>{
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');
        });

        test('create book functionality', async()=>{
            await page.click('text=Add Book');
            await page.waitForSelector('form');

            await page.fill('[name="title"]', 'Random title');
            await page.fill('[name="description"]', 'Random description');
            await page.fill('[name="imageUrl"]', '/images/book.png');
            await page.locator('#type').selectOption('Other');

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/books') && response.status() == 200),
                page.click('[type="submit"]')
            ])

            let eventData = await response.json();

            expect(response.ok()).toBeTruthy();

            expect(eventData.title).toEqual('Random title');
            expect(eventData.description).toEqual('Random description');
            expect(eventData.imageUrl).toEqual('/images/book.png');
            expect(eventData.type).toEqual('Other');
            
        })

        test('edit book functionality makes correct API call', async()=>{
            await page.click('text=My Books');
            await page.waitForSelector('#my-books-page');
            await page.locator('text=Details').first().click();
            await page.click('text=Edit');


            await page.locator('#title').fill('Edited title');
            await page.locator('#type').selectOption('Other');


            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/books') && response.status() == 200),
                page.click('[type="submit"]')
            ])
            let eventData = await response.json();

            expect(response.ok()).toBeTruthy();

            expect(eventData.title).toEqual('Edited title');
            expect(eventData.description).toEqual('Random description');
            expect(eventData.imageUrl).toEqual('/images/book.png');
            expect(eventData.type).toEqual('Other');
        });

        test('Delete book functionality makes correct API call', async ()=>{
            await page.click('text=My Books');
            await page.waitForSelector('#my-books-page');
            await page.locator('text=Details').first().click();
           

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/books') && response.status() == 200),
                page.click('text=Delete')
            ]);
            expect(response.ok()).toBeTruthy();
        })
    })
})