import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const fixDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const db = mongoose.connection.db;

        // List indexes on users collection
        const indexes = await db.collection('users').indexes();
        console.log('Current Indexes on users:', indexes);

        const usernameIndex = indexes.find(idx => idx.name === 'username_1');

        if (usernameIndex) {
            console.log('Found zombie index "username_1". Dropping it...');
            await db.collection('users').dropIndex('username_1');
            console.log('Successfully dropped "username_1" index.');
        } else {
            console.log('Index "username_1" not found. No action needed.');
        }

        // Also check for any other null duplicate issues?
        // Maybe rollNo on students if we change it?

    } catch (error) {
        console.error(`Error: ${error.message}`);
    } finally {
        process.exit();
    }
};

fixDB();
