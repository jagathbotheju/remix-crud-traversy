import { redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async ({ params }) => {
  const post = await db.post.findUnique({
    where: { id: params.postid },
  });

  if (!post) throw new Error("Post Not Found...");
  const data = { post };
  return data;
};

export const action = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    const post = await db.post.findUnique({
      where: { id: params.postid },
    });

    if (!post) throw new Error("Post Not Found!");
    await db.post.delete({ where: { id: params.postid } });
    return redirect("/posts");
  }
};

//client side
const Post = () => {
  const { post } = useLoaderData();

  return (
    <>
      <div className="mx-auto w-8/12 mt-10">
        <div className="flex justify-between my-4">
          <h2 className="text-2xl font-semibold">Post Details</h2>
          <Link
            to="/posts"
            className="bg-gray-500 text-white py-3 px-4 rounded-lg"
          >
            Post List
          </Link>
        </div>

        <div className=" bg-blue-300 p-10  flex flex-col rounded-xl">
          <h1 className="text-2xl font-semibold">{post.title}</h1>
          <p className="mt-5 text-gray-500">{post.body}</p>
          <form method="post">
            <input type="hidden" name="_method" value="delete" />
            <button className="mt-5 py-3 px-4 rounded-lg uppercase bg-pink-500 text-white">
              Delete
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Post;
