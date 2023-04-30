import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as db from "./db.js";

const app = express();
/* The body-parser middleware converts text sent through an HTTP request to a target format
 */
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "public");

async function handleFormPost(req, res) {
  const { intent, title, description } = req.body;

  // console.log({ intent, title, description });
  const posts = await db.getPosts();

  switch (intent) {
    case "createPost": {
      await db.createPost({ intent, title, description });
      break;
    }
    default: {
      console.warn("Unhandled intent", intent);
      break;
    }
  }
  res.redirect(req.url);
}

function renderListItem({ title, description }) {
  return /* html */ `
		<li class="post">
			<h5> ${title}</h5>
			<h5> ${description}</h5>	
		</li>
	`;
}

async function renderApp(req, res) {
  const posts = await db.getPosts();

  res.send(/* html */ `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="blog.css" />
      <title>Blogs</title>
    </head>
    <body class="w-2-3 m-auto">
      <div class="flex">
        <div class="border-r-2 px-2 mx-2">
        <ul class="todo-list" ${posts.length ? "" : "hidden"}>
        ${posts.map((post) => renderListItem(post)).join("\n")}
      </ul>
        </div>
        <div class="flex-basis-2-3">
        <div class="border-b-2 border-color-brown"><h1>My Blog</h1></div>
        <form action="http://localhost:4130/posts" method="POST">
          <div class="flex flex-col">
          <input type="hidden" name="intent" value="createPost" />
            <label for="input-1"><h3>title</h3></label>
            <input type="text" id="input-1" name="title" placeholder="title" class="w-100" />
            <label for="input-2"><h3>description</h3></label>
            <input type="text" id="input-2" name="description" class="w-100" />
            <label for="input-3"><h3>content</h3></label>
            <textarea name="content" id="input-3" cols="30" rows="10" name="content"></textarea>
          </div>
          <div class="flex justify-end">
          <input type="submit" value="Submit">
          </div>
        </form>
      </div>
     
      </div>
    </body>
  </html>
            `);
}

app.get("/posts", renderApp);
app.post("/posts", handleFormPost);
app.get("*", (req, res) => res.redirect("/posts"));

const server = app.listen(4130, () => {
  console.log(`Server running at http://localhost:${server.address().port}`);
});
