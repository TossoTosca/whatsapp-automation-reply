const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { Client, LocalAuth } = require('whatsapp-web.js');
const connectDB = require('./src/config/db');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*" }
});

let db;
let client;
let botStatus = "DISCONNECTED";

// ==========================================
// 1. WHATSAPP BOT INTERACTIVE LIFECYCLE
// ==========================================
async function initWhatsAppBot(nomorHP) {
    if (client) return; 

    updateStatus("CONNECTING");
    io.emit('bot-log', `[INFO] Memulai browser untuk nomor: ${nomorHP}...`);

    const nomorBersih = nomorHP.replace(/[^0-9]/g, '');

    client = new Client({
        authStrategy: new LocalAuth({ clientId: "primary-session" }),
        authTimeoutMs: 60000,
        takeoverOnConflict: true,
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--disable-software-rasterizer',
                '--disable-dev-shm-usage',
                '--no-zygote',
                '--single-process'
            ]
        }
    });

    client.on('qr', async (qr) => {
        try {
            const code = await client.requestPairingCode(nomorBersih);
            io.emit('bot-pairing', code);
            io.emit('bot-log', `[INFO] Pairing Code Berhasil Dibuat: ${code}`);
        } catch (err) {
            updateStatus("DISCONNECTED");
            io.emit('bot-log', `[ERROR] Gagal generate code: ${err.message}`);
        }
    });

    client.on('authenticated', () => {
        updateStatus("AUTHENTICATED");
        io.emit('bot-log', '[INFO] Terautentikasi! Menyinkronkan data...');
    });

    client.on('ready', async () => {
        updateStatus("READY");
        const myNumber = client.info.wid.user;
        const myName = client.info.pushname || "Bot WhatsApp";

        await db.run(
            `INSERT INTO devices (nomor_hp, nama_profil, status) 
             VALUES (?, ?, 'CONNECTED') 
             ON CONFLICT(nomor_hp) DO UPDATE SET nama_profil=?, status='CONNECTED', updated_at=CURRENT_TIMESTAMP`,
            [myNumber, myName, myName]
        );

        io.emit('bot-device-info', { nomor_hp: myNumber, nama_profil: myName });
        io.emit('bot-log', `[SUCCESS] Bot Aktif! Terhubung sebagai ${myName}`);
    });

    client.on('auth_failure', () => {
        updateStatus("DISCONNECTED");
        io.emit('bot-log', '[WARNING] Otentikasi gagal atau kedaluwarsa.');
        cleanUpClient();
    });

    client.on('disconnected', async () => {
        updateStatus("DISCONNECTED");
        await db.run("UPDATE devices SET status = 'DISCONNECTED'");
        io.emit('bot-log', '[INFO] Perangkat terputus.');
        cleanUpClient();
    });

    client.on('message', async (msg) => {
        // ... (logic incoming messages) ...
    });

    client.initialize().catch(err => {
        updateStatus("DISCONNECTED");
        io.emit('bot-log', `[CRITICAL] Gagal inisialisasi: ${err.message}`);
        cleanUpClient();
    });
}

function cleanUpClient() {
    client = null;
}

function forceKillChromium() {
    exec('taskkill /f /im chrome.exe /im chromium.exe', (err, stdout, stderr) => {
        
    });
}


function updateStatus(status) {
    botStatus = status;
    io.emit('bot-status', status);
}

// ==========================================
// 2. REST API ENDPOINTS
// ==========================================

app.post('/api/bot/start', async (req, res) => {

    const { nomor_hp } = req.body;
    if (!nomor_hp) return res.status(400).json({ error: "Nomor wajib diisi!" });
    
    try {
        initWhatsAppBot(nomor_hp);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/bot/cancel', async (req, res) => {
    io.emit('bot-log', '[CANCEL] Menghentikan paksa sesi penautan...');
    updateStatus("DISCONNECTED");
    
    if (client) {
        try {
            await client.destroy();
        } catch (e) {}
        client = null;
    }
    
    setTimeout(() => {
        forceKillChromium();
        res.json({ success: true, message: "Sesi dibersihkan total." });
    }, 1000);
});

app.post('/api/bot/stop', async (req, res) => {
    if (client) {
        io.emit('bot-log', '[SHUTDOWN] Mematikan sesi browser secara aman...');
        try {
            await client.destroy();
            client = null;
            updateStatus("DISCONNECTED");
            await db.run("UPDATE devices SET status = 'DISCONNECTED'");
            res.json({ success: true, message: "Bot berhasil dimatikan." });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.json({ success: false, message: "Bot memang sedang tidak aktif." });
    }
});

app.get('/api/autoreplies', async (req, res) => {
    const list = await db.all("SELECT * FROM autoreplies ORDER BY id DESC");
    res.json(list);
});

app.post('/api/autoreplies', async (req, res) => {
    const { keyword, reply } = req.body;
    try {
        await db.run("INSERT INTO autoreplies (keyword, reply) VALUES (?, ?)", [keyword.toLowerCase().trim(), reply]);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: "Kata kunci sudah terdaftar!" });
    }
});

app.delete('/api/autoreplies/:id', async (req, res) => {
    await db.run("DELETE FROM autoreplies WHERE id = ?", [req.params.id]);
    res.json({ success: true });
});

app.get('/api/settings', async (req, res) => {
    const settingsRaw = await db.all("SELECT * FROM settings");
    const blacklist = await db.all("SELECT * FROM ignored_numbers ORDER BY id DESC");
    
    const settings = {};
    settingsRaw.forEach(row => settings[row.key] = row.value);

    res.json({ settings, blacklist });
});

app.post('/api/settings', async (req, res) => {
    const { fallback_message, reply_only_contacts } = req.body;
    await db.run("UPDATE settings SET value = ? WHERE key = 'fallback_message'", [fallback_message]);
    await db.run("UPDATE settings SET value = ? WHERE key = 'reply_only_contacts'", [String(reply_only_contacts)]);
    res.json({ success: true });
});

app.post('/api/settings/blacklist', async (req, res) => {
    const { nomor_hp, keterangan } = req.body;
    try {
        await db.run("INSERT INTO ignored_numbers (nomor_hp, keterangan) VALUES (?, ?)", [nomor_hp.trim(), keterangan]);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: "Nomor sudah ada di blacklist!" });
    }
});

app.delete('/api/settings/blacklist/:id', async (req, res) => {
    await db.run("DELETE FROM ignored_numbers WHERE id = ?", [req.params.id]);
    res.json({ success: true });
});

// ==========================================
// 3. INITIALIZE SERVER & SOCKET CONNECT
// ==========================================
io.on('connection', (socket) => {
    socket.emit('bot-status', botStatus);
    if (client && botStatus === "READY") {
        socket.emit('bot-device-info', { nomor_hp: client.info.wid.user, nama_profil: client.info.pushname });
    }
});

const PORT = 3000;
httpServer.listen(PORT, async () => {
    db = await connectDB();
    console.log(`[SERVER] Backend Express + Socket.io berjalan di http://localhost:${PORT}`);
});