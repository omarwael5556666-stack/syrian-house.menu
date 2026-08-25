import { useRef, useEffect, useState, useCallback } from "react";
import { LayoutGrid } from "lucide-react";

export default function CategoryTabs({ categories, activeCategory, onCategoryChange }) {
  const scrollRef = useRef(null);
  const activeRef = useRef(null);
  const [showFadeStart, setShowFadeStart] = useState(false); // fade on the right (RTL start)
  const [showFadeEnd, setShowFadeEnd] = useState(false);    // fade on the left (RTL end)

  // ─── Update fade indicators based on scroll position ────────
  const updateFades = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;

    // In RTL, scrollLeft is typically negative in some browsers (or positive in others).
    // We normalise to a positive "scrolled distance from the RTL start (right edge)".
    // scrollLeft in RTL: Chrome → negative, Firefox → positive (depends on browser).
    // Using Math.abs for safety.
    const absScroll = Math.abs(scrollLeft);
    const maxScroll = scrollWidth - clientWidth;

    // There are more items to the RIGHT (RTL start) if we have scrolled left
    // There are more items to the LEFT (RTL end) if we haven't scrolled all the way
    setShowFadeStart(absScroll > 4);
    setShowFadeEnd(maxScroll - absScroll > 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateFades();
    el.addEventListener("scroll", updateFades, { passive: true });
    const ro = new ResizeObserver(updateFades);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateFades);
      ro.disconnect();
    };
  }, [updateFades]);

  // ─── Auto-scroll to active pill ─────────────────────────────
  // Skips the first render so opening the page never auto-scrolls;
  // centering only happens when the user switches categories.
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (activeRef.current && scrollRef.current) {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      activeRef.current.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeCategory]);

  const allCategories = [{ id: "الكل", label: "الكل", isAll: true }, ...categories.map((c) => ({ id: c, label: c, isAll: false }))];

  return (
    <div className="category-nav-wrapper mb-8 animate-fade-in">
      {/* Fade edge — right side (RTL: the "start", more content this way) */}
      <div
        className="category-fade-right"
        style={{ opacity: showFadeEnd ? 1 : 0 }}
        aria-hidden="true"
      />
      {/* Fade edge — left side (RTL: the "end", more content scrolled past) */}
      <div
        className="category-fade-left"
        style={{ opacity: showFadeStart ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* Scrollable strip */}
      <div
        ref={scrollRef}
        className="category-scroll"
        role="tablist"
        aria-label="تصفية حسب الفئة"
      >
        {allCategories.map(({ id, label, isAll }) => {
          const isActive = activeCategory === id;
          return (
            <button
              ref={isActive ? activeRef : null}
              key={id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onCategoryChange(id)}
              className={`category-pill${isActive ? " active" : ""}`}
            >
              {isAll && <LayoutGrid className="category-pill-icon" aria-hidden="true" />}
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

