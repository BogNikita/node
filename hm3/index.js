const axios = require('axios');
const cheerio = require('cheerio');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (question) => {
    return new Promise((resolve, reject) => {
        rl.question(question, answer => {
            resolve(answer)
        })
    })
};

const IAM_TOKEN = 't1.9euelZqbm5zOmZqPnZaXkZGSiceQke3rnpWakJedisyZmY2YyJyNjsqOiZXl9PcVJkJ--e9PEyS83fT3VVQ_fvnvTxMkvA.JisPmia6R6b4_6_wFFEOXNnnY_qdEqQiARRpnylydi7GZa9_rGkbOgffF6YDkfrMTFMvn7DWR_gTYmwS3pokBw'
const FOLDER = 'b1gs37ei8l3ofdocfbi0';

const translate = (text) => axios.post("https://translate.api.cloud.yandex.net/translate/v2/translate", {
    "folder_id": FOLDER,
    "texts": [text],
    "targetLanguageCode": "en"
    }, {
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${IAM_TOKEN}`,
        }
    })
    .then(res => {
        res.data.translations.forEach(item => console.log(item.text));
    })
    .catch(err => {
        console.log('Error: ' + err);
    })



const getNews = () => axios.get('https://yandex.ru/')
    .then(res => {
        const $ = cheerio.load(res.data)
        $('.news__item-content').each(function (i, element) {
            console.log($(this).text())
        })  
    })
    .catch(err => console.log('Error: ' + err))


const init = async () => {
        while (true) {
            try {
               const answer = await question('Выберите действие: \n1 - Посмотреть новости \n2 - Переводчик \n3 - Выйти \n');
               if (answer === '1') {
                    await getNews()
               } else if (answer === '2') {
                   const text = await question('Введите текст для перевода\n');
                   await translate(text)
               } else if (answer === '3') {
                   break;
               } 
            } catch (error) {
                console.log(error);
            }
        }
        rl.close();
}

init();