import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import BopomofoApp, { Button, cn } from "./BopomofoApp";

describe("BopomofoApp - core interactions", () => {
  beforeEach(() => {
    vi.useRealTimers();
    // ensure print is mockable between tests
    (window as any).print = vi.fn();
    // Reset speech synthesis spies
    (window as any).speechSynthesis.speak = vi.fn();
    (window as any).speechSynthesis.cancel = vi.fn();
  });

  it("renders home and navigates to Learn Symbols", () => {
    render(<BopomofoApp />);
    expect(screen.getByText("BoPoMo Super Fun!")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Learn Symbols"));
    expect(screen.getByText("Learn Symbols")).toBeInTheDocument();
  });

  it("filters between All, Starting, and Ending symbols", () => {
    render(<BopomofoApp />);
    fireEvent.click(screen.getByText("Learn Symbols"));

    // Default should be All Symbols (37)
    expect(screen.getByText("All Symbols (37)")).toBeInTheDocument();
    // Default symbol is 'ㄅ' (first in all)
    expect(screen.getByText("ㄅ")).toBeInTheDocument();

    // Navigate: ensure pager displays counts update as we change filter
    const starting = screen.getByText("🚀 Starting Sounds (21)");
    fireEvent.click(starting);
    expect(screen.getByText("🚀 Starting Sounds (21)")).toBeInTheDocument();
    // First starting sound is still 'ㄅ'
    expect(screen.getByText("ㄅ")).toBeInTheDocument();

    const ending = screen.getByText("🎯 Ending Sounds (16)");
    fireEvent.click(ending);
    expect(screen.getByText("🎯 Ending Sounds (16)")).toBeInTheDocument();
    // First ending sound is 'ㄚ'
    expect(screen.getByText("ㄚ")).toBeInTheDocument();
  });

  it("pager navigates within bounds", () => {
    render(<BopomofoApp />);
    fireEvent.click(screen.getByText("Learn Symbols"));

    const next = screen.getByRole("button", { name: "→" });
    const prev = screen.getByRole("button", { name: "←" });
    const counter = () => screen.getByText(/\d+ \/ \d+/);

    // start disabled prev implies index 0
    expect(prev).toHaveProperty("disabled", true);

    fireEvent.click(next);
    expect(counter().textContent).toMatch(/2 \/ 37/);

    // re-query the button after re-render to avoid stale reference
    const prevAfterNext = screen.getByRole("button", { name: "←" });
    fireEvent.click(prevAfterNext);
    expect(counter().textContent).toMatch(/1 \/ 37/);
  });

  it("plays sound for current symbol", () => {
    render(<BopomofoApp />);
    fireEvent.click(screen.getByText("Learn Symbols"));

    const utterSpy = vi.fn();
    (globalThis as any).SpeechSynthesisUtterance = utterSpy;
    const play = screen.getByText("Play Sound");
    fireEvent.click(play);

    // Verify speech API usage
    expect(utterSpy).toHaveBeenCalled();
  });
});

describe("BopomofoApp - flashcards and worksheet", () => {
  it("navigates flashcards and plays sound", () => {
    render(<BopomofoApp />);
    fireEvent.click(screen.getByText("Flashcards"));

    const next = screen.getByRole("button", { name: "→" });
    const prev = screen.getByRole("button", { name: "←" });
    const utterSpy = vi.fn();
    (globalThis as any).SpeechSynthesisUtterance = utterSpy;
    const play = screen.getByText("Play Sound");

    fireEvent.click(play);
    expect(utterSpy).toHaveBeenCalled();

    fireEvent.click(next);
    const prevAfterNext = screen.getByRole("button", { name: "←" });
    fireEvent.click(prevAfterNext);
    expect(prev).toHaveProperty("disabled", true);
    expect(screen.getByText(/\d+ \/ 73/)).toBeInTheDocument(); // 73 total flashcards
  });

  it("opens worksheet screen and shows print button", () => {
    render(<BopomofoApp />);
    fireEvent.click(screen.getByText("Worksheets"));

    const btn = screen.getByText("Print Worksheet");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(window.print).toHaveBeenCalled();
  });
});

describe("BopomofoApp - games", () => {
  it("navigates to games screen and lists games", () => {
    render(<BopomofoApp />);
    // Find and click Games tile
    fireEvent.click(screen.getByText("Games"));

    // Check header
    expect(screen.getByText("🎮 Games")).toBeInTheDocument();

    // Check for a specific game
    const gameLink = screen.getByRole("link", {
      name: /parts of face and body/i,
    });
    expect(gameLink).toBeInTheDocument();
    expect(gameLink).toHaveAttribute(
      "href",
      "https://wordwall.net/play/36103/724/766?authuser=0"
    );
    expect(gameLink).toHaveAttribute("target", "_blank");
    expect(gameLink).toHaveAttribute("rel", "noopener noreferrer");

    // Check home button works
    fireEvent.click(screen.getByRole("button", { name: "Home" }));
    expect(screen.getByText("BoPoMo Super Fun!")).toBeInTheDocument();
  });
});

describe("BopomofoApp - voice settings", () => {
  it("lists voices and allows testing phrases", () => {
    render(<BopomofoApp />);
    fireEvent.click(screen.getByRole("button", { name: /Voice Settings/i }));
    expect(screen.getByText(/Voice Settings/)).toBeInTheDocument();
    const utterSpy = vi.fn();
    (globalThis as any).SpeechSynthesisUtterance = utterSpy;
    const hello = screen.getByText('Test Voice: "你好" (Hello)');
    fireEvent.click(hello);
    expect(utterSpy).toHaveBeenCalled();
  });

  it("allows selecting a different voice", async () => {
    render(<BopomofoApp />);
    fireEvent.click(screen.getByRole("button", { name: /Voice Settings/i }));
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    await userEvent.selectOptions(select, "Tingting");
    expect(select.value).toBe("Tingting");
  });
});

describe("UI Components", () => {
  it("renders Button with small size", () => {
    render(<Button size="sm">Small Button</Button>);
    const btn = screen.getByRole("button", { name: "Small Button" });
    expect(btn.className).toContain("h-10");
    expect(btn.className).toContain("text-base");
  });
});
