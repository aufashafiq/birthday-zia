interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    rotationSpeed: number;
    life: number;
    maxLife: number;
    type: "confetti" | "sparkle" | "star";
    shape: "rect" | "circle" | "triangle";
}

const COLORS = [
    "#e8729a", // pink
    "#f06292", // rose
    "#ffb74d", // orange
    "#fff176", // yellow
    "#81c784", // green
    "#64b5f6", // blue
    "#ba68c8", // purple
    "#ff8a65", // coral
    "#4dd0e1", // cyan
    "#aed581", // light green
];

export function createConfettiBurst(
    canvas: HTMLCanvasElement,
    x: number,
    y: number
): (() => void) | undefined {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: Particle[] = [];
    const particleCount = 120;
    const shapes: Array<"rect" | "circle" | "triangle"> = ["rect", "circle", "triangle"];

    // Create confetti particles with explosion pattern
    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
        const velocity = 6 + Math.random() * 14;
        const isSparkle = Math.random() > 0.8;
        const isStar = !isSparkle && Math.random() > 0.85;

        particles.push({
            x,
            y,
            vx: Math.cos(angle) * velocity * (0.5 + Math.random()),
            vy: Math.sin(angle) * velocity * (0.5 + Math.random()) - 4,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            size: isSparkle ? 3 + Math.random() * 4 : isStar ? 6 + Math.random() * 4 : 6 + Math.random() * 10,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.4,
            life: 0,
            maxLife: 80 + Math.random() * 60,
            type: isSparkle ? "sparkle" : isStar ? "star" : "confetti",
            shape: shapes[Math.floor(Math.random() * shapes.length)],
        });
    }

    let animationId: number;

    function drawStar(ctx: CanvasRenderingContext2D, size: number) {
        const spikes = 5;
        const outerRadius = size;
        const innerRadius = size / 2;

        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI / spikes) * i - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
    }

    function animate() {
        ctx!.clearRect(0, 0, canvas.width, canvas.height);

        let activeParticles = 0;

        particles.forEach((p) => {
            if (p.life >= p.maxLife) return;

            activeParticles++;
            p.life++;

            // Physics
            p.vy += 0.25; // gravity
            p.vx *= 0.985; // air resistance
            p.vy *= 0.985;

            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;

            // Fade out
            const lifeRatio = p.life / p.maxLife;
            const alpha = lifeRatio < 0.7 ? 1 : 1 - (lifeRatio - 0.7) / 0.3;

            ctx!.save();
            ctx!.translate(p.x, p.y);
            ctx!.rotate(p.rotation);
            ctx!.globalAlpha = alpha;
            ctx!.fillStyle = p.color;

            if (p.type === "sparkle") {
                // Draw sparkle with glow
                ctx!.shadowColor = p.color;
                ctx!.shadowBlur = 8;
                ctx!.beginPath();
                ctx!.arc(0, 0, p.size, 0, Math.PI * 2);
                ctx!.fill();
            } else if (p.type === "star") {
                ctx!.shadowColor = p.color;
                ctx!.shadowBlur = 6;
                drawStar(ctx!, p.size);
            } else {
                // Draw confetti based on shape
                if (p.shape === "rect") {
                    ctx!.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                } else if (p.shape === "circle") {
                    ctx!.beginPath();
                    ctx!.arc(0, 0, p.size / 3, 0, Math.PI * 2);
                    ctx!.fill();
                } else {
                    ctx!.beginPath();
                    ctx!.moveTo(0, -p.size / 2);
                    ctx!.lineTo(p.size / 2, p.size / 2);
                    ctx!.lineTo(-p.size / 2, p.size / 2);
                    ctx!.closePath();
                    ctx!.fill();
                }
            }

            ctx!.restore();
        });

        if (activeParticles > 0) {
            animationId = requestAnimationFrame(animate);
        }
    }

    animate();

    return () => {
        cancelAnimationFrame(animationId);
    };
}

export function createSparkleEffect(
    canvas: HTMLCanvasElement,
    duration: number = 3000
): (() => void) | undefined {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sparkles: Particle[] = [];
    const startTime = Date.now();

    function addSparkle() {
        sparkles.push({
            x: Math.random() * canvas.width,
            y: canvas.height + 10,
            vx: (Math.random() - 0.5) * 2,
            vy: -1.5 - Math.random() * 2,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            size: 2 + Math.random() * 5,
            rotation: 0,
            rotationSpeed: 0,
            life: 0,
            maxLife: 60 + Math.random() * 50,
            type: "sparkle",
            shape: "circle",
        });
    }

    let animationId: number;

    function animate() {
        const elapsed = Date.now() - startTime;
        if (elapsed > duration) {
            ctx!.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        ctx!.clearRect(0, 0, canvas.width, canvas.height);

        // Add new sparkles
        if (Math.random() > 0.5) {
            addSparkle();
        }

        sparkles.forEach((p, index) => {
            p.life++;
            p.x += p.vx;
            p.y += p.vy;

            if (p.life >= p.maxLife) {
                sparkles.splice(index, 1);
                return;
            }

            const alpha = Math.sin((p.life / p.maxLife) * Math.PI);

            ctx!.save();
            ctx!.globalAlpha = alpha;
            ctx!.fillStyle = p.color;
            ctx!.shadowColor = p.color;
            ctx!.shadowBlur = 12;
            ctx!.beginPath();
            ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx!.fill();
            ctx!.restore();
        });

        animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
        cancelAnimationFrame(animationId);
    };
}
