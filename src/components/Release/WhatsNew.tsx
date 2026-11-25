import React, { useEffect, useMemo, useRef } from "react";
import { ExternalLink, Sparkles, X } from "lucide-react";
import changelog from "../../../CHANGELOG.md?raw";
import { parseChangelog, releasesSince, type Inline } from "../../release/changelog";

export const RELEASES_URL = "https://github.com/craudinmoreira/cube-solver/releases";
const MAX_RELEASES = 5;

interface WhatsNewProps {
  version: string;
  /** Última versão vista; quando presente, lista tudo o que mudou desde ela. */
  since?: string;
  onClose: () => void;
}

const renderInline = (parts: Inline[]) =>
  parts.map((part, i) => {
    switch (part.type) {
      case "strong":
        return <strong key={i}>{part.text}</strong>;
      case "code":
        return <code key={i}>{part.text}</code>;
      case "link":
        return (
          <a key={i} href={part.href} target="_blank" rel="noopener noreferrer">
            {part.text}
          </a>
        );
      default:
        return <React.Fragment key={i}>{part.text}</React.Fragment>;
    }
  });

/** Modal "Novidades": a seção do CHANGELOG da versão atual (ou desde a última vista). */
const WhatsNew: React.FC<WhatsNewProps> = ({ version, since, onClose }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const releases = useMemo(() => {
    const all = parseChangelog(changelog);
    const list = since ? releasesSince(all, version, since) : all.filter((r) => r.version === version);
    return list.slice(0, MAX_RELEASES);
  }, [version, since]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="modal-layer">
      <div className="modal-backdrop" onClick={onClose} />
      <section className="card modal" role="dialog" aria-modal="true" aria-labelledby="whats-new-title">
        <header className="card-header">
          <h2 className="card-title" id="whats-new-title">
            <Sparkles size={17} />
            Novidades
            <span className="count-badge">v{version}</span>
          </h2>
          <button ref={closeRef} className="icon-btn" onClick={onClose} aria-label="Fechar novidades">
            <X size={18} />
          </button>
        </header>

        <div className="modal-body">
          {releases.length === 0 ? (
            <p className="card-hint">Sem notas para esta versão.</p>
          ) : (
            releases.map((release) => (
              <article key={release.version} className="release-notes">
                {releases.length > 1 && (
                  <h3>
                    v{release.version}
                    {release.date && <small> · {release.date}</small>}
                  </h3>
                )}
                {release.blocks.map((block, i) =>
                  block.type === "heading" ? (
                    <h4 key={i}>{block.text}</h4>
                  ) : (
                    <p key={i} className="release-item">
                      {renderInline(block.content)}
                    </p>
                  ),
                )}
              </article>
            ))
          )}
        </div>

        <footer className="modal-footer">
          <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer">
            Todas as versões <ExternalLink size={13} />
          </a>
          <small>build {__APP_COMMIT__}</small>
        </footer>
      </section>
    </div>
  );
};

export default WhatsNew;
