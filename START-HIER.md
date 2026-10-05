# HP-Automotive — vernieuwde showroom

## Openen op uw Mac
Dit is een serverapp met beveiligd beheer en echte uploads. `index.html` dubbelklikken kan deze functies niet draaien.

Open de uitgepakte map in VS Code, open Terminal en voer één opdracht per keer uit:

```sh
npm install
npm run setup:local
npm run dev
```

Open daarna **http://127.0.0.1:5173**. Houd de terminal open. Stop met Ctrl+C.
`setup:local` bouwt de app en past de lokale databankmigraties toe. Dit voorkomt de fout `no such table: cars`. Migrations worden maar één keer toegepast. Hebt u zelf de oude migratie al met `d1 execute` uitgevoerd maar zonder migration tracking? Gebruik een nieuwe lokale ontwikkelmap of maak eerst een back-up van uw lokale .wrangler-map; de setup wist geen bestaande databank.

## Beheer op uw laptop
De lokale testomgeving gebruikt het fictieve account `seedy@sites.test`. Zet lokaal een bestand `.dev.vars` in de projectmap met:

```text
ADMIN_EMAILS=seedy@sites.test
```

Dit is uitsluitend een ontwikkelaccount. Voor publicatie stelt u `ADMIN_EMAILS` in op de server met de echte toegelaten accounts. Er staat geen testaccount of API-sleutel in het gepubliceerde bronproject.

Beheer: `/beheer`. Verkoopaanvragen: `/beheer/aanvragen`.

## Wat is nieuw?
- Twee duidelijke routes: kopen en verkopen; publieke pagina’s in NL, FR en EN via `?lang=`.
- Vierkante wagenfoto’s, galerij met video en uitgebreide voertuiggegevens.
- Geen zoekbalk. Nieuwe publicaties verschijnen automatisch in de collectie.
- Privé verkoopformulier met echte uploads en referentienummer.
- Beveiligde beheerinbox voor aangeboden wagens.
- Handmatige advertentievertalingen en Claude-voorstellen per taal.

Er zit één duidelijk gemarkeerde BMW-demonstratie in deze bronbestanden. De echte drie wagens moeten via het beheer worden toegevoegd; daarvoor zijn uw eigen foto’s en juiste gegevens nodig. We tonen geen verzonnen voorraad als werkelijk aanbod.

## Claude
De AI-knop is geïntegreerd. Voor gebruik moet `ANTHROPIC_API_KEY` als servergeheim ingesteld zijn; dat gebeurt nooit in de browser. Zonder sleutel krijgt u een duidelijke melding en kunt u handmatig schrijven. Zie BEHEER.md.

## Cloudflare
Gebruik Cloudflare Workers met D1 en R2, geen statische Pages-upload. Het project behoudt de Vinext-serverarchitectuur van uw oorspronkelijke ZIP. De serverconfiguratie wordt na de build in `dist/server/wrangler.json` geschreven. Gebruik uw eigen bestaande Worker/domein, databank en bucket; gebruik de ontwikkel-dummy-ID niet voor productie. De ingebouwde ChatGPT-aanmelding is beschikbaar op Sites. Voor een eigen Cloudflare-domein moet een echte serverauthenticatie (bijv. Cloudflare Access met gecontroleerde JWT’s) worden gekoppeld; vertrouw daar nooit zelf ingestuurde identiteitheaders. De app weigert beheer zonder geverifieerde identiteit.

## Vernieuwing — premium donkere showroom
- **Startscherm met keuze:** bij een eerste bezoek kiest de bezoeker links *Een wagen kopen* of rechts *Uw wagen verkopen* (met NL/FR/EN). Scrollen kan pas na de keuze; de keuze wordt per browsersessie onthouden.
- **Hero (GSAP):** de wagenfoto start schermvullend en schaalt naar zijn kader; daarna verschijnen titel en specificaties één voor één (kilometerstand en vermogen tellen op).
- **Galerij met parallax (GSAP ScrollTrigger)**, kaartanimaties en menu’s met Framer Motion, styling met Tailwind CSS + `app/hp.css`.
- **Geen embleem meer:** het merk staat als tekst *HP-AUTOMOTIVE*. Contact overal via **automotive@hp-company.be**.
- **Aparte pagina Over ons:** `/over-ons`. De startpagina blijft gericht op het aanbod en verkopen.
- Beheer (`/beheer`) en het verkoopformulier werken zoals voorheen; alleen de publieke vormgeving is vernieuwd.
- Wie liever minder beweging wil (systeeminstelling *beperkte beweging*), ziet alles meteen zonder animaties.

## Update — meer autoverkoop, licht/donker thema
- **Licht/donker-knop** in de menubalk (zon/maan). De keuze wordt onthouden.
- **Geen BMW M3 meer op de site.** De hero en het keuzescherm gebruiken een eigen lijntekening van een wagen. De oude M3-voorbeeldadvertentie is verborgen voor bezoekers; u kunt hem in `/beheer` archiveren.
- **Zoeken en filteren:** zoekvak in de hero en een filterbalk boven het aanbod (merk, budget, brandstof, sorteren). Een zoekopdracht is te delen als link. Zonder resultaat kan de bezoeker zijn zoekopdracht mailen.
- **"Nieuw binnen":** de nieuwste gepubliceerde wagen met foto verschijnt automatisch in de hero.
- **Wat is uw wagen waard?** Kort formulier op de startpagina; merk, model en kilometerstand gaan mee naar het verkoopformulier.
- **Veelgestelde vragen**, stappenplan en nieuwe teksten voor Over ons (NL/FR/EN).
- Controleer of de beloftes kloppen met hoe u werkt (proefrit op afspraak, inruil, Car-Pass). Pas ze anders aan in `lib/ui.ts`.

Bijwerken zonder opnieuw te installeren: pak de update-zip uit over uw projectmap en voer `npm run deploy` uit.
