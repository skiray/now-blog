/**
 * Type shims for the Mermaid modules `src/lib/mermaid-lite.ts` imports.
 *
 * `mermaid` ships its declarations next to `dist/mermaid.core.mjs` but not for
 * the individual chunk files, and the deep paths we use (renderer chunks, the
 * diagram registry, the `.mjs` entry) would otherwise need `allowJs`-style
 * resolution. Only the surface we actually touch is declared here.
 */
declare module "mermaid/dist/mermaid.core.mjs" {
  const mermaid: {
    /** Mermaid renders every `.mermaid` element on its own when true. */
    startOnLoad: boolean;
    initialize(config: Record<string, unknown>): void;
    run(options?: { nodes?: Element[] }): Promise<void>;
    parse(text: string): Promise<unknown>;
    render(id: string, text: string, container: Element): Promise<unknown>;
    mermaidAPI: Record<string, unknown>;
  };
  export default mermaid;
}

declare module "mermaid/dist/chunks/mermaid.core/chunk-DU6HZSFF.mjs" {
  /** A diagram's concrete implementation (parser + renderer + db). */
  export interface MermaidDiagram {
    parser: unknown;
    renderer: unknown;
    db?: unknown;
    styles?: unknown;
    init?: (config: Record<string, unknown>) => void;
  }

  export function registerDiagram(
    id: string,
    diagram: MermaidDiagram,
    detector?: (text: string, config?: Record<string, unknown>) => boolean
  ): void;

  export function registerLazyLoadedDiagrams(
    ...diagrams: {
      id: string;
      detector: (text: string, config?: Record<string, unknown>) => unknown;
      loader?: () => Promise<unknown>;
    }[]
  ): void;
}

declare module "mermaid/dist/chunks/mermaid.core/flowDiagram-HODETNUW.mjs" {
  import type { MermaidDiagram } from "mermaid/dist/chunks/mermaid.core/chunk-DU6HZSFF.mjs";
  export const diagram: MermaidDiagram;
}

declare module "mermaid/dist/chunks/mermaid.core/sequenceDiagram-WJ2MYXX4.mjs" {
  import type { MermaidDiagram } from "mermaid/dist/chunks/mermaid.core/chunk-DU6HZSFF.mjs";
  export const diagram: MermaidDiagram;
}
