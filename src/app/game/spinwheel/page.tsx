"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  GAME_WS,
  gameGetBalance,
  gameGetSpinWheelHistory,
  gamePlaceBulkBets,
  getToken,
} from "@/lib/game-api";

// ── Constants ─────────────────────────────────────────────────────────────────
const BETTING_END_AT = 15;
const SPIN_START_AT = 10;
const SPIN_STOP_AT = 5;
const RESULT_START_AT = 3;
const BASE_MULTIPLIER = 10;
const SEGMENTS = 10;
const SWEEP = 360 / SEGMENTS;

// Wheel segments matching Fun Target (0-9)
const WHEEL_SEGMENTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

type GamePhase = "betting" | "betLock" | "spinning" | "stopHighlight" | "resultOverlay" | "playAndWin";
interface LastResult { number: number; multiplier: number; }

// ── Image-based Roulette Wheel ────────────────────────────────────────────────
function RouletteWheel({ rotation, isSpinning, spinDuration }: {
  rotation: number;
  isSpinning: boolean;
  spinDuration: number;
}) {
  return (
    <div className="relative flex items-center justify-center w-full h-full aspect-square mx-auto">
      {/* The Wheel Image rotating */}
      <div 
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? `transform ${spinDuration}s cubic-bezier(0.25,1,0.5,1)` : "none",
        }}
      >
        <Image 
          src="/game/wheel.png" 
          alt="Fortune Wheel" 
          fill 
          sizes="(max-width: 420px) 100vw, 420px"
          className="object-contain pointer-events-none select-none" 
          priority
        />
      </div>
    </div>
  );
}

// ── LED Display Panel ─────────────────────────────────────────────────────────
function LedPanel({ label, value, sub, wide }: { label: string; value: string; sub?: string; wide?: boolean }) {
  return (
    <div className={`flex flex-col items-center ${wide ? "w-[12cqw]" : "w-[9cqw]"}`}>
      <div className="w-full px-[0.5cqw] py-[0.5cqw] rounded-full border border-[#FFD700] bg-black/70 shadow-[0_0_8px_rgba(255,215,0,0.5)] mb-[0.5cqw] flex justify-center">
        <span className="text-white font-bold text-[1.4cqw] tracking-wide text-shadow-sm">{label}</span>
      </div>
      <div className="w-full px-[0.5cqw] py-[0.5cqw] rounded flex justify-center items-center"
        style={{
          background: "linear-gradient(180deg, rgba(20,0,0,0.8) 0%, rgba(40,0,0,0.9) 100%)",
          border: "1.5px solid #DAA520",
          boxShadow: "0 0 10px rgba(255,215,0,0.4), inset 0 2px 6px rgba(0,0,0,0.9)"
        }}>
        <span className="text-[#00FF88] font-black text-[1.8cqw] tracking-widest block whitespace-nowrap"
          style={{ fontFamily: "monospace", textShadow: "0 0 8px rgba(0,255,136,0.6)" }}>
          {value}
        </span>
      </div>
      {sub && (
        <div className="mt-[0.5cqw] px-[0.5cqw] py-[0.2cqw] rounded text-center border border-[#DAA520] bg-black/80 w-full">
          <span className="text-[#00FF88] font-black text-[1cqw]"
            style={{ fontFamily: "monospace", textShadow: "0 0 4px rgba(0,255,136,0.5)" }}>
            {sub}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Chip Button ───────────────────────────────────────────────────────────────
function ChipBtn({ value, selected, onClick, colorTheme }: {
  value: number; selected: boolean; onClick: () => void; colorTheme: string;
}) {
  return (
    <button onClick={onClick}
      className={`relative rounded-full flex items-center justify-center shrink-0 w-[5cqw] h-[5cqw] transition-transform active:scale-90
        ${selected ? "scale-110 ring-[0.3cqw] ring-[#FFD700] ring-offset-[0.2cqw] ring-offset-transparent shadow-[0_0_1.5cqw_#FFD700]" : "hover:scale-105"}
      `}
      style={{
        background: colorTheme,
        boxShadow: selected ? "0 0 15px rgba(255,215,0,0.8)" : "0 4px 8px rgba(0,0,0,0.5)",
        border: "0.2cqw solid rgba(255,255,255,0.4)"
      }}>
      <div className="absolute inset-[0.2cqw] rounded-full border-[0.1cqw] border-white/30 border-dashed" />
      <span className="text-white font-black text-[1.4cqw] drop-shadow-md relative z-10">
        {value >= 1000 ? `${value / 1000}k` : value}
      </span>
      <div className="absolute top-[0.4cqw] left-[0.8cqw] w-[1cqw] h-[0.5cqw] bg-white/40 rounded-full" />
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function SpinWheelScreen() {
  const [balance, setBalance] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [gamePhase, setGamePhase] = useState<GamePhase>("betting");
  const [currentRoundId, setCurrentRoundId] = useState(0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [intendedIndex, setIntendedIndex] = useState(0);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [lastResults, setLastResults] = useState<LastResult[]>([]);
  const [score, setScore] = useState(0);
  const [debugMode, setDebugMode] = useState(false); // <--- DEBUG MODE TOGGLE

  // Betting
  const [bets, setBets] = useState<Record<number, number[]>>({});
  const [previousBets, setPreviousBets] = useState<Record<number, number[]>>({});
  const [selectedChip, setSelectedChip] = useState(1);

  // Game
  const [isWin, setIsWin] = useState(false);
  const [userParticipated, setUserParticipated] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [hasSpunThisRound, setHasSpunThisRound] = useState(false);
  const [snackMsg, setSnackMsg] = useState<string | null>(null);

  // Wheel
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinDuration, setSpinDuration] = useState(5);
  const targetAngleRef = useRef(0);
  const spinningRef = useRef(false);

  const wsRef = useRef<WebSocket | null>(null);
  const snackTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isBettingPhase = gamePhase === "betting";
  const totalBet = Object.values(bets).flat().reduce((a, b) => a + b, 0);

  const last10str = lastResults.slice(0, 10).map(r => r.number).join("") || "----------";

  const showSnack = useCallback((msg: string) => {
    if (snackTimerRef.current) clearTimeout(snackTimerRef.current);
    setSnackMsg(msg);
    snackTimerRef.current = setTimeout(() => setSnackMsg(null), 2500);
  }, []);

  const fetchBalance = useCallback(async () => {
    try { const bal = await gameGetBalance(); setBalance(bal); } catch {}
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const history = await gameGetSpinWheelHistory(10);
      setLastResults(history);
      if (history.length > 0) {
        const lastWin = history[0].number;
        // Position wheel so last winning number is at top (-90 degrees)
        const targetOffset = ((-lastWin * SWEEP) % 360 + 360) % 360;
        setRotation(targetOffset);
        targetAngleRef.current = targetOffset;
      }
    } catch {}
  }, []);

  const detectResult = useCallback((idx: number) => {
    const chips = bets[idx] || [];
    const totalBetOnNum = chips.reduce((a, b) => a + b, 0);
    const participated = Object.values(bets).some(c => c.length > 0);
    const win = participated && totalBetOnNum > 0;
    const earned = win ? totalBetOnNum * BASE_MULTIPLIER * currentMultiplier : 0;
    
    setIsWin(win);
    setUserParticipated(participated);
    setWinAmount(earned);
    
    if (win) {
      setBalance(b => b + earned);
      setScore(s => s + earned);
      showSnack(`🎉 You Won ₹${earned}!`);
    } else if (participated) {
      showSnack("Better luck next time!");
    }
    
    setLastResults(prev => [{ number: idx, multiplier: currentMultiplier }, ...prev].slice(0, 10));
  }, [bets, currentMultiplier, showSnack]);

  const triggerSpin = useCallback((winIndex: number, secsLeft: number) => {
    if (spinningRef.current || hasSpunThisRound) return;
    spinningRef.current = true;
    setHasSpunThisRound(true);
    setIsSpinning(true);

    const targetSegAngle = winIndex * SWEEP;
    const currentMod = targetAngleRef.current % 360;
    let delta = ((-targetSegAngle % 360 + 360) % 360) - currentMod;
    if (delta <= 0) delta += 360;
    
    // Add extra rotations for suspense
    const remainingTime = Math.max(3, secsLeft - SPIN_STOP_AT + 2);
    const extraSpins = 360 * Math.max(4, Math.floor(remainingTime / 1.5));
    const finalAngle = targetAngleRef.current + delta + extraSpins;
    
    targetAngleRef.current = finalAngle;
    setSpinDuration(remainingTime);
    setRotation(finalAngle);

    setTimeout(() => {
      detectResult(winIndex);
      spinningRef.current = false;
      setIsSpinning(false);
    }, remainingTime * 1000);
  }, [hasSpunThisRound, detectResult]);

  const onRoundEnd = useCallback(() => {
    spinningRef.current = false;
    setIsSpinning(false);
    setBets({});
    setWinningNumber(null);
    setIsWin(false);
    setUserParticipated(false);
    setWinAmount(0);
    setHasSpunThisRound(false);
    setGamePhase("betting");
    showSnack("New round! Place your bets");
    setTimeout(fetchBalance, 2000);
  }, [fetchBalance, showSnack]);

  const submitBulkBets = useCallback(async () => {
    if (Object.keys(bets).length === 0) return;
    const total = Object.values(bets).flat().reduce((a, b) => a + b, 0);
    setPreviousBets({ ...bets });
    try {
      await gamePlaceBulkBets(currentRoundId, bets, total);
    } catch (e: any) {
      setBalance(b => b + total);
      setBets({});
      showSnack(e.message || "Bet failed");
    }
  }, [bets, currentRoundId, showSnack]);

  // WebSocket connection
  useEffect(() => {
    fetchBalance();
    fetchHistory();

    const connect = () => {
      const token = getToken();
      const url = token ? `${GAME_WS}?token=${token}` : GAME_WS;
      const socket = new WebSocket(url);

      socket.onopen = () => setSocketConnected(true);
      socket.onclose = () => { setSocketConnected(false); setTimeout(connect, 3000); };
      socket.onerror = () => setSocketConnected(false);

      socket.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          const payload = msg.data || {};
          
          if (msg.type === "TIMER") {
            const secs: number = payload.remaining || 0;
            if (payload.round_id) setCurrentRoundId(payload.round_id);
            setSecondsLeft(secs);
            
            let phase: GamePhase = "betting";
            if (secs <= 0) phase = "playAndWin";
            else if (secs <= RESULT_START_AT) phase = "resultOverlay";
            else if (secs <= SPIN_STOP_AT) phase = "stopHighlight";
            else if (secs <= SPIN_START_AT) phase = "spinning";
            else if (secs <= BETTING_END_AT) phase = "betLock";
            
            setGamePhase(prev => {
              if (prev !== phase && phase === "betLock") { showSnack("Bets closed!"); }
              return phase;
            });
          } else if (msg.type === "RESULT") {
            if (payload.round_id) setCurrentRoundId(payload.round_id);
            const mult = payload.multiplier || 1;
            const winNum = payload.winning_number ?? 0;
            setCurrentMultiplier(mult);
            setIntendedIndex(winNum);
            setWinningNumber(winNum);
            setSecondsLeft(prev => { triggerSpin(winNum, prev); return prev; });
          } else if (msg.type === "NEW_ROUND") {
            if (payload.round_id) setCurrentRoundId(payload.round_id);
            setCurrentMultiplier(1);
            onRoundEnd();
          }
        } catch {}
      };
      wsRef.current = socket;
    };

    connect();
    return () => { wsRef.current?.close(); };
  }, [fetchBalance, fetchHistory, showSnack, triggerSpin, onRoundEnd]);

  useEffect(() => {
    if (gamePhase === "betLock") submitBulkBets();
  }, [gamePhase]);

  // Actions
  const placeBet = (num: number) => {
    if (!isBettingPhase) { showSnack("Bets are closed"); return; }
    if (!socketConnected) { showSnack("Connecting…"); return; }
    if (balance < selectedChip) { showSnack("Insufficient balance"); return; }
    
    setBalance(b => b - selectedChip);
    setBets(prev => {
      const next = { ...prev };
      next[num] = [...(next[num] || []), selectedChip];
      return next;
    });
  };

  const handleTake = () => {
    if (winAmount > 0) { showSnack(`₹${winAmount} taken!`); setWinAmount(0); }
    else showSnack("Nothing to take");
  };

  const handleCancel = () => {
    if (!isBettingPhase || totalBet === 0) return;
    setBalance(b => b + totalBet);
    setBets({});
    showSnack("All bets cancelled");
  };

  const handleCancelSpecific = () => {
    if (!isBettingPhase || totalBet === 0) return;
    const keys = Object.keys(bets).filter(k => bets[+k]?.length > 0);
    if (keys.length === 0) return;
    const lastKey = keys[keys.length - 1];
    const lastChip = bets[+lastKey][bets[+lastKey].length - 1];
    
    setBalance(b => b + lastChip);
    setBets(prev => {
      const next = { ...prev };
      next[+lastKey] = next[+lastKey].slice(0, -1);
      if (next[+lastKey].length === 0) delete next[+lastKey];
      return next;
    });
    showSnack(`Removed ₹${lastChip} bet`);
  };

  const handleBetOk = () => {
    if (!isBettingPhase || totalBet === 0) { showSnack("Place a bet first"); return; }
    showSnack(`Bet of ₹${totalBet} confirmed`);
  };

  // Timer format
  const timerMin = Math.floor(Math.max(0, secondsLeft - BETTING_END_AT) / 60);
  const timerSec = Math.max(0, secondsLeft - BETTING_END_AT) % 60;
  const timerStr = `${timerMin}:${timerSec.toString().padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center select-none overflow-hidden">
      
      {/* 16:9 Aspect Ratio Game Container */}
      <div 
        className="relative w-full max-h-[100vh] bg-zinc-900" 
        style={{ aspectRatio: "16/9", maxWidth: "177.78vh" }}
      >
        {/* The Base Background Image */}
        <Image src="/game/background.png" alt="Background" fill sizes="100vw" className="object-cover pointer-events-none z-0" priority />

        {/* --- DEBUG TOGGLE --- */}
        <button 
          onClick={() => setDebugMode(!debugMode)} 
          className="absolute top-0 right-[40%] z-[99] bg-black/80 text-white text-xs px-2 py-1 rounded-b border border-gray-600"
        >
          {debugMode ? "Debug ON" : "Debug OFF"}
        </button>

        {/* ── Text Overlays (Score, Time, Winner, Last 10) ── */}
        <div className={`absolute flex items-center justify-center z-10 ${debugMode ? 'bg-red-500/40 border border-red-500' : ''}`}
             style={{ left: "4.5%", top: "12%", width: "13%", height: "6%" }}>
          <span className="text-[#00FF88] font-black text-[2vw] md:text-xl tracking-widest text-shadow-glow">{score}</span>
        </div>
        
        <div className={`absolute flex items-center justify-center z-10 ${debugMode ? 'bg-red-500/40 border border-red-500' : ''}`}
             style={{ left: "4.5%", top: "33.5%", width: "13%", height: "6%" }}>
          <span className="text-[#00FF88] font-black text-[2vw] md:text-xl tracking-widest text-shadow-glow">{timerStr}</span>
        </div>
        
        <div className={`absolute flex items-center justify-center z-10 ${debugMode ? 'bg-red-500/40 border border-red-500' : ''}`}
             style={{ right: "4%", top: "12%", width: "13%", height: "6%" }}>
          <span className="text-[#00FF88] font-black text-[2vw] md:text-xl tracking-widest text-shadow-glow">{winningNumber !== null ? winningNumber : ""}</span>
        </div>
        
        <div className={`absolute flex items-center justify-center z-10 ${debugMode ? 'bg-red-500/40 border border-red-500' : ''}`}
             style={{ right: "3%", top: "33.5%", width: "15%", height: "6%" }}>
          <span className="text-[#00FF88] font-black text-[1.5vw] md:text-lg tracking-widest text-shadow-glow">{last10str}</span>
        </div>

        {/* ── Inner Wheel ── */}
        <div className={`absolute z-10 flex items-center justify-center ${debugMode ? 'border border-blue-500 rounded-full bg-blue-500/20' : ''}`}
             style={{ left: "50%", top: "43.5%", transform: "translate(-50%, -50%)", width: "35%", height: "62.22%" }}>
          <div className="w-[85%] h-[85%]">
             <RouletteWheel rotation={rotation} isSpinning={isSpinning} spinDuration={spinDuration} />
          </div>
        </div>

        {/* ── 0-9 Betting Zones on Outer Wheel ── */}
        <div className="absolute z-20" style={{ left: "50%", top: "43.5%", width: "0", height: "0" }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            // Distribute 10 segments around the wheel starting from the left
            const angleDeg = -162 + (num * 36);
            const radius = "21vw"; 
            const chips = (bets[num] || []).reduce((a,b) => a+b, 0);
            
            return (
              <div key={num} className="absolute flex items-center justify-center"
                   style={{
                     transform: `rotate(${angleDeg}deg) translateY(-${radius}) rotate(-${angleDeg}deg)`,
                   }}>
                <button 
                  onClick={() => placeBet(num)}
                  className={`w-[5.5vw] h-[5.5vw] rounded-full flex flex-col items-center justify-center transition-all active:scale-90
                    ${debugMode ? 'bg-red-500/60 border border-white' : 'hover:bg-white/10'}
                  `}
                  style={{ transform: "translate(-50%, -50%)" }}
                >
                  {/* Show placed chips on this number */}
                  {chips > 0 && (
                    <div className="bg-red-600 rounded-full px-1 py-0.5 border border-white min-w-[2vw] text-center shadow-[0_0_10px_rgba(255,0,0,0.8)] pointer-events-none">
                       <span className="text-white font-bold text-[1.2vw] md:text-xs leading-none">
                         {chips >= 1000 ? `${(chips/1000).toFixed(1)}k` : chips}
                       </span>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* ── Chips Selectors ── */}
        {/* Left Chips: 1, 3, 10 */}
        <div className="absolute z-30 flex gap-[3.5vw]" style={{ left: "2.5%", top: "60.5%" }}>
           {[1, 3, 10].map(val => (
             <button key={val} onClick={() => setSelectedChip(val)}
               className={`w-[6vw] h-[3vw] rounded-full transition-all active:scale-90 
                 ${selectedChip === val ? 'ring-2 ring-[#FFD700] ring-offset-2 ring-offset-transparent shadow-[0_0_15px_#FFD700]' : ''}
                 ${debugMode ? 'bg-red-500/40 border border-red-500' : 'hover:bg-white/10'}
               `} 
             />
           ))}
        </div>
        {/* Right Chips: 100, 500, 1000 */}
        <div className="absolute z-30 flex gap-[3.5vw]" style={{ right: "2%", top: "60.5%" }}>
           {[100, 500, 1000].map(val => (
             <button key={val} onClick={() => setSelectedChip(val)}
               className={`w-[6vw] h-[3vw] rounded-full transition-all active:scale-90 
                 ${selectedChip === val ? 'ring-2 ring-[#FFD700] ring-offset-2 ring-offset-transparent shadow-[0_0_15px_#FFD700]' : ''}
                 ${debugMode ? 'bg-red-500/40 border border-red-500' : 'hover:bg-white/10'}
               `} 
             />
           ))}
        </div>
        {/* ── Inner Wheel Overlay (Locked to background wheel) ── */}
        <div className="absolute z-10 flex items-center justify-center"
             style={{ left: "50%", top: "43%", transform: "translate(-50%, -50%)", width: "31.5%", aspectRatio: "1" }}>
           <RouletteWheel rotation={rotation} isSpinning={isSpinning} spinDuration={spinDuration} />
        </div>

        {/* ── UI Layer ── */}
        <div className="absolute inset-0 z-20 flex flex-col p-[2cqw]">
          
          {/* Top HUD Row */}
          <div className="flex justify-between w-full">
            <div className="flex flex-col gap-[1cqw]">
              <LedPanel label="Score" value={score.toString()} />
              <LedPanel label="Time" value={timerStr} />
            </div>
            <div className="flex flex-col gap-[1cqw] items-end">
              <LedPanel label="Winner" value={winningNumber !== null ? winningNumber.toString() : "0"} />
              <LedPanel label="Last 10" value={last10str} wide />
            </div>
          </div>

          {/* Bottom Action Area */}
          <div className="mt-auto flex flex-col items-center w-full">
            
            {/* Fun Target Banner */}
            <div className="mb-[1cqw]">
              <div className="px-[4cqw] py-[0.8cqw] rounded-full border-[0.3cqw] border-[#FFD700] bg-gradient-to-b from-[#E60000] to-[#800000] shadow-[0_0_1.5cqw_rgba(255,215,0,0.5)]">
                <span className="text-white font-black text-[3cqw] uppercase tracking-widest drop-shadow-md" style={{ fontFamily: "serif", textShadow: "0.2cqw 0.2cqw 0 #000" }}>
                  Fun Target
                </span>
              </div>
            </div>

            {/* 0-9 Betting Grid */}
            <div className="w-[85%] mb-[1.5cqw]">
              <div className="grid grid-cols-10 gap-[1cqw]">
                {[0,1,2,3,4,5,6,7,8,9].map(num => {
                  const chips = (bets[num] || []).reduce((a,b) => a+b, 0);
                  const isWinner = (gamePhase === "stopHighlight" || gamePhase === "resultOverlay") && intendedIndex === num;
                  return (
                    <button key={num} onClick={() => placeBet(num)}
                      className="relative flex items-center justify-center rounded-[0.5cqw] border-[0.2cqw] transition-all active:scale-95 aspect-[4/3] group"
                      style={{
                        background: isWinner ? "linear-gradient(135deg, #FF3333, #AA0000)" : chips > 0 ? "linear-gradient(135deg, #FFD700, #AA7700)" : "rgba(0,0,0,0.8)",
                        borderColor: isWinner || chips > 0 ? "#FFF" : "rgba(255,215,0,0.4)"
                      }}>
                      <span className="text-white font-black text-[2.5cqw] z-10" style={{ fontFamily: "serif" }}>{num}</span>
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10" />
                      {chips > 0 && (
                        <div className="absolute -top-[15%] -right-[15%] h-[50%] min-w-[50%] rounded-full bg-red-600 border-[0.1cqw] border-white flex items-center justify-center z-20 px-[0.2cqw] shadow-[0_0_1cqw_rgba(255,0,0,0.8)]">
                          <span className="text-white font-bold text-[1.2cqw] leading-none">{chips >= 1000 ? `${(chips/1000).toFixed(1)}k` : chips}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions & Chips Row */}
            <div className="w-full max-w-[95%] flex flex-row items-center justify-between pb-[1cqw]">
              
              {/* Left Actions */}
              <div className="flex gap-[1cqw]">
                <button onClick={handleTake} className="btn-action bg-gradient-to-b from-[#CC0000] to-[#880000]">Take</button>
                <button onClick={handleCancel} className="btn-action bg-gradient-to-b from-[#CC0000] to-[#880000]">Cancel</button>
              </div>

              {/* Chips Selector */}
              <div className="flex gap-[1cqw] bg-black/60 p-[0.8cqw] rounded-full border-[0.1cqw] border-white/20 items-center justify-center">
                <ChipBtn value={1} selected={selectedChip === 1} onClick={() => setSelectedChip(1)} colorTheme="radial-gradient(circle at 30% 30%, #4ADE80, #166534)" />
                <ChipBtn value={3} selected={selectedChip === 3} onClick={() => setSelectedChip(3)} colorTheme="radial-gradient(circle at 30% 30%, #FBBF24, #B45309)" />
                <ChipBtn value={10} selected={selectedChip === 10} onClick={() => setSelectedChip(10)} colorTheme="radial-gradient(circle at 30% 30%, #C084FC, #6B21A8)" />
                <div className="w-[0.1cqw] h-[4cqw] bg-white/30 mx-[0.5cqw]" />
                <ChipBtn value={100} selected={selectedChip === 100} onClick={() => setSelectedChip(100)} colorTheme="radial-gradient(circle at 30% 30%, #38BDF8, #0369A1)" />
                <ChipBtn value={500} selected={selectedChip === 500} onClick={() => setSelectedChip(500)} colorTheme="radial-gradient(circle at 30% 30%, #F472B6, #9D174D)" />
                <ChipBtn value={1000} selected={selectedChip === 1000} onClick={() => setSelectedChip(1000)} colorTheme="radial-gradient(circle at 30% 30%, #A78BFA, #4C1D95)" />
              </div>

              {/* Right Actions */}
              <div className="flex gap-[1cqw]">
                <button onClick={handleCancelSpecific} className="btn-action bg-gradient-to-b from-[#CC0000] to-[#880000]">Cancel 1</button>
                <button onClick={handleBetOk} className="btn-action bg-gradient-to-b from-[#CC0000] to-[#880000]">Bet Ok</button>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      {/* ── Snack Message ── */}
      {snackMsg && (
        <div className="fixed top-[20%] left-1/2 z-50 px-6 py-3 rounded-full text-white font-bold text-sm"
          style={{ 
            background: "linear-gradient(90deg, rgba(200,0,0,0.9), rgba(150,0,0,0.9))", 
            border: "2px solid #FFD700",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5), 0 0 10px rgba(255,215,0,0.5)",
            transform: "translateX(-50%)",
            animation: "fadeIn 0.3s ease-out"
          }}>
          {snackMsg}
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .btn-action {
          border: 0.2cqw solid #FFD700;
          border-radius: 9999px;
          color: white;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 1cqw 2cqw;
          font-size: 1.5cqw;
          box-shadow: 0 0.5cqw 1cqw rgba(0,0,0,0.5), inset 0 0.2cqw 0.5cqw rgba(255,255,255,0.3);
          transition: all 0.15s ease;
          white-space: nowrap;
          text-align: center;
        }
        .btn-action:active { transform: scale(0.95); }
        .btn-action:hover { filter: brightness(1.1); }
      `}} />
    </div>
  );
}
