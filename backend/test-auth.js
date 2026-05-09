const BASE_URL = process.argv[2] || 'http://localhost:5000';

async function testAuth() {
  try {
    console.log(`Testing Signup on ${BASE_URL}...`);
    const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'testauth@example.com',
        password: 'password123'
      })
    });
    const signupData = await signupRes.json();
    console.log('Signup Response:', signupRes.status, signupData);
  } catch (err) {
    console.log('Signup Error:', err);
  }

  try {
    console.log(`\nTesting Login on ${BASE_URL}...`);
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testauth@example.com',
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    console.log('Login Response:', loginRes.status, loginData);
  } catch (err) {
    console.log('Login Error:', err);
  }
}

testAuth();
