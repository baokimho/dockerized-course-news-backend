const User = require('../../app/models/User');
const Course = require('../../app/models/Course');
const News = require('../../app/models/News');

function getBooleanEnv(name, defaultValue) {
    const value = process.env[name];
    if (value == null || value === '') return defaultValue;
    return value === 'true';
}

async function ensureAdminDemoAccount() {
    const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@demo.local').trim().toLowerCase();
    const adminName = process.env.SEED_ADMIN_NAME || 'Demo Admin';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin123';
    const resetAdminPassword = getBooleanEnv('SEED_ADMIN_RESET_PASSWORD', false);

    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
        admin = new User({
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
        });
        await admin.save();

        console.log(
            `[seed] Created demo admin account: email=${adminEmail}, password=${adminPassword}`,
        );
        return admin;
    }

    let changed = false;
    if (admin.role !== 'admin') {
        admin.role = 'admin';
        changed = true;
    }

    if (resetAdminPassword) {
        admin.password = adminPassword;
        changed = true;
    }

    if (changed) {
        await admin.save();
        console.log(`[seed] Updated demo admin account: ${adminEmail}`);
    }

    return admin;
}

async function ensureSeedCourses() {
    const seedCourses = [
        {
            slug: 'nodejs-fundamentals',
            name: 'Node.js Fundamentals',
            description: 'Get started with Node.js, Express, and essential backend concepts.',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
            videoId: 'jOupHNvDIq8',
            level: 'Beginner',
        },
        {
            slug: 'practical-express-api',
            name: 'Practical Express API',
            description: 'Build REST APIs with middleware patterns and core web security in Express.',
            image: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=800&q=80',
            videoId: 'pKd0Rpw7O48',
            level: 'Intermediate',
        },
    ];

    for (const course of seedCourses) {
        await Course.findOneAndUpdate(
            { slug: course.slug },
            { $setOnInsert: course },
            { upsert: true, new: true },
        );
    }
}

async function ensureSeedNews(adminUserId) {
    const seedNews = [
        {
            slug: 'welcome-to-admin-dashboard',
            title: 'Welcome to the Admin Dashboard',
            content: 'The demo admin account is ready. Sign in to manage your content.',
            published: true,
            image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
            author: adminUserId,
        },
        {
            slug: 'automatic-database-seeding',
            title: 'Automatic Database Seeding',
            content: 'This app is configured to seed demo data automatically on startup.',
            published: true,
            image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80',
            author: adminUserId,
        },
    ];

    for (const article of seedNews) {
        await News.findOneAndUpdate(
            { slug: article.slug },
            { $setOnInsert: article },
            { upsert: true, new: true },
        );
    }
}

async function seedDatabase() {
    const autoSeedEnabled = getBooleanEnv('AUTO_SEED', true);
    if (!autoSeedEnabled) {
        console.log('[seed] AUTO_SEED is false. Skipping seed process.');
        return;
    }

    const seedDemoContent = getBooleanEnv('SEED_DEMO_CONTENT', true);
    const admin = await ensureAdminDemoAccount();

    if (seedDemoContent) {
        await ensureSeedCourses();
        await ensureSeedNews(admin._id);
        console.log('[seed] Demo courses and news are ready.');
    }
}

module.exports = {
    seedDatabase,
};
