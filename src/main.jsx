import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import SignInPage from "./routes/signInPage/signInPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import DashboardPage from "./routes/dashboardPage/DashboardPage";
import ChatPage from "./routes/chatPage/ChatPage";
import RootLayout from "./layouts/rootLayout/RootLayout";
import DashboardLayout from "./layouts/dashboardLayout/DashboardLayout";
import { SignIn, SignUp } from "@clerk/clerk-react";
import SignUpPage from "./routes/signUpPage/signUpPage";
import HomePage from "./routes/homePage/HomePage";
// Import your publishable key



const router = createBrowserRouter([
  {
    element:<RootLayout />,
    children:[
      {
        path:"/",
        element:<HomePage/>
      },
      {
        path:"/sign-in/*",
        element:<SignInPage/>
      },
      {
        path:"/sign-up/*",
        element:<SignUpPage/>
      },
      {
        element:<DashboardLayout/>,
        children:[
          {
            path:"/dashboard",
            element:<DashboardPage/>,
          },
          {
            path:"/dashboard/chats/:id",
            element:<ChatPage/>
          }
        ]
      }
    ],
  }

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);