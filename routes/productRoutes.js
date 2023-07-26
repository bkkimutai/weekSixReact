const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Product Model
const Queue = require('async-queue');

const MAX_RETRIES = 3; // Maximum number of retries for update

// Queue to store failed update requests
const updateQueue = new Queue({
  concurrency: 1, // Number of concurrent operations to run, 1 for sequential processing
});

// Function to update the product and handle retries
const updateProductWithRetries = async (productId, updatedProductData, retries) => {
  try {
    // Find the product by its ID
    const product = await Product.findById(productId);
    if (!product) {
      return { success: false, message: 'Product not found' };
    } else {
      // Update the product fields with the new data
      product.name = updatedProductData.name;
      product.description = updatedProductData.description;
      product.price = updatedProductData.price;
      product.quantity = updatedProductData.quantity;
      product.photo = updatedProductData.photo;
      product.deleted = updatedProductData.deleted;

      // Save the updated product to the database
      await product.save();

      return { success: true, product };
    }
  } catch (error) {
    if (retries <= 0) {
      console.error('Error updating product:', error);
      return { success: false, message: 'Server error' };
    } else {
      // Retry the update after a delay
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Add a delay before retrying
      return updateProductWithRetries(productId, updatedProductData, retries - 1);
    }
  }
};

// Update a product by its ID with retries and queuing
const updateProductQueued = (productId, updatedProductData) => {
  return new Promise((resolve, reject) => {
    updateQueue.push(async (done) => {
      const result = await updateProductWithRetries(productId, updatedProductData, MAX_RETRIES);
      if (result.success) {
        resolve(result.product);
      } else {
        reject(result.message);
      }
      done();
    });
  });
};

// Update a product by its ID
router.put('/updateproduct/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProductData = req.body;

    // Update the product with retries and queuing
    const updatedProduct = await updateProductQueued(productId, updatedProductData);

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all products
router.get('/productlist', async (req, res) => {
  try {
    const products = await Product.find({ deleted: false });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a product by its ID (Soft Delete)
router.delete('/delete/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the product by its ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Set the 'deleted' flag to true
    product.deleted = true;

    // Save the updated product to the database
    await product.save();

    res.json({ message: 'Product soft-deleted successfully' });
  } catch (error) {
    console.error('Error soft-deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
