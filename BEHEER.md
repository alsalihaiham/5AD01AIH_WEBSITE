# HP-Company Auto

Klanten: `/` en `/wagens/[slug]`. Beheer: `/beheer` (bewust niet in het openbare menu).

## Werkwijze
1. Meld u bij `/beheer` aan via ChatGPT met een toegelaten e-mailadres.
2. Kies Wagen toevoegen. Vul de gegevens in en bewaar als concept.
3. Voeg foto’s en video’s toe. JPG/PNG/WebP maximaal 12 MB per foto; MP4/WebM maximaal 50 MB per video; maximaal 24 beelden. Uploads worden direct opgeslagen. Verschuif foto’s met Eerder/Later; de eerste foto wordt de omslag.
4. Schrijf uw beschrijving en uitrusting. Bewaar wijzigingen. Controleer de volledige advertentie via Voorbeeld bekijken.
5. Publiceer. Kopieer de advertentietekst met de link voor externe advertentieplatformen.
6. Kies Verkocht of Concept en sla op om de status te wijzigen. Archiveren verbergt de advertentie; de database bewaart de gegevens. Herstel uit archief vereist momenteel een beheerder van de database.

## Beveiliging en configuratie
- Alle schrijf-, upload- en AI-routes controleren server-side de geverifieerde ChatGPT-identiteit en `ADMIN_EMAILS`.
- De Sites-toegangsinstelling staat aanvankelijk op privé. Pas na het delen als openbare website kunnen klanten zonder login kijken. De beheeromgeving blijft beschermd door de eigen toegangscontrole.
- `ADMIN_EMAILS`: komma-gescheiden toegelaten e-mailadressen, ingesteld als serversecret. Een gebruiker met een ander adres wordt geweigerd. Niet de domeinnaam maar ieder volledig e-mailadres wordt vergeleken.
- Draft-media worden alleen aan beheerders geleverd. Gepubliceerde media kunnen maximaal 60 seconden gecachet blijven na offline halen.
- `.dev.vars` is uitsluitend lokaal en wordt niet gepubliceerd.

## Claude koppelen
Voeg via de Site-serverinstellingen `ANTHROPIC_API_KEY` toe als geheim. Deel de sleutel nooit in de advertentietekst of browsercode. Optioneel: `ANTHROPIC_MODEL`, standaard `claude-sonnet-4-6`. Publiceer opnieuw om nieuwe serverinstellingen te activeren.
Claude gebruikt de Anthropic Messages API; een ChatGPT- of Claude-chatabonnement is geen API-tegoed. De teksthulp verstuurt alleen de ingevulde voertuiggegevens en tekst. Beelden en klantgegevens worden niet meegestuurd. Maximaal 40 aanvragen per beheerder per dag. Suggesties worden pas overgenomen wanneer u dit kiest; controleer altijd de feiten.

## Demonstratiewagen
De BMW M3 is geen echt aanbod. Alle bedragen en voertuiggegevens zijn voorbeeldwaarden en de markering blijft behouden. De foto’s zijn uit dezelfde video gehaald.
Bron: https://www.pexels.com/video/dynamic-bmw-m3-in-a-parking-lot-30604139/
Maker: CALI_ MEDIA _ — Pexels
Licentie: https://www.pexels.com/license/

## Techniek
Vinext/React met Cloudflare Workers, D1 voor voertuiggegevens en R2 voor uploads. Dit is een werkende serverapp, geen statische HTML-map die via dubbelklik geopend kan worden. Het bestaande HP-Company-hoofdproject is niet gewijzigd.

## Vernieuwing oktober — HP-Automotive
De openbare navigatie bevat kopen en verkopen en een taalkeuze NL/FR/EN. Geen zoekbalk. Administratie blijft alleen via `/beheer` bereikbaar, zonder publiek menulinkje. Namen van routes blijven Nederlands, de interface wisselt via `?lang=nl|fr|en`.

Nieuwe voertuigvelden: eerste inschrijving, CO₂ en meetmethode (WLTP/NEDC), Euro-norm, deuren, zitplaatsen, vorige eigenaars, cilinderinhoud, verbruik, batterijcapaciteit, elektrisch rijbereik, onderhoud, schade, keuring en Car-Pass. Onbekende waarden verschijnen als niet opgegeven; niets wordt afgeleid of beloofd zonder invoer.

Franse en Engelse titel/ondertitel/beschrijving beheert u onder Presentatie. Kies de taal voor een Claude-voorstel en controleer het voordat u overneemt. Een ontbrekende vertaling valt terug op de oorspronkelijke tekst met een melding op de detailpagina. Vaste voertuiglabels en standaardopties zijn vertaald; vrije tekst moet u zelf vertalen of via Claude laten voorstellen.

### Verkoopaanvragen
Klanten bieden hun wagen aan via `/verkopen`; dit maakt geen publieke advertentie. Invullen, foto’s/video’s selecteren en contactgegevens toevoegen, dan versturen. Eén foto is verplicht. Maximaal 20 foto’s (12 MB elk), 2 video’s (50 MB elk), samen 120 MB. JPG/PNG/WebP/MP4/WebM; HEIC/MOV eerst exporteren naar JPG/MP4. De token voor het uploaden blijft uitsluitend in het geheugen van het formulier en verloopt; herladen vereist opnieuw beginnen. Bij een fout blijven de gegevens op het scherm en worden al geslaagde uploads bij opnieuw proberen overgeslagen.

Bekijk aanvragen via `/beheer/aanvragen`, open de beelden, antwoord per e-mail en zet de status op Nieuw, Gecontacteerd of Afgesloten. Verwijderen wist de gegevens en bestanden na een bevestiging. Er worden geen automatische e-mails verstuurd. De eigenaar bewaakt de inbox.

De server beschermt inzendingen en bestanden met toegangscontrole; alleen het team ziet ze. Uploads worden gecontroleerd op formaat en grootte, quota gelden ook bij gelijktijdige uploads. Aanvragen krijgen tijdelijke, gehashte uploadtoegang. De server begrenst misbruik per gehashte netwerkidentiteit. Niet-afgewerkte aanvragen verlopen na 24 uur; verstuurde na 180 dagen. Verlopen gegevens zijn ontoegankelijk en worden bij nieuwe inzendingen opgeruimd.

### Gebruikte inspiratie
AutoScout24: https://www.autoscout24.be/nl/auto-verkopen/adverteren/
Autohero: https://www.autohero.com/nl-be/auto-verkopen/
CarMax: https://www.carmax.com/cars/ford/mustang
De structuur is eigen werk; geen teksten, merksymbolen of voertuigfoto’s van deze sites gekopieerd.

De bestaande BMW-foto’s en video blijven duidelijk gemarkeerde stockdemonstratie. Het logo is het in deze sessie ontworpen HP-Automotive-embleem. Publiceer uw eigen werkelijke wagens via het beheer.
