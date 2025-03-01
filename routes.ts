/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/auth/new-verification",

  "/api/game",
  "/api/endGame",
  "/api/checkAnswer",
  "/api/questions",
  "/api/topics",
  "/api/workflows/cron",
  "/api/workflows/execute",
  "/api/upload",
  "/api/unauth-check",

];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];


export const dashboardRoutes = [
  "/app",
  "/app/workflows",
  "/app/billing"
]

export const apiAuthPrefix = "/api/auth";

// TODO: route to dashboard mb?

// TODO: сделать API общедоступными наверное

export const DEFAULT_LOGIN_REDIRECT = "/app";
