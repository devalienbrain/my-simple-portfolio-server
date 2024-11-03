const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
// app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
  })
);
app.use(express.json());

const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const skilCollection = client.db("sabbir-hassan-portfolio-db").collection("skills");
    const projectCollection = client.db("sabbir-hassan-portfolio-db").collection("projects");
    const linkCollection = client.db("sabbir-hassan-portfolio-db").collection("links");

    // Fetch all users
    app.get("/skills", async (req, res) => {
      const query = skilCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

    // Fetch a user by Firebase uid
    app.get("/skill/:id", async (req, res) => {
      const skillId = req.params.uid;
      const query = { id: skillId };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // Add a new user to the collection
    app.post("/skills", async (req, res) => {
      const skill = req.body;
      const result = await skilCollection.insertOne(skill);
      res.send(result);
    });


    // Delete user by id
    app.delete("/skills/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
    // await client.db("admin").command({ ping: 1 });
    console.log("Hassan's simple portfolio server connected successfully to mongodb..");
  } finally {
    // await client.close(); // Commented out for persistent connection
  }
}
run().catch(console.error);

app.get("/", (req, res) => {
  res.send("Hassan's simple portfolio server is running..");
});

app.listen(port, () => {
  console.log(`Hassan's simple portfolio server running on port ${port}`);
});
