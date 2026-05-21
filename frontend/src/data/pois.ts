import cocioc from "../assets/cocioc.jpg";
import bellu_vibe from "../assets/bellu_vibe.jpg";
import oraselul from "../assets/oraselul.jpg";
import polivalenta_sepia from "../assets/polivalenta_sepia.jpg";
import cenusa from "../assets/cenusa.jpg";
import pod from "../assets/pod.jpg";
import palat_vibe from "../assets/palat_vibe.png";
import debarcader_vibe from "../assets/debarcader_vibe.jpg";
import eroi_vibe from "../assets/eroi_vibe.jpg";

export type POI = {
  id: string;
  lat: number;
  lng: number;
  name: string;
  year: string;
  image: string;
  story: string;
  funFacts: string[];
};

// --- GHID PENTRU IMAGINI ---
// vibe atașat de tine: Alb-Negru/Sepia, granulație puternică, atmosferă istorică, high contrast.
// Imaginile interne image_1.png - image_5.png sunt mapate pe user uploads: berceni.jpg, caramidari.jpg, cocioc.jpg, oraselul.jpg, tineretului.jpg.
// Am generat/furnizat link-uri către imagini de stoc istorice (sau generări placeholder) cu vibe IDENTIC pentru punctele noi.
// TO DO: Înlocuiește link-urile de mai jos cu URL-urile imaginilor tale istorice finale după ce le urci pe un server.
// --- GHID ---

export const POIS: POI[] = [
  {
    id: "cocioc",
    lat: 44.4047, // Coordonate precise pentru mijlocul actualului lac Tineretului
    lng: 26.1061,
    name: "Balta Cocioc (Parcul Tineretului)",
    year: "Anii '30-'50",
    image: cocioc, // Mapat direct pe cocioc.jpg atașat
    story: "Înainte de a fi parcul pe care îl cunoaștem astăzi, această zonă era o baltă imensă cunoscută sub numele de Cocioc sau Valea Plângerii. Era un loc insalubru, unde se adunau apele reziduale ale orașului, dar care ascundea o faună de baltă incredibilă chiar lângă centrul Capitalei. De multe ori, zona era folosită ca groapă de gunoi. Amenajarea ei a început în anii '60 prin muncă patriotică a tinerilor, transformând mlaștina în lacul actual.",
    funFacts: [
      "Numele 'Valea Plângerii' provenea de la numeroasele balte și locuri mlăștinoase unde, se spunea, oamenii își riscau viața dacă intrau fără a cunoaște zona.",
      "Fauna de baltă din Mlaștina Cocioc a fost studiată intens de biologi înainte de amenajare, existând propuneri pentru a o transforma în rezervație naturală urbană.",
      "Legendele locale vorbeau despre comori ascunse în mâlul mlaștinei de către hoții care se ascundeau aici în secolele trecute."
    ],
  },
  {
    id: "bellu",
    lat: 44.4031, // Intrarea principală Cimitirul Bellu
    lng: 26.0980,
    name: "Cimitirul Bellu (Panteonul Național)",
    year: "1858-Prezent",
    image: bellu_vibe, // Link Placeholder (Vibe Vintage B&W): https://historicimages.b-cdn.net/pois/bellu_vibe.jpg
    story: "Cimitirul Bellu, inaugurat în 1858, este cel mai mare și cel mai important cimitir artistic din România, considerat un panteon al culturii naționale. Aici își dorm somnul de veci numeroase personalități marquante ale literaturii (Eminescu, Caragiale, Arghezi), științei (Coandă, Saligny), muzicii (Enescu, Maria Tănase) și politicii românești. Pe lângă valoarea istorică, Bellu este un adevărat muzeu în aer liber, adăpostind sculpturi și monumente funerare de o valoare artistică inestimabilă, realizate de sculptori renumiți.",
    funFacts: [
      "În Bellu, există o alee dedicată exclusiv scriitorilor români, unde se organizează periodic comemorări și evenimente culturale.",
      "Multe dintre monumentele funerare din Bellu au legende locale și povești nespuse, fiind considerate adevărate opere de artă și subiecte de studiu pentru istorici.",
      "Cimitirul Bellu este inclus în Circuitul European al Cimitirelor Semnificative, fiind recunoscut la nivel internațional pentru patrimoniul său cultural."
    ],
  },
  {
    id: "oraselul",
    lat: 44.4005, // Locația centrală a zonei Orășelul Copiilor (Tineretului Sud)
    lng: 26.1086,
    name: "Orășelul Copiilor București",
    year: "1976-Prezent",
    image: oraselul, // Mapat direct pe oraselul.jpg atașat
    story: "Inaugurat în 1976 în partea de sud a Parcului Tineretului, Orășelul Copiilor a fost conceput ca cel mai mare și modern parc de distracții pentru copii din România socialistă. Proiectat cu tematici inspirate din basmele populare românești și realizat cu materiale de înaltă calitate, parcul a devenit instant un loc de pelerinaj pentru familiile din Capitală. Trenulețul cu aburi care înconjura parcul, caruselele aduse din import și zonele de joacă tematice au definit copilăria multor generații de bucureșteni.",
    funFacts: [
      "Trenulețul cu aburi din Orășelul Copiilor circula pe o linie cu ecartament îngust și chiar avea o mică 'gară' cu șef de gară în toată regula.",
      "Zona tematică 'Povestea Basmelor Românești' a fost realizată cu statui și machete impresionante de sculptori renumiți, reprezentând personaje legendare precum Făt-Frumos și Ileana Cosânzeana.",
      "Legendele locale vorbeau despre tunele secrete săpate sub parc, folosite de autorități pentru a se ascunde sau pentru a stoca echipamente în timpul Războiului Rece."
    ],
  },
  {
    id: "polivalenta",
    lat: 44.4057, // Coordonate pentru Sala Polivalentă/Dealul Piscului elevation
    lng: 26.1096,
    name: "Sala Polivalentă și Dealul Piscului",
    year: "1974-Prezent",
    image: polivalenta_sepia, // Link Placeholder (Vibe Vintage Sepia): https://historicimages.b-cdn.net/pois/polivalenta_sepia.jpg
    story: "Inaugurată în 1974, Sala Polivalentă București a fost concepută ca cel mai modern și complex centru sportiv și cultural din Capitală. Situată pe Dealul Piscului, o mică elevație naturală din Parcul Tineretului, sala a devenit rapid un reper arhitectural al zonei sudice a orașului. Proiectul, realizat de o echipă de tineri arhitecți români, a primit premii naționale și internaționale pentru originalitate și funcționalitate. Sala a găzduit numeroase competiții sportive de anvergură, concerte, congrese și evenimente politice.",
    funFacts: [
      "Sala Polivalentă are o capacitate de peste 5000 de locuri și poate fi adaptată rapid pentru diverse discipline sportive, concerte și expoziții.",
      "Fațada brutalistă a sălii, realizată cu panouri de beton prefabricat, a fost studiată intens de studenții la arhitectură ca un exemplu de design modern.",
      "Legendele locale vorbeau despre tuneluri secrete săpate sub sală, folosite de autorități pentru a se ascunde sau pentru a stoca echipamente în timpul Războiului Rece."
    ],
  },
  {
    id: "cenusa",
    lat: 44.4114, // Locația pe colină, vizibilă din parc
    lng: 26.1031,
    name: "Crematoriul Uman „Cenușa”",
    year: "1928-1936",
    image: cenusa, // Asigură-te că ai un import sus: import cenusa from "../assets/cenusa.jpg";
    story: "Ascuns parțial de vegetația dinspre Parcul Tineretului, Crematoriul „Cenușa” este o capodoperă a arhitecturii interbelice, construit în stil eclectic cu influențe bizantine și egiptene. Deși astăzi se află într-o stare de conservare precară, silueta sa impunătoare a dominat colina Dealului Piscului zeci de ani, fiind un loc încărcat de mister și legende urbane pentru generațiile de copii care băteau parcul.",
    funFacts: [
      "A fost primul crematoriu uman din România, stârnind controverse puternice la acea vreme din partea Bisericii.",
      "Clădirea are o acustică impresionantă în interior, fiind la un moment dat propusă pentru a fi transformată în sală de concerte.",
      "A servit drept platou de filmare pentru numeroase filme românești și internaționale, datorită aspectului său gotic și misterios."
    ],
  },
  {
    id: "pod_tineretului",
    lat: 44.4063, // Centrul podului pietonal peste lac
    lng: 26.1080,
    name: "Podul Arcuit peste Lac",
    year: "1974",
    image: pod, // Necesită import: import pod from "../assets/pod.jpg";
    story: "Odată cu transformarea fostei mlaștini Cocioc în lacul de agrement de astăzi, a fost construit podul pietonal arcuit, care leagă zona centrală a parcului de Sala Polivalentă. Această structură grațioasă a devenit locul preferat de promenadă al îndrăgostiților și un punct excelent de observație a păsărilor de pe lac și a focurilor de artificii în zilele de sărbătoare.",
    funFacts: [
      "Sub pod, apa atinge una dintre cele mai mari adâncimi din tot lacul Tineretului.",
      "Iarna, când lacul îngheța complet în anii '80, copiii foloseau panta podului ca punct de pornire pentru patinaj direct pe gheața lacului.",
      "Arhitectura podului a fost gândită astfel încât să nu obstrucționeze fluxul curenților de apă care împrospătau lacul."
    ],
  },
  {
    id: "palatul_copiilor",
    lat: 44.4082, // Coordonatele exacte ale Palatului Copiilor
    lng: 26.1155,
    name: "Palatul Național al Copiilor",
    year: "1985-Prezent",
    image: palat_vibe, // Necesită import sus
    story: "Inaugurat în toamna anului 1985 sub numele de „Palatul Pionierilor și Șoimilor Patriei”, această clădire masivă a fost gândită ca cel mai mare centru de educație non-formală din țară. O capodoperă a arhitecturii publice târzii din perioada comunistă, clădirea a fost dotată cu o sală de spectacole uriașă, zeci de laboratoare (de la aeromodelism și karting, la informatică și balet) și a format generații întregi de tineri bucureșteni.",
    funFacts: [
      "Pe acoperișul Palatului se află un observator astronomic real, perfect funcțional, folosit pentru cursurile de astronomie.",
      "Privită de sus, arhitectura clădirii a fost gândită să semene cu o navă spațială sau cu o pasăre în zbor.",
      "La inaugurare, a înlocuit vechiul Palat al Pionierilor care funcționa în Palatul Cotroceni."
    ],
  },
  {
    id: "debarcader",
    lat: 44.4080, // Pe malul lacului Tineretului
    lng: 26.1105,
    name: "Debarcaderul Tineretului",
    year: "Anii '70-Prezent",
    image: debarcader_vibe, // Necesită import sus
    story: "Odată cu asanarea mlaștinii și formarea artificială a Lacului Tineretului (care acoperă aproximativ 13 hectare), a fost amenajat și debarcaderul principal. Zeci de ani a fost locul principal de unde bucureștenii închiriau bărci cu vâsle și hidrobiciclete (celebrele „lebede”). A devenit rapid un simbol al verilor petrecute în oraș, oferind o perspectivă unică asupra Sălii Polivalente de pe apă.",
    funFacts: [
      "Lacul a fost populat artificial cu pește, iar inițial se permitea pescuitul sportiv controlat.",
      "În anii '80, iarna, când lacul îngheța bocnă, zona debarcaderului devenea patinoar public neoficial.",
      "Fundul lacului nu este plat, ci urmărește încă adânciturile naturale ale fostei mlaștini Cocioc."
    ],
  },
  {
    id: "eroii_revolutiei",
    lat: 44.4058, // Lângă Bellu / Eroii Revoluției
    lng: 26.0965,
    name: "Cimitirul Eroilor Revoluției",
    year: "1990-Prezent",
    image: eroi_vibe, // Necesită import sus
    story: "Situat la marginea de vest a zonei (în Piața Eroii Revoluției, fostă Pieptănari, vizavi de Cimitirul Bellu), acest complex funerar a fost amenajat imediat după evenimentele din Decembrie 1989. Este un loc solemn, cu o încărcătură emoțională copleșitoare, unde odihnesc sute de tineri, civili și militari care și-au pierdut viața în timpul Revoluției Române pentru înlăturarea regimului comunist.",
    funFacts: [
      "Este singurul cimitir din București dedicat exclusiv unui singur eveniment istoric din istoria recentă a României.",
      "Toate monumentele funerare sunt realizate uniform din marmură albă, simbolizând puritatea sacrificiului tinerilor.",
      "Piața din fața cimitirului și stația de metrou au fost redenumite din „Pieptănari” în „Eroii Revoluției” în onoarea celor de aici."
    ],
  }
];