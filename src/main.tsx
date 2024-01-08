import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./routes/App/App.tsx";
import Root from "./Root.tsx";
import AppLayout from "./routes/App/AppLayout.tsx";
import BoardPage from "./routes/App/Board/BoardPage.tsx";
import IssuesPage from "./routes/App/Board/Issues/IssuesPage.tsx";
import SettingsPage from "./routes/App/Board/Settings/SettingsPage.tsx";
import InvitationPage from "./routes/Invitation/InvitationPage.tsx";
import Login from "./routes/Login/Login.tsx";
import Register from "./routes/Register/Register.tsx";
import { store } from "./store.ts";
import AccountPage from "./routes/Account/AccountPage.tsx";
import ResetPasswordPage from "./routes/ResetPassword/ResetPasswordPage";
import ForgotPasswordPage from "./routes/ForgotPassword/ForgotPasswordPage.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const router = createBrowserRouter([
  {
    path: "",
    children: [
      {
        index: true,
        element: <Root />,
      },
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
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
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
    <GoogleOAuthProvider clientId="782330352466-tlqul3omvdcjhj5pkjd561uk9eftti6g.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer position="bottom-left" />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </Provider>
);
