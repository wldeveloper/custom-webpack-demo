const fs = require('fs');
const path = require('path');
/**
 * 从应用根路径开始获取路径
 * @param string relFilePath
 */
const getAbsPath = (relFilePath = '') => path.resolve(process.cwd(), relFilePath); // 获取文件绝对路径
/**
 * 从应用根路径开始引入文件
 * @param string relFilePath
 */
const requireFile = (relFilePath = '') => require(getAbsPath(relFilePath)); // 引入文件
/**
 * 从应用根路径开始读文件
 * @param string relFilePath
 */
const readFile = (relFilePath = '') => fs.readFileSync(getAbsPath(relFilePath), 'utf8'); // 读取文件
// url相关
const createUrlPath = (...u) => {
  return u.reduce((t, c, i) => {
    if (i === 0) return c;
    return `${t.replace(/\/$/, '')}/${c.replace(/^\//, '')}`;
  }, '');
}
const createSearch = (search) => {
  const searchString = Object.keys(search).reduce((t, c) => {
    if (search[c]) t.push(`${c}=${search[c]}`);
    return t;
  }, []).join('&');
  return `${searchString ? '?' : ''}${searchString}`
}

module.exports = {
  getAbsPath,
  readFile,
  requireFile,
  createSearch,
  createUrlPath,
}
