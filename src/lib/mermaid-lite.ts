/**
 * Minimal Mermaid entry point.
 *
 * Importing `mermaid` pulls in all ~50 diagram types it ships (cynefin /
 * cytoscape and the KaTeX stack included) and `mermaid.core` eagerly loads
 * every one of them. This site only authors flowcharts and sequence diagrams,
 * so the client imports this module instead: same public API (`initialize` /
 * `run` / `parse` / `render`), two renderers registered statically, and no
 * lazy-loaded chunks at all.
 *
 * This keeps *executed* code down: the two local chunks plus `dagre` (~330 kB
 * raw) replace ~50 chunks / several MB. It does not shrink the whole URL list
 * in `dist/_astro` — `mermaid.core` still records the renderers it knows about
 * in its lazy-loading table. That table is never awaited; rendering goes
 * straight to the diagrams registered below.
 *
 * Adding a diagram type: import its renderer chunk, add it to `DIAGRAMS` with
 * the id `detectType()` should report for it, and update `detect()`.
 */
import mermaid from "mermaid/dist/mermaid.core.mjs";
import {
  registerDiagram,
  registerLazyLoadedDiagrams,
} from "mermaid/dist/chunks/mermaid.core/chunk-DU6HZSFF.mjs";
import { diagram as flowDiagram } from "mermaid/dist/chunks/mermaid.core/flowDiagram-HODETNUW.mjs";
import { diagram as sequenceDiagram } from "mermaid/dist/chunks/mermaid.core/sequenceDiagram-WJ2MYXX4.mjs";

type Diagram = Parameters<typeof registerDiagram>[1];

/** Registered renderers, keyed by the id `detectType()` reports. */
const DIAGRAMS: [id: string, diagram: Diagram][] = [
  // `graph`, `flowchart` and `flowchart-v2` all end up on this renderer.
  ["flowchart", flowDiagram],
  ["flowchart-v2", flowDiagram],
  ["sequence", sequenceDiagram],
];

for (const [id, diagram] of DIAGRAMS) {
  // No detector argument: detection is handled once, below.
  registerDiagram(id, diagram);
}

/**
 * Give every registered renderer its own detector: `detectType()` walks the
 * detectors in registration order and returns the first truthy one, so a
 * single catch-all detector would claim every fence.
 */
function detectorFor(pattern: RegExp, id: string) {
  return (text: string) => pattern.test(text) && id;
}

registerLazyLoadedDiagrams(
  {
    id: "flowchart-v2",
    // `graph`, `flowchart` and `flowchart-v2` all end up on this renderer.
    detector: detectorFor(/^\s*(flowchart|graph)\b/, "flowchart-v2"),
  },
  { id: "sequence", detector: detectorFor(/^\s*sequenceDiagram\b/, "sequence") }
);

// Nothing is lazy-loaded here, so nothing may fire `mermaid.run()` on its own
// once the page has loaded.
mermaid.startOnLoad = false;

export default mermaid;
