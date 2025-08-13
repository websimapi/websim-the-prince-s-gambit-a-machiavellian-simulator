// ai.js - Module for all Language Model interactions

/**
 * Generates a dynamic political event using an AI model.
 * @param {object} gameState The current state of the game.
 * @param {object[]} factions An array of faction objects.
 * @param {object[]} eventTemplates A list of potential event structures.
 * @returns {Promise<object>} A fully-formed event object with a title, description, and choices.
 */
export async function generateEvent(gameState, factions, eventTemplates) {
    const randomTemplate = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
    const involvedFaction = factions[Math.floor(Math.random() * factions.length)];

    const systemPrompt = `
You are a master storyteller for a Machiavellian political simulator set in Renaissance Florence. Your task is to generate a compelling political event.
The player is Niccolò Machiavelli, acting as an advisor.
Current game state:
- Political Capital: ${gameState.politicalCapital} (ability to enact policies)
- Public Perception: ${gameState.publicPerception} (popularity with the masses)
- Faction Trust: ${JSON.stringify(gameState.factionTrust)}
- The primary faction involved in this event is the ${involvedFaction.name}, known for: "${involvedFaction.agenda}".

Based on the template: "${randomTemplate.name}: ${randomTemplate.description}", create a specific, narrative event.
The event must feel grounded in the Renaissance period.

Respond with a JSON object following this exact schema and no other text:
{
  "title": "A concise, evocative title for the event",
  "description": "A rich, detailed description of the situation facing Machiavelli. Use 2-3 sentences. Mention the faction: ${involvedFaction.name}.",
  "choices": [
    {
      "text": "A description of the first choice. This should be a Machiavellian, pragmatic, or cunning option.",
      "outcome": {
        "text": "A narrative description of the immediate consequence of this choice.",
        "statChanges": {
          "politicalCapital": <integer>,
          "publicPerception": <integer>,
          "${involvedFaction.id}": <integer>
        }
      }
    },
    {
      "text": "A description of the second choice. This could be a more cautious, aggressive, or deceptive option.",
      "outcome": {
        "text": "A narrative description of the immediate consequence of this choice.",
        "statChanges": {
          "politicalCapital": <integer>,
          "publicPerception": <integer>,
          "${involvedFaction.id}": <integer>
        }
      }
    }
  ]
}
Stat changes should be integers, typically between -15 and 15. The two choices should have different trade-offs in their statChanges.
`;

    try {
        const completion = await websim.chat.completions.create({
            messages: [{ role: 'system', content: systemPrompt }],
            json: true,
        });
        return JSON.parse(completion.content);
    } catch (error) {
        console.error("Error generating event:", error);
        // Return a fallback event in case of AI failure
        return {
            title: "A Moment of Silence",
            description: `The city holds its breath, Your Excellency. A strange quiet has fallen over Florence, the kind that precedes either a festival or a funeral. The ${involvedFaction.name} are watchful. What is your next move?`,
            choices: [{
                text: "Observe and wait.",
                outcome: {
                    text: "Patience is a virtue. You wait for your rivals to show their hand.",
                    statChanges: { politicalCapital: 1, publicPerception: 0, [involvedFaction.id]: 0 }
                }
            },{
                text: "Send out spies.",
                outcome: {
                    text: "Knowledge is power, but it comes at a cost. Your agents disperse into the city's shadows.",
                    statChanges: { politicalCapital: -5, publicPerception: 0, [involvedFaction.id]: 2 }
                }
            }]
        };
    }
}

/**
 * Generates strategic advice from the AI.
 * @param {string} prompt The user's query for the advisor.
 * @param {object} gameState The current state of the game.
 * @param {object[]} factions An array of faction objects.
 * @returns {Promise<string>} The AI-generated advice as a string.
 */
export async function getAdvice(prompt, gameState, factions) {
    const systemPrompt = `
You are a brilliant, ruthless political strategist in the vein of Niccolò Machiavelli, advising your master. Your tone is sharp, insightful, and focused on the acquisition and maintenance of power. You do not waste words.
The current situation in Florence is as follows:
- Political Capital: ${gameState.politicalCapital}
- Public Perception: ${gameState.publicPerception}
- Faction Trust: ${JSON.stringify(gameState.factionTrust)}
- Faction Agendas: ${factions.map(f => `${f.name}: ${f.agenda}`).join('; ')}

Your master has asked: "${prompt}"

Provide a concise, actionable piece of strategic advice. Address your master directly ("Your Excellency," "My Prince," etc.). Focus on the interplay between perception, power, and opportunity (Virtù and Fortuna). Your response should be a single paragraph.
`;

    try {
        const completion = await websim.chat.completions.create({
            messages: [{ role: 'system', content: systemPrompt }],
        });
        return completion.content;
    } catch (error) {
        console.error("Error getting advice:", error);
        return "My Prince, the channels of intelligence are clouded at this moment. We must rely on our own judgment until the fog of uncertainty clears.";
    }
}

