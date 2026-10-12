// backend/test-backend.js
// Automated verification script for Student Expense Tracker backend

const http = require('http');

function runTest(name, path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve) => {
    const payload = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      ...headers,
    };
    if (payload) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers: reqHeaders,
        timeout: 4000,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed = null;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
          resolve({
            name,
            statusCode: res.statusCode,
            body: parsed,
            passed: false,
          });
        });
      }
    );

    req.on('error', (err) => {
      resolve({
        name,
        error: err.message,
        passed: false,
      });
    });

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function startTests() {
  console.log('🧪 Running Backend Automated Endpoint Checks...\n');

  // Test 1: Health check
  const t1 = await runTest('Health Check', '/api/health');
  t1.passed = t1.statusCode === 200 && t1.body?.status === 'ok';
  console.log(`Test 1: Health Check (GET /api/health) -> Status: ${t1.statusCode} [${t1.passed ? 'PASS ✅' : 'FAIL ❌'}]`);

  // Test 2: Unknown route 404
  const t2 = await runTest('404 Route Handler', '/api/nonexistent');
  t2.passed = t2.statusCode === 404 && t2.body?.success === false;
  console.log(`Test 2: 404 Route Handler (GET /api/nonexistent) -> Status: ${t2.statusCode} [${t2.passed ? 'PASS ✅' : 'FAIL ❌'}]`);

  // Test 3: Protected route without JWT token
  const t3 = await runTest('Protected Route Unauthorized Check', '/api/expenses');
  // Should return 401 or 503 (if DB checked first)
  t3.passed = t3.statusCode === 503 || t3.statusCode === 401;
  console.log(`Test 3: Unauthorized Access Guard (GET /api/expenses without token) -> Status: ${t3.statusCode} [${t3.passed ? 'PASS ✅' : 'FAIL ❌'}]`);

  // Test 4: Database readiness safety check
  const t4 = await runTest('Database Readiness Guard', '/api/auth/signup', 'POST', {
    name: 'Test Student',
    email: 'test@college.edu',
    password: 'short',
  });
  t4.passed = t4.statusCode === 503 && t4.body?.message?.includes('MongoDB Atlas is not connected yet');
  console.log(`Test 4: Database Connection Guard (POST /api/auth/signup) -> Status: ${t4.statusCode} [${t4.passed ? 'PASS ✅' : 'FAIL ❌'}]`);

  console.log('\n--- Summary ---');
  const allPassed = t1.passed && t2.passed && t3.passed && t4.passed;
  if (allPassed) {
    console.log('🎉 ALL BACKEND CHECKS PASSED SUCCESSFULLY!\n');
    process.exit(0);
  } else {
    console.log('❌ SOME TESTS FAILED!\n');
    process.exit(1);
  }
}

startTests();
