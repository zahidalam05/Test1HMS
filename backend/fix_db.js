import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const fixDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected to fix index...');

        const db = mongoose.connection.db;
        const collections = await db.listCollections({ name: 'users' }).toArray();

        if (collections.length > 0) {
            console.log('Checking indexes on users collection...');
            const indexes = await db.collection('users').indexes();
            console.log('Current Indexes:', indexes.map(i => i.name));

            if (indexes.find(i => i.name === 'username_1')) {
                console.log('Dropping legacy username_1 index...');
                await db.collection('users').dropIndex('username_1');
                console.log('Index dropped successfully!');
            } else {
                console.log('username_1 index not found. No action needed.');
            }
        } else {
            console.log('Users collection not found.');
        }

    } catch (error) {
        console.error('Error fixing db:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

fixDb();
