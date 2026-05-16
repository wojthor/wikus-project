"use client";

import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import styles from "./kurs.module.css";

const FORMSPREE_URL = "https://formspree.io/f/TWOJ_KOD";

export default function KursPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const openModal = () => {
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleOpenModal = (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    openModal();
  };

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setIsSuccess(true);
        form.reset();
      } else {
        setSubmitError("Coś poszło nie tak — spróbuj jeszcze raz");
      }
    } catch {
      setSubmitError("Błąd połączenia — spróbuj jeszcze raz");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <a href="https://wiktorszyszkowski.pl" className={styles.navBrand}>
          SZYSZKOWSKI <span>/ unschool</span>
        </a>
        <div className={styles.navLinks}>
          <a href="#dla-kogo">Dla kogo</a>
          <a href="#program">Program</a>
          <a href="#o-mnie">O mnie</a>
          <a href="#opinie">Opinie</a>
          <a href="#cennik" className={styles.navCta}>
            Kup kurs →
          </a>
        </div>
      </nav>

      <div className={styles.hero}>
        <div>
          <div className={styles.heroBadge}>
            <span /> Kurs online · Poziom B1–B2
          </div>
          <div className={styles.heroEyebrow}>Unschool Your English</div>
          <h1>
            Rozumiesz.
            <br />
            Ale nadal
            <br />
            nie <em>mówisz.</em>
          </h1>
          <p className={styles.heroSub}>
            Znasz słówka. Rozumiesz filmy. A mimo to przy rozmowie coś się zacina. Ten kurs naprawia
            dokładnie to — bez podręcznika, bez teorii na zapas, z feedbackiem ode mnie na każde
            zadanie.
          </p>
          <div className={styles.heroActions}>
            <a href="#" className={styles.btnPrimary} onClick={handleOpenModal}>
              Chcę w końcu mówić →
            </a>
            <a href="#program" className={styles.btnSecondary}>
              Zobacz program
            </a>
          </div>
          <div className={styles.heroStats}>
            <div>
              <span className={styles.statNum}>34</span>
              <span className={styles.statLabel}>lekcje wideo</span>
            </div>
            <div>
              <span className={styles.statNum}>7</span>
              <span className={styles.statLabel}>modułów</span>
            </div>
            <div>
              <span className={styles.statNum}>~3</span>
              <span className={styles.statLabel}>miesiące nauki</span>
            </div>
          </div>
        </div>

        <div className={styles.heroCard}>
          <div className={styles.cardTag}>Co dostajesz?</div>
          <div className={styles.cardTitle}>Unschool Your English</div>
          <div className={styles.cardSub}>Przestań się uczyć, zacznij mówić.</div>
          <div className={styles.cardItems}>
            <div className={styles.cardItem}>
              <div className={styles.cardItemIcon}>🎙️</div>
              <div className={styles.cardItemText}>Nagrywasz się i wysyłasz zadania głosowe</div>
            </div>
            <div className={styles.cardItem}>
              <div className={styles.cardItemIcon}>✏️</div>
              <div className={styles.cardItemText}>Zadania tekstowe z realnych sytuacji</div>
            </div>
            <div className={styles.cardItem}>
              <div className={styles.cardItemIcon}>💬</div>
              <div className={styles.cardItemText}>
                Personalny feedback ode mnie na każde zadanie
              </div>
            </div>
            <div className={styles.cardItem}>
              <div className={styles.cardItemIcon}>♾️</div>
              <div className={styles.cardItemText}>
                Dostęp bezterminowy — uczysz się we własnym tempie
              </div>
            </div>
          </div>
          <div className={styles.cardPrice}>
            <div className={styles.cardPriceCol}>
              <span className={styles.cardPriceOld}>697 zł</span>
              <div className={styles.cardPriceRow}>
                <span className={styles.priceMain}>597 zł</span>
                <span className={styles.promoBadge}>PROMOCJA</span>
              </div>
            </div>
            <span className={styles.priceSub}>jednorazowo</span>
          </div>
          <button type="button" className={styles.cardBtn} onClick={openModal}>
            Chcę ten kurs →
          </button>
        </div>
      </div>

      <section className={`${styles.section} ${styles.forWho}`} id="dla-kogo">
        <div className={styles.sectionInner}>
          <div className={styles.sectionTag}>Brzmi znajomo?</div>
          <h2 className={styles.sectionTitle}>
            Uczysz się latami.
            <br />
            A mimo to nie mówisz.
          </h2>
          <p className={styles.sectionSub}>
            Coś tu nie gra — i pewnie to czujesz. Znasz słówka, rozumiesz dużo, a mimo to przy
            rozmowie się blokujesz. To nie przypadek.
          </p>
          <div className={styles.fwGrid}>
            <div className={styles.fwCard}>
              <div className={styles.fwIcon}>😶</div>
              <div className={styles.fwTitle}>Wiesz co powiedzieć — po polsku</div>
              <div className={styles.fwText}>
                Masz myśl w głowie. Wiesz o czym chcesz mówić. Ale gdy przychodzi moment — cisza.
                Mózg się zawiesza. I nic.
              </div>
            </div>
            <div className={styles.fwCard}>
              <div className={styles.fwIcon}>📚</div>
              <div className={styles.fwTitle}>Uczyłeś się latami i nadal za mało</div>
              <div className={styles.fwText}>
                Szkoła, korepetycje, aplikacje, kursy online. Sporo czasu i pieniędzy — a rozmowa
                po angielsku nadal wywołuje stres.
              </div>
            </div>
            <div className={styles.fwCard}>
              <div className={styles.fwIcon}>🤔</div>
              <div className={styles.fwTitle}>Rozumiesz filmy, ale nie speakerów</div>
              <div className={styles.fwText}>
                Lektor mówił wyraźnie i wolno. Prawdziwy Amerykanin mówi inaczej — i nagle nic nie
                rozumiesz. Jakby to był inny język.
              </div>
            </div>
            <div className={styles.fwCard}>
              <div className={styles.fwIcon}>🔄</div>
              <div className={styles.fwTitle}>Zaczynasz i rzucasz. Znowu.</div>
              <div className={styles.fwText}>
                Kurs, aplikacja, YouTube po angielsku — przez tydzień. Potem nic przez miesiąc. I
                tak w kółko. Bez systemu nie ma efektów.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.agitation}>
        <div className={styles.sectionInner}>
          <div className={styles.agitationInner}>
            <div className={styles.agitationTag}>Prawda której nikt Ci nie powie</div>
            <h2 className={styles.agitationTitle}>
              Szkoła nie uczyła Cię mówić.
              <br />
              <em>I to był plan.</em>
            </h2>
            <p className={styles.agitationText}>
              System edukacji jest zoptymalizowany pod testy i oceny — nie pod komunikację.
              Nauczyciel może sprawdzić czy wiesz jak zbudować zdanie w Past Perfect. Nie może
              sprawdzić czy potrafisz się dogadać na lotnisku.
            </p>
            <p className={`${styles.agitationText} ${styles.agitationTextLast}`}>
              Więc uczą tego co się da ocenić. A Ty po 12 latach nauki stoisz i nie możesz zamówić
              kawy w Londynie. Korepetytorzy z certyfikatami robią to samo — tyle że drożej.
            </p>
            <div className={styles.agitationGrid}>
              <div className={styles.agitationCardBad}>
                <div className={styles.agitationCardIcon}>❌</div>
                <div className={styles.agitationCardTitle}>Co robiła szkoła</div>
                <div className={styles.agitationCardTextBad}>
                  Ćwiczenia z luki. Gramatyka dla gramatyki. Testy. Oceny. Zero prawdziwego
                  mówienia.
                </div>
              </div>
              <div className={styles.agitationCardGood}>
                <div className={styles.agitationCardIcon}>✅</div>
                <div className={styles.agitationCardTitle}>Co robi ten kurs</div>
                <div className={styles.agitationCardTextGood}>
                  Mówisz od pierwszej lekcji. Uczysz się przez prawdziwy content. Dostajesz feedback
                  od człowieka.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="co-dostajesz">
        <div className={styles.sectionInner}>
          <div className={styles.sectionTag}>Dlaczego tak jest</div>
          <h2 className={styles.sectionTitle}>
            System Cię nauczył
            <br />
            wszystkiego oprócz mówienia.
          </h2>
          <p className={styles.sectionSub}>
            Szkoła, podręczniki, Duolingo — uczą Cię zdawać testy. Nie uczą Cię rozmawiać. To nie
            jest Twoja wina. To jest zepsuty system.
            <br />
            <br />
            Ten kurs działa inaczej. Mówisz od pierwszej lekcji, dostajesz feedback na każde
            zadanie i uczysz się przez to co i tak robisz na co dzień.
          </p>
          <div className={styles.whatGrid}>
            {[
              {
                icon: "🎬",
                title: "Wideo lekcje",
                text: "Każdy temat tłumaczę na żywo — bez czytania z kartki, bez nudnego lektora. Mówię do Ciebie tak jak na normalnej lekcji.",
              },
              {
                icon: "🎙️",
                title: "Zadania głosowe",
                text: "Nagrywasz się bezpośrednio w platformie. Nie musisz nic instalować — klikasz, mówisz, wysyłasz.",
              },
              {
                icon: "✏️",
                title: "Zadania tekstowe",
                text: "Opisujesz, tłumaczysz, piszesz po angielsku. Realne sytuacje, nie podręcznikowe ćwiczenia.",
              },
              {
                icon: "💬",
                title: "Personalny feedback",
                text: "Odsłuchuję każde nagranie i czytam każdą odpowiedź. Komentuję co poszło dobrze i co poprawić. Nie dostajesz automatycznych odpowiedzi.",
              },
              {
                icon: "♾️",
                title: "Dostęp bezterminowy",
                text: "Kupujesz raz, masz na zawsze. Możesz wracać do lekcji kiedy chcesz. Spokojne tempo — 2-3 lekcje tygodniowo — bez presji.",
              },
              {
                icon: "📱",
                title: "Działa na telefonie",
                text: "Platforma działa na każdym urządzeniu. Możesz robić lekcje w przerwie w pracy albo wieczorem na kanapie.",
              },
            ].map((item) => (
              <div key={item.title} className={styles.whatItem}>
                <div className={styles.whatItemIcon}>{item.icon}</div>
                <div>
                  <div className={styles.whatItemTitle}>{item.title}</div>
                  <div className={styles.whatItemText}>{item.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.modules}`} id="program">
        <div className={styles.sectionInner}>
          <div className={styles.sectionTag}>Program kursu</div>
          <h2 className={styles.sectionTitle}>
            7 modułów,
            <br />
            34 lekcje.
          </h2>
          <p className={styles.sectionSub}>
            Zaczynamy od głowy — bo to tam jest problem. Potem speaking, listening, wymowa i
            gramatyka której naprawdę potrzebujesz. Bez zbędnego wypełniacza.
          </p>
          <div className={styles.modulesGrid}>
            {[
              {
                num: "Moduł 1",
                title: "🧠 Mindset",
                sub: "Zacznij z właściwym nastawieniem",
                lessons: [
                  "Czemu ten kurs jest inny niż inne",
                  "Szkoła Cię nie przygotowała — i to nie Twoja wina",
                  "Dlaczego Duolingo nie wystarczy",
                  "Jak ułożyć naukę — system który działa",
                  "Think in English — przestań tłumaczyć w głowie",
                ],
              },
              {
                num: "Moduł 2",
                title: "🏫 Szkoła vs Prawdziwy Angielski",
                sub: "Czego Cię uczono — a jak to brzmi naprawdę",
                lessons: [
                  'Must vs Have to — Amerykanie nie mówią "must"',
                  "Shall — słowo, którego nikt nie używa",
                  "Podręcznikowe zwroty, których NIKT nie używa",
                  'Contractions — dlaczego "I am" brzmi dziwnie',
                  "Gonna, wanna, kinda — naturalny angielski",
                ],
              },
              {
                num: "Moduł 3",
                title: "🗣️ Speaking & Bariera",
                sub: "Mów mimo że się boisz",
                lessons: [
                  "Dlaczego się blokujesz — neurologia strachu",
                  "Gap-fillers — jak zyskać czas i brzmieć naturalnie",
                  "Opisuj zamiast szukać słowa — circumlocution",
                  "Wyrażanie opinii bez bycia kategorycznym",
                  "Small talk — sztuka mówienia o niczym",
                  "Question tags — isn't it? right?",
                ],
              },
              {
                num: "Moduł 4",
                title: "👂 Listening",
                sub: "Słuchaj jak native",
                lessons: [
                  "Dlaczego nie rozumiesz native speakerów",
                  "Jak oglądać seriale, żeby się uczyć",
                  "Akcent brytyjski vs amerykański",
                  "Podcasty jako narzędzie nauki",
                ],
              },
              {
                num: "Moduł 5",
                title: "📖 Gramatyka",
                sub: "Tylko to, co naprawdę potrzebne",
                lessons: [
                  "80% gramatyki, której nie potrzebujesz",
                  "Past Simple vs Present Perfect — raz na zawsze",
                  "Conditionals — tylko 2, które musisz znać",
                  "Modal verbs — nie tylko can i should",
                ],
              },
              {
                num: "Moduł 6",
                title: "🎙️ Wymowa",
                sub: "Kluczowe głoski, nie perfekcyjny akcent",
                lessons: [
                  "TH, długie/krótkie samogłoski, głoska NI",
                  "Californian English — głoska O i 6 wersji T",
                  "Intonacja — jak nie brzmieć jak robot",
                  "Wymowa liczb, dat i cen",
                ],
              },
              {
                num: "Moduł 7",
                title: "🚀 Fluency Sprint",
                sub: "Wszystko razem w praktyce",
                lessons: [
                  "7-Day Speaking Challenge — finał kursu",
                  "Twoje nagranie — przed i po",
                ],
              },
            ].map((mod) => (
              <div key={mod.num} className={styles.moduleCard}>
                <div className={styles.moduleNum}>{mod.num}</div>
                <div className={styles.moduleTitle}>{mod.title}</div>
                <div className={styles.moduleSub}>{mod.sub}</div>
                <div className={styles.moduleLessons}>
                  {mod.lessons.map((lesson) => (
                    <div key={lesson} className={styles.moduleLesson}>
                      {lesson}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="jak-dziala">
        <div className={styles.sectionInner}>
          <div className={styles.sectionTag}>Jak to działa</div>
          <h2 className={styles.sectionTitle}>
            Uczysz się.
            <br />
            Mówisz. Dostajesz feedback.
          </h2>
          <p className={styles.sectionSub}>
            Zero skomplikowanych systemów. Każda lekcja to wideo, materiał i zadanie do wykonania —
            głosowe albo tekstowe. Wysyłasz, ja sprawdzam, daję feedback. I tak 34 razy.
          </p>
          <div className={styles.howSteps}>
            {[
              {
                num: "01",
                title: "Oglądasz wideo",
                text: "Krótkie, konkretne nagranie gdzie tłumaczę temat — tak jak na normalnej lekcji.",
              },
              {
                num: "02",
                title: "Czytasz materiał",
                text: "Każda lekcja ma treść z przykładami, insightami i ćwiczeniami do przeanalizowania.",
              },
              {
                num: "03",
                title: "Robisz zadanie",
                text: "Nagrywasz się albo piszesz odpowiedź — bezpośrednio w platformie. Wysyłasz jednym kliknięciem.",
              },
              {
                num: "04",
                title: "Dostajesz feedback",
                text: "Odsłuchuję, czytam i komentuję. Wiesz co robisz dobrze i co konkretnie poprawić.",
              },
            ].map((step) => (
              <div key={step.num} className={styles.howStep}>
                <div className={styles.stepNum}>{step.num}</div>
                <div className={styles.stepTitle}>{step.title}</div>
                <div className={styles.stepText}>{step.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.aboutSection}`} id="o-mnie">
        <div className={styles.sectionInner}>
          <div className={styles.aboutGrid}>
            <div>
              <div className={styles.sectionTag}>Czemu warto mnie posłuchać</div>
              <h2 className={styles.sectionTitle}>
                Mam filologię.
                <br />I wiem, że to za mało.
              </h2>
              <p className={styles.sectionSub}>
                Skończyłem filologię angielską. Mam papiery. I właśnie dlatego wiem, że same papiery
                nie robią z nikogo dobrego nauczyciela — bo widziałem z bliska jak uczą ci z
                certyfikatami.
              </p>
              <div className={styles.aboutFacts}>
                <div className={styles.aboutFact}>
                  <div className={styles.factIcon}>✈️</div>
                  <div>
                    <div className={styles.factTitle}>
                      Sam nauczyłem się przez życie, nie przez szkołę
                    </div>
                    <div className={styles.factText}>
                      Wyjazdy za granicę, Erasmus, oglądanie rzeczy po angielsku — nie lekcje.
                      Blokada przy mówieniu? Miałem ją. Wiem jak to naprawić.
                    </div>
                  </div>
                </div>
                <div className={styles.aboutFact}>
                  <div className={styles.factIcon}>👁️</div>
                  <div>
                    <div className={styles.factTitle}>
                      Od liceum obserwowałem co działa, a co nie
                    </div>
                    <div className={styles.factText}>
                      Chodziłem do korepetytorów i wyłapywałem co ma sens, a co jest tylko
                      marnowaniem czasu. Filologia dała mi narzędzia — i potwierdziła moje
                      podejrzenia.
                    </div>
                  </div>
                </div>
                <div className={styles.aboutFact}>
                  <div className={styles.factIcon}>🎯</div>
                  <div>
                    <div className={styles.factTitle}>Uczę od 2022 roku i nikt nie odszedł</div>
                    <div className={styles.factText}>
                      Pracowałem z dziesiątkami uczniów na różnych poziomach. Maturę pisałem w 2022
                      — pamiętam jak to jest być po drugiej stronie.
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.aboutQuote}>
                <div className={styles.quoteText}>
                  &quot;Większość korepetytorów uczy tak samo jak szkoła — tylko drożej. Dlatego
                  efekty są takie same.&quot;
                </div>
                <div className={styles.quoteAuthor}>— Wiktor Szyszkowski</div>
              </div>
            </div>
            <div className={styles.compareBox}>
              <div className={styles.compareTag}>Moje podejście vs typowy korepetytor</div>
              <div className={styles.compareRows}>
                <div className={styles.compareHeader}>
                  <div className={styles.compareHeaderBad}>😴 Typowy korepetytor</div>
                  <div className={styles.compareHeaderGood}>✅ Ten kurs</div>
                </div>
                {[
                  ["Certyfikat = dowód że umie uczyć", "Filologia + własna droga przez mówienie"],
                  ["Nauka z podręcznika", "Nauka przez prawdziwy content"],
                  ["Ćwiczenia z luki i testy", "Mówienie od pierwszego dnia"],
                  ["Uczysz się bo musisz", "Uczysz się bo chcesz i widzisz sens"],
                ].map(([bad, good]) => (
                  <div key={bad} className={styles.compareRow}>
                    <div className={styles.compareCellBad}>{bad}</div>
                    <div className={styles.compareCellGood}>{good}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.reviews}`} id="opinie">
        <div className={styles.sectionInner}>
          <div className={styles.sectionTag}>Dowód że to działa</div>
          <h2 className={styles.sectionTitle}>
            Uczniowie mówią
            <br />
            sami za siebie.
          </h2>
          <p className={styles.sectionSub}>
            Nie sprzedaję Ci snu. Sprzedaję Ci metodę, która działa — i mam na to dowody.
          </p>
          <div className={styles.reviewsGrid}>
            {[
              {
                text: "Gorąco polecam zajęcia z Wiktorem. Zaczynałem tak naprawdę z punktu zera, a dzięki Wiktorowi udało mi się zdać maturę pisemną na poziomie 60%! Cierpliwość oraz zaangażowanie jest niesamowite. Nigdy nie miałem sytuacji, że nie był w stanie mi czegoś wytłumaczyć lub pomóc.",
                author: "Marcel",
                meta: "Zdana matura z punktu zera",
              },
              {
                text: "Od pół roku uczestniczę w zajęciach Wiktora. Oceny w szkole są 2 razy lepsze, mega poprawa w rozumieniu i mówieniu po angielsku. Tok nauczania według potrzeb każdego ucznia. Bardzo polecam.",
                author: "Maks",
                meta: "2x lepsze oceny",
              },
              {
                text: "Serdecznie polecam! Zajęcia prowadzone są zawsze w bardzo ciekawy sposób, a atmosfera jest luźna i motywująca. Dzięki zaangażowaniu Wiktora szybko zobaczyłam postępy. Idealny wybór zarówno dla początkujących jak i bardziej zaawansowanych.",
                author: "Martyna",
                meta: "Rozwój konwersacji",
              },
              {
                text: "Bardzo zadowolona chociażby z cierpliwości i przemiłej atmosfery. Na początku w ogóle bałam się odezwać po angielsku — teraz faktycznie widzę progres. Jeśli ktoś się zastanawia — gorąco polecam.",
                author: "Wiktoria",
                meta: "Przełamanie bariery językowej",
              },
            ].map((review) => (
              <div key={review.author} className={styles.reviewCard}>
                <div className={styles.reviewStars}>★★★★★</div>
                <div className={styles.reviewText}>{review.text}</div>
                <div className={styles.reviewAuthor}>{review.author}</div>
                <div className={styles.reviewMeta}>{review.meta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="cennik">
        <div className={styles.sectionInner}>
          <div className={styles.pricingInner}>
            <div className={`${styles.sectionTag} ${styles.sectionTagCenter}`}>Inwestycja</div>
            <h2 className={`${styles.sectionTitle} ${styles.sectionTitleCenter}`}>
              Masz dwie opcje.
            </h2>
            <p className={styles.pricingIntro}>
              Możesz dalej uczyć się metodami które nie działają. Albo możesz spróbować czegoś
              innego.
            </p>
            <div className={styles.pricingBox}>
              <div className={styles.pricingTag}>Pełny dostęp · bezterminowy</div>
              <div className={styles.pricingTitle}>Unschool Your English</div>
              <div className={styles.pricingTagline}>Przestań się uczyć, zacznij mówić.</div>
              <div className={styles.pricingSub}>
                Przestań się uczyć, zacznij mówić — z feedbackiem na każde zadanie.
              </div>
              <ul className={styles.pricingList}>
                <li>34 lekcje wideo + pełne materiały pisemne</li>
                <li>Zadania głosowe — nagrywasz się w platformie</li>
                <li>Zadania tekstowe po każdej lekcji</li>
                <li>Personalny feedback ode mnie na każde zadanie</li>
                <li>Dostęp bezterminowy — bez presji czasowej</li>
                <li>Działa na telefonie, tablecie i komputerze</li>
              </ul>
              <div className={styles.pricingOld}>697 zł</div>
              <div className={styles.pricingPrice}>
                <sup>zł</sup>597
              </div>
              <div className={styles.pricingPromo}>🔥 Cena promocyjna</div>
              <div className={styles.pricingNote}>cena brutto · jednorazowo · bez ukrytych opłat</div>
              <button type="button" className={styles.pricingBtn} onClick={openModal}>
                Chcę w końcu mówić →
              </button>
              <div className={styles.pricingExtra}>
                Wypełniasz formularz, odezwę się w ciągu 24h z linkiem do płatności. Po opłaceniu
                dostajesz dostęp.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.faqSection}`} id="faq">
        <div className={styles.sectionInner}>
          <div className={styles.sectionTag}>FAQ</div>
          <h2 className={`${styles.sectionTitle} ${styles.sectionTitleFaq}`}>
            Najczęstsze pytania
          </h2>
          <div className={styles.faqList}>
            {[
              {
                q: "Dla kogo jest ten kurs?",
                a: "Dla dorosłych na poziomie B1–B2, którzy rozumieją angielski ale mają problem z mówieniem. Znasz słówka, rozumiesz filmy — ale przy rozmowie coś się zacina. To jest dokładnie ta sytuacja, na którą ten kurs odpowiada.",
              },
              {
                q: "Jak wygląda dostęp do kursu?",
                a: "Po zakupie dostajesz link do platformy online. Wszystko działa w przeglądarce — na telefonie, tablecie i komputerze. Nie musisz nic instalować.",
              },
              {
                q: "Jak długo mam dostęp?",
                a: "Dostęp jest bezterminowy. Kupujesz raz i masz na zawsze. Możesz wracać do lekcji kiedy chcesz, we własnym tempie.",
              },
              {
                q: "Jak działa personalny feedback?",
                a: "Po każdej lekcji wysyłasz zadanie — nagranie głosowe lub odpowiedź tekstową. Odsłuchuję każde nagranie i czytam każdą odpowiedź osobiście. Komentuję co poszło dobrze i co konkretnie poprawić. To nie są automatyczne odpowiedzi.",
              },
              {
                q: "Ile czasu dziennie muszę poświęcać?",
                a: "Kurs jest zaprojektowany na 2–3 lekcje tygodniowo, co daje około 20–30 minut dziennie w dni nauki. Łącznie to około 3 miesiące w spokojnym tempie. Możesz iść wolniej — dostęp nie wygasa.",
              },
              {
                q: "Czy kurs zastępuje indywidualne lekcje?",
                a: "To są dwa różne produkty. Kurs daje Ci strukturę, materiał i feedback na zadania. Indywidualne lekcje 1:1 to bezpośrednia rozmowa i praca nad konkretnymi problemami. Jeśli chcesz oboje — napisz do mnie, możemy to połączyć.",
              },
              {
                q: 'Jak kupić kurs?',
                a: 'Kliknij dowolny przycisk "Chcę w końcu mówić" — pojawi się formularz. Wypełniasz dane do faktury, wysyłasz. Odezwę się w ciągu 24h z linkiem do płatności przez Useme. Dopiero po opłaceniu dostajesz dostęp.',
              },
            ].map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2>
          Moment &quot;kiedy będę gotowy&quot;
          <br />
          nigdy nie przychodzi.
        </h2>
        <p>
          Jedyny sposób żeby zacząć mówić — to zacząć mówić. Mam dla Ciebie system który sprawia,
          że to działa.
        </p>
        <button type="button" className={styles.ctaBtn} onClick={openModal}>
          Zaczynam teraz →
        </button>
      </section>

      <footer className={styles.footer}>
        <a href="https://wiktorszyszkowski.pl" className={styles.footerBrand}>
          SZYSZKOWSKI
        </a>
        <div className={styles.footerLinks}>
          <a href="https://wiktorszyszkowski.pl">← Strona główna</a>
          <a href="tel:+48796151334">796 151 334</a>
          <a href="https://www.instagram.com/szycha_/" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </div>
        <div className={styles.footerCopy}>© 2026 Wiktor Szyszkowski</div>
      </footer>

      <div
        className={`${styles.orderModal} ${isModalOpen ? styles.orderModalActive : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
      >
        <button
          type="button"
          className={styles.modalBackdrop}
          onClick={closeModal}
          aria-label="Zamknij"
        />
        <div className={styles.modalCard}>
          <button type="button" className={styles.modalClose} onClick={closeModal} aria-label="Zamknij">
            ✕
          </button>

          {!isSuccess ? (
            <>
              <div className={styles.modalHeader}>
                <div className={styles.modalTag}>Zamówienie kursu</div>
                <h3 id="order-modal-title" className={styles.modalTitle}>
                  Unschool Your English
                </h3>
                <div className={styles.modalPriceRow}>
                  <div>
                    <div className={styles.modalPriceOld}>697 zł</div>
                    <div className={styles.modalPriceMain}>597 zł</div>
                  </div>
                  <div className={styles.modalPriceMeta}>
                    <span className={styles.modalPromoBadge}>PROMOCJA</span>
                    <div className={styles.modalPriceNote}>jednorazowo · dostęp bezterminowy</div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <input type="hidden" name="produkt" value="Unschool Your English — 597 zł" />

                <div className={styles.formFields}>
                  <div>
                    <label className={styles.formLabel} htmlFor="imie_nazwisko">
                      Imię i nazwisko *
                    </label>
                    <input
                      id="imie_nazwisko"
                      type="text"
                      name="imie_nazwisko"
                      required
                      placeholder="Jan Kowalski"
                      className={styles.formInput}
                    />
                  </div>

                  <div>
                    <label className={styles.formLabel} htmlFor="email">
                      Adres e-mail *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      placeholder="jan@email.com"
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formInfo}>
                    <span className={styles.formInfoIcon}>🔒</span>
                    <p className={styles.formInfoText}>
                      <strong>Dlaczego pytam o adres?</strong>
                      <br />
                      Dane adresowe są potrzebne wyłącznie do wystawienia faktury przez Useme. Nie
                      będę ich używać do żadnych innych celów.
                    </p>
                  </div>

                  <div>
                    <label className={styles.formLabel} htmlFor="ulica">
                      Ulica i numer *
                    </label>
                    <input
                      id="ulica"
                      type="text"
                      name="ulica"
                      required
                      placeholder="ul. Kwiatowa 5/10"
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div>
                      <label className={styles.formLabel} htmlFor="kod_pocztowy">
                        Kod pocztowy *
                      </label>
                      <input
                        id="kod_pocztowy"
                        type="text"
                        name="kod_pocztowy"
                        required
                        placeholder="00-000"
                        className={styles.formInput}
                      />
                    </div>
                    <div>
                      <label className={styles.formLabel} htmlFor="miasto">
                        Miasto *
                      </label>
                      <input
                        id="miasto"
                        type="text"
                        name="miasto"
                        required
                        placeholder="Warszawa"
                        className={styles.formInput}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={styles.formLabel} htmlFor="nip">
                      NIP{" "}
                      <span className={styles.formLabelOptional}>
                        (opcjonalnie — tylko jeśli chcesz fakturę na firmę)
                      </span>
                    </label>
                    <input
                      id="nip"
                      type="text"
                      name="nip"
                      placeholder="000-000-00-00"
                      className={styles.formInput}
                    />
                  </div>

                  <div>
                    <label className={styles.formLabel} htmlFor="uwagi">
                      Dodatkowe uwagi{" "}
                      <span className={styles.formLabelOptional}>(opcjonalnie)</span>
                    </label>
                    <textarea
                      id="uwagi"
                      name="uwagi"
                      rows={2}
                      placeholder="Coś do dodania..."
                      className={styles.formTextarea}
                    />
                  </div>

                  <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                    {isSubmitting
                      ? "Wysyłam..."
                      : submitError ?? "Wyślij zamówienie →"}
                  </button>

                  <p className={styles.formDisclaimer}>
                    Po wysłaniu odezwę się w ciągu 24h z linkiem do płatności.
                    <br />
                    Dane służą wyłącznie do faktury — nic więcej.
                  </p>
                </div>
              </form>
            </>
          ) : (
            <div className={styles.formSuccess}>
              <div className={styles.formSuccessIcon}>✅</div>
              <h3 className={styles.formSuccessTitle}>Gotowe!</h3>
              <p className={styles.formSuccessText}>
                Dostałem Twoje dane — odezwę się w ciągu 24h z linkiem do płatności.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
