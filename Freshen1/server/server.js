const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());


// Connect to MongoDB
const MONGO_URL = 'mongodb://localhost:27017/admin';

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB", error);
  });

// Define the Product schema
const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    set: (value) => value.toLowerCase()  // Convert name to lowercase before saving
  },
  description: String,
  price: Number,
  type: String,
  Quantity: Number,
  image: String
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  mobilenumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user', // Default role is user
    enum: ['user', 'admin'], // Allowed roles
  },
});


const purchaseSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  purchasedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
// Create the Products model
const ProductsModel = mongoose.model('Products', productsSchema);
const Purchase = mongoose.model("Purchase", purchaseSchema);

// API endpoint to fetch all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await ProductsModel.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Signup API
app.post("/api/user", async (req, res) => {
  const { username, mobilenumber, address, pincode, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered. Please log in.",
      });
    }

    // Save new user to the database
    const newUser = new User({
      username,
      mobilenumber,
      address,
      pincode,
      email,
      password,
      role: 'user'
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while registering the user.",
    });
  }
});

app.post("/api/userlogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    return res.status(200).json({
      success: true,
      message: "Login successfully",
      role: user.role, // Return role
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred. Please try again later." });
  }
});

// Fetch user details
/*app.get("/api/users/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        email: user.email, // Corrected 'users' to 'user'
        role: user.role,
        name: user.name,
        username: user.username,
        mobilenumber: user.mobilenumber,
        address: user.address,
        pincode: user.pincode,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred. Please try again later." });
  }
});*/

// Fetch user details via POST request
app.post("/api/user-details", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        email: user.email,
        role: user.role,
        name: user.name,
        username: user.username,
        mobilenumber: user.mobilenumber,
        address: user.address,
        pincode: user.pincode,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred. Please try again later." });
  }
});

// Fetch purchases for a specific user by email
app.post("/api/purchases-by-email", async (req, res) => {
  const { email } = req.body;

  try {
    // Find purchases associated with the user's email
    const purchases = await Purchase.find({ user_email: email });

    if (!purchases || purchases.length === 0) {
      return res.status(404).json({ success: false, message: "No purchases found for this user" });
    }

    // Return the purchase data
    return res.status(200).json({
      success: true,
      data: purchases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching purchase data.",
      error: error.message,
    });
  }
});


app.get("/api/admin/products", async (req, res) => {
  try {
    const products = await ProductsModel.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch products", error: error.message });
  }
});

// Place Order
app.post("/api/purchase", async (req, res) => {
  const { user_email, cartItems } = req.body;

  if (!user_email || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid request data." });
  }

  try {
    // Verify if user exists
    const user = await User.findOne({ email: user_email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prepare purchase records
    const purchases = cartItems.map((item) => ({
      user_email,
      productName: item.productName,
      productPrice: item.productPrice,
      quantity: item.quantity,
      totalPrice: item.productPrice * item.quantity,
    }));

    // Insert purchase records into MongoDB
    const result = await Purchase.insertMany(purchases);

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to place the order.",
      error: error.message,
    });
  }
});


// API endpoint to update product quantity (when adding to cart)
// API endpoint to update product quantity (when adding to cart)
app.put("/api/products/updateQuantity", async (req, res) => {
  const { productId, Quantity } = req.body; // Assuming frontend sends 'Quantity'

  try {
    const updatedProduct = await ProductsModel.findByIdAndUpdate(
      productId,
      { Quantity: Quantity },
      { new: true }
    );

    if (updatedProduct) {
      res.status(200).json({
        success: true,
        message: "Quantity updated successfully",
        data: updatedProduct
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating quantity",
      error: error.message
    });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
