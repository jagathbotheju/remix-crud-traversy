import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import Navbar from "./components/Navbar";
import styles from "./styles/app.css";
import { getUser } from "./utils/sessions.server";
//import * as dotenv from "dotenv";
//dotenv.config();

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
  description: "A blog app build with Remix",
  keywords: "remix,react,javascript",
});

export const loader = async ({ request }) => {
  const user = await getUser(request);
  console.log(`user is root : ${JSON.stringify(user)}`);
  const data = { user };
  return data;
};

export default function App() {
  const { user } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar user={user} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
