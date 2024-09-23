const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');

const token = ''

const bot = new TelegramApi(token, {polling: true})
const chats = {};



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Угадай цифру от 0 до 9 =)');
    const randomNumber = Math.floor(Math.random()*10);
    chats[chatId]=randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай давай', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить инфо о юзере'},
        {command: '/game', description: 'Игра угадай цифру'}
    ])

    bot.on('message', async msg => {
        const text= msg.text;
        const chatId = msg.chat.id;

        if(text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/7a0/e2e/7a0e2ef1-ff94-4317-a188-4bead80d1756/1.webp');
            return bot.sendMessage(chatId, `Hello my friend!`);
        }
        if(text === '/info'){
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.username}`);
        }
        if(text === '/game'){
            return startGame(chatId);
        }


    return bot.sendMessage(chatId, 'Я тебя не понимаю');
       // console.log(msg);
    })
    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again'){
            return startGame(chatId);
        }
        if(data === chats[chatId]){
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `Ты не угадал цифру ${chats[chatId]}`, againOptions);
        }

    })
}
start();