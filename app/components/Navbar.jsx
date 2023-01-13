import { Link } from "@remix-run/react";
import _ from "lodash";

const Navbar = ({ user }) => {
  return (
    <div className="bg-blue-400 flex justify-between px-10 py-4 shadow-lg">
      <h1 className="text-3xl font-semibold">REMIX</h1>
      <div className="flex gap-5">
        <p className="text-xl font-semibold">
          {user && `Welcome ${user?.username}`}
        </p>
        <Link to="/" className="text-2xl font-semibold">
          HOME
        </Link>
        <Link to="/posts" className="text-2xl font-semibold">
          POSTS
        </Link>
        {!_.isEmpty(user) ? (
          <form action="/auth/logout" method="post">
            <button
              className="text-2xl font-semibold uppercase hover:bg-blue-700  hover:px-2 hover:rounded-md"
              type="submit"
            >
              LogOut
            </button>
          </form>
        ) : (
          <Link to="/auth/login" className="text-2xl font-semibold">
            LOGIN
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
