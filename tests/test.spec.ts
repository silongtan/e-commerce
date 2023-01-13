import { test, expect } from '@playwright/test'

// const { chromium } = require('playwright');
// (async () => {
//   const browser = await chromium.launch();
//   const page = await browser.newPage();
// })();


test('test1', async ({ page }) => {
  test.slow();
  await page.goto('http://localhost:8080')

  //log in test
  await page.locator("text='Login'").nth(0).click();
  await expect(page).toHaveURL("http://localhost:8080/login");
  await page.locator("id=usernameInput").fill('user1');
  await page.locator("id=passwordInput").fill('user1');
  await page.locator("id=signinbutton").click();

  //add cart test
  await page.locator("text='Add Cart'").nth(0).click();
  await page.locator("id=name-input").fill('2');
  await page.locator("text='OK'").nth(0).click();
  let price1 = 5.5;

  //place order test
  await page.locator("id=placeorderbutton").nth(0).click();
  await page.locator("text='My Order'").nth(0).click();
  await expect(page).toHaveURL("http://localhost:8080/orders");
  //order correctness
  await expect(page.locator('table').locator('tr').nth(-1).locator('td').nth(3)).toContainText('11');


  //edit/delete test
  //edit
  await page.goto('http://localhost:8080')
  await page.locator("text='Add Cart'").nth(0).click();
  await page.locator("id=name-input").fill('2');
  await page.locator("text='OK'").nth(0).click();
  await page.locator("text='Edit'").nth(0).click();
  await page.locator("text='Update'").nth(0).click();

  //delete
  await page.locator("text='Delete'").nth(0).click();
  
  //add cart test
  
  await page.locator("text='Add Cart'").nth(1).click();
  await page.locator("id=name-input").fill('4');
  await page.locator("text='OK'").nth(0).click();
  //place order test
  await page.locator("id=placeorderbutton").nth(0).click();
  await page.locator("text='My Order'").nth(0).click();
  await expect(page).toHaveURL("http://localhost:8080/orders");
  
  //order correctness
  await expect(page.locator('table').locator('tr').nth(-1).locator('td').nth(3)).toContainText('11');


  await page.goto('http://localhost:8080')
  await page.locator("text='Add Cart'").nth(2).click();
  await page.locator("id=name-input").fill('2');
  await page.locator("text='OK'").nth(0).click();
  let price3 = 1;
  //place order test
  await page.locator("id=placeorderbutton").nth(0).click();
  await page.locator("text='My Order'").nth(0).click();
  await expect(page).toHaveURL("http://localhost:8080/orders");
  //order correctness
  await expect(page.locator('table').locator('tr').nth(-1).locator('td').nth(3)).toContainText('2');



});
