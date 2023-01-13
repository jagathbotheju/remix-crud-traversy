import bcrypt from "bcrypt";
import { db } from "./db.server";
import { createCookieSessionStorage, redirect } from "@remix-run/node";

//login user
export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) return null;

  //check password
  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isCorrectPassword) return null;

  return user;
}

//logout user and destroy session
export const logout = async (request: Request) => {
  const session = await storage.getSession(request.headers.get("Cookie"));

  return redirect("/auth/logout", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
};

//register new user
export const register = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const passwordHash = await bcrypt.hash(password, 10);
  return db.user.create({
    data: {
      username,
      passwordHash,
    },
  });
};

//get session secret
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("No Session Secret");
}

//sreate session storage
const storage = createCookieSessionStorage({
  cookie: {
    name: "remixblog_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 60, //60 days
    httpOnly: true,
  },
});

//create session
export const createUserSession = async (userid: string, redirectTo: string) => {
  const session = await storage.getSession();
  session.set("userid", userid); //string userid and value userid
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
};

//get user session
export const getUserSession = (request: Request) => {
  return storage.getSession(request.headers.get("Cookie"));
};

//get logged in user
export const getUser = async (request: Request) => {
  const session = getUserSession(request);
  const userid = (await session).get("userid");
  //console.log(`user id getUser ${userid}`);
  if (!userid || typeof userid !== "string") {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: {
        id: userid,
      },
    });
    const us = JSON.stringify(user);
    console.log(`user in getUer ${us}`);
    return user;
  } catch (error) {
    return null;
  }
};
