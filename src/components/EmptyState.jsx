import { SearchX } from "lucide-react";

export default function EmptyState({ query }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-brand-500/10 flex items-center justify-center mb-6">
        <SearchX className="w-10 h-10 text-brand-400/50" />
      </div>

      {/* Message */}
      <h3 className="text-xl font-bold text-gray-300 mb-2">
        لا توجد نتائج
      </h3>
      <p className="text-gray-500 text-sm max-w-xs text-center leading-relaxed">
        لم نجد أي صنف يطابق{" "}
        <span className="text-brand-400 font-semibold">&ldquo;{query}&rdquo;</span>
        .&nbsp;جرّب كلمة أخرى أو تصفّح الأقسام.
      </p>
    </div>
  );
}

