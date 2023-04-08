const posts = [
  {
    title: "new blog",
    description: "blog has description",
    content: "lots of content",
  },
];

export const getPosts = async () => {
  return posts;
};

export async function createPost({ title, description, content }) {
  const newPost = {
    id: Math.random().toString(8).slice(2),
    title,
    description,
    content,
    createdAt: Date.now(),
  };
  posts.push(newPost);
  return newPost;
}
