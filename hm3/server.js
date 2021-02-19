
const express = require('express');
const server = express();
const axios = require('axios');



server.use(express.static(__dirname+'/public'));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const IAM_TOKEN = 't1.9euelZqbm5zOmZqPnZaXkZGSiceQke3rnpWakJedisyZmY2YyJyNjsqOiZXl9PcVJkJ--e9PEyS83fT3VVQ_fvnvTxMkvA.JisPmia6R6b4_6_wFFEOXNnnY_qdEqQiARRpnylydi7GZa9_rGkbOgffF6YDkfrMTFMvn7DWR_gTYmwS3pokBw'
const FOLDER = 'b1gs37ei8l3ofdocfbi0';

server.post('/', async (req, res) => {
    const result = []
    await axios.post("https://translate.api.cloud.yandex.net/translate/v2/translate", {
    "folder_id": FOLDER,
    "texts": [req.body['text']],
    "targetLanguageCode": "en"
    }, {
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${IAM_TOKEN}`,
        }
    })
    .then(res => {
        res.data.translations.forEach(item => result.push(item.text));
    })
    .catch(err => {
        console.log('Error: ' + err.message);
    })
    const test = result.join('')

    res.send(JSON.stringify(test))
})

server.listen(3000, () => console.log('Listening on port 3000'));