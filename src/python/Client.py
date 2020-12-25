from telethon import TelegramClient, events, sync
from telethon.sessions import StringSession

api_id = 
api_hash = ''

client = TelegramClient(StringSession(''), api_id, api_hash)
client.connect()

# Check if the user is logged in.
# input is used as a signal to the NodeJS app which will ask
# the user to prompt the phone number and the authentication code.
if not client.is_user_authorized():
    phone_number = input('phone:required')
    client.send_code_request(phone_number)
    client.sign_in(phone_number, input('code:required'))
    input(client.session.save())

client.start()
client.run_until_disconnected()