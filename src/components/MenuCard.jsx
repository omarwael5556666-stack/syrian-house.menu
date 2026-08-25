import { Tag } from "lucide-react";

export default function MenuCard({ item, index, onAdd }) {
  const hasSizes = item.priceM != null && item.priceL != null;
  const staggerClass = `stagger-${(index % 8) + 1}`;

  return (
    <article
      className={`glass-card rounded-2xl p-5 flex flex-col justify-between opacity-0 animate-slide-up ${staggerClass}`}
    >
      {/* Top Row: Title + NEW Badge */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-base sm:text-lg font-bold text-gray-100 leading-relaxed flex-1">
          {item.title}
        </h3>
        {item.isNew && (
          <span className="new-badge flex items-center gap-1 mt-1">
            جديد
          </span>
        )}
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2">
          {item.description}
        </p>
      )}

      {/* Spacer */}
      {!item.description && <div className="flex-1 min-h-[8px]" />}

      {/* Footer */}
      <div className="mt-auto pt-3 border-t border-white/5 space-y-3">
        <div className="flex items-center gap-1.5 text-gray-500">
          <Tag className="w-3.5 h-3.5" />
          <span className="text-xs">{item.category}</span>
        </div>

        {hasSizes ? (
          <div className="grid grid-cols-2 gap-2">
            {[
              ["M", item.priceM],
              ["L", item.priceL],
            ].map(([size, price]) => (
              <button
                key={size}
                onClick={() => onAdd(size)}
                className="h-10 rounded-xl bg-gradient-to-l from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 active:scale-[0.96] transition-all duration-150 text-white text-sm font-extrabold shadow-md shadow-black/30"
                title={`أضف ${item.title} حجم ${size} للسلة`}
              >
                أضف {size} • {price} ج.م
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={() => onAdd(null)}
            className="w-full h-10 rounded-xl bg-gradient-to-l from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 active:scale-[0.97] transition-all duration-150 text-white font-extrabold text-sm sm:text-base shadow-md shadow-black/30"
          >
            أضف للسلة • {item.price} ج.م
          </button>
        )}
      </div>
    </article>
  );
}

