export type UnschoolTextTestimonial = {
  kind: "text";
  id: string;
  author: string;
  text: string;
};

export type UnschoolVideoTestimonial = {
  kind: "video";
  id: string;
  author: string;
  video: {
    src: string;
    poster?: string | null;
  };
};

export type UnschoolTestimonial = UnschoolTextTestimonial | UnschoolVideoTestimonial;

export const UNSCHOOL_TESTIMONIALS: readonly UnschoolTestimonial[] = [
  {
    kind: "text",
    id: "lilia",
    author: "Lilia",
    text: `Ten kurs online całkowicie odmienił moje podejście do nauki języka angielskiego. W przeciwieństwie do wielu korepetytorów, którzy powielają te same metody nauczania co w szkole, Wiktor skupia się na praktyce i realnej komunikacji.
Największą zaletą tego kursu jest mówienie od pierwszego dnia, które okazało się przyjemne i wcale nie takie straszne 😝.
Bardzo pomocny okazał się również regularny feedback oraz nagrywanie własnych wypowiedzi, dzięki czemu mogłam wyłapywać swoje błędy i dostrzegać progres, jaki zrobiłam.
Dzięki krótkim, codziennym lekcjom i dobrze zaplanowanej nauce kurs jest skuteczny i bardzo wygodny. Mogę uczyć się angielskiego, jadąc do pracy, siedząc w kawiarni lub leżąc wygodnie w łóżku przed snem 😍.
To świetna opcja dla osób, które chcą nie tylko znać zasady gramatyki, ale przede wszystkim swobodnie komunikować się po angielsku. Polecam z całego serca! 🫶`,
  },
  {
    kind: "video",
    id: "natalia",
    author: "Natalia",
    video: { src: "/opinia%20-%20natalia.mp4", poster: null },
  },
];
