import { Outlet } from "@remix-run/react";

const Posts = () => {
  return (
    <>
      <div className="bg-gray-300 shadow-lg py-4">
        <h1 className="text-2xl font-semibold px-10">Post App</h1>
      </div>
      <Outlet />
    </>
  );
};

export default Posts;
