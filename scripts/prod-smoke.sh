#!/bin/bash
# TBC production smoke + auth test — runs against https://tbc-six.vercel.app
# Test data is clearly marked and wiped afterwards by scripts/cleanup-prod-test.ts
BASE="https://tbc-six.vercel.app"
JAR=/tmp/tbc-jar.txt; JAR2=/tmp/tbc-jar2.txt
rm -f "$JAR" "$JAR2"
TS=$(date +%s)
EMAIL="smoke${TS}@tbc-test.in"
MOBILE="999${TS:0:7}"
PW='Sm0keTest!2026'
NEWPW='Sm0keReset!2026'
PASS=0; FAIL=0
ok(){ echo "PASS: $1"; PASS=$((PASS+1)); }
bad(){ echo "FAIL: $1"; FAIL=$((FAIL+1)); }
jget(){ python3 -c "import json,sys
try:
  d=json.load(sys.stdin)
  v=eval(sys.argv[1],{'d':d})
  print('' if v is None else v)
except Exception:
  print('')" "$1"; }

echo "===== PHASE A: public pages, APIs, guards, headers ====="
for p in "/" "/visitor" "/admin"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$p")
  [ "$code" = "200" ] && ok "GET $p → 200" || bad "GET $p → $code"
done
for p in "/api/chapters" "/api/events" "/api/members" "/api/testimonials" "/api/stats"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$p")
  [ "$code" = "200" ] && ok "GET $p → 200" || bad "GET $p → $code"
done

# Public form flows
VRES=$(curl -s -X POST "$BASE/api/visitor" -H 'Content-Type: application/json' \
  -d "{\"name\":\"SMOKE-TEST Visitor\",\"mobile\":\"$MOBILE\",\"email\":\"v$EMAIL\",\"business\":\"Smoke Biz\",\"profession\":\"QA\",\"city\":\"Mumbai\",\"preferredChapter\":\"Test Chapter\",\"preferredDate\":\"2026-12-01\",\"message\":\"SMOKE-TEST visitor visit\"}")
VREF=$(echo "$VRES" | jget "d['refNumber']" 2>/dev/null)
[ -n "$VREF" ] && ok "POST /api/visitor → refNumber=$VREF" || bad "POST /api/visitor → $VRES"

CRES=$(curl -s -X POST "$BASE/api/contact" -H 'Content-Type: application/json' \
  -d "{\"name\":\"SMOKE-TEST Contact\",\"email\":\"c$EMAIL\",\"phone\":\"$MOBILE\",\"subject\":\"Smoke\",\"message\":\"SMOKE-TEST contact inquiry\"}")
COK=$(echo "$CRES" | jget "d['success']" 2>/dev/null); [ -z "$COK" ] && COK=$(echo "$CRES" | jget "d['id']" 2>/dev/null)
[ -n "$COK" ] && ok "POST /api/contact" || bad "POST /api/contact → $CRES"

JRES=$(curl -s -X POST "$BASE/api/join" -H 'Content-Type: application/json' \
  -d "{\"name\":\"SMOKE-TEST Applicant\",\"email\":\"j$EMAIL\",\"phone\":\"$MOBILE\",\"business\":\"Smoke Biz\",\"profession\":\"QA\",\"category\":\"Tech\",\"city\":\"Mumbai\",\"motivation\":\"SMOKE-TEST join application\"}")
JREF=$(echo "$JRES" | jget "d['refNumber']" 2>/dev/null)
[ -n "$JREF" ] && ok "POST /api/join → refNumber=$JREF" || bad "POST /api/join → $JRES"

# Auth guards (must be 401 without cookie; /me by design returns 200+admin:null)
MEUN=$(curl -s "$BASE/api/admin/me")
MEADM=$(echo "$MEUN" | jget "d['admin']")
[ -z "$MEADM" ] && ok "guard /api/admin/me (no auth) → admin:null" || bad "me unauth → $MEUN"
for g in "GET /api/admin/stats" "GET /api/admin/visitors" "GET /api/admin/applications" "GET /api/admin/export" "GET /api/admin/settings" "GET /api/admin/admins"; do
  m=${g%% *}; p=${g#* }
  code=$(curl -s -o /dev/null -w "%{http_code}" -X $m "$BASE$p")
  [ "$code" = "401" ] && ok "guard $p (no auth) → 401" || bad "guard $p (no auth) → $code (want 401)"
done
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/admin/upload" -F "x=1")
[ "$code" = "401" ] && ok "guard POST /api/admin/upload (no auth) → 401" || bad "guard upload → $code"

# Security headers
HDRS=$(curl -sI "$BASE/")
for h in "x-frame-options" "x-content-type-options" "referrer-policy" "strict-transport-security"; do
  echo "$HDRS" | grep -qi "$h" && ok "header $h present" || bad "header $h MISSING"
done
echo "$HDRS" | grep -qi "x-powered-by" && bad "header X-Powered-By present (should be off)" || ok "no X-Powered-By header"

echo "===== PHASE B: admin auth cycle ====="
SCHK=$(curl -s "$BASE/api/admin/setup")
NEED=$(echo "$SCHK" | jget "d['setupNeeded']")
[ "$NEED" = "True" ] && ok "GET /api/admin/setup → setupNeeded=true (fresh DB)" || bad "setup check → $SCHK"

SRES=$(curl -s -X POST "$BASE/api/admin/setup" -H 'Content-Type: application/json' \
  -d "{\"name\":\"SMOKE-TEST Admin\",\"email\":\"$EMAIL\",\"mobile\":\"$MOBILE\",\"password\":\"$PW\"}")
SOK=$(echo "$SRES" | jget "d['success']" 2>/dev/null); [ -z "$SOK" ] && SOK=$(echo "$SRES" | jget "d['id']" 2>/dev/null)
[ -n "$SOK" ] && ok "POST /api/admin/setup (admin created)" || bad "POST /api/admin/setup → $SRES"

LRES=$(curl -s -c "$JAR" -X POST "$BASE/api/admin/login" -H 'Content-Type: application/json' \
  -d "{\"identifier\":\"$EMAIL\",\"password\":\"$PW\"}")
LOK=$(echo "$LRES" | jget "d['success']" 2>/dev/null); [ -z "$LOK" ] && LOK=$(echo "$LRES" | jget "d['admin']['id']" 2>/dev/null)
[ -n "$LOK" ] && ok "POST /api/admin/login (cookie saved)" || bad "login → $LRES"

MRES=$(curl -s -b "$JAR" "$BASE/api/admin/me")
MEMAIL=$(echo "$MRES" | jget "d['admin']['email']" 2>/dev/null)
[ "$MEMAIL" = "$EMAIL" ] && ok "GET /api/admin/me → session admin $MEMAIL" || bad "me → $MRES"

echo "===== PHASE C: CRUD + upload + export ====="
CHRES=$(curl -s -b "$JAR" -X POST "$BASE/api/admin/chapters" -H 'Content-Type: application/json' \
  -d "{\"name\":\"SMOKE-TEST Chapter $TS\",\"location\":\"Andheri\",\"city\":\"Mumbai\",\"meetingDay\":\"Sunday\",\"meetingTime\":\"10:00 AM\",\"description\":\"SMOKE-TEST chapter\"}")
CHID=$(echo "$CHRES" | jget "d['id']")
[ -n "$CHID" ] && ok "POST /api/admin/chapters → id=$CHID" || bad "create chapter → $CHRES"

EVRES=$(curl -s -b "$JAR" -X POST "$BASE/api/admin/events" -H 'Content-Type: application/json' \
  -d "{\"title\":\"SMOKE-TEST Event $TS\",\"date\":\"2026-12-15\",\"time\":\"6 PM\",\"location\":\"Mumbai\",\"chapterId\":\"$CHID\",\"description\":\"SMOKE-TEST event\"}")
EVID=$(echo "$EVRES" | jget "d['id']"); EVCH=$(echo "$EVRES" | jget "d['chapterId']")
[ -n "$EVID" ] && [ "$EVCH" = "$CHID" ] && ok "POST /api/admin/events → assigned to chapter" || bad "create event → $EVRES"

ERRES=$(curl -s -X POST "$BASE/api/event-register" -H 'Content-Type: application/json' \
  -d "{\"eventId\":\"$EVID\",\"name\":\"SMOKE-TEST Reg\",\"email\":\"e$EMAIL\",\"phone\":\"$MOBILE\",\"business\":\"Smoke Biz\",\"message\":\"SMOKE-TEST registration\"}")
ERREF=$(echo "$ERRES" | jget "d['refNumber']")
[ -n "$ERREF" ] && ok "POST /api/event-register → refNumber=$ERREF" || bad "event-register → $ERRES"

MRES2=$(curl -s -b "$JAR" -X POST "$BASE/api/admin/members" -H 'Content-Type: application/json' \
  -d "{\"name\":\"SMOKE-TEST Member\",\"email\":\"m$EMAIL\",\"phone\":\"$MOBILE\",\"business\":\"Smoke Biz\",\"chapterId\":\"$CHID\",\"city\":\"Mumbai\"}")
MEID=$(echo "$MRES2" | jget "d['id']")
[ -n "$MEID" ] && ok "POST /api/admin/members → id=$MEID" || bad "create member → $MRES2"

TRES=$(curl -s -b "$JAR" -X POST "$BASE/api/admin/testimonials" -H 'Content-Type: application/json' \
  -d "{\"name\":\"SMOKE-TEST Member\",\"business\":\"Smoke Biz\",\"quote\":\"SMOKE-TEST testimonial quote\",\"featured\":false}")
TID=$(echo "$TRES" | jget "d['id']")
[ -n "$TID" ] && ok "POST /api/admin/testimonials → id=$TID" || bad "create testimonial → $TRES"

# Upload → Vercel Blob
PNG_B64="iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEUAAAD///+l2Z/dAAAASUlEQVR4nGP4/5+BgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBAQBWs1mCAAAAAElFTkSuQmCC"
echo "$PNG_B64" | base64 -d > /tmp/tbc-test.png
UPRES=$(curl -s -b "$JAR" -X POST "$BASE/api/admin/upload" -F "file=@/tmp/tbc-test.png;type=image/png")
UPURL=$(echo "$UPRES" | jget "d['url']")
case "$UPURL" in
  https://*) ok "POST /api/admin/upload → cloud URL ($UPURL)"; 
    UC=$(curl -s -o /dev/null -w "%{http_code}" "$UPURL"); [ "$UC" = "200" ] && ok "uploaded image GET → 200" || bad "uploaded image GET → $UC";;
  *) bad "upload → $UPRES";;
esac

# Visitors PATCH (status update)
VID=$(curl -s -b "$JAR" "$BASE/api/admin/visitors" | jget "d['visitors'][0]['id']" 2>/dev/null)
[ -z "$VID" ] && VID=$(curl -s -b "$JAR" "$BASE/api/admin/visitors" | jget "d[0]['id']" 2>/dev/null)
if [ -n "$VID" ]; then
  PRES=$(curl -s -b "$JAR" -X PATCH "$BASE/api/admin/visitors" -H 'Content-Type: application/json' -d "{\"id\":\"$VID\",\"status\":\"confirmed\"}")
  PST=$(echo "$PRES" | jget "d['status']")
  [ "$PST" = "confirmed" ] && ok "PATCH /api/admin/visitors → status=confirmed" || bad "PATCH visitors → $PRES"
else
  bad "visitors list empty — cannot test PATCH"
fi

# Excel export
EXH=$(curl -s -o /tmp/tbc-export.xlsx -w "%{http_code} %{content_type}" -b "$JAR" "$BASE/api/admin/export")
EXC=$(echo "$EXH" | cut -d' ' -f1); EXT=$(echo "$EXH" | cut -d' ' -f2)
SIZE=$(stat -c%s /tmp/tbc-export.xlsx 2>/dev/null || echo 0)
case "$EXT" in *spreadsheet*|*octet-stream*) EXOK=1;; *) EXOK=0;; esac
[ "$EXC" = "200" ] && [ "$SIZE" -gt 1000 ] && [ "$EXOK" = "1" ] && ok "GET /api/admin/export → 200 xlsx ($SIZE bytes)" || bad "export → $EXH ($SIZE bytes)"

# Settings GET
SEH=$(curl -s -o /dev/null -w "%{http_code}" -b "$JAR" "$BASE/api/admin/settings")
[ "$SEH" = "200" ] && ok "GET /api/admin/settings → 200" || bad "settings → $SEH"

echo "===== PHASE D: forgot → reset → session invalidation ====="
FRES=$(curl -s -X POST "$BASE/api/admin/forgot" -H 'Content-Type: application/json' -d "{\"mobile\":\"$MOBILE\"}")
FLINK=$(echo "$FRES" | jget "d['fallbackLink']")
SENT=$(echo "$FRES" | jget "d['sent']")
CODE=$(python3 -c "import urllib.parse,sys,re
link=sys.argv[1]
if not link: print(''); sys.exit()
q=urllib.parse.urlparse(link).query
text=urllib.parse.parse_qs(q).get('text',[''])[0]
m=re.search(r'\b(\d{6})\b', text)
print(m.group(1) if m else '')" "$FLINK")
if [ "$SENT" = "True" ]; then ok "forgot → WhatsApp API sent (code not exposed)"; CODE=""; \
elif [ -n "$CODE" ]; then ok "forgot → fallbackLink with code (wa.me)"; else bad "forgot → $FRES"; fi

if [ -n "$CODE" ]; then
  RRES=$(curl -s -X POST "$BASE/api/admin/reset" -H 'Content-Type: application/json' \
    -d "{\"mobile\":\"$MOBILE\",\"code\":\"$CODE\",\"newPassword\":\"$NEWPW\"}")
  ROK=$(echo "$RRES" | jget "d['success']")
  [ "$ROK" = "True" ] && ok "POST /api/admin/reset (password changed)" || bad "reset → $RRES"
  MADMTXT=$(curl -s -b "$JAR" "$BASE/api/admin/me")
  MADM=$(echo "$MADMTXT" | jget "d['admin']")
  [ -z "$MADM" ] && ok "old session invalidated after reset → admin:null" || bad "old session still valid → $MADMTXT"
  L2=$(curl -s -o /dev/null -w "%{http_code}" -c "$JAR2" -X POST "$BASE/api/admin/login" -H 'Content-Type: application/json' -d "{\"identifier\":\"$EMAIL\",\"password\":\"$NEWPW\"}")
  [ "$L2" = "200" ] && ok "login with NEW password → 200" || bad "login new pw → $L2"
  L3=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/admin/login" -H 'Content-Type: application/json' -d "{\"identifier\":\"$EMAIL\",\"password\":\"$PW\"}")
  [ "$L3" = "401" ] && ok "login with OLD password → 401 (correctly rejected)" || bad "old pw still works → $L3"
else
  echo "SKIP reset cycle (WhatsApp API configured or code missing)"
fi

LOG=$(curl -s -o /dev/null -w "%{http_code}" -b "$JAR2" -X POST "$BASE/api/admin/logout")
M4TXT=$(curl -s -b "$JAR2" "$BASE/api/admin/me")
M4=$(echo "$M4TXT" | jget "d['admin']")
[ -z "$M4" ] && ok "logout → session cleared (admin:null)" || bad "logout/me → logout:$LOG me:$M4TXT"

echo
echo "======================================"
echo "RESULT: PASS=$PASS FAIL=$FAIL"
echo "======================================"
[ "$FAIL" = "0" ]
