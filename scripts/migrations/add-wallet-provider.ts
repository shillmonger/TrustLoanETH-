import mongoose from 'mongoose';
import User from '@/models/User';
import dbConnect from '@/lib/db';

async function migrate() {
  try {
    console.log('Starting migration: Adding walletProvider to existing users...');
    
    // Connect to the database
    await dbConnect();
    
    // Find all users without a walletProvider
    const usersToUpdate = await User.find({ walletProvider: { $exists: false } });
    
    console.log(`Found ${usersToUpdate.length} users to update`);
    
    // Update each user with a default wallet provider
    const updates = usersToUpdate.map(user => 
      User.updateOne(
        { _id: user._id },
        { 
          $set: { 
            walletProvider: 'metamask', // Default to MetaMask
            updatedAt: new Date()
          }
        }
      )
    );
    
    // Execute all updates in parallel
    const results = await Promise.all(updates);
    const updatedCount = results.reduce((sum, result) => sum + (result.modifiedCount || 0), 0);
    
    console.log(`✅ Successfully updated ${updatedCount} users with default wallet provider`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

// Run the migration
migrate();
