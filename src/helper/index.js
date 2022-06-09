import fs from 'fs';
import axios from 'axios';

export function removeAccents(str) {
  /*
    handle string vietnamese to no character special
  */
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[`~,<>;':"\/\[\]\|{}()=_+]/g, '');
}

let download = function (url, filename) {
  /*
    handle download by and save file image by path
  */
  return new Promise((res, rej) => {
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
        let namePathImage = filename + `.${typefile === 'image/jpeg' ? 'jpg' : typefile.split('/')[1]}`;
        response.data.pipe(
          fs
            .createWriteStream(namePathImage, {
              autoClose: true,
              encoding: 'base64',
            })
            .on('error', (err) => {
              rej(err);
            })
            .on('finish', () => {
              // check size download is full-filled
              let stats = fs.statSync(namePathImage);
              // console.log(namePathImage, ' => ', stats.size);
              // let fileSizeInBytes = stats.size / (1024*1024);
              res({
                namePathImage: namePathImage,
                typeImage: response.headers['content-type'],
                sizeImage: response.headers['content-length'],
                fileSize: stats.size,
              });
            }),
        );
      })
      .catch((err) => {
        rej(err);
      });
  });
};

export default async (imageLinks, path, maxStream) => {
  const maxNumberStream = 2 || maxStream;
  const infoAdressImage = new Array();
  let chunkLink = new Array();

  return new Promise(async (res, rej) => {
    try {
      let stack = 0;
      let lenListImage = imageLinks.length;
      for (let index = 0; index < lenListImage; index++) {
        stack++;
        console.log('Download with stack => ' + stack + ' => ' + imageLinks[index]);
        chunkLink.push(imageLinks[index]);
        // just download by max stack or end of last index
        if (chunkLink.length === maxNumberStream || index === lenListImage - 1) {
          const checkList = chunkLink.map((link) => {
            let nameFileByDate = path + Date.now();
            return download(link, nameFileByDate);
          });

          const infoImages = await Promise.allSettled(checkList);
          infoAdressImage.push(infoImages);
          console.log('<=< Finish stack! >=>');
          chunkLink = new Array();
          stack = 0;
        }
      }
      res(infoAdressImage);
    } catch (error) {
      rej(error);
    }
  });
};
