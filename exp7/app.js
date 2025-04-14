const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// MongoDB connection setup
const MongoDB_URI = "mongodb+srv://pankajgupta0695:mgSqRaO7Nf8Kst3z@cluster0.ymaawz3.mongodb.net/";
const client = new MongoClient(MongoDB_URI);
let productsCollection;

client
  .connect()
  .then(() => {
    const db = client.db("products-management");
    productsCollection = db.collection("products");
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

/**
 * CREATE: Add a new product
 */
app.post("/products", async (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Name and price are required" });
  }

  try {
    await productsCollection.insertOne({ name, price });
    res.status(201).json({ message: "Product added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

/**
 * READ: Get all products
 */
app.get("/products", async (req, res) => {
  try {
    const products = await productsCollection.find().toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/**
 * READ: Get a product by ID
 */
app.get("/products/:id", async (req, res) => {
  try {
    const product = await productsCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

/**
 * UPDATE: Update a product by ID
 */
app.put("/products/:id", async (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Name and price are required" });
  }

  try {
    const result = await productsCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, price } },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(result.value);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

/**
 * DELETE: Delete a product by ID
 */
app.delete("/products/:id", async (req, res) => {
  try {
    const result = await productsCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(204).send({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Middleware for handling errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
