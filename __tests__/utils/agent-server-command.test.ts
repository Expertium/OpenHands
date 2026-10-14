import { describe, expect, it } from "vitest";

import { buildAgentServerCommand } from "../../scripts/dev-safe.mjs";

describe("buildAgentServerCommand", () => {
  it("uses the tested Expertium SDK commit by default", () => {
    const { args, source } = buildAgentServerCommand({});
    const gitUrl =
      "git+https://github.com/Expertium/software-agent-sdk@f1a05dae5d7a5a2e6ab795dda31aa663277f8970";

    expect(source).toContain("Expertium SDK fork");
    expect(args).toContain(`${gitUrl}#subdirectory=openhands-agent-server`);
    expect(args).toContain(`${gitUrl}#subdirectory=openhands-sdk`);
    expect(args).toContain(`${gitUrl}#subdirectory=openhands-tools`);
    expect(args).toContain(`${gitUrl}#subdirectory=openhands-workspace`);
  });

  it("keeps explicit source overrides available", () => {
    const { args, source } = buildAgentServerCommand({
      OH_AGENT_SERVER_GIT_REF: "feature/test",
    });

    expect(source).toContain("git (feature/test)");
    expect(args.join(" ")).toContain(
      "git+https://github.com/Expertium/software-agent-sdk@feature/test",
    );
  });
});
