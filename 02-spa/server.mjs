import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as db from "./db.mjs";

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cors());

app.get("/api/posts", async (req, res) => {
  const posts = await db.getPosts();
  res.json({ posts });
});
app.post("/api/posts", async (req, res) => {
  console.log(req.body);
  const post = await db.createPost({
    title: req.body.title,
    content: req.body.content,
    desc: req.body.desc,
  });
  res.json({ post });
});

const server = app.listen(4131, () => {
  console.log(`Server running at http://localhost:${server.address().port}`);
});
