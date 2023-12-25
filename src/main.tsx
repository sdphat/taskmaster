import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import Login from "./routes/Login/Login.tsx";
import Register from "./routes/Register/Register.tsx";
import AppLayout from "./routes/App/AppLayout.tsx";
import { QueryClient, QueryClientProvider } from "react-query";
import BoardPage from "./routes/App/Board/BoardPage.tsx";
import IssuesPage from "./routes/App/Board/Issues/IssuesPage.tsx";
import { Provider } from "react-redux";
import { store } from "./store.ts";
import App from "./routes/App/App.tsx";

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
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <App />,
          },
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
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </Provider>
);
