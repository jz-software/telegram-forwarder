from telethon import TelegramClient, events, sync
from telethon.sessions import StringSession
import psycopg2
from decouple import config

# Connects to the database and gets the StringSession if there is any
conn = psycopg2.connect(config('DATABASE_URL'))
cursor = conn.cursor()
cursor.execute(open('./src/db/schema.sql', 'r').read())
cursor.execute('SELECT * FROM authentication ORDER BY id DESC LIMIT 1') # get the last session
row = cursor.fetchone()
string_session = None
try:
    string_session = row[1]
except TypeError:
    print('User not authenticated')

api_id = config('API_ID')
api_hash = config('API_HASH')

client = TelegramClient(StringSession(string_session), api_id, api_hash)
client.connect()

# Check if the user is logged in.
# input is used as a signal to the NodeJS app which will ask
# the user to prompt the phone number and the authentication code.
if not client.is_user_authorized():
    phone_number = input('phone:required')
    client.send_code_request(phone_number)
    client.sign_in(phone_number, input('code:required'))
    cursor = conn.cursor()
    cursor.execute('INSERT INTO authentication ( string_session ) VALUES ( %s )', ( client.session.save(), ))
    conn.commit()
    cursor.close()

@client.on(events.NewMessage)
async def my_event_handler(event):
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM redirect')
    table = cursor.fetchall()
    cursor.close()
    sender = await event.get_sender()
    found = [item for item in table if item[2] == sender.id]
    if len(found) >= 0:
        for item in found:
            await client.send_message(item[3], event.message)

client.start()
client.run_until_disconnected()