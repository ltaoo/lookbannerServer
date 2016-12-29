'use strict';
const path = require('path');
const fs = require('fs');
// 引入
const Promise = require('bluebird');
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(path.join(__dirname, '../collect/lib/lookbanner.db'));
//
exports.fetchAll = function(pages, index) {
  // 根据页码
  return new Promise((resolve, reject)=> {
    db.all('select rowid as id, * from image order by rowid desc limit '+pages+' offset '+((index-1)*pages), (err, res)=> {
      if(err) reject(err);
      resolve(res);
    })
  })
}

exports.fetchByWebName = function(web, pages, index) {
  // 根据网站进行筛选
  return new Promise((resolve, reject)=> {
    db.all('select rowid as id, * from image where web_name = "'+web+'" order by rowid desc limit '+pages+' offset '+((index-1)*pages), (err, res)=> {
      if(err) reject(err);
      resolve(res);
    })
  })
}

exports.fetchExceptWebName = function(web) {
  // 除开这个网站进行查询
  return new Promise((resolve, reject)=> {
    db.all('select rowid as id, * from image where web_name != '+web+' order by rowid desc limit '+pages+' offset '+((index-1)*pages), (err, res)=> {
      if(err) reject(err);
      resolve(res);
    })
  })
}

exports.fetchWebs = function () {
  // 获取到已收录的网站名称，这里要根据文件来了
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, '../collect/rules'), (err, files)=> {
      if(err) reject(err);
      // 把后缀名去掉

      resolve(files.map(file => {
        return file.split('.')[0]
      }))
    })
  })
}