import type {Lang} from './i18n';

export const EMAIL = 'automotive@hp-company.be';

type Copy = {
  nav: {cars: string; about: string; contact: string; sell: string; menu: string; close: string; home: string};
  gate: {question: string; buyEyebrow: string; buy: string; buyNote: string; sellEyebrow: string; sell: string; sellNote: string; hint: string; language: string};
  hero: {eyebrow: string; lines: [string, string]; intro: string; cta: string; all: string; scroll: string; featured: string};
  marquee: string[];
  inventory: {eyebrow: string; title: string; count: (n: number) => string; view: string; all: string; searchTitle: string; searchNote: string; searchCta: string; sellTitle: string; sellNote: string; sellCta: string};
  gallery: {eyebrow: string; lines: [string, string]; note: string; open: string};
  sell: {eyebrow: string; title: string; note: string; steps: [string, string][]; cta: string};
  contact: {eyebrow: string; title: string; note: string};
  footer: {tagline: string; explore: string; company: string; languages: string; rights: string};
  about: {
    eyebrow: string; lines: [string, string]; intro: string;
    storyEyebrow: string; storyTitle: string; story: string[];
    valuesEyebrow: string; values: [string, string][];
    processEyebrow: string; processTitle: string;
    groupEyebrow: string; groupTitle: string; groupNote: string;
    cta: string;
  };
  sellPage: {eyebrow: string; lines: [string, string]; intro: string; badges: string[]};
  detail: {home: string; facts: string; mailTitle: string; tradeTitle: string; tradeCta: string; more: string};
};

export const ui: Record<Lang, Copy> = {
  nl: {
    nav: {cars: 'Aanbod', about: 'Over ons', contact: 'Contact', sell: 'Verkoop uw wagen', menu: 'Menu', close: 'Sluiten', home: 'Startpagina'},
    gate: {question: 'Waarmee kunnen we u helpen?', buyEyebrow: '01 — Kopen', buy: 'Een wagen kopen', buyNote: 'Ontdek ons aanbod', sellEyebrow: '02 — Verkopen', sell: 'Uw wagen verkopen', sellNote: 'Bied uw wagen aan', hint: 'Kies uw richting', language: 'Taal'},
    hero: {eyebrow: 'Uitgelicht', lines: ['De juiste wagen.', 'Zonder omweg.'], intro: 'Zorgvuldig gekozen wagens, persoonlijk advies en heldere gegevens.', cta: 'Bekijk deze wagen', all: 'Volledig aanbod', scroll: 'Scroll', featured: 'Uitgelichte wagen'},
    marquee: ['Persoonlijk advies', 'Heldere voertuiggegevens', 'Inruil mogelijk', 'Bezichtiging op afspraak', 'NL · FR · EN'],
    inventory: {eyebrow: 'Aanbod', title: 'Ons aanbod', count: n => n === 1 ? '1 wagen' : `${n} wagens`, view: 'Bekijken', all: 'Alle', searchTitle: 'Niet gevonden wat u zoekt?', searchNote: 'Vertel ons welke wagen u zoekt.', searchCta: 'Mail ons', sellTitle: 'Uw wagen hier?', sellNote: 'Wij nemen uw wagen over.', sellCta: 'Verkoop uw wagen'},
    gallery: {eyebrow: 'In beeld', lines: ['Elke hoek.', 'Elk detail.'], note: 'Zie precies wat u koopt — in foto en video.', open: 'Bekijk de wagen'},
    sell: {eyebrow: 'Verkopen', title: 'Verkoop uw wagen. Eenvoudig en eerlijk.', note: 'Geen gedoe met advertenties of onbekende kopers.', steps: [['01', 'Gegevens & foto’s'], ['02', 'Persoonlijke beoordeling'], ['03', 'Contact & overname']], cta: 'Start uw aanvraag'},
    contact: {eyebrow: 'Contact', title: 'Vragen over een wagen?', note: 'Mail ons. We antwoorden persoonlijk.'},
    footer: {tagline: 'Uw volgende wagen, helder in beeld.', explore: 'Ontdek', company: 'Bedrijf', languages: 'Taal', rights: 'Alle rechten voorbehouden'},
    about: {
      eyebrow: 'Over ons', lines: ['Wagens met', 'een verhaal.'], intro: 'HP-Automotive koopt en verkoopt tweedehandswagens met aandacht voor elk detail.',
      storyEyebrow: 'Ons verhaal', storyTitle: 'Persoonlijk. Transparant. Zorgvuldig.',
      story: ['Een wagen kopen is een grote beslissing. Daarom tonen we elke wagen zoals hij is: met duidelijke foto’s, video en alle gegevens die ertoe doen.', 'Wilt u uw wagen verkopen? Dan bekijken we uw aanvraag persoonlijk en zoeken we samen naar een eerlijke oplossing.'],
      valuesEyebrow: 'Waar we voor staan',
      values: [['Transparant', 'Alle gegevens op tafel. Geen kleine lettertjes.'], ['Persoonlijk', 'U spreekt rechtstreeks met ons, niet met een callcenter.'], ['Zorgvuldig', 'Elke wagen wordt in detail in beeld gebracht.']],
      processEyebrow: 'Zo werkt het', processTitle: 'Drie stappen naar uw volgende wagen.',
      groupEyebrow: 'HP-Company', groupTitle: 'Onderdeel van HP-Company.', groupNote: 'HP-Automotive is de autotak van HP-Company, gevestigd in België.',
      cta: 'Bekijk ons aanbod',
    },
    sellPage: {eyebrow: 'Verkopen', lines: ['Uw wagen verkopen?', 'Wij nemen hem over.'], intro: 'Vul de gegevens in, voeg foto’s toe en wij nemen persoonlijk contact op.', badges: ['Gratis aanvraag', 'Geen verplichting', 'Privé behandeld']},
    detail: {home: 'Aanbod', facts: 'Kerngegevens', mailTitle: 'Liever mailen?', tradeTitle: 'Uw huidige wagen inruilen?', tradeCta: 'Bied uw wagen aan', more: 'Meer details'},
  },
  fr: {
    nav: {cars: 'Nos voitures', about: 'À propos', contact: 'Contact', sell: 'Vendre votre voiture', menu: 'Menu', close: 'Fermer', home: 'Accueil'},
    gate: {question: 'Comment pouvons-nous vous aider ?', buyEyebrow: '01 — Acheter', buy: 'Acheter une voiture', buyNote: 'Découvrez notre offre', sellEyebrow: '02 — Vendre', sell: 'Vendre votre voiture', sellNote: 'Proposez votre voiture', hint: 'Choisissez votre direction', language: 'Langue'},
    hero: {eyebrow: 'À la une', lines: ['La bonne voiture.', 'Sans détour.'], intro: 'Des voitures soigneusement choisies, un conseil personnel et des données claires.', cta: 'Voir cette voiture', all: 'Toute l’offre', scroll: 'Défiler', featured: 'Voiture à la une'},
    marquee: ['Conseil personnel', 'Données claires', 'Reprise possible', 'Visite sur rendez-vous', 'NL · FR · EN'],
    inventory: {eyebrow: 'Offre', title: 'Nos voitures', count: n => n === 1 ? '1 voiture' : `${n} voitures`, view: 'Voir', all: 'Toutes', searchTitle: 'Vous ne trouvez pas votre bonheur ?', searchNote: 'Dites-nous quelle voiture vous cherchez.', searchCta: 'Écrivez-nous', sellTitle: 'Votre voiture ici ?', sellNote: 'Nous reprenons votre voiture.', sellCta: 'Vendre votre voiture'},
    gallery: {eyebrow: 'En images', lines: ['Chaque angle.', 'Chaque détail.'], note: 'Voyez exactement ce que vous achetez — en photo et en vidéo.', open: 'Voir la voiture'},
    sell: {eyebrow: 'Vendre', title: 'Vendez votre voiture. Simplement et honnêtement.', note: 'Sans annonces ni acheteurs inconnus.', steps: [['01', 'Données & photos'], ['02', 'Évaluation personnelle'], ['03', 'Contact & reprise']], cta: 'Commencer ma demande'},
    contact: {eyebrow: 'Contact', title: 'Une question sur une voiture ?', note: 'Écrivez-nous. Nous répondons personnellement.'},
    footer: {tagline: 'Votre prochaine voiture, en toute clarté.', explore: 'Découvrir', company: 'Entreprise', languages: 'Langue', rights: 'Tous droits réservés'},
    about: {
      eyebrow: 'À propos', lines: ['Des voitures', 'avec une histoire.'], intro: 'HP-Automotive achète et vend des voitures d’occasion avec une attention à chaque détail.',
      storyEyebrow: 'Notre histoire', storyTitle: 'Personnel. Transparent. Soigné.',
      story: ['Acheter une voiture est une décision importante. Nous montrons donc chaque voiture telle qu’elle est : photos claires, vidéo et toutes les données utiles.', 'Vous souhaitez vendre votre voiture ? Nous examinons votre demande personnellement et cherchons ensemble une solution équitable.'],
      valuesEyebrow: 'Nos valeurs',
      values: [['Transparent', 'Toutes les données sur la table. Pas de petites lignes.'], ['Personnel', 'Vous parlez directement avec nous, pas avec un call center.'], ['Soigné', 'Chaque voiture est présentée en détail.']],
      processEyebrow: 'Comment ça marche', processTitle: 'Trois étapes vers votre prochaine voiture.',
      groupEyebrow: 'HP-Company', groupTitle: 'Une entreprise HP-Company.', groupNote: 'HP-Automotive est la branche automobile de HP-Company, établie en Belgique.',
      cta: 'Voir nos voitures',
    },
    sellPage: {eyebrow: 'Vendre', lines: ['Vendre votre voiture ?', 'Nous la reprenons.'], intro: 'Complétez les données, ajoutez des photos et nous vous contactons personnellement.', badges: ['Demande gratuite', 'Sans engagement', 'Traitement privé']},
    detail: {home: 'Nos voitures', facts: 'Données clés', mailTitle: 'Vous préférez écrire ?', tradeTitle: 'Reprendre votre voiture actuelle ?', tradeCta: 'Proposer votre voiture', more: 'Plus de détails'},
  },
  en: {
    nav: {cars: 'Cars', about: 'About', contact: 'Contact', sell: 'Sell your car', menu: 'Menu', close: 'Close', home: 'Home'},
    gate: {question: 'How can we help you?', buyEyebrow: '01 — Buy', buy: 'Buy a car', buyNote: 'Explore our cars', sellEyebrow: '02 — Sell', sell: 'Sell your car', sellNote: 'Offer your car to us', hint: 'Choose your direction', language: 'Language'},
    hero: {eyebrow: 'Featured', lines: ['The right car.', 'No detours.'], intro: 'Carefully chosen cars, personal advice and clear specifications.', cta: 'View this car', all: 'All cars', scroll: 'Scroll', featured: 'Featured car'},
    marquee: ['Personal advice', 'Clear specifications', 'Trade-in possible', 'Viewing by appointment', 'NL · FR · EN'],
    inventory: {eyebrow: 'Inventory', title: 'Our cars', count: n => n === 1 ? '1 car' : `${n} cars`, view: 'View', all: 'All', searchTitle: 'Can’t find what you need?', searchNote: 'Tell us which car you are looking for.', searchCta: 'Email us', sellTitle: 'Your car here?', sellNote: 'We buy your car.', sellCta: 'Sell your car'},
    gallery: {eyebrow: 'In focus', lines: ['Every angle.', 'Every detail.'], note: 'See exactly what you buy — in photos and video.', open: 'View the car'},
    sell: {eyebrow: 'Sell', title: 'Sell your car. Simple and fair.', note: 'No listings, no strangers, no hassle.', steps: [['01', 'Details & photos'], ['02', 'Personal review'], ['03', 'Contact & handover']], cta: 'Start your enquiry'},
    contact: {eyebrow: 'Contact', title: 'Questions about a car?', note: 'Email us. We reply personally.'},
    footer: {tagline: 'Your next car, clearly presented.', explore: 'Explore', company: 'Company', languages: 'Language', rights: 'All rights reserved'},
    about: {
      eyebrow: 'About', lines: ['Cars with', 'a story.'], intro: 'HP-Automotive buys and sells used cars with attention to every detail.',
      storyEyebrow: 'Our story', storyTitle: 'Personal. Transparent. Careful.',
      story: ['Buying a car is a big decision. That is why we show every car as it is: clear photos, video and every detail that matters.', 'Want to sell your car? We review your enquiry personally and look for a fair solution together.'],
      valuesEyebrow: 'What we stand for',
      values: [['Transparent', 'Every detail on the table. No small print.'], ['Personal', 'You talk to us directly, not to a call centre.'], ['Careful', 'Every car is presented in detail.']],
      processEyebrow: 'How it works', processTitle: 'Three steps to your next car.',
      groupEyebrow: 'HP-Company', groupTitle: 'Part of HP-Company.', groupNote: 'HP-Automotive is the automotive division of HP-Company, based in Belgium.',
      cta: 'Explore our cars',
    },
    sellPage: {eyebrow: 'Sell', lines: ['Selling your car?', 'We’ll take it.'], intro: 'Fill in the details, add photos and we will contact you personally.', badges: ['Free enquiry', 'No obligation', 'Handled privately']},
    detail: {home: 'Cars', facts: 'Key facts', mailTitle: 'Prefer email?', tradeTitle: 'Trade in your current car?', tradeCta: 'Offer your car', more: 'More details'},
  },
};
