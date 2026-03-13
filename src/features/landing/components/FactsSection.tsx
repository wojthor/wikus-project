import { Info } from "lucide-react";
import { AccentBrackets } from "../ui/AccentBrackets";

const PAIN_POINTS = [
  "Uczenie się suchych słówek z list, których nigdy nie używasz w życiu.",
  "Skupianie się na gramatyce zamiast na komunikacji (strach przed błędem).",
  "Brak regularnego, prawdziwego mówienia na głos.",
  "Złe dopasowanie materiałów do Twojego poziomu i celu.",
];

export function FactsSection() {
  return (
    <section id="fakty" className="min-h-[70vh] flex flex-col justify-center space-y-6 sm:space-y-8 py-8 sm:py-12 scroll-mt-20">
      <div className="text-center">
        <h2 className="text-[#7347f4] font-extrabold text-2xl sm:text-3xl mb-4">Fakty</h2>
        <div className="inline-flex justify-center bg-[#cfd8ff] text-[#3e57d6] rounded-full px-6 py-2.5 text-base sm:text-lg font-bold shadow-sm">
          Dlaczego większości ludziom nie udaje się z angielskim?
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-start">
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-slate-600">
          <p><AccentBrackets text={'[Agitacja niepowodzeń] Słyszysz, że angielski to must-have, a z drugiej strony – że lata w szkole i tak nic nie dają, że „trzeba mieć talent" albo wyjechać za granicę.'} /></p>
          <p><AccentBrackets text="[Identyfikacja problemu] Gdy sam przeszedłem od zera do swobodnej rozmowy, zrozumiałem, że problem nie leży w braku talentu. Brakowało mi metody: konkretnych kroków, regularnej praktyki mówienia i materiałów dopasowanych do celu." /></p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {PAIN_POINTS.map((text, i) => (
            <div key={i} className="bg-white border border-[#7347f4] rounded-2xl shadow-sm p-4 sm:p-5 flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#cfd8ff] text-[#3e57d6] rounded-xl flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
