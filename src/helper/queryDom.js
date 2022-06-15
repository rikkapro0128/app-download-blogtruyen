class miruQuery {
  async attr({ page, query, attribute }) {
    return await page.$eval(`${query}`, (el, attribute) => el.getAttribute(`${attribute}`), attribute);
  }

  async prop({ page, query, property }) {
    return await page.$eval(`${query}`, (el, property) => String(el?.[property]).trim(), property);
  }

  async mix({ page, method = '$eval', query, cb, args = [] }) {
    if (!['$eval', '$$eval'].includes(method)) {
      return new Error('Method not define by miru!');
    }
    if (!typeof cb === 'function') {
      return new Error('Miru: cb is not function!');
    }
    return await page[method](`${query}`, cb, ...args);
  }
}

module.exports = new miruQuery();
