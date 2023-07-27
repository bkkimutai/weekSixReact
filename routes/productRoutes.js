const express = require('express')
const router = express.Router();
const Product = require('../models/product'); // Product Model


// Fetch all products
router.get('/productlist', async (req, res) => {
    try {
      const products = await Product.find({deleted: false});
  
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
router.post('/addproduct', async (req, res) => {
    try {
      const newProductData = req.body;
  
      // Check for duplicate data before saving
      const existingProduct = await Product.findOne({ name: newProductData.name });
      if (existingProduct) {
        return res.status(400).json({ message: 'Product with this name already exists' +newProductData.id});
      }
      const newProduct = new Product(newProductData);
      const savedProduct = await newProduct.save();
  
      res.json(savedProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
// Update a product by its ID
router.put('/updateproduct/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProductData = req.body;

    console.log(productId);
    console.log(updatedProductData);

    // Find the product by its ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
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

      res.json(product);
      console.log(product);
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
    console.log(error);
  }
});

  
// @route DELETE api/product/products/:id
// Delete a product by its ID (Soft Delete)
router.delete('/delete/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the product by its ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Perform the hard delete by removing the product from the database
    await Product.deleteOne({ _id: productId });

    res.json({ message: 'Product hard-deleted successfully' });
  } catch (error) {
    console.error('Error hard-deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

  
module.exports = router;