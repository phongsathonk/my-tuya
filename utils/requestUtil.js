'use strict'
const request = require('superagent')

module.exports.get = (options) => {
  return new Promise((resolve, reject) => {
    request
      .get(options.url)
      // .set('Authorization', `Bearer ${options.accessToken}`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .end((err, res) => {
        if (err) { return reject(err) }
        return resolve(res.body)
      })
  })
}

module.exports.post = (options) => {
  return new Promise((resolve, reject) => {
    request
      .post(options.url)
      .send(options.body)
      // .set('Authorization', `Bearer ${options.accessToken}`)
      // .set('Accept', 'application/json')
      .set('Accept', 'application/x-www-form-urlencoded')      
      .end((err, res) => {
        if (err) { return reject(err) }
        return resolve(res.body)
      })
  })
}
