import React from "react";
import {
  useTransition,
  useLoaderData,
  useActionData,
  Form,
} from "@remix-run/react";
import { ActionArgs, json, redirect, LinksFunction } from "@remix-run/node";
import { z } from "zod";
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
  let formDataPayload = Object.fromEntries(await request.formData());
  const { title, desc, content } = formDataPayload as Post;

  const errors = {
    title: title ? null : "title is required",
    desc: desc ? null : "desc is required",
    content: content ? null : "content is required",
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }
  try {
    await db.createPost({ title, desc, content });
    return redirect(`/posts`);
  } catch (error) {
    console.error(`form not submitted ${error}`);
    return redirect(`/?error=form-not-submitted`);
  }
}

export default function Posts() {
  const data = useLoaderData() as { posts: Array<Post> };

  const errors = useActionData();
  const transition = useTransition();

  const text =
    transition.state === "submitting"
      ? "Saving..."
      : transition.state === "loading"
      ? "Saved!"
      : "create post";

  return (
    <div className=" m-auto">
      <div className="flex">
        <div className="flex-basis-1-3">
          <ul hidden={!data.posts.length}>
            {data.posts.map((post, i) => (
              <li style={{ marginBottom: "20px" }} key={i}>
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
          <Form
            method="post"
            onSubmit={(event) => {
              const form = event.currentTarget;
              requestAnimationFrame(() => {
                form.reset();
              });
            }}
          >
            <div className="flex flex-col">
              <label htmlFor="input-1">
                <h3>title</h3>
              </label>
              <input
                type="text"
                id="input-1"
                className="w-100"
                autoFocus
                data-pending={
                  transition.state === "submitting" ||
                  transition.state === "loading"
                }
                name="title"
              />
              {errors?.title && <p className="error">{errors.title}</p>}
              <label htmlFor="input-2">
                <h3>desc</h3>
              </label>
              <input
                type="text"
                id="input-2"
                className="w-100"
                name="desc"
                data-pending={
                  transition.state === "submitting" ||
                  transition.state === "loading"
                }
              />
              {errors?.desc && <p className="error">{errors.desc}</p>}
              <label htmlFor="input-3">
                <h3>content</h3>
              </label>
              <textarea
                id="input-3"
                cols={30}
                rows={10}
                name="content"
                data-pending={
                  transition.state === "submitting" ||
                  transition.state === "loading"
                }
              ></textarea>
              {errors?.content && <p className="error">{errors.content}</p>}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={
                  transition.state === "submitting" ||
                  transition.state === "loading"
                }
              >
                {text}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
