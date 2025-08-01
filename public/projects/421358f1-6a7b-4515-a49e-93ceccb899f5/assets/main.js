// Astro Duel Main Game
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.camera = new Vector2(0, 0);
        
        this.gameState = 'menu';
        this.score = 0;
        
        // Game objects
        this.player = null;
        this.enemy = null;
        this.bullets = [];
        this.walls = [];
        this.powerUps = [];
        this.particles = [];
        
        // AI controller
        this.aiController = null;
        
        // Input handling
        this.keys = {};
        this.setupInput();
        
        // Game loop
        this.lastTime = 0;
        this.gameLoop = this.gameLoop.bind(this);
        
        // Initialize level
        this.initializeLevel();
        
        console.log('Game initialized successfully');
    }

    setupInput() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault();
            }
            if (e.code === 'KeyR' && this.gameState === 'gameOver') {
                this.restartGame();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Add mouse click shooting
        this.canvas.addEventListener('mousedown', (e) => {
            if (this.gameState === 'playing' && this.player && this.player.alive) {
                this.player.shoot(this.bullets);
            }
        });
    }

    initializeLevel() {
        // Create map boundaries
        const mapSize = 2000;
        const wallThickness = 50;
        
        // Outer walls (indestructible)
        this.walls.push(new Wall(-mapSize/2, 0, wallThickness, mapSize, false));
        this.walls.push(new Wall(mapSize/2, 0, wallThickness, mapSize, false));
        this.walls.push(new Wall(0, -mapSize/2, mapSize, wallThickness, false));
        this.walls.push(new Wall(0, mapSize/2, mapSize, wallThickness, false));
        
        // Interior walls and obstacles
        this.createInteriorWalls();
        
        // Create power-ups
        this.spawnPowerUps();
    }

    createInteriorWalls() {
        // Create a maze-like structure with both destructible and indestructible walls
        const walls = [
            // Central structure
            { x: 0, y: 0, w: 200, h: 50, destructible: false },
            { x: -300, y: -200, w: 100, h: 150, destructible: true },
            { x: 300, y: 200, w: 100, h: 150, destructible: true },
            { x: -200, y: 300, w: 150, h: 80, destructible: true },
            { x: 200, y: -300, w: 150, h: 80, destructible: true },
            
            // Corner structures
            { x: -400, y: -400, w: 120, h: 60, destructible: false },
            { x: 400, y: 400, w: 120, h: 60, destructible: false },
            { x: -400, y: 400, w: 120, h: 60, destructible: false },
            { x: 400, y: -400, w: 120, h: 60, destructible: false },
            
            // Destructible barriers
            { x: 0, y: 150, w: 80, h: 30, destructible: true },
            { x: 0, y: -150, w: 80, h: 30, destructible: true },
            { x: 150, y: 0, w: 30, h: 80, destructible: true },
            { x: -150, y: 0, w: 30, h: 80, destructible: true },
        ];

        for (const wall of walls) {
            this.walls.push(new Wall(wall.x, wall.y, wall.w, wall.h, wall.destructible));
        }
    }

    spawnPowerUps() {
        const powerUpTypes = ['laser', 'bigLaser', 'health'];
        const positions = [
            { x: -500, y: -300 },
            { x: 500, y: 300 },
            { x: -300, y: 500 },
            { x: 300, y: -500 },
            { x: 0, y: 400 },
            { x: 0, y: -400 },
        ];

        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i];
            const type = powerUpTypes[i % powerUpTypes.length];
            this.powerUps.push(new PowerUp(pos.x, pos.y, type));
        }
    }

    startGame() {
        this.gameState = 'playing';
        
        // Create player (red ship)
        this.player = new Ship(-200, 0, '#ff0000');
        
        // Create enemy (blue ship)
        this.enemy = new Ship(200, 0, '#0000ff');
        
        // Initialize camera to follow player
        this.camera.x = this.player.position.x - this.canvas.width/2;
        this.camera.y = this.player.position.y - this.canvas.height/2;
        
        // Initialize AI
        this.aiController = new AIController(this.enemy, this.player);
        
        // Clear arrays
        this.bullets = [];
        this.particles = [];
        
        // Reset score
        this.score = 0;
        
        // Hide menu
        document.getElementById('menu').style.display = 'none';
        document.getElementById('instructions').style.display = 'none';
        
        console.log('Game started - Player at:', this.player.position, 'Camera at:', this.camera);
        
        // Start game loop
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop);
    }

    restartGame() {
        // Reset game state
        this.gameState = 'menu';
        this.player = null;
        this.enemy = null;
        this.bullets = [];
        this.particles = [];
        this.powerUps = [];
        
        // Recreate level
        this.walls = [];
        this.initializeLevel();
        
        // Show menu
        document.getElementById('menu').style.display = 'block';
        
        // Update UI
        this.updateUI();
    }

    gameLoop(currentTime) {
        if (this.gameState !== 'playing') return;
        
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        this.update(deltaTime || 0);
        this.render();
        
        requestAnimationFrame(this.gameLoop);
    }

    update(deltaTime) {
        // Handle input
        this.handleInput(deltaTime);
        
        // Update AI
        if (this.aiController && this.enemy.alive) {
            this.aiController.update(deltaTime, this.walls, this.powerUps);
        }
        
        // Update game objects
        if (this.player) this.player.update(deltaTime);
        if (this.enemy) this.enemy.update(deltaTime);
        
        this.bullets.forEach(bullet => bullet.update(deltaTime));
        this.powerUps.forEach(powerUp => powerUp.update(deltaTime));
        this.particles.forEach(particle => particle.update(deltaTime));
        
        // Handle collisions
        this.handleCollisions();
        
        // Update camera to follow player
        if (this.player && this.player.alive) {
            this.camera.x = this.player.position.x - this.canvas.width/2;
            this.camera.y = this.player.position.y - this.canvas.height/2;
        }
        
        // Clean up dead objects
        this.bullets = this.bullets.filter(bullet => bullet.alive);
        this.walls = this.walls.filter(wall => wall.alive);
        this.powerUps = this.powerUps.filter(powerUp => powerUp.alive);
        this.particles = this.particles.filter(particle => particle.alive);
        
        // Check win/lose conditions
        this.checkGameOver();
        
        // Update UI
        this.updateUI();
    }

    handleInput(deltaTime) {
        if (!this.player || !this.player.alive) return;
        
        // Rotation
        if (this.keys['KeyA']) {
            this.player.rotation -= this.player.rotationSpeed * deltaTime;
        }
        if (this.keys['KeyD']) {
            this.player.rotation += this.player.rotationSpeed * deltaTime;
        }
        
        // Thrust
        this.player.thrust = this.keys['KeyW'] ? 1 : 0;
    }

    handleCollisions() {
        // Bullet vs Ship collisions
        for (const bullet of this.bullets) {
            if (!bullet.alive) continue;
            
            // Check collision with enemy
            if (bullet.color === this.player.color && this.enemy.alive && bullet.collidesWith(this.enemy)) {
                this.enemy.takeDamage(bullet.damage);
                if (!bullet.penetrating) {
                    bullet.alive = false;
                }
                this.createExplosion(bullet.position, '#ffaa00');
                
                if (!this.enemy.alive) {
                    this.score += 100;
                    this.createExplosion(this.enemy.position, '#ff0000');
                }
            }
            
            // Check collision with player
            if (bullet.color === this.enemy.color && this.player.alive && bullet.collidesWith(this.player)) {
                this.player.takeDamage(bullet.damage);
                if (!bullet.penetrating) {
                    bullet.alive = false;
                }
                this.createExplosion(bullet.position, '#ffaa00');
                
                if (!this.player.alive) {
                    this.createExplosion(this.player.position, '#ff0000');
                }
            }
        }
        
        // Bullet vs Wall collisions
        for (const bullet of this.bullets) {
            if (!bullet.alive) continue;
            
            for (const wall of this.walls) {
                if (!wall.alive) continue;
                
                if (wall.collidesWith(bullet)) {
                    const destroyed = wall.takeDamage(bullet.damage);
                    if (destroyed) {
                        this.score += 10;
                        this.createExplosion(wall.position, '#8B4513');
                        
                        // Chance to spawn power-up
                        if (Math.random() < 0.3) {
                            const types = ['laser', 'bigLaser', 'health'];
                            const type = types[Math.floor(Math.random() * types.length)];
                            this.powerUps.push(new PowerUp(wall.position.x, wall.position.y, type));
                        }
                    }
                    
                    if (!bullet.penetrating) {
                        bullet.alive = false;
                    }
                    this.createExplosion(bullet.position, '#ffaa00');
                }
            }
        }
        
        // Ship vs Wall collisions
        this.handleShipWallCollisions(this.player);
        this.handleShipWallCollisions(this.enemy);
        
        // Ship vs PowerUp collisions
        this.handlePowerUpCollisions();
    }

    handleShipWallCollisions(ship) {
        if (!ship || !ship.alive) return;
        
        for (const wall of this.walls) {
            if (!wall.alive) continue;
            
            // Check if ship is colliding with wall
            const dx = ship.position.x - wall.position.x;
            const dy = ship.position.y - wall.position.y;
            
            // Calculate closest point on wall to ship center
            const closestX = Math.max(wall.position.x - wall.width/2, Math.min(ship.position.x, wall.position.x + wall.width/2));
            const closestY = Math.max(wall.position.y - wall.height/2, Math.min(ship.position.y, wall.position.y + wall.height/2));
            
            // Calculate distance from ship center to closest point
            const distanceX = ship.position.x - closestX;
            const distanceY = ship.position.y - closestY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            
            // Check if collision occurred
            if (distance < ship.size/2) {
                // Calculate separation vector
                let separationX, separationY;
                
                if (distance === 0) {
                    // Ship is exactly at wall center, use position difference
                    separationX = dx > 0 ? 1 : -1;
                    separationY = dy > 0 ? 1 : -1;
                } else {
                    separationX = distanceX / distance;
                    separationY = distanceY / distance;
                }
                
                // Push ship out of wall
                const overlap = ship.size/2 - distance;
                ship.position.x += separationX * overlap;
                ship.position.y += separationY * overlap;
                
                // Reflect velocity
                const dotProduct = ship.velocity.x * separationX + ship.velocity.y * separationY;
                ship.velocity.x -= 2 * dotProduct * separationX * 0.8; // 0.8 for less bouncy feel
                ship.velocity.y -= 2 * dotProduct * separationY * 0.8;
            }
        }
    }

    handlePowerUpCollisions() {
        for (const powerUp of this.powerUps) {
            if (!powerUp.alive) continue;
            
            if (this.player.alive && powerUp.collidesWith(this.player)) {
                if (powerUp.type === 'health') {
                    this.player.health = Math.min(this.player.maxHealth, this.player.health + 50);
                } else {
                    this.player.collectPowerUp(powerUp);
                }
                powerUp.alive = false;
                this.score += 5;
            }
            
            if (this.enemy.alive && powerUp.collidesWith(this.enemy)) {
                if (powerUp.type === 'health') {
                    this.enemy.health = Math.min(this.enemy.maxHealth, this.enemy.health + 50);
                } else {
                    this.enemy.collectPowerUp(powerUp);
                }
                powerUp.alive = false;
            }
        }
    }

    createExplosion(position, color) {
        for (let i = 0; i < 8; i++) {
            const particle = new GameObject(position.x, position.y);
            particle.velocity = Vector2.fromAngle(Math.random() * Math.PI * 2, 100 + Math.random() * 200);
            particle.color = color;
            particle.size = 3 + Math.random() * 5;
            particle.lifeTime = 0.5 + Math.random() * 0.5;
            particle.originalUpdate = particle.update;
            particle.update = function(deltaTime) {
                this.originalUpdate(deltaTime);
                this.lifeTime -= deltaTime;
                if (this.lifeTime <= 0) {
                    this.alive = false;
                }
                this.velocity = this.velocity.multiply(0.95);
            };
            this.particles.push(particle);
        }
    }

    checkGameOver() {
        if (!this.player.alive) {
            this.gameState = 'gameOver';
            this.showGameOver('GAME OVER - Enemy Wins!');
        } else if (!this.enemy.alive) {
            this.gameState = 'gameOver';
            this.showGameOver('YOU WIN!');
        }
    }

    showGameOver(message) {
        const menu = document.getElementById('menu');
        menu.innerHTML = `
            <h1>${message}</h1>
            <div>Final Score: ${this.score}</div>
            <button onclick="game.restartGame()">PLAY AGAIN</button>
        `;
        menu.style.display = 'block';
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#001122';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars background
        this.drawStars();
        
        // Draw game objects
        this.walls.forEach(wall => wall.render(this.ctx, this.camera));
        this.powerUps.forEach(powerUp => powerUp.render(this.ctx, this.camera));
        this.bullets.forEach(bullet => bullet.render(this.ctx, this.camera));
        this.particles.forEach(particle => particle.render(this.ctx, this.camera));
        
        if (this.player && this.player.alive) {
            this.player.render(this.ctx, this.camera);
        }
        
        if (this.enemy && this.enemy.alive) {
            this.enemy.render(this.ctx, this.camera);
        }
        
        // Draw minimap
        this.drawMinimap();
    }

    drawStars() {
        const starDensity = 0.0005;
        const starSize = 1;
        
        // Calculate visible area
        const startX = Math.floor(this.camera.x / 100) * 100;
        const startY = Math.floor(this.camera.y / 100) * 100;
        const endX = startX + this.canvas.width + 200;
        const endY = startY + this.canvas.height + 200;
        
        this.ctx.fillStyle = '#ffffff';
        
        for (let x = startX; x < endX; x += 100) {
            for (let y = startY; y < endY; y += 100) {
                // Use position as seed for consistent star placement
                const seed = x * 73856093 ^ y * 19349663;
                const random = (seed % 1000) / 1000;
                
                if (random < starDensity * 100) {
                    const starX = x + (seed % 100);
                    const starY = y + ((seed >> 8) % 100);
                    const screenX = starX - this.camera.x;
                    const screenY = starY - this.camera.y;
                    
                    if (screenX >= 0 && screenX < this.canvas.width && screenY >= 0 && screenY < this.canvas.height) {
                        this.ctx.fillRect(screenX, screenY, starSize, starSize);
                    }
                }
            }
        }
    }

    drawMinimap() {
        const mapSize = 200;
        const mapScale = 0.1;
        const mapX = this.canvas.width - mapSize - 10;
        const mapY = 10;
        
        // Draw minimap background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(mapX, mapY, mapSize, mapSize);
        this.ctx.strokeStyle = '#0ff';
        this.ctx.strokeRect(mapX, mapY, mapSize, mapSize);
        
        // Draw walls on minimap
        this.ctx.fillStyle = '#666';
        for (const wall of this.walls) {
            if (!wall.alive) continue;
            const x = mapX + mapSize/2 + wall.position.x * mapScale;
            const y = mapY + mapSize/2 + wall.position.y * mapScale;
            const w = wall.width * mapScale;
            const h = wall.height * mapScale;
            this.ctx.fillRect(x - w/2, y - h/2, w, h);
        }
        
        // Draw ships on minimap
        if (this.player && this.player.alive) {
            this.ctx.fillStyle = this.player.color;
            const x = mapX + mapSize/2 + this.player.position.x * mapScale;
            const y = mapY + mapSize/2 + this.player.position.y * mapScale;
            this.ctx.fillRect(x - 2, y - 2, 4, 4);
        }
        
        if (this.enemy && this.enemy.alive) {
            this.ctx.fillStyle = this.enemy.color;
            const x = mapX + mapSize/2 + this.enemy.position.x * mapScale;
            const y = mapY + mapSize/2 + this.enemy.position.y * mapScale;
            this.ctx.fillRect(x - 2, y - 2, 4, 4);
        }
    }

    updateUI() {
        if (this.player) {
            document.getElementById('playerHealth').textContent = Math.max(0, Math.floor(this.player.health));
        }
        if (this.enemy) {
            document.getElementById('enemyHealth').textContent = Math.max(0, Math.floor(this.enemy.health));
        }
        document.getElementById('score').textContent = this.score;
    }
}

// Global functions for menu buttons
function startGame() {
    game.startGame();
}

function showInstructions() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('instructions').style.display = 'block';
}

function hideInstructions() {
    document.getElementById('instructions').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
}

// Initialize game when page loads
let game;
window.addEventListener('load', () => {
    game = new Game();
});