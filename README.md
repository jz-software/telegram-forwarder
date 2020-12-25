# Telegram Forwarder

**Telegram-Forwarder** is a Telegram bot used to redirect messages from various chats, channels, and groups to your own ones.
It's main goal is to be simple in installation and usage.

## Installation
Clone the repository
```bash
git clone https://github.com/JMax45/telegram-forwarder.git
```

#### NodeJs packages installation
```bash
npm install
```

#### Python packages installation
```bash
pip install -r requirements.txt
```

#### Env variables
Create an **.env** file with the following content
```bash
TOKEN= # Can be obtained from @BotFather on Telegram
DATABASE_URL= # A PostgreSQL database URL, you can install it locally
API_ID= # Can be obtained here: https://my.telegram.org/
API_HASH= # Can be obtained here: https://my.telegram.org/
```
*API_ID* and *API_HASH* can be found [here](https://my.telegram.org/). *TOKEN* [here](https://t.me/botfather).

## Usage

#### Authentication
First of all you need to authenticate yourself, you can do this by writing **/auth** to the bot.
![alt text](https://i.ibb.co/7CFmKqC/telegramforwarder.png)

##

#### Adding new redirects
You can add new redirects with the /add command
```bash
/add title origin destination
```
**title**: A title for the redirect

**origin**: The id of the chat to forward **from**

**destination**: The id of the chat to forward **to**

![alt text](https://i.ibb.co/QbJLSRT/telegramforwarder2.png)

## FAQ

**Q:** In what type of chats does it work?

**A:** It works in all type of chats, it can be a channel, group or even a private chat.
##

**Q:** Does it give any reference to the original author of the message?

**A:** No, it's sent as if it was written by you.
##

**Q:** Do I have to authenticate every time it launches?

**A:** No, it keeps a session in the database so you don't need to authenticate every time.