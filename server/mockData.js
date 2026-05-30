// Mock Data for SportZ Web App (Cricket & Football)
// Mimics Sportmonks API structures

const mockFootballMatches = [
  {
    id: "fb-1",
    sport: "football",
    status: "live", // live, upcoming, recent, historical
    league: "Premier League",
    homeTeam: { id: "t-fb-1", name: "Arsenal", logo: "🔴", shortName: "ARS" },
    awayTeam: { id: "t-fb-2", name: "Chelsea", logo: "🔵", shortName: "CHE" },
    score: { home: 2, away: 1 },
    time: "74'",
    date: "2026-05-29",
    venue: "Emirates Stadium",
    referee: "Michael Oliver",
    stats: {
      possession: { home: 56, away: 44 },
      shots: { home: 12, away: 8 },
      shotsOnTarget: { home: 6, away: 3 },
      corners: { home: 7, away: 4 },
      fouls: { home: 9, away: 11 },
      yellowCards: { home: 1, away: 3 },
      redCards: { home: 0, away: 0 }
    },
    lineups: {
      home: {
        formation: "4-3-3",
        startingXI: [
          { number: 22, name: "David Raya", position: "GK", grid: [1, 5] },
          { number: 4, name: "Ben White", position: "DF", grid: [2, 8] },
          { number: 2, name: "William Saliba", position: "DF", grid: [2, 6] },
          { number: 6, name: "Gabriel Magalhães", position: "DF", grid: [2, 4] },
          { number: 12, name: "Jurriën Timber", position: "DF", grid: [2, 2] },
          { number: 41, name: "Declan Rice", position: "MF", grid: [3, 5] },
          { number: 8, name: "Martin Ødegaard", position: "MF", grid: [3, 7] },
          { number: 29, name: "Kai Havertz", position: "MF", grid: [3, 3] },
          { number: 7, name: "Bukayo Saka", position: "FW", grid: [4, 8] },
          { number: 19, name: "Leandro Trossard", position: "FW", grid: [4, 2] },
          { number: 9, name: "Gabriel Jesus", position: "FW", grid: [4, 5] }
        ]
      },
      away: {
        formation: "4-2-3-1",
        startingXI: [
          { number: 1, name: "Robert Sánchez", position: "GK", grid: [1, 5] },
          { number: 27, name: "Malo Gusto", position: "DF", grid: [2, 8] },
          { number: 29, name: "Wesley Fofana", position: "DF", grid: [2, 6] },
          { number: 6, name: "Levi Colwill", position: "DF", grid: [2, 4] },
          { number: 3, name: "Marc Cucurella", position: "DF", grid: [2, 2] },
          { number: 25, name: "Moisés Caicedo", position: "MF", grid: [3, 4] },
          { number: 8, name: "Enzo Fernández", position: "MF", grid: [3, 6] },
          { number: 11, name: "Noni Madueke", position: "FW", grid: [4, 8] },
          { number: 20, name: "Cole Palmer", position: "MF", grid: [4, 5] },
          { number: 7, name: "Pedro Neto", position: "FW", grid: [4, 2] },
          { number: 15, name: "Nicolas Jackson", position: "FW", grid: [5, 5] }
        ]
      }
    },
    timeline: [
      { id: "e1", minute: 12, type: "goal", team: "home", player: "Bukayo Saka", detail: "Assist by Ødegaard" },
      { id: "e2", minute: 28, type: "yellow", team: "away", player: "Malo Gusto", detail: "Tactical foul" },
      { id: "e3", minute: 34, type: "goal", team: "away", player: "Cole Palmer", detail: "Penalty Kick" },
      { id: "e4", minute: 45, type: "yellow", team: "away", player: "Enzo Fernández", detail: "Arguing with referee" },
      { id: "e5", minute: 58, type: "goal", team: "home", player: "Gabriel Jesus", detail: "Header from corner kick" },
      { id: "e6", minute: 67, type: "yellow", team: "home", player: "Gabriel Magalhães", detail: "Late challenge" },
      { id: "e7", minute: 71, type: "yellow", team: "away", player: "Levi Colwill", detail: "Rough tackle" }
    ],
    commentary: [
      { id: "c1", minute: "73'", text: "Arsenal keeping possession in the midfield. Rice cycles the ball to Ødegaard." },
      { id: "c2", minute: "71'", text: "Yellow card! Levi Colwill goes into the referee's book for sliding in hard on Gabriel Jesus." },
      { id: "c3", minute: "68'", text: "Chelsea pressuring. Palmer looks for Netos run but Saliba intercepts brilliantly." },
      { id: "c4", minute: "58'", text: "GOOOAL!! Arsenal takes the lead again! Gabriel Jesus scores a towering header from a Bukayo Saka corner kick!" },
      { id: "c5", minute: "46'", text: "Second half kicks off! No substitutions at the break for either squad." }
    ]
  },
  {
    id: "fb-2",
    sport: "football",
    status: "upcoming",
    league: "La Liga",
    homeTeam: { id: "t-fb-3", name: "Real Madrid", logo: "⚪", shortName: "RMA" },
    awayTeam: { id: "t-fb-4", name: "Barcelona", logo: "🔵🔴", shortName: "BAR" },
    score: { home: null, away: null },
    time: "22:30",
    date: "2026-05-30",
    venue: "Santiago Bernabéu",
    referee: "Jesús Gil Manzano",
    stats: null,
    lineups: null,
    timeline: [],
    commentary: []
  },
  {
    id: "fb-3",
    sport: "football",
    status: "recent",
    league: "Champions League",
    homeTeam: { id: "t-fb-5", name: "Bayern Munich", logo: "🔴⚪", shortName: "FCB" },
    awayTeam: { id: "t-fb-6", name: "Real Madrid", logo: "⚪", shortName: "RMA" },
    score: { home: 1, away: 2 },
    time: "FT",
    date: "2026-05-27",
    venue: "Allianz Arena",
    referee: "Szymon Marciniak",
    stats: {
      possession: { home: 52, away: 48 },
      shots: { home: 15, away: 11 },
      shotsOnTarget: { home: 5, away: 7 },
      corners: { home: 6, away: 3 },
      fouls: { home: 12, away: 8 },
      yellowCards: { home: 2, away: 1 },
      redCards: { home: 0, away: 0 }
    },
    lineups: null,
    timeline: [
      { id: "er1", minute: 31, type: "goal", team: "home", player: "Harry Kane", detail: "Assist by Musiala" },
      { id: "er2", minute: 57, type: "goal", team: "away", player: "Vinícius Júnior", detail: "Solo run down the left" },
      { id: "er3", minute: 83, type: "goal", team: "away", player: "Jude Bellingham", detail: "Header from Kroos assist" }
    ],
    commentary: [
      { id: "cr1", minute: "90+4'", text: "Full time! Real Madrid secures a crucial 2-1 away victory in Munich." },
      { id: "cr2", minute: "83'", text: "GOAL!! Real Madrid flips the match! Jude Bellingham rises highest to nod Kroos's pinpoint cross past Neuer!" }
    ]
  },
  {
    id: "fb-4",
    sport: "football",
    status: "historical",
    league: "World Cup Final",
    homeTeam: { id: "t-fb-7", name: "Argentina", logo: "🇦🇷", shortName: "ARG" },
    awayTeam: { id: "t-fb-8", name: "France", logo: "🇫🇷", shortName: "FRA" },
    score: { home: 3, away: 3 },
    time: "AET (4-2 Pen)",
    date: "2022-12-18",
    venue: "Lusail Stadium",
    referee: "Szymon Marciniak",
    stats: {
      possession: { home: 54, away: 46 },
      shots: { home: 20, away: 10 },
      shotsOnTarget: { home: 10, away: 5 },
      corners: { home: 6, away: 5 },
      fouls: { home: 26, away: 19 },
      yellowCards: { home: 4, away: 3 },
      redCards: { home: 0, away: 0 }
    },
    lineups: null,
    timeline: [
      { id: "eh1", minute: 23, type: "goal", team: "home", player: "Lionel Messi", detail: "Penalty Kick" },
      { id: "eh2", minute: 36, type: "goal", team: "home", player: "Ángel Di María", detail: "Assist by Mac Allister" },
      { id: "eh3", minute: 80, type: "goal", team: "away", player: "Kylian Mbappé", detail: "Penalty Kick" },
      { id: "eh4", minute: 81, type: "goal", team: "away", player: "Kylian Mbappé", detail: "Volley kick assist by Thuram" },
      { id: "eh5", minute: 108, type: "goal", team: "home", player: "Lionel Messi", detail: "Rebound tap-in" },
      { id: "eh6", minute: 118, type: "goal", team: "away", player: "Kylian Mbappé", detail: "Penalty Kick" }
    ],
    commentary: [
      { id: "ch1", minute: "Penalties", text: "Montiel scores! Argentina are World Cup Champions!" }
    ]
  }
];

const mockCricketMatches = [
  {
    id: "cr-1",
    sport: "cricket",
    status: "live",
    league: "Indian Premier League",
    homeTeam: { id: "t-cr-1", name: "Mumbai Indians", logo: "💙", shortName: "MI" },
    awayTeam: { id: "t-cr-2", name: "Chennai Super Kings", logo: "💛", shortName: "CSK" },
    // live cricket stats
    liveState: {
      battingFirst: "MI",
      currentInnings: 2,
      target: 188,
      overs: "17.4",
      score: 162,
      wickets: 4,
      crr: "9.17",
      rrr: "9.75",
      batsmen: [
        { id: "b1", name: "Ruturaj Gaikwad", runs: 68, balls: 45, fours: 6, sixes: 3, strikeRate: "151.11", isStriker: true },
        { id: "b2", name: "Shivam Dube", runs: 24, balls: 15, fours: 1, sixes: 2, strikeRate: "160.00", isStriker: false }
      ],
      bowler: { id: "bw1", name: "Jasprit Bumrah", overs: "3.4", maidens: 0, runs: 26, wickets: 2, economy: "7.09" }
    },
    score: { home: "187/6 (20 Ov)", away: "162/4 (17.4 Ov)" },
    time: "CSK need 26 runs in 14 balls",
    date: "2026-05-29",
    venue: "Wankhede Stadium",
    referee: "Nitin Menon",
    chartData: {
      overs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      homeRunRate: [6.0, 7.5, 7.0, 8.2, 8.0, 8.5, 8.3, 8.8, 9.0, 8.9, 9.1, 9.3, 9.0, 9.2, 9.4, 9.3, 9.35],
      awayRunRate: [7.0, 8.0, 8.5, 8.0, 8.3, 9.0, 9.2, 9.0, 9.3, 9.5, 9.3, 9.2, 9.0, 9.1, 9.3, 9.2, 9.17]
    },
    lineups: {
      home: {
        batsmen: [
          { name: "Rohit Sharma", status: "c Dhoni b Pathirana", runs: 38, balls: 24, fours: 4, sixes: 2 },
          { name: "Ishan Kishan", status: "b Jadeja", runs: 22, balls: 16, fours: 3, sixes: 0 },
          { name: "Suryakumar Yadav", status: "c Jadeja b Deshpande", runs: 45, balls: 28, fours: 5, sixes: 2 },
          { name: "Hardik Pandya", status: "not out", runs: 31, balls: 18, fours: 2, sixes: 2 },
          { name: "Tim David", status: "c Rahane b Pathirana", runs: 12, balls: 9, fours: 0, sixes: 1 }
        ],
        bowlers: [
          { name: "Tushar Deshpande", overs: 4, maidens: 0, runs: 36, wickets: 1, economy: 9.0 },
          { name: "Matheesha Pathirana", overs: 4, maidens: 0, runs: 28, wickets: 3, economy: 7.0 },
          { name: "Ravindra Jadeja", overs: 4, maidens: 0, runs: 32, wickets: 1, economy: 8.0 }
        ]
      },
      away: {
        batsmen: [
          { name: "Rachin Ravindra", status: "c Kishan b Bumrah", runs: 21, balls: 14, fours: 3, sixes: 0 },
          { name: "Ruturaj Gaikwad", status: "batting", runs: 68, balls: 45, fours: 6, sixes: 3 },
          { name: "Daryl Mitchell", status: "c Pandya b Coetzee", runs: 15, balls: 12, fours: 1, sixes: 0 },
          { name: "Shivam Dube", status: "batting", runs: 24, balls: 15, fours: 1, sixes: 2 }
        ],
        bowlers: [
          { name: "Gerald Coetzee", overs: 3, maidens: 0, runs: 31, wickets: 1, economy: 10.3 },
          { name: "Jasprit Bumrah", overs: 3.4, maidens: 0, runs: 26, wickets: 2, economy: 7.09 },
          { name: "Hardik Pandya", overs: 3, maidens: 0, runs: 33, wickets: 1, economy: 11.0 }
        ]
      }
    },
    timeline: [
      { id: "c-e1", over: "17.4", type: "run", detail: "1 run", bowler: "Bumrah", batsman: "Gaikwad" },
      { id: "c-e2", over: "17.3", type: "run", detail: "2 runs", bowler: "Bumrah", batsman: "Gaikwad" },
      { id: "c-e3", over: "17.2", type: "wicket", detail: "WICKET! Daryl Mitchell c Pandya b Bumrah 15(12)", bowler: "Bumrah", batsman: "Mitchell" },
      { id: "c-e4", over: "17.1", type: "boundary", detail: "FOUR! Mitchell drives it through covers!", bowler: "Bumrah", batsman: "Mitchell" },
      { id: "c-e5", over: "16.6", type: "boundary", detail: "SIX! Shivam Dube launches it over long-on!", bowler: "Pandya", batsman: "Dube" }
    ],
    commentary: [
      { id: "c-c1", over: "17.4", text: "Bumrah to Gaikwad, 1 run. Tuck away to deep square leg. Keeps the strike." },
      { id: "c-c2", over: "17.3", text: "Bumrah to Gaikwad, 2 runs. Beautifully placed in the gap at mid-wicket. Good running!" },
      { id: "c-c3", over: "17.2", text: "OUT! In the air and caught! Bumrah strikes again! Slower delivery, Mitchell tries to clear long-on but hits it straight to Hardik Pandya. Big blow for CSK!" },
      { id: "c-c4", over: "17.1", text: "FOUR! Excellent shot! Pitch up outside off, Mitchell drives it beautifully through extra cover. Sweeper boundary rider has no chance!" },
      { id: "c-c5", over: "16.6", text: "SIX! Huge! Hardik misses the yorker length, Dube gets underneath it and sends it high over the deep mid-wicket boundary for a 95-meter six!" }
    ]
  },
  {
    id: "cr-2",
    sport: "cricket",
    status: "upcoming",
    league: "T20 World Cup",
    homeTeam: { id: "t-cr-3", name: "India", logo: "🇮🇳", shortName: "IND" },
    awayTeam: { id: "t-cr-4", name: "Pakistan", logo: "🇵🇰", shortName: "PAK" },
    score: { home: null, away: null },
    time: "20:00",
    date: "2026-06-05",
    venue: "Nassau County International Stadium",
    referee: "Richard Kettleborough",
    liveState: null,
    chartData: null,
    lineups: null,
    timeline: [],
    commentary: []
  },
  {
    id: "cr-3",
    sport: "cricket",
    status: "recent",
    league: "T20 World Cup Final",
    homeTeam: { id: "t-cr-3", name: "India", logo: "🇮🇳", shortName: "IND" },
    awayTeam: { id: "t-cr-5", name: "South Africa", logo: "🇿🇦", shortName: "RSA" },
    score: { home: "176/7 (20 Ov)", away: "169/8 (20 Ov)" },
    time: "IND won by 7 runs",
    date: "2024-06-29",
    venue: "Kensington Oval, Barbados",
    referee: "Richard Illingworth",
    liveState: null,
    chartData: {
      overs: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
      homeRunRate: [6.5, 7.2, 7.5, 7.8, 8.0, 8.2, 8.5, 8.4, 8.6, 8.8],
      awayRunRate: [5.8, 6.4, 7.0, 7.8, 8.2, 9.0, 9.4, 9.2, 8.8, 8.45]
    },
    lineups: null,
    timeline: [
      { id: "c-er1", over: "20.0", type: "run", detail: "India wins the World Cup! Hardik Pandya defends 16 in the final over!", bowler: "Pandya", batsman: "Nortje" }
    ],
    commentary: [
      { id: "c-cr1", over: "20.0", text: "India wins! Absolutely incredible scenes in Barbados. Players are in tears. An historic 7-run victory for India to lift the World Cup!" }
    ]
  },
  {
    id: "cr-4",
    sport: "cricket",
    status: "historical",
    league: "ODI World Cup Final",
    homeTeam: { id: "t-cr-6", name: "England", logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", shortName: "ENG" },
    awayTeam: { id: "t-cr-7", name: "New Zealand", logo: "🇳🇿", shortName: "NZ" },
    score: { home: "241 & 15/0", away: "241 & 15/1" },
    time: "ENG won on boundary count",
    date: "2019-07-14",
    venue: "Lord's, London",
    referee: "Kumar Dharmasena",
    liveState: null,
    chartData: null,
    lineups: null,
    timeline: [],
    commentary: [
      { id: "c-ch1", over: "Super Over", text: "England wins the World Cup on boundary countback! The most dramatic final in cricket history!" }
    ]
  }
];

const mockWorldCupStandings = [
  {
    group: "Group A",
    teams: [
      { rank: 1, name: "Argentina", logo: "🇦🇷", played: 3, won: 2, drawn: 1, lost: 0, gd: 4, points: 7 },
      { rank: 2, name: "Canada", logo: "🇨🇦", played: 3, won: 1, drawn: 1, lost: 1, gd: -1, points: 4 },
      { rank: 3, name: "Chile", logo: "🇨🇱", played: 3, won: 0, drawn: 2, lost: 1, gd: -1, points: 2 },
      { rank: 4, name: "Peru", logo: "🇵🇪", played: 3, won: 0, drawn: 2, lost: 1, gd: -2, points: 2 }
    ]
  },
  {
    group: "Group B",
    teams: [
      { rank: 1, name: "Venezuela", logo: "🇻🇪", played: 3, won: 3, drawn: 0, lost: 0, gd: 5, points: 9 },
      { rank: 2, name: "Ecuador", logo: "🇪🇨", played: 3, won: 1, drawn: 1, lost: 1, gd: 1, points: 4 },
      { rank: 3, name: "Mexico", logo: "🇲🇽", played: 3, won: 1, drawn: 1, lost: 1, gd: 0, points: 4 },
      { rank: 4, name: "Jamaica", logo: "🇯🇲", played: 3, won: 0, drawn: 0, lost: 3, gd: -6, points: 0 }
    ]
  },
  {
    group: "Group C",
    teams: [
      { rank: 1, name: "Uruguay", logo: "🇺🇾", played: 3, won: 3, drawn: 0, lost: 0, gd: 8, points: 9 },
      { rank: 2, name: "United States", logo: "🇺🇸", played: 3, won: 2, drawn: 0, lost: 1, gd: 2, points: 6 },
      { rank: 3, name: "Panama", logo: "🇵🇦", played: 3, won: 1, drawn: 0, lost: 2, gd: -3, points: 3 },
      { rank: 4, name: "Bolivia", logo: "🇧🇴", played: 3, won: 0, drawn: 0, lost: 3, gd: -7, points: 0 }
    ]
  },
  {
    group: "Group D",
    teams: [
      { rank: 1, name: "Colombia", logo: "🇨🇴", played: 3, won: 2, drawn: 1, lost: 0, gd: 4, points: 7 },
      { rank: 2, name: "Brazil", logo: "🇧🇷", played: 3, won: 1, drawn: 2, lost: 0, gd: 4, points: 5 },
      { rank: 3, name: "Costa Rica", logo: "🇨🇷", played: 3, won: 1, drawn: 1, lost: 1, gd: -2, points: 4 },
      { rank: 4, name: "Paraguay", logo: "🇵🇾", played: 3, won: 0, drawn: 0, lost: 3, gd: -6, points: 0 }
    ]
  }
];

const mockWorldCupTopscorers = [
  { rank: 1, name: "Kylian Mbappé", logo: "🇫🇷", team: "France", goals: 6, assists: 2, played: 5 },
  { rank: 2, name: "Lautaro Martínez", logo: "🇦🇷", team: "Argentina", goals: 5, assists: 0, played: 6 },
  { rank: 3, name: "Bukayo Saka", logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", team: "England", goals: 4, assists: 3, played: 5 },
  { rank: 4, name: "Jude Bellingham", logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", team: "England", goals: 3, assists: 2, played: 5 },
  { rank: 5, name: "Vinícius Júnior", logo: "🇧🇷", team: "Brazil", goals: 3, assists: 1, played: 4 },
  { rank: 6, name: "Luis Díaz", logo: "🇨🇴", team: "Colombia", goals: 3, assists: 0, played: 6 },
  { rank: 7, name: "Lionel Messi", logo: "🇦🇷", team: "Argentina", goals: 2, assists: 4, played: 6 }
];

module.exports = {
  mockFootballMatches,
  mockCricketMatches,
  mockWorldCupStandings,
  mockWorldCupTopscorers
};
