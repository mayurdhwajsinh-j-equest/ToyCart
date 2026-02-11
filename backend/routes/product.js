// import express from 'express';
// import { products, relatedNews } from '../data/products.js';

// const router = express.Router();

// // GET /api/products - Get all products
// router.get('/', (req, res) => {
//   try {
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch products' });
//   }
// });

// // GET /api/products/:id - Get single product
// router.get('/:id', (req, res) => {
//   try {
//     const productId = parseInt(req.params.id);
//     const product = products.find(p => p.id === productId);

//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch product' });
//   }
// });

// // GET /api/products/:id/related - Get related products
// router.get('/:id/related', (req, res) => {
//   try {
//     const productId = parseInt(req.params.id);
    
//     // Return other products as related products (exclude current product)
//     const relatedProducts = products
//       .filter(p => p.id !== productId)
//       .slice(0, 4); // Limit to 4 related products

//     res.json(relatedProducts);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch related products' });
//   }
// });

// // POST /api/products - Create new product (admin only)
// router.post('/', (req, res) => {
//   try {
//     const { name, price, originalPrice, description, images, features } = req.body;

//     if (!name || !price) {
//       return res.status(400).json({ error: 'Name and price are required' });
//     }

//     const newProduct = {
//       id: Math.max(...products.map(p => p.id)) + 1,
//       name,
//       price,
//       originalPrice,
//       rating: 0,
//       reviews: 0,
//       badge: 'New',
//       description,
//       images: images || [],
//       features: features || [],
//       guide: 'Coming soon',
//       warranty: '1 year',
//       automation: 'N/A',
//       care: 'Follow care instructions',
//       vehiclesIncluded: [],
//       carbonSaved: '0g',
//       safetyDescription: 'Child-safe approved',
//       safetyImages: [],
//     };

//     products.push(newProduct);
//     res.status(201).json(newProduct);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to create product' });
//   }
// });

// // PUT /api/products/:id - Update product
// router.put('/:id', (req, res) => {
//   try {
//     const productId = parseInt(req.params.id);
//     const productIndex = products.findIndex(p => p.id === productId);

//     if (productIndex === -1) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     const updatedProduct = { ...products[productIndex], ...req.body };
//     products[productIndex] = updatedProduct;

//     res.json(updatedProduct);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update product' });
//   }
// });

// // DELETE /api/products/:id - Delete product
// router.delete('/:id', (req, res) => {
//   try {
//     const productId = parseInt(req.params.id);
//     const productIndex = products.findIndex(p => p.id === productId);

//     if (productIndex === -1) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     const deletedProduct = products.splice(productIndex, 1);
//     res.json({ message: 'Product deleted successfully', product: deletedProduct[0] });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to delete product' });
//   }
// });

// export default router;