import React from "react";
import { useForm, Resolver } from "react-hook-form";
import "./blog.css";

type Post = { id: string; title: string; desc: string; content: string };

type FormValues = {
  title: string;
  desc: string;
  content: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  console.log(values);

  return {
    values: values.title ? values : {},
    errors: !values.title
      ? {
          title: {
            type: "required",
            message: "This is required.",
          },
        }
      : !values.desc
      ? {
          desc: {
            type: "required",
            message: "This is required.",
          },
        }
      : !values.content
      ? {
          content: {
            type: "required",
            message: "This is required.",
          },
        }
      : {},
  };
};
let renderCount = 0;
const Posts = () => {
  const [posts, setPosts] = React.useState<Array<Post>>([]);
  const [statuses, setStatuses] = React.useState<{
    loadingPosts: "idle" | "loading";
    creatingPost: "idle" | "loading";
  }>({
    loadingPosts: "loading",
    creatingPost: "idle",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver });

  renderCount++;

  // initial load of posts
  React.useEffect(() => {
    fetch("http://localhost:4131/api/posts")
      .then((res) => res.json())
      .then(({ posts }) => {
        setPosts(posts);
        setStatuses((old) => ({ ...old, loadingTodos: "idle" }));
      });
  }, []);

  console.log(errors);

  return (
    <div className='w-2-3 m-auto'>
      renderCount:{renderCount}
      <div className='flex'>
        <div className='flex-basis-1-3'>
          <ul hidden={!posts.length}>
            {posts.map((post, i) => (
              <li key={i}>
                <p className='bold my-1'>{post.title}</p>
                <p className='bold my-1'>{post.desc}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className='border-r-2 px-2 mx-2'></div>

        <div className='flex-basis-2-3'>
          <div className='border-b-2 border-color-brown'>
            <h1>My Blog</h1>
          </div>
          <form
            onSubmit={handleSubmit((data, e) => {
              const { title, desc, content } = data;
              e?.target.reset();

              setPosts([
                ...posts,
                { title, desc, content, id: Math.random().toFixed(2) },
              ]);

              setStatuses((old) => ({ ...old, creatingPost: "loading" }));
              fetch(`http://localhost:4131/api/posts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, desc, content }),
              })
                .then((res) => res.json())
                .then((data) => {
                  setPosts((prev) => {
                    prev[prev.length - 1] = data.post;
                    console.log(posts);
                    return prev;
                  });

                  setStatuses((old) => ({ ...old, creatingPost: "idle" }));
                });
            })}
          >
            <div className='flex flex-col'>
              <label htmlFor='input-1'>
                <h3>title</h3>
              </label>
              <input
                id='input-1'
                className={`w-100 ${
                  errors.title?.message ? "input-error" : ""
                }`}
                data-pending={statuses.creatingPost === "loading"}
                {...register("title", { required: "this field is required." })}
              />

              <p className='error'>{errors.title?.message}</p>
              <label htmlFor='input-2'>
                <h3>desc</h3>
              </label>
              <input
                id='input-2'
                className={`w-100 ${errors.desc?.message ? "input-error" : ""}`}
                data-pending={statuses.creatingPost === "loading"}
                {...register("desc", {
                  required: "this field is required.",
                })}
              />
              <p className='error'>{errors.desc?.message}</p>
              <label htmlFor='input-3'>
                <h3>content</h3>
              </label>
              <textarea
                id='input-3'
                cols={30}
                rows={10}
                className={`w-100 ${
                  errors.content?.message ? "input-error" : ""
                }`}
                {...register("content", {
                  required: "this filed is also required.",
                })}
                data-pending={statuses.creatingPost === "loading"}
              ></textarea>
              <p className='error'>{errors.content?.message}</p>
            </div>
            <div className='flex justify-end'>
              <button
                type='submit'
                disabled={statuses.creatingPost === "loading"}
              >
                create post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Posts;
