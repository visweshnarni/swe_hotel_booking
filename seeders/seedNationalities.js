import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Nationality from '../src/models/Nationality.js';

dotenv.config();

const nationalities = [
  'Natural born Indian Citizen',
  'Natural born British Subject',
  'British Subject if Indian Domicile',
  'Naturalized Indian Citizen',
  'Subject of a Foreign Government'
];

const seedNationalities = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for Nationality seeding');

    await Nationality.deleteMany();
    console.log('🗑️  Existing Nationalities cleared');

    const formatted = nationalities.map(name => ({ name }));
    await Nationality.insertMany(formatted);

    console.log('🌍 Nationalities seeded successfully');
  } catch (err) {
    console.error('❌ Nationality seeding error:', err.message);
  } finally {
    mongoose.disconnect();
  }
};

seedNationalities();
