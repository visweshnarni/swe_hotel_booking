// seedRegistrationCategories.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const RegistrationCategory = require('./src/models/RegistrationCategory');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const registrationCategoryEnum = [
  'Provisional Registration',
  'Bachelor of Dental Surgery (BDS) from Telangana',
  'Transfer BDS (BDS registrant - from other state dental councils in India)',
  'Transfer BDS + New MDS',
  'Transfer MDS (MDS registrant - from other state dental councils in India)',
  'Master of Dental Surgery (MDS) from Telangana',
  'Non Indian Dentist Registration (Temporary)'
];

async function seed() {
  try {
    await RegistrationCategory.deleteMany();
    const categories = registrationCategoryEnum.map(name => ({ name }));
    await RegistrationCategory.insertMany(categories);
    console.log('✅ Categories seeded');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    mongoose.disconnect();
  }
}

seed();
