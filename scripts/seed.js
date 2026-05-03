#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const { seedDatabase } = require('../src/config/db/seed');

async function main() {
    const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/baokim_dev';
    try {
        console.log('[seed] Connecting to', mongoUri);
        await mongoose.connect(mongoUri);
        console.log('[seed] Connected. Running seedDatabase()');
        await seedDatabase();
        console.log('[seed] Completed.');
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('[seed] Error:', err);
        try { await mongoose.disconnect(); } catch (e) {}
        process.exit(1);
    }
}

main();
