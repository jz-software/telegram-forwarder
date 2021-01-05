from telethon import TelegramClient, events, sync
from telethon.sessions import StringSession
from telethon.tl.functions.messages import GetHistoryRequest
import psycopg2
from decouple import config
import json
from time import sleep

# Connects to the database and gets the StringSession if there is any
conn = psycopg2.connect(config('DATABASE_URL'))
cursor = conn.cursor()
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

if not client.is_user_authorized():
    exit()

origin = client.get_entity(int(config('ORIGIN')))
destination = client.get_entity(int(config('DESTINATION')))

for message in client.iter_messages(origin, reverse=True):
    if message.message is not None:
        client.send_message(destination, message)
        sleep(1)