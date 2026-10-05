import type {Lang} from './i18n';

export const EMAIL = 'automotive@hp-company.be';
export const BUDGETS = [10000, 15000, 20000, 30000, 50000];
// Shown in the search even before they are in stock, so a visitor can leave a search request.
export const POPULAR_BRANDS = ['Audi', 'BMW', 'Ford', 'Mercedes-Benz', 'Peugeot', 'Porsche', 'Renault', 'Skoda', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'];
export const FUELS = ['Benzine', 'Diesel', 'Hybride', 'Elektrisch', 'LPG'];

type Pair = [string, string];
type Copy = {
  nav: {cars: string; about: string; contact: string; sell: string; menu: string; close: string; home: string; theme: string};
  gate: {question: string; buyEyebrow: string; buy: string; buyNote: string; sellEyebrow: string; sell: string; sellNote: string; hint: string; language: string};
  hero: {eyebrow: string; lines: Pair; intro: string; searchTitle: string; brand: string; allBrands: string; budget: string; anyBudget: string; upTo: string; fuel: string; anyFuel: string; show: (n: number) => string; search: string; sellCta: string; newIn: string; view: string; notes: string[]};
  usps: Pair[];
  inventory: {eyebrow: string; title: string; count: (n: number) => string; sort: string; sorts: Record<'new' | 'priceAsc' | 'priceDesc' | 'km', string>; reset: string; noneTitle: string; noneNote: string; emptyTitle: string; emptyNote: string; request: string; requestSubject: string; view: string; sellTitle: string; sellNote: string; sellCta: string};
  gallery: {eyebrow: string; lines: Pair; note: string; open: string};
  steps: {eyebrow: string; title: string; items: Pair[]};
  valuation: {eyebrow: string; title: string; note: string; brand: string; model: string; km: string; brandPh: string; modelPh: string; kmPh: string; cta: string; points: string[]};
  faq: {eyebrow: string; title: string; items: Pair[]};
  sell: {steps: Pair[]};
  contact: {eyebrow: string; title: string; note: string};
  footer: {tagline: string; explore: string; company: string; languages: string; rights: string};
  about: {eyebrow: string; lines: Pair; intro: string; storyEyebrow: string; storyTitle: string; story: string[]; valuesEyebrow: string; values: Pair[]; facts: Pair[]; processEyebrow: string; processTitle: string; groupEyebrow: string; groupTitle: string; groupNote: string; cta: string; mail: string};
  sellPage: {eyebrow: string; lines: Pair; intro: string; badges: string[]};
  detail: {home: string; tradeTitle: string; tradeCta: string; more: string; trust: string[]};
};

export const ui: Record<Lang, Copy> = {
  nl: {
    nav: {cars: 'Aanbod', about: 'Over ons', contact: 'Contact', sell: 'Verkoop uw wagen', menu: 'Menu', close: 'Sluiten', home: 'Startpagina', theme: 'Wissel tussen licht en donker'},
    gate: {question: 'Waarmee kunnen we u helpen?', buyEyebrow: '01 — Kopen', buy: 'Een wagen kopen', buyNote: 'Bekijk ons aanbod', sellEyebrow: '02 — Verkopen', sell: 'Uw wagen verkopen', sellNote: 'Ontvang een voorstel', hint: 'Kies uw richting', language: 'Taal'},
    hero: {
      eyebrow: 'Tweedehandswagens · België', lines: ['Goede wagens.', 'Eerlijk geprijsd.'],
      intro: 'Elke wagen met Car-Pass en een duidelijke historiek. Kopen, inruilen of verkopen — bij één aanspreekpunt.',
      searchTitle: 'Zoek uw wagen', brand: 'Merk', allBrands: 'Alle merken', budget: 'Budget', anyBudget: 'Geen limiet', upTo: 'Tot', fuel: 'Brandstof', anyFuel: 'Alle',
      show: n => n === 1 ? 'Toon 1 wagen' : `Toon ${n} wagens`, search: 'Zoeken', sellCta: 'Wat is mijn wagen waard?', newIn: 'Nieuw binnen', view: 'Bekijk',
      notes: ['Car-Pass', 'Onderhoudshistoriek', 'Inruil mogelijk', 'Proefrit op afspraak'],
    },
    usps: [['Car-Pass bij elke wagen', 'De kilometerstand, zwart op wit.'], ['Inruil mogelijk', 'Uw huidige wagen telt mee in de deal.'], ['Proefrit op afspraak', 'Kom kijken en rijden wanneer het u past.'], ['NL · FR · EN', 'We helpen u in uw eigen taal.']],
    inventory: {
      eyebrow: 'Aanbod', title: 'Ons aanbod', count: n => n === 1 ? '1 wagen' : `${n} wagens`,
      sort: 'Sorteren', sorts: {new: 'Nieuwste eerst', priceAsc: 'Prijs: laag naar hoog', priceDesc: 'Prijs: hoog naar laag', km: 'Laagste kilometerstand'}, reset: 'Filters wissen',
      noneTitle: 'Geen wagen gevonden met deze filters.', noneNote: 'Geef uw zoekopdracht door. We laten het weten zodra er iets binnenkomt.',
      emptyTitle: 'Nieuwe wagens komen binnenkort online.', emptyNote: 'Zoekt u iets specifieks? Laat het ons weten, dan houden we u op de hoogte.',
      request: 'Zoekopdracht doorgeven', requestSubject: 'Zoekopdracht', view: 'Bekijken',
      sellTitle: 'Uw wagen verkopen?', sellNote: 'Ontvang een voorstel, zonder verplichting.', sellCta: 'Start hier',
    },
    gallery: {eyebrow: 'In beeld', lines: ['Elke hoek.', 'Elk detail.'], note: 'Zie precies wat u koopt — in foto en video.', open: 'Bekijk de wagen'},
    steps: {eyebrow: 'Zo werkt het', title: 'In drie stappen achter het stuur.', items: [['Kies uw wagen', 'Foto’s, video en alle gegevens staan online.'], ['Stel uw vragen', 'Mail ons. U krijgt een persoonlijk antwoord.'], ['Bezichtig en rij', 'Plan een bezichtiging en proefrit. Klopt alles? Dan regelen wij de rest.']]},
    valuation: {eyebrow: 'Verkopen of inruilen', title: 'Wat is uw wagen waard?', note: 'Vul drie gegevens in en vervolledig daarna uw aanvraag met foto’s. We bekijken alles persoonlijk.', brand: 'Merk', model: 'Model', km: 'Kilometerstand', brandPh: 'bv. Volkswagen', modelPh: 'bv. Golf', kmPh: 'bv. 85000', cta: 'Verder', points: ['Gratis en vrijblijvend', 'Persoonlijke beoordeling', 'Uw gegevens blijven privé']},
    faq: {eyebrow: 'Veelgestelde vragen', title: 'Goed om te weten.', items: [
      ['Kan ik mijn huidige wagen inruilen?', 'Ja. Vul het verkoopformulier in met de gegevens en foto’s van uw wagen. We bekijken uw aanvraag en nemen contact met u op.'],
      ['Kan ik een proefrit maken?', 'Natuurlijk. Mail ons welke wagen u wilt zien en wanneer het u past. We spreken samen een moment af.'],
      ['Krijg ik een Car-Pass?', 'Ja. In België hoort bij elke tweedehandswagen een Car-Pass met de geregistreerde kilometerstand. U krijgt hem bij de verkoop.'],
      ['Wat als een wagen al verkocht is?', 'Verkochte wagens markeren we meteen. Zoekt u iets gelijkaardigs? Geef uw zoekopdracht door.'],
    ]},
    sell: {steps: [['01', 'Gegevens & foto’s'], ['02', 'Persoonlijke beoordeling'], ['03', 'Voorstel & overname']]},
    contact: {eyebrow: 'Contact', title: 'Vragen over een wagen?', note: 'Mail ons. U krijgt een persoonlijk antwoord.'},
    footer: {tagline: 'Tweedehandswagens met een eerlijk verhaal.', explore: 'Ontdek', company: 'Bedrijf', languages: 'Taal', rights: 'Alle rechten voorbehouden'},
    about: {
      eyebrow: 'Over ons', lines: ['Een autobedrijf', 'zoals het hoort.'],
      intro: 'HP-Automotive is de autotak van HP-Company. We kopen en verkopen tweedehandswagens in België — met een duidelijke prijs, alle papieren erbij en één vast aanspreekpunt.',
      storyEyebrow: 'Onze aanpak', storyTitle: 'Waarom we het zo doen.',
      story: [
        'Een tweedehandswagen kopen voelt voor veel mensen als een gok. Wat is er echt mee gebeurd? Klopt de kilometerstand? Is de prijs eerlijk? Op die vragen willen we antwoorden vóór u ze moet stellen.',
        'Daarom staat in elke advertentie wat we weten: onderhoud, vorige eigenaars, Car-Pass — en ook de minpunten. Wat we niet weten, vermelden we gewoon als ‘niet opgegeven’. Zo weet u waar u aan toe bent.',
        'Wilt u uw eigen wagen verkopen of inruilen? Stuur ons de gegevens en enkele foto’s. We bekijken alles persoonlijk en laten u weten wat we kunnen doen, zonder verplichting.',
      ],
      valuesEyebrow: 'Wat u van ons mag verwachten',
      values: [['Alles op papier', 'Car-Pass, onderhoud en gebreken staan in de advertentie, niet in de kleine lettertjes.'], ['Eén aanspreekpunt', 'Van de eerste vraag tot de sleuteloverdracht spreekt u met dezelfde persoon.'], ['Geen druk', 'U beslist in uw eigen tempo. Een bezichtiging verplicht u tot niets.']],
      facts: [['Car-Pass', 'bij elke wagen'], ['3 talen', 'Nederlands, Frans, Engels'], ['1', 'vast aanspreekpunt']],
      processEyebrow: 'Kopen bij ons', processTitle: 'Van advertentie tot sleutel.',
      groupEyebrow: 'HP-Company', groupTitle: 'Onderdeel van HP-Company.', groupNote: 'HP-Automotive valt onder HP-Company (BE 1039.979.065), een Belgisch bedrijf.',
      cta: 'Bekijk ons aanbod', mail: 'Mail ons',
    },
    sellPage: {eyebrow: 'Verkopen of inruilen', lines: ['Verkoop uw wagen', 'zonder gedoe.'], intro: 'Geen advertenties, geen onbekenden aan de deur. Vul de gegevens in, voeg foto’s toe en we nemen persoonlijk contact op.', badges: ['Gratis', 'Vrijblijvend', 'Privé behandeld']},
    detail: {home: 'Aanbod', tradeTitle: 'Uw huidige wagen inruilen?', tradeCta: 'Bied uw wagen aan', more: 'Meer details', trust: ['Car-Pass bij de verkoop', 'Inruil mogelijk', 'Bezichtiging en proefrit op afspraak']},
  },
  fr: {
    nav: {cars: 'Nos voitures', about: 'À propos', contact: 'Contact', sell: 'Vendre votre voiture', menu: 'Menu', close: 'Fermer', home: 'Accueil', theme: 'Basculer entre clair et sombre'},
    gate: {question: 'Comment pouvons-nous vous aider ?', buyEyebrow: '01 — Acheter', buy: 'Acheter une voiture', buyNote: 'Voir notre offre', sellEyebrow: '02 — Vendre', sell: 'Vendre votre voiture', sellNote: 'Recevoir une proposition', hint: 'Choisissez votre direction', language: 'Langue'},
    hero: {
      eyebrow: 'Voitures d’occasion · Belgique', lines: ['De bonnes voitures.', 'Au juste prix.'],
      intro: 'Chaque voiture avec Car-Pass et un historique clair. Acheter, faire reprendre ou vendre — avec un seul interlocuteur.',
      searchTitle: 'Trouvez votre voiture', brand: 'Marque', allBrands: 'Toutes les marques', budget: 'Budget', anyBudget: 'Sans limite', upTo: 'Jusqu’à', fuel: 'Carburant', anyFuel: 'Tous',
      show: n => n === 1 ? 'Voir 1 voiture' : `Voir ${n} voitures`, search: 'Rechercher', sellCta: 'Combien vaut ma voiture ?', newIn: 'Nouvel arrivage', view: 'Voir',
      notes: ['Car-Pass', 'Historique d’entretien', 'Reprise possible', 'Essai sur rendez-vous'],
    },
    usps: [['Car-Pass pour chaque voiture', 'Le kilométrage, noir sur blanc.'], ['Reprise possible', 'Votre voiture actuelle compte dans l’affaire.'], ['Essai sur rendez-vous', 'Venez voir et rouler quand cela vous convient.'], ['NL · FR · EN', 'Nous vous aidons dans votre langue.']],
    inventory: {
      eyebrow: 'Offre', title: 'Nos voitures', count: n => n === 1 ? '1 voiture' : `${n} voitures`,
      sort: 'Trier', sorts: {new: 'Plus récentes', priceAsc: 'Prix croissant', priceDesc: 'Prix décroissant', km: 'Kilométrage le plus bas'}, reset: 'Effacer les filtres',
      noneTitle: 'Aucune voiture ne correspond à ces filtres.', noneNote: 'Transmettez-nous votre recherche. Nous vous prévenons dès qu’une voiture arrive.',
      emptyTitle: 'De nouvelles voitures arrivent bientôt en ligne.', emptyNote: 'Vous cherchez quelque chose de précis ? Dites-le-nous, nous vous tiendrons au courant.',
      request: 'Transmettre ma recherche', requestSubject: 'Recherche', view: 'Voir',
      sellTitle: 'Vendre votre voiture ?', sellNote: 'Recevez une proposition, sans engagement.', sellCta: 'Commencer',
    },
    gallery: {eyebrow: 'En images', lines: ['Chaque angle.', 'Chaque détail.'], note: 'Voyez exactement ce que vous achetez — en photo et en vidéo.', open: 'Voir la voiture'},
    steps: {eyebrow: 'Comment ça marche', title: 'Trois étapes avant de prendre le volant.', items: [['Choisissez votre voiture', 'Photos, vidéo et toutes les données sont en ligne.'], ['Posez vos questions', 'Écrivez-nous. Vous recevez une réponse personnelle.'], ['Visitez et essayez', 'Planifiez une visite et un essai. Tout est en ordre ? Nous réglons le reste.']]},
    valuation: {eyebrow: 'Vendre ou faire reprendre', title: 'Combien vaut votre voiture ?', note: 'Indiquez trois données, puis complétez votre demande avec des photos. Nous examinons tout personnellement.', brand: 'Marque', model: 'Modèle', km: 'Kilométrage', brandPh: 'ex. Volkswagen', modelPh: 'ex. Golf', kmPh: 'ex. 85000', cta: 'Continuer', points: ['Gratuit et sans engagement', 'Évaluation personnelle', 'Vos données restent privées']},
    faq: {eyebrow: 'Questions fréquentes', title: 'Bon à savoir.', items: [
      ['Puis-je faire reprendre ma voiture actuelle ?', 'Oui. Remplissez le formulaire de vente avec les données et les photos de votre voiture. Nous examinons votre demande et vous recontactons.'],
      ['Puis-je faire un essai ?', 'Bien sûr. Dites-nous quelle voiture vous intéresse et quand vous êtes disponible. Nous fixons un moment ensemble.'],
      ['Vais-je recevoir un Car-Pass ?', 'Oui. En Belgique, chaque voiture d’occasion est vendue avec un Car-Pass reprenant le kilométrage enregistré. Vous le recevez à l’achat.'],
      ['Et si une voiture est déjà vendue ?', 'Nous indiquons immédiatement les voitures vendues. Vous cherchez un modèle similaire ? Transmettez-nous votre recherche.'],
    ]},
    sell: {steps: [['01', 'Données & photos'], ['02', 'Évaluation personnelle'], ['03', 'Proposition & reprise']]},
    contact: {eyebrow: 'Contact', title: 'Une question sur une voiture ?', note: 'Écrivez-nous. Vous recevez une réponse personnelle.'},
    footer: {tagline: 'Des voitures d’occasion avec une histoire claire.', explore: 'Découvrir', company: 'Entreprise', languages: 'Langue', rights: 'Tous droits réservés'},
    about: {
      eyebrow: 'À propos', lines: ['Un garage', 'comme il se doit.'],
      intro: 'HP-Automotive est la branche automobile de HP-Company. Nous achetons et vendons des voitures d’occasion en Belgique — avec un prix clair, tous les documents et un seul interlocuteur.',
      storyEyebrow: 'Notre approche', storyTitle: 'Pourquoi nous travaillons ainsi.',
      story: [
        'Pour beaucoup, acheter une voiture d’occasion ressemble à un pari. Que lui est-il vraiment arrivé ? Le kilométrage est-il correct ? Le prix est-il honnête ? Nous voulons répondre à ces questions avant que vous deviez les poser.',
        'C’est pourquoi chaque annonce reprend ce que nous savons : entretien, propriétaires précédents, Car-Pass — et aussi les défauts. Ce que nous ne savons pas est simplement indiqué « non renseigné ». Vous savez à quoi vous en tenir.',
        'Vous voulez vendre ou faire reprendre votre voiture ? Envoyez-nous ses données et quelques photos. Nous examinons tout personnellement et vous disons ce que nous pouvons faire, sans engagement.',
      ],
      valuesEyebrow: 'Ce que vous pouvez attendre de nous',
      values: [['Tout par écrit', 'Car-Pass, entretien et défauts figurent dans l’annonce, pas en petits caractères.'], ['Un seul interlocuteur', 'De la première question à la remise des clés, vous parlez à la même personne.'], ['Aucune pression', 'Vous décidez à votre rythme. Une visite ne vous engage à rien.']],
      facts: [['Car-Pass', 'pour chaque voiture'], ['3 langues', 'néerlandais, français, anglais'], ['1', 'seul interlocuteur']],
      processEyebrow: 'Acheter chez nous', processTitle: 'De l’annonce aux clés.',
      groupEyebrow: 'HP-Company', groupTitle: 'Une entreprise HP-Company.', groupNote: 'HP-Automotive fait partie de HP-Company (BE 1039.979.065), une entreprise belge.',
      cta: 'Voir nos voitures', mail: 'Nous écrire',
    },
    sellPage: {eyebrow: 'Vendre ou faire reprendre', lines: ['Vendez votre voiture', 'sans tracas.'], intro: 'Pas d’annonces, pas d’inconnus à votre porte. Complétez les données, ajoutez des photos et nous vous recontactons personnellement.', badges: ['Gratuit', 'Sans engagement', 'Traité en toute confidentialité']},
    detail: {home: 'Nos voitures', tradeTitle: 'Faire reprendre votre voiture ?', tradeCta: 'Proposer votre voiture', more: 'Plus de détails', trust: ['Car-Pass remis à la vente', 'Reprise possible', 'Visite et essai sur rendez-vous']},
  },
  en: {
    nav: {cars: 'Cars', about: 'About', contact: 'Contact', sell: 'Sell your car', menu: 'Menu', close: 'Close', home: 'Home', theme: 'Switch between light and dark'},
    gate: {question: 'How can we help you?', buyEyebrow: '01 — Buy', buy: 'Buy a car', buyNote: 'See our stock', sellEyebrow: '02 — Sell', sell: 'Sell your car', sellNote: 'Get an offer', hint: 'Choose your direction', language: 'Language'},
    hero: {
      eyebrow: 'Used cars · Belgium', lines: ['Good cars.', 'Fairly priced.'],
      intro: 'Every car comes with a Car-Pass and a clear history. Buy, trade in or sell — with one point of contact.',
      searchTitle: 'Find your car', brand: 'Make', allBrands: 'All makes', budget: 'Budget', anyBudget: 'No limit', upTo: 'Up to', fuel: 'Fuel', anyFuel: 'All',
      show: n => n === 1 ? 'Show 1 car' : `Show ${n} cars`, search: 'Search', sellCta: 'What is my car worth?', newIn: 'Just arrived', view: 'View',
      notes: ['Car-Pass', 'Service history', 'Trade-in welcome', 'Test drive by appointment'],
    },
    usps: [['Car-Pass with every car', 'The mileage, in black and white.'], ['Trade-in welcome', 'Your current car counts towards the deal.'], ['Test drives by appointment', 'Come and see it, and drive it, when it suits you.'], ['NL · FR · EN', 'We help you in your own language.']],
    inventory: {
      eyebrow: 'Stock', title: 'Our cars', count: n => n === 1 ? '1 car' : `${n} cars`,
      sort: 'Sort', sorts: {new: 'Newest first', priceAsc: 'Price: low to high', priceDesc: 'Price: high to low', km: 'Lowest mileage'}, reset: 'Clear filters',
      noneTitle: 'No cars match these filters.', noneNote: 'Send us your search. We will let you know when something comes in.',
      emptyTitle: 'New cars are coming online soon.', emptyNote: 'Looking for something specific? Tell us and we will keep you posted.',
      request: 'Send my search', requestSubject: 'Car search', view: 'View',
      sellTitle: 'Selling your car?', sellNote: 'Get an offer, with no obligation.', sellCta: 'Start here',
    },
    gallery: {eyebrow: 'In focus', lines: ['Every angle.', 'Every detail.'], note: 'See exactly what you buy — in photos and video.', open: 'View the car'},
    steps: {eyebrow: 'How it works', title: 'Three steps to the driver’s seat.', items: [['Choose your car', 'Photos, video and every detail are online.'], ['Ask your questions', 'Email us. You get a personal reply.'], ['View and drive', 'Book a viewing and a test drive. Happy? We take care of the rest.']]},
    valuation: {eyebrow: 'Sell or trade in', title: 'What is your car worth?', note: 'Enter three details, then complete your request with photos. We review everything personally.', brand: 'Make', model: 'Model', km: 'Mileage', brandPh: 'e.g. Volkswagen', modelPh: 'e.g. Golf', kmPh: 'e.g. 85000', cta: 'Continue', points: ['Free, no obligation', 'Personal assessment', 'Your details stay private']},
    faq: {eyebrow: 'FAQ', title: 'Good to know.', items: [
      ['Can I trade in my current car?', 'Yes. Fill in the sell form with your car’s details and photos. We review your request and get back to you.'],
      ['Can I take a test drive?', 'Of course. Tell us which car you would like to see and when suits you. We will set a time together.'],
      ['Do I get a Car-Pass?', 'Yes. In Belgium every used car is sold with a Car-Pass showing its registered mileage. You receive it when you buy.'],
      ['What if a car is already sold?', 'Sold cars are marked straight away. Looking for something similar? Send us your search.'],
    ]},
    sell: {steps: [['01', 'Details & photos'], ['02', 'Personal review'], ['03', 'Offer & handover']]},
    contact: {eyebrow: 'Contact', title: 'Questions about a car?', note: 'Email us. You get a personal reply.'},
    footer: {tagline: 'Used cars with a clear story.', explore: 'Explore', company: 'Company', languages: 'Language', rights: 'All rights reserved'},
    about: {
      eyebrow: 'About us', lines: ['A car dealer', 'done properly.'],
      intro: 'HP-Automotive is the automotive arm of HP-Company. We buy and sell used cars in Belgium — with a clear price, all the paperwork and one point of contact.',
      storyEyebrow: 'Our approach', storyTitle: 'Why we work this way.',
      story: [
        'For many people, buying a used car feels like a gamble. What really happened to it? Is the mileage right? Is the price fair? We want to answer those questions before you have to ask them.',
        'That is why every listing shows what we know: service history, previous owners, Car-Pass — and the flaws too. Anything we do not know is simply marked “not provided”. You know where you stand.',
        'Want to sell or trade in your car? Send us its details and a few photos. We look at everything personally and tell you what we can do, with no obligation.',
      ],
      valuesEyebrow: 'What you can expect from us',
      values: [['Everything in writing', 'Car-Pass, service history and defects are in the listing, not in the small print.'], ['One point of contact', 'From the first question to handing over the keys, you deal with the same person.'], ['No pressure', 'You decide at your own pace. A viewing commits you to nothing.']],
      facts: [['Car-Pass', 'with every car'], ['3 languages', 'Dutch, French, English'], ['1', 'point of contact']],
      processEyebrow: 'Buying from us', processTitle: 'From listing to keys.',
      groupEyebrow: 'HP-Company', groupTitle: 'Part of HP-Company.', groupNote: 'HP-Automotive is part of HP-Company (BE 1039.979.065), a Belgian company.',
      cta: 'View our cars', mail: 'Email us',
    },
    sellPage: {eyebrow: 'Sell or trade in', lines: ['Sell your car', 'without the hassle.'], intro: 'No listings, no strangers at your door. Fill in the details, add photos and we will contact you personally.', badges: ['Free', 'No obligation', 'Handled privately']},
    detail: {home: 'Cars', tradeTitle: 'Trade in your current car?', tradeCta: 'Offer your car', more: 'More details', trust: ['Car-Pass handed over at sale', 'Trade-in welcome', 'Viewing and test drive by appointment']},
  },
};
