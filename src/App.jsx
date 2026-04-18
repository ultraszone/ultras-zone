import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, set, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBHxmw1g5w2nXm7bUP_zdPFiyQegi5nLPY",
  authDomain: "ultras-zone.firebaseapp.com",
  databaseURL: "https://ultras-zone-default-rtdb.firebaseio.com",
  projectId: "ultras-zone",
  storageBucket: "ultras-zone.firebasestorage.app",
  messagingSenderId: "391767236040",
  appId: "1:391767236040:web:bd3486b661ea73596874fd"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const API_KEY = "60958b8d45mshee5408e90b5fb3ap116287jsn6dbc1b620001";
const API_HOST = "free-api-live-football-data.p.rapidapi.com";

const BANNED = ["nigger","nigga","chink","spic","kike","wetback","raghead","coon","gook","faggot","beaner","negro"];
const isRacist = t => BANNED.some(w => t.toLowerCase().includes(w));
const FLAGS = ["🇺🇸","🇧🇷","🇮🇹","🇪🇸","🇩🇪","🇫🇷","🇦🇷","🇳🇬","🇯🇵","🇹🇷","🇬🇧","🇵🇹","🇲🇦","🇸🇦","🇷🇺"];
const COLORS = ["#7b1e1e","#1a3a6b","#1a5c2a","#3a1a6b","#6b3a1a","#1a4a3a","#4a1a6b","#6b1a3a","#1a6b5a","#4a3a1a"];
const REACTIONS = [
  {e:"⚽",l:"Goal!",n:2841},{e:"🔥",l:"Fire",n:1923},{e:"😤",l:"Angry",n:1102},
  {e:"😱",l:"Unreal",n:1567},{e:"🤣",l:"LOL",n:887},{e:"👏",l:"Clap",n:643},
  {e:"🍺",l:"Cheers!",n:512},{e:"💔",l:"Pain",n:421},{e:"🚩",l:"Foul!",n:334},
];

// Extract minute from all possible API fields
const getMinute = (m) => {
  const candidates = [
    m?.elapsed, m?.minute, m?.time_elapsed, m?.matchTime,
    m?.status?.elapsed, m?.fixture?.status?.elapsed,
    m?.score?.elapsed, m?.time?.minute,
    typeof m?.time === "number" ? m.time : null,
  ];
  for (const v of candidates) {
    const n = parseInt(v, 10);
    if (!isNaN(n) && n > 0) return n;
  }
  return null;
};

const S = `
@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap');

:root {
  --bg: #1a0808;
  --bg2: #220d0d;
  --bg3: #2a1010;
  --border: #3d1a1a;
  --yellow: #f5c518;
  --turq: #00d4ff;
  --white: #ffffff;
  --muted: #a07070;
  --green: #00e676;
  --red: #e53935;
  --font: 'Barlow', sans-serif;
  --cond: 'Barlow Condensed', sans-serif;
  --display: 'Oswald', sans-serif;
  --graffiti: 'Permanent Marker', cursive;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--bg); color: var(--white); font-family: var(--font); }
.app { max-width: 430px; margin: 0 auto; min-height: 100vh; background: var(--bg); }

/* ── OLD TRAFFORD BRICK ── */
.brick-bg {
  background-color: #1a0808;
  background-image:
    repeating-linear-gradient(180deg,
      transparent 0px, transparent 18px,
      rgba(0,0,0,0.65) 18px, rgba(0,0,0,0.65) 22px
    ),
    repeating-linear-gradient(90deg,
      transparent 0px, transparent 38px,
      rgba(0,0,0,0.65) 38px, rgba(0,0,0,0.65) 42px
    ),
    repeating-linear-gradient(135deg,
      rgba(180,40,20,0.18) 0px, rgba(120,20,10,0.12) 20px,
      rgba(160,35,15,0.15) 40px, rgba(100,15,5,0.08) 60px
    ),
    linear-gradient(180deg, #200a0a 0%, #1a0606 100%);
  background-size: 100% 22px, 42px 44px, 80px 80px, 100% 100%;
}

/* ── SPLASH ── */
.splash {
  min-height: 100vh;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
  background-color: #1a0808;
  background-image:
    repeating-linear-gradient(180deg, transparent 0px, transparent 18px, rgba(0,0,0,0.65) 18px, rgba(0,0,0,0.65) 22px),
    repeating-linear-gradient(90deg, transparent 0px, transparent 38px, rgba(0,0,0,0.65) 38px, rgba(0,0,0,0.65) 42px),
    repeating-linear-gradient(135deg, rgba(180,40,20,0.2) 0px, rgba(120,20,10,0.15) 20px, rgba(160,35,15,0.18) 40px, rgba(100,15,5,0.1) 60px),
    radial-gradient(ellipse at 50% 40%, rgba(229,57,53,0.18) 0%, transparent 60%),
    radial-gradient(ellipse at 20% 10%, rgba(245,197,24,0.12) 0%, transparent 35%),
    radial-gradient(ellipse at 80% 10%, rgba(245,197,24,0.12) 0%, transparent 35%),
    linear-gradient(180deg, #1a0808 0%, #200a0a 100%);
  background-size: 100% 22px, 42px 44px, 80px 80px, 100% 100%, 100% 100%, 100% 100%, 100% 100%;
}
.splash-flares {
  position: absolute; top: 0; left: 0; right: 0; height: 160px; pointer-events: none;
  background:
    radial-gradient(ellipse 100px 100px at 15% 0%, rgba(245,197,24,0.3) 0%, transparent 70%),
    radial-gradient(ellipse 100px 100px at 85% 0%, rgba(245,197,24,0.3) 0%, transparent 70%);
}
.splash-content { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; padding: 0 20px; }
.graffiti-logo { font-family: var(--graffiti); font-size: 58px; line-height: 1; letter-spacing: 2px; margin-bottom: 4px; }
.graffiti-logo .u { color: var(--yellow); text-shadow: 3px 3px 0 rgba(0,0,0,0.9), 0 0 20px rgba(245,197,24,0.5); }
.graffiti-logo .dot { color: var(--white); font-size: 40px; }
.graffiti-logo .z { color: var(--turq); text-shadow: 3px 3px 0 rgba(0,0,0,0.9), 0 0 20px rgba(0,212,255,0.5); }
.splash-wall-line { width: 100%; height: 3px; background: linear-gradient(90deg, transparent, #8b2020, var(--yellow), var(--turq), var(--yellow), #8b2020, transparent); margin: 10px 0 6px; }
.splash-tag { font-family: var(--graffiti); font-size: 13px; color: rgba(255,200,150,0.5); letter-spacing: 2px; margin-bottom: 32px; }
.name-input { background: rgba(80,20,10,0.5); border: 2px solid rgba(245,197,24,0.4); border-radius: 4px; padding: 12px 20px; font-size: 16px; color: var(--white); font-family: var(--cond); font-weight: 700; letter-spacing: 1px; outline: none; width: 260px; text-align: center; margin-bottom: 14px; transition: border-color .2s, box-shadow .2s; }
.name-input::placeholder { color: rgba(255,200,150,0.4); }
.name-input:focus { border-color: var(--yellow); box-shadow: 0 0 16px rgba(245,197,24,0.3); }
.splash-enter { background: linear-gradient(135deg, #8b1a1a 0%, #6b1010 100%); color: var(--yellow); border: 2px solid var(--yellow); padding: 14px 48px; font-family: var(--graffiti); font-size: 22px; letter-spacing: 2px; cursor: pointer; border-radius: 4px; transition: all .2s; margin-bottom: 36px; text-shadow: 0 0 10px rgba(245,197,24,0.5); box-shadow: 0 0 20px rgba(139,26,26,0.5); }
.splash-enter:hover { background: linear-gradient(135deg,#a02020,#801515); transform: scale(1.03); }
.splash-stats { display: flex; gap: 32px; }
.splash-stat { text-align: center; }
.splash-stat-val { font-family: var(--display); font-size: 26px; font-weight: 700; color: var(--yellow); }
.splash-stat-lbl { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-top: 2px; }

/* ── HEADER ── */
.header {
  padding: 12px 18px; display: flex; align-items: center; justify-content: space-between;
  border-bottom: 2px solid rgba(0,0,0,0.8);
  background:
    repeating-linear-gradient(180deg, transparent 0px, transparent 18px, rgba(0,0,0,0.6) 18px, rgba(0,0,0,0.6) 22px),
    linear-gradient(180deg, #2a0808 0%, #1e0606 100%);
  background-size: 100% 22px, 100% 100%;
  position: sticky; top: 0; z-index: 100;
}
.header-logo { font-family: var(--graffiti); font-size: 28px; letter-spacing: 1px; line-height: 1; }
.header-logo .u { color: var(--yellow); text-shadow: 2px 2px 0 rgba(0,0,0,0.9); }
.header-logo .dot { color: var(--white); font-size: 20px; }
.header-logo .z { color: var(--turq); text-shadow: 2px 2px 0 rgba(0,0,0,0.9); }
.live-pill { display: flex; align-items: center; gap: 5px; background: rgba(139,26,26,0.6); border: 1px solid rgba(229,57,53,0.5); border-radius: 3px; padding: 4px 10px; font-family: var(--cond); font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #ff8a8a; text-transform: uppercase; }
.live-pill::before { content: ''; width: 6px; height: 6px; background: var(--red); border-radius: 50%; animation: pulse 1s infinite; }

/* ── LEAGUE TABS ── */
.league-tabs { display: flex; gap: 0; overflow-x: auto; scrollbar-width: none; border-bottom: 1px solid rgba(0,0,0,0.6); background: rgba(20,5,5,0.8); padding: 0 14px; }
.league-tabs::-webkit-scrollbar { display: none; }
.league-tab { flex-shrink: 0; padding: 10px 14px; font-family: var(--cond); font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); cursor: pointer; border-bottom: 2px solid transparent; transition: all .15s; white-space: nowrap; }
.league-tab.active { color: var(--yellow); border-bottom-color: var(--yellow); }
.league-tab:hover { color: rgba(245,197,24,0.7); }

/* ── SECTION ── */
.section-header { display: flex; align-items: center; gap: 10px; padding: 12px 16px 8px; }
.section-tag { font-family: var(--cond); font-size: 11px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); }
.section-hr { flex: 1; height: 1px; background: rgba(0,0,0,0.6); }
.live-tag { display: flex; align-items: center; gap: 5px; font-family: var(--cond); font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #ff8a8a; text-transform: uppercase; }
.live-tag::before { content: ''; width: 6px; height: 6px; background: var(--red); border-radius: 50%; animation: pulse 1s infinite; }

/* ── MATCH CARDS ── */
.match-list { padding: 0 14px; display: flex; flex-direction: column; gap: 10px; padding-bottom: 24px; }
.match-card {
  background:
    repeating-linear-gradient(180deg, transparent 0px, transparent 18px, rgba(0,0,0,0.4) 18px, rgba(0,0,0,0.4) 22px),
    repeating-linear-gradient(90deg, transparent 0px, transparent 38px, rgba(0,0,0,0.4) 38px, rgba(0,0,0,0.4) 42px),
    linear-gradient(135deg, #2d0e0e 0%, #200808 100%);
  background-size: 100% 22px, 42px 44px, 100% 100%;
  border: 1px solid rgba(0,0,0,0.7); border-radius: 8px; overflow: hidden;
  cursor: pointer; position: relative; transition: all .18s;
  border-left: 4px solid #8b2020;
}
.match-card:hover { border-left-color: var(--yellow); transform: translateX(3px); }
.match-card:active { transform: scale(.98); }
.mc-league { display: flex; align-items: center; gap: 6px; padding: 8px 14px 0 14px; }
.mc-league-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--yellow); flex-shrink: 0; }
.mc-league-name { font-family: var(--cond); font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: rgba(245,197,24,0.7); }
.mc-body { display: flex; align-items: center; padding: 10px 14px 12px; gap: 8px; }
.mc-team { flex: 1; display: flex; align-items: center; gap: 8px; }
.mc-team.right { flex-direction: row-reverse; }
.mc-badge { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; font-family: var(--cond); background: rgba(80,20,10,0.7); border: 1px solid rgba(200,80,40,0.3); flex-shrink: 0; color: var(--white); }
.mc-name { font-family: var(--cond); font-size: 14px; font-weight: 800; text-transform: uppercase; color: var(--white); letter-spacing: 0.5px; }
.mc-team.right .mc-name { text-align: right; }
.mc-center { text-align: center; min-width: 86px; }
.mc-score { font-family: var(--display); font-size: 32px; font-weight: 700; letter-spacing: 6px; color: var(--yellow); line-height: 1; text-shadow: 0 0 12px rgba(245,197,24,0.4); }
.mc-time-badge { display: inline-flex; align-items: center; gap: 4px; background: rgba(139,26,26,0.9); color: #fff; font-family: var(--cond); font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 3px; margin-top: 4px; border: 1px solid rgba(229,57,53,0.5); }
.mc-time-badge::before { content: ''; width: 5px; height: 5px; background: #ff6b6b; border-radius: 50%; animation: pulse .8s infinite; }
.mc-footer { border-top: 1px solid rgba(0,0,0,0.5); padding: 7px 14px; display: flex; align-items: center; }
.mc-viewers { font-size: 11px; font-weight: 600; color: var(--muted); display: flex; align-items: center; gap: 5px; }
.mc-vdot { width: 5px; height: 5px; background: var(--green); border-radius: 50%; animation: pulse 2s infinite; }
.mc-cmts { margin-left: auto; font-size: 11px; color: rgba(245,197,24,0.6); }

/* ── MATCH SCREEN ── */
.ms-header {
  padding: 12px 16px; display: flex; align-items: center; gap: 12px;
  border-bottom: 2px solid rgba(0,0,0,0.8);
  background:
    repeating-linear-gradient(180deg, transparent 0px, transparent 18px, rgba(0,0,0,0.6) 18px, rgba(0,0,0,0.6) 22px),
    linear-gradient(180deg, #2a0808, #1a0606);
  background-size: 100% 22px, 100% 100%;
  position: sticky; top: 0; z-index: 100;
}
.back { width: 36px; height: 36px; background: rgba(80,20,10,0.7); border: 1px solid rgba(200,80,40,0.3); border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; color: var(--yellow); transition: all .15s; }
.back:hover { background: rgba(100,25,15,0.9); }
.ms-info { flex: 1; }
.ms-league { font-family: var(--cond); font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: rgba(245,197,24,0.7); margin-bottom: 2px; }
.ms-teams { font-family: var(--cond); font-size: 17px; font-weight: 800; text-transform: uppercase; color: var(--white); }

/* ── SCORE CARD ── */
.score-card { margin: 14px; border-radius: 10px; overflow: hidden; position: relative; border: 1px solid rgba(0,0,0,0.8); border-top: 4px solid var(--yellow); box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
.score-card-bg {
  position: absolute; inset: 0;
  background:
    repeating-linear-gradient(180deg, transparent 0px, transparent 18px, rgba(0,0,0,0.45) 18px, rgba(0,0,0,0.45) 22px),
    repeating-linear-gradient(90deg, transparent 0px, transparent 38px, rgba(0,0,0,0.45) 38px, rgba(0,0,0,0.45) 42px),
    radial-gradient(ellipse at 50% 0%, rgba(245,197,24,0.12) 0%, transparent 60%),
    linear-gradient(180deg, #3a1010 0%, #250a0a 100%);
  background-size: 100% 22px, 42px 44px, 100% 100%, 100% 100%;
}
.score-inner { display: flex; align-items: center; padding: 22px 16px 18px; gap: 8px; position: relative; z-index: 1; }
.sc-team { flex: 1; text-align: center; }
.sc-badge { width: 58px; height: 58px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 800; font-family: var(--cond); background: rgba(80,20,10,0.7); border: 2px solid rgba(200,80,40,0.3); margin: 0 auto 10px; color: var(--white); }
.sc-name { font-family: var(--cond); font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,220,180,0.85); }
.sc-mid { text-align: center; }
.sc-score { font-family: var(--display); font-size: 64px; font-weight: 700; letter-spacing: 8px; color: var(--yellow); line-height: 1; text-shadow: 0 0 20px rgba(245,197,24,0.5); }
.sc-time { background: rgba(139,26,26,0.9); color: #fff; font-family: var(--cond); font-size: 13px; font-weight: 800; padding: 4px 14px; border-radius: 3px; margin-top: 6px; display: inline-block; border: 1px solid rgba(229,57,53,0.5); }

/* ── REACTIONS ── */
.react-wrap { padding: 0 14px 14px; overflow-x: auto; scrollbar-width: none; }
.react-wrap::-webkit-scrollbar { display: none; }
.react-inner { display: flex; gap: 8px; width: max-content; }
.react-btn { display: flex; align-items: center; gap: 6px; background: rgba(60,15,10,0.7); border: 1px solid rgba(150,50,30,0.4); border-radius: 20px; padding: 7px 14px; cursor: pointer; color: var(--white); font-family: var(--cond); font-size: 13px; font-weight: 700; white-space: nowrap; transition: all .15s; }
.react-btn:hover, .react-btn.on { background: rgba(100,20,10,0.8); border-color: var(--yellow); color: var(--yellow); transform: translateY(-2px); }

/* ── POLL ── */
.poll { margin: 0 14px 14px; border-radius: 8px; overflow: hidden; border: 1px solid rgba(0,0,0,0.7); border-left: 4px solid var(--yellow); position: relative; }
.poll-bg {
  position: absolute; inset: 0;
  background:
    repeating-linear-gradient(180deg, transparent 0px, transparent 18px, rgba(0,0,0,0.4) 18px, rgba(0,0,0,0.4) 22px),
    linear-gradient(135deg, #2a0f0a 0%, #1e0808 100%);
  background-size: 100% 22px, 100% 100%;
}
.poll-inner-wrap { position: relative; z-index: 1; padding: 14px 16px; }
.poll-head { font-family: var(--cond); font-size: 10px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; color: var(--yellow); margin-bottom: 6px; }
.poll-q { font-size: 16px; font-weight: 700; color: var(--white); margin-bottom: 12px; }
.poll-opts { display: flex; gap: 8px; }
.poll-opt { flex: 1; background: rgba(60,15,10,0.7); border: 1px solid rgba(150,50,30,0.4); border-radius: 6px; padding: 12px 6px; text-align: center; cursor: pointer; font-family: var(--cond); font-size: 13px; font-weight: 800; color: var(--white); position: relative; overflow: hidden; text-transform: uppercase; letter-spacing: 0.5px; transition: all .2s; }
.poll-opt:hover { border-color: var(--yellow); }
.poll-opt-bar { position: absolute; left: 0; top: 0; bottom: 0; background: linear-gradient(90deg,rgba(245,197,24,0.25),rgba(245,197,24,0.08)); transition: width .6s ease; border-radius: 6px; }
.poll-opt.voted { border-color: var(--turq); color: var(--turq); }
.poll-opt.winner { border-color: var(--yellow); color: var(--yellow); }
.poll-opt-content { position: relative; z-index: 1; }
.poll-pct { display: block; font-family: var(--display); font-size: 22px; color: var(--yellow); margin-top: 4px; }
.poll-hint { text-align: center; font-family: var(--cond); font-size: 11px; color: var(--muted); letter-spacing: 1px; margin-top: 8px; }
.poll-total { text-align: right; font-family: var(--cond); font-size: 10px; color: var(--muted); letter-spacing: 1px; margin-top: 8px; }

/* ── FEED ── */
.feed-wrap {
  background:
    repeating-linear-gradient(180deg, transparent 0px, transparent 18px, rgba(0,0,0,0.3) 18px, rgba(0,0,0,0.3) 22px),
    linear-gradient(180deg, #1e0808 0%, #180606 100%);
  background-size: 100% 22px, 100% 100%;
}
.feed-header { display: flex; align-items: center; gap: 10px; padding: 12px 16px 8px; }
.feed-title { font-family: var(--cond); font-size: 11px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; color: rgba(245,197,24,0.8); }
.feed-hr { flex: 1; height: 1px; background: rgba(0,0,0,0.6); }
.online-pill { display: flex; align-items: center; gap: 5px; font-family: var(--cond); font-size: 11px; font-weight: 700; color: var(--muted); }
.od { width: 5px; height: 5px; background: var(--green); border-radius: 50%; animation: pulse 2s infinite; }
.feed { padding: 0 14px; display: flex; flex-direction: column; gap: 10px; max-height: 340px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.5) transparent; }
.msg { display: flex; gap: 10px; animation: fadeIn .3s ease; }
.msg-av { width: 36px; height: 36px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-family: var(--cond); font-size: 14px; font-weight: 800; flex-shrink: 0; border: 1px solid rgba(150,50,30,0.3); color: var(--white); }
.msg-body { flex: 1; }
.msg-top { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; }
.msg-name { font-family: var(--cond); font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: var(--yellow); }
.msg-flag { font-size: 13px; }
.msg-time { font-size: 10px; color: var(--muted); margin-left: auto; font-family: var(--cond); font-weight: 700; }
.msg-text { font-size: 14px; color: rgba(255,220,190,0.85); line-height: 1.45; }

/* ── INPUT ── */
.input-bar {
  padding: 10px 14px 16px; display: flex; gap: 9px;
  border-top: 2px solid rgba(0,0,0,0.7);
  background:
    repeating-linear-gradient(180deg, transparent 0px, transparent 18px, rgba(0,0,0,0.5) 18px, rgba(0,0,0,0.5) 22px),
    linear-gradient(180deg, #2a0808, #1a0606);
  background-size: 100% 22px, 100% 100%;
  position: sticky; bottom: 0;
}
.input-bar input { flex: 1; background: rgba(60,15,10,0.6); border: 1px solid rgba(150,50,30,0.4); border-radius: 24px; padding: 11px 18px; font-size: 14px; color: var(--white); font-family: var(--font); outline: none; transition: border-color .15s, box-shadow .15s; }
.input-bar input:focus { border-color: var(--yellow); box-shadow: 0 0 12px rgba(245,197,24,0.2); }
.input-bar input::placeholder { color: rgba(255,180,120,0.3); }
.send { width: 44px; height: 44px; background: linear-gradient(135deg,#8b1a1a,#6b1010); border: 1px solid rgba(245,197,24,0.5); border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 17px; color: var(--yellow); flex-shrink: 0; transition: all .15s; }
.send:hover { background: linear-gradient(135deg,#a02020,#801515); transform: scale(1.06); }

.toast { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: #6b1010; color: #fff; font-family: var(--cond); font-size: 13px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 10px 20px; border-radius: 3px; z-index: 9999; white-space: nowrap; animation: toastPop .3s ease; border: 1px solid var(--red); }
.loading { text-align: center; padding: 40px 20px; color: var(--muted); font-family: var(--cond); font-size: 12px; letter-spacing: 2px; text-transform: uppercase; }
.no-matches { text-align: center; padding: 24px 20px; color: var(--muted); font-family: var(--cond); font-size: 12px; letter-spacing: 1px; }

@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
@keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
@keyframes toastPop { from{opacity:0;transform:translateX(-50%) scale(.9)} to{opacity:1;transform:translateX(-50%) scale(1)} }
`;

export default function UltrasZone() {
  const savedName = typeof window !== "undefined" ? localStorage.getItem("uz_name") : null;
  const [screen, setScreen] = useState(savedName ? "home" : "splash");
  const [active, setActive] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState({});
  const [reacts, setReacts] = useState(REACTIONS.map(r => ({ ...r, on: false })));
  const [input, setInput] = useState("");
  const [toast, setToast] = useState(null);
  const [pollVoted, setPollVoted] = useState(null);
  const [pollData, setPollData] = useState({ 0: 0, 1: 0, 2: 0 });
  const [userName, setUserName] = useState(savedName || "");
  const [tempName, setTempName] = useState("");
  const [liveMinutes, setLiveMinutes] = useState({});
  const [activeLeague, setActiveLeague] = useState("All");
  const unsubRef = useRef(null);
  const unsubPollRef = useRef(null);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://free-api-live-football-data.p.rapidapi.com/football-current-live", {
        headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": API_HOST }
      });
      const data = await res.json();
      const raw = data?.response?.live || [];

      const live = raw.slice(0, 50).map(m => {
        const minute = getMinute(m);
        return {
          id: `match_${m.id}`,
          status: "LIVE",
          elapsed: minute,
          league: m.leagueName || m.league?.name || "Football",
          home: {
            name: m.home?.name || m.homeTeam?.name || "Home",
            short: (m.home?.name || m.homeTeam?.name || "HOM").slice(0,3).toUpperCase(),
            badge: (m.home?.name || m.homeTeam?.name || "H").slice(0,2).toUpperCase()
          },
          away: {
            name: m.away?.name || m.awayTeam?.name || "Away",
            short: (m.away?.name || m.awayTeam?.name || "AWY").slice(0,3).toUpperCase(),
            badge: (m.away?.name || m.awayTeam?.name || "A").slice(0,2).toUpperCase()
          },
          score: [
            m.home?.score ?? m.homeScore ?? m.score?.home ?? 0,
            m.away?.score ?? m.awayScore ?? m.score?.away ?? 0
          ],
          viewers: Math.floor(Math.random() * 15000) + 1000,
        };
      });

      setMatches(live);

      // Set initial minutes
      const mins = {};
      live.forEach(m => { mins[m.id] = m.elapsed ?? 0; });
      setLiveMinutes(mins);

    } catch(e) { console.error(e); }
    setLoading(false);
  };

  // Tick every 60s
  useEffect(() => {
    const t = setInterval(() => {
      setLiveMinutes(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(id => { if (next[id] < 90) next[id] = next[id] + 1; });
        return next;
      });
    }, 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (screen === "home") {
      fetchMatches();
      const t = setInterval(fetchMatches, 120000);
      return () => clearInterval(t);
    }
  }, [screen]);

  // Comments
  useEffect(() => {
    if (!active) return;
    if (unsubRef.current) unsubRef.current();
    const commentsRef = ref(db, `comments/${active.id}`);
    const unsub = onValue(commentsRef, snap => {
      const data = snap.val();
      if (data) {
        const list = Object.values(data).sort((a,b) => b.ts - a.ts).slice(0, 50);
        setComments(p => ({ ...p, [active.id]: list }));
      } else {
        setComments(p => ({ ...p, [active.id]: [] }));
      }
    });
    unsubRef.current = unsub;
    return () => unsub();
  }, [active]);

  // Poll
  useEffect(() => {
    if (!active) return;
    if (unsubPollRef.current) unsubPollRef.current();
    setPollVoted(null);
    setPollData({ 0: 0, 1: 0, 2: 0 });
    const pollRef = ref(db, `polls/${active.id}`);
    const unsub = onValue(pollRef, snap => {
      const data = snap.val();
      if (data) setPollData({ 0: data[0]||0, 1: data[1]||0, 2: data[2]||0 });
    });
    unsubPollRef.current = unsub;
    return () => unsub();
  }, [active]);

  const openMatch = m => { setActive(m); setScreen("match"); };
  const goBack = () => { setScreen("home"); setActive(null); };
  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const enterApp = () => {
    if (!tempName.trim()) { showToast("Enter your name first!"); return; }
    const name = tempName.trim();
    setUserName(name);
    localStorage.setItem("uz_name", name);
    setScreen("home");
  };

  const send = async () => {
    if (!input.trim()) return;
    if (isRacist(input)) { showToast("RACIST CONTENT REMOVED"); setInput(""); return; }
    const flag = FLAGS[Math.floor(Math.random() * FLAGS.length)];
    const col = COLORS[Math.floor(Math.random() * COLORS.length)];
    const initials = userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2);
    const currentMin = active ? (liveMinutes[active.id] ?? 0) : 0;
    await push(ref(db, `comments/${active.id}`), {
      user: userName, flag, col, av: initials,
      text: input.trim(),
      time: currentMin > 0 ? `${currentMin}'` : "LIVE",
      likes: 0, ts: Date.now()
    });
    setInput("");
  };

  const votePoll = async i => {
    if (pollVoted !== null) return;
    setPollVoted(i);
    const pollRef = ref(db, `polls/${active.id}`);
    const snap = await get(pollRef);
    const current = snap.val() || { 0: 0, 1: 0, 2: 0 };
    current[i] = (current[i] || 0) + 1;
    await set(pollRef, current);
  };

  // League tabs
  const leagues = ["All", ...Array.from(new Set(matches.map(m => m.league))).sort()];
  const filteredMatches = activeLeague === "All"
    ? matches
    : matches.filter(m => m.league === activeLeague);

  const today = new Date().toLocaleDateString("en-US", { weekday:"short", day:"numeric", month:"short" }).toUpperCase();
  const pollTotal = (pollData[0]||0) + (pollData[1]||0) + (pollData[2]||0);
  const msgs = active ? (comments[active.id] || []) : [];
  const winnerIdx = pollVoted !== null && pollTotal > 0
    ? String(Object.keys(pollData).reduce((a,b) => (pollData[a]||0) >= (pollData[b]||0) ? a : b))
    : null;
  const activeMin = active ? (liveMinutes[active.id] ?? active.elapsed ?? 0) : 0;

  /* ── SPLASH ── */
  if (screen === "splash") return (
    <>
      <style>{S}</style>
      <div className="app">
        <div className="splash">
          <div className="splash-flares" />
          <div className="splash-content">
            <div className="graffiti-logo">
              <span className="u">ULTRAS</span><span className="dot">.</span><span className="z">ZONE</span>
            </div>
            <div className="splash-wall-line" />
            <div className="splash-tag">voice of the fans</div>
            <input className="name-input" placeholder="What's your name?" value={tempName} onChange={e => setTempName(e.target.value)} onKeyDown={e => e.key==="Enter" && enterApp()} />
            <button className="splash-enter" onClick={enterApp}>ENTER THE ZONE</button>
            <div className="splash-stats">
              <div className="splash-stat"><div className="splash-stat-val">50M+</div><div className="splash-stat-lbl">Global Fans</div></div>
              <div className="splash-stat"><div className="splash-stat-val">Live</div><div className="splash-stat-lbl">Matches</div></div>
              <div className="splash-stat"><div className="splash-stat-val">Real</div><div className="splash-stat-lbl">Scores</div></div>
            </div>
          </div>
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );

  /* ── HOME ── */
  if (screen === "home") return (
    <>
      <style>{S}</style>
      <div className="app brick-bg">
        <div className="header">
          <div className="header-logo">
            <span className="u">ULTRAS</span><span className="dot">.</span><span className="z">ZONE</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div className="live-pill">{matches.length} Live</div>
            <div style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--cond)",letterSpacing:1}}>{today}</div>
          </div>
        </div>

        {/* League Tabs */}
        {!loading && matches.length > 0 && (
          <div className="league-tabs">
            {leagues.map(lg => (
              <div key={lg} className={`league-tab${activeLeague===lg?" active":""}`} onClick={() => setActiveLeague(lg)}>
                {lg === "All" ? `🌍 All (${matches.length})` : lg}
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="loading">⚽ Loading live matches...</div>
        ) : matches.length === 0 ? (
          <div className="loading">No live matches right now</div>
        ) : (
          <>
            <div className="section-header">
              <div className="live-tag">🔴 Live</div>
              <div className="section-hr" />
              <div className="section-tag">{filteredMatches.length} matches</div>
            </div>
            {filteredMatches.length === 0 ? (
              <div className="no-matches">No matches in this league right now</div>
            ) : (
              <div className="match-list">
                {filteredMatches.map(m => {
                  const min = liveMinutes[m.id] ?? m.elapsed ?? 0;
                  return (
                    <div className="match-card" key={m.id} onClick={() => openMatch(m)}>
                      <div className="mc-league">
                        <div className="mc-league-dot" />
                        <div className="mc-league-name">{m.league}</div>
                      </div>
                      <div className="mc-body">
                        <div className="mc-team">
                          <div className="mc-badge">{m.home.badge}</div>
                          <div className="mc-name">{m.home.name}</div>
                        </div>
                        <div className="mc-center">
                          <div className="mc-score">{m.score[0]}–{m.score[1]}</div>
                          <div className="mc-time-badge">
                            {min > 0 ? `${min}'` : "LIVE"}
                          </div>
                        </div>
                        <div className="mc-team right">
                          <div className="mc-badge">{m.away.badge}</div>
                          <div className="mc-name">{m.away.name}</div>
                        </div>
                      </div>
                      <div className="mc-footer">
                        <div className="mc-viewers"><div className="mc-vdot" />{m.viewers.toLocaleString()} watching</div>
                        <div className="mc-cmts">💬 {(comments[m.id]||[]).length}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );

  /* ── MATCH ── */
  return (
    <>
      <style>{S}</style>
      <div className="app brick-bg">
        <div className="ms-header">
          <button className="back" onClick={goBack}>←</button>
          <div className="ms-info">
            <div className="ms-league">{active.league}</div>
            <div className="ms-teams">{active.home.name} – {active.away.name}</div>
          </div>
          <div className="live-pill">Live</div>
        </div>

        <div className="score-card">
          <div className="score-card-bg" />
          <div className="score-inner">
            <div className="sc-team">
              <div className="sc-badge">{active.home.badge}</div>
              <div className="sc-name">{active.home.name}</div>
            </div>
            <div className="sc-mid">
              <div className="sc-score">{active.score[0]}–{active.score[1]}</div>
              <div className="sc-time">
                {activeMin > 0 ? `${activeMin}'` : "LIVE"}
              </div>
            </div>
            <div className="sc-team">
              <div className="sc-badge">{active.away.badge}</div>
              <div className="sc-name">{active.away.name}</div>
            </div>
          </div>
        </div>

        <div className="react-wrap">
          <div className="react-inner">
            {reacts.map((r,i) => (
              <button key={i} className={`react-btn${r.on?" on":""}`}
                onClick={() => setReacts(p => p.map((x,j) => j===i?{...x,n:x.on?x.n-1:x.n+1,on:!x.on}:x))}>
                <span>{r.e}</span>{r.n.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div className="poll">
          <div className="poll-bg" />
          <div className="poll-inner-wrap">
            <div className="poll-head">⚡ Fan Poll — Live Votes</div>
            <div className="poll-q">Who wins this match?</div>
            <div className="poll-opts">
              {[active.home.short, active.away.short, "Draw"].map((opt,i) => {
                const pct = pollTotal > 0 ? Math.round(((pollData[i]||0)/pollTotal)*100) : 0;
                const isWinner = winnerIdx !== null && String(i) === winnerIdx;
                return (
                  <div key={i}
                    className={`poll-opt${pollVoted===i?" voted":""}${isWinner?" winner":""}`}
                    onClick={() => votePoll(i)}
                    style={{cursor:pollVoted!==null?"default":"pointer"}}>
                    <div className="poll-opt-bar" style={{width:pollVoted!==null?`${pct}%`:"0%"}} />
                    <div className="poll-opt-content">
                      <span>{opt}</span>
                      {pollVoted!==null && <span className="poll-pct">{pct}%</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            {pollVoted===null
              ? <div className="poll-hint">Tap to cast your vote</div>
              : <div className="poll-total">{pollTotal.toLocaleString()} total votes</div>
            }
          </div>
        </div>

        <div className="feed-wrap">
          <div className="feed-header">
            <div className="feed-title">🏟️ The Stands</div>
            <div className="feed-hr" />
            <div className="online-pill"><div className="od" />{active.viewers.toLocaleString()} live</div>
          </div>
          <div className="feed">
            {msgs.length===0 && <div className="loading">Be the first to comment! 🔥</div>}
            {msgs.map((m,i) => (
              <div className="msg" key={i}>
                <div className="msg-av" style={{background:m.col}}>{m.av}</div>
                <div className="msg-body">
                  <div className="msg-top">
                    <span className="msg-name">{m.user}</span>
                    <span className="msg-flag">{m.flag}</span>
                    <span className="msg-time">{m.time}</span>
                  </div>
                  <div className="msg-text">{m.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="input-bar">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter"&&send()} placeholder="Raise your voice from the stands..." />
          <button className="send" onClick={send}>➤</button>
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
