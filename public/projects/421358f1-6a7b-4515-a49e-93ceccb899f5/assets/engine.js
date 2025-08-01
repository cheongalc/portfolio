// Astro Duel Game Engine
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    subtract(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    multiply(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const len = this.length();
        if (len === 0) return new Vector2(0, 0);
        return new Vector2(this.x / len, this.y / len);
    }

    distance(v) {
        return this.subtract(v).length();
    }

    angle() {
        return Math.atan2(this.y, this.x);
    }

    static fromAngle(angle, magnitude = 1) {
        return new Vector2(Math.cos(angle) * magnitude, Math.sin(angle) * magnitude);
    }
}

class GameObject {
    constructor(x, y) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);
        this.rotation = 0;
        this.size = 10;
        this.alive = true;
        this.color = '#fff';
    }

    update(deltaTime) {
        this.position = this.position.add(this.velocity.multiply(deltaTime));
    }

    render(ctx, camera) {
        const screenX = this.position.x - camera.x;
        const screenY = this.position.y - camera.y;
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.restore();
    }

    collidesWith(other) {
        const distance = this.position.distance(other.position);
        return distance < (this.size + other.size) / 2;
    }

    isOffScreen(camera, screenWidth, screenHeight) {
        const screenPos = this.position.subtract(camera);
        return screenPos.x < -this.size || screenPos.x > screenWidth + this.size ||
               screenPos.y < -this.size || screenPos.y > screenHeight + this.size;
    }
}

class Ship extends GameObject {
    constructor(x, y, color = '#ff0000') {
        super(x, y);
        this.color = color;
        this.size = 20;
        this.maxSpeed = 300;
        this.acceleration = 500;
        this.rotationSpeed = 5;
        this.health = 100;
        this.maxHealth = 100;
        this.shootCooldown = 0;
        this.maxShootCooldown = 0.3;
        this.powerUpType = 'normal';
        this.powerUpTimer = 0;
        this.thrust = 0;
    }

    update(deltaTime) {
        // Apply friction in space (minimal)
        this.velocity = this.velocity.multiply(0.98);
        
        // Apply thrust
        if (this.thrust > 0) {
            const thrustVector = Vector2.fromAngle(this.rotation, this.acceleration * deltaTime);
            this.velocity = this.velocity.add(thrustVector);
        }

        // Limit speed
        if (this.velocity.length() > this.maxSpeed) {
            this.velocity = this.velocity.normalize().multiply(this.maxSpeed);
        }

        super.update(deltaTime);

        // Update cooldowns
        if (this.shootCooldown > 0) {
            this.shootCooldown -= deltaTime;
        }

        if (this.powerUpTimer > 0) {
            this.powerUpTimer -= deltaTime;
            if (this.powerUpTimer <= 0) {
                this.powerUpType = 'normal';
            }
        }
    }

    render(ctx, camera) {
        const screenX = this.position.x - camera.x;
        const screenY = this.position.y - camera.y;
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(this.rotation);
        
        // Draw ship
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(15, 0);
        ctx.lineTo(-10, -8);
        ctx.lineTo(-5, 0);
        ctx.lineTo(-10, 8);
        ctx.closePath();
        ctx.fill();

        // Draw thrust
        if (this.thrust > 0) {
            ctx.fillStyle = '#ffaa00';
            ctx.beginPath();
            ctx.moveTo(-10, -4);
            ctx.lineTo(-20, 0);
            ctx.lineTo(-10, 4);
            ctx.closePath();
            ctx.fill();
        }

        // Draw power-up indicator
        if (this.powerUpType !== 'normal') {
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, 25, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();

        // Draw health bar
        const barWidth = 40;
        const barHeight = 4;
        const healthPercent = this.health / this.maxHealth;
        
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(screenX - barWidth/2, screenY - 30, barWidth, barHeight);
        
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(screenX - barWidth/2, screenY - 30, barWidth * healthPercent, barHeight);
    }

    shoot(bullets) {
        if (this.shootCooldown > 0) return;

        this.shootCooldown = this.maxShootCooldown;

        if (this.powerUpType === 'laser') {
            // Triple shot
            for (let i = -1; i <= 1; i++) {
                const bullet = new Bullet(
                    this.position.x,
                    this.position.y,
                    this.rotation + i * 0.2,
                    this.color,
                    this.powerUpType
                );
                bullets.push(bullet);
            }
        } else if (this.powerUpType === 'bigLaser') {
            // Big penetrating laser
            const bullet = new Bullet(
                this.position.x,
                this.position.y,
                this.rotation,
                this.color,
                this.powerUpType
            );
            bullets.push(bullet);
        } else {
            // Normal shot
            const bullet = new Bullet(
                this.position.x,
                this.position.y,
                this.rotation,
                this.color
            );
            bullets.push(bullet);
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
        }
    }

    collectPowerUp(powerUp) {
        this.powerUpType = powerUp.type;
        this.powerUpTimer = powerUp.duration;
    }
}

class Bullet extends GameObject {
    constructor(x, y, angle, color = '#ffff00', type = 'normal') {
        super(x, y);
        this.color = color;
        this.size = type === 'bigLaser' ? 8 : 4;
        this.speed = type === 'bigLaser' ? 400 : 600;
        this.velocity = Vector2.fromAngle(angle, this.speed);
        this.lifeTime = 3;
        this.damage = type === 'bigLaser' ? 30 : 20;
        this.type = type;
        this.penetrating = type === 'bigLaser';
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.lifeTime -= deltaTime;
        if (this.lifeTime <= 0) {
            this.alive = false;
        }
    }

    render(ctx, camera) {
        const screenX = this.position.x - camera.x;
        const screenY = this.position.y - camera.y;
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(this.velocity.angle());
        
        if (this.type === 'bigLaser') {
            ctx.fillStyle = this.color;
            ctx.fillRect(-10, -4, 20, 8);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-8, -2, 16, 4);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(-6, -2, 12, 4);
        }
        
        ctx.restore();
    }
}

class Wall extends GameObject {
    constructor(x, y, width, height, destructible = false) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.destructible = destructible;
        this.color = destructible ? '#8B4513' : '#666666';
        this.health = destructible ? 60 : Infinity;
        this.maxHealth = this.health;
    }

    render(ctx, camera) {
        const screenX = this.position.x - camera.x;
        const screenY = this.position.y - camera.y;
        ctx.fillStyle = this.color;
        ctx.fillRect(screenX - this.width/2, screenY - this.height/2, this.width, this.height);
        
        if (this.destructible && this.health < this.maxHealth) {
            // Show damage
            const damagePercent = 1 - (this.health / this.maxHealth);
            ctx.fillStyle = `rgba(255, 0, 0, ${damagePercent * 0.5})`;
            ctx.fillRect(screenX - this.width/2, screenY - this.height/2, this.width, this.height);
        }
    }

    collidesWith(other) {
        return other.position.x + other.size/2 > this.position.x - this.width/2 &&
               other.position.x - other.size/2 < this.position.x + this.width/2 &&
               other.position.y + other.size/2 > this.position.y - this.height/2 &&
               other.position.y - other.size/2 < this.position.y + this.height/2;
    }

    takeDamage(amount) {
        if (!this.destructible) return false;
        
        this.health -= amount;
        if (this.health <= 0) {
            this.alive = false;
            return true;
        }
        return false;
    }
}

class PowerUp extends GameObject {
    constructor(x, y, type) {
        super(x, y);
        this.type = type;
        this.size = 16;
        this.duration = 10; // seconds
        this.bobOffset = Math.random() * Math.PI * 2;
        this.bobSpeed = 3;
        this.originalY = y;
        
        switch(type) {
            case 'laser':
                this.color = '#00ff00';
                break;
            case 'bigLaser':
                this.color = '#ff00ff';
                break;
            case 'health':
                this.color = '#ff0000';
                break;
        }
    }

    update(deltaTime) {
        // Bob up and down
        this.position.y = this.originalY + Math.sin(Date.now() * 0.003 + this.bobOffset) * 5;
    }

    render(ctx, camera) {
        const screenX = this.position.x - camera.x;
        const screenY = this.position.y - camera.y;
        ctx.save();
        ctx.translate(screenX, screenY);
        
        // Draw power-up
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw icon
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        switch(this.type) {
            case 'laser':
                ctx.fillText('L', 0, 0);
                break;
            case 'bigLaser':
                ctx.fillText('B', 0, 0);
                break;
            case 'health':
                ctx.fillText('+', 0, 0);
                break;
        }
        
        ctx.restore();
    }
}

class AIController {
    constructor(ship, player) {
        this.ship = ship;
        this.player = player;
        this.state = 'hunt';
        this.stateTimer = 0;
        this.lastShot = 0;
        this.avoidanceVector = new Vector2(0, 0);
    }

    update(deltaTime, walls, powerUps) {
        this.stateTimer += deltaTime;
        this.lastShot += deltaTime;

        const distanceToPlayer = this.ship.position.distance(this.player.position);
        const angleToPlayer = this.player.position.subtract(this.ship.position).angle();

        // State machine
        switch(this.state) {
            case 'hunt':
                this.hunt(angleToPlayer, distanceToPlayer, deltaTime);
                if (distanceToPlayer < 200) {
                    this.state = 'attack';
                    this.stateTimer = 0;
                }
                break;
            case 'attack':
                this.attack(angleToPlayer, distanceToPlayer, deltaTime);
                if (distanceToPlayer > 300 || this.stateTimer > 5) {
                    this.state = 'hunt';
                    this.stateTimer = 0;
                }
                break;
        }

        // Avoid walls
        this.avoidWalls(walls, deltaTime);

        // Collect power-ups if nearby
        this.collectPowerUps(powerUps);
    }

    hunt(angleToPlayer, distanceToPlayer, deltaTime) {
        // Move towards player
        const targetRotation = angleToPlayer;
        this.rotateTowards(targetRotation, deltaTime);
        
        if (Math.abs(this.ship.rotation - targetRotation) < 0.5) {
            this.ship.thrust = 1;
        } else {
            this.ship.thrust = 0;
        }
    }

    attack(angleToPlayer, distanceToPlayer, deltaTime) {
        // Aim at player and shoot
        this.rotateTowards(angleToPlayer, deltaTime);
        
        // Strafe around player
        const strafeAngle = angleToPlayer + Math.PI/2;
        const strafeForce = Vector2.fromAngle(strafeAngle, 200 * deltaTime);
        this.ship.velocity = this.ship.velocity.add(strafeForce);
        
        // Shoot if aimed correctly
        if (Math.abs(this.ship.rotation - angleToPlayer) < 0.3 && this.lastShot > 0.5) {
            this.ship.shoot(game.bullets);
            this.lastShot = 0;
        }
    }

    rotateTowards(targetAngle, deltaTime) {
        let angleDiff = targetAngle - this.ship.rotation;
        
        // Normalize angle difference
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        
        const rotationAmount = this.ship.rotationSpeed * deltaTime;
        
        if (Math.abs(angleDiff) < rotationAmount) {
            this.ship.rotation = targetAngle;
        } else {
            this.ship.rotation += angleDiff > 0 ? rotationAmount : -rotationAmount;
        }
    }

    avoidWalls(walls, deltaTime) {
        const avoidDistance = 150; // Increased from 100
        this.avoidanceVector = new Vector2(0, 0);
        
        for (const wall of walls) {
            if (!wall.alive) continue;
            
            const distance = this.ship.position.distance(wall.position);
            if (distance < avoidDistance) {
                const avoidVector = this.ship.position.subtract(wall.position).normalize();
                const strength = (avoidDistance - distance) / avoidDistance;
                this.avoidanceVector = this.avoidanceVector.add(avoidVector.multiply(strength));
            }
        }
        
        if (this.avoidanceVector.length() > 0) {
            // Increased force from 300 to 500
            this.ship.velocity = this.ship.velocity.add(this.avoidanceVector.multiply(500 * deltaTime));
        }
    }

    collectPowerUps(powerUps) {
        for (const powerUp of powerUps) {
            if (!powerUp.alive) continue;
            
            const distance = this.ship.position.distance(powerUp.position);
            if (distance < 100) {
                // Move towards power-up
                const direction = powerUp.position.subtract(this.ship.position).normalize();
                this.ship.velocity = this.ship.velocity.add(direction.multiply(100));
            }
        }
    }
}