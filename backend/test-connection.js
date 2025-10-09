#!/usr/bin/env node

const axios = require('axios');
const os = require('os');

async function testConnection() {
  console.log('\n🧪 Testing API Connection\n');
  console.log('='.repeat(40));
  
  // Get local IP addresses
  const interfaces = os.networkInterfaces();
  const ips = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === 'IPv4' && !interface.internal) {
        ips.push(interface.address);
      }
    }
  }
  
  // Test localhost
  await testEndpoint('localhost', 'http://localhost:5000/api/test');
  
  // Test each IP address
  for (const ip of ips) {
    await testEndpoint(ip, `http://${ip}:5000/api/test`);
  }
  
  console.log('\n' + '='.repeat(40));
  console.log('✅ Share working IP addresses with team members');
}

async function testEndpoint(name, url) {
  try {
    const response = await axios.get(url, { timeout: 5000 });
    console.log(`✅ ${name}: ${url} - Working`);
    console.log(`   Response: ${response.data.message}`);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log(`❌ ${name}: ${url} - Server not running`);
    } else if (error.code === 'ENOTFOUND') {
      console.log(`❌ ${name}: ${url} - Host not found`);
    } else if (error.code === 'ETIMEDOUT') {
      console.log(`⏰ ${name}: ${url} - Connection timeout`);
    } else {
      console.log(`❌ ${name}: ${url} - ${error.message}`);
    }
  }
}

// Run the test
testConnection().catch(console.error);
