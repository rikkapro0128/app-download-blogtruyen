const { dialog, BrowserWindow, ipcMain } = require('electron');
const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const htmlparser2 = require('htmlparser2');

const miruQuery = require('../helper/queryDom.js');
const miruHelp = require('../helper/hotFunc.js');

class commonStatement {
  getContent({ $, query = '', splitCharacter = '', cb = undefined }) {
    const temp = $(query);
    if (temp.length) {
      let tempHandled = temp.text().trim();
      if (splitCharacter) {
        tempHandled = tempHandled.split(splitCharacter);
      }
      if (typeof cb === 'function') {
        return cb(tempHandled);
      } else {
        return tempHandled;
      }
    } else {
      return undefined;
    }
  }

  // [get list images of every one chapter]
  async getImagesChapter({ linkChapter, query, protocol = 'http' }) {
    return new Promise(async (resovle, reject) => {
      try {
        const res = await axios.get(linkChapter);
        if (res.status === 200) {
          const dom = htmlparser2.parseDocument(res.data);
          const $ = cheerio.load(dom);
          resovle(
            $(query)
              .map((index, element) => {
                const link = $(element).attr('src');
                return miruHelp.checkProtocol({ URLWebManga: link }) ? link : `${protocol}:${link}`;
              })
              .toArray(),
          );
        } else {
          reject(new Error('[Miru request] link chapter is error status code: ' + res.status));
        }
      } catch (error) {
        reject(new Error('[Miru error] => ' + error));
      }
    });
  }
}

class blogtruyen extends commonStatement {
  constructor() {
    super();
  }

  // [get information about manga, author, team-translate,...etc..]
  getInfo({ $ }) {
    const info = $('.main-content .description p')
      .map((index, element) => {
        const temp = $(element).text();
        if (temp.includes('Tác giả:')) {
          return {
            author: temp
              .split(':')[1]
              .split(/\s\s+/g)
              .filter((value) => value !== ''),
          };
        } else if (temp.includes('Tên khác:')) {
          return {
            nameOther: temp
              .split(':')[1]
              .split(/\s\s+/g)
              .filter((value) => value !== ''),
          };
        } else if (temp.includes('Nguồn:')) {
          return {
            source: temp
              .split(':')[1]
              .split(/\s\s+/g)
              .filter((value) => value !== ''),
          };
        } else if (temp.includes('Nhóm dịch:')) {
          return {
            teamTranslate: temp
              .split(':')[1]
              .split(/\s\s+/g)
              .filter((value) => value !== ''),
          };
        } else if (temp.includes('Thể loại:')) {
          return {
            genres: temp
              .split(':')[1]
              .split(/\s\s+/g)
              .filter((value) => value !== ''),
          };
        } else if (temp.includes('Đăng bởi:')) {
          const origin = temp.split(':');
          return {
            origin: {
              postBy: String(origin[1]).split('Trạng thái')[0].trim(),
              status: String(origin[2]).trim(),
            },
          };
        }
      })
      .toArray();

    return info.reduce((previousValue, currentValue) => {
      return { ...previousValue, ...currentValue };
    }, {});
  }
  // [get decription about manga]
  getDesc({ $ }) {
    let descTemp = $('.main-content .detail .content')
      .clone()
      .children()
      .remove()
      .end()
      .text()
      .trim()
      .replace(/\s\s+/g, ' ');
    return descTemp !== '' ? descTemp : $('.main-content .detail .content').text().trim().replace(/\s\s+/g, ' ');
  }

  // [get list chapters of manga clone]
  getChapters({ $ }) {
    return $('#list-chapters p')
      .map((index, element) => {
        const tempInfo = $(element).find('span.title > a');
        const URLChapter = tempInfo.attr('href');
        const tempDateFormated = miruHelp.formatDate($(element).find('span.publishedDate').text().trim());
        return {
          name: tempInfo.text(),
          link: miruHelp.checkProtocol({ URLWebManga: URLChapter })
            ? URLChapter
            : miruHelp.completeDNS({
                protocol: 'https',
                domain: 'blogtruyen',
                TLD: 'vn',
                urlPoint: URLChapter,
              }),
          create: {
            date: tempDateFormated.date,
            hour: tempDateFormated.hour,
          },
        };
      })
      .toArray()
      .reverse();
  }

  // [general of manga clone]
  async getGeneral({ $ }) {
    let general = new Object();
    let tempPromise = new Array();
    general.type = 'blogtruyen';
    general.name = $('.main-content h1.entry-title').text().trim();
    general.thumbnail = $('.main-content .thumbnail > img').attr('src');
    general.desc = this.getDesc({ $ });
    general = { ...general, ...this.getInfo({ $ }) };
    general.create_date = $('.main-content .description .row > .col-sm-6 > span').text().trim();
    general.chapters = this.getChapters({ $ });
    tempPromise = general.chapters.map(async (element, index) => {
      return {
        ...element,
        images: await this.getImagesChapter({ linkChapter: element.link, query: '#content > img', protocol: 'https' }),
      };
    });
    general.chapters = await Promise.all(tempPromise);
    return general;
  }
}

class handleEvent extends blogtruyen {
  /*
    handle event when match
  */
  constructor() {
    super();
  }

  async analysisLinkManga({ info, mainWindow }) {
    info.forEach(async (element) => {
      let catchError = false;
      try {
        do {
          const res = await axios.get(element.linkManga);
          if (res.status >= 200 && res.status < 300) {
            const dom = htmlparser2.parseDocument(res.data);
            const $ = cheerio.load(dom);
            let general = new Object();
            general = await this.getGeneral({ $ });
            await this.startClone({ manga: general, mainWindow });
            mainWindow.webContents.send('miru:result-analysis-manga-links', { listMangaAnalysis: general });
            catchError = false;
          }
        } while (catchError);
      } catch (error) {
        catchError = true;
        console.log(error);
        console.log(error.prototype);
      }
    });
  }

  downloadLinkManga(event, { links }) {
    // transfrom or validate before clone
    ipcMain.emit('miru:start-clone', { linkManga: links });
  }

  async startClone({ manga, mainWindow }) {
    const rootPath = 'D:/Download';

    if (rootPath) {
      // init new chrome process
      let pathManga = `${rootPath}/${miruHelp.removeAccents(manga.name)}`;

      if (fs.existsSync(pathManga)) {
        // remove directory
        fs.rmSync(pathManga, { recursive: true, force: true });
      }
      fs.mkdirSync(pathManga, { recursive: true });

      const infoResponseFromDownload = await miruHelp.downloadChapters({
        chapters: manga.chapters,
        pathManga,
        window: mainWindow,
      });
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
