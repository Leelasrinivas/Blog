// Particles.js configuration for cybersecurity theme
(function() {
    'use strict';
    
    // Initialize particles when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeParticles();
    });
    
    function initializeParticles() {
        if (typeof particlesJS === 'undefined') {
            // Fallback: Create custom particle system
            createCustomParticleSystem();
            return;
        }
        
        // Configure particles.js
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": window.innerWidth <= 768 ? 30 : 50,
                    "density": {
                        "enable": true,
                        "value_area": 1000
                    }
                },
                "color": {
                    "value": ["#00ffff", "#ff00ff", "#0080ff", "#00ff80"]
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 6
                    },
                    "image": {
                        "src": "img/github.svg",
                        "width": 100,
                        "height": 100
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#00ffff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "repulse"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }
    
    // Custom particle system fallback
    function createCustomParticleSystem() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const container = document.getElementById('particles-js');
        
        if (!container) return;
        
        // Setup canvas
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-2';
        
        container.appendChild(canvas);
        
        let particles = [];
        let animationId;
        
        // Particle class
        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
                this.fadeDelay = Math.random() * 600 + 100;
                this.fadeStart = Date.now() + this.fadeDelay;
                this.fadingOut = false;
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.life = Math.random() * 0.3 + 0.1;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.size = Math.random() * 3 + 1;
                
                // Cybersecurity theme colors
                const colors = ['#00ffff', '#ff00ff', '#0080ff', '#00ff80'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                // Boundary checking
                if (this.x < 0 || this.x > canvas.width) {
                    this.vx = -this.vx;
                }
                if (this.y < 0 || this.y > canvas.height) {
                    this.vy = -this.vy;
                }
                
                // Keep particles within bounds
                this.x = Math.max(0, Math.min(canvas.width, this.x));
                this.y = Math.max(0, Math.min(canvas.height, this.y));
                
                // Fade effect
                if (Date.now() > this.fadeStart) {
                    this.fadingOut = true;
                }
                
                if (this.fadingOut) {
                    this.opacity -= 0.008;
                    if (this.opacity <= 0) {
                        this.reset();
                        this.fadeDelay = Math.random() * 600 + 100;
                        this.fadeStart = Date.now() + this.fadeDelay;
                        this.fadingOut = false;
                    }
                }
            }
            
            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
        }
        
        // Connection lines between particles
        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        const opacity = (150 - distance) / 150 * 0.5;
                        ctx.save();
                        ctx.globalAlpha = opacity;
                        ctx.strokeStyle = '#00ffff';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }
        }
        
        // Resize canvas
        function resizeCanvas() {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        }
        
        // Initialize particles
        function initParticles() {
            particles = [];
            const baseCount = Math.floor((canvas.width * canvas.height) / 15000);
            const particleCount = window.innerWidth <= 768 ? Math.min(baseCount, 20) : Math.min(baseCount, 40);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Draw connections
            drawConnections();
            
            animationId = requestAnimationFrame(animate);
        }
        
        // Mouse interaction
        let mouse = { x: 0, y: 0 };
        
        container.addEventListener('mousemove', function(e) {
            const rect = container.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            
            // Repulse particles from mouse
            particles.forEach(particle => {
                const dx = particle.x - mouse.x;
                const dy = particle.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.vx += (dx / distance) * force * 0.5;
                    particle.vy += (dy / distance) * force * 0.5;
                }
            });
        });
        
        // Click to add particles
        container.addEventListener('click', function(e) {
            const rect = container.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            for (let i = 0; i < 5; i++) {
                const particle = new Particle();
                particle.x = clickX + (Math.random() - 0.5) * 20;
                particle.y = clickY + (Math.random() - 0.5) * 20;
                particles.push(particle);
            }
            
            // Remove excess particles
            if (particles.length > 100) {
                particles.splice(0, particles.length - 100);
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            resizeCanvas();
            initParticles();
        });
        
        // Start the system
        resizeCanvas();
        initParticles();
        animate();
        
        // Cleanup function
        return function cleanup() {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            if (canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
        };
    }
    
    // Cybersecurity-themed particle presets
    window.CyberParticles = {
        // Firewall simulation
        firewall: function() {
            if (typeof particlesJS !== 'undefined') {
                particlesJS('particles-js', {
                    "particles": {
                        "number": { "value": 50 },
                        "color": { "value": "#ff4444" },
                        "shape": { "type": "triangle" },
                        "size": { "value": 4 },
                        "move": {
                            "enable": true,
                            "speed": 3,
                            "direction": "top"
                        },
                        "line_linked": {
                            "enable": true,
                            "color": "#ff4444",
                            "opacity": 0.6
                        }
                    }
                });
            }
        },
        
        // Data flow simulation
        dataFlow: function() {
            if (typeof particlesJS !== 'undefined') {
                particlesJS('particles-js', {
                    "particles": {
                        "number": { "value": 100 },
                        "color": { "value": "#00ff00" },
                        "shape": { "type": "circle" },
                        "size": { "value": 2 },
                        "move": {
                            "enable": true,
                            "speed": 5,
                            "direction": "right"
                        },
                        "line_linked": {
                            "enable": false
                        }
                    }
                });
            }
        },
        
        // Network topology
        network: function() {
            if (typeof particlesJS !== 'undefined') {
                particlesJS('particles-js', {
                    "particles": {
                        "number": { "value": 60 },
                        "color": { "value": "#0080ff" },
                        "shape": { "type": "polygon", "polygon": { "nb_sides": 6 } },
                        "size": { "value": 5 },
                        "move": {
                            "enable": true,
                            "speed": 1
                        },
                        "line_linked": {
                            "enable": true,
                            "distance": 200,
                            "color": "#0080ff",
                            "opacity": 0.8,
                            "width": 2
                        }
                    }
                });
            }
        }
    };
    
    // Performance monitoring
    let frameCount = 0;
    let lastTime = performance.now();
    
    function monitorPerformance() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            // Adjust particle count based on performance
            if (fps < 30 && typeof pJSDom !== 'undefined' && pJSDom[0]) {
                const particleCount = pJSDom[0].pJS.particles.number.value;
                if (particleCount > 20) {
                    pJSDom[0].pJS.particles.number.value = Math.max(20, particleCount - 10);
                    pJSDom[0].pJS.fn.particlesCreate();
                }
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(monitorPerformance);
    }
    
    // Start performance monitoring
    requestAnimationFrame(monitorPerformance);
    
    // Reduce particles on mobile devices
    if (window.innerWidth <= 768) {
        // Mobile optimization will be handled in the main configuration
    }
    
})();
