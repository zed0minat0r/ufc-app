// UFC Fight Predictor — main.js

// ─── STATIC DATA ───────────────────────────────────────────────────────────

const FIGHTERS = {
  "jon-jones": {
    id: "jon-jones", name: "Jon Jones", nickname: "Bones",
    record: "27-1-0", weight: "Heavyweight", rank: "Champion",
    initials: "JJ", image: './fighters/jon-jones.png',
    stats: { slpm: 4.3, strAcc: 57, tdAvg: 1.9, subAvg: 0.4, koPct: 42, subPct: 22, decPct: 36 },
    style: "Wrestling/Striking", reach: 84.5, stance: "Orthodox"
  },
  "stipe-miocic": {
    id: "stipe-miocic", name: "Stipe Miocic", nickname: "Stone Cold",
    record: "22-4-0", weight: "Heavyweight", rank: "Retired",
    initials: "SM", image: './fighters/stipe-miocic.png',
    stats: { slpm: 4.5, strAcc: 52, tdAvg: 1.8, subAvg: 0.2, koPct: 59, subPct: 5, decPct: 36 },
    style: "Boxing/Wrestling", reach: 80, stance: "Orthodox"
  },
  "tom-aspinall": {
    id: "tom-aspinall", name: "Tom Aspinall", nickname: "The Future",
    record: "15-3-0", weight: "Heavyweight", rank: "Champion",
    initials: "TA", image: './fighters/tom-aspinall.png',
    stats: { slpm: 5.8, strAcc: 60, tdAvg: 2.1, subAvg: 1.2, koPct: 47, subPct: 27, decPct: 26 },
    style: "Grappling/MMA", reach: 78, stance: "Orthodox"
  },
  "islam-makhachev": {
    id: "islam-makhachev", name: "Islam Makhachev", nickname: "",
    record: "26-1-0", weight: "Lightweight", rank: "Champion",
    initials: "IM", image: './fighters/islam-makhachev.png',
    stats: { slpm: 3.6, strAcc: 53, tdAvg: 4.4, subAvg: 1.5, koPct: 12, subPct: 42, decPct: 46 },
    style: "Sambo/Grappling", reach: 70.5, stance: "Orthodox"
  },
  "dustin-poirier": {
    id: "dustin-poirier", name: "Dustin Poirier", nickname: "The Diamond",
    record: "30-9-0", weight: "Lightweight", rank: "#2",
    initials: "DP", image: './fighters/dustin-poirier.png',
    stats: { slpm: 5.9, strAcc: 49, tdAvg: 1.9, subAvg: 1.1, koPct: 53, subPct: 20, decPct: 27 },
    style: "Boxing/BJJ", reach: 72, stance: "Southpaw"
  },
  "arman-tsarukyan": {
    id: "arman-tsarukyan", name: "Arman Tsarukyan", nickname: "Ahalkalakets",
    record: "22-3-0", weight: "Lightweight", rank: "#1",
    initials: "AT", image: './fighters/arman-tsarukyan.png',
    stats: { slpm: 5.1, strAcc: 48, tdAvg: 3.8, subAvg: 0.8, koPct: 27, subPct: 23, decPct: 50 },
    style: "Wrestling/Striking", reach: 70, stance: "Southpaw"
  },
  "alex-pereira": {
    id: "alex-pereira", name: "Alex Pereira", nickname: "Poatan",
    record: "11-2-0", weight: "Light Heavyweight", rank: "Champion",
    initials: "AP", image: './fighters/alex-pereira.png',
    stats: { slpm: 5.2, strAcc: 54, tdAvg: 0.3, subAvg: 0.0, koPct: 73, subPct: 0, decPct: 27 },
    style: "Kickboxing", reach: 79, stance: "Orthodox"
  },
  "magomed-ankalaev": {
    id: "magomed-ankalaev", name: "Magomed Ankalaev", nickname: "Maga",
    record: "18-1-1", weight: "Light Heavyweight", rank: "#1",
    initials: "MA", image: './fighters/magomed-ankalaev.png',
    stats: { slpm: 4.3, strAcc: 55, tdAvg: 2.0, subAvg: 0.5, koPct: 44, subPct: 17, decPct: 39 },
    style: "Kickboxing/Wrestling", reach: 75, stance: "Orthodox"
  },
  "dricus-du-plessis": {
    id: "dricus-du-plessis", name: "Dricus Du Plessis", nickname: "Stillknocks",
    record: "22-3-0", weight: "Middleweight", rank: "#1",
    initials: "DD", image: './fighters/dricus-du-plessis.png',
    stats: { slpm: 4.8, strAcc: 47, tdAvg: 1.4, subAvg: 0.8, koPct: 50, subPct: 23, decPct: 27 },
    style: "Brawler/MMA", reach: 76, stance: "Orthodox"
  },
  "sean-strickland": {
    id: "sean-strickland", name: "Sean Strickland", nickname: "Tarzan",
    record: "28-7-0", weight: "Middleweight", rank: "#3",
    initials: "SS", image: './fighters/sean-strickland.png',
    stats: { slpm: 6.2, strAcc: 46, tdAvg: 0.9, subAvg: 0.4, koPct: 21, subPct: 14, decPct: 65 },
    style: "Boxing/Volume", reach: 76, stance: "Orthodox"
  },
  "max-holloway": {
    id: "max-holloway", name: "Max Holloway", nickname: "Blessed",
    record: "26-7-0", weight: "Featherweight", rank: "#1",
    initials: "MH", image: './fighters/max-holloway.png',
    stats: { slpm: 7.9, strAcc: 46, tdAvg: 0.6, subAvg: 0.3, koPct: 46, subPct: 12, decPct: 42 },
    style: "Boxing/Volume", reach: 69, stance: "Orthodox"
  },
  "ilia-topuria": {
    id: "ilia-topuria", name: "Ilia Topuria", nickname: "El Matador",
    record: "17-0-0", weight: "Featherweight", rank: "Champion",
    initials: "IT", image: './fighters/ilia-topuria.png',
    stats: { slpm: 4.9, strAcc: 55, tdAvg: 2.3, subAvg: 1.1, koPct: 69, subPct: 25, decPct: 6 },
    style: "Grappling/Power", reach: 71, stance: "Orthodox"
  },
  "conor-mcgregor": {
    id: "conor-mcgregor", name: "Conor McGregor", nickname: "The Notorious",
    record: "22-6-0", weight: "Welterweight", rank: "Inactive",
    initials: "CM", image: './fighters/conor-mcgregor.png',
    stats: { slpm: 5.6, strAcc: 49, tdAvg: 0.7, subAvg: 0.2, koPct: 68, subPct: 14, decPct: 18 },
    style: "Boxing/Counter", reach: 74, stance: "Southpaw"
  },
  "belal-muhammad": {
    id: "belal-muhammad", name: "Belal Muhammad", nickname: "Remember the Name",
    record: "24-3-0", weight: "Welterweight", rank: "Champion",
    initials: "BM", image: './fighters/belal-muhammad.png',
    stats: { slpm: 3.7, strAcc: 50, tdAvg: 3.2, subAvg: 0.5, koPct: 13, subPct: 17, decPct: 70 },
    style: "Wrestling/Control", reach: 72, stance: "Orthodox"
  },
  "leon-edwards": {
    id: "leon-edwards", name: "Leon Edwards", nickname: "Rocky",
    record: "22-4-0", weight: "Welterweight", rank: "#1",
    initials: "LE", image: './fighters/leon-edwards.png',
    stats: { slpm: 4.3, strAcc: 51, tdAvg: 1.5, subAvg: 0.2, koPct: 36, subPct: 18, decPct: 46 },
    style: "Kickboxing/Wrestling", reach: 74, stance: "Southpaw"
  }
};

const UPCOMING_EVENTS = [
  {
    id: "ufc-fn-apr4",
    name: "UFC Fight Night: Moicano vs. Duncan",
    type: "fight-night",
    date: "April 4, 2026",
    location: "Meta APEX, Las Vegas, NV",
    fights: [
      { f1: "renato-moicano",     f2: "chris-duncan",           tier: "main",    weight: "Lightweight" },
      { f1: "virna-jandiroba",    f2: "tabatha-ricci",          tier: "co-main", weight: "Women's Strawweight" },
      { f1: "brendson-ribeiro",   f2: "abdul-rakhman-yakhyaev", tier: "main-card", weight: "Light Heavyweight" },
      { f1: "ethyn-ewing",        f2: "rafael-estevam",         tier: "main-card", weight: "Bantamweight" },
      { f1: "lando-vannata",      f2: "darrius-flowers",        tier: "prelim",  weight: "Lightweight" },
      { f1: "kai-kamaka-iii",     f2: "dakota-hope",            tier: "prelim",  weight: "Featherweight" },
      { f1: "melissa-gatto",      f2: "dione-barbosa",          tier: "prelim",  weight: "Women's Strawweight" },
      { f1: "tresean-gore",       f2: "azamat-bekoev",          tier: "prelim",  weight: "Middleweight" }
    ]
  },
  {
    id: "ufc-327",
    name: "UFC 327: Prochazka vs. Ulberg",
    type: "ppv",
    date: "April 11, 2026",
    location: "Kaseya Center, Miami, FL",
    fights: [
      { f1: "jiri-prochazka",     f2: "carlos-ulberg",       tier: "main",      weight: "Light Heavyweight" },
      { f1: "joshua-van",         f2: "tatsuro-taira",       tier: "co-main",   weight: "Flyweight" },
      { f1: "khamzat-chimaev",    f2: "dricus-du-plessis",   tier: "main-card", weight: "Middleweight", title: true },
      { f1: "belal-muhammad",     f2: "leon-edwards",        tier: "main-card", weight: "Welterweight", title: true },
      { f1: "israel-adesanya",    f2: "sean-strickland",     tier: "main-card", weight: "Middleweight" },
      { f1: "paulo-costa",        f2: "azamat-murzakanov",   tier: "prelim",    weight: "Middleweight" },
      { f1: "curtis-blaydes",     f2: "alexander-volkov",    tier: "prelim",    weight: "Heavyweight" }
    ]
  }
];

// Extra fighters for sim (only in FIGHTERS, not main events)
const EXTRA_FIGHTERS = {
  "jack-della-maddalena": {
    id: "jack-della-maddalena", name: "Jack Della Maddalena", nickname: "JDM",
    record: "17-2-0", weight: "Welterweight", rank: "#2",
    initials: "JD", image: './fighters/jack-della-maddalena.png',
    stats: { slpm: 6.1, strAcc: 52, tdAvg: 0.8, subAvg: 0.3, koPct: 64, subPct: 18, decPct: 18 },
    style: "Boxing/Power", reach: 74, stance: "Orthodox"
  },
  "renato-moicano": {
    id: "renato-moicano", name: "Renato Moicano", nickname: "Money",
    record: "20-7-1", weight: "Lightweight", rank: "#10",
    initials: "RM", image: "./fighters/renato-moicano.png",
    stats: { slpm: 4.7, strAcc: 51, tdAvg: 1.6, subAvg: 1.3, koPct: 28, subPct: 44, decPct: 28 },
    style: "BJJ/MMA", reach: 72, stance: "Orthodox"
  },
  "chris-duncan": {
    id: "chris-duncan", name: "Chris Duncan", nickname: "The Highlander",
    record: "10-3-0", weight: "Lightweight", rank: "Unranked",
    initials: "CD", image: './fighters/chris-duncan.png',
    stats: { slpm: 3.9, strAcc: 46, tdAvg: 2.1, subAvg: 0.7, koPct: 30, subPct: 30, decPct: 40 },
    style: "Wrestling/MMA", reach: 74, stance: "Orthodox"
  },
  "virna-jandiroba": {
    id: "virna-jandiroba", name: "Virna Jandiroba", nickname: "Carcará",
    record: "20-3-0", weight: "Women's Strawweight", rank: "#3",
    initials: "VJ", image: './fighters/virna-jandiroba.png',
    stats: { slpm: 3.8, strAcc: 49, tdAvg: 1.2, subAvg: 2.1, koPct: 15, subPct: 55, decPct: 30 },
    style: "BJJ/Grappling", reach: 65, stance: "Orthodox"
  },
  "tabatha-ricci": {
    id: "tabatha-ricci", name: "Tabatha Ricci", nickname: "",
    record: "11-2-0", weight: "Women's Strawweight", rank: "#7",
    initials: "TR", image: './fighters/tabatha-ricci.png',
    stats: { slpm: 4.2, strAcc: 47, tdAvg: 1.8, subAvg: 0.9, koPct: 18, subPct: 36, decPct: 46 },
    style: "Kickboxing/BJJ", reach: 66, stance: "Orthodox"
  },
  "jiri-prochazka": {
    id: "jiri-prochazka", name: "Jiri Prochazka", nickname: "Denisa",
    record: "30-4-1", weight: "Light Heavyweight", rank: "#1",
    initials: "JP", image: './fighters/jiri-prochazka.png',
    stats: { slpm: 6.2, strAcc: 49, tdAvg: 0.4, subAvg: 0.7, koPct: 74, subPct: 10, decPct: 16 },
    style: "Martial Arts/Striking", reach: 80, stance: "Orthodox"
  },
  "carlos-ulberg": {
    id: "carlos-ulberg", name: "Carlos Ulberg", nickname: "Black Jag",
    record: "12-1-0", weight: "Light Heavyweight", rank: "#3",
    initials: "CU", image: './fighters/carlos-ulberg.png',
    stats: { slpm: 5.1, strAcc: 55, tdAvg: 0.5, subAvg: 0.3, koPct: 75, subPct: 8, decPct: 17 },
    style: "Kickboxing/Muay Thai", reach: 76, stance: "Orthodox"
  },
  "joshua-van": {
    id: "joshua-van", name: "Joshua Van", nickname: "",
    record: "11-0-0", weight: "Flyweight", rank: "Champion",
    initials: "JV", image: './fighters/joshua-van.png',
    stats: { slpm: 4.5, strAcc: 52, tdAvg: 3.1, subAvg: 1.0, koPct: 27, subPct: 27, decPct: 46 },
    style: "Wrestling/MMA", reach: 68, stance: "Orthodox"
  },
  "tatsuro-taira": {
    id: "tatsuro-taira", name: "Tatsuro Taira", nickname: "",
    record: "16-0-0", weight: "Flyweight", rank: "#1",
    initials: "TT", image: './fighters/tatsuro-taira.png',
    stats: { slpm: 3.9, strAcc: 50, tdAvg: 4.2, subAvg: 2.3, koPct: 13, subPct: 56, decPct: 31 },
    style: "Judo/Grappling", reach: 67, stance: "Orthodox"
  },
  "kevin-holland": {
    id: "kevin-holland", name: "Kevin Holland", nickname: "Trailblazer",
    record: "26-10-0", weight: "Welterweight", rank: "#8",
    initials: "KH", image: './fighters/kevin-holland.png',
    stats: { slpm: 5.8, strAcc: 44, tdAvg: 1.0, subAvg: 0.9, koPct: 42, subPct: 27, decPct: 31 },
    style: "Striking/Grappling", reach: 79, stance: "Orthodox"
  },
  "randy-brown": {
    id: "randy-brown", name: "Randy Brown", nickname: "Rude Boy",
    record: "17-6-0", weight: "Welterweight", rank: "#11",
    initials: "RB", image: './fighters/randy-brown.png',
    stats: { slpm: 5.3, strAcc: 45, tdAvg: 1.4, subAvg: 0.5, koPct: 47, subPct: 18, decPct: 35 },
    style: "Kickboxing/MMA", reach: 76, stance: "Southpaw"
  },
  "paulo-costa": {
    id: "paulo-costa", name: "Paulo Costa", nickname: "Borrachinha",
    record: "14-3-0", weight: "Middleweight", rank: "#5",
    initials: "PC", image: './fighters/paulo-costa.png',
    stats: { slpm: 6.5, strAcc: 56, tdAvg: 1.1, subAvg: 0.3, koPct: 57, subPct: 14, decPct: 29 },
    style: "Boxing/Aggression", reach: 72, stance: "Orthodox"
  },
  "azamat-murzakanov": {
    id: "azamat-murzakanov", name: "Azamat Murzakanov", nickname: "Zam Zam",
    record: "13-1-0", weight: "Middleweight", rank: "#8",
    initials: "AM", image: './fighters/azamat-murzakanov.png',
    stats: { slpm: 4.8, strAcc: 50, tdAvg: 0.6, subAvg: 0.3, koPct: 62, subPct: 15, decPct: 23 },
    style: "Kickboxing/Power", reach: 77, stance: "Orthodox"
  },
  "curtis-blaydes": {
    id: "curtis-blaydes", name: "Curtis Blaydes", nickname: "Razor",
    record: "18-5-0", weight: "Heavyweight", rank: "#4",
    initials: "CB", image: './fighters/curtis-blaydes.png',
    stats: { slpm: 4.4, strAcc: 51, tdAvg: 4.6, subAvg: 0.7, koPct: 39, subPct: 17, decPct: 44 },
    style: "Wrestling/Grappling", reach: 80, stance: "Orthodox"
  },
  "khamzat-chimaev": {
    id: "khamzat-chimaev", name: "Khamzat Chimaev", nickname: "Borz",
    record: "15-0-0", weight: "Middleweight", rank: "Champion",
    initials: "KC", image: './fighters/khamzat-chimaev.png',
    stats: { slpm: 5.2, strAcc: 57, tdAvg: 5.6, subAvg: 1.4, koPct: 47, subPct: 27, decPct: 26 },
    style: "Wrestling/Striking", reach: 74, stance: "Orthodox"
  },
  "alexander-volkov": {
    id: "alexander-volkov", name: "Alexander Volkov", nickname: "Drago",
    record: "38-10-0", weight: "Heavyweight", rank: "#6",
    initials: "AV", image: './fighters/alexander-volkov.png',
    stats: { slpm: 4.6, strAcc: 50, tdAvg: 0.7, subAvg: 0.3, koPct: 47, subPct: 13, decPct: 40 },
    style: "Kickboxing/Striking", reach: 80, stance: "Orthodox"
  },
  "israel-adesanya": {
    id: "israel-adesanya", name: "Israel Adesanya", nickname: "The Last Stylebender",
    record: "24-4-0", weight: "Middleweight", rank: "#2",
    initials: "IA", image: './fighters/israel-adesanya.png',
    stats: { slpm: 4.4, strAcc: 50, tdAvg: 0.4, subAvg: 0.1, koPct: 46, subPct: 8, decPct: 46 },
    style: "Kickboxing/Movement", reach: 80, stance: "Orthodox"
  },
  "brendson-ribeiro": {
    id: "brendson-ribeiro", name: "Brendson Ribeiro", nickname: "",
    record: "16-3-0", weight: "Light Heavyweight", rank: "Unranked",
    initials: "BR", image: './fighters/brendson-ribeiro.png',
    stats: { slpm: 3.5, strAcc: 47, tdAvg: 1.2, subAvg: 1.8, koPct: 25, subPct: 50, decPct: 25 },
    style: "BJJ/Grappling", reach: 76, stance: "Orthodox"
  },
  "abdul-rakhman-yakhyaev": {
    id: "abdul-rakhman-yakhyaev", name: "Abdul-Rakhman Yakhyaev", nickname: "",
    record: "10-0-0", weight: "Light Heavyweight", rank: "Unranked",
    initials: "AY", image: '',
    stats: { slpm: 4.1, strAcc: 50, tdAvg: 2.3, subAvg: 0.6, koPct: 40, subPct: 20, decPct: 40 },
    style: "Wrestling/Striking", reach: 77, stance: "Orthodox"
  },
  "ethyn-ewing": {
    id: "ethyn-ewing", name: "Ethyn Ewing", nickname: "",
    record: "8-1-0", weight: "Bantamweight", rank: "Unranked",
    initials: "EE", image: './fighters/ethyn-ewing.png',
    stats: { slpm: 4.8, strAcc: 48, tdAvg: 1.5, subAvg: 0.5, koPct: 38, subPct: 25, decPct: 37 },
    style: "Striking/MMA", reach: 68, stance: "Orthodox"
  },
  "rafael-estevam": {
    id: "rafael-estevam", name: "Rafael Estevam", nickname: "",
    record: "10-1-0", weight: "Bantamweight", rank: "Unranked",
    initials: "RE", image: './fighters/rafael-estevam.png',
    stats: { slpm: 4.3, strAcc: 46, tdAvg: 2.0, subAvg: 1.2, koPct: 30, subPct: 40, decPct: 30 },
    style: "BJJ/MMA", reach: 67, stance: "Orthodox"
  },
  "lando-vannata": {
    id: "lando-vannata", name: "Lando Vannata", nickname: "Groovy",
    record: "13-7-2", weight: "Lightweight", rank: "Unranked",
    initials: "LV", image: './fighters/lando-vannata.png',
    stats: { slpm: 5.9, strAcc: 47, tdAvg: 0.9, subAvg: 0.8, koPct: 46, subPct: 31, decPct: 23 },
    style: "Striking/Submission", reach: 70, stance: "Orthodox"
  },
  "darrius-flowers": {
    id: "darrius-flowers", name: "Darrius Flowers", nickname: "",
    record: "9-2-0", weight: "Lightweight", rank: "Unranked",
    initials: "DF", image: './fighters/darrius-flowers.png',
    stats: { slpm: 4.2, strAcc: 45, tdAvg: 1.4, subAvg: 0.4, koPct: 33, subPct: 22, decPct: 45 },
    style: "Striking/MMA", reach: 72, stance: "Orthodox"
  },
  "kai-kamaka-iii": {
    id: "kai-kamaka-iii", name: "Kai Kamaka III", nickname: "",
    record: "12-6-0", weight: "Featherweight", rank: "Unranked",
    initials: "KK", image: './fighters/kai-kamaka-iii.png',
    stats: { slpm: 4.6, strAcc: 46, tdAvg: 0.8, subAvg: 0.5, koPct: 42, subPct: 17, decPct: 41 },
    style: "Boxing/MMA", reach: 69, stance: "Orthodox"
  },
  "dakota-hope": {
    id: "dakota-hope", name: "Dakota Hope", nickname: "",
    record: "7-3-0", weight: "Featherweight", rank: "Unranked",
    initials: "DH", image: './fighters/dakota-hope.png',
    stats: { slpm: 3.8, strAcc: 44, tdAvg: 1.6, subAvg: 0.3, koPct: 29, subPct: 14, decPct: 57 },
    style: "Wrestling/MMA", reach: 70, stance: "Orthodox"
  },
  "melissa-gatto": {
    id: "melissa-gatto", name: "Melissa Gatto", nickname: "",
    record: "14-3-2", weight: "Women's Strawweight", rank: "Unranked",
    initials: "MG", image: './fighters/melissa-gatto.png',
    stats: { slpm: 3.9, strAcc: 46, tdAvg: 1.1, subAvg: 1.4, koPct: 21, subPct: 43, decPct: 36 },
    style: "BJJ/MMA", reach: 64, stance: "Orthodox"
  },
  "dione-barbosa": {
    id: "dione-barbosa", name: "Dione Barbosa", nickname: "",
    record: "12-5-0", weight: "Women's Strawweight", rank: "Unranked",
    initials: "DB", image: './fighters/dione-barbosa.png',
    stats: { slpm: 4.1, strAcc: 47, tdAvg: 1.3, subAvg: 0.9, koPct: 25, subPct: 33, decPct: 42 },
    style: "Striking/BJJ", reach: 65, stance: "Orthodox"
  },
  "tresean-gore": {
    id: "tresean-gore", name: "Tresean Gore", nickname: "The Lebanese Demon",
    record: "7-3-0", weight: "Middleweight", rank: "Unranked",
    initials: "TG", image: './fighters/tresean-gore.png',
    stats: { slpm: 4.5, strAcc: 49, tdAvg: 1.8, subAvg: 0.6, koPct: 43, subPct: 29, decPct: 28 },
    style: "Kickboxing/MMA", reach: 75, stance: "Orthodox"
  },
  "azamat-bekoev": {
    id: "azamat-bekoev", name: "Azamat Bekoev", nickname: "",
    record: "14-3-0", weight: "Middleweight", rank: "Unranked",
    initials: "AB", image: './fighters/azamat-bekoev.png',
    stats: { slpm: 4.0, strAcc: 48, tdAvg: 2.5, subAvg: 0.8, koPct: 36, subPct: 28, decPct: 36 },
    style: "Wrestling/Striking", reach: 74, stance: "Orthodox"
  }
};

const ALL_FIGHTERS = { ...FIGHTERS, ...EXTRA_FIGHTERS };

// ─── PREDICTION ENGINE ──────────────────────────────────────────────────────

function predictFight(f1, f2) {
  const s1 = f1.stats, s2 = f2.stats;

  // Composite scoring
  const strikeEdge = (s1.slpm * s1.strAcc / 100) - (s2.slpm * s2.strAcc / 100);
  const grapplingEdge = (s1.tdAvg + s1.subAvg * 2) - (s2.tdAvg + s2.subAvg * 2);
  const recordEdge = calcRecordEdge(f1.record, f2.record);

  const totalEdge = (strikeEdge * 0.45) + (grapplingEdge * 0.35) + (recordEdge * 0.2);
  const maxEdge = 3.5;
  const clampedEdge = Math.max(-maxEdge, Math.min(maxEdge, totalEdge));

  // Sigmoid-style conversion to probability
  let f1WinProb = 0.5 + (clampedEdge / maxEdge) * 0.45;
  f1WinProb = Math.max(0.15, Math.min(0.85, f1WinProb));
  const f2WinProb = 1 - f1WinProb;

  // Method breakdown (weighted average of both fighters' tendencies)
  const koPct = Math.round((s1.koPct + s2.koPct) / 2);
  const subPct = Math.round((s1.subPct + s2.subPct) / 2);
  const decPct = 100 - koPct - subPct;

  // Implied odds (American)
  const f1Implied = f1WinProb;
  const f1American = probToAmerican(f1Implied);
  const f2American = probToAmerican(f2WinProb);

  return {
    f1WinProb: Math.round(f1WinProb * 100),
    f2WinProb: Math.round(f2WinProb * 100),
    koPct, subPct, decPct: Math.max(0, decPct),
    f1American, f2American,
    pick: f1WinProb >= 0.5 ? f1 : f2,
    confidence: Math.abs(f1WinProb - 0.5) * 200
  };
}

function generateFightNarrative(f1, f2, pred) {
  const s1 = f1.stats, s2 = f2.stats;
  const winner = pred.pick;
  const loser = winner === f1 ? f2 : f1;
  const ws = winner === f1 ? s1 : s2;
  const ls = winner === f1 ? s2 : s1;

  const strikeEdge = (s1.slpm * s1.strAcc / 100) - (s2.slpm * s2.strAcc / 100);
  const grapplingEdge = (s1.tdAvg + s1.subAvg * 2) - (s2.tdAvg + s2.subAvg * 2);
  const dominantFactor = Math.abs(strikeEdge) > Math.abs(grapplingEdge) ? 'striking' : 'grappling';
  const isClose = pred.confidence < 15;

  const winnerFirst = winner.name.split(' ').slice(-1)[0];
  const loserFirst = loser.name.split(' ').slice(-1)[0];
  const isKoFight = pred.koPct > pred.subPct && pred.koPct > pred.decPct;
  const isSubFight = pred.subPct > pred.koPct && pred.subPct > pred.decPct;
  const isDecFight = pred.decPct >= pred.koPct && pred.decPct >= pred.subPct;

  let sentence1 = '';
  let sentence2 = '';
  let sentence3 = '';

  if (isClose) {
    sentence1 = `A closely contested fight where the model gives ${winner.name} a narrow ${pred.confidence < 10 ? 'razor-thin' : 'slight'} edge.`;
  } else if (dominantFactor === 'striking') {
    sentence1 = `${winner.name} holds a clear striking advantage — landing ${ws.slpm} significant strikes per minute at ${ws.strAcc}% accuracy versus ${loserFirst}'s ${ls.slpm} SLpM.`;
  } else {
    sentence1 = `${winner.name}'s grappling is the deciding factor here — averaging ${ws.tdAvg} takedowns and ${ws.subAvg} submission attempts per 15 minutes compared to ${loserFirst}'s ${ls.tdAvg} and ${ls.subAvg}.`;
  }

  if (isKoFight) {
    sentence2 = `With both fighters combining for a ${pred.koPct}% KO/TKO rate historically, the model expects this to end early. ${winnerFirst}'s ${ws.koPct}% KO rate is the bigger threat.`;
  } else if (isSubFight) {
    sentence2 = `Submission is the most likely path to victory at ${pred.subPct}% — ${winnerFirst} submits ${ws.subPct}% of their fights and holds the clear ground game edge.`;
  } else {
    sentence2 = `Both fighters are durable and this is likely to go to the judges (${pred.decPct}% decision probability). ${winnerFirst} wins on volume and activity over 15 or 25 minutes.`;
  }

  if (pred.confidence >= 25) {
    sentence3 = `Model confidence: ${Math.round(pred.confidence)}% — this is one of the card's clearest picks.`;
  } else if (pred.confidence >= 12) {
    sentence3 = `Model confidence: ${Math.round(pred.confidence)}% — a moderate lean, live dog possible.`;
  } else {
    sentence3 = `Model confidence: ${Math.round(pred.confidence)}% — essentially a coin flip, bet accordingly.`;
  }

  return `${sentence1} ${sentence2} ${sentence3}`;
}

function calcRecordEdge(rec1, rec2) {
  const parse = r => {
    const parts = r.split('-').map(Number);
    return parts[0] / (parts[0] + parts[1] || 1);
  };
  return (parse(rec1) - parse(rec2)) * 3;
}

function probToAmerican(prob) {
  if (prob >= 0.5) {
    return '-' + Math.round((prob / (1 - prob)) * 100);
  } else {
    return '+' + Math.round(((1 - prob) / prob) * 100);
  }
}

function getFightName(f1, f2) {
  const n1 = f1.name.split(' ').pop();
  const n2 = f2.name.split(' ').pop();
  return `${n1} vs ${n2}`;
}

function getInitials(fighter) {
  return fighter.initials || fighter.name.split(' ').map(w => w[0]).join('').slice(0, 2);
}

function getFighterImage(fighter, size) {
  // size: 'lg', 'md', 'sm'
  const initials = getInitials(fighter);
  const src = fighter.image || '';
  // Inline SVG fallback — no external requests
  const svgFallback = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect width='120' height='120' rx='8' fill='%231a1a2e'/%3E%3Ctext x='60' y='75' font-size='36' font-weight='900' text-anchor='middle' fill='%23d62828' font-family='Arial'%3E${encodeURIComponent(initials)}%3C/text%3E%3C/svg%3E`;
  if (!src) return `<img class="fighter-photo fighter-photo--${size}" src="${svgFallback}" alt="${fighter.name}">`;
  return `<img class="fighter-photo fighter-photo--${size}" src="${src}" alt="${fighter.name}" loading="lazy" onerror="this.onerror=null;this.src='${svgFallback}'">`;
}

// ─── RENDER HELPERS ─────────────────────────────────────────────────────────

function getFighterOrPlaceholder(id) {
  if (ALL_FIGHTERS[id]) return ALL_FIGHTERS[id];
  // Generate placeholder from id
  const name = id.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2);
  return {
    id, name, nickname: "", record: "0-0-0", weight: "", rank: "",
    initials,
    image: '',
    stats: { slpm: 4.0, strAcc: 48, tdAvg: 1.5, subAvg: 0.5, koPct: 33, subPct: 22, decPct: 45 },
    style: "MMA", reach: 72, stance: "Orthodox"
  };
}

function animateBars() {
  // Trigger CSS transitions after DOM paint
  requestAnimationFrame(() => {
    document.querySelectorAll('[data-width]').forEach(el => {
      el.style.width = el.dataset.width + '%';
    });

    // Count-up animation for win probability numbers
    document.querySelectorAll('[data-countup]').forEach(el => {
      const target = parseInt(el.dataset.countup, 10);
      const duration = 600; // ms
      const start = performance.now();
      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + '%';
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  });
}

// ─── TAB SYSTEM ─────────────────────────────────────────────────────────────

function initTabs() {
  const nav = document.getElementById('main-nav');
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      document.getElementById('panel-' + target).classList.add('active');

      // Sync nav link active state
      document.querySelectorAll('#main-nav a').forEach(a => {
        a.classList.toggle('active', a.dataset.gotoTab === target);
      });

      // Close hamburger menu if open
      if (nav) nav.classList.remove('open');
    });
  });
}

// ─── HAMBURGER ──────────────────────────────────────────────────────────────

function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  // Close on nav link click
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// ─── WEIGHT CLASS ABBREVIATION ───────────────────────────────────────────────

function abbreviateWeight(weight) {
  const map = {
    'Heavyweight': 'HW',
    'Light Heavyweight': 'LHW',
    'Middleweight': 'MW',
    'Welterweight': 'WW',
    'Lightweight': 'LW',
    'Featherweight': 'FW',
    'Bantamweight': 'BW',
    'Flyweight': 'FLY',
    'Strawweight': 'SW',
    "Women's Strawweight": 'W-SW',
    "Women's Flyweight": 'W-FLY',
    "Women's Bantamweight": 'W-BW',
    "Women's Featherweight": 'W-FW',
  };
  return map[weight] || weight;
}

// ─── EVENTS TAB ─────────────────────────────────────────────────────────────

function renderEvents() {
  const container = document.getElementById('events-container');
  let html = '';

  UPCOMING_EVENTS.forEach((event, i) => {
    const tagClass = event.type === 'ppv' ? 'ppv' : 'fight-night';
    const tagText = event.type === 'ppv' ? 'PPV' : 'Fight Night';
    const isNext = i === 0;

    const makeCompactRow = (fight) => {
      const f1 = getFighterOrPlaceholder(fight.f1);
      const f2 = getFighterOrPlaceholder(fight.f2);
      const isMain = fight.tier === 'main';
      const isCoMain = fight.tier === 'co-main';
      const badgeClass = isMain ? 'main' : (isCoMain ? 'co-main' : fight.tier === 'main-card' ? 'co-main' : 'prelim');
      const badgeText = isMain ? 'MAIN EVENT' : (isCoMain ? 'CO-MAIN' : fight.tier === 'main-card' ? 'CARD' : 'PRELIM');
      const rowClass = isMain ? 'main-event' : isCoMain ? 'co-main-event' : '';

      if (isMain || isCoMain) {
        const makePhoto = (f) => {
          const isLocal = f.image && f.image.startsWith('./fighters/');
          if (isLocal) return `<img class="fight-faceoff-photo" src="${f.image}" alt="${f.name}" loading="lazy" onerror="this.style.opacity='0'">`;
          return `<div class="fight-faceoff-photo fight-faceoff-initials">${f.initials}</div>`;
        };
        return `
        <div class="fight-row ${rowClass}">
          <div class="fight-faceoff">
            <div class="fight-faceoff-fighter f1">
              ${makePhoto(f1)}
              <div class="fight-faceoff-name">${f1.name}</div>
              <div class="fight-faceoff-record">${f1.record}</div>
            </div>
            <div class="fight-faceoff-center">
              <div class="fight-faceoff-badge ${badgeClass}">${badgeText}</div>
              <div class="fight-faceoff-vs">VS</div>
              <div class="fight-faceoff-weight">${abbreviateWeight(fight.weight)}</div>
            </div>
            <div class="fight-faceoff-fighter f2">
              ${makePhoto(f2)}
              <div class="fight-faceoff-name">${f2.name}</div>
              <div class="fight-faceoff-record">${f2.record}</div>
            </div>
          </div>
        </div>`;
      } else {
        return `
        <div class="fight-row">
          <div class="fight-row-compact">
            <div class="fight-badge ${badgeClass}">${badgeText === 'PRELIM' ? 'PRE' : 'CARD'}</div>
            <div class="fight-fighters">
              ${getFighterImage(f1, 'sm')}
              <div class="fight-fighter-name">${f1.name}</div>
              <div class="fight-vs">VS</div>
              <div class="fight-fighter-name right">${f2.name}</div>
              ${getFighterImage(f2, 'sm')}
            </div>
            ${fight.title ? '<span class="section-badge title-fight-badge">TITLE FIGHT</span>' : `<div class="fight-weight" title="${fight.weight}">${abbreviateWeight(fight.weight)}</div>`}
          </div>
        </div>`;
      }
    };

    const mainFights = event.fights.filter(f => f.tier !== 'prelim');
    const prelimFights = event.fights.filter(f => f.tier === 'prelim');
    const eventIdx = i;

    html += `
    <div class="event-card fade-in-up${isNext ? ' next-event' : ''}" style="animation-delay:${i * 0.08}s">
      <div class="event-card-header">
        <div>
          ${isNext ? '<div class="next-event-label">NEXT UP</div>' : ''}
          <div class="event-card-title">${event.name}</div>
          <div class="event-card-date">${event.date}</div>
          <div class="event-card-location">${event.location}</div>
        </div>
        <div class="event-tag ${tagClass}">${tagText}</div>
      </div>
      <div class="fight-list">
        ${mainFights.map(makeCompactRow).join('')}
        ${prelimFights.length > 0 ? `
        <button class="prelim-toggle-btn" data-event="${eventIdx}" aria-expanded="false" aria-controls="prelims-${eventIdx}">
          Prelims
          <span class="prelim-count">${prelimFights.length} fights</span>
          <span class="prelim-chevron">&#9660;</span>
        </button>
        <div class="prelim-section" id="prelims-${eventIdx}">
          ${prelimFights.map(makeCompactRow).join('')}
        </div>` : ''}
      </div>
    </div>`;
  });

  container.innerHTML = html;

  // Fight rows navigate to Predictions tab on click
  container.querySelectorAll('.fight-row').forEach(row => {
    row.addEventListener('click', () => {
      document.querySelector('.tab-btn[data-tab="predictions"]').click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Collapsible prelim toggles
  container.querySelectorAll('.prelim-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.getAttribute('aria-controls');
      const section = document.getElementById(targetId);
      const isOpen = section.classList.contains('open');
      section.classList.toggle('open', !isOpen);
      btn.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

// ─── PREDICTIONS TAB ────────────────────────────────────────────────────────

function renderPredictions() {
  const container = document.getElementById('predictions-container');
  let html = '';
  let cardIndex = 0;
  let hasAny = false;

  UPCOMING_EVENTS.forEach(event => {
    const eventFights = event.fights
      .map(fight => ({
        f1: ALL_FIGHTERS[fight.f1], f2: ALL_FIGHTERS[fight.f2],
        weight: fight.weight, tier: fight.tier, title: fight.title
      }))
      .filter(f => f.f1 && f.f2);

    if (eventFights.length === 0) return;
    hasAny = true;

    const tagCls = event.type === 'ppv' ? 'ppv' : 'fight-night';
    const tagTxt = event.type === 'ppv' ? 'PPV' : 'Fight Night';
    html += `
    <div class="pred-event-header">
      <div class="pred-event-name">${event.name}</div>
      <div class="pred-event-meta">${event.date} · ${event.location}</div>
      <div class="event-tag ${tagCls}" style="margin-top:6px">${tagTxt}</div>
    </div>
    <div class="predictions-grid">`;

    eventFights.forEach((fight) => {
      const i = cardIndex++;
    const pred = predictFight(fight.f1, fight.f2);
    const { f1, f2 } = fight;
    const higherKo = pred.koPct >= pred.subPct && pred.koPct >= pred.decPct;
    const higherSub = pred.subPct > pred.koPct && pred.subPct >= pred.decPct;

    html += `
    <div class="pred-card fade-in-up" style="animation-delay:${i * 0.07}s">
      <div class="pred-card-header">
        <div class="pred-card-title" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span>${fight.weight} ${(fight.tier === 'main' || fight.title) ? '· Title Fight' : ''}</span>
          ${fight.title ? '<span class="section-badge" style="font-size:9px;padding:2px 6px;letter-spacing:0.8px;">TITLE</span>' : ''}
        </div>
        <div class="pred-matchup">
          <div class="pred-fighter">
            ${getFighterImage(f1, 'md')}
            <div class="pred-fighter-name">${f1.name}</div>
            <div class="pred-fighter-record">${f1.record}</div>
          </div>
          <div class="pred-vs">VS</div>
          <div class="pred-fighter">
            ${getFighterImage(f2, 'md')}
            <div class="pred-fighter-name">${f2.name}</div>
            <div class="pred-fighter-record">${f2.record}</div>
          </div>
        </div>
      </div>
      <div class="pred-body">
        <div class="win-prob-hero">
          <div class="win-prob-hero-split">
            <div class="win-prob-hero-fighter f1-side">
              <div class="win-prob-hero-pct f1-pct" data-countup="${pred.f1WinProb}">0%</div>
              <div class="win-prob-hero-name">${f1.name.split(' ').pop()}</div>
            </div>
            <div class="win-prob-hero-vs">VS</div>
            <div class="win-prob-hero-fighter f2-side">
              <div class="win-prob-hero-pct f2-pct" data-countup="${pred.f2WinProb}">0%</div>
              <div class="win-prob-hero-name">${f2.name.split(' ').pop()}</div>
            </div>
          </div>
          <div class="win-prob-bar-wrap" style="margin-top:8px">
            <div class="win-prob-bar-fill f1" data-width="${pred.f1WinProb}" style="width:0%"></div>
            <div class="win-prob-bar-fill f2" data-width="${pred.f2WinProb}" style="width:0%"></div>
          </div>
        </div>
        <div class="method-grid">
          <div class="method-item ${higherKo ? 'highlight' : ''}">
            <div class="method-pct">${pred.koPct}%</div>
            <div class="method-label">KO/TKO</div>
          </div>
          <div class="method-item ${higherSub ? 'highlight' : ''}">
            <div class="method-pct">${pred.subPct}%</div>
            <div class="method-label">Sub</div>
          </div>
          <div class="method-item ${!higherKo && !higherSub ? 'highlight' : ''}">
            <div class="method-pct">${pred.decPct}%</div>
            <div class="method-label">Decision</div>
          </div>
        </div>
        <div class="pred-pick">
          AI Pick: <span>${pred.pick.name}</span>
          <span style="font-size:11px;color:var(--grey)">${Math.round(pred.confidence)}% conf.</span>
          <span class="pred-pick-tier ${pred.confidence >= 25 ? 'strong' : pred.confidence >= 12 ? 'moderate' : 'lean'}">${pred.confidence >= 25 ? 'STRONG' : pred.confidence >= 12 ? 'MODERATE' : 'LEAN'}</span>
        </div>
        <div class="pred-narrative">${generateFightNarrative(f1, f2, pred)}</div>
      </div>
    </div>
    `;
    });

    html += '</div>';
  });

  if (!hasAny) {
    container.innerHTML = '<div class="empty-state">No predictions available — fighter data not found for upcoming fights.</div>';
    return;
  }

  container.innerHTML = html;
  setTimeout(animateBars, 50);
}

// ─── SIMULATOR TAB ──────────────────────────────────────────────────────────

function populateSimSelects() {
  const sel1 = document.getElementById('sim-f1');
  const sel2 = document.getElementById('sim-f2');

  const sortedFighters = Object.values(ALL_FIGHTERS).sort((a, b) => a.name.localeCompare(b.name));

  let opts = '';
  sortedFighters.forEach(f => {
    opts += `<option value="${f.id}">${f.name} (${f.record})</option>`;
  });

  sel1.innerHTML = opts;
  sel2.innerHTML = opts;

  // Default different selections
  sel1.value = 'jon-jones';
  sel2.value = 'tom-aspinall';
}

function runSimulator() {
  const f1id = document.getElementById('sim-f1').value;
  const f2id = document.getElementById('sim-f2').value;

  if (f1id === f2id) {
    const result = document.getElementById('sim-result');
    result.innerHTML = '<div class="sim-error">Please select two different fighters to run a simulation.</div>';
    result.classList.add('visible');
    return;
  }

  const f1 = ALL_FIGHTERS[f1id];
  const f2 = ALL_FIGHTERS[f2id];
  const pred = predictFight(f1, f2);

  // Add ±4% variance so same matchup can return slightly different results each run
  const noise = (Math.random() * 8) - 4; // -4 to +4
  const noisedF1 = Math.round(Math.max(5, Math.min(95, pred.f1WinProb + noise)));
  const noisedF2 = 100 - noisedF1;
  pred.f1WinProb = noisedF1;
  pred.f2WinProb = noisedF2;

  const winner = pred.f1WinProb >= pred.f2WinProb ? f1 : f2;
  const loser = winner === f1 ? f2 : f1;
  const winnerProb = winner === f1 ? pred.f1WinProb : pred.f2WinProb;

  // Detect if this is a title / 5-round fight by checking if these fighters appear as main event
  const isTitleFight = UPCOMING_EVENTS.some(ev =>
    ev.fights.some(fight =>
      fight.tier === 'main' &&
      ((fight.f1 === f1id && fight.f2 === f2id) || (fight.f1 === f2id && fight.f2 === f1id))
    )
  );
  const decisionRound = isTitleFight
    ? (Math.random() < 0.5 ? 4 : 5)  // title fights can end in round 4 or 5
    : 3;

  // Pick most likely method — deterministic round based on finish rate
  const koRound = winner.stats.koPct >= 60 ? 1 : winner.stats.koPct >= 40 ? 2 : 3;
  const subRound = winner.stats.subAvg >= 1.5 ? 1 : winner.stats.subAvg >= 0.8 ? 2 : 3;
  const methods = [
    { name: 'KO/TKO', pct: pred.koPct, round: koRound },
    { name: 'Submission', pct: pred.subPct, round: subRound },
    { name: 'Decision', pct: pred.decPct, round: decisionRound }
  ].sort((a, b) => b.pct - a.pct);
  const method = methods[0];
  const methodStr = method.name === 'Decision'
    ? 'Unanimous Decision'
    : `${method.name}, Round ${method.round}`;

  const result = document.getElementById('sim-result');
  const resultHTML = `
    <div class="sim-result-card">
      <div class="sim-matchup-photos">
        <div class="sim-matchup-fighter">
          ${getFighterImage(f1, 'lg')}
          <div class="sim-matchup-name">${f1.name.split(' ').pop()}</div>
        </div>
        <div class="sim-matchup-vs">VS</div>
        <div class="sim-matchup-fighter">
          ${getFighterImage(f2, 'lg')}
          <div class="sim-matchup-name">${f2.name.split(' ').pop()}</div>
        </div>
      </div>
      <div class="sim-result-header">
        <div class="sim-result-label">&#x1F3C6; Predicted Winner</div>
        <div class="sim-result-winner">${getFighterImage(winner, 'md')}<span>${winner.name}</span></div>
        <div class="sim-result-method">via ${methodStr} · Win Probability: ${winnerProb}%</div>
      </div>
      <div class="sim-result-body">
        <div class="sim-stat">
          <div class="sim-stat-val">${pred.koPct}%</div>
          <div class="sim-stat-label">KO/TKO</div>
        </div>
        <div class="sim-stat">
          <div class="sim-stat-val">${pred.subPct}%</div>
          <div class="sim-stat-label">Submission</div>
        </div>
        <div class="sim-stat">
          <div class="sim-stat-val">${pred.decPct}%</div>
          <div class="sim-stat-label">Decision</div>
        </div>
      </div>
      <div class="sim-fighter-compare">
        <div class="sim-compare-header">
          <span class="sim-compare-name">${f1.name.split(' ').pop()}</span>
          <span class="sim-compare-label">Fighter Stats</span>
          <span class="sim-compare-name">${f2.name.split(' ').pop()}</span>
        </div>
        <div class="sim-compare-row">
          <span class="sim-compare-val ${f1.stats.slpm >= f2.stats.slpm ? 'sim-compare-winner' : ''}">${f1.stats.slpm}</span>
          <span class="sim-compare-stat">SLpM</span>
          <span class="sim-compare-val ${f2.stats.slpm > f1.stats.slpm ? 'sim-compare-winner' : ''}">${f2.stats.slpm}</span>
        </div>
        <div class="sim-compare-row">
          <span class="sim-compare-val ${f1.stats.strAcc >= f2.stats.strAcc ? 'sim-compare-winner' : ''}">${f1.stats.strAcc}%</span>
          <span class="sim-compare-stat">Str Acc</span>
          <span class="sim-compare-val ${f2.stats.strAcc > f1.stats.strAcc ? 'sim-compare-winner' : ''}">${f2.stats.strAcc}%</span>
        </div>
        <div class="sim-compare-row">
          <span class="sim-compare-val ${(f1.stats.koPct + f1.stats.subPct) >= (f2.stats.koPct + f2.stats.subPct) ? 'sim-compare-winner' : ''}">${f1.stats.koPct + f1.stats.subPct}%</span>
          <span class="sim-compare-stat">Finish %</span>
          <span class="sim-compare-val ${(f2.stats.koPct + f2.stats.subPct) > (f1.stats.koPct + f1.stats.subPct) ? 'sim-compare-winner' : ''}">${f2.stats.koPct + f2.stats.subPct}%</span>
        </div>
      </div>
      <div class="sim-narrative">${generateFightNarrative(f1, f2, pred)}</div>
      <div class="sim-breakdown">
        <div class="sim-breakdown-title">Statistical Breakdown</div>
        <div class="sim-bar-row">
          <div class="sim-bar-label">Striking Edge</div>
          <div class="sim-bar-track"><div class="sim-bar-fill" style="width:${Math.min(100, winner.stats.slpm / 8 * 100)}%"></div></div>
          <div class="sim-bar-val">${winner.stats.slpm}/min</div>
        </div>
        <div class="sim-bar-row">
          <div class="sim-bar-label">Takedown Avg</div>
          <div class="sim-bar-track"><div class="sim-bar-fill" style="width:${Math.min(100, winner.stats.tdAvg / 5 * 100)}%"></div></div>
          <div class="sim-bar-val">${winner.stats.tdAvg}/15</div>
        </div>
        <div class="sim-bar-row">
          <div class="sim-bar-label">Str. Accuracy</div>
          <div class="sim-bar-track"><div class="sim-bar-fill" style="width:${winner.stats.strAcc}%"></div></div>
          <div class="sim-bar-val">${winner.stats.strAcc}%</div>
        </div>
        <div class="sim-bar-row">
          <div class="sim-bar-label">Finish Rate</div>
          <div class="sim-bar-track"><div class="sim-bar-fill" style="width:${winner.stats.koPct + winner.stats.subPct}%"></div></div>
          <div class="sim-bar-val">${winner.stats.koPct + winner.stats.subPct}%</div>
        </div>
      </div>
    </div>
  `;

  result.innerHTML = resultHTML;
  result.classList.add('visible');
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─── BETTING TAB ─────────────────────────────────────────────────────────────

function renderBetting() {
  const container = document.getElementById('betting-container');
  let html = '';
  let cardIndex = 0;
  let hasAny = false;

  UPCOMING_EVENTS.forEach(event => {
    const eventFights = event.fights
      .map(fight => ({
        f1: ALL_FIGHTERS[fight.f1], f2: ALL_FIGHTERS[fight.f2],
        weight: fight.weight, tier: fight.tier, title: fight.title
      }))
      .filter(f => f.f1 && f.f2);

    if (eventFights.length === 0) return;
    hasAny = true;

    const tagCls = event.type === 'ppv' ? 'ppv' : 'fight-night';
    const tagTxt = event.type === 'ppv' ? 'PPV' : 'Fight Night';
    html += `
    <div class="pred-event-header">
      <div class="pred-event-name">${event.name}</div>
      <div class="pred-event-meta">${event.date} · ${event.location}</div>
      <div class="event-tag ${tagCls}" style="margin-top:6px">${tagTxt}</div>
    </div>
    <div class="betting-grid">`;

    eventFights.forEach((fight) => {
      const i = cardIndex++;
      const pred = predictFight(fight.f1, fight.f2);
      const { f1, f2 } = fight;

      const bookF1Prob = Math.max(0.2, Math.min(0.8, pred.f1WinProb / 100 * 0.9 + 0.05));
      const bookF1American = probToAmerican(bookF1Prob);
      const bookF2American = probToAmerican(1 - bookF1Prob);
      const bookF1Implied = Math.round(bookF1Prob * 100);
      const bookF2Implied = Math.round((1 - bookF1Prob) * 100);

      const edgePct = pred.f1WinProb - bookF1Implied;
      const hasValue = Math.abs(edgePct) > 3;
      const valueLabel = !hasValue ? 'FAIR' : edgePct > 0 ? 'VALUE' : 'FADE';
      const valueCls = !hasValue ? 'fair' : edgePct > 0 ? 'value' : 'fade';
      const recFighter = edgePct > 0 ? f1 : f2;
      const confCls = pred.confidence >= 25 ? 'conf-strong' : pred.confidence >= 12 ? 'conf-moderate' : 'conf-lean';

      html += `
      <div class="bet-card fade-in-up ${confCls}" style="animation-delay:${i * 0.07}s">
        <div class="bet-card-header">
          <div class="bet-card-matchup">
            <div class="bet-card-fighter-photo">${getFighterImage(f1, 'sm')}</div>
            <div class="bet-card-names">
              <div class="bet-card-fight" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">${getFightName(f1, f2)}${fight.title ? ' <span class="section-badge" style="font-size:8px;padding:1px 5px;letter-spacing:0.8px;">TITLE</span>' : ''}</div>
              <div class="bet-card-weight">${fight.weight}</div>
            </div>
            <div class="bet-card-fighter-photo">${getFighterImage(f2, 'sm')}</div>
          </div>
          <div class="bet-value-badge ${valueCls}">${valueLabel}</div>
        </div>
        <div class="bet-body">
          <div class="odds-row">
            <div class="odds-fighter">${f1.name}</div>
            <div class="odds-implied">${bookF1Implied}%</div>
            <div class="odds-american ${bookF1Prob >= 0.5 ? 'fav' : 'dog'}">${bookF1American}</div>
          </div>
          <div class="odds-row">
            <div class="odds-fighter">${f2.name}</div>
            <div class="odds-implied">${bookF2Implied}%</div>
            <div class="odds-american ${(1 - bookF1Prob) >= 0.5 ? 'fav' : 'dog'}">${bookF2American}</div>
          </div>
          ${hasValue ? `
          <div class="bet-edge ${edgePct > 0 ? 'positive' : 'negative'}">
            <span class="edge-label">Model Edge: </span>
            ${edgePct > 0 ? '+' : ''}${edgePct.toFixed(1)}% — ${edgePct > 0 ? `Value on ${recFighter.name.split(' ').pop()}` : `Book favors ${recFighter.name.split(' ').pop()} too heavily`}
          </div>` : `
          <div class="bet-edge neutral">
            <span class="edge-label">Edge: </span>Fair line — no strong value identified
          </div>`}
          <div class="bet-narrative">${generateFightNarrative(f1, f2, pred)}</div>
        </div>
      </div>
      `;
    });

    html += '</div>';
  });

  if (!hasAny) {
    container.innerHTML = '<div class="empty-state">No betting data available — fighter data not found for upcoming fights.</div>';
    return;
  }
  container.innerHTML = html;
}

// ─── FIGHTERS TAB ────────────────────────────────────────────────────────────

function renderFighters() {
  const container = document.getElementById('fighters-container');
  const fighters = Object.values(ALL_FIGHTERS).sort((a, b) => a.name.localeCompare(b.name));

  let html = '<div class="fighters-grid">';

  fighters.forEach((f, i) => {
    const koPct = f.stats.koPct;
    const finishPct = f.stats.koPct + f.stats.subPct;

    html += `
    <div class="fighter-card fade-in-up" data-weight="${f.weight}" data-name="${f.name.toLowerCase()}" data-fighter-id="${f.id}" style="animation-delay:${i * 0.04}s" role="button" tabindex="0" aria-label="View ${f.name} profile">
      <div class="fighter-card-top">
        <div class="fighter-avatar">${getFighterImage(f, 'lg')}</div>
        <div class="fighter-info">
          <div class="fighter-name">${f.name}</div>
          ${f.nickname ? `<div class="fighter-nickname">"${f.nickname}"</div>` : ''}
          <div class="fighter-record">${f.record}</div>
          <div class="fighter-weight-rank">${f.weight} · ${f.rank}</div>
        </div>
      </div>
      <div class="fighter-stats-grid">
        <div class="f-stat">
          <div class="f-stat-val red">${f.stats.slpm}</div>
          <div class="f-stat-label">SLpM</div>
        </div>
        <div class="f-stat">
          <div class="f-stat-val">${f.stats.strAcc}%</div>
          <div class="f-stat-label">Str Acc</div>
        </div>
        <div class="f-stat">
          <div class="f-stat-val gold">${finishPct}%</div>
          <div class="f-stat-label">Finish %</div>
        </div>
        <div class="f-stat">
          <div class="f-stat-val">${f.stats.tdAvg}</div>
          <div class="f-stat-label">TD/15m</div>
        </div>
        <div class="f-stat">
          <div class="f-stat-val">${koPct}%</div>
          <div class="f-stat-label">KO/TKO</div>
        </div>
        <div class="f-stat">
          <div class="f-stat-val">${f.stats.subAvg}</div>
          <div class="f-stat-label">Sub/15m</div>
        </div>
      </div>
    </div>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

// ─── FIGHTER FILTER ──────────────────────────────────────────────────────────

function initFighterFilters() {
  const filterContainer = document.getElementById('fighter-filters');
  const searchInput = document.getElementById('fighter-search');
  if (!filterContainer) return;

  let activeFilter = 'all';
  let searchTerm = '';

  function applyFilters() {
    const cards = document.querySelectorAll('#fighters-container .fighter-card');
    cards.forEach(card => {
      const weightMatch = activeFilter === 'all' || card.dataset.weight === activeFilter;
      const nameMatch = !searchTerm || card.dataset.name.includes(searchTerm);
      card.style.display = weightMatch && nameMatch ? '' : 'none';
    });
  }

  filterContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    applyFilters();
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchTerm = searchInput.value.toLowerCase().trim();
      applyFilters();
    });
  }
}

// ─── HERO BANNER ─────────────────────────────────────────────────────────────

function renderHero() {
  const event = UPCOMING_EVENTS.find(e => e.type === 'ppv') || UPCOMING_EVENTS[0];
  const mainEvent = event.fights.find(f => f.tier === 'main') || event.fights[0];
  const f1 = getFighterOrPlaceholder(mainEvent.f1);
  const f2 = getFighterOrPlaceholder(mainEvent.f2);
  const pred = predictFight(f1, f2);

  const banner = document.getElementById('hero-banner');
  if (!banner) return;

  const hasF1Img = f1.image && f1.image.startsWith('./fighters/');
  const hasF2Img = f2.image && f2.image.startsWith('./fighters/');

  const heroSvgFallback = (fighter) => {
    const initials = getInitials(fighter);
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect width='120' height='120' rx='8' fill='%231a1a2e'/%3E%3Ctext x='60' y='75' font-size='36' font-weight='900' text-anchor='middle' fill='%23d62828' font-family='Arial'%3E${encodeURIComponent(initials)}%3C/text%3E%3C/svg%3E`;
  };

  const f1Photo = hasF1Img
    ? `<img class="hero-fighter-photo" src="${f1.image}" alt="${f1.name}" loading="eager" onerror="this.onerror=null;this.src='${heroSvgFallback(f1)}';">`
    : `<div class="hero-fighter-photo hero-fighter-initials">${f1.initials}</div>`;
  const f2Photo = hasF2Img
    ? `<img class="hero-fighter-photo" src="${f2.image}" alt="${f2.name}" loading="eager" onerror="this.onerror=null;this.src='${heroSvgFallback(f2)}';">`
    : `<div class="hero-fighter-photo hero-fighter-initials">${f2.initials}</div>`;

  banner.innerHTML = `
    <div class="hero-header">
      <div class="hero-event-label">${event.type === 'ppv' ? 'PPV Main Event' : 'Fight Night Main Event'}</div>
      <div class="hero-event-name">${event.name}</div>
      <div class="hero-event-meta">${event.date} · ${event.location}</div>
    </div>
    <div class="hero-matchup">
      <div class="hero-fighter hero-fighter--left">
        ${f1Photo}
        <div class="hero-fighter-name">${f1.name}</div>
        <div class="hero-fighter-record">${f1.record}</div>
      </div>
      <div class="hero-center">
        <div class="hero-vs">VS</div>
        <div class="hero-weight">${mainEvent.weight || ''}</div>
      </div>
      <div class="hero-fighter hero-fighter--right">
        ${f2Photo}
        <div class="hero-fighter-name">${f2.name}</div>
        <div class="hero-fighter-record">${f2.record}</div>
      </div>
    </div>
    <div class="hero-prob-bar-container">
      <div class="hero-prob-labels">
        <span>${f1.name.split(' ').pop()} ${pred.f1WinProb}%</span>
        <span>${pred.f2WinProb}% ${f2.name.split(' ').pop()}</span>
      </div>
      <div class="hero-prob-bar">
        <div class="hero-prob-fill hero-prob-fill--f1" data-width="${pred.f1WinProb}" style="width:0%"></div>
        <div class="hero-prob-fill hero-prob-fill--f2" data-width="${pred.f2WinProb}" style="width:0%"></div>
      </div>
      <div class="hero-ai-label">FightIQ AI Prediction</div>
    </div>
  `;

  setTimeout(animateBars, 80);
}

// ─── FIGHTER PROFILE MODAL ────────────────────────────────────────────────────

function openFighterModal(fighterId) {
  const fighter = ALL_FIGHTERS[fighterId];
  if (!fighter) return;

  const modal = document.getElementById('fighter-modal');
  if (!modal) return;

  // Photo
  const photoWrap = document.getElementById('modal-photo-wrap');
  const isLocal = fighter.image && fighter.image.startsWith('./fighters/');
  if (isLocal) {
    const svgFallback = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='120'%3E%3Crect width='100' height='120' rx='8' fill='%231a1a2e'/%3E%3Ctext x='50' y='72' font-size='32' font-weight='900' text-anchor='middle' fill='%23d62828' font-family='Arial'%3E${encodeURIComponent(fighter.initials)}%3C/text%3E%3C/svg%3E`;
    photoWrap.innerHTML = `<img src="${fighter.image}" alt="${fighter.name}" style="width:100%;height:100%;object-fit:cover;object-position:top center;" loading="lazy" onerror="this.onerror=null;this.src='${svgFallback}'">`;
  } else {
    photoWrap.innerHTML = `<div class="fighter-modal-photo-initials">${fighter.initials}</div>`;
  }

  // Identity
  document.getElementById('modal-fighter-name').textContent = fighter.name;
  const nicknameEl = document.getElementById('modal-nickname');
  nicknameEl.textContent = fighter.nickname ? `"${fighter.nickname}"` : '';
  nicknameEl.style.display = fighter.nickname ? '' : 'none';
  document.getElementById('modal-record').textContent = fighter.record;
  document.getElementById('modal-weight').textContent = `${fighter.weight} \u00b7 ${fighter.rank}`;
  const metaParts = [];
  if (fighter.stance) metaParts.push(fighter.stance);
  if (fighter.reach) metaParts.push(`${fighter.reach}" reach`);
  if (fighter.style) metaParts.push(fighter.style);
  document.getElementById('modal-meta').textContent = metaParts.join(' \u00b7 ');

  // Stats grid
  const s = fighter.stats;
  const finishPct = s.koPct + s.subPct;
  const statsEl = document.getElementById('modal-stats');
  statsEl.innerHTML = `
    <div class="fighter-modal-stats-title">Fighter Statistics</div>
    <div class="fighter-modal-stats-grid">
      <div class="fighter-modal-stat">
        <div class="fighter-modal-stat-val red">${s.slpm}</div>
        <div class="fighter-modal-stat-label">SLpM</div>
      </div>
      <div class="fighter-modal-stat">
        <div class="fighter-modal-stat-val">${s.strAcc}%</div>
        <div class="fighter-modal-stat-label">Str Acc</div>
      </div>
      <div class="fighter-modal-stat">
        <div class="fighter-modal-stat-val">${typeof s.sapm !== 'undefined' ? s.sapm : '\u2014'}</div>
        <div class="fighter-modal-stat-label">SApM</div>
      </div>
      <div class="fighter-modal-stat">
        <div class="fighter-modal-stat-val">${typeof s.strDef !== 'undefined' ? s.strDef + '%' : '\u2014'}</div>
        <div class="fighter-modal-stat-label">Str Def</div>
      </div>
      <div class="fighter-modal-stat">
        <div class="fighter-modal-stat-val gold">${s.tdAvg}</div>
        <div class="fighter-modal-stat-label">TD Avg</div>
      </div>
      <div class="fighter-modal-stat">
        <div class="fighter-modal-stat-val">${typeof s.tdAcc !== 'undefined' ? s.tdAcc + '%' : '\u2014'}</div>
        <div class="fighter-modal-stat-label">TD Acc</div>
      </div>
      <div class="fighter-modal-stat">
        <div class="fighter-modal-stat-val">${typeof s.tdDef !== 'undefined' ? s.tdDef + '%' : '\u2014'}</div>
        <div class="fighter-modal-stat-label">TD Def</div>
      </div>
      <div class="fighter-modal-stat">
        <div class="fighter-modal-stat-val green">${s.subAvg}</div>
        <div class="fighter-modal-stat-label">Sub Avg</div>
      </div>
    </div>
    <div class="fighter-modal-stats-grid" style="margin-top:8px;">
      <div class="fighter-modal-stat">
        <div class="fighter-modal-stat-val">${s.koPct}%</div>
        <div class="fighter-modal-stat-label">KO/TKO</div>
      </div>
      <div class="fighter-modal-stat">
        <div class="fighter-modal-stat-val">${s.subPct}%</div>
        <div class="fighter-modal-stat-label">Sub</div>
      </div>
      <div class="fighter-modal-stat">
        <div class="fighter-modal-stat-val">${s.decPct}%</div>
        <div class="fighter-modal-stat-label">Decision</div>
      </div>
      <div class="fighter-modal-stat">
        <div class="fighter-modal-stat-val gold">${finishPct}%</div>
        <div class="fighter-modal-stat-label">Finish %</div>
      </div>
    </div>
  `;

  // Sim button stores fighter id
  const simBtn = document.getElementById('modal-sim-btn');
  simBtn.dataset.fighterId = fighterId;

  // Show modal
  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  document.getElementById('fighter-modal-close').focus();
}

function closeFighterModal() {
  const modal = document.getElementById('fighter-modal');
  if (modal) {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }
}

function initFighterModal() {
  const modal = document.getElementById('fighter-modal');
  if (!modal) return;

  document.getElementById('fighter-modal-close').addEventListener('click', closeFighterModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeFighterModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeFighterModal();
  });

  document.getElementById('modal-sim-btn').addEventListener('click', () => {
    const fighterId = document.getElementById('modal-sim-btn').dataset.fighterId;
    closeFighterModal();
    document.querySelector('.tab-btn[data-tab="simulator"]').click();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const sel1 = document.getElementById('sim-f1');
    if (sel1 && ALL_FIGHTERS[fighterId]) {
      sel1.value = fighterId;
    }
  });
}

// ─── INIT ─────────────────────────────────────────────────────────────────────



document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initHamburger();
  renderHero();
  renderEvents();
  renderPredictions();
  populateSimSelects();
  renderBetting();
  renderFighters();
  initFighterFilters();
  initFighterModal();

  // Fighter card click -> open profile modal
  document.getElementById('fighters-container').addEventListener('click', (e) => {
    const card = e.target.closest('.fighter-card[data-fighter-id]');
    if (card) openFighterModal(card.dataset.fighterId);
  });
  document.getElementById('fighters-container').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.fighter-card[data-fighter-id]');
      if (card) { e.preventDefault(); openFighterModal(card.dataset.fighterId); }
    }
  });

  document.getElementById('sim-run-btn').addEventListener('click', runSimulator);

  // Nav link tab switching
  document.querySelectorAll('[data-goto-tab]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = a.dataset.gotoTab;
      document.querySelector(`.tab-btn[data-tab="${tab}"]`).click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
});
