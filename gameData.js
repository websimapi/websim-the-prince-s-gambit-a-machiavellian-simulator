// gameData.js - Holds the initial configuration for the game state and entities.

export const gameState = {
    politicalCapital: 50,
    publicPerception: 50,
    virtu: 50, // Represents player's agency, skill, decisiveness
    fortuna: 50, // Represents luck, chance, external events
    factionTrust: {
        medici: 50,
        papacy: 50,
        mercenaries: 50,
        people: 50
    }
};

export const factions = [
    {
        id: 'medici',
        name: 'The Medici Bank',
        portrait: 'medici-portrait.png',
        agenda: 'To restore our family to its former glory and control the city through finance and influence, not brute force.'
    },
    {
        id: 'papacy',
        name: 'The Papal Envoys',
        portrait: 'papal-envoy-portrait.png',
        agenda: 'To ensure Florence remains loyal to Rome and to root out heresy and dissent that threatens the Church\'s power.'
    },
    {
        id: 'mercenaries',
        name: 'The Mercenary Captains',
        portrait: 'mercenary-captain.png',
        agenda: 'To secure the most profitable contracts and ensure the state is always in need of our swords. A little instability is good for business.'
    },
    {
        id: 'people',
        name: 'The Florentine Populace',
        portrait: 'florentine-people.png',
        agenda: 'To have stable food prices, low taxes, and protection from both foreign armies and the excesses of the powerful.'
    }
];

export const eventTemplates = [
    {
        name: "Economic Proposal",
        description: "A faction proposes a new economic policy that will benefit them but may have wider consequences."
    },
    {
        name: "Rumor and Scandal",
        description: "A damaging rumor is spreading about a faction. You have the opportunity to amplify or quash it."
    },
    {
        name: "Foreign Diplomat",
        description: "A diplomat from a rival city-state arrives, offering a deal that could upset the balance of power."
    },
    {
        name: "Public Unrest",
        description: "A specific grievance has stirred the common people, who are threatening to riot."
    },
    {
        name: "Military Contract",
        description: "A need for military action arises, and a choice must be made on how to fund or deploy forces."
    }
];

