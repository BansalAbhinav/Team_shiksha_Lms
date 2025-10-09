const os = require('os');

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  
  console.log('\n🌐 Network Configuration for Team Access\n');
  console.log('='.repeat(50));
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip over non-IPv4 and internal addresses
      if (interface.family === 'IPv4' && !interface.internal) {
        console.log(`\n📡 Network Interface: ${name}`);
        console.log(`🔗 IP Address: ${interface.address}`);
        console.log(`📋 Team members should use: http://${interface.address}:5000/`);
        console.log(`📋 Frontend .env should be: VITE_API_URL=http://${interface.address}:5000/`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📝 Instructions:');
  console.log('1. Share your IP address with team members');
  console.log('2. Team members update their frontend/.env file');
  console.log('3. Ensure all devices are on the same network');
  console.log('4. Check firewall settings if connection fails');
  console.log('\n✅ Backend will accept connections from team members!');
}

getLocalIPAddress();
