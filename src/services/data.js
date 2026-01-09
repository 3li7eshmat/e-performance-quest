
// Mock Database
const USERS = [
    { id: 'ali', username: 'Ali.Heshmat', role: 'admin', name: 'Ali Heshmat' },
    { id: 'mohamed', username: 'Mohamed.MFmahmoud', role: 'admin', name: 'Mohamed Mahmoud' },
    { id: 'remon', username: 'Remon.Noshy', role: 'agent', name: 'Remon Noshy' },
    { id: 'shenoda', username: 'Shenoda.Botros', role: 'agent', name: 'Shenoda Botros' },
    { id: 'ahmed', username: 'Ahmed.Abir', role: 'agent', name: 'Ahmed Abir' },
    { id: 'abdelazem', username: 'Abdelazem.Mohamed', role: 'agent', name: 'Abdelazem Mohamed' },
];

const INITIAL_STATS = {
    'ali': { aht: 310, csat: 85, fcr: 75, attendance: 5, xp: 1200, level: 3, badges: ['speedster'] },
    'mohamed': { aht: 300, csat: 90, fcr: 80, attendance: 10, xp: 1500, level: 4, badges: ['leader'] },
    'remon': { aht: 350, csat: 82, fcr: 70, attendance: 3, xp: 800, level: 2, badges: [] },
    'shenoda': { aht: 290, csat: 88, fcr: 78, attendance: 7, xp: 1300, level: 3, badges: ['solver'] },
    'ahmed': { aht: 400, csat: 75, fcr: 65, attendance: 1, xp: 500, level: 1, badges: [] },
    'abdelazem': { aht: 320, csat: 84, fcr: 74, attendance: 4, xp: 950, level: 2, badges: [] },
};

// Local Storage Key
const DB_KEY = 'e_quest_db';

// Initialize DB if empty
const initDB = () => {
    if (!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_STATS));
    }
};

export const getAgents = () => {
    initDB();
    const stats = JSON.parse(localStorage.getItem(DB_KEY));
    return USERS.map(user => ({
        ...user,
        stats: stats[user.id] || { aht: 0, csat: 0, fcr: 0, attendance: 0, xp: 0, level: 1, badges: [] }
    }));
};

export const updateAgentStats = (agentId, newStats) => {
    initDB();
    const stats = JSON.parse(localStorage.getItem(DB_KEY));
    if (stats[agentId]) {
        stats[agentId] = { ...stats[agentId], ...newStats };
        // Recalculate XP/Level logic could go here
        localStorage.setItem(DB_KEY, JSON.stringify(stats));
        return true;
    }
    return false;
};

export const calculatePowerScore = (stats) => {
    // Weighted Formula: 
    // CSAT (40%) + FCR (40%) + AHT_Score (20%)
    // AHT Score: inverse (lower is better). Target 300s (5min). 
    // Simple logic: If AHT < 300, score 100. Else decay.

    const csatScore = stats.csat; // Max 100
    const fcrScore = stats.fcr; // Max 100

    // AHT Score calculation
    let ahtScore = 0;
    if (stats.aht <= 300) ahtScore = 100;
    else ahtScore = Math.max(0, 100 - ((stats.aht - 300) / 3)); // Lose points for every second over

    const powerScore = (csatScore * 0.4) + (fcrScore * 0.4) + (ahtScore * 0.2);
    return Math.round(powerScore);
};

export const getUsers = () => USERS;
