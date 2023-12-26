const APP_ROUTE = "/app";

const ROUTES = {
  APP: APP_ROUTE,
  LOGIN: "/login",
  REGISTER: "/register",
  MY_ACCOUNT: APP_ROUTE + "/my-account",
  LOGOUT: APP_ROUTE + "/logout",
  ISSUES: (boardId: number) => APP_ROUTE + "/board/" + boardId,
  BOARD_SETTINGS: (boardId: number) =>
    APP_ROUTE + "/board/" + boardId + "/settings",
} as const;

export default ROUTES;
