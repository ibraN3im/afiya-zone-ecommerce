import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, minRating, search, sortBy, isFeatured } = req.query;

    let query = {};

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Featured products filter
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    // Search filter
    if (search) {
      query.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.ar': { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sort = {};
    switch (sortBy) {
      case 'priceLowHigh':
        sort.price = 1;
        break;
      case 'priceHighLow':
        sort.price = -1;
        break;
      case 'rating':
        sort.rating = -1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      default:
        sort.rating = -1; // Sort by rating by default (popular products)
    }

    const products = await Product.find(query).sort(sort);
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new product (admin only - add authentication middleware later)
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (admin only - add authentication middleware later)
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rate a product
router.post('/:id/rate', async (req, res) => {
  try {
    const { rating, userId } = req.body;
    const productId = req.params.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has already rated this product
    const existingRatingIndex = product.ratings.findIndex(r => r.userId && r.userId.toString() === userId);

    if (existingRatingIndex >= 0) {
      // Update existing rating
      product.ratings[existingRatingIndex].rating = rating;
      product.ratings[existingRatingIndex].createdAt = Date.now();
    } else {
      // Add new rating
      product.ratings.push({ userId, rating });
    }

    // Calculate new average rating
    const totalRating = product.ratings.reduce((sum, r) => sum + r.rating, 0);
    product.rating = totalRating / product.ratings.length;

    // Save the product
    await product.save();

    res.json({
      message: 'Rating submitted successfully',
      rating: product.rating,
      totalRatings: product.ratings.length
    });
  } catch (error) {
    console.error('Rate product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
