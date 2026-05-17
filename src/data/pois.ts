import cocioc from "@/assets/cocioc.jpg";
import caramidari from "@/assets/caramidari.jpg";
import tineretului from "@/assets/tineretului.jpg";
import oraselul from "@/assets/oraselul.jpg";
import berceni from "@/assets/berceni.jpg";

export type POI = {
  id: string;
  name: string;
  year: string;
  lat: number;
  lng: number;
  image: string;
  story: string;
  funFacts: string[];
};

export const POIS: POI[] = [
  {
    id: "cocioc",
    name: "Fosta mlaștină Cocioc",
    year: "sec. XIX",
    lat: 44.4072,
    lng: 26.1185,
    image: cocioc,
    story:
      "Înainte de a deveni parc, sudul Capitalei era brăzdat de bălți și mlaștini alimentate de râul Dâmbovița. Cea mai întinsă era mlaștina Cocioc — un loc al stufărișului, al broaștelor și al pescarilor din mahala. Localnicii o ocoleau noaptea, convinși că aici se ascund duhuri ale apei. La începutul secolului XX a fost asanată progresiv, iar pământul scos din lacuri a fost folosit pentru a forma colinele de astăzi din Parcul Tineretului.",
    funFacts: [
      "Numele „Cocioc” vine de la o specie de stuf folosită la împletit coșuri.",
      "Țăranii din zonă plăteau o taxă specială pentru a tăia stuful — era prima resursă „industrială” a sudului Bucureștiului.",
      "În 1906, un ziar al vremii relata că în mlaștină se găseau țipari mai lungi de un metru.",
    ],
  },
  {
    id: "caramidari",
    name: "Cărămidarii de Jos",
    year: "1700–1900",
    lat: 44.4015,
    lng: 26.1110,
    image: caramidari,
    story:
      "Pe locul actualului cartier Berceni se întindea satul Cărămidarii de Jos, atestat documentar încă din vremea lui Constantin Brâncoveanu. Locuitorii — în mare parte sârbi și bulgari aduși ca meșteri — fabricau cărămizile cu care s-a construit jumătate din Bucureștiul de altădată: de la han de mahala până la biserici domnești. Cuptoarele lor ardeau zi și noapte, iar fumul roșiatic se vedea de la kilometri întregi.",
    funFacts: [
      "Cărămizile de aici au fost folosite la construirea Palatului Mogoșoaia.",
      "Biserica Cărămidarii de Jos (1745) este unul dintre puținele vestigii ale satului care încă există.",
      "Strada „Cărămidarii de Jos” din Berceni păstrează și astăzi numele satului dispărut.",
    ],
  },
  {
    id: "tineretului",
    name: "Parcul Tineretului",
    year: "1965–1974",
    lat: 44.4045,
    lng: 26.1175,
    image: tineretului,
    story:
      "Construit între 1965 și 1974 pe locul fostelor gropi de gunoi și mlaștini, Parcul Tineretului a fost gândit ca „plămânul verde” al Bucureștiului socialist. 200 de hectare, trei lacuri artificiale și peste 50.000 de arbori plantați de brigăzi de tineri voluntari. Inițial trebuia să găzduiască Jocurile Olimpice ale Tineretului — proiect abandonat după 1977.",
    funFacts: [
      "Lacurile parcului sunt alimentate din pânza freatică a fostei mlaștini Cocioc.",
      "Sub colinele parcului se află gunoiul vechi de aproape un secol al Bucureștiului.",
      "Sala Polivalentă, deschisă în 1974, a fost una dintre primele construcții cu acoperiș suspendat din România.",
    ],
  },
  {
    id: "oraselul",
    name: "Orășelul Copiilor",
    year: "1957",
    lat: 44.4018,
    lng: 26.1213,
    image: oraselul,
    story:
      "Deschis în 1957, Orășelul Copiilor a fost primul parc de distracții permanent din România comunistă. Caruselul cu cai de lemn, trenulețul „Pufuleț” și roata mare au făcut deliciul a generații întregi de bucureșteni. În anii '80, biletul costa 1 leu — un copil putea petrece o zi întreagă cu suma dată de bunici la plecarea din vizită.",
    funFacts: [
      "Trenulețul „Pufuleț” funcționează aproape neîntrerupt din 1958.",
      "În 1972 a fost vizitat de Iuri Gagarin, care s-a dat în roata mare alături de copii din cartier.",
      "Caruselul original a fost adus din Cehoslovacia — piesele de schimb se mai aduc și astăzi de acolo.",
    ],
  },
  {
    id: "berceni",
    name: "Cartierul Berceni",
    year: "1960–1985",
    lat: 44.3878,
    lng: 26.1268,
    image: berceni,
    story:
      "Berceni este unul dintre cele mai mari cartiere-dormitor ridicate în perioada comunistă. Construit între 1960 și 1985 pe locul fostelor sate Cărămidarii de Jos, Berceni-Sârbi și Vii, a ajuns la peste 130.000 de locuitori. Blocurile de tip „confort II” au fost ridicate cu prefabricate produse la fabrica IPB de pe DN5 — un bloc se asambla în mai puțin de o lună.",
    funFacts: [
      "Numele „Berceni” vine de la boierul Mihail Cantacuzino-Bercenul, proprietarul moșiei în secolul XVIII.",
      "Metroul a ajuns abia în 2011 la „Berceni”, după 40 de ani de promisiuni.",
      "În anii '80, Berceni era poreclit „cartierul fără sfârșit” — autobuzele 116 și 173 făceau peste o oră până în centru.",
    ],
  },
];
