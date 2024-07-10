const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = 5000;
const cors = require("cors");

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Connection URI
const uri = "mongodb://127.0.0.1:27017/todo"; // Replace with your MongoDB URI and database name

// Create a new MongoClient
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

// Function to insert a single user into MongoDB
async function insertUser(user) {
  try {
    const database = client.db(); // Get the default database
    const collection = database.collection("users"); // Get the users collection

    // Insert the user document into MongoDB
    const result = await collection.insertOne(user);
    console.log("User inserted:", result.insertedId);
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

// Signup endpoint
app.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const database = client.db();
    const collection = database.collection("users");

    const existingUser = await collection.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Insert new user into MongoDB
    await insertUser({ username, password, email });

    res.json({
      message: "Signup successful",
      receivedData: { username, password, email },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { lusername, lpassword } = req.body;

  try {
    const database = client.db();
    const collection = database.collection("users");

    // Find user with matching username and password
    const user = await collection.findOne({
      username: lusername,
      password: lpassword,
    });

    if (user) {
      res.json({
        message: "Login successful",
        receivedData: { lusername, lpassword },
      });
    } else {
      res.status(401).json({
        message: "Invalid username or password",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
});

// Function to insert a single activity into MongoDB
async function insertActivity(activity) {
  try {
    const database = client.db(); // Get the default database
    const collection = database.collection("activities"); // Get the activities collection

    // Insert the activity document into MongoDB
    const result = await collection.insertOne(activity);
    console.log("Activity inserted:", result.insertedId);
  } catch (error) {
    console.error("Error inserting activity:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

// Activity endpoint
app.post("/activity", async (req, res) => {
  const { activity } = req.body;

  try {
    await insertActivity({ activity }); // Call the insertActivity function

    res.json({
      message: "Activity added successfully",
      receivedData: { activity },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
});

// Get all activities endpoint
app.get("/activities", async (req, res) => {
  try {
    const database = client.db(); // Get the default database
    const collection = database.collection("activities"); // Get the activities collection

    // Fetch all activities from MongoDB
    const activities = await collection.find({}).toArray();

    res.json({
      activities,
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
});

// Update activity endpoint
app.put("/activity/:index", async (req, res) => {
  const { index } = req.params;
  const { activity } = req.body;

  try {
    const database = client.db(); // Get the default database
    const collection = database.collection("activities"); // Get the activities collection

    // Fetch all activities from MongoDB
    const activities = await collection.find({}).toArray();

    // Check if the index is valid
    if (index < 0 || index >= activities.length) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Find the activity at the specified index
    const activityToUpdate = activities[parseInt(index)];

    // Update the activity document in MongoDB using its ObjectID
    const result = await collection.updateOne(
      { _id: new ObjectId(activityToUpdate._id) },
      { $set: { activity } }
    );

    if (result.modifiedCount === 1) {
      res.json({ message: "Activity updated successfully" });
    } else {
      res.status(404).json({ message: "Activity not found" });
    }
  } catch (error) {
    console.error("Error updating activity:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
});

// Delete activity endpoint
app.delete("/activity/:index", async (req, res) => {
  const { index } = req.params;

  try {
    const database = client.db(); // Get the default database
    const collection = database.collection("activities"); // Get the activities collection

    // Fetch all activities from MongoDB
    const activities = await collection.find({}).toArray();

    // Check if the index is valid
    if (index < 0 || index >= activities.length) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Find the activity at the specified index
    const activityToDelete = activities[parseInt(index)];

    // Delete the activity document from MongoDB using its ObjectID
    const result = await collection.deleteOne({
      _id: new ObjectId(activityToDelete._id),
    });

    if (result.deletedCount === 1) {
      res.json({ message: "Activity deleted successfully" });
    } else {
      res.status(404).json({ message: "Activity not found" });
    }
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
});

// Start the server and connect to MongoDB
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
