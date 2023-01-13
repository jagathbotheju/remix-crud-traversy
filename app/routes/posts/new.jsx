import { Link, Form, useActionData } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/sessions.server";

const validateTitle = (title) => {
  if (typeof title != "string" || title.length < 3) {
    return "Title should be at least 3 Characters log";
  }
};

const validateBody = (body) => {
  if (typeof body != "string" || body.length < 10) {
    return "Body should be at least 10 Characters log";
  }
};

const badRequest = (data) => {
  return json(data, { status: 400 });
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const postData = Object.fromEntries(formData);
  const user = await getUser(request);

  const fieldErrors = {
    title: validateTitle(postData.title),
    body: validateBody(postData.body),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, postData });
  }

  const post = await db.post.create({
    data: {
      ...postData,
      userId: user.id,
    },
  });

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
  const actionData = useActionData();

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
          <p className="text-xs text-red-500 mt-1">
            {actionData?.fieldErrors?.title && actionData?.fieldErrors?.title}
          </p>
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
          <p className="text-xs text-red-500 mt-1">
            {actionData?.fieldErrors?.body && actionData?.fieldErrors?.body}
          </p>
        </div>

        <button className="py-3 px-4 text-lg bg-gray-800 text-white rounded-md">
          Submit
        </button>
      </Form>
    </div>
  );
};

export default New;
