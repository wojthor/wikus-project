import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="min-h-[70vh] flex flex-col justify-center bg-[#f8faff] rounded-2xl sm:rounded-3xl shadow-[0_30px_50px_rgba(0,0,0,0.05)] border border-white p-6 sm:p-8 md:p-10">
      <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:items-stretch">
        <div className="space-y-4 sm:space-y-6 flex flex-col justify-center">
          <div className="inline-flex items-center bg-[#cfd8ff] border border-[#b9c5fe] text-[#3e57d6] rounded-full px-4 py-1 text-xs sm:text-sm font-semibold tracking-wide">
            [Hook] 90% osób po kursach nadal boi się odezwać
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
            Chcesz swobodnie mówić po angielsku{" "}
            <span className="text-[#7347f4]">bez wkuwania regułek?</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
            Pokażę Ci, jak przełamać barierę językową i zacząć mówić pewnie w kilka miesięcy, korzystając z prostej, sprawdzonej metody.
          </p>
          <div className="flex flex-wrap gap-2 pt-1.5">
            <Link href="#oferta" className="rounded-lg bg-[#ffbd53] border border-[#ffa515] text-white px-4 py-2 text-xs sm:text-sm font-bold shadow-md hover:-translate-y-0.5 transition-transform">
              Zobacz ofertę
            </Link>
            <Link href="#o-mnie" className="rounded-lg bg-white border border-[#ffa515] text-[#ffa515] px-4 py-2 text-xs sm:text-sm font-bold shadow-sm hover:-translate-y-0.5 transition-transform">
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
