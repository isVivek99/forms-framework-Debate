import React from "react";
import {
  useLocation,
  Link,
  useLoaderData,
  useFetcher,
  Form,
} from "@remix-run/react";
import { ActionArgs, json, LinksFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import postStylesheet from "./blog.css";
import * as db from "../db";

type Post = { id: string; title: string; desc: string; content: string };

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: postStylesheet }];
};

export async function loader() {
  const posts = await db.getPosts();
  return json({ posts });
}

export async function action({ request }: ActionArgs) {
  let formData = await request.formData();
  const title = formData.get("title");
  const desc = formData.get("title");
  const content = formData.get("title");
  invariant(typeof title === "string", "title must be a string");
  invariant(typeof desc === "string", "desc must be a string");
  invariant(typeof content === "string", "content must be a string");
  console.log({ title, desc, content });
  await db.createPost({ title, desc, content });

  return null;
}

export default function Posts() {
  const data = useLoaderData() as { posts: Array<Post> };

  const createFetcher = useFetcher();
  const clearFetcher = useFetcher();
  const toggleAllFetcher = useFetcher();
  const createFormRef = React.useRef<HTMLFormElement>(null);
  const location = useLocation();

  return (
    <div className=" m-auto">
      <div className="flex">
        <div className="flex-basis-1-3">
          <ul hidden={!data.posts.length}>
            {data.posts.map((post, i) => (
              <li key={i}>
                <p className="bold my-1">{post.title}</p>
                <p className="bold my-1">{post.desc}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-2 border-r-2 px-2"></div>

        <div className="flex-basis-2-3">
          <div className="border-color-brown border-b-2">
            <h1>My Blog</h1>
          </div>
          <Form method="post">
            <div className="flex flex-col">
              <label htmlFor="input-1">
                <h3>title</h3>
              </label>
              <input
                type="text"
                id="input-1"
                className="w-100"
                autoFocus
                //data-pending={statuses.creatingPost === "loading"}
                name="title"
              />
              <label htmlFor="input-2">
                <h3>desc</h3>
              </label>
              <input
                type="text"
                id="input-2"
                className="w-100"
                name="desc"
                //data-pending={statuses.creatingPost === "loading"}
              />
              <label htmlFor="input-3">
                <h3>content</h3>
              </label>
              <textarea
                id="input-3"
                cols={30}
                rows={10}
                name="content"
                //data-pending={statuses.creatingPost === "loading"}
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                // disabled={statuses.creatingPost === "loading"}
              >
                create post
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
