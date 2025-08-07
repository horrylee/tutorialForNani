class Firework {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = 4; // 增加速度
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.velocity = {
            x: Math.cos(this.angle) * this.speed,
            y: Math.sin(this.angle) * this.speed
        };
        this.particles = [];
        this.alive = true;
        // 使用更豐富的顏色範圍
        this.hue = Math.random() * 360; // 全色譜
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // 檢查是否到達目標
        const distance = Math.hypot(this.targetX - this.x, this.targetY - this.y);
        if (distance < 5) {
            this.explode();
            this.alive = false;
        }
    }

    explode() {
        const particleCount = 60; // 增加粒子數量
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(
                this.x,
                this.y,
                this.hue + (Math.random() - 0.5) * 60 // 更大的顏色變化範圍
            ));
        }
    }

    draw(ctx) {
        if (this.alive) {
            // 煙火尾跡效果
            ctx.beginPath();
            ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${this.hue}, 80%, 70%)`;
            ctx.fill();
            
            // 添加光暈效果
            ctx.beginPath();
            ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, 0.4)`;
            ctx.fill();
        }

        // 繪製粒子
        this.particles.forEach((particle, index) => {
            particle.update();
            particle.draw(ctx);
            if (particle.alpha <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }
}

class Particle {
    constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.hue = hue;
        this.alpha = 1;
        this.decay = 0.006; // 降低衰減速度，讓粒子存在更久
        this.gravity = 0.03; // 降低重力，讓粒子飄得更久
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.size = Math.random() * 10 + 5; // 增大粒子尺寸
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.3;
    }

    update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
        this.rotation += this.rotationSpeed;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // 插畫風格的粒子 - 使用多邊形而不是圓形
        const sides = Math.floor(Math.random() * 4) + 3; // 3-6邊形
        ctx.beginPath();
        
        if (sides === 3) {
            // 三角形
            ctx.moveTo(0, -this.size);
            ctx.lineTo(-this.size * 0.866, this.size * 0.5);
            ctx.lineTo(this.size * 0.866, this.size * 0.5);
        } else if (sides === 4) {
            // 菱形
            ctx.moveTo(0, -this.size);
            ctx.lineTo(this.size, 0);
            ctx.lineTo(0, this.size);
            ctx.lineTo(-this.size, 0);
        } else if (sides === 5) {
            // 五角星
            for (let i = 0; i < 10; i++) {
                const angle = (i * Math.PI * 2) / 10;
                const radius = i % 2 === 0 ? this.size : this.size * 0.4;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
        } else {
            // 六邊形
            for (let i = 0; i < sides; i++) {
                const angle = (i * Math.PI * 2) / sides;
                const x = Math.cos(angle) * this.size;
                const y = Math.sin(angle) * this.size;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
        }
        
        ctx.closePath();
        
        // 使用更豐富的顏色
        const saturation = 70 + Math.random() * 30; // 70-100% 飽和度
        const lightness = 65 + Math.random() * 25; // 65-90% 亮度
        ctx.fillStyle = `hsl(${this.hue}, ${saturation}%, ${lightness}%)`;
        ctx.fill();
        
        // 添加邊框效果
        ctx.strokeStyle = `hsl(${this.hue}, ${saturation}%, ${lightness - 15}%)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.restore();
    }
}

// 星星類
class Star {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.alpha = Math.random() * 0.8 + 0.2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        this.twinklePhase = Math.random() * Math.PI * 2;
    }

    update() {
        this.twinklePhase += this.twinkleSpeed;
        this.alpha = 0.2 + Math.sin(this.twinklePhase) * 0.6;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        // 繪製星星
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        
        // 添加光暈
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();
        
        ctx.restore();
    }
}

// 月亮類
class Moon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 60;
        this.alpha = 0.9;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        // 繪製月亮主體
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
        
        // 添加月亮光暈
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();
        
        // 繪製月亮陰影（簡單的圓形陰影）
        ctx.beginPath();
        ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.2, this.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fill();
        
        ctx.restore();
    }
}

// 初始化畫布
const canvas = document.getElementById('fireworks-canvas');
const ctx = canvas.getContext('2d');

// 設定畫布尺寸
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 煙火陣列
let fireworks = [];
// 星星陣列
let stars = [];
// 月亮
let moon = null;

// 初始化星星
function initStars() {
    stars = [];
    const starCount = 100; // 增加星星數量
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star(
            Math.random() * canvas.width,
            Math.random() * canvas.height * 0.7 // 只在上半部分生成星星
        ));
    }
}

// 初始化月亮
function initMoon() {
    moon = new Moon(
        canvas.width * 0.8, // 右上角
        canvas.height * 0.15
    );
}

// 初始化背景元素
initStars();
initMoon();

// 動畫循環
function animate() {
    // 使用更柔和的背景清除效果
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 繪製月亮
    if (moon) {
        moon.draw(ctx);
    }

    // 更新和繪製星星
    stars.forEach(star => {
        star.update();
        star.draw(ctx);
    });

    // 更新和繪製煙火
    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw(ctx);
        
        // 移除已完成的煙火（當粒子完全消失時）
        if (!firework.alive && firework.particles.length === 0) {
            fireworks.splice(index, 1);
        }
    });

    // 自動生成煙火（增加頻率）
    if (Math.random() < 0.03) { // 增加自動煙火頻率
        const startX = Math.random() * canvas.width;
        const startY = canvas.height;
        const targetX = Math.random() * canvas.width;
        const targetY = Math.random() * canvas.height * 0.7;
        
        const newFirework = new Firework(startX, startY, targetX, targetY);
        fireworks.push(newFirework);
    }

    requestAnimationFrame(animate);
}

// 點擊事件處理
function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 從底部隨機位置發射煙火
    const startX = Math.random() * canvas.width;
    const startY = canvas.height;
    
    const newFirework = new Firework(startX, startY, x, y);
    fireworks.push(newFirework);
    
    // 點擊時額外生成多個煙火
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const extraStartX = Math.random() * canvas.width;
            const extraStartY = canvas.height;
            const extraTargetX = x + (Math.random() - 0.5) * 100;
            const extraTargetY = y + (Math.random() - 0.5) * 100;
            
            const extraFirework = new Firework(extraStartX, extraStartY, extraTargetX, extraTargetY);
            fireworks.push(extraFirework);
        }, i * 200);
    }
}

// 在 canvas 和 body 上都添加點擊事件
canvas.addEventListener('click', handleClick);
document.body.addEventListener('click', handleClick);

// 開始動畫
animate(); 