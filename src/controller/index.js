const { dialog, BrowserWindow, ipcMain } = require('electron');
const puppeteer = require('puppeteer');
const fs = require('fs');

const miruQuery = require('../helper/index.js');

class handleEvent {
  /*
    handle event when match
  */

  linkManga(event, { url }) {
    // transfrom or validate before clone
    ipcMain.emit('miru:start-clone', { linkManga: url });
  }

  async startClone({ linkManga }) {
    // receive url to exec download manga
    const mangaTarget = linkManga;
    const cloneChapterStart = undefined || undefined; // undefined or typeof number
    const cloneChapterEnd = undefined || undefined; // undefined or typeof number

    // init new chrome process
    const browser = await puppeteer.launch({
      headless: true,
      // headless: false,
      args: ['--disable-software-rasterizer', '--disable-gpu'],
    });

    // wait for page load content done!
    const page = await browser.newPage();
    await page.goto(mangaTarget);
    await page.waitForSelector('.manga-detail');

    // query get content from DOM

    const nameManga = await miruQuery.prop({ page, query: '.entry-title > a', property: 'textContent' });
    const thumbNail = await miruQuery.attr({ page, query: '.thumbnail > img', attribute: 'src' });
    const elementDesc = await miruQuery.prop({ page, query: '.detail > .content', property: 'textContent' });
    const elementNameOther = await miruQuery.prop({
      page,
      query: '.description span.color-red',
      property: 'textContent',
    });
    const elementNameAuthor = await miruQuery.prop({
      page,
      query: '.description a.label.label-info',
      property: 'textContent',
    });
    const elementTeamTranslate = await miruQuery.prop({
      page,
      query: '.description span.translater a',
      property: 'textContent',
    });
    // get category of manga
    const elementCategory = await miruQuery.mix({
      page,
      method: '$$eval',
      query: '.description p span.category a',
      cb(element) {
        return element.map((category) => category?.textContent);
      },
    });
    // get user post manga of manga on blogtruyen
    const userPost = await miruQuery.mix({
      page,
      query: '.description p a.color-u-1',
      cb(element) {
        return {
          name: String(element.textContent).trim(),
          linkUserOnBlogTruyen: element.getAttribute('href'),
        };
      },
    });
    // get user post last entry update manga of manga on blogtruyen
    const lastEntryUpdate = await miruQuery.mix({
      page,
      query: '.description .col-sm-6 span.color-green',
      cb(element) {
        const dateTemp = String(element.textContent).trim().split(' ');
        return {
          data: dateTemp[0],
          hour: dateTemp[1],
        };
      },
    });
    // get all element chapter of manga on blogtruyen
    const chapters = await miruQuery.mix({
      page,
      method: '$$eval',
      query: '#list-chapters > p > span.title > a',
      cb(elements, cloneChapterStart, cloneChapterEnd) {
        elements = elements.reverse();
        const list = elements.map((item, index) => {
          if (
            (cloneChapterStart === undefined && cloneChapterEnd === undefined) ||
            (index + 1 >= cloneChapterStart && index + 1 <= cloneChapterEnd)
          ) {
            return {
              nameChapter: item.textContent,
              linkChapter: 'https://blogtruyen.vn' + item.getAttribute('href'),
            };
          }
        });
        return list.filter((value) => value !== null);
      },
      args: [cloneChapterStart, cloneChapterEnd],
    });

    console.log({
      nameManga: nameManga,
      thumbNail: thumbNail,
      elementDesc: elementDesc,
      elementNameOther: elementNameOther,
      elementNameAuthor: elementNameAuthor,
      elementTeamTranslate: elementTeamTranslate,
      elementCategory,
      userPost,
      lastEntryUpdate,
      chapters,
    });
  }

  async choosePathSave({ event, arg, mainWindow }) {
    let options = {
      title: 'select floder',
      defaultPath: 'D:\\electron-app',
      buttonLabel: 'Choose this floder',
      properties: ['openDirectory'],
    };
    let dialogInit = await dialog.showOpenDialog(mainWindow, options);
    if (!dialogInit.canceled && dialogInit.filePaths) {
      mainWindow.webContents.send('miru:save--path-storage', {
        pathStorage: dialogInit.filePaths[0],
      });
    }
  }
}

module.exports = new handleEvent();
