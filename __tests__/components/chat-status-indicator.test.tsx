import { render, screen } from "@testing-library/react";
import type { SVGProps } from "react";
import { describe, it, expect, vi } from "vitest";
import ChatStatusIndicator from "#/components/features/chat/chat-status-indicator";

vi.mock("#/icons/debug-stackframe-dot.svg?react", () => ({
  default: (props: SVGProps<SVGSVGElement>) => (
    <svg data-testid="debug-stackframe-dot" {...props} />
  ),
}));

describe("ChatStatusIndicator", () => {
  it("renders the status indicator with status text", () => {
    render(
      <ChatStatusIndicator
        status="Waiting for runtime"
        statusColor="#FFD600"
      />,
    );

    expect(screen.getByTestId("chat-status-indicator")).toBeInTheDocument();
    expect(screen.getByText("Waiting for runtime")).toBeInTheDocument();
  });

  it.each([
    ["Thinking", "#00FF00"],
    ["Loading", "#FFD600"],
    ["Waiting for runtime", "#FFD600"],
    ["Error", "#FF684E"],
  ])("renders a static dot for %s with its status color", (status, color) => {
    render(<ChatStatusIndicator status={status} statusColor={color} />);

    const icon = screen.getByTestId("debug-stackframe-dot");
    expect(icon).toHaveAttribute("color", color);
    expect(icon.parentElement).toHaveClass("flex-shrink-0");
    expect(icon.parentElement).not.toHaveClass(
      "animate-[pulse_1.2s_ease-in-out_infinite]",
    );
  });

  it("renders the DebugStackframeDot icon", () => {
    render(<ChatStatusIndicator status="Loading" statusColor="#FFD600" />);

    expect(screen.getByTestId("debug-stackframe-dot")).toBeInTheDocument();
  });
});
