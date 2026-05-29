# Sportmonks API V3 - Integration Guide for SportZ

This guide details how to integrate the official **Sportmonks API V3** into the SportZ application. It shows how the V3 query structures correspond to our client components and caching layer.

---

## 🔑 1. Authentication
In Sportmonks V3, all requests require authorization. You can authenticate in two ways:
1. **Query Parameter**: Append `?api_token=YOUR_TOKEN` to the request URL.
2. **Authorization Header**: Pass the token as a Bearer token in the headers:
   ```http
   Authorization: Bearer YOUR_TOKEN
   ```

We recommend storing this in your backend `.env` file:
```env
SPORTMONKS_API_TOKEN=your_real_api_token_here
```

---

## 🛠️ 2. Request Options & Syntax (V3 Standards)

Sportmonks V3 introduces several key query formatting behaviors:

### A. Includes (`include`)
Used to fetch relational data. In V3, **multiple includes must be separated by semicolons (`;`)**, not commas.
- *Correct (V3)*: `&include=participants;statistics;events;lineups.player`
- *Incorrect*: `&include=participants,statistics,events`

### B. Field Selection (`select`)
To reduce download size (which is critical when serving millions of users), you can limit the fields returned.
- Select fields on the main resource: `&select=name,starting_at,length`
- Select fields on nested relations (formatted as `relation:field1,field2`):
  `&include=lineups.player:common_name,image_path,number`

### C. Filtering (`filter`)
Allows narrowing down fixture data.
- E.g., Filter by in-play (live) matches: `&filter=fixtures.inplay:true`
- E.g., Filter by specific leagues: `&filter=fixtures.league_id:8`

---

## 📡 3. Mapping to App Components

To populate the SportZ UI, your backend background polling mechanism should make requests utilizing the following V3 configurations:

### Football Component Requests
- **Endpoint**: `https://api.sportmonks.com/v3/football/fixtures`
- **Recommended V3 Query Parameters**:
  ```http
  ?api_token={token}
  &include=participants;statistics;events;comments;lineups.player
  &select=id,name,starting_at,scores,time
  ```
- **Mapping details**:
  - `participants` returns both teams. You can identify home vs. away by checking the participant's metadata/scores.
  - `comments` maps directly to our **AI Live Commentary log**.
  - `events` feeds our **Timeline Timeline** (goals, bookings).
  - `lineups.player` maps to the **Stadium Pitch Formation visualizer**.

### Cricket Component Requests
- **Endpoint**: `https://api.sportmonks.com/v3/cricket/fixtures`
- **Recommended V3 Query Parameters**:
  ```http
  ?api_token={token}
  &include=runs;livescores;lineups;events;commentaries
  ```
- **Mapping details**:
  - `runs` provides innings totals (runs/wickets/overs).
  - `livescores` provides live batsman strike rate and bowler economy details.
  - `commentaries` feeds the **AI Voice Commentary**.

---

## 💻 4. Backend Caching Implementation Code

To integrate this in `f:\SportZ\server\server.js`, you can import `axios` or use native `fetch` (Node 18+) inside your sync intervals. This is the implementation path to swap mock data for real API feeds:

```javascript
const API_TOKEN = process.env.SPORTMONKS_API_TOKEN;

async function syncSportmonksData() {
  if (!API_TOKEN) {
    // Fallback to simulator / mock data
    return;
  }

  try {
    // 1. Fetch Football Live Fixtures
    const fbRes = await fetch(
      `https://api.sportmonks.com/v3/football/fixtures?api_token=${API_TOKEN}&include=participants;statistics;events;comments;lineups.player`
    );
    if (fbRes.ok) {
      const fbData = await fbRes.json();
      // Translate Sportmonks V3 response array into SportZ matchesCache.football
      matchesCache.football = fbData.data.map(transformFootballFixture);
    }

    // 2. Fetch Cricket Live Fixtures
    const crRes = await fetch(
      `https://api.sportmonks.com/v3/cricket/fixtures?api_token=${API_TOKEN}&include=runs;livescores;lineups;events;commentaries`
    );
    if (crRes.ok) {
      const crData = await crRes.json();
      matchesCache.cricket = crData.data.map(transformCricketFixture);
    }
    
    // Broadcast updates to all WebSockets clients
    broadcast('MATCHES_LIST_UPDATE', [...matchesCache.football, ...matchesCache.cricket]);
  } catch (err) {
    console.error("Error syncing from Sportmonks V3:", err);
  }
}

// Transform functions to map Sportmonks V3 JSON to your app's frontend schema
function transformFootballFixture(v3Fixture) {
  const homeParticipant = v3Fixture.participants.find(p => p.meta.location === 'home');
  const awayParticipant = v3Fixture.participants.find(p => p.meta.location === 'away');
  
  return {
    id: `fb-${v3Fixture.id}`,
    sport: 'football',
    status: v3Fixture.inplay ? 'live' : (v3Fixture.state_id === 5 ? 'recent' : 'upcoming'),
    league: v3Fixture.league?.name || 'League',
    homeTeam: { 
      id: homeParticipant.id, 
      name: homeParticipant.name, 
      logo: homeParticipant.image_path, 
      shortName: homeParticipant.short_code 
    },
    awayTeam: { 
      id: awayParticipant.id, 
      name: awayParticipant.name, 
      logo: awayParticipant.image_path, 
      shortName: awayParticipant.short_code 
    },
    score: { 
      home: v3Fixture.scores?.home_score || 0, 
      away: v3Fixture.scores?.away_score || 0 
    },
    time: v3Fixture.time?.minute ? `${v3Fixture.time.minute}'` : 'Upcoming',
    venue: v3Fixture.venue?.name || 'Stadium',
    // ... map stats, lineups, events, and comments ...
  };
}
```

---

## 🏟️ 5. Proxy & Custom Sportmonks Endpoints

The server exposes several proxy endpoints to allow the frontend client to perform specific queries directly to the Sportmonks V3 API:

### A. Team Details & Upcoming Matches
- **Endpoint**: `/api/:sport/teams/:id` (where `:sport` is `football` or `cricket`)
- **Query Structure**: 
  - Football: Queries `football/teams/{id}?include=upcoming.participants;upcoming.league`
  - Cricket: Queries `cricket/teams/{id}?include=players`

### B. Inplay Livescores
- **Football Endpoint**: `/api/football/livescores/inplay`
  - **Query Structure**: Queries `football/livescores/inplay?include=participants;scores;periods;events;league.country;round`
- **Cricket Endpoint**: `/api/cricket/livescores/inplay`
  - **Query Structure**: Queries `cricket/livescores/inplay?include=runs;livescores;lineups;events;commentaries`

### C. Team Schedules
- **Football Endpoint**: `/api/football/schedules/teams/:id`
  - **Query Structure**: Queries `football/schedules/teams/{id}`
- **Cricket Endpoint**: `/api/cricket/schedules/teams/:id`
  - **Query Structure**: Queries `cricket/schedules/teams/{id}`

### D. Fixtures by Date
- **Football Endpoint**: `/api/football/leagues/date/:date` (format: `YYYY-MM-DD`)
  - **Query Structure**: Queries `football/leagues/date/{date}?include=today.scores;today.participants;today.stage;today.group;today.round`
- **Cricket Endpoint**: `/api/cricket/fixtures/date/:date` (format: `YYYY-MM-DD`)
  - **Query Structure**: Queries `cricket/fixtures/date/{date}?include=runs;livescores;lineups;events;commentaries`

### E. Detailed Fixture by ID
- **Football Endpoint**: `/api/football/fixtures/:id`
  - **Query Structure**: Queries `football/fixtures/{id}?include=participants;league;venue;state;scores;lineups.player;lineups.type;lineups.details.type;metadata.type;coaches`
- **Cricket Endpoint**: `/api/cricket/fixtures/:id`
  - **Query Structure**: Queries `cricket/fixtures/{id}?include=runs;livescores;lineups;events;commentaries`

---

## 🗄️ 6. Persistent Storage (MongoDB Atlas)

To support production-ready scale and prevent data loss during server restarts, the application supports **MongoDB Atlas** database integration.

### Environment Variable Config
We have already pre-configured your live connection URI in your backend [.env](file:///f:/SportZ/server/.env) file:
```env
MONGODB_URI=mongodb+srv://sportz_db_user:Digtales%40123@sportz.yf1ob46.mongodb.net/sportz?retryWrites=true&w=majority
```

### Local JSON Fallback (Graceful Degradation)
- If the `MONGODB_URI` environment variable is not defined or is set to the placeholder string, the backend server **automatically and seamlessly degrades** to using the local file-based storage [polls.json](file:///f:/SportZ/server/polls.json) file.
- This ensures the application works instantly out-of-the-box in local development with no setup required!

---

## 💰 7. Estimated Monthly Operating Costs

To go live with SportZ, here is the approximate monthly budget required for the Sportmonks plan and hosting infrastructure under standard and high load.

| Component | Standard Scale (1,000s of active users) | Premium/High Scale (100,000s of active users) | Details |
| :--- | :--- | :--- | :--- |
| **Sportmonks API V3** | **€29.00** (~$31.50) | **€29.00** (~$31.50) | Core data subscription. Locked at the flat €29 plan rate. |
| **Railway.app Hosting** | **~$5.00** (~€4.60) | **~$10.00 - $15.00** (~€9.20 - €13.80) | Hobby plan covers Standard Scale easily. Scales dynamically with usage. |
| **MongoDB Atlas** | **$0.00** (Free M0 Cluster) | **$9.00** (~€8.30) | Free tier includes 512MB storage (handles 100,000s of vote documents). |
| **Custom Domain** | **~$1.00** (~€0.90) | **~$1.00** (~€0.90) | Custom domain is required for Google AdSense approval (approx. $12/year). |
| **TOTAL BUDGET** | **~€35.50 / month** (~$38.40) | **~€47.50 - $56.50 / month** (~$51.50 - $61.00) | **Extremely affordable operational footprint.** |

### Optimization & Caching Benefits
- The SportZ server includes a **caching layer** inside `server.js` that pulls livescores and fixtures from Sportmonks once per sync interval (e.g. every 3-5s) and feeds all active users simultaneously using high-performance **WebSockets**.
- This means your Sportmonks API usage **does NOT scale with your user count**! You will never exceed your subscription rate limit or incur extra Sportmonks costs because your server only makes **1 query per sync interval** regardless of whether you have 10 users or 10,000 users active online.

---

## 💵 8. Monetization: Google AdSense Setup

To generate active advertising revenue from SportZ, we have implemented custom, responsive Google AdSense integration that is dynamic and production-ready.

### A. How the Integration Works
1. **Dynamic Loader (`AdSenseAd.jsx`)**: The client features a reusable React `AdSenseAd` component. It dynamically imports Google's AdSense client library only when a publisher ID is present in the environment (`VITE_ADSENSE_PUB_ID`).
2. **Glassmorphic Fallbacks**:
   - **Local Development**: If you do not have an AdSense ID set, the component renders a beautiful, premium glassmorphism mockup. This allows you to design your layout comfortably without seeing blank or broken space.
   - **Ad-Blockers**: If a visitor has an ad-blocker enabled, the app degrades gracefully by displaying a gentle placeholder layout or hiding the unit entirely without crashing the React virtual DOM.
3. **Seller Verification (`ads.txt`)**: We placed a standard `ads.txt` placeholder inside the `client/public/` directory. When Vite builds the app, it serves `ads.txt` at the site root (e.g., `https://yourdomain.com/ads.txt`), fulfilling Google's verification requirements automatically.

### B. Deployment Checklist for Revenue Generation
1. **Purchase a Custom Domain**: Buy a domain name from Google Domains, Namecheap, GoDaddy, etc. (e.g., `sportz-live.com`). Google AdSense **will not approve** temporary hosting subdomains (e.g., `*.railway.app` or `*.render.com`).
2. **Deploy the App**: Bind your custom domain to your Railway or Render project.
3. **Configure AdSense**: Add your custom domain in your Google AdSense account (`pub-4370867821860158`).
4. **Seller Verification**: We have already configured your live publisher ID in [client/public/ads.txt](file:///f:/SportZ/client/public/ads.txt) and [client/.env](file:///f:/SportZ/client/.env).
5. **Start Serving**: Once your custom domain is approved by AdSense, your live ad units in the Sidebar and under the Vote panels will automatically start rendering active ads!

---

## 📊 9. Engagement Tracking: Google Analytics 4 (GA4)

To track active visitors, session durations, and user interactions, we have fully integrated **Google Analytics 4 (GA4)** into the client application.

### A. Core Utility (`analytics.js`)
We created a dedicated tracking utility inside [analytics.js](file:///f:/SportZ/client/src/utils/analytics.js) that exposes:
- **`initGA(measurementId)`**: Programmatically injects Google's tracking script only when a Measurement ID is active.
- **`trackPageView(path, title)`**: Tracks page navigations.
- **`trackEvent(action, category, label, value)`**: Tracks custom player events.

### B. Tracked Events
1. **Sport Selection Toggles**: Logs when users toggle between Football and Cricket tabs.
2. **Fixture Selection**: Logs when a user clicks a match card to view match details.
3. **Poll Voting**: Logs whenever a voter casts a vote.
4. **Poll Construction**: Logs whenever a viewer constructs a custom prediction poll.

### C. How to Configure
We have already pre-configured your live GA4 Measurement ID in [client/.env](file:///f:/SportZ/client/.env):
```env
VITE_GA_MEASUREMENT_ID=G-L0WMTXT34J
```
Once built and deployed, your live center will feed standard telemetry and custom interactions directly into your Google Analytics dashboard in real-time!
