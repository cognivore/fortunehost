export type LeadershipSkills = {
    brawl: boolean;
    commander: boolean;
    oathbreaker: boolean;
};

export type ForeignData = {
    faceName?: string;
    flavorText?: string;
    identifiers: Identifiers;
    language: string;
    name: string;
    text?: string;
    type?: string;
};

export type Identifiers = {
    cardKingdomEtchedId?: string;
    cardKingdomFoilId?: string;
    cardKingdomId?: string;
    cardsphereId?: string;
    cardsphereFoilId?: string;
    cardtraderId?: string;
    csiId?: string;
    mcmId?: string;
    mcmMetaId?: string;
    miniaturemarketId?: string;
    mtgArenaId?: string;
    mtgjsonFoilVersionId?: string;
    mtgjsonNonFoilVersionId?: string;
    mtgjsonV4Id?: string;
    mtgoFoilId?: string;
    mtgoId?: string;
    multiverseId?: string;
    scgId?: string;
    scryfallId?: string;
    scryfallCardBackId?: string;
    scryfallOracleId?: string;
    scryfallIllustrationId?: string;
    tcgplayerProductId?: string;
    tcgplayerEtchedProductId?: string;
};

export type CardAtomic = {
    asciiName?: string;
    attractionLights?: number[];
    colorIdentity: string[];
    colorIndicator?: string[];
    colors: string[];
    convertedManaCost: number;
    defense?: string;
    edhrecRank?: number;
    edhrecSaltiness?: number;
    faceConvertedManaCost?: number;
    faceManaValue?: number;
    faceName?: string;
    firstPrinting?: string;
    foreignData?: ForeignData[];
    hand?: string;
    hasAlternativeDeckLimit?: boolean;
    identifiers: Identifiers;
    isFunny?: boolean;
    isReserved?: boolean;
    keywords?: string[];
    layout: string;
    leadershipSkills?: LeadershipSkills;
    legalities: Legalities;
    life?: string;
    loyalty?: string;
    manaCost?: string;
    manaValue: number;
    name: string;
    power?: string;
    printings?: string[];
    purchaseUrls: PurchaseUrls;
    relatedCards: RelatedCards;
    rulings?: Rulings[];
    side?: string;
    subsets?: string[];
    subtypes: string[];
    supertypes: string[];
    text?: string;
    toughness?: string;
    type: string;
    types: string[];
};

export type Legalities = {
    alchemy?: string;
    brawl?: string;
    commander?: string;
    duel?: string;
    explorer?: string;
    future?: string;
    gladiator?: string;
    historic?: string;
    historicbrawl?: string;
    legacy?: string;
    modern?: string;
    oathbreaker?: string;
    oldschool?: string;
    pauper?: string;
    paupercommander?: string;
    penny?: string;
    pioneer?: string;
    predh?: string;
    premodern?: string;
    standard?: string;
    standardbrawl?: string;
    timeless?: string;
    vintage?: string;
};

export type PurchaseUrls = {
    cardKingdom?: string;
    cardKingdomEtched?: string;
    cardKingdomFoil?: string;
    cardmarket?: string;
    tcgplayer?: string;
    tcgplayerEtched?: string;
};

export type RelatedCards = {
    reverseRelated?: string[];
    spellbook?: string[];
};

export type Rulings = {
    date: string;
    text: string;
};

import * as fs from 'fs';

function readAtomicCards(): CardAtomic[] {
    // Read JSON
    const raw = fs.readFileSync('priv/AtomicCards.json');
    console.log(`Read ${raw.length} bytes`);
    const atomicCards: { data: Record<string, CardAtomic[]> } = JSON.parse(raw.toString());
    // For each atomicCard key, pick the first card in the value array
    const cards = Object.values(atomicCards.data).map((cards) => cards[0]);
    return cards;
}

function singleWordCardNames(): string[] {
    const atomic = fs.statSync('priv/AtomicCards.json');
    // Check if fortune file exists
    try {
        const fortune = fs.statSync('priv/fortune/mtg.json');
        if (atomic.mtimeMs < fortune.mtimeMs) {
            const raw = fs.readFileSync('priv/fortune/mtg.json');
            return JSON.parse(raw.toString());
        }
    } catch (_) {
        // Make fortune directory
        try {
            fs.mkdirSync('priv/fortune');
        } catch (_) {
        }
    }
    const singleWordCardNames = (readAtomicCards()).filter((card) => card.name.split(' ').length === 1).map((card) => card.name);
    fs.writeFileSync('priv/fortune/mtg.json', JSON.stringify(singleWordCardNames));
    return singleWordCardNames;
}

function fortune(candidates: string[], n: number): string[] {
    const shuffled = candidates.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
}

// Now take the number as an optional argument and run fortune
const n = process.argv[2] ? parseInt(process.argv[2]) : 1;
const candidates = singleWordCardNames();
const result = fortune(candidates, n);
console.log(result);
