// Coin Wars 3D Stream Overlay JavaScript

class OverlayManager {
    constructor() {
        this.socket = null;
        this.leaderboard = [];
        this.recentActions = [];
        this.gameStats = {
            roundNumber: 1,
            playerCount: 0,
            effectCount: 0
        };
        
        this.init();
    }

    init() {
        this.connectToServer();
        this.setupEventListeners();
        this.startUpdateLoop();
    }

    connectToServer() {
        const serverUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:3001' 
            : 'https://your-production-server.com';
            
        this.socket = io(serverUrl);

        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.updateConnectionStatus(true);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.updateConnectionStatus(false);
        });

        this.socket.on('analyticsUpdate', (data) => {
            this.updateLeaderboard(data.leaderboard);
            this.updateRecentActions(data.recentActions);
        });

        this.socket.on('gameState', (gameState) => {
            this.updateGameStats(gameState);
        });

        this.socket.on('effectTriggered', (effect) => {
            this.addNewAction(effect);
        });
    }

    setupEventListeners() {
        // Add any additional event listeners here
    }

    startUpdateLoop() {
        setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }

    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('connectionStatus');
        if (statusElement) {
            statusElement.textContent = connected ? 'CONNECTED' : 'DISCONNECTED';
            statusElement.className = connected ? 'connected' : 'disconnected';
        }
    }

    updateLeaderboard(leaderboard) {
        this.leaderboard = leaderboard;
        this.renderLeaderboard();
    }

    updateRecentActions(actions) {
        this.recentActions = actions;
        this.renderRecentActions();
    }

    updateGameStats(gameState) {
        this.gameStats = {
            roundNumber: gameState.roundNumber || 1,
            playerCount: gameState.players ? gameState.players.size : 0,
            effectCount: gameState.effects ? gameState.effects.size : 0
        };
        this.renderGameStats();
    }

    addNewAction(effect) {
        this.recentActions.unshift(effect);
        
        // Keep only last 15 actions
        if (this.recentActions.length > 15) {
            this.recentActions = this.recentActions.slice(0, 15);
        }
        
        this.renderRecentActions();
    }

    renderLeaderboard() {
        const container = document.getElementById('leaderboard');
        if (!container) return;

        if (this.leaderboard.length === 0) {
            container.innerHTML = '<div class="loading">No spenders yet</div>';
            return;
        }

        const html = this.leaderboard.map((spender, index) => `
            <div class="leaderboard-item">
                <span class="leaderboard-rank">#${index + 1}</span>
                <span class="leaderboard-name">${spender.nickname}</span>
                <span class="leaderboard-amount">${spender.totalSpent.toFixed(3)} SOL</span>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    renderRecentActions() {
        const container = document.getElementById('actionsFeed');
        if (!container) return;

        if (this.recentActions.length === 0) {
            container.innerHTML = '<div class="loading">Waiting for actions...</div>';
            return;
        }

        const html = this.recentActions.map(action => {
            const timeAgo = this.getTimeAgo(action.timestamp);
            const icon = this.getEffectIcon(action.type);
            const effectName = this.getEffectDisplayName(action.type);
            
            return `
                <div class="action-item">
                    <span class="action-icon effect-${action.type.replace('_', '-')}">${icon}</span>
                    <div class="action-details">
                        <span class="action-user">${this.getSpenderName(action.walletAddress)}</span>
                        <span class="action-effect">${effectName}</span>
                        <span class="action-amount">(${action.amount.toFixed(3)} SOL)</span>
                        <span class="action-time">${timeAgo}</span>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    renderGameStats() {
        document.getElementById('roundNumber').textContent = this.gameStats.roundNumber;
        document.getElementById('playerCount').textContent = this.gameStats.playerCount;
        document.getElementById('effectCount').textContent = this.gameStats.effectCount;
    }

    updateDisplay() {
        // Update any time-sensitive displays
        this.renderRecentActions(); // Update time stamps
    }

    getEffectIcon(type) {
        const icons = {
            'drop_health': '❤️',
            'drop_ammo': '🔫',
            'drop_shield': '🛡️',
            'spawn_laser': '⚡',
            'spawn_minion': '👹',
            'spawn_mine': '💣',
            'spawn_turret': '🏰',
            'gravity_flip': '🔄',
            'slow_motion': '⏰',
            'rain_coins': '💰'
        };
        return icons[type] || '✨';
    }

    getEffectDisplayName(type) {
        const names = {
            'drop_health': 'Health Pack',
            'drop_ammo': 'Ammo Box',
            'drop_shield': 'Shield',
            'spawn_laser': 'Laser Beam',
            'spawn_minion': 'Minion',
            'spawn_mine': 'Mine',
            'spawn_turret': 'Turret',
            'gravity_flip': 'Gravity Flip',
            'slow_motion': 'Slow Motion',
            'rain_coins': 'Coin Rain'
        };
        return names[type] || type;
    }

    getSpenderName(walletAddress) {
        const spender = this.leaderboard.find(s => s.walletAddress === walletAddress);
        return spender ? spender.nickname : `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    }

    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (seconds < 60) return `${seconds}s ago`;
        if (minutes < 60) return `${minutes}m ago`;
        return `${hours}h ago`;
    }
}

// Initialize overlay when page loads
document.addEventListener('DOMContentLoaded', () => {
    new OverlayManager();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Overlay hidden');
    } else {
        console.log('Overlay visible');
    }
});

// Mount React overlay if root exists
if (document.getElementById('react-overlay-root')) {
  import('./ReactOverlay.jsx').then(mod => {
    const React = window.React || require('react');
    const ReactDOM = window.ReactDOM || require('react-dom');
    ReactDOM.render(
      React.createElement(mod.ReactOverlay, null),
      document.getElementById('react-overlay-root')
    );
  });
}