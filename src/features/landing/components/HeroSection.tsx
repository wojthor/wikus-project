import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="min-h-[70vh] flex flex-col justify-center bg-[#f8faff] rounded-2xl sm:rounded-3xl shadow-[0_30px_50px_rgba(0,0,0,0.05)] border border-white p-6 sm:p-8 md:p-10">
      <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:items-stretch">
        <div className="space-y-4 sm:space-y-6 flex flex-col justify-center">
          <div className="inline-flex items-center bg-[#cfd8ff] border border-[#b9c5fe] text-[#3e57d6] rounded-full px-4 py-1 text-xs sm:text-sm font-semibold tracking-wide">
            Dla aż 70% osób mówienie po angielsku to czysty stres
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-slate-900">
            Mimo że znają słówka i rozumieją więcej, niż im się wydaje.
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-xl leading-relaxed">
            Pokażę Ci, jak zacząć mówić pewnie:
            <br />
            bez chaosu, bez szkolnego podejścia, w ludzki sposób.
          </p>
          <div className="flex flex-wrap gap-2 pt-1.5">
            <Link
              href="#oferta"
              className="rounded-4xl bg-[#ffbd53] border border-[#ffa515] text-white px-4 py-2 text-xs sm:text-lg font-bold shadow-md hover:-translate-y-0.5 transition-transform"
            >
              Zobacz ofertę
            </Link>
            <Link
              href="#o-mnie"
              className="rounded-4xl bg-white border border-[#ffa515] text-[#ffa515] px-4 py-2 text-xs sm:text-lg font-bold shadow-sm hover:-translate-y-0.5 transition-transform"
            >
              O mnie
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-0 lg:h-full">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:aspect-square lg:h-full lg:w-full lg:max-w-full overflow-hidden rounded-full bg-slate-200 shadow-xl mx-auto">
            <Image
              src="/wikus4.png"
              alt="Wiktor Szycha"
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 288px, (max-width: 768px) 320px, (max-width: 1024px) 384px, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
