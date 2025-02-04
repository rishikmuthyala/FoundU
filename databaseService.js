import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const uCardSchema = new mongoose.Schema({
  name: String,
  status: String,
  email: String,
  location: String,
  description: String,
  imageUri: String,
});

const UCard = mongoose.model('UCard', uCardSchema);

export const createUCardRecord = async (cardDetails) => {
  try {
    const ucard = new UCard(cardDetails);
    await ucard.save();
    console.log('UCard record created');
  } catch (error) {
    console.error('Error creating UCard record:', error);
  }
};
