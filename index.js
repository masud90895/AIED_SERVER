const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
//gitignor
require("dotenv").config();
const port = process.env.PORT || 5000;

// used Middleware
app.use(cors());
// backend to client data sent
app.use(express.json());

// Connact With MongoDb Database
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.2vi6qur.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// Create a async fucntion to all others activity
async function run() {
  try {
    // Create Database to store Data
    const productsCollection = client.db("AIED").collection("products");
    const userCollection = client.db("AIED").collection("user");
    const CartCollection = client.db("AIED").collection("cart")

    app.get("/products", async (req, res) => {
      const products = await productsCollection.find({}).toArray();
      res.send(products);
    });
    app.post("/products", async (req, res) => {
      const products = await productsCollection.insertOne(req.body);
      if (products.insertedId) {
        res.send(products);
      }
    });

    app.post("/user", async (req, res) => {
      const user = await userCollection.insertOne(req.body);
      if (user.insertedId) {
        res.send(user);
      }
    });

    app.get("/user", async (req, res) => {
      const user = await userCollection.find({}).toArray();
      res.send(user);
    });

    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const user = await userCollection.deleteOne({ _id: ObjectId(id) });
      if (user.deletedCount) {
        res.send(user);
      }
    });

    app.get("/edit/:id", async (req, res) => {
      const id = req.params.id;
      const user = await userCollection.findOne({ _id: ObjectId(id) });
      res.send(user);
    });
    app.put("/edit/:id", async (req, res) => {
      const id = req.params.id;
      const result = await userCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: req.body }
      );

      if (result.matchedCount) {
        res.send(result);
      }
    });


    app.post("/cart", async (req, res) => {
      const cart = await CartCollection.insertOne(req.body);
      if (cart.insertedId) {
        res.send(cart)
      }
    })

    app.get("/cart", async (req, res) => {
      const cart = await CartCollection.find({}).toArray();
      res.send(cart);
    })






  } finally {
    // await client.close();
  }
}

// Call the fuction you decleare abobe
run().catch(console.dir);

// Root Api to cheack activity
app.get("/", (req, res) => {
  res.send("Hello From server!");
});

app.listen(port, () => console.log(`Server up and running ${port}`));
