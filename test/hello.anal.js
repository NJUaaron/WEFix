const a =2;
const {Builder, By, Key} = require('selenium-webdriver');
const FTFixer = require('../index');
async function main(){    const driver = await new Builder()
         .forBrowser('firefox')
         .build()
    await driver.executeScript(FTFixer.START_MO_SNIPPET);
    var mutationsList = [];
   // Initialize WebDriver
    await driver.get('http://localhost:5000')

    await driver.findElement(By.id('name')).sendKeys('Aaron')
    await driver.manage().deleteAllCookies();

    await driver.findElement(By.id('email')).sendKeys('aaron@gmail.com', Key.ENTER)
    await FTFixer.waitFor(2000);
    var cookies = await driver.manage().getCookies();
    var mutations = FTFixer.parseCookie(cookies);
    mutationsList.push(mutations);

    
    var mListElement = await driver.findElement(By.id('mList'))

    var mList = await mListElement.findElements(By.className('mInfo'))

    driver.close()


    console.log(JSON.stringify(mutationsList));
    return;
}
main();