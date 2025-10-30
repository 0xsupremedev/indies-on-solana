import React, { useState } from "react";

const dummyQueue = [
  { id: 1, effect: "Health Pack", user: "3db1...9ce2", sol: 0.01 },
  { id: 2, effect: "Gravity Flip", user: "9r21...45gf", sol: 0.05 },
];

export function ReactOverlay() {
  const [connected, setConnected] = useState(false);
  const [queue, setQueue] = useState(dummyQueue);

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, width: 420, zIndex: 2000, background: "rgba(0,0,24,0.91)", color: "#fff", borderLeft: "2px solid #00ffff", padding: 20, minHeight: "100vh"
    }}>
      <h3 style={{ color: "#00ffff", marginBottom: 16 }}>REACT OVERLAY</h3>
      {/* Wallet Connect or Connected State */}
      {!connected ? (
        <button style={{ background: "#00ffff", color: "#0e1c2f", padding: '10px 30px', fontWeight: 700, border: 0, borderRadius: 5 }} onClick={() => setConnected(true)}>
          Connect Wallet
        </button> ) : (
        <div style={{ marginBottom: 14, color: "#ffff00" }}>Wallet: 3db1...9ce2</div>
      )}
      <hr style={{ borderTop: "1px solid #111", borderBottom: 'none', margin: "20px 0" }} />
      {/* Effect Buy Buttons */}
      <div style={{ marginBottom: 20 }}>
        <strong>BUY IN-GAME ACTIONS:</strong>
        <div style={{ marginTop: 10 }}>
          <button style={{ marginRight: 12, background: "#333", color: "#7fffd4" }}>Health Pack (0.01 SOL)</button>
          <button style={{ marginRight: 12, background: "#333", color: "#ffa07a" }}>Gravity Flip (0.05 SOL)</button>
          <button style={{ background: "#333", color: "#fff" }}>Coin Rain (0.08 SOL)</button>
        </div>
      </div>
      <div style={{ background: "rgba(16,32,40,.92)", padding: 14, borderRadius: 7, height: 140, overflowY: "auto" }}>
        <strong>LIVE QUEUE FEED</strong>
        <div>
          {queue.map(q => (
            <div key={q.id} style={{ fontSize: 15, margin: "10px 0 0 0", color: "#00ffff" }}>
              [{q.effect}] <span style={{ color: '#80ffb0' }}>{q.user}</span> <span style={{ color: '#fde910' }}>@ {q.sol} SOL</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
