import { ChevronDown, ExternalLink } from "lucide-react";

const credits = [
  {
    subject: "شاورما الدجاج والأرز",
    photographer: "User:CrunchySkies",
    imageUrl: "https://commons.wikimedia.org/wiki/File:Chicken_Shwarama_plate.jpeg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  {
    subject: "شاورما ميكس مع الأرز",
    photographer: "secretlondon123",
    imageUrl: "https://commons.wikimedia.org/wiki/File:Mixed_Shawarma_(2843435528).jpg",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
  },
  {
    subject: "شيش طاووق مع الأرز والخبز",
    photographer: "Miansari66",
    imageUrl: "https://commons.wikimedia.org/wiki/File:Shish_Taouk.JPG",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
];

function SourceLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex min-h-9 items-center gap-1 rounded-full px-2 text-[10px] font-semibold text-[#6E1B29] underline decoration-[#6E1B29]/30 underline-offset-2 hover:bg-[#6E1B29]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6E1B29]"
    >
      {children}
      <ExternalLink className="h-3 w-3" aria-hidden="true" />
    </a>
  );
}

export default function PhotoCredits() {
  return (
    <details className="group mx-auto mt-5 max-w-3xl rounded-2xl border border-[#E7DED2] bg-white/80 px-4 py-3 text-right shadow-sm">
      <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between gap-3 rounded-lg text-xs font-bold text-[#6E1B29] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6E1B29] [&::-webkit-details-marker]:hidden">
        <span>مصادر الصور التوضيحية</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-[#8A6E5C] transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <p className="mt-2 text-[11px] leading-5 text-[#75665C]">
        الصور للتوضيح وليست صور أطباق مطعم البيت السوري. صورة فتة الشيش مرجع لشيش طاووق مع الأرز والخبز، وفتة اللحمة بدون صورة لعدم توفر مرجع مرخّص مطابق.
      </p>
      <ul className="mt-2 divide-y divide-[#EEE7DE]">
        {credits.map((credit) => (
          <li key={credit.license} className="flex flex-col gap-1 py-2 text-[11px] text-[#4B4038] sm:flex-row sm:items-center sm:justify-between">
            <span>
              {credit.subject} · تصوير {credit.photographer}
            </span>
            <span className="flex flex-wrap items-center gap-1 sm:justify-end">
              <SourceLink href={credit.imageUrl} label={`مصدر صورة ${credit.subject}`}>
                الصورة
              </SourceLink>
              <SourceLink href={credit.licenseUrl} label={`ترخيص ${credit.license} لصورة ${credit.subject}`}>
                {credit.license}
              </SourceLink>
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}
