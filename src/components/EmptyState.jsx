import { SearchX } from "lucide-react";

export default function EmptyState({ query }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
      <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mb-4 text-[#8C2334]">
        <SearchX className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-black text-gray-900 mb-1">
        لا توجد أصناف مطابقة
      </h3>
      <p className="text-gray-500 text-xs max-w-xs leading-relaxed">
        لم نجد أي صنف يطابق{" "}
        <span className="text-[#8C2334] font-bold">&ldquo;{query}&rdquo;</span>
        .&nbsp;جرّب البحث باسم صنف آخر أو اختر قسماً من القائمة بالأعلى.
      </p>
    </div>
  );
}
