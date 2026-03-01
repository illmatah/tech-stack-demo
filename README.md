# Tech-stack demo

## Telepítés és futtatás

A projekt futtatásához és fejlesztéséhez szükséges minél frissebb [Node.js](https://nodejs.org/en/download), illetve [pnpm](https://pnpm.io/installation) telepítése.
Teljesen helyi futtatáshoz a következőket kell tenni:

1. A `cd packages/demo-worker && pnpm dev` parancsokkal elindítani a backendet, ha rákérdez, alkalmazza-e a migration-öket, akkor okézzuk le.
2. Egy új terminálban a `cd packages/demo-frontend && pnpm dev` parancsokkal elindítani a frontendet, ezután a `http://localhost:4321` címen elérhető lesz az oldal.

## Backend

A backendet igyekeztem úgy összerakni, hogy minél kevésbé függjön a Cloudflare platformjától.

Ha más platformon akarnánk hostolni, nem lenne ugyan egy kattintás, de minimális munkával megoldható, hiszen az egyes route-ok platformfüggetlenek, lényegében csak a [worker entrypointjában](./src/backend/worker.ts) szereplő függvényeket kell másik platform megfelelőjére cserélni.

### [Trpc](https://trpc.io/)

Ezt a könyvtárat én is most használtam először, megtetszett, hogy praktikusan klienst is biztosít, és nagyon rámegy a type safetyre. Nem biztos, hogy minden funkcióját a best practice patternek szerint használom, és teljesen biztos, hogy rengeteg dolgot tud, amit a projekt nem használ.

### [Betterauth](https://www.better-auth.com/)

Egy elég jó autentikációs könyvtár, támogat 2FA-t, SSO-t, és egészen addig, amíg az ember pont úgy használja, ahogy azt a fejlesztők gondolják (például a beépített klienssel hívja csak meg), nagyon egyszerűen kezelhető.

### [Cloudflare Workers](https://developers.cloudflare.com/workers/)

A Workers a Cloudflare serverless megoldása.

### [Cloudflare D1](https://developers.cloudflare.com/d1/)

SQLite alapú, Cloudflare által kínált adatbázis megoldás, ami a Workerhez köthető, ott belső kapcsolatként gyors és biztonságos adatbáziselérést biztosít.

## Frontend

A frontendet némi felügyelettel, de szinte teljes egészében AI írta, én nem pont így struktúrálnám, ha nulláról építenék egy production oldalt.

### [Astro](https://astro.build/)

Az Astro egy feltörőben lévő frontend framework, ami önmagában is elég jól működik (pl. SSR, api), de rengeteg integráció is elérhető hozzá, így például React vagy Vue komponenseket is tudunk használni vele egyazon projektben.

### [Vue](https://vuejs.org/)

Egy elég népszerű framework, én személyszerint jobban szeretem, mint a Reactot, mert szerintem egyszerűbben megvalósítható benne az adatkötés, a komponensek közti kommunikáció, és kevesebb nehezen érthető megkötést ró a felhasználóra, mint a React.

### [React](https://react.dev/)
Talán a legnépszerűbb frontend framework, számtalan könyvtárral, és online tutoriallal. Nulláról építve szerintem körülményesebb használni, de online erőforrásokkal nagyon gyorsan felhúzható vele egy oldal.

## Egyéb

### [pnpm](https://pnpm.io/)

A pnpm egy npm alternatíva, gyorsabb, és jobban optimalizálja a telepített csomagokat, így kevesebb tárhelyet foglalnak. A monorepo jellegű projektekben különösen hasznos, mert megosztja a csomagokat a projektek között, így nem kell minden projektnek külön-külön telepítenie ugyanazokat a csomagokat. Néha összeakadnak a dolgok, ilyenkor érdemes törölni a node_modules könyvtárat, de általánosságban jól működik.

### eslint és tsconfig

Az eslint egy statikus kódelemző eszköz, ami segít a kód minőségének fenntartásában, és a hibák mihamarabbi megtalálásában. A projektben mind az eslint, mind pedig a tsconfig azokkal a szabályokkal operál, amiket én már régóta használok, de valószínűleg egy kicsit szigorúbb, mint amire feltétlenül szükség lenne.