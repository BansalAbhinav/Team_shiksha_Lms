# Team Setup Guide for Library Management System

## 🔧 Setup Instructions for Team Members

### Prerequisites
- Node.js (v16+)
- Git
- MongoDB access (already configured)

### 1. Clone the Repository
```bash
git clone [repository-url]
cd Team_shiksha_Lms
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in `backend` folder:
```env
PORT=5000
HOST=0.0.0.0
MONGO_URI=mongodb+srv://ravipatelctf:r0Gg8dmhqu409AJU@neog.jvytjva.mongodb.net/lms-team-shiksha?retryWrites=true&w=majority&appName=neoG
JWT_SECRET=Team_shiksha_LMS
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file in `frontend` folder:
```env
VITE_API_URL=http://[HOST_MACHINE_IP]:5000/
```

**Replace `[HOST_MACHINE_IP]` with the actual IP address of the machine running the backend.**

### 4. Finding the Host Machine IP Address

#### For Host Machine (person running the backend):
**Windows:**
```cmd
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually starts with 192.168.x.x or 10.x.x.x)

**macOS/Linux:**
```bash
ifconfig | grep inet
```

**Example IP addresses:**
- `192.168.1.100` (common home network)
- `10.0.0.50` (office network)
- `172.16.1.25` (office network)

### 5. Team Member Configuration

If the host machine's IP is `192.168.1.100`, team members should set:

**Frontend `.env`:**
```env
VITE_API_URL=http://192.168.1.100:5000/
```

### 6. Running the Application

**Host Machine (runs both backend and frontend):**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Team Members (run only frontend):**
```bash
cd frontend
npm run dev
```

### 7. Accessing the Application

- **Host Machine:** http://localhost:3000 or http://localhost:5173
- **Team Members:** http://localhost:3000 or http://localhost:5173 (frontend will connect to host's backend)

### 🚨 Troubleshooting

#### Issue: "Network Error" or "Connection Refused"

1. **Check if backend is running:**
   ```bash
   curl http://[HOST_IP]:5000/api/test
   ```

2. **Verify firewall settings:**
   - Windows: Allow Node.js through Windows Firewall
   - macOS: System Preferences > Security & Privacy > Firewall
   - Linux: Check iptables/ufw settings

3. **Check network connectivity:**
   ```bash
   ping [HOST_IP]
   ```

4. **Verify CORS configuration:**
   The backend is configured to accept requests from team members' IP addresses.

#### Issue: "CORS Error"

The backend has been configured with flexible CORS. If you still get CORS errors, add your IP range to the CORS configuration in `backend/server.js`.

### 🔧 Network Configuration

**For Corporate/Office Networks:**
- Ensure all team members are on the same network
- Check if corporate firewall blocks the ports
- Consider using a VPN if needed

**For Home Networks:**
- All devices should be connected to the same WiFi
- Router should allow local network communication

### 📱 Mobile Testing

To test on mobile devices:
1. Connect mobile to same WiFi network
2. Open browser on mobile
3. Navigate to `http://[HOST_IP]:3000` or `http://[HOST_IP]:5173`

### 🛡️ Security Notes

- This setup is for development only
- Never expose credentials in production
- Use environment variables for sensitive data
- Consider using HTTPS for production

### 📞 Support

If team members still can't access:
1. Verify host machine IP address
2. Check firewall settings
3. Ensure both machines are on same network
4. Test with `ping` and `curl` commands
5. Check browser console for specific error messages

---

**Host runs:** Backend + Frontend
**Team members run:** Frontend only (connects to host's backend)
