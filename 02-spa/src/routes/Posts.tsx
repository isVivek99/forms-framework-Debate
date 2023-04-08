import React from "react";
import { useForm } from "react-hook-form";
import "./blog.css";

type Post = { id: string; title: string; desc: string; content: string };

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
    watch,
    formState: { errors },
  } = useForm();

  // initial load of posts
  React.useEffect(() => {
    fetch("http://localhost:4131/api/posts")
      .then((res) => res.json())
      .then(({ posts }) => {
        setPosts(posts);
        setStatuses((old) => ({ ...old, loadingTodos: "idle" }));
      });
  }, []);

  React.useEffect(() => {
    console.log(posts);
  }, [posts]);

  return (
    <div className='w-2-3 m-auto'>
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
            onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              console.log(form);

              const titleInput = form.elements.namedItem(
                "title"
              ) as HTMLInputElement;
              const descInput = form.elements.namedItem(
                "desc"
              ) as HTMLInputElement;
              const contentInput = form.elements.namedItem(
                "content"
              ) as HTMLInputElement;

              console.log(titleInput, descInput, contentInput);

              const title = titleInput.value.trim();
              const desc = descInput.value.trim();
              const content = contentInput.value.trim();

              if (
                title.length === 0 ||
                desc.length === 0 ||
                content.length === 0
              )
                return;
              setPosts([
                ...posts,
                { title, desc, content, id: Math.random().toFixed(2) },
              ]);
              form.reset();
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
            }}
          >
            <div className='flex flex-col'>
              <label htmlFor='input-1'>
                <h3>title</h3>
              </label>
              <input
                type='text'
                id='input-1'
                className='w-100'
                autoFocus
                data-pending={statuses.creatingPost === "loading"}
                {...register("title")}
              />
              <label htmlFor='input-2'>
                <h3>desc</h3>
              </label>
              <input
                type='text'
                id='input-2'
                className='w-100'
                {...register("desc")}
                data-pending={statuses.creatingPost === "loading"}
              />
              <label htmlFor='input-3'>
                <h3>content</h3>
              </label>
              <textarea
                id='input-3'
                cols={30}
                rows={10}
                {...register("content")}
                data-pending={statuses.creatingPost === "loading"}
              ></textarea>
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
