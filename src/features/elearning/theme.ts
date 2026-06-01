export type ModuleAccentId = "brand" | "teal" | "green" | "violet" | "rose" | "orange";

export const MODULE_ACCENTS: Record<
  ModuleAccentId,
  {
    text: string;
    textSoft: string;
    bgSoft: string;
    border: string;
    borderL: string;
    progress: string;
    btn: string;
    btnOutline: string;
    tag: string;
  }
> = {
  brand: {
    text: "text-[#7347f4]",
    textSoft: "text-[#3e57d6]",
    bgSoft: "bg-[#7347f4]/10",
    border: "border-[#7347f4]",
    borderL: "border-l-[#7347f4]",
    progress: "bg-[#7347f4]",
    btn: "bg-[#7347f4] text-white hover:brightness-95",
    btnOutline: "border-[#b9c5fe] text-slate-700 hover:bg-[#cfd8ff]/40",
    tag: "bg-[#cfd8ff] text-[#3e57d6] border-[#b9c5fe]",
  },
  teal: {
    text: "text-teal-700",
    textSoft: "text-teal-800",
    bgSoft: "bg-teal-50",
    border: "border-teal-200",
    borderL: "border-l-teal-600",
    progress: "bg-teal-600",
    btn: "bg-teal-600 text-white hover:bg-teal-700",
    btnOutline: "border-slate-200 text-slate-600 hover:bg-slate-50",
    tag: "bg-teal-50 text-teal-800 border-teal-200",
  },
  green: {
    text: "text-green-700",
    textSoft: "text-green-800",
    bgSoft: "bg-green-50",
    border: "border-green-200",
    borderL: "border-l-green-600",
    progress: "bg-green-600",
    btn: "bg-green-600 text-white hover:bg-green-700",
    btnOutline: "border-slate-200 text-slate-600 hover:bg-slate-50",
    tag: "bg-green-50 text-green-800 border-green-200",
  },
  violet: {
    text: "text-violet-700",
    textSoft: "text-violet-900",
    bgSoft: "bg-violet-50",
    border: "border-violet-200",
    borderL: "border-l-violet-600",
    progress: "bg-violet-600",
    btn: "bg-violet-600 text-white hover:bg-violet-700",
    btnOutline: "border-slate-200 text-slate-600 hover:bg-slate-50",
    tag: "bg-violet-50 text-violet-800 border-violet-200",
  },
  rose: {
    text: "text-rose-700",
    textSoft: "text-rose-900",
    bgSoft: "bg-rose-50",
    border: "border-rose-200",
    borderL: "border-l-rose-600",
    progress: "bg-rose-600",
    btn: "bg-rose-600 text-white hover:bg-rose-700",
    btnOutline: "border-slate-200 text-slate-600 hover:bg-slate-50",
    tag: "bg-rose-50 text-rose-800 border-rose-200",
  },
  orange: {
    text: "text-[#c2410c]",
    textSoft: "text-orange-900",
    bgSoft: "bg-orange-50",
    border: "border-[#ffa515]/50",
    borderL: "border-l-[#ffa515]",
    progress: "bg-[#ffa515]",
    btn: "bg-[#ffa515] text-white hover:brightness-95",
    btnOutline: "border-slate-200 text-slate-600 hover:bg-slate-50",
    tag: "bg-[#fff7ed] text-[#c2410c] border-[#ffa515]/40",
  },
};
