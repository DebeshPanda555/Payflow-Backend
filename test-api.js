const http = require('http');

async function test() {
  // 1. Register a user
  let res = await fetch("http://localhost:5001/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "test@example.com", password: "password", name: "Test User" })
  });
  
  if (res.status === 400) { // maybe already exists, try login
    res = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", password: "password" })
    });
  }
  
  const data = await res.json();
  const token = data.data.token;
  console.log("Token:", token);

  // 2. Call addMoney
  let fundRes = await fetch("http://localhost:5001/api/wallets/fund", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ amount: 100 })
  });
  
  const fundData = await fundRes.json();
  console.log("Add Money Response:", fundData);

  // 3. Call getWalletBalance
  let getRes = await fetch("http://localhost:5001/api/wallets/me", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const getData = await getRes.json();
  console.log("Get Wallet Response:", getData);
}

test().catch(console.error);
