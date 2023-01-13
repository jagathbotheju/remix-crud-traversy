import { useState } from "react";
import { useActionData, Form } from "@remix-run/react";
import { json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { login, register, createUserSession } from "~/utils/sessions.server";

const validateUserName = (username) => {
  if (typeof username != "string" || username.length < 3) {
    return "Username should be at least 3 Characters log";
  }
};

const validatePassword = (password) => {
  if (typeof password != "string" || password.length < 6) {
    return "Password should be at least 6 Characters log";
  }
};

const badRequest = (data) => {
  return json(data, { status: 400 });
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const userData = Object.fromEntries(formData);
  console.log(userData);

  const fieldErrors = {
    username: validateUserName(userData.username),
    password: validatePassword(userData.password),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors });
  }

  if (userData.isLogin) {
    //---------LOGIN USER------------------------------
    console.log("user login");
    //find user
    const user = await login(userData);

    //check user
    if (!user) {
      return badRequest({
        fieldErrors: { username: "Invalid Credientals" },
      });
    }

    //create user session
    return createUserSession(user.id, "/posts");
  } else if (!userData.isLogin) {
    //----------USER REGISTER---------------------------
    console.log("register user");

    //check if user exists
    const userExist = await db.user.findFirst({
      where: {
        username: userData.username,
      },
    });
    if (userExist) {
      return badRequest({
        fieldErrors: { username: `User ${userData.username} already Exist` },
      });
    }

    //create user
    const user = await register(userData);
    if (!user) {
      return badRequest({ formError: "Internal Server Error" });
    }

    //create user session
    return createUserSession(user.id, "/posts");
  } else {
    return badRequest({ formError: "Login Type not valid" });
  }
};

const Login = () => {
  const actionData = useActionData();
  const [isLogin, setIsLogin] = useState(true);
  console.log(`isLogin ${isLogin}`);

  return (
    <div className="container mx-auto h-screen flex justify-center items-center">
      <div className="w-5/12 shadow-xl p-10">
        <h1 className="text-2xl font-semibold text-center my-10">
          {isLogin ? "Login" : "Register"}
        </h1>

        <Form method="post">
          {/* username */}
          <div className="mt-20">
            <label htmlFor="username" className="mb-5">
              User Name
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="User Name"
              className="block focus:outline-none w-full border-2 border-blue-500 mt-2 rounded-lg p-3"
            />
            <p className="text-xs text-red-500 mt-1">
              {actionData?.fieldErrors?.username &&
                actionData?.fieldErrors?.username}
            </p>
          </div>

          {/* password */}
          <div className="mt-10">
            <label htmlFor="password" className="mb-5">
              User Name
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="block focus:outline-none w-full border-2 border-blue-500 mt-2 rounded-lg p-3"
            />
            <p className="text-xs text-red-500 mt-1">
              {actionData?.fieldErrors?.password &&
                actionData?.fieldErrors?.password}
            </p>
          </div>
          {/* isLogin */}
          <input
            type="radio"
            name="isLogin"
            defaultChecked={isLogin}
            className="hidden"
          />

          <button className="my-5 py-3 px-4 bg-blue-500 text-white rounded-lg w-full">
            {isLogin ? "Login" : "Register"}
          </button>
          <p
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-center cursor-pointer"
          >
            {isLogin ? "No Account? Register" : "Aready have Account, Login"}
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Login;
