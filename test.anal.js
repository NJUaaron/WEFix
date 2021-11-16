const FTFixer = require('../index');
const a =2;
const {Builder, By, Key} = require('selenium-webdriver');

test('e2e test', async () => {
    const driver = await new Builder()         .forBrowser('firefox')         .build();await driver.executeScript(FTFixer.START_MO_SNIPPET);   // Initialize WebDriver
    await FTTest.before_cmd(driver);await driver.get('http://localhost:5000');await FTTest.after_cmd(driver, 'test/hello.js', 7, 4);

    
    await FTTest.before_cmd(driver);var A = await driver.findElement(By.id('name')).sendKeys('Aaron');await FTTest.after_cmd(driver, 'test/hello.js', 10, 4);
    await FTTest.before_cmd(driver);await driver.findElement(By.id('email')).sendKeys('aaron@gmail.com', Key.ENTER);await FTTest.after_cmd(driver, 'test/hello.js', 11, 4);
    //wait 
    
    await FTTest.before_cmd(driver);var mListElement = await driver.findElement(By.id('mList'));await FTTest.after_cmd(driver, 'test/hello.js', 14, 4);
    var mList = await mListElement.findElements(By.className('mInfo'));
    expect(mList.length).toBe(3);
    await FTTest.before_cmd(driver);driver.close();await FTTest.after_cmd(driver, 'test/hello.js', 17, 4);
});