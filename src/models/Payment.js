import mongoose from 'mongoose';
const { Schema } = mongoose;


const paymentSchema = new Schema({
  // Reference to the user
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },

  // Registration Category Name (from RegistrationCategory.name)
  payment_category: {
    type: String,
    required: [true, 'Registration category name is required']
  },

  // Payment Type (fetched from User.regtype)
  payment_type: {
    type: String,
    required: [true, 'Payment type must be either { Regular (By Post - Fee includes postal charges) or Tatkal (By Hand) }']
  },

  // Amount fetched from RegistrationCategory based on type
  amount: {
    type: Number,
    required: [true, 'Amount is required']
  },

  // Stripe Payment Intent ID
  stripe_id: {
    type: String,
    required: [true, 'Stripe ID is required']
  },

  // Custom or Stripe order ID
  order_id: {
    type: String,
    required: [true, 'Order ID is required'],
    unique: true
  }

}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
