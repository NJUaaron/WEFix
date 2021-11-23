const FTFixer = require('@aaronxyliu/ftfixer');
const a =2;
const {Builder, By, Key} = require('selenium-webdriver');

test('e2e test', async () => {
    const driver = await new Builder()         .forBrowser('firefox')         .build();   // Initialize WebDriver
    await FTFixer.before_cmd(driver);await driver.get('http://localhost:5000');await FTFixer.after_cmd(driver, 'test/hello.js', 7, 4, `await driver.get('http://localhost:5000');`);
    await FTFixer.before_cmd(driver);await driver.findElement(By.id('name')).sendKeys('Aaron');await FTFixer.after_cmd(driver, 'test/hello.js', 8, 4, `await driver.findElement(By.id('name')).sendKeys('Aaron');`);
    await FTFixer.before_cmd(driver);await driver.findElement(By.id('email')).sendKeys('aaron@gmail.com', Key.ENTER);await FTFixer.after_cmd(driver, 'test/hello.js', 9, 4, `await driver.findElement(By.id('email')).sendKeys('aaron@gmail.com', Key.ENTER);`);
    
    await FTFixer.before_cmd(driver);var mListElement = await driver.findElement(By.id('mList'));await FTFixer.after_cmd(driver, 'test/hello.js', 11, 4, `var mListElement = await driver.findElement(By.id('mList'));`);
    var mList = await mListElement.findElements(By.className('mInfo'));
    expect(mList.length).toBe(3);
    driver.close();
});