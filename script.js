import { gameState, factions, eventTemplates } from './gameData.js';
import * as AI from './ai.js';
import * as gsap from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen and show game
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        const gameContainer = document.getElementById('game-container');
        gameContainer.style.display = 'block';
        gsap.from(gameContainer, { opacity: 0, duration: 1 });
        
        initializeGame();
    }, 1000); 
});

function initializeGame() {
    updateUI();
    setupEventListeners();
    playBackgroundMusic();
}

function updateUI() {
    // Stats
    document.getElementById('capital-value').textContent = gameState.politicalCapital;
    document.getElementById('perception-value').textContent = gameState.publicPerception;

    // Virtu-Fortuna Meter
    const totalVf = gameState.virtu + gameState.fortuna;
    const virtuScale = Math.max(0.1, (gameState.virtu / totalVf) * 1.5);
    const fortunaScale = Math.max(0.1, (gameState.fortuna / totalVf) * 1.5);
    gsap.to('#virtu-serpent', { scale: virtuScale, duration: 0.5 });
    gsap.to('#fortuna-serpent', { scale: fortunaScale, duration: 0.5 });

    // Factions
    const factionList = document.getElementById('faction-list');
    factionList.innerHTML = '';
    factions.forEach(f => {
        const trust = gameState.factionTrust[f.id];
        const entry = document.createElement('div');
        entry.className = 'faction-entry';
        entry.innerHTML = `
            <img src="${f.portrait}" alt="${f.name}" class="faction-portrait">
            <div class="faction-info">
                <div class="faction-name">${f.name}</div>
                <div class="trust-bar-container">
                    <div class="trust-bar" style="width: ${trust}%; background-color: ${trust < 30 ? '#c62828' : trust < 70 ? '#a98c2c' : '#2e7d32'};"></div>
                </div>
            </div>
        `;
        factionList.appendChild(entry);
    });
}

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if(sound) {
        sound.currentTime = 0;
        sound.play();
    }
}

function setupEventListeners() {
    document.getElementById('next-turn-button').addEventListener('click', () => {
        playSound('wax-seal-sound');
        startNewEvent();
    });

    document.getElementById('get-advice-button').addEventListener('click', async () => {
        playSound('ui-click-sound');
        const prompt = document.getElementById('advisor-prompt').textContent;
        const responseContainer = document.getElementById('advisor-response-container');
        const responseEl = document.getElementById('advisor-response');
        const loadingEl = responseContainer.querySelector('.loading-text');

        responseEl.textContent = '';
        loadingEl.style.display = 'block';

        const advice = await AI.getAdvice(prompt, gameState, factions);
        
        loadingEl.style.display = 'none';
        responseEl.textContent = advice;
    });

    document.getElementById('codex-toggle').addEventListener('click', () => {
        playSound('ui-click-sound');
        document.getElementById('codex-panel').classList.toggle('collapsed');
    });
}

async function startNewEvent() {
    const eventPanel = document.getElementById('event-panel');
    const titleEl = document.getElementById('event-title');
    const descEl = document.getElementById('event-description');
    const choicesEl = document.getElementById('event-choices');

    gsap.to(eventPanel, { opacity: 0.5, filter: 'blur(5px)', duration: 0.3 });

    // AI generates the event
    const eventData = await AI.generateEvent(gameState, factions, eventTemplates);

    titleEl.textContent = eventData.title;
    descEl.textContent = eventData.description;
    choicesEl.innerHTML = '';

    eventData.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-button';
        button.textContent = choice.text;
        button.onclick = () => {
            playSound('ui-click-sound');
            resolveChoice(choice);
        };
        choicesEl.appendChild(button);
    });

    gsap.to(eventPanel, { opacity: 1, filter: 'blur(0px)', duration: 0.5 });
    document.getElementById('next-turn-button').style.display = 'none';
}

function resolveChoice(choice) {
    const outcome = choice.outcome;
    const choicesEl = document.getElementById('event-choices');
    const descEl = document.getElementById('event-description');

    choicesEl.innerHTML = '';
    descEl.innerHTML += `<hr><p><em>${outcome.text}</em></p>`;

    // Apply stat changes
    for (const key in outcome.statChanges) {
        if (gameState.hasOwnProperty(key)) {
            gameState[key] = Math.max(0, Math.min(100, gameState[key] + outcome.statChanges[key]));
        } else if (gameState.factionTrust.hasOwnProperty(key)) {
            gameState.factionTrust[key] = Math.max(0, Math.min(100, gameState.factionTrust[key] + outcome.statChanges[key]));
        }
    }
    
    // Fortuna vs Virtu shift
    gameState.fortuna = Math.max(10, Math.min(90, gameState.fortuna + 5)); // Every turn has an element of chance
    gameState.virtu = 100 - gameState.fortuna;

    updateUI();
    playBackgroundMusic();
    document.getElementById('next-turn-button').style.display = 'block';
}

function playBackgroundMusic() {
    const musicMajor = document.getElementById('music-major');
    const musicMinor = document.getElementById('music-minor');
    
    const stability = (gameState.politicalCapital + gameState.publicPerception) / 2;

    if (stability > 55) {
        musicMinor.pause();
        if (musicMajor.paused) musicMajor.play().catch(e => console.log("Playback prevented"));
    } else if (stability < 45) {
        musicMajor.pause();
        if (musicMinor.paused) musicMinor.play().catch(e => console.log("Playback prevented"));
    } else {
         if (musicMajor.paused && musicMinor.paused) {
             musicMajor.play().catch(e => console.log("Playback prevented"));
         }
    }
}