const mongoose = require('mongoose');
const { Schema } = mongoose;

// Enum for payment types
const paymentTypeEnum = ['Regular', 'Tatkal'];

const paymentSchema = new Schema({
  // Reference to User
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },

  // Reference to Registration Category (store name for easier reporting)
  payment_category: {
    type: String,
    required: [true, 'Payment category is required']
  },

  // Must match one of the enums
  payment_type: {
    type: String,
    enum: {
      values: paymentTypeEnum,
      message: 'Payment type must be either Regular or Tatkal'
    },
    required: [true, 'Payment type is required']
  },

  // Auto-calculated from RegistrationCategory based on type
  amount: {
    type: Number,
    required: [true, 'Payment amount is required']
  },

  // Stripe Payment Intent ID or Charge ID
  stripe_id: {
    type: String,
    required: [true, 'Stripe ID is required']
  },

  // Order ID (custom or Stripe)
  order_id: {
    type: String,
    required: [true, 'Order ID is required'],
    unique: true
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
