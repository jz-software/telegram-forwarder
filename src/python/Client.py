from telethon import TelegramClient, events, sync
from telethon.sessions import StringSession
import psycopg2
from decouple import config

# Connects to the database and gets the StringSession if there is any
conn = psycopg2.connect(config('DATABASE_URL'))
cursor = conn.cursor()
cursor.execute('CREATE TABLE IF NOT EXISTS authentication ( id BIGSERIAL PRIMARY KEY, string_session TEXT NOT NULL )')
cursor.execute('SELECT * FROM authentication ORDER BY id DESC LIMIT 1') # get the last session
row = cursor.fetchone()
string_session = None
while row is not None:
    string_session = row[1]
cursor.close()

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

client.start()
client.run_until_disconnected()