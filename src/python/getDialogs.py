from telethon import TelegramClient, events, sync
from telethon.sessions import StringSession
import psycopg2
from decouple import config
import json

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

# Check if the user is logged in.
# input is used as a signal to the NodeJS app which will ask
# the user to prompt the phone number and the authentication code.
if not client.is_user_authorized():
    exit()

dialogs = client.get_dialogs(limit=None)
dialogs_arr = []
for x in dialogs:
    if x.name != '':
        dialogs_arr.append({"name": x.name, "user_id": x.id})
print(json.dumps(dialogs_arr))