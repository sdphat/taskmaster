import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import Login from "./routes/Login/Login.tsx";
import Register from "./routes/Register/Register.tsx";
import App from "./routes/App/App.tsx";
import { QueryClient, QueryClientProvider } from "react-query";
import BoardPage from "./routes/App/Board/BoardPage.tsx";
import IssuesPage from "./routes/App/Board/Issues/IssuesPage.tsx";

const router = createBrowserRouter([
  {
    path: "",
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/app",
        element: <App />,
        children: [
          {
            path: "board",
            element: <BoardPage />,
            children: [
              {
                path: ":id",
                element: <IssuesPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
