cat /mnt/user-data/outputs/ultras-zone.jsx
Output

import { useState, useEffect, useRef } from "react";

/* ─── RACISM FILTER ──────────────────────────────────── */
const BANNED = ["nigger","nigga","chink","spic","kike","wetback","raghead","coon","gook","faggot","beaner","negro"];
const isRacist = t => BANNED.some(w => t.toLowerCase().includes(w));

/* ─── DATA ───────────────────────────────────────────── */
const MATCHES = [
  {
    id:1, status:"LIVE", time:"73'",
    league:"UEFA Champions League", leagueShort:"UCL", leagueColor:"#f5c518",
    home:{name:"Real Madrid", short:"RMA", badge:"🤍"},
    away:{name:"Barcelona",   short:"BAR", badge:"🔵"},
    score:[2,1], viewers:18420,
    stats:{poss:"61%", shots:9, corners:4, yellow:3},
    comments:[
      {id:1,user:"Carlos M.",flag:"🇧🇷",av:"CM",col:"#7b1e1e",text:"BELLINGHAM IS UNREAL TONIGHT I'M LOSING IT 🔥🔥🔥",time:"72'",likes:84,hot:true},
      {id:2,user:"Ahmed K.",flag:"🇸🇦",av:"AK",col:"#1a3a6b",text:"Real Madrid is making history tonight",time:"70'",likes:31},
      {id:3,user:"Jake T.",flag:"🇺🇸",av:"JT",col:"#1a5c2a",text:"Vinicius does that one more time and it's a red 😤",time:"68'",likes:47,hot:true},
      {id:4,user:"Luca B.",flag:"🇮🇹",av:"LB",col:"#3a1a6b",text:"Ancelotti proving his genius once again",time:"65'",likes:22},
      {id:5,user:"Sofia R.",flag:"🇪🇸",av:"SR",col:"#6b3a1a",text:"What is Barcelona's defense doing?? Embarrassing",time:"63'",likes:38,hot:true},
    ]
  },
  {
    id:2, status:"LIVE", time:"38'",
    league:"Premier League", leagueShort:"PL", leagueColor:"#3b0082",
    home:{name:"Man City",  short:"MCI", badge:"🩵"},
    away:{name:"Arsenal",   short:"ARS", badge:"❤️"},
    score:[1,2], viewers:11230,
    stats:{poss:"54%", shots:6, corners:2, yellow:1},
    comments:[
      {id:1,user:"Emma S.",flag:"🇬🇧",av:"ES",col:"#1a4a3a",text:"SAKA IS GETTING A HAT-TRICK TONIGHT 🔴",time:"37'",likes:55,hot:true},
      {id:2,user:"Pedro G.",flag:"🇵🇹",av:"PG",col:"#4a2a1a",text:"Haaland has completely vanished this half",time:"35'",likes:29},
    ]
  },
  {
    id:3, status:"LIVE", time:"12'",
    league:"La Liga", leagueShort:"LL", leagueColor:"#ee8100",
    home:{name:"Atletico",  short:"ATM", badge:"🔴⚪"},
    away:{name:"Sevilla",   short:"SEV", badge:"⚪🔴"},
    score:[0,0], viewers:4870,
    stats:{poss:"48%", shots:2, corners:1, yellow:0},
    comments:[
      {id:1,user:"Pablo R.",flag:"🇪🇸",av:"PR",col:"#3a1a2a",text:"Griezmann looking sharp from the start today",time:"11'",likes:12},
    ]
  },
  {
    id:4, status:"FT", time:"FT",
    league:"Bundesliga", leagueShort:"BL", leagueColor:"#d20515",
    home:{name:"Bayern",   short:"BAY", badge:"🔴"},
    away:{name:"Dortmund", short:"BVB", badge:"🟡"},
    score:[3,1], viewers:0,
    stats:{poss:"67%", shots:14, corners:7, yellow:2},
    comments:[
      {id:1,user:"Hans K.",flag:"🇩🇪",av:"HK",col:"#2a4a1a",text:"Kane will score 40 goals this season, mark my words 👑",time:"FT",likes:61,hot:true},
    ]
  },
  {
    id:5, status:"UPCOMING", time:"20:45",
    league:"Serie A", leagueShort:"SA", leagueColor:"#024494",
    home:{name:"AC Milan",  short:"MIL", badge:"⚫🔴"},
    away:{name:"Juventus",  short:"JUV", badge:"⚫⚪"},
    score:null, viewers:0,
    stats:null,
    comments:[]
  },
  {
    id:6, status:"UPCOMING", time:"23:00",
    league:"MLS", leagueShort:"MLS", leagueColor:"#002b5c",
    home:{name:"Inter Miami", short:"MIA", badge:"🌸"},
    away:{name:"LA Galaxy",   short:"LAG", badge:"⭐"},
    score:null, viewers:0,
    stats:null,
    comments:[]
  },
];

const AUTO_MSGS = [
  {user:"Totti F.",flag:"🇮🇹",av:"TF",col:"#7b1a1a",text:"The stands are on fire tonight! 🔥"},
  {user:"Kemal A.",flag:"🇹🇷",av:"KA",col:"#1a3a7b",text:"This referee has no idea what he's doing"},
  {user:"Sergio P.",flag:"🇦🇷",av:"SP",col:"#1a7b3a",text:"If Messi was here it'd be 5-0 already 😂"},
  {user:"Marcus O.",flag:"🇳🇬",av:"MO",col:"#7b5a1a",text:"Best match of the season! Historic night"},
  {user:"Yuki N.",flag:"🇯🇵",av:"YN",col:"#3a1a7b",text:"Football would be so much better without VAR"},
  {user:"Dario C.",flag:"🇧🇷",av:"DC",col:"#1a7b6a",text:"GOOOAL! I'm going crazy!!! ⚽⚽⚽"},
  {user:"Elena V.",flag:"🇷🇺",av:"EV",col:"#6a1a7b",text:"Defense sleeping, attack flying 🚀"},
  {user:"Omar H.",flag:"🇲🇦",av:"OH",col:"#7b3a1a",text:"This team is winning the title this season, guaranteed"},
];

const REACTIONS = [
  {e:"⚽",l:"Goal!",   n:2841},
  {e:"🔥",l:"Fire",    n:1923},
  {e:"😤",l:"Angry",   n:1102},
  {e:"😱",l:"Unreal",  n:1567},
  {e:"🤣",l:"LOL",     n:887},
  {e:"👏",l:"Clap",    n:643},
  {e:"🍺",l:"Cheers!", n:512},
  {e:"💔",l:"Pain",    n:421},
  {e:"🚩",l:"Foul!",   n:334},
];

/* ─── STYLES ─────────────────────────────────────────── */
const S = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap');

:root {
  --bg:     #06080b;
  --bg2:    #0d1117;
  --bg3:    #141b24;
  --bg4:    #1a2535;
  --border: #1e2d3d;
  --red:    #e53935;
  --red2:   #ff6b35;
  --gold:   #ffc107;
  --white:  #eaf0f7;
  --muted:  #4a5e72;
  --green:  #00c853;
  --blue:   #448aff;
  --font:   'Barlow', sans-serif;
  --display:'Oswald', sans-serif;
  --cond:   'Barlow Condensed', sans-serif;
}

* { box-sizing:border-box; margin:0; padding:0; -webkit-tap-highlight-color:transparent; }
body { background:var(--bg); color:var(--white); font-family:var(--font); }

.app {
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  background: var(--bg);
  overflow: hidden;
  position: relative;
}

/* ── SPLASH ────────────────────────────────────────── */
.splash {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: var(--bg);
}

.splash-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(229,57,53,0.18) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(255,193,7,0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 100%, rgba(229,57,53,0.1) 0%, transparent 50%);
}

.splash-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(229,57,53,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(229,57,53,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
}

.splash-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.splash-badge {
  background: var(--red);
  color: #fff;
  font-family: var(--cond);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 2px;
  margin-bottom: 16px;
  animation: fadeDown .6s ease .2s both;
}

.splash-logo {
  font-family: var(--display);
  font-size: 64px;
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
  line-height: 1;
  color: var(--white);
  animation: fadeDown .6s ease .3s both;
}

.splash-logo .dot { color: var(--red); }
.splash-logo .zone { color: var(--gold); }

.splash-line {
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--red), var(--gold), transparent);
  margin: 14px 0;
  animation: expandWidth .8s ease .5s both;
}

.splash-sub {
  font-family: var(--cond);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 48px;
  animation: fadeUp .6s ease .6s both;
}

.splash-enter {
  background: var(--red);
  color: #fff;
  border: none;
  border-radius: 0;
  padding: 16px 56px;
  font-family: var(--display);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all .2s;
  animation: fadeUp .6s ease .7s both;
  clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
}
.splash-enter::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  transform: translateX(-100%);
  transition: transform .4s;
}
.splash-enter:hover::before { transform: translateX(100%); }
.splash-enter:hover { background: #c62828; transform: scale(1.04); }

.splash-stats {
  display: flex;
  gap: 32px;
  margin-top: 40px;
  animation: fadeUp .6s ease .8s both;
}
.splash-stat { text-align: center; }
.splash-stat-val {
  font-family: var(--display);
  font-size: 28px;
  font-weight: 700;
  color: var(--gold);
}
.splash-stat-lbl {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--muted);
  margin-top: 2px;
}

/* ── HEADER ────────────────────────────────────────── */
.header {
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  position: sticky; top: 0; z-index: 100;
  backdrop-filter: blur(10px);
}

.logo {
  font-family: var(--display);
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--white);
  line-height: 1;
}
.logo .dot { color: var(--red); }
.logo .zone { color: var(--gold); }

.header-right { display: flex; align-items: center; gap: 10px; }

.live-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(229,57,53,0.12);
  border: 1px solid rgba(229,57,53,0.3);
  border-radius: 3px;
  padding: 4px 10px;
  font-family: var(--cond);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
  color: var(--red);
  text-transform: uppercase;
}
.live-pill::before {
  content: '';
  width: 6px; height: 6px;
  background: var(--red);
  border-radius: 50%;
  animation: pulse 1s infinite;
}

.date-tag {
  font-family: var(--cond);
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  letter-spacing: 1px;
}

/* ── SECTION ───────────────────────────────────────── */
.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 16px 8px;
}
.section-tag {
  font-family: var(--cond);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--muted);
}
.section-hr { flex:1; height:1px; background: var(--border); }
.live-tag {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: var(--cond);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
  color: var(--red);
  text-transform: uppercase;
}
.live-tag::before {
  content:'';
  width:6px;height:6px;
  background:var(--red);
  border-radius:50%;
  animation:pulse 1s infinite;
}

/* ── MATCH LIST ────────────────────────────────────── */
.match-list {
  padding: 0 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 20px;
}

.match-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all .18s;
  position: relative;
}
.match-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--border);
  transition: background .18s;
}
.match-card.live-card::before { background: var(--red); }
.match-card:hover { border-color: rgba(229,57,53,0.4); transform: translateX(2px); }
.match-card:active { transform: scale(.98); }

.mc-league {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px 0 16px;
}
.mc-league-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.mc-league-name {
  font-family: var(--cond);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--muted);
}

.mc-body {
  display: flex;
  align-items: center;
  padding: 10px 14px 12px 16px;
  gap: 8px;
}

.mc-team { flex:1; display:flex; align-items:center; gap:8px; }
.mc-team.right { flex-direction:row-reverse; }

.mc-badge {
  width: 34px; height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  background: var(--bg3);
  border: 1px solid var(--border);
  flex-shrink: 0;
}

.mc-name {
  font-family: var(--cond);
  font-size: 15px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--white);
}
.mc-team.right .mc-name { text-align: right; }

.mc-center { text-align: center; min-width: 72px; }

.mc-score {
  font-family: var(--display);
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 6px;
  color: var(--white);
  line-height: 1;
}

.mc-status-live {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--red);
  color: #fff;
  font-family: var(--cond);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  padding: 2px 8px;
  border-radius: 2px;
  margin-top: 4px;
  text-transform: uppercase;
}
.mc-status-live::before {
  content:'';width:5px;height:5px;
  background:#fff;border-radius:50%;
  animation:pulse .8s infinite;
}
.mc-status-ft {
  font-family: var(--cond);
  font-size: 12px;
  font-weight: 800;
  color: var(--muted);
  letter-spacing: 2px;
  margin-top: 4px;
  display: block;
}
.mc-status-upcoming {
  font-family: var(--display);
  font-size: 18px;
  font-weight: 700;
  color: var(--muted);
  letter-spacing: 2px;
}
.mc-kickoff {
  font-family: var(--cond);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--blue);
  margin-top: 3px;
  display: block;
  text-transform: uppercase;
}

.mc-footer {
  border-top: 1px solid var(--border);
  padding: 7px 16px;
  display: flex;
  align-items: center;
}
.mc-viewers {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 5px;
}
.mc-vdot { width:5px;height:5px;background:var(--green);border-radius:50%;animation:pulse 2s infinite; }
.mc-cmts { margin-left:auto; font-size:11px; color:var(--muted); }

/* ── MATCH SCREEN ──────────────────────────────────── */
.match-screen { animation: slideIn .25s ease; }

.ms-header {
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  position: sticky; top:0; z-index:100;
}
.back {
  width: 36px; height: 36px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--white);
  flex-shrink: 0;
  transition: all .15s;
  font-family: var(--font);
}
.back:hover { background: var(--border); }

.ms-info { flex: 1; }
.ms-league {
  font-family: var(--cond);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 2px;
}
.ms-teams {
  font-family: var(--cond);
  font-size: 17px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--white);
}

/* ── SCORE CARD ────────────────────────────────────── */
.score-card {
  margin: 14px;
  background: linear-gradient(135deg, #0f1923 0%, #0a1420 100%);
  border: 1px solid var(--border);
  border-top: 3px solid var(--red);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}
.score-card::before {
  content:'';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle cx='30' cy='30' r='28' stroke='%23ffffff04' stroke-width='1'/%3E%3Ccircle cx='30' cy='30' r='18' stroke='%23ffffff03' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E") center / 120px;
  pointer-events: none;
}

.sc-inner {
  display: flex;
  align-items: center;
  padding: 20px 16px 16px;
  gap: 8px;
  position: relative;
}

.sc-team { flex:1; text-align:center; }
.sc-badge {
  width: 56px; height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  background: rgba(255,255,255,.04);
  border: 2px solid rgba(255,255,255,.08);
  margin: 0 auto 10px;
}
.sc-name {
  font-family: var(--cond);
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #7a93a8;
}

.sc-mid { text-align:center; position:relative; }
.sc-score {
  font-family: var(--display);
  font-size: 62px;
  font-weight: 700;
  letter-spacing: 8px;
  color: var(--white);
  line-height: 1;
  text-shadow: 0 0 40px rgba(229,57,53,0.3);
}
.sc-time-live {
  background: var(--red);
  color: #fff;
  font-family: var(--cond);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
  padding: 3px 12px;
  border-radius: 2px;
  margin-top: 6px;
  display: inline-block;
  text-transform: uppercase;
}
.sc-time-ft {
  font-family: var(--cond);
  font-size: 14px;
  font-weight: 800;
  color: var(--muted);
  letter-spacing: 2px;
  margin-top: 6px;
  display: inline-block;
}

.sc-stats {
  display: flex;
  border-top: 1px solid rgba(255,255,255,.05);
  position: relative;
}
.sc-stat {
  flex:1;
  text-align: center;
  padding: 10px 0;
  border-right: 1px solid rgba(255,255,255,.05);
}
.sc-stat:last-child { border-right: none; }
.sc-stat-val {
  font-family: var(--display);
  font-size: 20px;
  font-weight: 700;
  color: var(--white);
}
.sc-stat-lbl {
  font-family: var(--cond);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted);
  margin-top: 2px;
}

/* ── REACTIONS ─────────────────────────────────────── */
.react-wrap {
  padding: 0 14px 14px;
  overflow-x: auto;
  scrollbar-width: none;
}
.react-wrap::-webkit-scrollbar { display:none; }
.react-inner { display:flex; gap:8px; width:max-content; }

.react-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 7px 12px;
  cursor: pointer;
  transition: all .15s;
  color: var(--white);
  font-family: var(--cond);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  white-space: nowrap;
}
.react-btn:hover, .react-btn.on {
  background: rgba(229,57,53,0.12);
  border-color: var(--red);
  color: var(--red);
  transform: translateY(-2px);
}
.react-btn .e { font-size: 17px; }

/* ── POLL ──────────────────────────────────────────── */
.poll {
  margin: 0 14px 14px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-left: 3px solid var(--gold);
  border-radius: 0 8px 8px 0;
  padding: 14px 16px;
}
.poll-head {
  font-family: var(--cond);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 8px;
}
.poll-q {
  font-size: 15px;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 12px;
}
.poll-opts { display:flex; gap:8px; }
.poll-opt {
  flex:1;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 10px 6px;
  text-align: center;
  cursor: pointer;
  transition: all .2s;
  font-family: var(--cond);
  font-size: 13px;
  font-weight: 700;
  color: var(--white);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.poll-opt .bar {
  position: absolute;
  left:0;top:0;bottom:0;
  background: rgba(229,57,53,0.15);
  transition: width .5s ease;
}
.poll-opt.voted { border-color: var(--red); }
.poll-inner { position:relative; z-index:1; }
.poll-pct {
  display: block;
  font-family: var(--display);
  font-size: 20px;
  color: var(--red);
  margin-top: 3px;
}

/* ── FEED ──────────────────────────────────────────── */
.feed-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px 8px;
}
.feed-title {
  font-family: var(--cond);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--muted);
}
.feed-hr { flex:1; height:1px; background:var(--border); }
.online-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: var(--cond);
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  letter-spacing: 1px;
}
.od { width:5px;height:5px;background:var(--green);border-radius:50%;animation:pulse 2s infinite; }

.feed {
  padding: 0 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 320px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.msg {
  display: flex;
  gap: 10px;
  animation: fadeMsg .3s ease;
}
.msg-av {
  width: 36px; height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--cond);
  font-size: 14px;
  font-weight: 800;
  flex-shrink: 0;
  border: 1px solid rgba(255,255,255,.08);
}
.msg-body { flex:1; }
.msg-top {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 3px;
}
.msg-name {
  font-family: var(--cond);
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--white);
}
.msg-flag { font-size: 13px; }
.msg-time {
  font-size: 10px;
  color: var(--muted);
  margin-left: auto;
  font-family: var(--cond);
  font-weight: 700;
  letter-spacing: 0.5px;
}
.hot-badge {
  background: linear-gradient(90deg,#e53935,#ff6b35);
  font-family: var(--cond);
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.5px;
  padding: 2px 6px;
  border-radius: 2px;
  color: #fff;
  text-transform: uppercase;
}
.msg-text {
  font-size: 14px;
  color: #9ab0c4;
  line-height: 1.45;
}
.msg-actions {
  display: flex;
  gap: 14px;
  margin-top: 6px;
}
.msg-act {
  font-size: 12px;
  color: var(--muted);
  cursor: pointer;
  background: none;
  border: none;
  font-family: var(--cond);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color .15s;
  padding: 0;
  text-transform: uppercase;
}
.msg-act:hover { color: var(--red); }

/* ── INPUT ─────────────────────────────────────────── */
.input-bar {
  padding: 10px 14px 16px;
  display: flex;
  gap: 9px;
  border-top: 1px solid var(--border);
  background: var(--bg);
  position: sticky; bottom: 0;
}
.input-bar input {
  flex: 1;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 11px 16px;
  font-size: 14px;
  color: var(--white);
  font-family: var(--font);
  outline: none;
  transition: border-color .15s;
}
.input-bar input:focus { border-color: var(--red); }
.input-bar input::placeholder { color: var(--muted); }

.send {
  width: 44px; height: 44px;
  background: var(--red);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all .15s;
  flex-shrink: 0;
  clip-path: polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);
}
.send:hover { background: #c62828; transform: scale(1.06); }

/* ── UPCOMING ──────────────────────────────────────── */
.upcoming-card {
  margin: 14px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-top: 3px solid var(--blue);
  border-radius: 8px;
  padding: 28px 20px;
  text-align: center;
}
.upcoming-lbl {
  font-family: var(--cond);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 8px;
}
.upcoming-time {
  font-family: var(--display);
  font-size: 56px;
  font-weight: 700;
  letter-spacing: 6px;
  color: var(--blue);
  line-height: 1;
}
.upcoming-sub {
  font-family: var(--cond);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--muted);
  margin-top: 8px;
  text-transform: uppercase;
}
.notify-btn {
  margin-top: 18px;
  background: rgba(68,138,255,0.1);
  border: 1px solid rgba(68,138,255,0.3);
  border-radius: 4px;
  padding: 10px 24px;
  font-family: var(--cond);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--blue);
  cursor: pointer;
  transition: all .15s;
}
.notify-btn:hover { background: rgba(68,138,255,0.18); }
.notify-btn.notified { border-color: var(--green); color: var(--green); background: rgba(0,200,83,0.1); }

/* ── TOAST ─────────────────────────────────────────── */
.toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: #b71c1c;
  color: #fff;
  font-family: var(--cond);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 10px 20px;
  border-radius: 3px;
  z-index: 9999;
  white-space: nowrap;
  animation: toastPop .3s ease;
}

/* ── ANIMATIONS ────────────────────────────────────── */
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
@keyframes fadeDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
@keyframes expandWidth { from{transform:scaleX(0)} to{transform:scaleX(1)} }
@keyframes slideIn { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
@keyframes fadeMsg { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
@keyframes toastPop { from{opacity:0;transform:translateX(-50%) scale(.9)} to{opacity:1;transform:translateX(-50%) scale(1)} }
@keyframes homeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
`;

/* ─── APP ────────────────────────────────────────────── */
export default function UltrasZone() {
  const [screen, setScreen] = useState("splash");
  const [active, setActive] = useState(null);
  const [mdata, setMdata] = useState(() => {
    const d = {};
    MATCHES.forEach(m => { d[m.id] = [...m.comments]; });
    return d;
  });
  const [reacts, setReacts] = useState(REACTIONS.map(r => ({ ...r, on: false })));
  const [input, setInput] = useState("");
  const [toast, setToast] = useState(null);
  const [poll, setPoll] = useState(null);
  const [pollN, setPollN] = useState([58, 27, 15]);
  const [notified, setNotified] = useState({});
  const [matchTime, setMatchTime] = useState({ 1: 73, 2: 38, 3: 12 });
  const autoRef = useRef(0);

  // tick time
  useEffect(() => {
    const t = setInterval(() => {
      setMatchTime(p => {
        const n = { ...p };
        Object.keys(n).forEach(k => { if (n[k] < 90) n[k]++; });
        return n;
      });
    }, 10000);
    return () => clearInterval(t);
  }, []);

  // auto comments
  useEffect(() => {
    if (screen !== "match" || !active || active.status === "UPCOMING") return;
    const t = setInterval(() => {
      const m = AUTO_MSGS[autoRef.current % AUTO_MSGS.length];
      autoRef.current++;
      setMdata(p => ({
        ...p,
        [active.id]: [{ id: Date.now(), ...m, time: "now", likes: 0 }, ...(p[active.id] || [])].slice(0, 50)
      }));
    }, 4500);
    return () => clearInterval(t);
  }, [screen, active]);

  const openMatch = m => { setActive(m); setScreen("match"); };
  const goBack = () => { setScreen("home"); setActive(null); };

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const send = () => {
    if (!input.trim()) return;
    if (isRacist(input)) {
      showToast("🚫 RACIST CONTENT REMOVED — NO PLACE IN ULTRAS.ZONE");
      setInput("");
      return;
    }
    setMdata(p => ({
      ...p,
      [active.id]: [{
        id: Date.now(), user: "You", flag: "🇺🇸", av: "YOU", col: "#7b1e1e",
        text: input.trim(), time: "now", likes: 0
      }, ...(p[active.id] || [])]
    }));
    setInput("");
  };

  const like = (mid, cid) => {
    setMdata(p => ({
      ...p,
      [mid]: p[mid].map(c => c.id === cid ? { ...c, likes: c.likes + 1 } : c)
    }));
  };

  const votePoll = i => {
    if (poll !== null) return;
    setPoll(i);
    setPollN(p => p.map((n, j) => j === i ? n + 1 : n));
  };

  const today = new Date().toLocaleDateString("tr-TR", { weekday: "short", day: "numeric", month: "short" }).toUpperCase();
  const live = MATCHES.filter(m => m.status === "LIVE");
  const other = MATCHES.filter(m => m.status !== "LIVE");
  const pollTotal = pollN.reduce((a, b) => a + b, 0);
  const msgs = active ? (mdata[active.id] || []) : [];

  /* ─── SPLASH ─── */
  if (screen === "splash") return (
    <>
      <style>{S}</style>
      <div className="app">
        <div className="splash">
          <div className="splash-bg" />
          <div className="splash-grid" />
          <div className="splash-content">
            <div className="splash-badge">⚽ The Ultra Experience</div>
            <div className="splash-logo">
              ULTRAS<span className="dot">.</span><span className="zone">ZONE</span>
            </div>
            <div className="splash-line" />
            <div className="splash-sub">The Voice of the Fans · Fire of the Stands</div>
            <button className="splash-enter" onClick={() => setScreen("home")}>ENTER THE ZONE</button>
            <div className="splash-stats">
              <div className="splash-stat">
                <div className="splash-stat-val">50M+</div>
                <div className="splash-stat-lbl">Global Fans</div>
              </div>
              <div className="splash-stat">
                <div className="splash-stat-val">6</div>
                <div className="splash-stat-lbl">Live Matches</div>
              </div>
              <div className="splash-stat">
                <div className="splash-stat-val">Live</div>
                <div className="splash-stat-lbl">React Now</div>
              </div>
            </div>
          </div>
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );

  /* ─── HOME ─── */
  if (screen === "home") return (
    <>
      <style>{S}</style>
      <div className="app">
        <div style={{ animation: "homeIn .3s ease" }}>
          <div className="header">
            <div className="logo">ULTRAS<span className="dot">.</span><span className="zone">ZONE</span></div>
            <div className="header-right">
              <div className="live-pill">{live.length} Live</div>
              <div className="date-tag">{today}</div>
            </div>
          </div>

          <div className="section-header">
            <div className="live-tag">Live Matches</div>
            <div className="section-hr" />
            <div className="section-tag">{live.length} matches</div>
          </div>

          <div className="match-list">
            {live.map(m => (
              <div className="match-card live-card" key={m.id} onClick={() => openMatch(m)}>
                <div className="mc-league">
                  <div className="mc-league-dot" style={{ background: m.leagueColor }} />
                  <div className="mc-league-name">{m.league}</div>
                </div>
                <div className="mc-body">
                  <div className="mc-team">
                    <div className="mc-badge">{m.home.badge}</div>
                    <div className="mc-name">{m.home.name}</div>
                  </div>
                  <div className="mc-center">
                    <div className="mc-score">{m.score[0]}–{m.score[1]}</div>
                    <div className="mc-status-live">{matchTime[m.id] || m.time}</div>
                  </div>
                  <div className="mc-team right">
                    <div className="mc-badge">{m.away.badge}</div>
                    <div className="mc-name">{m.away.name}</div>
                  </div>
                </div>
                <div className="mc-footer">
                  <div className="mc-viewers">
                    <div className="mc-vdot" />
                    {m.viewers.toLocaleString()} watching
                  </div>
                  <div className="mc-cmts">💬 {(mdata[m.id] || []).length}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="section-header">
            <div className="section-hr" />
            <div className="section-tag">Other Matches</div>
            <div className="section-hr" />
          </div>

          <div className="match-list">
            {other.map(m => (
              <div className="match-card" key={m.id} onClick={() => openMatch(m)}>
                <div className="mc-league">
                  <div className="mc-league-dot" style={{ background: m.leagueColor }} />
                  <div className="mc-league-name">{m.league}</div>
                </div>
                <div className="mc-body">
                  <div className="mc-team">
                    <div className="mc-badge">{m.home.badge}</div>
                    <div className="mc-name">{m.home.name}</div>
                  </div>
                  <div className="mc-center">
                    {m.status === "FT" ? (
                      <>
                        <div className="mc-score">{m.score[0]}–{m.score[1]}</div>
                        <span className="mc-status-ft">FULL TIME</span>
                      </>
                    ) : (
                      <>
                        <div className="mc-status-upcoming">{m.time}</div>
                        <span className="mc-kickoff">Upcoming</span>
                      </>
                    )}
                  </div>
                  <div className="mc-team right">
                    <div className="mc-badge">{m.away.badge}</div>
                    <div className="mc-name">{m.away.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );

  /* ─── MATCH ─── */
  return (
    <>
      <style>{S}</style>
      <div className="app">
        <div className="match-screen">
          {/* Header */}
          <div className="ms-header">
            <button className="back" onClick={goBack}>←</button>
            <div className="ms-info">
              <div className="ms-league">{active.league}</div>
              <div className="ms-teams">{active.home.name} – {active.away.name}</div>
            </div>
            {active.status === "LIVE" && <div className="live-pill">Live</div>}
          </div>

          {/* Score / Upcoming */}
          {active.status === "UPCOMING" ? (
            <div className="upcoming-card">
              <div className="upcoming-lbl">Kickoff Time</div>
              <div className="upcoming-time">{active.time}</div>
              <div className="upcoming-sub">{active.home.name} · {active.away.name}</div>
              <button
                className={`notify-btn${notified[active.id] ? " notified" : ""}`}
                onClick={() => {
                  setNotified(p => ({ ...p, [active.id]: true }));
                  showToast("🔔 WE'LL NOTIFY YOU WHEN IT KICKS OFF!");
                }}
              >
                {notified[active.id] ? "✅ Notifications On" : "🔔 Notify Me"}
              </button>
            </div>
          ) : (
            <div className="score-card">
              <div className="sc-inner">
                <div className="sc-team">
                  <div className="sc-badge">{active.home.badge}</div>
                  <div className="sc-name">{active.home.name}</div>
                </div>
                <div className="sc-mid">
                  <div className="sc-score">{active.score[0]}–{active.score[1]}</div>
                  {active.status === "LIVE"
                    ? <div className="sc-time-live">{matchTime[active.id] || active.time}</div>
                    : <div className="sc-time-ft">FULL TIME</div>
                  }
                </div>
                <div className="sc-team">
                  <div className="sc-badge">{active.away.badge}</div>
                  <div className="sc-name">{active.away.name}</div>
                </div>
              </div>
              {active.stats && (
                <div className="sc-stats">
                  {[
                    [active.stats.poss, "Poss"],
                    [active.stats.shots, "Shots"],
                    [active.stats.corners, "Corners"],
                    [active.stats.yellow, "Yellow"],
                  ].map(([v, l]) => (
                    <div className="sc-stat" key={l}>
                      <div className="sc-stat-val">{v}</div>
                      <div className="sc-stat-lbl">{l}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reactions */}
          {active.status !== "UPCOMING" && (
            <div className="react-wrap">
              <div className="react-inner">
                {reacts.map((r, i) => (
                  <button key={i} className={`react-btn${r.on ? " on" : ""}`}
                    onClick={() => setReacts(p => p.map((x, j) => j === i ? { ...x, n: x.on ? x.n - 1 : x.n + 1, on: !x.on } : x))}>
                    <span className="e">{r.e}</span>
                    {r.n.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Poll */}
          {active.status !== "UPCOMING" && (
            <div className="poll">
              <div className="poll-head">⚡ Fan Poll</div>
              <div className="poll-q">Who wins tonight?</div>
              <div className="poll-opts">
                {[active.home.short, active.away.short, "Draw"].map((opt, i) => {
                  const pct = poll !== null ? Math.round((pollN[i] / pollTotal) * 100) : 0;
                  return (
                    <div key={i} className={`poll-opt${poll === i ? " voted" : ""}`} onClick={() => votePoll(i)}>
                      <div className="bar" style={{ width: poll !== null ? `${pct}%` : "0%" }} />
                      <div className="poll-inner">
                        {opt}
                        {poll !== null && <span className="poll-pct">{pct}%</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Feed */}
          <div className="feed-header">
            <div className="feed-title">The Stands</div>
            <div className="feed-hr" />
            {active.status === "LIVE" && (
              <div className="online-pill">
                <div className="od" />
                {active.viewers.toLocaleString()} live
              </div>
            )}
          </div>

          {active.status === "UPCOMING" ? (
            <div style={{ padding: "24px", textAlign: "center", color: "var(--muted)", fontFamily: "var(--cond)", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
              Comments open at kickoff 💬
            </div>
          ) : (
            <div className="feed">
              {msgs.map(m => (
                <div className="msg" key={m.id}>
                  <div className="msg-av" style={{ background: m.col }}>{m.av}</div>
                  <div className="msg-body">
                    <div className="msg-top">
                      <span className="msg-name">{m.user}</span>
                      <span className="msg-flag">{m.flag}</span>
                      {m.hot && <span className="hot-badge">🔥 Hot</span>}
                      <span className="msg-time">{m.time}</span>
                    </div>
                    <div className="msg-text">{m.text}</div>
                    <div className="msg-actions">
                      <button className="msg-act" onClick={() => like(active.id, m.id)}>👍 {m.likes}</button>
                      <button className="msg-act">💬 Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Input */}
          {active.status !== "UPCOMING" && (
            <div className="input-bar">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Raise your voice from the stands..."
              />
              <button className="send" onClick={send}>➤</button>
            </div>
          )}
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
