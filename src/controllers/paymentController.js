import Payment from '../models/Payment.js';
import User from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';

export const createPayment = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch the user and populate category
    const user = await User.findById(userId).populate('regcategory_id');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const category = user.regcategory_id;
    if (!category) return res.status(400).json({ error: 'User does not have a valid registration category' });

    // Determine payment type and amount
    const payment_type = user.regtype;
    const payment_category = category.name;

    let amount;
    if (payment_type.startsWith('Regular')) {
      amount = category.regular_amount;
    } else if (payment_type.startsWith('Tatkal')) {
      amount = category.tatkal_amount;
    } else {
      return res.status(400).json({ error: 'Invalid registration type for user' });
    }

    // For demo/testing purposes, create mock stripe_id and order_id
    const stripe_id = `stripe_${uuidv4()}`;
    const order_id = `order_${uuidv4()}`;

    const payment = new Payment({
      user_id: user._id,
      payment_category,
      payment_type,
      amount,
      stripe_id,
      order_id
    });

    await payment.save();

    res.status(201).json({
      success: true,
      message: 'Payment record created successfully',
      data: payment
    });
  } catch (err) {
    console.error('Payment creation error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
