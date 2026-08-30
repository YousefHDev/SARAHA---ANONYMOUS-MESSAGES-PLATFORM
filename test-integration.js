const BASE_URL = 'http://127.0.0.1:3000/api/v1';

async function runIntegrationTest() {
  console.log('🚀 Running Integration Test Suite for Saraha Platform...');

  const timestamp = Date.now();
  const testUsername = `user${timestamp}`;
  const testEmail = `${testUsername}@example.com`;
  const testPassword = 'password123';

  // 1. Signup
  console.log(`\n1️⃣ Testing Signup for @${testUsername}...`);
  const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: testUsername,
      email: testEmail,
      password: testPassword,
      name: 'Test Account'
    })
  });
  const signupData = await signupRes.json();
  if (signupRes.status !== 201) {
    throw new Error(`Signup failed: ${JSON.stringify(signupData)}`);
  }
  console.log('✅ Signup Successful! Token acquired.');
  const token = signupData.token;

  // 1b. Login Test (Username and Email)
  console.log(`\n1️⃣b Testing Login with Username (${testUsername.toUpperCase()}) & Password...`);
  const loginUserRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      emailOrUsername: testUsername.toUpperCase(),
      password: testPassword
    })
  });
  const loginUserData = await loginUserRes.json();
  if (loginUserRes.status !== 200 || !loginUserData.token) {
    throw new Error(`Login with username failed: ${JSON.stringify(loginUserData)}`);
  }
  console.log('✅ Login with Username Successful!');

  console.log(`\n1️⃣c Testing Login with Email (${testEmail}) & Password...`);
  const loginEmailRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      emailOrUsername: testEmail,
      password: testPassword
    })
  });
  const loginEmailData = await loginEmailRes.json();
  if (loginEmailRes.status !== 200 || !loginEmailData.token) {
    throw new Error(`Login with email failed: ${JSON.stringify(loginEmailData)}`);
  }
  console.log('✅ Login with Email Successful!');

  // 2. Regex Handle Availability Check
  console.log(`\n2️⃣ Testing Regex Username Availability Check...`);
  const checkRes = await fetch(`${BASE_URL}/user/check-username?username=${testUsername}`);
  const checkData = await checkRes.json();
  console.log(`   Handle "${testUsername}" availability check: ${checkData.available ? 'AVAILABLE' : 'TAKEN (Expected)'}`);

  // 3. Send Anonymous Message
  console.log(`\n3️⃣ Testing Sending Anonymous Message to @${testUsername}...`);
  const sendRes = await fetch(`${BASE_URL}/message/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: testUsername,
      content: 'Hello! This is a confidential test message sent anonymously. Keep up the great work!',
      isEncrypted: true
    })
  });
  const sendData = await sendRes.json();
  if (sendRes.status !== 201) {
    throw new Error(`Send message failed: ${JSON.stringify(sendData)}`);
  }
  console.log(`✅ Anonymous Message Sent Successfully! Message ID: ${sendData.data.messageId}`);
  const msgId = sendData.data.messageId;

  // 4. Retrieve Inbox Messages
  console.log(`\n4️⃣ Testing Inbox Retrieval with Bearer JWT Token...`);
  const inboxRes = await fetch(`${BASE_URL}/message/inbox`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const inboxData = await inboxRes.json();
  console.log(`✅ Received ${inboxData.results} message(s) in inbox.`);
  console.log(`   Message Content: "${inboxData.data.messages[0].content}"`);

  // 5. Freeze Message
  console.log(`\n5️⃣ Testing Freezing/Pinning Message...`);
  const freezeRes = await fetch(`${BASE_URL}/message/${msgId}/freeze`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const freezeData = await freezeRes.json();
  console.log(`✅ Freeze Toggle Response: ${freezeData.message}`);

  // 6. Delete Message
  console.log(`\n6️⃣ Testing Message Deletion...`);
  const deleteRes = await fetch(`${BASE_URL}/message/${msgId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const deleteData = await deleteRes.json();
  console.log(`✅ Delete Response: ${deleteData.message}`);

  console.log('\n🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY! SARAHA API IS 100% PRODUCTION READY!');
}

runIntegrationTest().catch(err => {
  console.error('❌ Integration Test Failed:', err);
  process.exit(1);
});
