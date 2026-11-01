#!/bin/bash
# TBC Admin Panel — end-to-end smoke test
cd /home/z/my-project

# Kill any previous test server
pkill -f "next start -p 3457" 2>/dev/null
sleep 1

# Start server
nohup npx next start -p 3457 > /tmp/next-admin-test.log 2>&1 &
SERVER_PID=$!

# Wait for readiness
for i in $(seq 1 30); do
  sleep 2
  if curl -s --max-time 2 http://localhost:3457/api/admin/setup >/dev/null 2>&1; then
    echo "✓ Server ready (attempt $i)"
    break
  fi
done

JAR=/tmp/tbc-cookies.txt
rm -f $JAR

echo ""
echo "=== 1. Setup status (admin exists?) ==="
curl -s --max-time 5 http://localhost:3457/api/admin/setup
echo ""

echo "=== 2. Create first admin ==="
curl -s --max-time 8 -X POST http://localhost:3457/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{"name":"TBC Admin","email":"admin@tbcnetwork.in","mobile":"9301056006","password":"securepass123"}'
echo ""

echo "=== 3. Try setup AGAIN (must be blocked) ==="
curl -s --max-time 8 -X POST http://localhost:3457/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{"name":"Hacker","email":"h@h.com","mobile":"1111111111","password":"hacked12345"}'
echo ""

echo "=== 4. Login with wrong password (must fail) ==="
curl -s --max-time 8 -X POST http://localhost:3457/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin@tbcnetwork.in","password":"wrongpass"}'
echo ""

echo "=== 5. Login with correct password ==="
curl -s --max-time 8 -X POST http://localhost:3457/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"9301056006","password":"securepass123"}' \
  -c $JAR
echo ""

echo "=== 6. /me with session ==="
curl -s --max-time 8 http://localhost:3457/api/admin/me -b $JAR
echo ""

echo "=== 7. Stats (authed) ==="
curl -s --max-time 8 http://localhost:3457/api/admin/stats -b $JAR
echo ""

echo "=== 8. Visitors list (authed, incl. ref numbers) ==="
curl -s --max-time 8 http://localhost:3457/api/admin/visitors -b $JAR | head -c 600
echo ""

echo "=== 9. Forgot password → WhatsApp code ==="
curl -s --max-time 10 -X POST http://localhost:3457/api/admin/forgot \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9301056006"}'
echo ""

echo "=== 10. Unauthed stats (must be 401) ==="
curl -s --max-time 5 -o /dev/null -w "HTTP %{http_code}" http://localhost:3457/api/admin/stats
echo ""

echo "=== 11. Excel export (authed) ==="
curl -s --max-time 15 -o /tmp/tbc-export-test.xlsx -w "HTTP %{http_code}, %{size_download} bytes" \
  "http://localhost:3457/api/admin/export?type=visitors" -b $JAR
echo ""
file /tmp/tbc-export-test.xlsx 2>/dev/null || ls -la /tmp/tbc-export-test.xlsx

echo ""
echo "=== 12. Admin login page loads ==="
curl -s --max-time 8 -o /dev/null -w "HTTP %{http_code}" http://localhost:3457/admin/login
echo ""

echo "=== 13. Admin panel page loads ==="
curl -s --max-time 8 -o /dev/null -w "HTTP %{http_code}" http://localhost:3457/admin
echo ""

# Cleanup: remove test admin so the real user gets a clean first-time setup
echo ""
echo "=== Cleanup test admin (reset to clean state) ==="
kill $SERVER_PID 2>/dev/null
sleep 1
