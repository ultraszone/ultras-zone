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

const BANNED = ["nigger","nigga","chink","spic","kike","wetback","raghead","coon","gook","faggot","beaner","negro"];
const isRacist = t => BANNED.some(w => t.toLowerCase().includes(w));
const FLAGS = ["🇺🇸","🇧🇷","🇮🇹","🇪🇸","🇩🇪","🇫🇷","🇦🇷","🇳🇬","🇯🇵","🇹🇷","🇬🇧","🇵🇹","🇲🇦","🇸🇦","🇷🇺"];
const COLORS = ["#7b1e1e","#1a3a6b","#1a5c2a","#3a1a6b","#6b3a1a","#1a4a3a","#4a1a6b","#6b1a3a","#1a6b5a","#4a3a1a"];
const REACTIONS = [
  {e:"⚽",l:"Goal!",n:2841},{e:"🔥",l:"Fire",n:1923},{e:"😤",l:"Angry",n:1102},
  {e:"😱",l:"Unreal",n:1567},{e:"🤣",l:"LOL",n:887},{e:"👏",l:"Clap",n:643},
  {e:"🍺",l:"Cheers!",n:512},{e:"💔",l:"Pain",n:421},{e:"🚩",l:"Foul!",n:334},
];

// All ESPN leagues to fetch automatically - no config needed
const ESPN_LEAGUES = [
  { id: "eng.1", name: "Premier League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "esp.1", name: "La Liga", flag: "🇪🇸" },
  { id: "ger.1", name: "Bundesliga", flag: "🇩🇪" },
  { id: "ita.1", name: "Serie A", flag: "🇮🇹" },
  { id: "fra.1", name: "Ligue 1", flag: "🇫🇷" },
  { id: "tur.1", name: "Süper Lig", flag: "🇹🇷" },
  { id: "uefa.champions", name: "Champions League", flag: "⭐" },
  { id: "uefa.europa", name: "Europa League", flag: "🟠" },
  { id: "ned.1", name: "Eredivisie", flag: "🇳🇱" },
  { id: "por.1", name: "Primeira Liga", flag: "🇵🇹" },
  { id: "usa.1", name: "MLS", flag: "🇺🇸" },
  { id: "bra.1", name: "Brasileirão", flag: "🇧🇷" },
  { id: "arg.1", name: "Liga Argentina", flag: "🇦🇷" },
  { id: "mex.1", name: "Liga MX", flag: "🇲🇽" },
  { id: "sco.1", name: "Scottish Prem", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
];

const LEAGUE_FLAGS = Object.fromEntries(ESPN_LEAGUES.map(l => [l.name, l.flag]));

async function fetchLeague(leagueId) {
  try {
    const res = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return (data?.events || []).map(evt => {
      const comp = evt?.competitions?.[0];
      const home = comp?.competitors?.find(c => c.homeAway === "home");
      const away = comp?.competitors?.find(c => c.homeAway === "away");
      const status = evt?.status;
      const state = status?.type?.state;
      const clock = status?.displayClock || "";
      const detail = status?.type?.shortDetail || "";
      let elapsed = null;
      if (state === "in") {
        const m = parseInt(clock);
        if (!isNaN(m) && m > 0) elapsed = m;
      }
      const leagueName = evt?.season?.slug
        ? ESPN_LEAGUES.find(l => l.id === leagueId)?.name || "Football"
        : ESPN_LEAGUES.find(l => l.id === leagueId)?.name || "Football";
      return {
        id: `espn_${leagueId}_${evt.id}`,
        league: leagueName,
        leagueId,
        state,
        elapsed,
        detail,
        kickoffDisplay: detail,
        home: {
          name: home?.team?.displayName || home?.team?.name || "Home",
          short: (home?.team?.abbreviation || "HOM").slice(0,3).toUpperCase(),
          badge: (home?.team?.abbreviation || home?.team?.name || "H").slice(0,2).toUpperCase(),
        },
        away: {
          name: away?.team?.displayName || away?.team?.name || "Away",
          short: (away?.team?.abbreviation || "AWY").slice(0,3).toUpperCase(),
          badge: (away?.team?.abbreviation || away?.team?.name || "A").slice(0,2).toUpperCase(),
        },
        score: [parseInt(home?.score) || 0, parseInt(away?.score) || 0],
        status: state === "in" ? "LIVE" : state === "post" ? "FT" : "UPCOMING",
        viewers: Math.floor(Math.random() * 18000) + 2000,
      };
    });
  } catch { return []; }
}

const S = `
@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap');
:root{
  --bg:#08020f;--border:#2a1040;
  --yellow:#f5c518;--turq:#00d4ff;--white:#fff;
  --muted:#9070a0;--green:#00e676;--red:#e53935;
  --font:'Barlow',sans-serif;--cond:'Barlow Condensed',sans-serif;
  --display:'Oswald',sans-serif;--graffiti:'Permanent Marker',cursive;
}
*{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--bg);color:var(--white);font-family:var(--font);}
.app{max-width:430px;margin:0 auto;min-height:100vh;background:var(--bg);}

/* ── ULTRAS STADIUM CSS ART ── */
.stadium-bg{
  background-color:#08020f;
  background-image:
    /* crowd rows */
    repeating-linear-gradient(180deg,
      rgba(0,0,0,0) 0px, rgba(0,0,0,0) 26px,
      rgba(20,5,35,0.7) 26px, rgba(20,5,35,0.7) 30px,
      rgba(0,0,0,0) 30px, rgba(0,0,0,0) 52px,
      rgba(12,3,22,0.55) 52px, rgba(12,3,22,0.55) 56px
    ),
    /* orange flare burst - right */
    radial-gradient(ellipse 55% 38% at 78% 28%, rgba(230,90,10,0.5) 0%, rgba(190,50,5,0.25) 35%, transparent 65%),
    /* flare smoke - blue purple */
    radial-gradient(ellipse 45% 55% at 74% 6%, rgba(90,80,200,0.35) 0%, rgba(60,50,160,0.15) 45%, transparent 72%),
    /* second flare - left */
    radial-gradient(ellipse 28% 38% at 18% 22%, rgba(210,70,5,0.38) 0%, rgba(160,35,0,0.15) 42%, transparent 68%),
    /* red smoke left */
    radial-gradient(ellipse 25% 35% at 10% 8%, rgba(180,20,20,0.25) 0%, transparent 60%),
    /* stadium floodlights */
    radial-gradient(ellipse 80% 15% at 50% 0%, rgba(255,220,120,0.1) 0%, transparent 55%),
    /* deep purple base */
    linear-gradient(180deg, #0e0220 0%, #080115 45%, #040010 100%);
  background-size: 100% 56px, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%;
}

/* ── SPLASH ── */
.splash{
  min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
  position:relative;overflow:hidden;
  background-color:#08020f;
  background-image:
    repeating-linear-gradient(180deg,
      rgba(0,0,0,0) 0px, rgba(0,0,0,0) 26px,
      rgba(20,5,35,0.65) 26px, rgba(20,5,35,0.65) 30px,
      rgba(0,0,0,0) 30px, rgba(0,0,0,0) 52px,
      rgba(12,3,22,0.5) 52px, rgba(12,3,22,0.5) 56px
    ),
    radial-gradient(ellipse 60% 42% at 78% 30%, rgba(230,90,10,0.55) 0%, rgba(190,50,5,0.28) 35%, transparent 65%),
    radial-gradient(ellipse 48% 58% at 74% 5%, rgba(90,80,200,0.4) 0%, rgba(60,50,160,0.18) 45%, transparent 70%),
    radial-gradient(ellipse 30% 40% at 16% 24%, rgba(210,70,5,0.42) 0%, rgba(160,35,0,0.18) 42%, transparent 65%),
    radial-gradient(ellipse 28% 38% at 8% 7%, rgba(180,20,20,0.3) 0%, transparent 58%),
    radial-gradient(ellipse 85% 18% at 50% 0%, rgba(255,210,100,0.13) 0%, transparent 55%),
    radial-gradient(ellipse 50% 50% at 50% 55%, rgba(120,0,180,0.08) 0%, transparent 65%),
    linear-gradient(180deg, #100225 0%, #08011a 45%, #040010 100%);
  background-size: 100% 56px, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%;
}
.splash-flares{position:absolute;top:0;left:0;right:0;height:180px;pointer-events:none;
  background:
    radial-gradient(ellipse 90px 120px at 14% 0%, rgba(245,197,24,0.35) 0%, transparent 70%),
    radial-gradient(ellipse 90px 120px at 86% 0%, rgba(245,197,24,0.35) 0%, transparent 70%),
    radial-gradient(ellipse 40px 60px at 38% 0%, rgba(255,255,255,0.12) 0%, transparent 70%),
    radial-gradient(ellipse 40px 60px at 62% 0%, rgba(255,255,255,0.12) 0%, transparent 70%);}
.splash-content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;padding:0 20px;}
.graffiti-logo{font-family:var(--graffiti);font-size:58px;line-height:1;letter-spacing:2px;margin-bottom:4px;}
.graffiti-logo .u{color:var(--yellow);text-shadow:3px 3px 0 rgba(0,0,0,.9),0 0 25px rgba(245,197,24,.6);}
.graffiti-logo .dot{color:var(--white);font-size:40px;}
.graffiti-logo .z{color:var(--turq);text-shadow:3px 3px 0 rgba(0,0,0,.9),0 0 25px rgba(0,212,255,.6);}
.splash-wall-line{width:100%;height:3px;background:linear-gradient(90deg,transparent,rgba(150,0,200,.6),var(--yellow),var(--turq),var(--yellow),rgba(150,0,200,.6),transparent);margin:10px 0 6px;}
.splash-tag{font-family:var(--graffiti);font-size:13px;color:rgba(200,170,255,.5);letter-spacing:2px;margin-bottom:32px;}
.name-input{background:rgba(60,10,90,.5);border:2px solid rgba(245,197,24,.4);border-radius:4px;padding:12px 20px;font-size:16px;color:var(--white);font-family:var(--cond);font-weight:700;letter-spacing:1px;outline:none;width:260px;text-align:center;margin-bottom:14px;transition:border-color .2s,box-shadow .2s;}
.name-input::placeholder{color:rgba(200,170,255,.4);}
.name-input:focus{border-color:var(--yellow);box-shadow:0 0 16px rgba(245,197,24,.35);}
.splash-enter{background:linear-gradient(135deg,#4a0a8a 0%,#2a0550 100%);color:var(--yellow);border:2px solid var(--yellow);padding:14px 48px;font-family:var(--graffiti);font-size:22px;letter-spacing:2px;cursor:pointer;border-radius:4px;transition:all .2s;margin-bottom:36px;text-shadow:0 0 12px rgba(245,197,24,.6);box-shadow:0 0 24px rgba(100,0,200,.4);}
.splash-enter:hover{background:linear-gradient(135deg,#5a1aaa,#3a0a70);transform:scale(1.03);}
.splash-stats{display:flex;gap:32px;}
.splash-stat{text-align:center;}
.splash-stat-val{font-family:var(--display);font-size:26px;font-weight:700;color:var(--yellow);}
.splash-stat-lbl{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-top:2px;}

/* ── HEADER ── */
.header{padding:12px 18px;display:flex;align-items:center;justify-content:space-between;
  border-bottom:1px solid rgba(150,0,255,.2);
  background:rgba(8,2,15,0.96);
  position:sticky;top:0;z-index:100;backdrop-filter:blur(12px);}
.header-logo{font-family:var(--graffiti);font-size:28px;letter-spacing:1px;line-height:1;}
.header-logo .u{color:var(--yellow);text-shadow:2px 2px 0 rgba(0,0,0,.9);}
.header-logo .dot{color:var(--white);font-size:20px;}
.header-logo .z{color:var(--turq);text-shadow:2px 2px 0 rgba(0,0,0,.9);}
.live-pill{display:flex;align-items:center;gap:5px;background:rgba(229,57,53,.15);border:1px solid rgba(229,57,53,.5);border-radius:3px;padding:4px 10px;font-family:var(--cond);font-size:11px;font-weight:800;letter-spacing:2px;color:#ff8a8a;text-transform:uppercase;}
.live-pill::before{content:'';width:6px;height:6px;background:var(--red);border-radius:50%;animation:pulse 1s infinite;}

/* ── LEAGUE FILTER TABS ── */
.league-tabs{display:flex;gap:0;overflow-x:auto;scrollbar-width:none;border-bottom:1px solid rgba(150,0,255,.15);background:rgba(5,0,12,.9);padding:0 14px;}
.league-tabs::-webkit-scrollbar{display:none;}
.league-tab{flex-shrink:0;padding:9px 13px;font-family:var(--cond);font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;white-space:nowrap;}
.league-tab.active{color:var(--yellow);border-bottom-color:var(--yellow);}
.league-tab:hover{color:rgba(245,197,24,.7);}

/* ── LEAGUE GROUP ── */
.league-group{margin-bottom:4px;}
.league-header{display:flex;align-items:center;gap:10px;padding:14px 16px 8px;}
.league-flag{font-size:16px;}
.league-title{font-family:var(--cond);font-size:13px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--yellow);}
.league-hr{flex:1;height:1px;background:rgba(245,197,24,.2);}
.league-live-dot{width:7px;height:7px;background:var(--red);border-radius:50%;animation:pulse .8s infinite;}

/* ── MATCH CARDS ── */
.match-list{padding:0 14px;display:flex;flex-direction:column;gap:8px;padding-bottom:8px;}
.match-card{
  background:rgba(15,5,25,.85);
  border:1px solid rgba(100,0,200,.2);
  border-radius:8px;overflow:hidden;cursor:pointer;
  position:relative;transition:all .18s;border-left:4px solid rgba(100,0,200,.4);
  backdrop-filter:blur(4px);
}
.match-card.live{border-left-color:var(--red);}
.match-card.finished{border-left-color:#333;opacity:.8;}
.match-card:hover{border-color:rgba(245,197,24,.4);border-left-color:var(--yellow);transform:translateX(3px);}
.match-card:active{transform:scale(.98);}
.mc-body{display:flex;align-items:center;padding:12px 14px;gap:8px;}
.mc-team{flex:1;display:flex;align-items:center;gap:8px;}
.mc-team.right{flex-direction:row-reverse;}
.mc-badge{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;font-family:var(--cond);background:rgba(60,10,100,.6);border:1px solid rgba(150,0,255,.25);flex-shrink:0;color:var(--white);}
.mc-name{font-family:var(--cond);font-size:14px;font-weight:800;text-transform:uppercase;color:var(--white);letter-spacing:.5px;}
.mc-team.right .mc-name{text-align:right;}
.mc-center{text-align:center;min-width:90px;}
.mc-score{font-family:var(--display);font-size:32px;font-weight:700;letter-spacing:6px;color:var(--yellow);line-height:1;text-shadow:0 0 12px rgba(245,197,24,.4);}
.mc-score.upcoming{font-size:16px;color:rgba(0,212,255,.7);letter-spacing:1px;line-height:1.4;}
.mc-badge-live{display:inline-flex;align-items:center;gap:4px;background:rgba(229,57,53,.9);color:#fff;font-family:var(--cond);font-size:11px;font-weight:800;padding:3px 10px;border-radius:3px;margin-top:4px;border:1px solid rgba(229,57,53,.5);}
.mc-badge-live::before{content:'';width:5px;height:5px;background:#ff9a9a;border-radius:50%;animation:pulse .8s infinite;}
.mc-badge-upcoming{display:inline-block;font-family:var(--cond);font-size:10px;font-weight:800;color:rgba(0,212,255,.8);margin-top:4px;letter-spacing:.5px;}
.mc-badge-ft{display:inline-block;font-family:var(--cond);font-size:11px;font-weight:800;color:var(--muted);margin-top:4px;letter-spacing:1px;}
.mc-footer{border-top:1px solid rgba(100,0,200,.15);padding:6px 14px;display:flex;align-items:center;}
.mc-viewers{font-size:11px;font-weight:600;color:var(--muted);display:flex;align-items:center;gap:5px;}
.mc-vdot{width:5px;height:5px;background:var(--green);border-radius:50%;animation:pulse 2s infinite;}
.mc-cmts{margin-left:auto;font-size:11px;color:rgba(245,197,24,.6);}

/* ── MATCH SCREEN ── */
.ms-header{padding:12px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(150,0,255,.2);background:rgba(8,2,15,0.96);position:sticky;top:0;z-index:100;backdrop-filter:blur(12px);}
.back{width:36px;height:36px;background:rgba(60,10,90,.7);border:1px solid rgba(150,0,255,.3);border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--yellow);transition:all .15s;}
.back:hover{background:rgba(80,15,120,.9);}
.ms-info{flex:1;}
.ms-league{font-family:var(--cond);font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:rgba(245,197,24,.7);margin-bottom:2px;}
.ms-teams{font-family:var(--cond);font-size:17px;font-weight:800;text-transform:uppercase;color:var(--white);}
.ms-live{display:flex;align-items:center;gap:5px;background:rgba(229,57,53,.15);border:1px solid rgba(229,57,53,.5);border-radius:3px;padding:4px 10px;font-family:var(--cond);font-size:11px;font-weight:800;letter-spacing:2px;color:#ff8a8a;text-transform:uppercase;}
.ms-live::before{content:'';width:6px;height:6px;background:var(--red);border-radius:50%;animation:pulse 1s infinite;}
.ms-status{font-family:var(--cond);font-size:12px;font-weight:800;color:var(--muted);padding:4px 10px;border:1px solid rgba(100,100,100,.3);border-radius:3px;}

/* ── SCORE CARD ── */
.score-card{margin:14px;border-radius:10px;overflow:hidden;position:relative;border:1px solid rgba(150,0,255,.2);border-top:4px solid var(--yellow);box-shadow:0 4px 20px rgba(100,0,200,.2);}
.score-card-bg{position:absolute;inset:0;
  background:
    repeating-linear-gradient(180deg,rgba(0,0,0,0) 0px,rgba(0,0,0,0) 26px,rgba(20,5,35,.5) 26px,rgba(20,5,35,.5) 30px),
    radial-gradient(ellipse at 50% 0%,rgba(245,197,24,.1) 0%,transparent 60%),
    linear-gradient(180deg,#180330 0%,#0e0220 100%);
  background-size:100% 30px,100% 100%,100% 100%;}
.score-inner{display:flex;align-items:center;padding:22px 16px 18px;gap:8px;position:relative;z-index:1;}
.sc-team{flex:1;text-align:center;}
.sc-badge{width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;font-family:var(--cond);background:rgba(60,10,100,.7);border:2px solid rgba(150,0,255,.25);margin:0 auto 10px;color:var(--white);}
.sc-name{font-family:var(--cond);font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:rgba(220,200,255,.85);}
.sc-mid{text-align:center;}
.sc-score{font-family:var(--display);font-size:64px;font-weight:700;letter-spacing:8px;color:var(--yellow);line-height:1;text-shadow:0 0 20px rgba(245,197,24,.5);}
.sc-time{background:rgba(229,57,53,.9);color:#fff;font-family:var(--cond);font-size:13px;font-weight:800;padding:4px 14px;border-radius:3px;margin-top:6px;display:inline-block;border:1px solid rgba(229,57,53,.5);}
.sc-time.upcoming{background:rgba(0,80,150,.5);border-color:rgba(0,212,255,.3);color:rgba(0,212,255,.9);}
.sc-time.finished{background:rgba(40,20,60,.6);border-color:rgba(100,80,150,.3);color:var(--muted);}

/* ── REACTIONS ── */
.react-wrap{padding:0 14px 14px;overflow-x:auto;scrollbar-width:none;}
.react-wrap::-webkit-scrollbar{display:none;}
.react-inner{display:flex;gap:8px;width:max-content;}
.react-btn{display:flex;align-items:center;gap:6px;background:rgba(40,10,70,.7);border:1px solid rgba(100,0,200,.3);border-radius:20px;padding:7px 14px;cursor:pointer;color:var(--white);font-family:var(--cond);font-size:13px;font-weight:700;white-space:nowrap;transition:all .15s;}
.react-btn:hover,.react-btn.on{background:rgba(80,0,150,.7);border-color:var(--yellow);color:var(--yellow);transform:translateY(-2px);}

/* ── POLL ── */
.poll{margin:0 14px 14px;border-radius:8px;overflow:hidden;border:1px solid rgba(100,0,200,.25);border-left:4px solid var(--yellow);position:relative;}
.poll-bg{position:absolute;inset:0;background:repeating-linear-gradient(180deg,rgba(0,0,0,0) 0px,rgba(0,0,0,0) 26px,rgba(20,5,35,.4) 26px,rgba(20,5,35,.4) 30px),linear-gradient(135deg,#150228 0%,#0d0118 100%);background-size:100% 30px,100% 100%;}
.poll-inner-wrap{position:relative;z-index:1;padding:14px 16px;}
.poll-head{font-family:var(--cond);font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:var(--yellow);margin-bottom:6px;}
.poll-q{font-size:16px;font-weight:700;color:var(--white);margin-bottom:12px;}
.poll-opts{display:flex;gap:8px;}
.poll-opt{flex:1;background:rgba(40,10,70,.7);border:1px solid rgba(100,0,200,.3);border-radius:6px;padding:12px 6px;text-align:center;cursor:pointer;font-family:var(--cond);font-size:13px;font-weight:800;color:var(--white);position:relative;overflow:hidden;text-transform:uppercase;letter-spacing:.5px;transition:all .2s;}
.poll-opt:hover{border-color:var(--yellow);}
.poll-opt-bar{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,rgba(245,197,24,.25),rgba(245,197,24,.08));transition:width .6s ease;border-radius:6px;}
.poll-opt.voted{border-color:var(--turq);color:var(--turq);}
.poll-opt.winner{border-color:var(--yellow);color:var(--yellow);}
.poll-opt-content{position:relative;z-index:1;}
.poll-pct{display:block;font-family:var(--display);font-size:22px;color:var(--yellow);margin-top:4px;}
.poll-hint{text-align:center;font-family:var(--cond);font-size:11px;color:var(--muted);letter-spacing:1px;margin-top:8px;}
.poll-total{text-align:right;font-family:var(--cond);font-size:10px;color:var(--muted);letter-spacing:1px;margin-top:8px;}

/* ── FEED ── */
.feed-wrap{background:rgba(8,2,15,.7);}
.feed-header{display:flex;align-items:center;gap:10px;padding:12px 16px 8px;}
.feed-title{font-family:var(--cond);font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:rgba(245,197,24,.8);}
.feed-hr{flex:1;height:1px;background:rgba(150,0,255,.2);}
.online-pill{display:flex;align-items:center;gap:5px;font-family:var(--cond);font-size:11px;font-weight:700;color:var(--muted);}
.od{width:5px;height:5px;background:var(--green);border-radius:50%;animation:pulse 2s infinite;}
.feed{padding:0 14px;display:flex;flex-direction:column;gap:10px;max-height:340px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(100,0,200,.3) transparent;}
.msg{display:flex;gap:10px;animation:fadeIn .3s ease;}
.msg-av{width:36px;height:36px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-family:var(--cond);font-size:14px;font-weight:800;flex-shrink:0;border:1px solid rgba(100,0,200,.2);color:var(--white);}
.msg-body{flex:1;}
.msg-top{display:flex;align-items:center;gap:6px;margin-bottom:3px;}
.msg-name{font-family:var(--cond);font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:var(--yellow);}
.msg-flag{font-size:13px;}
.msg-time{font-size:10px;color:var(--muted);margin-left:auto;font-family:var(--cond);font-weight:700;}
.msg-text{font-size:14px;color:rgba(230,210,255,.85);line-height:1.45;}

/* ── INPUT ── */
.input-bar{padding:10px 14px 16px;display:flex;gap:9px;border-top:1px solid rgba(150,0,255,.2);background:rgba(8,2,15,.97);position:sticky;bottom:0;backdrop-filter:blur(12px);}
.input-bar input{flex:1;background:rgba(40,10,70,.5);border:1px solid rgba(100,0,200,.3);border-radius:24px;padding:11px 18px;font-size:14px;color:var(--white);font-family:var(--font);outline:none;transition:border-color .15s,box-shadow .15s;}
.input-bar input:focus{border-color:var(--yellow);box-shadow:0 0 12px rgba(245,197,24,.2);}
.input-bar input::placeholder{color:rgba(200,170,255,.3);}
.send{width:44px;height:44px;background:linear-gradient(135deg,#4a0a8a,#2a0550);border:1px solid rgba(245,197,24,.5);border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:17px;color:var(--yellow);flex-shrink:0;transition:all .15s;}
.send:hover{background:linear-gradient(135deg,#5a1aaa,#3a0a70);transform:scale(1.06);}

.toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#2a0550;color:#fff;font-family:var(--cond);font-size:13px;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:10px 20px;border-radius:3px;z-index:9999;white-space:nowrap;animation:toastPop .3s ease;border:1px solid rgba(150,0,255,.5);}
.loading{text-align:center;padding:40px 20px;color:var(--muted);font-family:var(--cond);font-size:12px;letter-spacing:2px;text-transform:uppercase;}
.no-matches{text-align:center;padding:24px 20px;color:var(--muted);font-family:var(--cond);font-size:12px;letter-spacing:1px;}

@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.5)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes toastPop{from{opacity:0;transform:translateX(-50%) scale(.9)}to{opacity:1;transform:translateX(-50%) scale(1)}}
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

  // Fetch ALL leagues from ESPN automatically
  const fetchAllMatches = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(ESPN_LEAGUES.map(l => fetchLeague(l.id)));
      const all = results.flat();

      // Show live first, then upcoming today, then FT - filter out far future
      const live = all.filter(m => m.status === "LIVE");
      const upcoming = all.filter(m => m.status === "UPCOMING");
      const ft = all.filter(m => m.status === "FT");

      const combined = [...live, ...upcoming, ...ft];
      setMatches(combined);

      // Set live minutes
      const mins = {};
      combined.forEach(m => {
        if (m.elapsed !== null && m.status === "LIVE") mins[m.id] = m.elapsed;
      });
      setLiveMinutes(mins);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  // Tick live minutes every 60s
  useEffect(() => {
    const t = setInterval(() => {
      setLiveMinutes(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(id => {
          if ((next[id] ?? 0) < 90) next[id] = (next[id] ?? 0) + 1;
        });
        return next;
      });
    }, 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (screen === "home") {
      fetchAllMatches();
      const t = setInterval(fetchAllMatches, 60000);
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
    const currentMin = active ? (liveMinutes[active.id] ?? active.elapsed ?? 0) : 0;
    await push(ref(db, `comments/${active.id}`), {
      user: userName, flag, col, av: initials,
      text: input.trim(),
      time: currentMin > 0 ? `${currentMin}'` : "PRE",
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

  // Grouped by league
  const filtered = activeLeague === "All" ? matches : matches.filter(m => m.league === activeLeague);
  const grouped = filtered.reduce((acc, m) => {
    if (!acc[m.league]) acc[m.league] = [];
    acc[m.league].push(m);
    return acc;
  }, {});
  const leagueOrder = ["Champions League","Premier League","La Liga","Bundesliga","Serie A","Ligue 1","Süper Lig"];
  const sortedLeagues = Object.keys(grouped).sort((a,b) => {
    const ai = leagueOrder.indexOf(a); const bi = leagueOrder.indexOf(b);
    return (ai===-1?99:ai) - (bi===-1?99:bi);
  });
  const allLeagueNames = ["All", ...Array.from(new Set(matches.map(m => m.league))).sort()];

  const today = new Date().toLocaleDateString("en-US", { weekday:"short", day:"numeric", month:"short" }).toUpperCase();
  const liveCount = matches.filter(m => m.status === "LIVE").length;
  const pollTotal = (pollData[0]||0) + (pollData[1]||0) + (pollData[2]||0);
  const msgs = active ? (comments[active.id] || []) : [];
  const winnerIdx = pollVoted !== null && pollTotal > 0
    ? String(Object.keys(pollData).reduce((a,b) => (pollData[a]||0) >= (pollData[b]||0) ? a : b))
    : null;
  const currentMatch = active ? (matches.find(m => m.id === active.id) || active) : null;
  const activeMin = currentMatch ? (liveMinutes[currentMatch.id] ?? currentMatch.elapsed ?? 0) : 0;

  /* ── SPLASH ── */
  if (screen === "splash") return (
    <>
      <style>{S}</style>
      <div className="app">
        <div className="splash">
          <div className="splash-flares" />
          <div className="splash-content">
            <div className="graffiti-logo"><span className="u">ULTRAS</span><span className="dot">.</span><span className="z">ZONE</span></div>
            <div className="splash-wall-line" />
            <div className="splash-tag">voice of the fans</div>
            <input className="name-input" placeholder="What's your name?" value={tempName} onChange={e => setTempName(e.target.value)} onKeyDown={e => e.key==="Enter" && enterApp()} />
            <button className="splash-enter" onClick={enterApp}>ENTER THE ZONE</button>
            <div className="splash-stats">
              <div className="splash-stat"><div className="splash-stat-val">15+</div><div className="splash-stat-lbl">Leagues</div></div>
              <div className="splash-stat"><div className="splash-stat-val">Live</div><div className="splash-stat-lbl">Scores</div></div>
              <div className="splash-stat"><div className="splash-stat-val">Real</div><div className="splash-stat-lbl">Fans</div></div>
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
      <div className="app stadium-bg">
        <div className="header">
          <div className="header-logo"><span className="u">ULTRAS</span><span className="dot">.</span><span className="z">ZONE</span></div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {liveCount > 0 && <div className="live-pill">{liveCount} Live</div>}
            <div style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--cond)",letterSpacing:1}}>{today}</div>
          </div>
        </div>

        {!loading && matches.length > 0 && (
          <div className="league-tabs">
            {allLeagueNames.map(lg => (
              <div key={lg} className={`league-tab${activeLeague===lg?" active":""}`} onClick={() => setActiveLeague(lg)}>
                {lg === "All" ? `🌍 All (${matches.length})` : `${LEAGUE_FLAGS[lg]||"⚽"} ${lg}`}
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="loading">⚽ Loading matches...</div>
        ) : matches.length === 0 ? (
          <div className="no-matches">No matches right now. Check back soon!</div>
        ) : sortedLeagues.map(league => {
          const lms = grouped[league];
          const hasLive = lms.some(m => m.status === "LIVE");
          return (
            <div className="league-group" key={league}>
              <div className="league-header">
                <span className="league-flag">{LEAGUE_FLAGS[league]||"⚽"}</span>
                <div className="league-title">{league}</div>
                <div className="league-hr" />
                {hasLive && <div className="league-live-dot" />}
              </div>
              <div className="match-list">
                {lms.map(m => {
                  const min = liveMinutes[m.id] ?? m.elapsed ?? 0;
                  const isLive = m.status === "LIVE";
                  const isFT = m.status === "FT";
                  return (
                    <div className={`match-card${isLive?" live":isFT?" finished":""}`} key={m.id} onClick={() => openMatch(m)}>
                      <div className="mc-body">
                        <div className="mc-team"><div className="mc-badge">{m.home.badge}</div><div className="mc-name">{m.home.name}</div></div>
                        <div className="mc-center">
                          {(isLive||isFT) ? <div className="mc-score">{m.score[0]}–{m.score[1]}</div>
                            : <div className="mc-score upcoming">{m.kickoffDisplay}</div>}
                          {isLive && <div className="mc-badge-live">{min>0?`${min}'`:"LIVE"}</div>}
                          {isFT && <div className="mc-badge-ft">FT</div>}
                          {!isLive && !isFT && <div className="mc-badge-upcoming">🕐 {m.kickoffDisplay}</div>}
                        </div>
                        <div className="mc-team right"><div className="mc-badge">{m.away.badge}</div><div className="mc-name">{m.away.name}</div></div>
                      </div>
                      <div className="mc-footer">
                        <div className="mc-viewers"><div className="mc-vdot" />{m.viewers.toLocaleString()} watching</div>
                        <div className="mc-cmts">💬 {(comments[m.id]||[]).length}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );

  /* ── MATCH ── */
  const isLive = currentMatch?.status === "LIVE";
  const isFT = currentMatch?.status === "FT";
  return (
    <>
      <style>{S}</style>
      <div className="app stadium-bg">
        <div className="ms-header">
          <button className="back" onClick={goBack}>←</button>
          <div className="ms-info"><div className="ms-league">{LEAGUE_FLAGS[currentMatch?.league]||"⚽"} {currentMatch?.league}</div><div className="ms-teams">{currentMatch?.home.name} – {currentMatch?.away.name}</div></div>
          {isLive && <div className="ms-live">Live</div>}
          {isFT && <div className="ms-status">FT</div>}
          {!isLive && !isFT && <div className="ms-status">{currentMatch?.kickoffDisplay}</div>}
        </div>

        <div className="score-card">
          <div className="score-card-bg" />
          <div className="score-inner">
            <div className="sc-team"><div className="sc-badge">{currentMatch?.home.badge}</div><div className="sc-name">{currentMatch?.home.name}</div></div>
            <div className="sc-mid">
              {!isLive && !isFT ? (
                <><div className="sc-score" style={{fontSize:28,color:"rgba(245,197,24,.4)"}}>vs</div><div className="sc-time upcoming">{currentMatch?.kickoffDisplay}</div></>
              ) : (
                <><div className="sc-score">{currentMatch?.score[0]}–{currentMatch?.score[1]}</div>
                  <div className={`sc-time${isFT?" finished":""}`}>{isLive?(activeMin>0?`${activeMin}'`:"LIVE"):"Full Time"}</div></>
              )}
            </div>
            <div className="sc-team"><div className="sc-badge">{currentMatch?.away.badge}</div><div className="sc-name">{currentMatch?.away.name}</div></div>
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
              {[currentMatch?.home.short, currentMatch?.away.short, "Draw"].map((opt,i) => {
                const pct = pollTotal>0 ? Math.round(((pollData[i]||0)/pollTotal)*100) : 0;
                const isWinner = winnerIdx!==null && String(i)===winnerIdx;
                return (
                  <div key={i} className={`poll-opt${pollVoted===i?" voted":""}${isWinner?" winner":""}`}
                    onClick={() => votePoll(i)} style={{cursor:pollVoted!==null?"default":"pointer"}}>
                    <div className="poll-opt-bar" style={{width:pollVoted!==null?`${pct}%`:"0%"}} />
                    <div className="poll-opt-content"><span>{opt}</span>{pollVoted!==null&&<span className="poll-pct">{pct}%</span>}</div>
                  </div>
                );
              })}
            </div>
            {pollVoted===null?<div className="poll-hint">Tap to cast your vote</div>:<div className="poll-total">{pollTotal.toLocaleString()} total votes</div>}
          </div>
        </div>

        <div className="feed-wrap">
          <div className="feed-header">
            <div className="feed-title">🏟️ The Stands</div>
            <div className="feed-hr" />
            <div className="online-pill"><div className="od" />{currentMatch?.viewers.toLocaleString()} live</div>
          </div>
          <div className="feed">
            {msgs.length===0&&<div className="loading">Be the first to comment! 🔥</div>}
            {msgs.map((m,i) => (
              <div className="msg" key={i}>
                <div className="msg-av" style={{background:m.col}}>{m.av}</div>
                <div className="msg-body">
                  <div className="msg-top"><span className="msg-name">{m.user}</span><span className="msg-flag">{m.flag}</span><span className="msg-time">{m.time}</span></div>
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
