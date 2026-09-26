import { Component } from "react";
import { RotateCcw } from "lucide-react";
import SnowLoader from "./SnowLoader";

// If a section fails to render, show a snowed-in placeholder with a retry instead of a broken page.
export default class SnowBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("Section failed to render:", error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="flex justify-center bg-navy py-16">
        <SnowLoader label="This section is snowed in">
          <button
            type="button"
            onClick={() => this.setState({ failed: false })}
            className="mt-1 inline-flex items-center gap-2 rounded-xl bg-signal px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-signal-light"
          >
            <RotateCcw className="h-4 w-4" />
            Dig it out
          </button>
        </SnowLoader>
      </section>
    );
  }
}
