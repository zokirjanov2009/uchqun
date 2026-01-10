import dotenv from 'dotenv';
import sequelize from '../config/database.js';
import User from '../models/User.js';

dotenv.config();

const createSuperAdmin = async () => {
    try {
        console.log('🔍 Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Connected to database');

        // Default super admin credentials
        const email = 'superadmin@uchqun.com';
        const password = 'SuperAdmin123!';
        const firstName = 'Super';
        const lastName = 'Admin';

        // Check if super admin already exists
        const existingAdmin = await User.findOne({ where: { email } });
        if (existingAdmin) {
            console.log(`\n⚠️  Super admin account already exists:`);
            console.log(`   Email: ${email}`);
            console.log(`   Password: ${password}`);
            console.log(`\n💡 To reset the password, delete the user first or update it manually.`);
            process.exit(0);
        }

        // Create super admin account
        console.log('\n👑 Creating super admin account...');
        const admin = await User.create({
            email,
            password,
            firstName,
            lastName,
            role: 'super-admin',
        });

        console.log('\n✅ Super admin account created successfully!');
        console.log('\n📝 Login credentials:');
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
        console.log('\n✨ You can now log in with these credentials.');
        console.log('\n⚠️  Remember to change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating super admin account:', error);
        process.exit(1);
    }
};

createSuperAdmin();
