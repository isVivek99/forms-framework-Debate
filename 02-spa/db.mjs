const posts = [
  {
    id: Math.random().toString(8).slice(2),
    title: "new blog",
    desc: "blog has description",
    content: "lots of content",
  },
];

export const getPosts = async () => {
  return posts;
};

export async function createPost({ title, desc, content }) {
  console.log({ title, desc, content });
  const newPost = {
    id: Math.random().toString(8).slice(2),
    title,
    desc,
    content,
  };
  posts.push(newPost);
  return newPost;
}
