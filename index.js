const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
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

    const skillCollection = client.db("sabbir-hassan-portfolio-db").collection("skills");

    // Fetch all skills
    app.get("/skills", async (req, res) => {
      try {
        const skills = await skillCollection.find().toArray();
        res.send(skills);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch skills data", error });
      }
    });

    // Fetch a specific skill by ID
    app.get("/skills/:id", async (req, res) => {
      const skillId = req.params.id;
      try {
        const skill = await skillCollection.findOne({ _id: new ObjectId(skillId) });
        if (skill) {
          res.send(skill);
        } else {
          res.status(404).send({ message: "Skill not found" });
        }
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch skill", error });
      }
    });

    // Add a new skill to the collection
    app.post("/skills", async (req, res) => {
      const skill = req.body;
      try {
        const result = await skillCollection.insertOne(skill);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to add skill", error });
      }
    });

    // Delete a skill by ID
    app.delete("/skills/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const result = await skillCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 1) {
          res.send({ message: "Skill deleted successfully" });
        } else {
          res.status(404).send({ message: "Skill not found" });
        }
      } catch (error) {
        res.status(500).send({ message: "Failed to delete skill", error });
      }
    });

    console.log("Connected to MongoDB successfully.");
  } finally {
    // Commented out for persistent connection
  }
}
run().catch(console.error);

app.get("/", (req, res) => {
  res.send("Hassan's simple portfolio server is running..");
});

app.listen(port, () => {
  console.log(`Hassan's simple portfolio server running on port ${port}`);
});
