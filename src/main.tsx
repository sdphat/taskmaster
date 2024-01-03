import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./routes/App/App.tsx";
import AppLayout from "./routes/App/AppLayout.tsx";
import BoardPage from "./routes/App/Board/BoardPage.tsx";
import IssuesPage from "./routes/App/Board/Issues/IssuesPage.tsx";
import SettingsPage from "./routes/App/Board/Settings/SettingsPage.tsx";
import InvitationPage from "./routes/Invitation/InvitationPage.tsx";
import Login from "./routes/Login/Login.tsx";
import Register from "./routes/Register/Register.tsx";
import { store } from "./store.ts";
import AccountPage from "./routes/Account/AccountPage.tsx";

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
        path: "/invitation",
        element: <InvitationPage />,
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
            path: "account",
            element: <AccountPage />,
          },
          {
            path: "board",
            element: <BoardPage />,
            children: [
              {
                path: ":id/settings",
                element: <SettingsPage />,
              },
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
      <ToastContainer position="bottom-left" />
    </QueryClientProvider>
  </Provider>
);
