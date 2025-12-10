import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  description: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  category: {
    type: String,
    required: true,
    enum: ['supplements', 'cosmetics', 'herbal', 'medical', 'accessories']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  images: [{
    type: String
  }],
  features: [{
    en: String,
    ar: String
  }],
  benefits: [{
    en: String,
    ar: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // reviewsCount: {  // REMOVED AS PER USER REQUEST
  //   type: Number,
  //   default: 0,
  //   min: 0
  // },
  isNew: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true
});

// Create indexes
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'name.en': 'text', 'name.ar': 'text', 'description.en': 'text', 'description.ar': 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;