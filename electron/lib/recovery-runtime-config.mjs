import { join } from "node:path";

export const RECOVERY_STATE_DIR_NAME = "OpenHands Expertium Recovery";
export const RECOVERY_BACKEND_PORT = 28000;
export const RECOVERY_AUTOMATION_PORT = 28001;
export const RECOVERY_INGRESS_PORT = 28002;
export const RECOVERY_FRONTEND_PORT = 23001;
export const RECOVERY_REMOVED_ENV_KEYS = [
  "OPENHANDS_AUTOMATION_API_KEY",
  "LOCAL_BACKEND_API_KEY",
  "OH_SECRET_KEY",
  "OH_AGENT_SERVER_LOCAL_PATH",
  "OH_AGENT_SERVER_VERSION",
];

export function getRecoveryAppUrl() {
  return `http://localhost:${RECOVERY_INGRESS_PORT}`;
}

export function configureRecoveryRuntime({ appDataPath, env = process.env }) {
  const stateRoot = join(appDataPath, RECOVERY_STATE_DIR_NAME);
  const appState = join(stateRoot, "agent-canvas");
  const persistence = stateRoot;
  const recoveryEnv = { ...env };
  for (const key of RECOVERY_REMOVED_ENV_KEYS) delete recoveryEnv[key];

  return {
    stateRoot,
    userDataPath: join(
      appDataPath,
      RECOVERY_STATE_DIR_NAME,
      "electron-profile",
    ),
    env: {
      ...recoveryEnv,
      OH_CANVAS_SAFE_STATE_DIR: appState,
      OH_CANVAS_SAFE_BACKEND_PORT: String(RECOVERY_BACKEND_PORT),
      OH_CANVAS_SAFE_AUTOMATION_PORT: String(RECOVERY_AUTOMATION_PORT),
      OH_CANVAS_SAFE_VITE_PORT: String(RECOVERY_FRONTEND_PORT),
      OH_AGENT_SERVER_GIT_REF: "88b5a3c1f676976c82e9570c9ce81e29a597af06",
      OH_SECRET_KEY_PATH: join(stateRoot, "secret-key.txt"),
      OH_SESSION_API_KEY_PATH: join(stateRoot, "api-key.txt"),
      OH_PERSISTENCE_DIR: persistence,
      OH_CONVERSATIONS_PATH: join(appState, "dev_conversations"),
      OH_BASH_EVENTS_DIR: join(appState, "bash_events"),
      TMUX_TMPDIR: join(appState, "tmux"),
      VITE_WORKING_DIR: join(stateRoot, "workspaces"),
      PORT: String(RECOVERY_INGRESS_PORT),
    },
  };
}

export function applyRecoveryRuntimeEnvironment(targetEnv, recoveryRuntime) {
  for (const key of RECOVERY_REMOVED_ENV_KEYS) delete targetEnv[key];
  Object.assign(targetEnv, recoveryRuntime.env);
}
