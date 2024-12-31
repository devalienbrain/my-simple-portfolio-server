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

// MongoDB URI and Client Setup
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
    console.log("Connected to MongoDB successfully.");

    // Database Collections
    const db = client.db("sabbir-hassan-portfolio-db");
    const skillCollection = db.collection("skills");
    const projectCollection = db.collection("projects");
    const linksCollection = db.collection("links");
    const blogsCollection = db.collection("blogs");

    // Project Routes
    app.get("/projects", async (req, res) => {
      try {
        const projects = await projectCollection.find().toArray();
        res.json(projects);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Failed to fetch projects data", error });
      }
    });

    app.get("/projects/:id", async (req, res) => {
      const projectId = req.params.id;
      try {
        const project = await projectCollection.findOne({
          _id: new ObjectId(projectId),
        });
        if (project) {
          res.json(project);
        } else {
          res.status(404).json({ message: "Project not found" });
        }
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch project", error });
      }
    });

    app.post("/projects", async (req, res) => {
      const project = req.body;
      try {
        const result = await projectCollection.insertOne(project);
        res.status(201).json({ message: "Project added successfully", result });
      } catch (error) {
        res.status(500).json({ message: "Failed to add project", error });
      }
    });

    app.put("/projects/:id", async (req, res) => {
      const projectId = req.params.id;
      const updatedProject = req.body;
      try {
        const result = await projectCollection.updateOne(
          { _id: new ObjectId(projectId) },
          { $set: updatedProject }
        );
        if (result.modifiedCount === 1) {
          res.json({ message: "Project updated successfully" });
        } else {
          res
            .status(404)
            .json({ message: "Project not found or no changes made" });
        }
      } catch (error) {
        res.status(500).json({ message: "Failed to update project", error });
      }
    });

    app.delete("/projects/:id", async (req, res) => {
      const projectId = req.params.id;
      try {
        const result = await projectCollection.deleteOne({
          _id: new ObjectId(projectId),
        });
        if (result.deletedCount === 1) {
          res.json({ message: "Project deleted successfully" });
        } else {
          res.status(404).json({ message: "Project not found" });
        }
      } catch (error) {
        res.status(500).json({ message: "Failed to delete project", error });
      }
    });

    // Skill Routes
    app.get("/skills", async (req, res) => {
      try {
        const skills = await skillCollection.find().toArray();
        res.json(skills);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch skills data", error });
      }
    });

    app.get("/skills/:id", async (req, res) => {
      const skillId = req.params.id;
      try {
        const skill = await skillCollection.findOne({
          _id: new ObjectId(skillId),
        });
        if (skill) {
          res.json(skill);
        } else {
          res.status(404).json({ message: "Skill not found" });
        }
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch skill", error });
      }
    });

    app.post("/skills", async (req, res) => {
      const skill = req.body;
      try {
        const result = await skillCollection.insertOne(skill);
        res.status(201).json({ message: "Skill added successfully", result });
      } catch (error) {
        res.status(500).json({ message: "Failed to add skill", error });
      }
    });

    app.put("/skills/:id", async (req, res) => {
      const skillId = req.params.id;
      const updatedSkill = req.body;
      try {
        const result = await skillCollection.updateOne(
          { _id: new ObjectId(skillId) },
          { $set: updatedSkill }
        );
        if (result.modifiedCount === 1) {
          res.json({ message: "Skill updated successfully" });
        } else {
          res
            .status(404)
            .json({ message: "Skill not found or no changes made" });
        }
      } catch (error) {
        res.status(500).json({ message: "Failed to update skill", error });
      }
    });

    app.delete("/skills/:id", async (req, res) => {
      const skillId = req.params.id;
      try {
        const result = await skillCollection.deleteOne({
          _id: new ObjectId(skillId),
        });
        if (result.deletedCount === 1) {
          res.json({ message: "Skill deleted successfully" });
        } else {
          res.status(404).json({ message: "Skill not found" });
        }
      } catch (error) {
        res.status(500).json({ message: "Failed to delete skill", error });
      }
    });

    // Links Routes
    app.get("/links", async (req, res) => {
      try {
        const linksData = await linksCollection.findOne({});
        if (linksData) {
          res.json(linksData);
        } else {
          res.status(404).json({ message: "Links data not found" });
        }
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch links data", error });
      }
    });

    app.post("/links", async (req, res) => {
      const linksData = req.body;
      try {
        const result = await linksCollection.updateOne(
          {},
          { $set: linksData },
          { upsert: true }
        );
        res
          .status(200)
          .json({ message: "Links data saved successfully", result });
      } catch (error) {
        res.status(500).json({ message: "Failed to save links data", error });
      }
    });

    // BlogS Routes
    app.get("/blogs", async (req, res) => {
      try {
        const blogs = await blogsCollection.find().toArray();
        res.json(blogs);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch skills data", error });
      }
    });

    app.get("/blogs/:id", async (req, res) => {
      const blogId = req.params.id;
      try {
        const blog = await blogsCollection.findOne({
          _id: new ObjectId(blogId),
        });
        if (blog) {
          res.json(blog);
        } else {
          res.status(404).json({ message: "Blog not found" });
        }
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch blog", error });
      }
    });

    app.post("/blogs", async (req, res) => {
      const blog = req.body;
      try {
        const result = await blogsCollection.insertOne(blog);
        res.status(201).json({ message: "Blog added successfully", result });
      } catch (error) {
        res.status(500).json({ message: "Failed to add blog", error });
      }
    });

    app.put("/blogs/:id", async (req, res) => {
      const blogId = req.params.id;
      const updatedBlog = req.body;
      try {
        const result = await blogsCollection.updateOne(
          { _id: new ObjectId(blogId) },
          { $set: updatedBlog }
        );
        if (result.modifiedCount === 1) {
          res.json({ message: "Blog updated successfully" });
        } else {
          res
            .status(404)
            .json({ message: "Blog not found or no changes made" });
        }
      } catch (error) {
        res.status(500).json({ message: "Failed to update blog", error });
      }
    });

    app.delete("/skills/:id", async (req, res) => {
      const blogId = req.params.id;
      try {
        const result = await blogsCollection.deleteOne({
          _id: new ObjectId(blogId),
        });
        if (result.deletedCount === 1) {
          res.json({ message: "Blog deleted successfully" });
        } else {
          res.status(404).json({ message: "Blog not found" });
        }
      } catch (error) {
        res.status(500).json({ message: "Failed to delete blog", error });
      }
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}

// Initialize MongoDB connection and start the server
run().catch((error) => console.error("Error running the app:", error));

// Health check route
app.get("/", (req, res) => {
  res.send("Hassan's simple portfolio server is running..");
});

// Start the server
app.listen(port, () => {
  console.log(`Hassan's simple portfolio server running on port ${port}`);
});
