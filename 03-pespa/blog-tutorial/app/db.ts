type Post = {
  id: string;
  title: string;
  desc: string;
  content: string;
  createdAt: number;
};

const PostsInitted = Boolean(global.posts);

declare global {
  var posts: Array<Post> | undefined;
}

const posts: Array<Post> = (global.posts = global.posts ?? []);

if (!PostsInitted) {
  createPost({
    title: "Eat breakfast",
    desc: "eat honey glazed red meat",
    content: "use glyphosate free honey",
  });
}

export const getPosts = async () => {
  return posts;
};

export async function createPost({
  title,
  desc,
  content,
}: Omit<Post, "id" | "createdAt">) {
  const newPost = {
    id: Math.random().toString(8).slice(2),
    title,
    desc,
    content,
    createdAt: Date.now(),
  };
  posts.push(newPost);
  return newPost;
}
