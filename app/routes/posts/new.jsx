import { Link, Form } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const postData = Object.fromEntries(formData);
  const post = await db.post.create({ data: postData });

  return redirect(`/posts/${post.id}`);
};

export const ErrorBoundary = ({ error }) => {
  return (
    <div className="w-6/12 bg-pink-300 mx-auto rounded-mdmt-10">
      <h2 className="text-2xl text-center font-semibold">Error</h2>
      <p className="text-center text-lg">{error.message}</p>
    </div>
  );
};

const New = () => {
  return (
    <div className="container mx-auto mt-10 w-8/12">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold">Create New Post</h2>
          <Link to="/posts" className="py-2 px-4 bg-gray-500 rounded-md">
            Back
          </Link>
        </div>
      </div>

      {/* form */}
      <Form method="post" className="mt-5 w-full">
        {/* title */}
        <div className="mb-6">
          <label className="block mb-2 text-md" htmlFor="title">
            Title
          </label>
          <input
            className="border border-gray-300 bg-gray-50 rounded-sm text-lg w-full"
            type="text"
            name="title"
            id="title"
          />
        </div>

        {/* boody */}
        <div className="mb-6">
          <label className="block mb-2 text-md" htmlFor="body">
            Post Body
          </label>
          <textarea
            className="border border-gray-300 bg-gray-50 rounded-sm text-lg w-full"
            type="text"
            name="body"
            id="body"
          />
        </div>

        <button className="py-3 px-4 text-lg bg-gray-800 text-white rounded-md">
          Submit
        </button>
      </Form>
    </div>
  );
};

export default New;
