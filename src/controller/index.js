const { dialog, BrowserWindow, ipcMain } = require('electron');
const puppeteer = require('puppeteer');
const fs = require('fs');

const miruQuery = require('../helper/queryDom.js');
const miruHelp = require('../helper/hotFunc.js');

class handleEvent {
  /*
    handle event when match
  */

  async analysisLinkManga({ info, mainWindow }) {
    try {
      // init new chrome process
      // const minimal_args = [
      //   '--autoplay-policy=user-gesture-required',
      //   '--disable-background-networking',
      //   '--disable-background-timer-throttling',
      //   '--disable-backgrounding-occluded-windows',
      //   '--disable-breakpad',
      //   '--disable-client-side-phishing-detection',
      //   '--disable-component-update',
      //   '--disable-default-apps',
      //   '--disable-dev-shm-usage',
      //   '--disable-domain-reliability',
      //   '--disable-extensions',
      //   '--disable-features=AudioServiceOutOfProcess',
      //   '--disable-hang-monitor',
      //   '--disable-ipc-flooding-protection',
      //   '--disable-notifications',
      //   '--disable-offer-store-unmasked-wallet-cards',
      //   '--disable-popup-blocking',
      //   '--disable-print-preview',
      //   '--disable-prompt-on-repost',
      //   '--disable-renderer-backgrounding',
      //   '--disable-setuid-sandbox',
      //   '--disable-speech-api',
      //   '--disable-sync',
      //   '--hide-scrollbars',
      //   '--ignore-gpu-blacklist',
      //   '--metrics-recording-only',
      //   '--mute-audio',
      //   '--no-default-browser-check',
      //   '--no-first-run',
      //   '--no-pings',
      //   '--no-sandbox',
      //   '--no-zygote',
      //   '--password-store=basic',
      //   '--use-gl=swiftshader',
      //   '--use-mock-keychain',
      // ];
      const browser = await puppeteer.launch({
        headless: true,
        // headless: false,
        args: ['--disable-software-rasterizer', '--disable-gpu'],
      });

      const maxTabOpen = 5;
      let stackPage = new Array();
      let stackInfo = new Array();
      let stackResult = new Array();
      const lengthInfo = info.length;

      for (const [index, infoCtx] of info.entries()) {
        if (stackInfo.length < maxTabOpen) {
          const checkLast = index === lengthInfo - 1 ? true : false;
          stackInfo.push(infoCtx);

          if (stackInfo.length === maxTabOpen || checkLast) {
            const stackTemp = new Array();
            for (const stack of stackInfo) {
              const resultAnalysis = miruHelp.analysisMangaLink({
                info: stack,
                browser,
                cb(page) {
                  stackPage.push(page);
                },
              });
              stackTemp.push(resultAnalysis);
            }
            const result = await Promise.all(stackTemp);
            stackResult = [...stackResult, ...result];
            for (const page of stackPage) {
              await page.close();
            }
            stackInfo = new Array();
            stackPage = new Array();
          }
        }
      }
      await browser.close();
      mainWindow.webContents.send('miru:result-analysis-manga-links', { listMangaAnalysis: stackResult });
    } catch (error) {
      console.log(error);
    }
  }

  downloadLinkManga(event, { links }) {
    // transfrom or validate before clone
    ipcMain.emit('miru:start-clone', { linkManga: links });
  }

  async startClone({ linkManga, mainWindow }) {
    // receive url to exec download manga
    const mangaTarget = linkManga;
    const cloneChapterStart = undefined || undefined; // undefined or typeof number
    const cloneChapterEnd = undefined || undefined; // undefined or typeof number

    const rootPath = 'E:/Download';

    if (rootPath) {
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

      const generalChapters = await miruHelp.handleChapters({ chapters, browser, window: mainWindow });

      await browser.close();

      mainWindow.webContents.send('miru:update-task', { name: 'Exit puppeteer browser', type: 'exitPuppeteerBrowser' });

      let pathManga = `${rootPath}/${miruHelp.removeAccents(nameManga)}`;

      if (fs.existsSync(pathManga)) {
        // remove directory
        fs.rmSync(pathManga, { recursive: true, force: true });
      }
      fs.mkdirSync(pathManga, { recursive: true });

      mainWindow.webContents.send('miru:update-task', { name: 'Create path save manga', type: 'createPathSaveManga' });

      const infoResponseFromDownload = await miruHelp.downloadChapters({
        chapters: generalChapters,
        pathManga,
        window: mainWindow,
      });

      // console.log({
      //   nameManga: nameManga,
      //   thumbNail: thumbNailManga,
      //   elementDesc: descManga,
      //   elementNameOther: nameOther,
      //   elementNameAuthor: nameAuthor,
      //   elementTeamTranslate: teamTranslate,
      //   categorys,
      //   userPost,
      //   lastEntryUpdate,
      //   chapters,
      // });
    }
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
