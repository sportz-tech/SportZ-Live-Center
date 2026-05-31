const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { mockFootballMatches, mockCricketMatches, mockWorldCupStandings, mockWorldCupTopscorers } = require('./mockData');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// MongoDB Atlas Connection Setup
const MONGODB_URI = process.env.MONGODB_URI;
let useMongoDB = false;

// Poll Mongoose Schema
const PollSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  matchId: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  votes: { type: [Number], required: true },
  voters: [{
    name: { type: String, required: true },
    email: { type: String, required: true }
  }]
});

const PollModel = mongoose.model('Poll', PollSchema);

// User Mongoose Schema
const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  country: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  status: { type: String, default: 'normal' },
  licenseKey: { type: String, default: null }
});

const UserModel = mongoose.model('User', UserSchema);

// License Mongoose Schema
const LicenseSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }
});

const LicenseModel = mongoose.model('License', LicenseSchema);

// Settings Mongoose Schema
const SettingsSchema = new mongoose.Schema({
  adsEnabled: { type: Boolean, default: true },
  adClient: { type: String, default: 'ca-pub-5739201948' },
  adSlots: {
    sidebar: { type: String, default: '5739201948' },
    header: { type: String, default: '9283748291' }
  },
  supportEmail: { type: String, default: 'cricbuzz756@gmail.com' }
});

const SettingsModel = mongoose.model('Settings', SettingsSchema);

// SupportQuery Mongoose Schema
const SupportQuerySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  name: { type: String, default: 'Developer' },
  email: { type: String, default: 'N/A' },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'pending' },
  forwardedTo: { type: String, default: 'cricbuzz756@gmail.com' },
  timestamp: { type: String, default: () => new Date().toISOString() }
});

const SupportQueryModel = mongoose.model('SupportQuery', SupportQuerySchema);

// Connection establishment
if (MONGODB_URI && MONGODB_URI !== 'your_mongodb_atlas_connection_string_here') {
  mongoose.connect(MONGODB_URI)
    .then(async () => {
      console.log("Connected successfully to MongoDB Atlas.");
      useMongoDB = true;
      await initMongoPolls();
      await initMongoUsers();
      await initMongoLicenses();
      await initMongoSettings();
      await initMongoSupportQueries();
    })
    .catch(err => {
      console.error("MongoDB Atlas connection failed. Falling back to local data files. Error:", err.message);
    });
} else {
  console.log("No valid MONGODB_URI found in env. Falling back to local data files storage.");
}

// Seed default polls to MongoDB if collection is empty
async function initMongoPolls() {
  try {
    const count = await PollModel.countDocuments();
    if (count === 0) {
      const defaultPolls = [
        {
          id: "p-fb-1",
          matchId: "fb-1",
          question: "Who will win the London Derby?",
          options: ["Arsenal", "Chelsea", "Draw"],
          votes: [124, 89, 45],
          voters: [
            { name: "Test User", email: "test@example.com" },
            { name: "SportZ User", email: "user@sportz.com" }
          ]
        },
        {
          id: "p-cr-1",
          matchId: "cr-1",
          question: "Will CSK chase down 188 runs?",
          options: ["Yes, they will!", "No, MI will defend it!"],
          votes: [412, 388],
          voters: []
        }
      ];
      await PollModel.insertMany(defaultPolls);
      console.log("Seeded default polls to MongoDB Atlas.");
    }
  } catch (err) {
    console.error("Error seeding default polls to MongoDB:", err.message);
  }
}

// Seed/Migrate users from users.json to MongoDB if empty
async function initMongoUsers() {
  try {
    const count = await UserModel.countDocuments();
    if (count === 0) {
      const localUsers = readUsers();
      if (localUsers && localUsers.length > 0) {
        await UserModel.insertMany(localUsers);
        console.log(`Migrated ${localUsers.length} users from users.json to MongoDB.`);
      }
    }
  } catch (err) {
    console.error("Error migrating users to MongoDB:", err.message);
  }
}

// Seed/Migrate licenses from licenses.json to MongoDB if empty
async function initMongoLicenses() {
  try {
    const count = await LicenseModel.countDocuments();
    if (count === 0) {
      const localLicenses = readLicenses();
      if (localLicenses && localLicenses.length > 0) {
        const licenseDocs = localLicenses.map(key => ({ key }));
        await LicenseModel.insertMany(licenseDocs);
        console.log(`Migrated ${localLicenses.length} licenses from licenses.json to MongoDB.`);
      }
    }
  } catch (err) {
    console.error("Error migrating licenses to MongoDB:", err.message);
  }
}

// Seed/Migrate settings from settings.json to MongoDB if empty
async function initMongoSettings() {
  try {
    const count = await SettingsModel.countDocuments();
    if (count === 0) {
      const localSettings = readSettings();
      await SettingsModel.create(localSettings);
      console.log("Migrated settings from settings.json to MongoDB.");
    }
  } catch (err) {
    console.error("Error migrating settings to MongoDB:", err.message);
  }
}

// Seed/Migrate support queries from support_queries.json to MongoDB if empty
async function initMongoSupportQueries() {
  try {
    const count = await SupportQueryModel.countDocuments();
    if (count === 0) {
      const localQueries = readSupportQueries();
      if (localQueries && localQueries.length > 0) {
        await SupportQueryModel.insertMany(localQueries);
        console.log(`Migrated ${localQueries.length} support queries from support_queries.json to MongoDB.`);
      }
    }
  } catch (err) {
    console.error("Error migrating support queries to MongoDB:", err.message);
  }
}

// Poll database file path
const POLLS_FILE = path.join(__dirname, 'polls.json');

// Initialize local cache from mock data
let matchesCache = {
  football: JSON.parse(JSON.stringify(mockFootballMatches)),
  cricket: JSON.parse(JSON.stringify(mockCricketMatches))
};

// Caching layer for Sportmonks proxy REST endpoints
const proxyCache = new Map();
const CACHE_TTL = 60000; // 60 seconds

// Custom HTTP Error to carry status code
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Track active, in-flight promises to coalesce duplicate concurrent requests
const activeRequests = new Map();

async function getCachedOrFetch(cacheKey, fetchFn) {
  // 1. Check cache first
  if (proxyCache.has(cacheKey)) {
    const cachedData = proxyCache.get(cacheKey);
    if (Date.now() - cachedData.timestamp < CACHE_TTL) {
      console.log(`[PROXY CACHE HIT] ${cacheKey}`);
      return cachedData.data;
    }
  }

  // 2. Check if there is an active request in progress
  if (activeRequests.has(cacheKey)) {
    console.log(`[PROXY COALESCE] Joining existing in-flight request for: ${cacheKey}`);
    return activeRequests.get(cacheKey);
  }

  console.log(`[PROXY CACHE MISS] Initiating fresh fetch for: ${cacheKey}`);

  // 3. Create the fetch promise
  const fetchPromise = (async () => {
    try {
      const data = await fetchFn();
      proxyCache.set(cacheKey, { timestamp: Date.now(), data });
      return data;
    } finally {
      activeRequests.delete(cacheKey);
    }
  })();

  activeRequests.set(cacheKey, fetchPromise);
  return fetchPromise;
}



// Initialize polls if not exist
function initPolls() {
  if (!fs.existsSync(POLLS_FILE)) {
    const defaultPolls = [
      {
        id: "p-fb-1",
        matchId: "fb-1",
        question: "Who will win the London Derby?",
        options: ["Arsenal", "Chelsea", "Draw"],
        votes: [124, 89, 45],
        voters: [
          { name: "Test User", email: "test@example.com" },
          { name: "SportZ User", email: "user@sportz.com" }
        ]
      },
      {
        id: "p-cr-1",
        matchId: "cr-1",
        question: "Will CSK chase down 188 runs?",
        options: ["Yes, they will!", "No, MI will defend it!"],
        votes: [412, 388],
        voters: []
      }
    ];
    fs.writeFileSync(POLLS_FILE, JSON.stringify(defaultPolls, null, 2));
  }
}
initPolls();

function readPolls() {
  try {
    const data = fs.readFileSync(POLLS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writePolls(polls) {
  try {
    fs.writeFileSync(POLLS_FILE, JSON.stringify(polls, null, 2));
    return true;
  } catch (err) {
    return false;
  }
}

// Helper to broadcast WebSocket messages to all clients
function broadcast(type, data) {
  const message = JSON.stringify({ type, data });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// SPORTMONKS API V3 SYNCHRONIZATION ENGINE
const API_TOKEN = process.env.SPORTMONKS_API_TOKEN;

async function syncSportmonksData() {
  if (!API_TOKEN) return;
  console.log("Syncing live scores from Sportmonks V3 API...");
  
  try {
    // 1. Fetch Football Live Fixtures (using semicolon V3 includes & livescores endpoint)
    const fbUrl = `https://api.sportmonks.com/v3/football/livescores/inplay?api_token=${API_TOKEN}&include=participants;statistics;events;comments;lineups.player;scores;periods;league.country;round`;
    const fbRes = await fetch(fbUrl);
    if (fbRes.ok) {
      const fbJson = await fbRes.json();
      if (fbJson.data && fbJson.data.length > 0) {
        const activeLiveFootball = fbJson.data.map(transformFootballFixture).filter(Boolean);
        // Merge or replace live football matches in cache
        activeLiveFootball.forEach(liveMatch => {
          const idx = matchesCache.football.findIndex(m => m.id === liveMatch.id);
          if (idx !== -1) matchesCache.football[idx] = liveMatch;
          else matchesCache.football.unshift(liveMatch);
          broadcast('MATCH_UPDATE', liveMatch);
        });
      }
    }

    // 2. Fetch Cricket Live Fixtures
    const crUrl = `https://api.sportmonks.com/v3/cricket/fixtures?api_token=${API_TOKEN}&include=runs;livescores;lineups;events;commentaries`;
    const crRes = await fetch(crUrl);
    if (crRes.ok) {
      const crJson = await crRes.json();
      if (crJson.data && crJson.data.length > 0) {
        const activeLiveCricket = crJson.data.map(transformCricketFixture).filter(Boolean);
        // Merge/update live cricket matches in cache
        activeLiveCricket.forEach(liveMatch => {
          const idx = matchesCache.cricket.findIndex(m => m.id === liveMatch.id);
          if (idx !== -1) matchesCache.cricket[idx] = liveMatch;
          else matchesCache.cricket.unshift(liveMatch);
          broadcast('MATCH_UPDATE', liveMatch);
        });
      }
    }
  } catch (error) {
    console.error("Error syncing from Sportmonks V3:", error);
  }
}

// Convert V3 Football Fixture JSON into SportZ UI Schema
function transformFootballFixture(v3) {
  try {
    const home = v3.participants?.find(p => p.meta?.location === 'home') || { name: 'Home Team', image_path: '🔴' };
    const away = v3.participants?.find(p => p.meta?.location === 'away') || { name: 'Away Team', image_path: '🔵' };

    // Format statistics
    const statsObj = {
      possession: { home: 50, away: 50 },
      shots: { home: 0, away: 0 },
      shotsOnTarget: { home: 0, away: 0 },
      corners: { home: 0, away: 0 },
      fouls: { home: 0, away: 0 },
      yellowCards: { home: 0, away: 0 },
      redCards: { home: 0, away: 0 }
    };

    if (v3.statistics) {
      v3.statistics.forEach(s => {
        const type = s.type?.name?.toLowerCase() || '';
        const isHome = s.location === 'home';
        const val = parseInt(s.value) || 0;
        if (type.includes('possession')) {
          if (isHome) { statsObj.possession.home = val; statsObj.possession.away = 100 - val; }
          else { statsObj.possession.away = val; statsObj.possession.home = 100 - val; }
        } else if (type.includes('target')) {
          if (isHome) statsObj.shotsOnTarget.home = val; else statsObj.shotsOnTarget.away = val;
        } else if (type.includes('shot')) {
          if (isHome) statsObj.shots.home = val; else statsObj.shots.away = val;
        } else if (type.includes('corner')) {
          if (isHome) statsObj.corners.home = val; else statsObj.corners.away = val;
        } else if (type.includes('foul')) {
          if (isHome) statsObj.fouls.home = val; else statsObj.fouls.away = val;
        } else if (type.includes('yellow')) {
          if (isHome) statsObj.yellowCards.home = val; else statsObj.yellowCards.away = val;
        } else if (type.includes('red')) {
          if (isHome) statsObj.redCards.home = val; else statsObj.redCards.away = val;
        }
      });
    }

    // Format events timeline
    const timeline = (v3.events || []).map(e => ({
      id: `e-${e.id}`,
      minute: e.minute,
      type: e.type?.name?.toLowerCase().includes('goal') ? 'goal' : e.type?.name?.toLowerCase().includes('yellow') ? 'yellow' : e.type?.name?.toLowerCase().includes('red') ? 'red' : 'event',
      team: e.participant_id === home.id ? 'home' : 'away',
      player: e.player?.common_name || e.player_name || 'Player',
      detail: e.type?.name || 'Match Event'
    }));

    // Format comments logs
    const commentary = (v3.comments || []).map(c => ({
      id: `c-${c.id}`,
      minute: c.minute ? `${c.minute}'` : '',
      text: c.comment
    }));

    return {
      id: `fb-${v3.id}`,
      sport: 'football',
      status: v3.inplay ? 'live' : (v3.state_id === 5 ? 'recent' : 'upcoming'),
      league: v3.league?.name || 'League',
      homeTeam: { id: `t-${home.id}`, name: home.name, logo: home.image_path || '🔴', shortName: home.short_code || 'HOM' },
      awayTeam: { id: `t-${away.id}`, name: away.name, logo: away.image_path || '🔵', shortName: away.short_code || 'AWA' },
      score: {
        home: (v3.scores && Array.isArray(v3.scores) && v3.scores.find(s => s.description === 'CURRENT' && s.score?.participant === 'home')?.score?.goals) || 0,
        away: (v3.scores && Array.isArray(v3.scores) && v3.scores.find(s => s.description === 'CURRENT' && s.score?.participant === 'away')?.score?.goals) || 0
      },
      time: v3.inplay ? `${v3.minute || 0}'` : 'Upcoming',
      venue: v3.venue?.name || 'Stadium',
      stats: statsObj,
      lineups: null,
      timeline,
      commentary
    };
  } catch (err) {
    return null;
  }
}

// Convert V3 Cricket Fixture JSON into SportZ UI Schema
function transformCricketFixture(v3) {
  try {
    const home = v3.participants?.find(p => p.meta?.location === 'home') || { name: 'Home', image_path: '💙' };
    const away = v3.participants?.find(p => p.meta?.location === 'away') || { name: 'Away', image_path: '💛' };

    const homeRuns = v3.runs?.find(r => r.team_id === home.id) || { score: 0, wickets: 0, overs: '0' };
    const awayRuns = v3.runs?.find(r => r.team_id === away.id) || { score: 0, wickets: 0, overs: '0' };

    const commentary = (v3.commentaries || []).map(c => ({
      id: `c-${c.id}`,
      over: c.over ? `${c.over}` : '',
      text: c.comment
    }));

    return {
      id: `cr-${v3.id}`,
      sport: 'cricket',
      status: v3.inplay ? 'live' : 'upcoming',
      league: v3.league?.name || 'League',
      homeTeam: { id: `t-${home.id}`, name: home.name, logo: home.image_path || '💙', shortName: home.short_code || 'HOM' },
      awayTeam: { id: `t-${away.id}`, name: away.name, logo: away.image_path || '💛', shortName: away.short_code || 'AWA' },
      score: { home: `${homeRuns.score}/${homeRuns.wickets} (${homeRuns.overs} Ov)`, away: `${awayRuns.score}/${awayRuns.wickets} (${awayRuns.overs} Ov)` },
      time: v3.inplay ? 'In Play' : 'Upcoming',
      venue: v3.venue?.name || 'Stadium',
      liveState: {
        currentInnings: v3.runs?.length || 1,
        overs: awayRuns.overs || '0',
        score: awayRuns.score || 0,
        wickets: awayRuns.wickets || 0,
        batsmen: [],
        bowler: { name: 'Active Bowler', overs: '0', wickets: 0, runs: 0, economy: '0.00' }
      },
      chartData: { overs: [0], homeRunRate: [0], awayRunRate: [0] },
      lineups: null,
      timeline: [],
      commentary
    };
  } catch (err) {
    return null;
  }
}

// Background simulator loop (progression fallback)
function autoSimulateMatchProgression() {
  // 1. Update Football Live Match (fb-1: Arsenal vs Chelsea)
  const fbMatch = matchesCache.football.find(m => m.id === 'fb-1' && m.status === 'live');
  if (fbMatch) {
    let currentMin = parseInt(fbMatch.time);
    if (!isNaN(currentMin) && currentMin < 90) {
      currentMin += 1;
      fbMatch.time = currentMin + "'";
      
      const rand = Math.random();
      if (rand > 0.85) {
        const scorer = Math.random() > 0.5 ? {team: 'home', player: 'Martin Ødegaard', teamName: 'Arsenal'} : {team: 'away', player: 'Cole Palmer', teamName: 'Chelsea'};
        if (scorer.team === 'home') fbMatch.score.home += 1;
        else fbMatch.score.away += 1;
        
        const goalEvent = {
          id: 'e-' + Date.now(),
          minute: currentMin,
          type: 'goal',
          team: scorer.team,
          player: scorer.player,
          detail: 'Superb strike from distance!'
        };
        fbMatch.timeline.unshift(goalEvent);
        
        const commText = `GOAL!! What a brilliant piece of football! ${scorer.player} finds the back of the net for ${scorer.teamName}! Score is now Arsenal ${fbMatch.score.home} - ${fbMatch.score.away} Chelsea.`;
        fbMatch.commentary.unshift({
          id: 'c-' + Date.now(),
          minute: currentMin + "'",
          text: commText
        });
        
        broadcast('MATCH_UPDATE', fbMatch);
      } else if (rand > 0.70) {
        const randomComments = [
          "Arsenal dominating possession, trying to find a gap in Chelsea's tight defence.",
          "Chelsea driving forward on the counter-attack, but Saliba cuts off the passing lane.",
          "A corner kick for Arsenal is cleared out by Wesley Fofana with a strong header.",
          "Foul in the midfield. Referee stops play but keeps cards in pocket.",
          "Cole Palmer attempts a through ball, but it has too much power and goes out for a goal kick."
        ];
        const text = randomComments[Math.floor(Math.random() * randomComments.length)];
        fbMatch.commentary.unshift({
          id: 'c-' + Date.now(),
          minute: currentMin + "'",
          text: text
        });
        
        broadcast('MATCH_UPDATE', fbMatch);
      }
    }
  }

  // 2. Update Cricket Live Match (cr-1: MI vs CSK)
  const crMatch = matchesCache.cricket.find(m => m.id === 'cr-1' && m.status === 'live');
  if (crMatch && crMatch.liveState) {
    let overs = parseFloat(crMatch.liveState.overs);
    let oversInt = Math.floor(overs);
    let balls = Math.round((overs - oversInt) * 10);
    
    if (overs < 20) {
      balls += 1;
      if (balls >= 6) {
        oversInt += 1;
        balls = 0;
      }
      const newOversStr = `${oversInt}.${balls}`;
      crMatch.liveState.overs = newOversStr;
      
      const batsman = crMatch.liveState.batsmen.find(b => b.isStriker);
      const randVal = Math.random();
      
      let run = 0;
      let eventDetail = "";
      let isWicket = false;
      let eventType = "run";
      
      if (randVal > 0.95) {
        isWicket = true;
        eventType = "wicket";
        crMatch.liveState.wickets += 1;
        eventDetail = `WICKET! ${batsman.name} is dismissed! Catch taken by the fielder at deep mid-wicket.`;
        
        const newBatsmanNames = ["MS Dhoni", "Ravindra Jadeja", "Shardul Thakur"];
        const oldName = batsman.name;
        batsman.name = newBatsmanNames[Math.floor(Math.random() * newBatsmanNames.length)] + " ";
        batsman.runs = 0;
        batsman.balls = 0;
        batsman.fours = 0;
        batsman.sixes = 0;
        batsman.strikeRate = "0.00";
        
        crMatch.liveState.bowler.wickets += 1;
      } else if (randVal > 0.85) {
        run = 6;
        eventType = "boundary";
        batsman.runs += 6;
        batsman.sixes += 1;
        eventDetail = `SIX! ${batsman.name} clears the fence! A massive strike over long-on!`;
      } else if (randVal > 0.70) {
        run = 4;
        eventType = "boundary";
        batsman.runs += 4;
        batsman.fours += 1;
        eventDetail = `FOUR! Beautiful timing, ${batsman.name} clips it off the pads to the boundary!`;
      } else if (randVal > 0.40) {
        run = Math.random() > 0.4 ? 1 : 2;
        batsman.runs += run;
        eventDetail = `${run} run(s) taken. Steady batting.`;
        
        if (run === 1) {
          crMatch.liveState.batsmen.forEach(b => b.isStriker = !b.isStriker);
        }
      } else {
        eventDetail = "Dot ball. Good delivery by the bowler.";
      }
      
      batsman.balls += 1;
      batsman.strikeRate = ((batsman.runs / batsman.balls) * 100).toFixed(2);
      
      crMatch.liveState.score += run;
      crMatch.liveState.bowler.runs += run;
      crMatch.liveState.bowler.overs = `${Math.floor((parseInt(crMatch.liveState.bowler.overs.replace('.', '')) + 1) / 6)}.${(parseInt(crMatch.liveState.bowler.overs.replace('.', '')) + 1) % 6}`;
      
      const runsRemaining = crMatch.liveState.target - crMatch.liveState.score;
      const totalBallsRemaining = 120 - (oversInt * 6 + balls);
      
      crMatch.score.away = `${crMatch.liveState.score}/${crMatch.liveState.wickets} (${newOversStr} Ov)`;
      crMatch.time = runsRemaining > 0 && totalBallsRemaining > 0 
        ? `${crMatch.awayTeam.name} need ${runsRemaining} runs in ${totalBallsRemaining} balls`
        : runsRemaining <= 0 ? `${crMatch.awayTeam.name} won by ${6 - crMatch.liveState.wickets} wickets` : `Match tied!`;
        
      if (runsRemaining <= 0) {
        crMatch.status = "recent";
        crMatch.time = `${crMatch.awayTeam.name} won by ${6 - crMatch.liveState.wickets} wickets`;
      }
      
      if (balls === 0) {
        crMatch.chartData.overs.push(oversInt);
        crMatch.chartData.awayRunRate.push(parseFloat(((crMatch.liveState.score / oversInt)).toFixed(2)));
        crMatch.chartData.homeRunRate.push(crMatch.chartData.homeRunRate[crMatch.chartData.homeRunRate.length - 1]);
      }
      
      const overStr = `${oversInt}.${balls}`;
      crMatch.timeline.unshift({
        id: 'c-e-' + Date.now(),
        over: overStr,
        type: eventType,
        detail: eventDetail,
        bowler: crMatch.liveState.bowler.name,
        batsman: batsman.name
      });
      
      crMatch.commentary.unshift({
        id: 'c-c-' + Date.now(),
        over: overStr,
        text: `${crMatch.liveState.bowler.name} to ${batsman.name}, ${run === 6 ? 'SIX' : run === 4 ? 'FOUR' : run} runs. ${eventDetail}`
      });
      
      broadcast('MATCH_UPDATE', crMatch);
    }
  }
}

// Polling interval setups
if (API_TOKEN) {
  console.log("Sportmonks API Token found. Real V3 API sync active.");
  syncSportmonksData();
  setInterval(syncSportmonksData, 5000);
} else {
  console.log("No Sportmonks API Token in environment. Simulator and Mock progression active.");
  setInterval(autoSimulateMatchProgression, 25000);
}


// --- REST API ENDPOINTS ---

// Get all matches
app.get('/api/matches', (req, res) => {
  const allMatches = [...matchesCache.football, ...matchesCache.cricket];
  res.json(allMatches);
});

// Get a specific match details
app.get('/api/matches/:id', (req, res) => {
  const matchId = req.params.id;
  let match = matchesCache.football.find(m => m.id === matchId);
  if (!match) {
    match = matchesCache.cricket.find(m => m.id === matchId);
  }
  
  if (match) {
    res.json(match);
  } else {
    res.status(404).json({ error: "Match not found" });
  }
});

// Get team details (Proxying to Sportmonks API V3)
app.get('/api/:sport/teams/:id', async (req, res) => {
  const { sport, id } = req.params;
  const API_TOKEN = process.env.SPORTMONKS_API_TOKEN;

  if (sport !== 'football' && sport !== 'cricket') {
    return res.status(400).json({ error: "Invalid sport. Supported sports: football, cricket" });
  }

  if (!API_TOKEN) {
    return res.status(400).json({ error: "Sportmonks API Token not configured on the server" });
  }

  const cacheKey = req.originalUrl;

  try {
    const data = await getCachedOrFetch(cacheKey, async () => {
      let includeParam = '';
      if (sport === 'football') {
        includeParam = 'upcoming.participants;upcoming.league';
      } else if (sport === 'cricket') {
        includeParam = req.query.include || 'players';
      }

      const url = `https://api.sportmonks.com/v3/${sport}/teams/${id}?api_token=${API_TOKEN}${includeParam ? `&include=${includeParam}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new HttpError(response.status, `Sportmonks API error: ${response.statusText}`);
      }
      return await response.json();
    });

    res.json(data);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
});

// Get raw inplay livescores (Proxying to Sportmonks API V3)
app.get('/api/football/livescores/inplay', async (req, res) => {
  const API_TOKEN = process.env.SPORTMONKS_API_TOKEN;
  if (!API_TOKEN) return res.status(400).json({ error: "Sportmonks API Token not configured on the server" });

  const cacheKey = req.originalUrl;

  try {
    const data = await getCachedOrFetch(cacheKey, async () => {
      const url = `https://api.sportmonks.com/v3/football/livescores/inplay?api_token=${API_TOKEN}&include=participants;scores;periods;events;league.country;round`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new HttpError(response.status, `Sportmonks API error: ${response.statusText}`);
      }
      return await response.json();
    });

    res.json(data);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
});

// Get team schedules (Proxying to Sportmonks API V3)
app.get('/api/football/schedules/teams/:id', async (req, res) => {
  const teamId = req.params.id;
  const API_TOKEN = process.env.SPORTMONKS_API_TOKEN;
  if (!API_TOKEN) return res.status(400).json({ error: "Sportmonks API Token not configured on the server" });

  const cacheKey = req.originalUrl;

  try {
    const data = await getCachedOrFetch(cacheKey, async () => {
      const url = `https://api.sportmonks.com/v3/football/schedules/teams/${teamId}?api_token=${API_TOKEN}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new HttpError(response.status, `Sportmonks API error: ${response.statusText}`);
      }
      return await response.json();
    });

    res.json(data);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
});

// Get leagues fixtures by date (Proxying to Sportmonks API V3)
app.get('/api/football/leagues/date/:date', async (req, res) => {
  const date = req.params.date;
  const API_TOKEN = process.env.SPORTMONKS_API_TOKEN;
  if (!API_TOKEN) return res.status(400).json({ error: "Sportmonks API Token not configured on the server" });

  const cacheKey = req.originalUrl;

  try {
    const data = await getCachedOrFetch(cacheKey, async () => {
      const url = `https://api.sportmonks.com/v3/football/leagues/date/${date}?api_token=${API_TOKEN}&include=today.scores;today.participants;today.stage;today.group;today.round`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new HttpError(response.status, `Sportmonks API error: ${response.statusText}`);
      }
      return await response.json();
    });

    res.json(data);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
});

// Get detailed fixture by ID (Proxying to Sportmonks API V3)
app.get('/api/football/fixtures/:id', async (req, res) => {
  const fixtureId = req.params.id;
  const API_TOKEN = process.env.SPORTMONKS_API_TOKEN;
  if (!API_TOKEN) return res.status(400).json({ error: "Sportmonks API Token not configured on the server" });

  const cacheKey = req.originalUrl;

  try {
    const data = await getCachedOrFetch(cacheKey, async () => {
      const url = `https://api.sportmonks.com/v3/football/fixtures/${fixtureId}?api_token=${API_TOKEN}&include=participants;league;venue;state;scores;lineups.player;lineups.type;lineups.details.type;metadata.type;coaches`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new HttpError(response.status, `Sportmonks API error: ${response.statusText}`);
      }
      return await response.json();
    });

    res.json(data);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
});

// Get raw cricket inplay livescores (Proxying to Sportmonks API V3)
app.get('/api/cricket/livescores/inplay', async (req, res) => {
  const API_TOKEN = process.env.SPORTMONKS_API_TOKEN;
  if (!API_TOKEN) return res.status(400).json({ error: "Sportmonks API Token not configured on the server" });

  const cacheKey = req.originalUrl;

  try {
    const data = await getCachedOrFetch(cacheKey, async () => {
      const url = `https://api.sportmonks.com/v3/cricket/livescores/inplay?api_token=${API_TOKEN}&include=runs;livescores;lineups;events;commentaries`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new HttpError(response.status, `Sportmonks API error: ${response.statusText}`);
      }
      return await response.json();
    });

    res.json(data);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
});

// Get cricket team schedules (Proxying to Sportmonks API V3)
app.get('/api/cricket/schedules/teams/:id', async (req, res) => {
  const teamId = req.params.id;
  const API_TOKEN = process.env.SPORTMONKS_API_TOKEN;
  if (!API_TOKEN) return res.status(400).json({ error: "Sportmonks API Token not configured on the server" });

  const cacheKey = req.originalUrl;

  try {
    const data = await getCachedOrFetch(cacheKey, async () => {
      const url = `https://api.sportmonks.com/v3/cricket/schedules/teams/${teamId}?api_token=${API_TOKEN}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new HttpError(response.status, `Sportmonks API error: ${response.statusText}`);
      }
      return await response.json();
    });

    res.json(data);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
});

// Get cricket fixtures by date (Proxying to Sportmonks API V3)
app.get('/api/cricket/fixtures/date/:date', async (req, res) => {
  const date = req.params.date;
  const API_TOKEN = process.env.SPORTMONKS_API_TOKEN;
  if (!API_TOKEN) return res.status(400).json({ error: "Sportmonks API Token not configured on the server" });

  const cacheKey = req.originalUrl;

  try {
    const data = await getCachedOrFetch(cacheKey, async () => {
      const url = `https://api.sportmonks.com/v3/cricket/fixtures/date/${date}?api_token=${API_TOKEN}&include=runs;livescores;lineups;events;commentaries`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new HttpError(response.status, `Sportmonks API error: ${response.statusText}`);
      }
      return await response.json();
    });

    res.json(data);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
});

// Get detailed cricket fixture by ID (Proxying to Sportmonks API V3)
app.get('/api/cricket/fixtures/:id', async (req, res) => {
  const fixtureId = req.params.id;
  const API_TOKEN = process.env.SPORTMONKS_API_TOKEN;
  if (!API_TOKEN) return res.status(400).json({ error: "Sportmonks API Token not configured on the server" });

  const cacheKey = req.originalUrl;

  try {
    const data = await getCachedOrFetch(cacheKey, async () => {
      const url = `https://api.sportmonks.com/v3/cricket/fixtures/${fixtureId}?api_token=${API_TOKEN}&include=runs;livescores;lineups;events;commentaries`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new HttpError(response.status, `Sportmonks API error: ${response.statusText}`);
      }
      return await response.json();
    });

    res.json(data);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
});

// Get server configuration info (e.g. if the simulator is active)
app.get('/api/config', (req, res) => {
  res.json({
    simulatorActive: !process.env.SPORTMONKS_API_TOKEN
  });
});

// Get Football Tournament Standings (Real-time query with mock fallback)
app.get('/api/football/standings', async (req, res) => {
  const API_TOKEN = process.env.SPORTMONKS_API_TOKEN;
  const seasonId = req.query.seasonId || '24250'; // Default tournament season placeholder

  const cacheKey = req.originalUrl;

  try {
    const data = await getCachedOrFetch(cacheKey, async () => {
      let responseData = mockWorldCupStandings;
      if (API_TOKEN) {
        try {
          const url = `https://api.sportmonks.com/v3/football/standings/seasons/${seasonId}?api_token=${API_TOKEN}&include=standing.team`;
          const response = await fetch(url);
          if (response.ok) {
            const json = await response.json();
            if (json && json.data && json.data.length > 0) {
              responseData = json.data;
            }
          }
        } catch (err) {
          console.warn("Sportmonks Standings fetch failed, falling back to mock:", err.message);
        }
      }
      return responseData;
    });

    res.json(data);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
});

// Get Football Tournament Topscorers (Real-time query with mock fallback)
app.get('/api/football/topscorers', async (req, res) => {
  const API_TOKEN = process.env.SPORTMONKS_API_TOKEN;
  const seasonId = req.query.seasonId || '24250';

  const cacheKey = req.originalUrl;

  try {
    const data = await getCachedOrFetch(cacheKey, async () => {
      let responseData = mockWorldCupTopscorers;
      if (API_TOKEN) {
        try {
          const url = `https://api.sportmonks.com/v3/football/topscorers/seasons/${seasonId}?api_token=${API_TOKEN}&include=player;team`;
          const response = await fetch(url);
          if (response.ok) {
            const json = await response.json();
            if (json && json.data && json.data.length > 0) {
              responseData = json.data;
            }
          }
        } catch (err) {
          console.warn("Sportmonks Topscorers fetch failed, falling back to mock:", err.message);
        }
      }
      return responseData;
    });

    res.json(data);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
});


// --- DYNAMIC SETTINGS CONFIGURATIONS ---
const SETTINGS_FILE = path.join(__dirname, 'settings.json');

function readSettings() {
  if (!fs.existsSync(SETTINGS_FILE)) {
    const defaultSettings = {
      adsEnabled: true,
      adClient: 'ca-pub-5739201948',
      adSlots: {
        sidebar: '5739201948',
        header: '9283748291'
      },
      supportEmail: 'cricbuzz756@gmail.com'
    };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
    return defaultSettings;
  }
  try {
    const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
    const parsed = JSON.parse(data);
    if (!parsed.supportEmail) {
      parsed.supportEmail = 'cricbuzz756@gmail.com';
    }
    return parsed;
  } catch (err) {
    return {
      adsEnabled: true,
      adClient: 'ca-pub-5739201948',
      adSlots: {
        sidebar: '5739201948',
        header: '9283748291'
      },
      supportEmail: 'cricbuzz756@gmail.com'
    };
  }
}

function writeSettings(settings) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    return true;
  } catch (err) {
    return false;
  }
}

const LICENSES_FILE = path.join(__dirname, 'licenses.json');

function readLicenses() {
  if (!fs.existsSync(LICENSES_FILE)) {
    const defaultLicenses = [
      'SZ-PRO-2026-GOLD',
      'premium_partner_2026',
      'sportz_vip_membership'
    ];
    fs.writeFileSync(LICENSES_FILE, JSON.stringify(defaultLicenses, null, 2));
    return defaultLicenses;
  }
  try {
    const data = fs.readFileSync(LICENSES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [
      'SZ-PRO-2026-GOLD',
      'premium_partner_2026',
      'sportz_vip_membership'
    ];
  }
}

function writeLicenses(licenses) {
  try {
    fs.writeFileSync(LICENSES_FILE, JSON.stringify(licenses, null, 2));
    return true;
  } catch (err) {
    return false;
  }
}

app.get('/api/settings', async (req, res) => {
  const licenseKey = req.query.licenseKey;

  try {
    let currentSettings;
    let activeLicenses;

    if (useMongoDB) {
      const settingsDoc = await SettingsModel.findOne();
      currentSettings = settingsDoc ? settingsDoc.toObject() : {
        adsEnabled: true,
        adClient: 'ca-pub-5739201948',
        adSlots: { sidebar: '5739201948', header: '9283748291' },
        supportEmail: 'cricbuzz756@gmail.com'
      };
      const licenseDocs = await LicenseModel.find();
      activeLicenses = licenseDocs.map(l => l.key);
    } else {
      currentSettings = readSettings();
      activeLicenses = readLicenses();
    }

    if (licenseKey && activeLicenses.includes(licenseKey)) {
      res.json({
        ...currentSettings,
        adsEnabled: false,
        status: 'premium',
        licenseValid: true
      });
    } else {
      res.json({
        ...currentSettings,
        status: licenseKey ? 'invalid' : 'free',
        licenseValid: false
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- USER PERSISTENT STORAGE ENGINE ---
const USERS_FILE = path.join(__dirname, 'users.json');

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    const defaultUsers = [
      {
        id: "u-default",
        name: "Jane Developer",
        email: "developer@sportz.com",
        password: "password123",
        country: "Germany",
        phone: "+49 170 1234567",
        address: "Hauptstr. 12, Berlin",
        status: "pro",
        licenseKey: "SZ-PRO-2026-GOLD"
      }
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
    return defaultUsers;
  }
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (err) {
    return false;
  }
}

// --- USER AUTHENTICATION ENDPOINTS ---

// Register a new developer account
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, country, phone, address } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields (Name, Email, Password)." });
  }

  try {
    if (useMongoDB) {
      const exists = await UserModel.findOne({ email: email.toLowerCase() });
      if (exists) {
        return res.status(400).json({ error: "An account with this email already exists." });
      }

      const newUser = new UserModel({
        id: `u-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        password,
        country: country || '',
        phone: phone || '',
        address: address || '',
        status: 'normal',
        licenseKey: null
      });

      await newUser.save();
      return res.json({ success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email, status: newUser.status } });
    }

    // Fallback file-based storage
    const users = readUsers();
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password,
      country: country || '',
      phone: phone || '',
      address: address || '',
      status: 'normal',
      licenseKey: null
    };

    users.push(newUser);
    if (writeUsers(users)) {
      res.json({ success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email, status: newUser.status } });
    } else {
      res.status(500).json({ error: "Failed to write user account to database." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login developer account
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing credentials." });
  }

  try {
    let user;
    if (useMongoDB) {
      user = await UserModel.findOne({ email: email.toLowerCase(), password });
    } else {
      const users = readUsers();
      user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    }

    if (user) {
      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          country: user.country,
          phone: user.phone,
          address: user.address,
          status: user.status,
          licenseKey: user.licenseKey
        }
      });
    } else {
      res.status(401).json({ error: "Invalid email or password." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PayPal upgrade developer account to Premium Pro
app.post('/api/auth/upgrade', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing User ID for upgrade." });
  }

  try {
    // Generate unique premium license key
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const genChunk = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const newKey = `SZ-PRO-${genChunk(4)}-${genChunk(4)}`;

    if (useMongoDB) {
      const user = await UserModel.findOne({ id: userId });
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      user.status = 'pro';
      user.licenseKey = newKey;
      await user.save();

      const newLicense = new LicenseModel({ key: newKey });
      await newLicense.save();

      return res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          country: user.country,
          phone: user.phone,
          address: user.address,
          status: user.status,
          licenseKey: user.licenseKey
        }
      });
    }

    // Fallback file-based storage
    const users = readUsers();
    const userIdx = users.findIndex(u => u.id === userId);
    if (userIdx === -1) {
      return res.status(404).json({ error: "User not found." });
    }

    users[userIdx].status = 'pro';
    users[userIdx].licenseKey = newKey;

    const activeLicenses = readLicenses();
    activeLicenses.push(newKey);

    if (writeUsers(users) && writeLicenses(activeLicenses)) {
      res.json({
        success: true,
        user: {
          id: users[userIdx].id,
          name: users[userIdx].name,
          email: users[userIdx].email,
          country: users[userIdx].country,
          phone: users[userIdx].phone,
          address: users[userIdx].address,
          status: users[userIdx].status,
          licenseKey: users[userIdx].licenseKey
        }
      });
    } else {
      res.status(500).json({ error: "Failed to persist upgrade changes." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- DYNAMIC SUPPORT & CONTACT QUERY ENGINE ---
const SUPPORT_QUERIES_FILE = path.join(__dirname, 'support_queries.json');

function readSupportQueries() {
  try {
    if (!fs.existsSync(SUPPORT_QUERIES_FILE)) {
      fs.writeFileSync(SUPPORT_QUERIES_FILE, JSON.stringify([], null, 2));
    }
    return JSON.parse(fs.readFileSync(SUPPORT_QUERIES_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function writeSupportQueries(data) {
  try {
    fs.writeFileSync(SUPPORT_QUERIES_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    return false;
  }
}

// Register support queries submitted by logged in developers
app.post('/api/support/query', async (req, res) => {
  const { userId, name, email, subject, message } = req.body;

  if (!userId || !subject || !message) {
    return res.status(400).json({ error: "Missing required support query parameters." });
  }

  try {
    let supportEmail = 'cricbuzz756@gmail.com';
    if (useMongoDB) {
      const settings = await SettingsModel.findOne();
      if (settings && settings.supportEmail) {
        supportEmail = settings.supportEmail;
      }
    } else {
      const settings = readSettings();
      supportEmail = settings.supportEmail || 'cricbuzz756@gmail.com';
    }

    const newQueryId = `TKT-${Date.now()}`;
    const timestampStr = new Date().toISOString();

    // Simulate SMTP Mail System dispatch to support inbox
    console.log(`\n======================================================`);
    console.log(`📬 [SMTP MAIL SYSTEM] FORWARDING SUPPORT QUERY`);
    console.log(`------------------------------------------------------`);
    console.log(`From: support@sportz-widgets.com`);
    console.log(`To: ${supportEmail}`);
    console.log(`Subject: [Support Ticket ${newQueryId}] ${subject}`);
    console.log(`Developer Name: ${name || 'Developer'}`);
    console.log(`Developer Email: ${email || 'N/A'}`);
    console.log(`Message Content:\n"${message}"`);
    console.log(`======================================================\n`);

    if (useMongoDB) {
      const newQuery = new SupportQueryModel({
        id: newQueryId,
        userId,
        name: name || 'Developer',
        email: email || 'N/A',
        subject,
        message,
        status: 'pending',
        forwardedTo: supportEmail,
        timestamp: timestampStr
      });
      await newQuery.save();
      return res.json({
        success: true,
        message: "Your support query has been logged. Our response team will review it shortly."
      });
    }

    // Fallback file-based storage
    const queries = readSupportQueries();
    const newQuery = {
      id: newQueryId,
      userId,
      name: name || 'Developer',
      email: email || 'N/A',
      subject,
      message,
      status: 'pending',
      forwardedTo: supportEmail,
      timestamp: timestampStr
    };
    queries.push(newQuery);

    if (writeSupportQueries(queries)) {
      res.json({
        success: true,
        message: "Your support query has been logged. Our response team will review it shortly."
      });
    } else {
      res.status(500).json({ error: "Failed to save support query in the database." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ADMINISTRATIVE AUDITING & USER REGISTRY OVERRIDES ---

// List all submitted developer support queries
app.get('/api/admin/support/queries', async (req, res) => {
  try {
    if (useMongoDB) {
      const queries = await SupportQueryModel.find();
      return res.json(queries);
    }
    res.json(readSupportQueries());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update support query details (assigned assistant forwardedTo / status)
app.post('/api/admin/support/queries/update', async (req, res) => {
  const { id, forwardedTo, status } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Missing query ID" });
  }

  try {
    if (useMongoDB) {
      const query = await SupportQueryModel.findOne({ id });
      if (!query) {
        return res.status(404).json({ error: "Support query not found" });
      }

      if (forwardedTo !== undefined) {
        query.forwardedTo = forwardedTo;
      }
      if (status !== undefined) {
        query.status = status;
      }

      await query.save();
      return res.json({ success: true, query });
    }

    // Fallback file-based storage
    const queries = readSupportQueries();
    const idx = queries.findIndex(q => q.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Support query not found" });
    }

    if (forwardedTo !== undefined) {
      queries[idx].forwardedTo = forwardedTo;
    }
    if (status !== undefined) {
      queries[idx].status = status;
    }

    if (writeSupportQueries(queries)) {
      res.json({ success: true, query: queries[idx] });
    } else {
      res.status(500).json({ error: "Failed to update support query" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all registered developer accounts
app.get('/api/admin/users', async (req, res) => {
  try {
    let users;
    if (useMongoDB) {
      users = await UserModel.find();
    } else {
      users = readUsers();
    }
    // Sanitize passwords out of response
    const sanitized = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      country: u.country,
      phone: u.phone,
      address: u.address,
      status: u.status,
      licenseKey: u.licenseKey
    }));
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all registered license keys (active premium keys registry)
app.get('/api/admin/licenses', async (req, res) => {
  try {
    if (useMongoDB) {
      const licenses = await LicenseModel.find();
      return res.json(licenses.map(l => l.key));
    }
    res.json(readLicenses());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin manual license creation
app.post('/api/admin/licenses/create', async (req, res) => {
  const { customSuffix } = req.body;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const genChunk = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  
  const suffix = customSuffix ? customSuffix.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) : genChunk(4);
  const newKey = `SZ-PRO-${suffix}-${genChunk(4)}`;

  try {
    if (useMongoDB) {
      const newLicense = new LicenseModel({ key: newKey });
      await newLicense.save();
      return res.json({ success: true, licenseKey: newKey });
    }

    // Fallback file-based storage
    const activeLicenses = readLicenses();
    activeLicenses.push(newKey);

    if (writeLicenses(activeLicenses)) {
      res.json({ success: true, licenseKey: newKey });
    } else {
      res.status(500).json({ error: "Failed to record manual key." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin manual license key revocation
app.post('/api/admin/licenses/revoke', async (req, res) => {
  const { licenseKey } = req.body;

  if (!licenseKey) {
    return res.status(400).json({ error: "Missing license key to revoke." });
  }

  try {
    if (useMongoDB) {
      // 1. Remove from active licenses database
      await LicenseModel.deleteOne({ key: licenseKey });

      // 2. Scan and downgrade any user using this license key
      await UserModel.updateMany({ licenseKey }, { status: 'normal', licenseKey: null });

      const settings = await SettingsModel.findOne();
      const settingsObj = settings ? settings.toObject() : {};
      broadcast('SETTINGS_UPDATE', settingsObj); // Force clear ad triggers
      return res.json({ success: true, message: "License key successfully revoked." });
    }

    // Fallback file-based storage
    let activeLicenses = readLicenses();
    activeLicenses = activeLicenses.filter(k => k !== licenseKey);

    const users = readUsers();
    users.forEach(u => {
      if (u.licenseKey === licenseKey) {
        u.status = 'normal';
        u.licenseKey = null;
      }
    });

    if (writeLicenses(activeLicenses) && writeUsers(users)) {
      broadcast('SETTINGS_UPDATE', readSettings()); // Force clear ad triggers
      res.json({ success: true, message: "License key successfully revoked." });
    } else {
      res.status(500).json({ error: "Failed to persist revocation." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin manual user status toggle
app.post('/api/admin/users/toggle-status', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing user ID to toggle." });
  }

  try {
    if (useMongoDB) {
      const user = await UserModel.findOne({ id: userId });
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      if (user.status === 'pro') {
        const oldKey = user.licenseKey;
        user.status = 'normal';
        user.licenseKey = null;
        await user.save();

        if (oldKey) {
          await LicenseModel.deleteOne({ key: oldKey });
        }
      } else {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const genChunk = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        const newKey = `SZ-PRO-${genChunk(4)}-${genChunk(4)}`;

        user.status = 'pro';
        user.licenseKey = newKey;
        await user.save();

        const newLicense = new LicenseModel({ key: newKey });
        await newLicense.save();
      }

      return res.json({ success: true, user });
    }

    // Fallback file-based storage
    const users = readUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) {
      return res.status(404).json({ error: "User not found." });
    }

    const activeLicenses = readLicenses();

    if (users[idx].status === 'pro') {
      // Downgrade to Normal
      const oldKey = users[idx].licenseKey;
      users[idx].status = 'normal';
      users[idx].licenseKey = null;

      if (oldKey) {
        const filtered = activeLicenses.filter(k => k !== oldKey);
        writeLicenses(filtered);
      }
    } else {
      // Upgrade to Pro
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const genChunk = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      const newKey = `SZ-PRO-${genChunk(4)}-${genChunk(4)}`;

      users[idx].status = 'pro';
      users[idx].licenseKey = newKey;
      activeLicenses.push(newKey);
      writeLicenses(activeLicenses);
    }

    if (writeUsers(users)) {
      res.json({ success: true, user: users[idx] });
    } else {
      res.status(500).json({ error: "Failed to toggle user subscription level." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    if (useMongoDB) {
      let settings = await SettingsModel.findOne();
      if (!settings) {
        settings = new SettingsModel(req.body);
      } else {
        Object.assign(settings, req.body);
      }
      await settings.save();
      const settingsObj = settings.toObject();
      broadcast('SETTINGS_UPDATE', settingsObj);
      return res.json({ success: true, settings: settingsObj });
    }

    // Fallback file-based storage
    const currentSettings = readSettings();
    const mergedSettings = { ...currentSettings, ...req.body };
    if (writeSettings(mergedSettings)) {
      broadcast('SETTINGS_UPDATE', mergedSettings);
      res.json({ success: true, settings: mergedSettings });
    } else {
      res.status(500).json({ error: "Failed to write settings" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get polls
app.get('/api/polls', async (req, res) => {
  try {
    if (useMongoDB) {
      const polls = await PollModel.find();
      return res.json(polls);
    }
    res.json(readPolls());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new poll
app.post('/api/polls/create', async (req, res) => {
  const { matchId, question, options } = req.body;
  if (!matchId || !question || !options || !Array.isArray(options)) {
    return res.status(400).json({ error: "Invalid inputs" });
  }

  try {
    if (useMongoDB) {
      const existingPoll = await PollModel.findOne({ matchId });
      if (existingPoll) {
        return res.json(existingPoll);
      }

      const newPoll = new PollModel({
        id: 'p-' + Date.now(),
        matchId,
        question,
        options,
        votes: new Array(options.length).fill(0),
        voters: []
      });

      await newPoll.save();
      broadcast('POLL_UPDATE', newPoll);
      return res.status(201).json(newPoll);
    }

    // Fallback file-based storage
    const polls = readPolls();
    const existingPoll = polls.find(p => p.matchId === matchId);
    if (existingPoll) {
      return res.json(existingPoll);
    }

    const newPoll = {
      id: 'p-' + Date.now(),
      matchId,
      question,
      options,
      votes: new Array(options.length).fill(0),
      voters: []
    };

    polls.push(newPoll);
    writePolls(polls);
    
    broadcast('POLL_UPDATE', newPoll);
    res.status(201).json(newPoll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vote in a poll
app.post('/api/polls/vote', async (req, res) => {
  const { pollId, email, name, optionIndex } = req.body;
  if (!pollId || !email || !name || optionIndex === undefined) {
    return res.status(400).json({ error: "Missing required details (pollId, email, name, or optionIndex)" });
  }

  // Simple Email Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address format" });
  }

  try {
    if (useMongoDB) {
      const poll = await PollModel.findOne({ id: pollId });
      if (!poll) {
        return res.status(404).json({ error: "Poll not found" });
      }

      const alreadyVoted = poll.voters.some(v => v.email.toLowerCase() === email.toLowerCase());
      if (alreadyVoted) {
        return res.status(403).json({ error: "This email has already cast a vote in this poll." });
      }

      if (optionIndex < 0 || optionIndex >= poll.options.length) {
        return res.status(400).json({ error: "Invalid option selection" });
      }

      // Register vote
      poll.votes[optionIndex] += 1;
      poll.voters.push({ name, email: email.toLowerCase(), choice: poll.options[optionIndex] });
      
      // Explicitly mark arrays as modified so mongoose saves updates correctly
      poll.markModified('votes');
      poll.markModified('voters');
      await poll.save();

      broadcast('POLL_UPDATE', poll);
      return res.json({ success: true, poll });
    }

    // Fallback file-based storage
    const polls = readPolls();
    const poll = polls.find(p => p.id === pollId);
    
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    const alreadyVoted = poll.voters.some(v => v.email.toLowerCase() === email.toLowerCase());
    if (alreadyVoted) {
      return res.status(403).json({ error: "This email has already cast a vote in this poll." });
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ error: "Invalid option selection" });
    }

    poll.votes[optionIndex] += 1;
    poll.voters.push({ name, email: email.toLowerCase(), choice: poll.options[optionIndex] });
    
    writePolls(polls);
    broadcast('POLL_UPDATE', poll);
    res.json({ success: true, poll });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SIMULATOR TRIGGER ENDPOINT
app.post('/api/simulator/update', (req, res) => {
  const { matchId, type, details } = req.body;
  let sport = '';
  let match = matchesCache.football.find(m => m.id === matchId);
  if (match) sport = 'football';
  else {
    match = matchesCache.cricket.find(m => m.id === matchId);
    if (match) sport = 'cricket';
  }

  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  if (sport === 'football') {
    if (type === 'goal') {
      const scoringTeam = details.team;
      match.score[scoringTeam] += 1;
      
      const newEvent = {
        id: 'sim-' + Date.now(),
        minute: details.minute || parseInt(match.time) || 75,
        type: 'goal',
        team: scoringTeam,
        player: details.player || 'Player X',
        detail: 'Brilliant goal! Injected by simulator.'
      };
      match.timeline.unshift(newEvent);
      
      const teamName = scoringTeam === 'home' ? match.homeTeam.name : match.awayTeam.name;
      const commentaryLine = `GOAL!! Direct hit from ${details.player || 'Player X'} for ${teamName}! The simulator triggers a score update! Now: ${match.homeTeam.shortName} ${match.score.home} - ${match.score.away} ${match.awayTeam.shortName}.`;
      
      match.commentary.unshift({
        id: 'simc-' + Date.now(),
        minute: (details.minute || parseInt(match.time) || 75) + "'",
        text: commentaryLine
      });
      
      match.stats.shots[scoringTeam] += 1;
      match.stats.shotsOnTarget[scoringTeam] += 1;
    } else if (type === 'card') {
      const cardType = details.card;
      const cardTeam = details.team;
      const player = details.player || 'Player Y';
      
      const newEvent = {
        id: 'sim-' + Date.now(),
        minute: details.minute || parseInt(match.time) || 75,
        type: cardType,
        team: cardTeam,
        player: player,
        detail: cardType === 'red' ? 'Straight Red Card' : 'Yellow Card caution'
      };
      match.timeline.unshift(newEvent);
      
      const commentaryLine = `${cardType.toUpperCase()} CARD! ${player} (${cardTeam === 'home' ? match.homeTeam.name : match.awayTeam.name}) is booked by the referee for a bad tackle.`;
      match.commentary.unshift({
        id: 'simc-' + Date.now(),
        minute: (details.minute || parseInt(match.time) || 75) + "'",
        text: commentaryLine
      });
      
      if (cardType === 'yellow') match.stats.yellowCards[cardTeam] += 1;
      else match.stats.redCards[cardTeam] += 1;
    } else if (type === 'commentary') {
      match.commentary.unshift({
        id: 'simc-' + Date.now(),
        minute: (details.minute || parseInt(match.time) || 75) + "'",
        text: details.text
      });
    }
  } else if (sport === 'cricket') {
    if (type === 'runs') {
      const runs = parseInt(details.runs);
      const isExtra = details.isExtra || false;
      const striker = match.liveState.batsmen.find(b => b.isStriker);
      
      match.liveState.score += runs;
      if (!isExtra) {
        striker.runs += runs;
        striker.balls += 1;
        if (runs === 4) striker.fours += 1;
        if (runs === 6) striker.sixes += 1;
        striker.strikeRate = ((striker.runs / striker.balls) * 100).toFixed(2);
      }
      
      match.liveState.bowler.runs += runs;
      
      if (runs % 2 === 1 && !isExtra) {
        match.liveState.batsmen.forEach(b => b.isStriker = !b.isStriker);
      }
      
      const overVal = match.liveState.overs;
      match.score.away = `${match.liveState.score}/${match.liveState.wickets} (${overVal} Ov)`;
      
      let comm = "";
      if (runs === 6) comm = `SIX! Massive blow by ${striker.name}! Smashes the ball over long-on for a huge maximum!`;
      else if (runs === 4) comm = `FOUR! Exquisite placement! ${striker.name} guides it past point for four runs.`;
      else if (runs === 0) comm = `No run. Good line and length outside off stump, batsman defends it.`;
      else comm = `${runs} run(s). Shot down to long-on for a easy run.`;
      
      match.timeline.unshift({
        id: 'sim-' + Date.now(),
        over: overVal,
        type: runs === 6 || runs === 4 ? 'boundary' : 'run',
        detail: comm,
        bowler: match.liveState.bowler.name,
        batsman: striker.name
      });
      
      match.commentary.unshift({
        id: 'simc-' + Date.now(),
        over: overVal,
        text: `${match.liveState.bowler.name} to ${striker.name}, ${runs === 6 ? 'SIX' : runs === 4 ? 'FOUR' : runs} runs. ${comm}`
      });
    } else if (type === 'wicket') {
      const striker = match.liveState.batsmen.find(b => b.isStriker);
      match.liveState.wickets += 1;
      match.liveState.bowler.wickets += 1;
      striker.balls += 1;
      
      const overVal = match.liveState.overs;
      match.score.away = `${match.liveState.score}/${match.liveState.wickets} (${overVal} Ov)`;
      
      const dismissedPlayer = striker.name;
      const commentaryLine = `OUT! BOWLED'EM! Jasprit Bumrah knocks back the middle stump! ${dismissedPlayer} departs after a fighting knock. Wicket number ${match.liveState.wickets} falls.`;
      
      striker.name = details.newBatsman || "New Batsman";
      striker.runs = 0;
      striker.balls = 0;
      striker.fours = 0;
      striker.sixes = 0;
      striker.strikeRate = "0.00";
      
      match.timeline.unshift({
        id: 'sim-' + Date.now(),
        over: overVal,
        type: 'wicket',
        detail: commentaryLine,
        bowler: match.liveState.bowler.name,
        batsman: dismissedPlayer
      });
      
      match.commentary.unshift({
        id: 'simc-' + Date.now(),
        over: overVal,
        text: commentaryLine
      });
    }
  }

  broadcast('MATCH_UPDATE', match);
  res.json({ success: true, match });
});


// WebSocket Server Connection Handler
wss.on('connection', (ws) => {
  const allMatches = [...matchesCache.football, ...matchesCache.cricket];
  ws.send(JSON.stringify({ type: 'INIT', data: { matches: allMatches } }));
  
  ws.on('message', (message) => {
    try {
      const parsed = JSON.parse(message);
    } catch (err) {}
  });
});

// Serve static client assets in production (monolith deployment)
const clientBuildPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`SportZ API Caching & Broadcast Server running on port ${PORT}`);
});
