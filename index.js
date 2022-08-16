const TelegramApi = require('node-telegram-bot-api');

const token = '5562222512:AAHwhCRMXgpzP0AVNTPWK9U2ZhOUWznlB1U';

const bot = new TelegramApi(token, {polling: true});

const questions = [
    {
      question: 'Дата створення JavaScript',
      rightAnswer: '2',
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            { text: '1998', callback_data: '1' },
            { text: '1995', callback_data: '2' },
            { text: '1993', callback_data: '3' },
          ],
        ],
      }),
    },
    {
      question: 'Засновник JavaScript',
      rightAnswer: '3',
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            { text: 'Марк Цукерберг', callback_data: '1' },
            { text: 'Стів Джобс', callback_data: '2' },
            { text: 'Брендан Ейх', callback_data: '3' },
          ],
        ],
      }),
    },
    {
      question: 'Наступний запис: const a = [1, 5, 6] це ...',
      rightAnswer: '3',
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            { text: 'Обєкт', callback_data: '1' },
            { text: 'Функція', callback_data: '2' },
            { text: 'Масив', callback_data: '3' },
          ],
        ],
      }),
    },
    {
      question: 'null == undefined?',
      rightAnswer: '1',
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            { text: 'Так', callback_data: '1' },
            { text: 'Ні', callback_data: '2' },
          ],
        ],
      }),
    },
  ];
  
  let rightAnsCount = 0;
  let currentQuestion = 0;
  let chatId = null;
  
  const resetBot = () => {
    currentQuestion = 0;
    rightAnsCount = 0;
  };
  
  const handleStart = () => {
    resetBot();
    bot.sendMessage(chatId, `Вітаю!!!`);
  };
  
  const sendQuestion = async () => {
    await bot.sendMessage(
      chatId,
      questions[currentQuestion].question,
      questions[currentQuestion]
    );
  };
  
  const sendResult = async () => {
    await bot.sendMessage(
      chatId,
      `Ви пройшли тест. Ваш результат: ${rightAnsCount} із ${questions.length}.`
    );
    resetBot();
  };
  
  const handleQuiz = async () => {
    await bot.sendMessage(chatId, `Відгадуй!`);
  
    sendQuestion();
  
    bot.on('callback_query', async msg => {
      chatId = msg.message.chat.id;
  
      if (msg.data === questions[currentQuestion].rightAnswer) {
        rightAnsCount += 1;
      }
  
      // await bot.deleteMessage(chatId, msg.message.message_id);
  
      if (!questions[currentQuestion + 1]) {
        return sendResult();
      }
  
      if (
        JSON.parse(
          questions[currentQuestion].reply_markup
        ).inline_keyboard[0].find(i => i.callback_data === msg.data)
      ) {
        currentQuestion += 1;
      }
  
      return sendQuestion();
    });
  };
  
  const messageHandler = async msg => {
    const text = msg.text;
    chatId = msg.chat.id;
  
    if (text === '/start') {
      return handleStart();
    }
  
    if (['/quiz', '/reset'].includes(text)) {
      return handleQuiz();
    }
  
    return bot.sendMessage(chatId, `Я тебе не розумію спробуй ще раз!`);
  };
  
  const start = () => {
    bot.setMyCommands([
      { command: '/start', description: 'Запустити бота' },
      { command: '/quiz', description: 'Почати опитування' },
      { command: '/reset', description: 'Пройти заново' },
    ]);
  
    bot.on('message', messageHandler);
  };
  
  start();
