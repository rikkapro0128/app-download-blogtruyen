const miruQuery = require('../helper/queryDom.js');
const fs = require('fs');
const axios = require('axios');

class miruHelp {
  async analysisMangaLink({ info, browser, cb }) {
    return new Promise(async (res, rej) => {
      try {
        const page = await browser.newPage();
        await page.goto(info.linkManga);
        await page.waitForSelector('.manga-detail');

        cb(page); // callback

        const chapters = await miruQuery.mix({
          page,
          method: '$$eval',
          query: '#list-chapters > p > span.title > a',
          cb(elements) {
            elements = elements.reverse();
            return elements.map((item, index) => {
              return {
                nameChapter: item.textContent,
                linkChapter: 'https://blogtruyen.vn' + item.getAttribute('href'),
              };
            });
          },
        });
        res({ linkManga: info.linkManga, addressForm: info.addressForm, chapters });
      } catch (error) {
        rej(error);
      }
    });
  }

  async handleChapters({ chapters, browser, window }) {
    let status = false; // check and reload clone when a chapter exist error

    // for (const chapter of chapters) {
    for (const [index, chapter] of chapters.entries()) {
      do {
        try {
          const page = await browser.newPage();
          await page.goto(chapter.linkChapter);
          await page.waitForSelector('#content');
          const images = await miruQuery.mix({
            page,
            method: '$$eval',
            query: '#content > img',
            cb(elements) {
              return elements.map((item) => item.getAttribute('src'));
            },
          });
          chapters[index].listImages = images;
          await page.close();
          window.webContents.send('miru:update-task', {
            name: `Append list image by chapter index: ${index}`,
            type: 'appendListImage',
          });
          status = false;
        } catch (error) {
          // emit error to web-content
          status = true;
        }
      } while (status);
    }
    return chapters;
  }

  async downloadFile({ url, pathByName }) {
    return new Promise((res, rej) => {
      let catchError = false;
      do {
        try {
          axios({
            method: 'get',
            url: url,
            headers: {
              referer: 'https://blogtruyen.vn/',
            },
            responseEncoding: 'base64',
            responseType: 'stream',
          })
            .then(function (response) {
              let typefile = response.headers['content-type'];
              let namePathImage = pathByName + `.${typefile === 'image/jpeg' ? 'jpg' : typefile.split('/')[1]}`;
              response.data.pipe(
                fs
                  .createWriteStream(namePathImage, {
                    autoClose: true,
                    encoding: 'base64',
                  })
                  .on('finish', () => {
                    // check size download is full-filled
                    let stats = fs.statSync(namePathImage);
                    res({
                      namePathImage: namePathImage,
                      typeImage: response.headers['content-type'],
                      sizeImage: response.headers['content-length'],
                      fileSize: stats.size,
                    });
                  }),
              );
              catchError = false;
            })
            .catch((err) => {
              throw err;
            });
        } catch (error) {
          catchError = true;
        }
      } while (catchError);
    });
  }

  async downloadChapters({ chapters, pathManga, window, maxStream }) {
    const maxNumberStream = 2 || maxStream;
    let chunkLink = new Array();
    let stack = 0;

    return new Promise(async (res, rej) => {
      try {
        for (let indexChapters = 0; indexChapters < chapters.length; indexChapters++) {
          // loop chapters

          let listImageChapter = chapters[indexChapters].images;
          let lenImageChapter = listImageChapter.length;

          let initPathChapter = `${pathManga}/${this.removeAccents(
            chapters[indexChapters].name.split(' ').join('-'),
          )}/`;
          fs.mkdirSync(initPathChapter, { recursive: true });

          for (let indexImage = 0; indexImage < lenImageChapter; indexImage++) {
            // loop image every chapter
            stack++;
            chunkLink.push(listImageChapter[indexImage]); // push list images every chapter
            // just download by max stack or end of last index
            if (chunkLink.length === maxNumberStream || indexImage === lenImageChapter - 1) {
              const checkList = chunkLink.map((link) => {
                let nameFileByDate = initPathChapter + Date.now();
                return this.downloadFile({ url: link, pathByName: nameFileByDate });
              });

              const infoImages = await Promise.allSettled(checkList);
              // infoAdressImage.push(...infoImages);
              // console.log('<=< Finish stack! >=>');
              chunkLink = new Array();
              stack = 0;
            }
          }
        }
        res(chapters);
      } catch (error) {
        rej(error);
      }
    });
  }

  removeAccents(str) {
    return String(str)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[`?!*~,<>;':"\/\[\]\|{}()=_+]/g, '');
  }

  checkProtocol({ URLWebManga = '' }) {
    if (URLWebManga !== '') {
      return new RegExp('^https?', 'g').test(URLWebManga);
    } else {
      return new Error('URLWebManga not pass to funtion!');
    }
  }

  completeDNS({ protocol = 'http', subdomain = '', domain = '', TLD = 'vn', urlPoint, slug = true }) {
    return `${protocol}:${slug ? '//' : ''}${subdomain ? subdomain + '.' : ''}${domain ? domain + '.' : ''}${
      domain ? TLD : ''
    }${urlPoint}`;
  }

  formatDate(template = '', reverse) {
    const tempDate = template.split(' ');
    return {
      date: reverse ? tempDate[1] : tempDate[0],
      hour: reverse ? tempDate[0] : tempDate[1],
    };
  }
}

module.exports = new miruHelp();
