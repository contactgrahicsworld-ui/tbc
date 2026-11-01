"""Dump all tables from the old SQLite DB to JSON for Postgres migration."""
import sqlite3
import json
import glob

DB = glob.glob('/home/z/my-project/db/*.db')[0]
OUT = '/tmp/sqlite_dump.json'

TABLES = [
    'Chapter', 'Member', 'ChapterMembership', 'Event', 'EventRegistration',
    'VisitorRequest', 'MembershipApplication', 'ContactInquiry', 'Article',
    'Testimonial', 'SiteConfig', 'User', 'Admin', 'AdminSession', 'PasswordReset',
]

DATETIME_COLS = {'createdAt', 'updatedAt', 'expiresAt', 'joinedAt'}

con = sqlite3.connect(DB)
con.row_factory = sqlite3.Row

dump = {}
for t in TABLES:
    try:
        rows = [dict(r) for r in con.execute(f'SELECT * FROM "{t}"')]
    except sqlite3.OperationalError:
        rows = []
    # normalize datetimes to ISO strings
    for r in rows:
        for k, v in r.items():
            if k in DATETIME_COLS and isinstance(v, str):
                r[k] = v
    dump[t] = rows
    print(f'{t}: {len(rows)} rows')

with open(OUT, 'w') as f:
    json.dump(dump, f)
print(f'\nDumped to {OUT}')
