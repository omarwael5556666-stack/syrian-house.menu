const ARABIC_DIGITS = /[\u0660-\u0669\u06F0-\u06F9]/g;

export function normalizeDigits(value) {
  return String(value ?? "").replace(ARABIC_DIGITS, (digit) => {
    const code = digit.charCodeAt(0);
    return String(code <= 0x0669 ? code - 0x0660 : code - 0x06f0);
  });
}

export function normalizeArabic(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .toLocaleLowerCase("ar-EG")
    .trim()
    .replace(/\s+/g, " ");
}

export function isValidEgyptianMobile(value) {
  const digits = normalizeDigits(value).replace(/\D/g, "");
  const local = digits.startsWith("0020")
    ? digits.slice(4)
    : digits.startsWith("20")
      ? digits.slice(2)
      : digits;
  return /^01[0125]\d{8}$/.test(local);
}

export function formatMoney(value) {
  if (!Number.isFinite(Number(value))) return "—";
  return new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 2 }).format(Number(value));
}
