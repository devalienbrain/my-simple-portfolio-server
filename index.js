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
      "https://sabbir-hassan-portfolio.vercel.app",
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
    const skillCollection = client
      .db("sabbir-hassan-portfolio-db")
      .collection("skills");
    const projectCollection = client
      .db("sabbir-hassan-portfolio-db")
      .collection("projects");

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

    // Add a new project
    app.post("/projects", async (req, res) => {
      const project = req.body;
      try {
        const result = await projectCollection.insertOne(project);
        res.send({ message: "Project added successfully", result });
      } catch (error) {
        res.status(500).send({ message: "Failed to add project", error });
      }
    });

    // Update an existing project by ID
    app.put("/projects/:id", async (req, res) => {
      const projectId = req.params.id;
      const updatedProject = req.body;
      try {
        const result = await projectCollection.updateOne(
          { _id: new ObjectId(projectId) },
          { $set: updatedProject }
        );
        if (result.modifiedCount === 1) {
          res.send({ message: "Project updated successfully" });
        } else {
          res
            .status(404)
            .send({ message: "Project not found or no changes made" });
        }
      } catch (error) {
        res.status(500).send({ message: "Failed to update project", error });
      }
    });

    // Delete a project by ID
    app.delete("/projects/:id", async (req, res) => {
      const projectId = req.params.id;
      try {
        const result = await projectCollection.deleteOne({
          _id: new ObjectId(projectId),
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
