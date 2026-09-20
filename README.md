# Přehled nájemců a obsazenosti

Aplikace v prohlížeči pro evidenci nájemců, přiřazení místností a parkování a souhrny nájemného.

**Stav:** Lokální prototyp s úložištěm prohlížeče; sdílený server ani produkční řízení přístupu nejsou doložené.

## Co projekt obsahuje

- Přidávání, úpravy a odstraňování nájemců pomocí formulářů.
- Výpočty obsazené plochy, parkování a nájemného.
- Export nájemců a obsazenosti do CSV.
- Ukládání záznamů do localStorage.

## Technologie

React, TypeScript, Vite.

## Architektura a struktura

- `App.tsx` — stav aplikace, výpočty, přehledy a exporty
- `components/TenantModal.tsx` — editor záznamu
- `types.ts` — datové typy
- `constants.ts` — výchozí údaje místností, parkování a nájemců

## Lokální vývoj

Potřebujete Node.js a npm. V kořenové složce repozitáře spusťte:

```sh
npm install
npm run dev
```

Příkaz pro sestavení uvedený v projektu: `npm run build`.

Jde o příkazy deklarované v repozitáři, nikoli o potvrzení úspěšného sestavení. Instalace závislostí, sestavení ani napojení na živé služby nebyly při úpravě dokumentace spuštěny.

## Konfigurace a omezení

Data se ukládají do prohlížeče, nikoli do sdílené databáze. Původní výchozí údaje zde nejsou reprodukovány; před veřejnou ukázkou je nahraďte fiktivními. Před prací s reálnými záznamy ověřte inicializaci úložiště, zálohování a exporty.

## Přínos pro portfolio

Ukazuje praktickou administrativní automatizaci, datové modelování a export přehledů.

## Co doplnit do dokumentace

Snímky obrazovky s fiktivními daty, opakovatelný postup ověření a přehled skutečně otestovaných integrací. Přihlašovací údaje a konfigurace konkrétního nasazení patří mimo Git.
