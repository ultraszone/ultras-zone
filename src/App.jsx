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

// ESPN free public API - no key needed
const ESPN_LEAGUES = [
  { id: "eng.1", name: "Premier League" },
  { id: "fra.1", name: "Ligue 1" },
  { id: "tur.1", name: "Süper Lig" },
];

// Today's 5 matches - hardcoded with correct info
// Scores & minutes will be fetched from ESPN API
const TODAY_MATCHES = [
  {
    id: "sam_bes_20260419",
    league: "Türkiye Süper Lig",
    leagueEspn: "tur.1",
    kickoff: "16:00", // UTC
    kickoffDisplay: "12:00 PM ET",
    home: { name: "Samsunspor", short: "SAM", badge: "SA" },
    away: { name: "Besiktas",   short: "BJK", badge: "BJ" },
    score: [0, 0],
    elapsed: null,
    status: "UPCOMING",
    viewers: 8420,
  },
  {
    id: "mci_ars_20260419",
    league: "Premier League",
    leagueEspn: "eng.1",
    kickoff: "15:30", // UTC
    kickoffDisplay: "11:30 AM ET",
    home: { name: "Man City", short: "MCI", badge: "MC" },
    away: { name: "Arsenal",  short: "ARS", badge: "AR" },
    score: [0, 0],
    elapsed: null,
    status: "UPCOMING",
    viewers: 19800,
  },
  {
    id: "trab_bas_20260419",
    league: "Türkiye Süper Lig",
    leagueEspn: "tur.1",
    kickoff: "17:00", // UTC
    kickoffDisplay: "1:00 PM ET",
    home: { name: "Trabzonspor", short: "TRA", badge: "TR" },
    away: { name: "Başakşehir", short: "IBF", badge: "IB" },
    score: [0, 0],
    elapsed: null,
    status: "UPCOMING",
    viewers: 6100,
  },
  {
    id: "psg_lyo_20260419",
    league: "Ligue 1",
    leagueEspn: "fra.1",
    kickoff: "18:45", // UTC
    kickoffDisplay: "2:45 PM ET",
    home: { name: "PSG",  short: "PSG", badge: "PS" },
    away: { name: "Lyon", short: "LYO", badge: "LY" },
    score: [0, 0],
    elapsed: null,
    status: "UPCOMING",
    viewers: 12300,
  },
];

const S = `
@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap');
:root{
  --bg:#1a0808;--border:#3d1a1a;
  --yellow:#f5c518;--turq:#00d4ff;--white:#fff;
  --muted:#a07070;--green:#00e676;--red:#e53935;
  --font:'Barlow',sans-serif;--cond:'Barlow Condensed',sans-serif;
  --display:'Oswald',sans-serif;--graffiti:'Permanent Marker',cursive;
}
*{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--bg);color:var(--white);font-family:var(--font);}
.app{max-width:430px;margin:0 auto;min-height:100vh;background:var(--bg);}

/* ULTRAS CROWD PHOTO BG */
.brick-bg{
  background-image:
    linear-gradient(rgba(8,0,0,0.72),rgba(8,0,0,0.72)),
    url('/bg.jpg');
  background-size:cover;
  background-position:center top;
  background-attachment:fixed;
}

/* SPLASH */
.splash{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;
  background-image:
    linear-gradient(rgba(8,0,0,0.68),rgba(8,0,0,0.68)),
    url('/bg.jpg');
  background-size:cover;
  background-position:center top;
}
.splash-flares{position:absolute;top:0;left:0;right:0;height:160px;pointer-events:none;
  background:radial-gradient(ellipse 100px 100px at 15% 0%,rgba(245,197,24,.3) 0%,transparent 70%),
  radial-gradient(ellipse 100px 100px at 85% 0%,rgba(245,197,24,.3) 0%,transparent 70%);}
.splash-content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;padding:0 20px;}
.graffiti-logo{font-family:var(--graffiti);font-size:58px;line-height:1;letter-spacing:2px;margin-bottom:4px;}
.graffiti-logo .u{color:var(--yellow);text-shadow:3px 3px 0 rgba(0,0,0,.9),0 0 20px rgba(245,197,24,.5);}
.graffiti-logo .dot{color:var(--white);font-size:40px;}
.graffiti-logo .z{color:var(--turq);text-shadow:3px 3px 0 rgba(0,0,0,.9),0 0 20px rgba(0,212,255,.5);}
.splash-wall-line{width:100%;height:3px;background:linear-gradient(90deg,transparent,#8b2020,var(--yellow),var(--turq),var(--yellow),#8b2020,transparent);margin:10px 0 6px;}
.splash-tag{font-family:var(--graffiti);font-size:13px;color:rgba(255,200,150,.5);letter-spacing:2px;margin-bottom:32px;}
.name-input{background:rgba(80,20,10,.5);border:2px solid rgba(245,197,24,.4);border-radius:4px;padding:12px 20px;font-size:16px;color:var(--white);font-family:var(--cond);font-weight:700;letter-spacing:1px;outline:none;width:260px;text-align:center;margin-bottom:14px;transition:border-color .2s,box-shadow .2s;}
.name-input::placeholder{color:rgba(255,200,150,.4);}
.name-input:focus{border-color:var(--yellow);box-shadow:0 0 16px rgba(245,197,24,.3);}
.splash-enter{background:linear-gradient(135deg,#8b1a1a 0%,#6b1010 100%);color:var(--yellow);border:2px solid var(--yellow);padding:14px 48px;font-family:var(--graffiti);font-size:22px;letter-spacing:2px;cursor:pointer;border-radius:4px;transition:all .2s;margin-bottom:36px;text-shadow:0 0 10px rgba(245,197,24,.5);box-shadow:0 0 20px rgba(139,26,26,.5);}
.splash-enter:hover{background:linear-gradient(135deg,#a02020,#801515);transform:scale(1.03);}
.splash-stats{display:flex;gap:32px;}
.splash-stat{text-align:center;}
.splash-stat-val{font-family:var(--display);font-size:26px;font-weight:700;color:var(--yellow);}
.splash-stat-lbl{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-top:2px;}

/* HEADER */
.header{padding:12px 18px;display:flex;align-items:center;justify-content:space-between;
  border-bottom:2px solid rgba(0,0,0,.8);
  background:repeating-linear-gradient(180deg,transparent 0px,transparent 18px,rgba(0,0,0,.6) 18px,rgba(0,0,0,.6) 22px),linear-gradient(180deg,#2a0808 0%,#1e0606 100%);
  background-size:100% 22px,100% 100%;position:sticky;top:0;z-index:100;}
.header-logo{font-family:var(--graffiti);font-size:28px;letter-spacing:1px;line-height:1;}
.header-logo .u{color:var(--yellow);text-shadow:2px 2px 0 rgba(0,0,0,.9);}
.header-logo .dot{color:var(--white);font-size:20px;}
.header-logo .z{color:var(--turq);text-shadow:2px 2px 0 rgba(0,0,0,.9);}
.live-count{display:flex;align-items:center;gap:5px;background:rgba(139,26,26,.6);border:1px solid rgba(229,57,53,.5);border-radius:3px;padding:4px 10px;font-family:var(--cond);font-size:11px;font-weight:800;letter-spacing:2px;color:#ff8a8a;text-transform:uppercase;}
.live-count::before{content:'';width:6px;height:6px;background:var(--red);border-radius:50%;animation:pulse 1s infinite;}

/* LEAGUE GROUP */
.league-group{margin-bottom:6px;}
.league-header{display:flex;align-items:center;gap:10px;padding:14px 16px 8px;}
.league-flag{font-size:16px;}
.league-title{font-family:var(--cond);font-size:13px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--yellow);}
.league-hr{flex:1;height:1px;background:rgba(245,197,24,.2);}
.league-live-dot{width:7px;height:7px;background:var(--red);border-radius:50%;animation:pulse .8s infinite;}

/* MATCH CARDS */
.match-list{padding:0 14px;display:flex;flex-direction:column;gap:8px;padding-bottom:8px;}
.match-card{
  background:
    repeating-linear-gradient(180deg,transparent 0px,transparent 18px,rgba(0,0,0,.4) 18px,rgba(0,0,0,.4) 22px),
    repeating-linear-gradient(90deg,transparent 0px,transparent 38px,rgba(0,0,0,.4) 38px,rgba(0,0,0,.4) 42px),
    linear-gradient(135deg,#2d0e0e 0%,#200808 100%);
  background-size:100% 22px,42px 44px,100% 100%;
  border:1px solid rgba(0,0,0,.7);border-radius:8px;overflow:hidden;
  cursor:pointer;position:relative;transition:all .18s;border-left:4px solid #8b2020;
}
.match-card.live{border-left-color:var(--red);}
.match-card.finished{border-left-color:#444;opacity:.85;}
.match-card:hover{border-left-color:var(--yellow);transform:translateX(3px);}
.match-card:active{transform:scale(.98);}

.mc-body{display:flex;align-items:center;padding:12px 14px;gap:8px;}
.mc-team{flex:1;display:flex;align-items:center;gap:8px;}
.mc-team.right{flex-direction:row-reverse;}
.mc-badge{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;font-family:var(--cond);background:rgba(80,20,10,.7);border:1px solid rgba(200,80,40,.3);flex-shrink:0;color:var(--white);}
.mc-name{font-family:var(--cond);font-size:14px;font-weight:800;text-transform:uppercase;color:var(--white);letter-spacing:.5px;}
.mc-team.right .mc-name{text-align:right;}
.mc-center{text-align:center;min-width:90px;}
.mc-score{font-family:var(--display);font-size:32px;font-weight:700;letter-spacing:6px;color:var(--yellow);line-height:1;text-shadow:0 0 12px rgba(245,197,24,.4);}
.mc-score.upcoming{font-size:18px;color:rgba(245,197,24,.5);letter-spacing:2px;}

.mc-badge-live{display:inline-flex;align-items:center;gap:4px;background:rgba(139,26,26,.9);color:#fff;font-family:var(--cond);font-size:11px;font-weight:800;padding:3px 10px;border-radius:3px;margin-top:4px;border:1px solid rgba(229,57,53,.5);}
.mc-badge-live::before{content:'';width:5px;height:5px;background:#ff6b6b;border-radius:50%;animation:pulse .8s infinite;}
.mc-badge-upcoming{display:inline-block;font-family:var(--cond);font-size:11px;font-weight:800;color:rgba(0,212,255,.8);margin-top:4px;letter-spacing:1px;}
.mc-badge-ft{display:inline-block;font-family:var(--cond);font-size:11px;font-weight:800;color:var(--muted);margin-top:4px;letter-spacing:1px;}

.mc-footer{border-top:1px solid rgba(0,0,0,.5);padding:6px 14px;display:flex;align-items:center;}
.mc-viewers{font-size:11px;font-weight:600;color:var(--muted);display:flex;align-items:center;gap:5px;}
.mc-vdot{width:5px;height:5px;background:var(--green);border-radius:50%;animation:pulse 2s infinite;}
.mc-cmts{margin-left:auto;font-size:11px;color:rgba(245,197,24,.6);}

/* MATCH SCREEN */
.ms-header{padding:12px 16px;display:flex;align-items:center;gap:12px;
  border-bottom:2px solid rgba(0,0,0,.8);
  background:repeating-linear-gradient(180deg,transparent 0px,transparent 18px,rgba(0,0,0,.6) 18px,rgba(0,0,0,.6) 22px),linear-gradient(180deg,#2a0808,#1a0606);
  background-size:100% 22px,100% 100%;position:sticky;top:0;z-index:100;}
.back{width:36px;height:36px;background:rgba(80,20,10,.7);border:1px solid rgba(200,80,40,.3);border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--yellow);transition:all .15s;}
.back:hover{background:rgba(100,25,15,.9);}
.ms-info{flex:1;}
.ms-league{font-family:var(--cond);font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:rgba(245,197,24,.7);margin-bottom:2px;}
.ms-teams{font-family:var(--cond);font-size:17px;font-weight:800;text-transform:uppercase;color:var(--white);}
.ms-live{display:flex;align-items:center;gap:5px;background:rgba(139,26,26,.6);border:1px solid rgba(229,57,53,.5);border-radius:3px;padding:4px 10px;font-family:var(--cond);font-size:11px;font-weight:800;letter-spacing:2px;color:#ff8a8a;text-transform:uppercase;}
.ms-live::before{content:'';width:6px;height:6px;background:var(--red);border-radius:50%;animation:pulse 1s infinite;}
.ms-upcoming{font-family:var(--cond);font-size:12px;font-weight:800;color:rgba(0,212,255,.8);padding:4px 10px;border:1px solid rgba(0,212,255,.3);border-radius:3px;}

/* SCORE CARD */
.score-card{margin:14px;border-radius:10px;overflow:hidden;position:relative;border:1px solid rgba(0,0,0,.8);border-top:4px solid var(--yellow);box-shadow:0 4px 20px rgba(0,0,0,.5);}
.score-card-bg{position:absolute;inset:0;
  background:
    repeating-linear-gradient(180deg,transparent 0px,transparent 18px,rgba(0,0,0,.45) 18px,rgba(0,0,0,.45) 22px),
    repeating-linear-gradient(90deg,transparent 0px,transparent 38px,rgba(0,0,0,.45) 38px,rgba(0,0,0,.45) 42px),
    radial-gradient(ellipse at 50% 0%,rgba(245,197,24,.12) 0%,transparent 60%),
    linear-gradient(180deg,#3a1010 0%,#250a0a 100%);
  background-size:100% 22px,42px 44px,100% 100%,100% 100%;}
.score-inner{display:flex;align-items:center;padding:22px 16px 18px;gap:8px;position:relative;z-index:1;}
.sc-team{flex:1;text-align:center;}
.sc-badge{width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;font-family:var(--cond);background:rgba(80,20,10,.7);border:2px solid rgba(200,80,40,.3);margin:0 auto 10px;color:var(--white);}
.sc-name{font-family:var(--cond);font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:rgba(255,220,180,.85);}
.sc-mid{text-align:center;}
.sc-score{font-family:var(--display);font-size:64px;font-weight:700;letter-spacing:8px;color:var(--yellow);line-height:1;text-shadow:0 0 20px rgba(245,197,24,.5);}
.sc-time{background:rgba(139,26,26,.9);color:#fff;font-family:var(--cond);font-size:13px;font-weight:800;padding:4px 14px;border-radius:3px;margin-top:6px;display:inline-block;border:1px solid rgba(229,57,53,.5);}
.sc-time.upcoming{background:rgba(0,80,120,.4);border-color:rgba(0,212,255,.3);color:rgba(0,212,255,.9);}
.sc-time.finished{background:rgba(40,40,40,.6);border-color:rgba(100,100,100,.3);color:var(--muted);}

/* REACTIONS */
.react-wrap{padding:0 14px 14px;overflow-x:auto;scrollbar-width:none;}
.react-wrap::-webkit-scrollbar{display:none;}
.react-inner{display:flex;gap:8px;width:max-content;}
.react-btn{display:flex;align-items:center;gap:6px;background:rgba(60,15,10,.7);border:1px solid rgba(150,50,30,.4);border-radius:20px;padding:7px 14px;cursor:pointer;color:var(--white);font-family:var(--cond);font-size:13px;font-weight:700;white-space:nowrap;transition:all .15s;}
.react-btn:hover,.react-btn.on{background:rgba(100,20,10,.8);border-color:var(--yellow);color:var(--yellow);transform:translateY(-2px);}

/* POLL */
.poll{margin:0 14px 14px;border-radius:8px;overflow:hidden;border:1px solid rgba(0,0,0,.7);border-left:4px solid var(--yellow);position:relative;}
.poll-bg{position:absolute;inset:0;background:repeating-linear-gradient(180deg,transparent 0px,transparent 18px,rgba(0,0,0,.4) 18px,rgba(0,0,0,.4) 22px),linear-gradient(135deg,#2a0f0a 0%,#1e0808 100%);background-size:100% 22px,100% 100%;}
.poll-inner-wrap{position:relative;z-index:1;padding:14px 16px;}
.poll-head{font-family:var(--cond);font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:var(--yellow);margin-bottom:6px;}
.poll-q{font-size:16px;font-weight:700;color:var(--white);margin-bottom:12px;}
.poll-opts{display:flex;gap:8px;}
.poll-opt{flex:1;background:rgba(60,15,10,.7);border:1px solid rgba(150,50,30,.4);border-radius:6px;padding:12px 6px;text-align:center;cursor:pointer;font-family:var(--cond);font-size:13px;font-weight:800;color:var(--white);position:relative;overflow:hidden;text-transform:uppercase;letter-spacing:.5px;transition:all .2s;}
.poll-opt:hover{border-color:var(--yellow);}
.poll-opt-bar{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,rgba(245,197,24,.25),rgba(245,197,24,.08));transition:width .6s ease;border-radius:6px;}
.poll-opt.voted{border-color:var(--turq);color:var(--turq);}
.poll-opt.winner{border-color:var(--yellow);color:var(--yellow);}
.poll-opt-content{position:relative;z-index:1;}
.poll-pct{display:block;font-family:var(--display);font-size:22px;color:var(--yellow);margin-top:4px;}
.poll-hint{text-align:center;font-family:var(--cond);font-size:11px;color:var(--muted);letter-spacing:1px;margin-top:8px;}
.poll-total{text-align:right;font-family:var(--cond);font-size:10px;color:var(--muted);letter-spacing:1px;margin-top:8px;}

/* FEED */
.feed-wrap{background:repeating-linear-gradient(180deg,transparent 0px,transparent 18px,rgba(0,0,0,.3) 18px,rgba(0,0,0,.3) 22px),linear-gradient(180deg,#1e0808 0%,#180606 100%);background-size:100% 22px,100% 100%;}
.feed-header{display:flex;align-items:center;gap:10px;padding:12px 16px 8px;}
.feed-title{font-family:var(--cond);font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:rgba(245,197,24,.8);}
.feed-hr{flex:1;height:1px;background:rgba(0,0,0,.6);}
.online-pill{display:flex;align-items:center;gap:5px;font-family:var(--cond);font-size:11px;font-weight:700;color:var(--muted);}
.od{width:5px;height:5px;background:var(--green);border-radius:50%;animation:pulse 2s infinite;}
.feed{padding:0 14px;display:flex;flex-direction:column;gap:10px;max-height:340px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.5) transparent;}
.msg{display:flex;gap:10px;animation:fadeIn .3s ease;}
.msg-av{width:36px;height:36px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-family:var(--cond);font-size:14px;font-weight:800;flex-shrink:0;border:1px solid rgba(150,50,30,.3);color:var(--white);}
.msg-body{flex:1;}
.msg-top{display:flex;align-items:center;gap:6px;margin-bottom:3px;}
.msg-name{font-family:var(--cond);font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:var(--yellow);}
.msg-flag{font-size:13px;}
.msg-time{font-size:10px;color:var(--muted);margin-left:auto;font-family:var(--cond);font-weight:700;}
.msg-text{font-size:14px;color:rgba(255,220,190,.85);line-height:1.45;}

/* INPUT */
.input-bar{padding:10px 14px 16px;display:flex;gap:9px;border-top:2px solid rgba(0,0,0,.7);background:repeating-linear-gradient(180deg,transparent 0px,transparent 18px,rgba(0,0,0,.5) 18px,rgba(0,0,0,.5) 22px),linear-gradient(180deg,#2a0808,#1a0606);background-size:100% 22px,100% 100%;position:sticky;bottom:0;}
.input-bar input{flex:1;background:rgba(60,15,10,.6);border:1px solid rgba(150,50,30,.4);border-radius:24px;padding:11px 18px;font-size:14px;color:var(--white);font-family:var(--font);outline:none;transition:border-color .15s,box-shadow .15s;}
.input-bar input:focus{border-color:var(--yellow);box-shadow:0 0 12px rgba(245,197,24,.2);}
.input-bar input::placeholder{color:rgba(255,180,120,.3);}
.send{width:44px;height:44px;background:linear-gradient(135deg,#8b1a1a,#6b1010);border:1px solid rgba(245,197,24,.5);border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:17px;color:var(--yellow);flex-shrink:0;transition:all .15s;}
.send:hover{background:linear-gradient(135deg,#a02020,#801515);transform:scale(1.06);}

.toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#6b1010;color:#fff;font-family:var(--cond);font-size:13px;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:10px 20px;border-radius:3px;z-index:9999;white-space:nowrap;animation:toastPop .3s ease;border:1px solid var(--red);}
.loading{text-align:center;padding:40px 20px;color:var(--muted);font-family:var(--cond);font-size:12px;letter-spacing:2px;text-transform:uppercase;}

@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.5)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes toastPop{from{opacity:0;transform:translateX(-50%) scale(.9)}to{opacity:1;transform:translateX(-50%) scale(1)}}
`;

// Fetch live scores from ESPN public API
async function fetchLeagueScores(leagueId) {
  try {
    const res = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return data?.events || [];
  } catch { return []; }
}

function normalize(str) {
  return (str || "").toLowerCase()
    .replace(/ş/g,"s").replace(/ı/g,"i").replace(/ğ/g,"g")
    .replace(/ü/g,"u").replace(/ö/g,"o").replace(/ç/g,"c")
    .replace(/[^a-z0-9]/g," ").replace(/\s+/g," ").trim();
}

function teamMatch(espnName, ourName) {
  const a = normalize(espnName);
  const b = normalize(ourName);
  const keywords = b.split(" ");
  return keywords.some(k => k.length > 2 && a.includes(k));
}

function parseESPNEvent(evt) {
  const comp = evt?.competitions?.[0];
  if (!comp) return null;
  const home = comp.competitors?.find(c => c.homeAway === "home");
  const away = comp.competitors?.find(c => c.homeAway === "away");
  const status = evt?.status;
  const clock = status?.displayClock || "";
  const stateType = status?.type?.state; // "pre", "in", "post"
  const shortDetail = status?.type?.shortDetail || "";

  let elapsed = null;
  if (stateType === "in") {
    const m = parseInt(clock);
    if (!isNaN(m)) elapsed = m;
  }

  return {
    homeName: home?.team?.displayName || home?.team?.name || "",
    awayName: away?.team?.displayName || away?.team?.name || "",
    homeScore: parseInt(home?.score) || 0,
    awayScore: parseInt(away?.score) || 0,
    elapsed,
    state: stateType, // pre / in / post
    detail: shortDetail,
  };
}

export default function UltrasZone() {
  const savedName = typeof window !== "undefined" ? localStorage.getItem("uz_name") : null;
  const [screen, setScreen] = useState(savedName ? "home" : "splash");
  const [active, setActive] = useState(null);
  const [matches, setMatches] = useState(TODAY_MATCHES);
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
  const unsubRef = useRef(null);
  const unsubPollRef = useRef(null);

  // Fetch live scores from ESPN for all leagues
  const fetchAllScores = async () => {
    setLoading(true);
    const leagueIds = [...new Set(TODAY_MATCHES.map(m => m.leagueEspn))];
    const allEvents = [];
    for (const lid of leagueIds) {
      const evts = await fetchLeagueScores(lid);
      allEvents.push(...evts);
    }

    setMatches(prev => prev.map(match => {
      // Find matching ESPN event
      const espnEvent = allEvents.find(evt => {
        const parsed = parseESPNEvent(evt);
        if (!parsed) return false;
        return (
          teamMatch(parsed.homeName, match.home.name) &&
          teamMatch(parsed.awayName, match.away.name)
        ) || (
          teamMatch(parsed.homeName, match.away.name) &&
          teamMatch(parsed.awayName, match.home.name)
        );
      });

      if (!espnEvent) return match;
      const parsed = parseESPNEvent(espnEvent);
      if (!parsed) return match;

      // Check if home/away are swapped
      const swapped = teamMatch(parsed.homeName, match.away.name);
      const homeScore = swapped ? parsed.awayScore : parsed.homeScore;
      const awayScore = swapped ? parsed.homeScore : parsed.awayScore;

      let status = "UPCOMING";
      if (parsed.state === "in") status = "LIVE";
      else if (parsed.state === "post") status = "FT";

      return {
        ...match,
        score: [homeScore, awayScore],
        elapsed: parsed.elapsed,
        status,
      };
    }));

    // Sync live minutes
    setLiveMinutes(prev => {
      const next = { ...prev };
      matches.forEach(m => {
        if (m.elapsed !== null && m.elapsed > 0) {
          next[m.id] = m.elapsed;
        }
      });
      return next;
    });

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
      fetchAllScores();
      const t = setInterval(fetchAllScores, 60000);
      return () => clearInterval(t);
    }
  }, [screen]);

  // Sync liveMinutes after matches update
  useEffect(() => {
    setLiveMinutes(prev => {
      const next = { ...prev };
      matches.forEach(m => {
        if (m.elapsed !== null && m.status === "LIVE") {
          next[m.id] = m.elapsed;
        }
      });
      return next;
    });
  }, [matches]);

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
      time: currentMin > 0 ? `${currentMin}'` : active?.kickoffDisplay || "PRE",
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

  // Group matches by league
  const grouped = matches.reduce((acc, m) => {
    if (!acc[m.league]) acc[m.league] = [];
    acc[m.league].push(m);
    return acc;
  }, {});

  const leagueOrder = ["Premier League", "Türkiye Süper Lig", "Ligue 1"];
  const sortedLeagues = Object.keys(grouped).sort((a, b) => {
    const ai = leagueOrder.indexOf(a);
    const bi = leagueOrder.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const leagueFlags = {
    "Premier League": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Türkiye Süper Lig": "🇹🇷",
    "Ligue 1": "🇫🇷",
  };

  const today = new Date().toLocaleDateString("en-US", { weekday:"short", day:"numeric", month:"short" }).toUpperCase();
  const liveCount = matches.filter(m => m.status === "LIVE").length;
  const pollTotal = (pollData[0]||0) + (pollData[1]||0) + (pollData[2]||0);
  const msgs = active ? (comments[active.id] || []) : [];
  const winnerIdx = pollVoted !== null && pollTotal > 0
    ? String(Object.keys(pollData).reduce((a,b) => (pollData[a]||0) >= (pollData[b]||0) ? a : b))
    : null;

  const getActiveMatch = () => {
    if (!active) return active;
    return matches.find(m => m.id === active.id) || active;
  };
  const currentMatch = getActiveMatch();
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
              <div className="splash-stat"><div className="splash-stat-val">5</div><div className="splash-stat-lbl">Today's Matches</div></div>
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
      <div className="app brick-bg">
        <div className="header">
          <div className="header-logo"><span className="u">ULTRAS</span><span className="dot">.</span><span className="z">ZONE</span></div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {liveCount > 0 && <div className="live-count">{liveCount} Live</div>}
            <div style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--cond)",letterSpacing:1}}>{today}</div>
          </div>
        </div>

        {sortedLeagues.map(league => {
          const leagueMatches = grouped[league];
          const hasLive = leagueMatches.some(m => m.status === "LIVE");
          return (
            <div className="league-group" key={league}>
              <div className="league-header">
                <span className="league-flag">{leagueFlags[league] || "⚽"}</span>
                <div className="league-title">{league}</div>
                <div className="league-hr" />
                {hasLive && <div className="league-live-dot" />}
              </div>
              <div className="match-list">
                {leagueMatches.map(m => {
                  const min = liveMinutes[m.id] ?? m.elapsed ?? 0;
                  const isLive = m.status === "LIVE";
                  const isFT = m.status === "FT";
                  return (
                    <div
                      className={`match-card${isLive ? " live" : isFT ? " finished" : ""}`}
                      key={m.id}
                      onClick={() => openMatch(m)}
                    >
                      <div className="mc-body">
                        <div className="mc-team">
                          <div className="mc-badge">{m.home.badge}</div>
                          <div className="mc-name">{m.home.name}</div>
                        </div>
                        <div className="mc-center">
                          {isLive || isFT ? (
                            <div className="mc-score">{m.score[0]}–{m.score[1]}</div>
                          ) : (
                            <div className="mc-score upcoming">{m.kickoffDisplay}</div>
                          )}
                          {isLive && <div className="mc-badge-live">{min > 0 ? `${min}'` : "LIVE"}</div>}
                          {isFT && <div className="mc-badge-ft">FT</div>}
                          {!isLive && !isFT && <div className="mc-badge-upcoming">🕐 {m.kickoffDisplay}</div>}
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
  const isUpcoming = currentMatch?.status === "UPCOMING";

  return (
    <>
      <style>{S}</style>
      <div className="app brick-bg">
        <div className="ms-header">
          <button className="back" onClick={goBack}>←</button>
          <div className="ms-info">
            <div className="ms-league">{currentMatch?.league}</div>
            <div className="ms-teams">{currentMatch?.home.name} – {currentMatch?.away.name}</div>
          </div>
          {isLive && <div className="ms-live">Live</div>}
          {isUpcoming && <div className="ms-upcoming">{currentMatch?.kickoffDisplay}</div>}
          {isFT && <div className="ms-upcoming" style={{borderColor:"rgba(150,150,150,.3)",color:"var(--muted)"}}>FT</div>}
        </div>

        <div className="score-card">
          <div className="score-card-bg" />
          <div className="score-inner">
            <div className="sc-team">
              <div className="sc-badge">{currentMatch?.home.badge}</div>
              <div className="sc-name">{currentMatch?.home.name}</div>
            </div>
            <div className="sc-mid">
              {isUpcoming ? (
                <>
                  <div className="sc-score" style={{fontSize:32,color:"rgba(245,197,24,.4)"}}>vs</div>
                  <div className={`sc-time upcoming`}>{currentMatch?.kickoffDisplay}</div>
                </>
              ) : (
                <>
                  <div className="sc-score">{currentMatch?.score[0]}–{currentMatch?.score[1]}</div>
                  <div className={`sc-time${isFT?" finished":""}`}>
                    {isLive ? (activeMin > 0 ? `${activeMin}'` : "LIVE") : "Full Time"}
                  </div>
                </>
              )}
            </div>
            <div className="sc-team">
              <div className="sc-badge">{currentMatch?.away.badge}</div>
              <div className="sc-name">{currentMatch?.away.name}</div>
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
              {[currentMatch?.home.short, currentMatch?.away.short, "Draw"].map((opt,i) => {
                const pct = pollTotal > 0 ? Math.round(((pollData[i]||0)/pollTotal)*100) : 0;
                const isWinner = winnerIdx !== null && String(i) === winnerIdx;
                return (
                  <div key={i} className={`poll-opt${pollVoted===i?" voted":""}${isWinner?" winner":""}`}
                    onClick={() => votePoll(i)} style={{cursor:pollVoted!==null?"default":"pointer"}}>
                    <div className="poll-opt-bar" style={{width:pollVoted!==null?`${pct}%`:"0%"}} />
                    <div className="poll-opt-content">
                      <span>{opt}</span>
                      {pollVoted!==null && <span className="poll-pct">{pct}%</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            {pollVoted===null ? <div className="poll-hint">Tap to cast your vote</div> : <div className="poll-total">{pollTotal.toLocaleString()} total votes</div>}
          </div>
        </div>

        <div className="feed-wrap">
          <div className="feed-header">
            <div className="feed-title">🏟️ The Stands</div>
            <div className="feed-hr" />
            <div className="online-pill"><div className="od" />{currentMatch?.viewers.toLocaleString()} live</div>
          </div>
          <div className="feed">
            {msgs.length===0 && <div className="loading">Be the first to comment! 🔥</div>}
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
