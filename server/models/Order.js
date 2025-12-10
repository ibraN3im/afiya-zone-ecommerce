import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: {
    type: Array,  // Flexible array to accept any structure
    required: true
  },
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'cash_on_delivery', 'bank_transfer']
  },
  subtotal: {
    type: Number,
    required: true
  },
  shipping: {
    type: Number,
    required: true,
    default: 0
  },
  tax: {
    type: Number,
    required: true,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  // New fields to track admin who made changes
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String
}, {
  timestamps: true,
  strict: false  // Disable strict mode to allow flexible schema
});

// Delete existing model if it exists to avoid caching issues
if (mongoose.models.Order) {
  delete mongoose.models.Order;
}
if (mongoose.connection.collections['orders']) {
  mongoose.connection.collections['orders'].drop().catch(() => { });
}

const Order = mongoose.model('Order', orderSchema);

export default Order;