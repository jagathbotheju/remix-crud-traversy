import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

//server side
export const loader = async () => {
  const data = {
    posts: await db.post.findMany({
      take: 20,
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  };
  return data;
};

const PostItems = () => {
  const { posts } = useLoaderData();

  return (
    <div className="container mx-auto mt-10">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Posts</h1>
        <Link
          to="/posts/new"
          className="font-semibold bg-slate-500 py-2 px-4 rounded-md"
        >
          New Post
        </Link>
      </div>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="p-4 bg-blue-300 px-4 my-5 rounded-xl">
            <Link to={post.id}>
              <h3 className="text-xl font-semibold">{post.title}</h3>
              {new Date(post.createdAt).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostItems;
