/**
 * GrainOverlay — fixed full-viewport SVG-noise overlay.
 * Style + blend-mode driven by theme tokens (overlay in dark, multiply in light).
 *
 * Server component — no JS needed.
 */
export function GrainOverlay() {
  return <div className="grain" aria-hidden="true" />;
}
