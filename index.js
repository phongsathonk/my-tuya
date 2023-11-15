const express = require('express')
const middleware = require('@line/bot-sdk').middleware
const JSONParseError = require('@line/bot-sdk').JSONParseError
const SignatureValidationFailed = require('@line/bot-sdk').SignatureValidationFailed
const Client = require('@line/bot-sdk').Client
const config = require('config')
const request = require('request')
const fs = require('fs');
const cheerio = require('cheerio');


const app = express()

const token = config.get('channelAccessToken')
const secret = config.get('channelSecret')

const conf = {
    channelAccessToken: token,
    channelSecret: secret
}

const client = new Client(conf);


app.use(middleware(conf))

app.get('/', (req, res, next) => {
    console.log('halo')
})

function replyMessages(replyToken, userId) {

    var message = {
        type: 'text',
        text: 'Halo 😁 \nRiyo adalah Chat Bot Unofficial Kampus UNRIYO.\nKetik: `help` atau `bantuan` untuk melihat perintah yang dapat digunakan.\nRiyo masih dalam tahap pengembangan.'
    };


    client.replyMessage(replyToken, message)
    console.log('Reply message to '+userId+' done')
}


app.post('/push-messages', (req, res) => {
    client.pushMessage(userId, { type: 'text', text: 'hello, world' });
})



app.use((err, req, res, next) => {
    if (err instanceof SignatureValidationFailed) {
        res.status(401).send(err.signature)
        return
    } else if (err instanceof JSONParseError) {
        res.status(400).send(err.raw)
        return
    }
next(err)
})

app.listen(3000)
