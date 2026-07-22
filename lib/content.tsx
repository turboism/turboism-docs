export type DocumentSection =
  | "Getting Started"
  | "Use Turboism"
  | "Build a Plugin"
  | "Concepts"
  | "Reference"
  | "Troubleshooting";

export interface DocumentPage {
  slug: string;
  title: string;
  description: string;
  section: DocumentSection;
  updated: string;
  content: React.ReactNode;
}

const notice = (children: React.ReactNode) => (
  <aside className="notice" role="note">
    <strong>Preview boundary</strong>
    <p>{children}</p>
  </aside>
);

export const documentSections: DocumentSection[] = [
  "Getting Started",
  "Use Turboism",
  "Build a Plugin",
  "Concepts",
  "Reference",
  "Troubleshooting",
];

export const documents: DocumentPage[] = [
  {
    slug: "introduction",
    title: "Introduction",
    description: "What Turboism is and how this documentation is organized.",
    section: "Getting Started",
    updated: "Documentation preview",
    content: (
      <>
        <p>
          Turboism is a Java Agent and plugin framework intended for Live2D Cubism
          Editor workflows. This site is the authoritative home for Turboism product
          and developer documentation.
        </p>
        <p>
          Documentation is organized around two equal paths: using Turboism and
          building a plugin. Shared platform ideas live under Concepts and Reference.
        </p>
        {notice(
          "This website is being established before public release facts, support commitments, and SDK contracts are finalized. Treat the material here as product documentation in preview—not a download, compatibility, or API guarantee."
        )}
      </>
    ),
  },
  {
    slug: "documentation-preview",
    title: "Documentation preview",
    description: "What is available today and what remains intentionally uncommitted.",
    section: "Getting Started",
    updated: "Documentation preview",
    content: (
      <>
        <p>
          Turboism documentation is taking shape in public. The information
          architecture, concepts, and contributor paths are available now.
        </p>
        <h2>Not published as release facts yet</h2>
        <ul>
          <li>Java Agent download and installation instructions</li>
          <li>Supported environment and compatibility matrix</li>
          <li>Plugin SDK coordinates and concrete API signatures</li>
          <li>Versioned API reference and release notes</li>
        </ul>
        <p>
          These details will appear only when they can be tied to an actual,
          versioned Turboism release. Until then, links that would imply availability
          are intentionally absent.
        </p>
      </>
    ),
  },
  {
    slug: "use/overview",
    title: "Use Turboism",
    description: "The user path from availability to a verified first run.",
    section: "Use Turboism",
    updated: "Coming soon",
    content: (
      <>
        <p>
          This section will cover obtaining Turboism, preparing an environment,
          attaching the Java Agent, and verifying the first run.
        </p>
        {notice(
          "No Java Agent release, download route, supported-environment matrix, or installation command is published by this site yet. The future product acquisition entry point will be www.turboism.dev/download."
        )}
      </>
    ),
  },
  {
    slug: "build-a-plugin/overview",
    title: "Build a Plugin",
    description: "The future developer path for extending Turboism.",
    section: "Build a Plugin",
    updated: "Coming soon",
    content: (
      <>
        <p>
          Turboism is designed to be extended with plugins. This path will document
          project setup, the plugin manifest, lifecycle design, testing, and
          publication choices.
        </p>
        {notice(
          "The public SDK, example project, API contract, and build coordinates are not published release facts yet. The former prototype API notes are being retained as migration material only and are not a contract."
        )}
      </>
    ),
  },
  {
    slug: "concepts/architecture",
    title: "Architecture",
    description: "A conceptual map of Turboism’s role between plugins and Cubism.",
    section: "Concepts",
    updated: "Documentation preview",
    content: (
      <>
        <p>
          Turboism is conceived as an adaptation layer between Live2D Cubism Editor
          internals and extension code. Its purpose is to give plugin authors a
          higher-level integration surface without asking them to depend directly on
          editor implementation details.
        </p>
        <h2>Conceptual layers</h2>
        <ol>
          <li>Live2D Cubism Editor as the host application.</li>
          <li>Adaptation work for host-specific symbols and version differences.</li>
          <li>Turboism framework services and extension boundaries.</li>
          <li>Official and third-party plugins built on those boundaries.</li>
        </ol>
        {notice(
          "Layer names describe the intended architecture, not a promise that named classes, services, or features are available in a released SDK."
        )}
      </>
    ),
  },
  {
    slug: "concepts/mapping-layer",
    title: "Mapping layer",
    description: "Why host adaptation needs an explicit boundary.",
    section: "Concepts",
    updated: "Documentation preview",
    content: (
      <>
        <p>
          Host applications can change symbols and implementation details between
          versions. A mapping layer is the conceptual boundary where host-specific
          knowledge can be isolated from the extension experience.
        </p>
        <p>
          Plugin developers should be able to target published extension points,
          rather than implement their own reflection against Cubism internals.
        </p>
      </>
    ),
  },
  {
    slug: "concepts/automation",
    title: "Automation",
    description: "A preview concept for repeatable editor workflows.",
    section: "Concepts",
    updated: "Experimental concept",
    content: (
      <>
        <p>
          Turboism may explore automation and replay for editor workflows. Any such
          capability can affect project state and requires clear safety boundaries.
        </p>
        {notice(
          "Automation is an experimental concept, not an available feature. Do not rely on this page for API shape, availability, or operational behavior."
        )}
      </>
    ),
  },
  {
    slug: "reference/overview",
    title: "Reference",
    description: "Where versioned public contracts will be published.",
    section: "Reference",
    updated: "Coming soon",
    content: (
      <>
        <p>
          Reference will contain the public Plugin SDK, Host API, and other supported
          extension points. The default view will represent the current supported
          release; older reference will be archived only when needed.
        </p>
        {notice(
          "Reference pages will be imported from versioned API-reference artifacts after a release establishes an explicit public contract. Internal implementation and uncommitted interfaces will not be documented as extension APIs."
        )}
      </>
    ),
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting and feedback",
    description: "How to improve these docs and where future product discussions belong.",
    section: "Troubleshooting",
    updated: "Documentation preview",
    content: (
      <>
        <p>
          Documentation corrections and suggestions will be handled through the
          public <a href="https://github.com/turboism/turboism-docs">turboism-docs</a>{" "}
          repository. The source repository is intended to accept community issues
          and pull requests.
        </p>
        <p>
          General, non-sensitive Turboism product discussion will use GitHub
          Discussions in that repository. Plugin directory nominations and listing
          corrections belong in the Plugin Directory repository instead.
        </p>
        <h2>Safety reminder</h2>
        <p>
          Experimental runtime modification or automation should be approached with
          care. Keep independent backups of Cubism projects before testing new tools.
        </p>
      </>
    ),
  },
];

export function getDocument(slug: string) {
  return documents.find((document) => document.slug === slug);
}

export function getDocumentsForSection(section: DocumentSection) {
  return documents.filter((document) => document.section === section);
}
