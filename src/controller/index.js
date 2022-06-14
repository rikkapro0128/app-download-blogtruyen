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

  async startClone({ linkManga, mainWindow }) {
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
    mainWindow.webContents.send('miru:update-task', { name: 'Init puppeteer process' });

    // wait for page load content done!
    const page = await browser.newPage();
    await page.goto(mangaTarget);
    await page.waitForSelector('.manga-detail');
    mainWindow.webContents.send('miru:update-task', { name: 'Puppeteer process loaded page' });

    // query get content from DOM

    const nameManga = await miruQuery.prop({ page, query: '.entry-title > a', property: 'textContent' });
    mainWindow.webContents.send('miru:update-task', { name: 'Get name manga', type: 'nameManga' });

    const thumbNailManga = await miruQuery.attr({ page, query: '.thumbnail > img', attribute: 'src' });
    mainWindow.webContents.send('miru:update-task', { name: 'Get thumbnail manga', type: 'thumbNailManga' });

    const descManga = await miruQuery.prop({ page, query: '.detail > .content', property: 'textContent' });
    mainWindow.webContents.send('miru:update-task', { name: 'Get thumbnail manga', type: 'descManga' });

    const nameOther = await miruQuery.prop({
      page,
      query: '.description span.color-red',
      property: 'textContent',
    });
    mainWindow.webContents.send('miru:update-task', { name: 'Get name other manga', type: 'nameOther' });

    const nameAuthor = await miruQuery.prop({
      page,
      query: '.description a.label.label-info',
      property: 'textContent',
    });
    mainWindow.webContents.send('miru:update-task', { name: 'Get name author manga', type: 'nameAuthor' });

    const teamTranslate = await miruQuery.prop({
      page,
      query: '.description span.translater a',
      property: 'textContent',
    });
    mainWindow.webContents.send('miru:update-task', { name: 'Get name team translate manga', type: 'teamTranslate' });

    // get category of manga
    const categorys = await miruQuery.mix({
      page,
      method: '$$eval',
      query: '.description p span.category a',
      cb(element) {
        return element.map((category) => category?.textContent);
      },
    });
    mainWindow.webContents.send('miru:update-task', { name: 'Get categorys of manga', type: 'categorys' });

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
    mainWindow.webContents.send('miru:update-task', { name: 'Get user post this manga', type: 'userPost' });
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
    mainWindow.webContents.send('miru:update-task', {
      name: 'Get last entry update this manga',
      type: 'lastEntryUpdate',
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
    mainWindow.webContents.send('miru:update-task', { name: 'Get all chapter manga', type: 'chapters' });

    // console.log({
    //   nameManga: nameManga,
    //   thumbNail: thumbNail,
    //   elementDesc: elementDesc,
    //   elementNameOther: elementNameOther,
    //   elementNameAuthor: elementNameAuthor,
    //   elementTeamTranslate: elementTeamTranslate,
    //   elementCategory,
    //   userPost,
    //   lastEntryUpdate,
    //   chapters,
    // });
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
