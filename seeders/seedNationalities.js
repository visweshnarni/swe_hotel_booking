const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Nationality = require('../src/models/Nationality');

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
    await Nationality.deleteMany({});
    const data = nationalities.map(name => ({ name }));
    await Nationality.insertMany(data);
    console.log('✅ Nationalities seeded');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Seeder error:', err.message);
    mongoose.disconnect();
  }
};

seedNationalities();
