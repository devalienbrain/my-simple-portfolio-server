const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
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

    const skillCollection = client
      .db("sabbir-hassan-portfolio-db")
      .collection("skills");
    const projectCollection = client
      .db("sabbir-hassan-portfolio-db")
      .collection("projects");

    // Fetch all skills
    app.get("/skills", async (req, res) => {
      try {
        const skills = await skillCollection.find().toArray();
        res.send(skills);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch skills data", error });
      }
    });

    // Add a new skill
    app.post("/skills", async (req, res) => {
      const skill = req.body;
      try {
        const result = await skillCollection.insertOne(skill);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to add skill", error });
      }
    });

    // Edit an existing skill
    app.put("/skills/:id", async (req, res) => {
      const skillId = req.params.id;
      const updatedSkill = req.body;
      try {
        const result = await skillCollection.updateOne(
          { _id: new ObjectId(skillId) },
          { $set: updatedSkill }
        );
        if (result.modifiedCount === 1) {
          res.send({ message: "Skill updated successfully" });
        } else {
          res
            .status(404)
            .send({ message: "Skill not found or no changes made" });
        }
      } catch (error) {
        res.status(500).send({ message: "Failed to update skill", error });
      }
    });

    // Delete a skill by ID
    app.delete("/skills/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const result = await skillCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 1) {
          res.send({ message: "Skill deleted successfully" });
        } else {
          res.status(404).send({ message: "Skill not found" });
        }
      } catch (error) {
        res.status(500).send({ message: "Failed to delete skill", error });
      }
    });

    // Fetch all projects
    app.get("/projects", async (req, res) => {
      try {
        const projects = await projectCollection.find().toArray();
        res.send(projects);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Failed to fetch projects data", error });
      }
    });

    // Fetch a specific project by ID
    app.get("/projects/:id", async (req, res) => {
      const projectId = req.params.id;
      try {
        const project = await projectCollection.findOne({
          _id: new ObjectId(projectId),
        });
        if (project) {
          res.send(project);
        } else {
          res.status(404).send({ message: "Project not found" });
        }
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch project", error });
      }
    });

    // Add a new project to the collection
    app.post("/projects", async (req, res) => {
      const project = req.body;
      try {
        const result = await projectCollection.insertOne(project);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to add project", error });
      }
    });

    // Delete a project by ID
    app.delete("/projects/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const result = await projectCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 1) {
          res.send({ message: "Project deleted successfully" });
        } else {
          res.status(404).send({ message: "Project not found" });
        }
      } catch (error) {
        res.status(500).send({ message: "Failed to delete project", error });
      }
    });

    // Get links from db
    const linkCollection = client
      .db("sabbir-hassan-portfolio-db")
      .collection("links");

    // Fetch resume links
    app.get("/links", async (req, res) => {
      try {
        const links = await linkCollection.findOne({}); // Assumes a single document
        res.send(links);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Failed to fetch resume links", error });
      }
    });

    console.log("Connected to MongoDB successfully.");
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
