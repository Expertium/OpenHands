import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  configureRecoveryRuntime,
  getRecoveryAppUrl,
  RECOVERY_AUTOMATION_PORT,
  RECOVERY_BACKEND_PORT,
  RECOVERY_FRONTEND_PORT,
  RECOVERY_INGRESS_PORT,
  RECOVERY_STATE_DIR_NAME,
} from "../../electron/lib/recovery-runtime-config.mjs";

describe("recovery runtime config", () => {
  it("isolates browser profile, persistence, conversations, workspace, secrets and ports", () => {
    const appData = join("C:", "Users", "test", "AppData", "Roaming");
    const config = configureRecoveryRuntime({ appDataPath: appData });
    const { env } = config;
    const root = join(appData, RECOVERY_STATE_DIR_NAME);

    expect(config.userDataPath).toBe(join(root, "electron-profile"));
    expect(env.OH_CANVAS_SAFE_STATE_DIR).toBe(join(root, "agent-canvas"));
    expect(env.OH_PERSISTENCE_DIR).toBe(root);
    expect(env.OH_CONVERSATIONS_PATH).toBe(
      join(root, "agent-canvas", "dev_conversations"),
    );
    expect(env.VITE_WORKING_DIR).toBe(join(root, "workspaces"));
    expect(env.OH_SECRET_KEY_PATH).toBe(join(root, "secret-key.txt"));
    expect(env.OH_SESSION_API_KEY_PATH).toBe(join(root, "api-key.txt"));
    expect(env.OH_CANVAS_SAFE_BACKEND_PORT).toBe(String(RECOVERY_BACKEND_PORT));
    expect(env.OH_CANVAS_SAFE_AUTOMATION_PORT).toBe(
      String(RECOVERY_AUTOMATION_PORT),
    );
    expect(env.OH_CANVAS_SAFE_VITE_PORT).toBe(String(RECOVERY_FRONTEND_PORT));
    expect(env.PORT).toBe(String(RECOVERY_INGRESS_PORT));
    expect(env.PORT).not.toBe("8000");
    expect(env.OH_AGENT_SERVER_GIT_REF).toBe(
      "71834fd00c62d292c1d441a4cfe00485bafb99b7",
    );
    expect(env.OH_CONVERSATIONS_PATH).not.toContain("OpenHands Agent Canvas");
    expect(env.OH_PERSISTENCE_DIR).not.toContain(".openhands");
  });

  it("opens the recovery app on its own ingress instead of primary port 8000", () => {
    expect(getRecoveryAppUrl()).toBe("http://localhost:28002");
    expect(getRecoveryAppUrl()).not.toBe("http://localhost:8000");
  });

  it("does not inherit a primary secret, API key or alternate SDK source", () => {
    const config = configureRecoveryRuntime({
      appDataPath: join("C:", "Users", "test", "AppData", "Roaming"),
      env: {
        OH_SECRET_KEY: "primary-secret",
        OPENHANDS_AUTOMATION_API_KEY: "primary-automation-key",
        LOCAL_BACKEND_API_KEY: "primary-api-key",
        OH_AGENT_SERVER_LOCAL_PATH: join("C:", "primary-sdk"),
        OH_AGENT_SERVER_VERSION: "9.9.9",
      },
    });

    expect(config.env.OH_SECRET_KEY).toBeUndefined();
    expect(config.env.OPENHANDS_AUTOMATION_API_KEY).toBeUndefined();
    expect(config.env.LOCAL_BACKEND_API_KEY).toBeUndefined();
    expect(config.env.OH_AGENT_SERVER_LOCAL_PATH).toBeUndefined();
    expect(config.env.OH_AGENT_SERVER_VERSION).toBeUndefined();
    expect(config.env.OH_SECRET_KEY_PATH).toContain(RECOVERY_STATE_DIR_NAME);
    expect(config.env.OH_SESSION_API_KEY_PATH).toContain(
      RECOVERY_STATE_DIR_NAME,
    );
  });
});
