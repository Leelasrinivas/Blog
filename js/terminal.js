// Terminal simulation and typing effects for cybersecurity theme
(function() {
    'use strict';
    
    // Terminal simulation class
    class CyberTerminal {
        constructor(element, options = {}) {
            this.element = element;
            this.options = {
                typeSpeed: 50,
                deleteSpeed: 30,
                pauseTime: 1000,
                loop: true,
                showCursor: true,
                cursorChar: '|',
                ...options
            };
            
            this.commands = [];
            this.currentCommandIndex = 0;
            this.isTyping = false;
            this.isPaused = false;
            
            this.init();
        }
        
        init() {
            this.createTerminalStructure();
            this.setupEventListeners();
            this.startSimulation();
        }
        
        createTerminalStructure() {
            const terminalBody = this.element.querySelector('.terminal-body');
            if (!terminalBody) return;
            
            // Clear existing content
            terminalBody.innerHTML = '';
            
            // Create input line
            this.inputLine = document.createElement('div');
            this.inputLine.className = 'terminal-line';
            this.inputLine.innerHTML = '<span class="prompt">root@security:~$</span> <span class="command-text"></span>';
            
            if (this.options.showCursor) {
                this.cursor = document.createElement('span');
                this.cursor.className = 'terminal-cursor';
                this.cursor.textContent = this.options.cursorChar;
                this.inputLine.appendChild(this.cursor);
            }
            
            terminalBody.appendChild(this.inputLine);
            this.commandText = this.inputLine.querySelector('.command-text');
        }
        
        addCommand(command, output = null) {
            this.commands.push({ command, output });
            return this;
        }
        
        addCommands(commandList) {
            commandList.forEach(cmd => {
                if (typeof cmd === 'string') {
                    this.addCommand(cmd);
                } else {
                    this.addCommand(cmd.command, cmd.output);
                }
            });
            return this;
        }
        
        async startSimulation() {
            if (this.commands.length === 0) {
                this.loadDefaultCommands();
            }
            
            while (true) {
                for (let i = 0; i < this.commands.length; i++) {
                    this.currentCommandIndex = i;
                    const { command, output } = this.commands[i];
                    
                    await this.typeCommand(command);
                    await this.pause(this.options.pauseTime);
                    
                    if (output) {
                        await this.showOutput(output);
                        await this.pause(this.options.pauseTime);
                    }
                    
                    await this.clearCommand();
                    await this.pause(500);
                }
                
                if (!this.options.loop) break;
            }
        }
        
        async typeCommand(command) {
            this.isTyping = true;
            this.commandText.textContent = '';
            
            for (let i = 0; i < command.length; i++) {
                if (this.isPaused) {
                    await new Promise(resolve => {
                        const checkPause = () => {
                            if (!this.isPaused) {
                                resolve();
                            } else {
                                setTimeout(checkPause, 100);
                            }
                        };
                        checkPause();
                    });
                }
                
                this.commandText.textContent += command[i];
                await this.delay(this.options.typeSpeed);
            }
            
            this.isTyping = false;
        }
        
        async clearCommand() {
            const text = this.commandText.textContent;
            
            for (let i = text.length; i >= 0; i--) {
                this.commandText.textContent = text.substring(0, i);
                await this.delay(this.options.deleteSpeed);
            }
        }
        
        async showOutput(output) {
            const outputElement = document.createElement('div');
            outputElement.className = 'terminal-output';
            outputElement.style.cssText = `
                color: #00ff00;
                margin: 10px 0;
                font-family: inherit;
                white-space: pre-line;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            this.element.querySelector('.terminal-body').appendChild(outputElement);
            
            // Type output character by character
            for (let i = 0; i < output.length; i++) {
                outputElement.textContent += output[i];
                await this.delay(20);
            }
            
            outputElement.style.opacity = '1';
            
            // Remove output after some time
            setTimeout(() => {
                if (outputElement.parentNode) {
                    outputElement.style.opacity = '0';
                    setTimeout(() => {
                        if (outputElement.parentNode) {
                            outputElement.parentNode.removeChild(outputElement);
                        }
                    }, 300);
                }
            }, 3000);
        }
        
        setupEventListeners() {
            // Pause/resume on click
            this.element.addEventListener('click', () => {
                this.isPaused = !this.isPaused;
                if (this.cursor) {
                    this.cursor.style.animationPlayState = this.isPaused ? 'paused' : 'running';
                }
            });
            
            // Keyboard interactions
            document.addEventListener('keydown', (e) => {
                if (e.key === ' ' && e.target === document.body) {
                    e.preventDefault();
                    this.isPaused = !this.isPaused;
                }
            });
        }
        
        loadDefaultCommands() {
            const cyberCommands = [
                { command: 'nmap -sS -O target.com', output: 'Starting Nmap scan...\nHost is up (0.045s latency)\nPort 22/tcp open ssh\nPort 80/tcp open http\nPort 443/tcp open https' },
                { command: 'sudo metasploit -q', output: 'Metasploit Framework v6.3.5\nmsf6 > ' },
                { command: 'hydra -l admin -P wordlist.txt target.com ssh', output: 'Hydra v9.4 starting at 2024-01-15 10:30:15\nTesting password: admin123\nTesting password: password\n[22][ssh] host: target.com login: admin password: admin123' },
                { command: 'sqlmap -u "http://target.com?id=1" --dbs', output: 'Available databases:\n[*] information_schema\n[*] mysql\n[*] test_db\n[*] users_db' },
                { command: 'burpsuite --headless', output: 'Burp Suite Professional v2024.1\nProxy running on 127.0.0.1:8080\nScanner initialized' },
                { command: 'wireshark -i eth0 -f "tcp port 80"', output: 'Capturing on eth0\nPackets captured: 1,247\nHTTP requests: 89\nSuspicious traffic detected' },
                { command: 'john --wordlist=rockyou.txt hashes.txt', output: 'Loaded 150 password hashes\nCracking in progress...\npassword123 (user1)\nadmin2024 (admin)\nletmein (user2)' },
                { command: 'nikto -h target.com', output: 'Nikto web scanner v2.5.0\nScanning target.com...\n+ Uncommon header found\n+ Directory indexing enabled\n+ Backup files found' },
                { command: 'gobuster dir -u target.com -w wordlist.txt', output: 'Gobuster v3.6\nStarting directory enumeration\n/admin (Status: 200)\n/backup (Status: 403)\n/config (Status: 500)' },
                { command: 'aircrack-ng capture.cap -w wordlist.txt', output: 'Reading packets...\nTesting passphrase: password123\nKEY FOUND! [ MyWiFiPass2024 ]' }
            ];
            
            this.addCommands(cyberCommands);
        }
        
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        pause(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        // Public methods
        stop() {
            this.isPaused = true;
        }
        
        start() {
            this.isPaused = false;
        }
        
        reset() {
            this.currentCommandIndex = 0;
            this.commandText.textContent = '';
        }
    }
    
    // Typing effect class for other elements
    class TypingEffect {
        constructor(element, options = {}) {
            this.element = element;
            this.options = {
                typeSpeed: 50,
                deleteSpeed: 30,
                pauseTime: 2000,
                loop: false,
                showCursor: true,
                cursorChar: '|',
                ...options
            };
            
            this.text = element.dataset.text || element.textContent;
            this.isTyping = false;
            
            this.init();
        }
        
        init() {
            this.element.textContent = '';
            
            if (this.options.showCursor) {
                this.addCursor();
            }
            
            const delay = parseInt(this.element.dataset.delay) || 0;
            setTimeout(() => this.startTyping(), delay);
        }
        
        addCursor() {
            this.cursor = document.createElement('span');
            this.cursor.className = 'typing-cursor';
            this.cursor.textContent = this.options.cursorChar;
            this.cursor.style.cssText = `
                animation: blink 1s infinite;
                color: #00ffff;
            `;
            
            this.element.appendChild(this.cursor);
        }
        
        async startTyping() {
            this.isTyping = true;
            
            await this.typeText();
            
            if (this.options.loop) {
                await this.delay(this.options.pauseTime);
                await this.deleteText();
                await this.delay(500);
                this.startTyping();
            } else if (this.cursor) {
                // Hide cursor after typing is complete
                setTimeout(() => {
                    if (this.cursor && this.cursor.parentNode) {
                        this.cursor.style.opacity = '0';
                    }
                }, 2000);
            }
            
            this.isTyping = false;
        }
        
        async typeText() {
            const textNode = document.createTextNode('');
            this.element.insertBefore(textNode, this.cursor);
            
            for (let i = 0; i < this.text.length; i++) {
                textNode.textContent += this.text[i];
                await this.delay(this.options.typeSpeed);
            }
        }
        
        async deleteText() {
            const textNode = this.element.firstChild;
            if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;
            
            const text = textNode.textContent;
            for (let i = text.length; i >= 0; i--) {
                textNode.textContent = text.substring(0, i);
                await this.delay(this.options.deleteSpeed);
            }
        }
        
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
    
    // Matrix digital rain effect
    class MatrixRain {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()+-=[]{}|;:,.<>?';
            this.fontSize = 14;
            this.columns = Math.floor(canvas.width / this.fontSize);
            this.drops = [];
            
            this.init();
        }
        
        init() {
            this.resizeCanvas();
            this.initDrops();
            this.animate();
            
            window.addEventListener('resize', () => this.resizeCanvas());
        }
        
        resizeCanvas() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.columns = Math.floor(this.canvas.width / this.fontSize);
            this.initDrops();
        }
        
        initDrops() {
            this.drops = [];
            for (let i = 0; i < this.columns; i++) {
                this.drops[i] = Math.floor(Math.random() * -100);
            }
        }
        
        animate() {
            // Semi-transparent background for trail effect
            this.ctx.fillStyle = 'rgba(32, 39, 51, 0.05)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Set text properties
            this.ctx.fillStyle = '#00ffff';
            this.ctx.font = `${this.fontSize}px monospace`;
            this.ctx.textAlign = 'center';
            
            // Draw characters
            for (let i = 0; i < this.drops.length; i++) {
                const char = this.chars[Math.floor(Math.random() * this.chars.length)];
                const x = i * this.fontSize;
                const y = this.drops[i] * this.fontSize;
                
                this.ctx.fillText(char, x, y);
                
                // Reset drop if it goes off screen
                if (y > this.canvas.height && Math.random() > 0.975) {
                    this.drops[i] = 0;
                }
                
                this.drops[i]++;
            }
            
            requestAnimationFrame(() => this.animate());
        }
    }
    
    // Cybersecurity command suggestions
    const cyberCommands = {
        reconnaissance: [
            'nmap -sS -O target.com',
            'whois target.com',
            'dig target.com',
            'fierce -dns target.com',
            'theharvester -d target.com -b google'
        ],
        scanning: [
            'nmap -sV -sC target.com',
            'masscan -p1-10000 target.com',
            'zmap -p 80 10.0.0.0/8',
            'unicornscan target.com'
        ],
        enumeration: [
            'gobuster dir -u target.com -w wordlist.txt',
            'dirb http://target.com',
            'nikto -h target.com',
            'wpscan --url target.com',
            'enum4linux target.com'
        ],
        exploitation: [
            'msfconsole',
            'exploit/multi/handler',
            'use auxiliary/scanner/http/dir_scanner',
            'sqlmap -u "target.com?id=1" --dbs',
            'hydra -l admin -P wordlist.txt target.com ssh'
        ],
        forensics: [
            'volatility -f memory.dmp imageinfo',
            'autopsy case.db',
            'foremost -i disk.img',
            'binwalk firmware.bin',
            'strings suspicious_file'
        ]
    };
    
    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize terminal simulations
        const terminals = document.querySelectorAll('.terminal-window');
        terminals.forEach(terminal => {
            new CyberTerminal(terminal, {
                typeSpeed: 50,
                loop: true,
                showCursor: true
            });
        });
        
        // Initialize typing effects
        const typingElements = document.querySelectorAll('.typing-effect[data-text]');
        typingElements.forEach(element => {
            new TypingEffect(element, {
                typeSpeed: parseInt(element.dataset.speed) || 50,
                loop: element.dataset.loop === 'true'
            });
        });
        
        // Initialize matrix rain
        const matrixCanvas = document.getElementById('matrix-rain');
        if (matrixCanvas) {
            new MatrixRain(matrixCanvas);
        }
        
        // Interactive terminal commands
        document.addEventListener('keydown', function(e) {
            // Ctrl+Alt+T to open interactive terminal
            if (e.ctrlKey && e.altKey && e.key === 't') {
                e.preventDefault();
                openInteractiveTerminal();
            }
        });
    });
    
    // Interactive terminal overlay
    function openInteractiveTerminal() {
        const overlay = document.createElement('div');
        overlay.className = 'terminal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        const terminal = document.createElement('div');
        terminal.className = 'interactive-terminal';
        terminal.style.cssText = `
            width: 80%;
            max-width: 800px;
            height: 60%;
            background: var(--color-bg-secondary);
            border: 2px solid var(--color-cyber-cyan);
            border-radius: var(--border-radius-lg);
            overflow: hidden;
            font-family: var(--font-mono);
        `;
        
        terminal.innerHTML = `
            <div class="terminal-header" style="background: var(--color-bg-tertiary); padding: 1rem; border-bottom: 1px solid var(--color-cyber-cyan);">
                <span style="color: var(--color-cyber-cyan);">Interactive Security Terminal</span>
                <button class="close-terminal" style="float: right; background: var(--color-cyber-red); color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer;">&times;</button>
            </div>
            <div class="terminal-content" style="padding: 1rem; height: calc(100% - 60px); overflow-y: auto; color: var(--color-text-primary);">
                <div class="terminal-output" style="margin-bottom: 1rem; color: var(--color-cyber-green);">
Welcome to Leela's Cybersecurity Terminal
Type 'help' for available commands
                </div>
                <div class="terminal-input-line" style="display: flex; align-items: center;">
                    <span style="color: var(--color-cyber-green); margin-right: 0.5rem;">root@security:~$</span>
                    <input type="text" class="terminal-input" style="flex: 1; background: transparent; border: none; color: var(--color-text-primary); font-family: inherit; outline: none;" autofocus>
                </div>
            </div>
        `;
        
        overlay.appendChild(terminal);
        document.body.appendChild(overlay);
        
        // Terminal functionality
        const terminalInput = terminal.querySelector('.terminal-input');
        const terminalOutput = terminal.querySelector('.terminal-output');
        const closeBtn = terminal.querySelector('.close-terminal');
        
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
        
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim();
                if (command) {
                    processCommand(command, terminalOutput);
                    terminalInput.value = '';
                }
            }
        });
        
        // Command processing
        function processCommand(command, output) {
            const response = getCommandResponse(command);
            const commandDiv = document.createElement('div');
            commandDiv.style.marginBottom = '0.5rem';
            commandDiv.innerHTML = `
                <div style="color: var(--color-cyber-green);">root@security:~$ ${command}</div>
                <div style="color: var(--color-text-secondary); margin-left: 1rem;">${response}</div>
            `;
            output.appendChild(commandDiv);
            output.scrollTop = output.scrollHeight;
        }
        
        function getCommandResponse(command) {
            const cmd = command.toLowerCase();
            
            if (cmd === 'help') {
                return `Available commands:
- nmap: Network scanning
- hydra: Password cracking
- sqlmap: SQL injection testing
- burp: Web application testing
- metasploit: Exploitation framework
- wireshark: Network analysis
- volatility: Memory forensics
- about: About Leela Srinivas
- skills: Technical skills
- contact: Contact information
- clear: Clear terminal`;
            }
            
            if (cmd === 'clear') {
                output.innerHTML = '<div style="color: var(--color-cyber-green);">Terminal cleared</div>';
                return '';
            }
            
            if (cmd === 'about') {
                return `Leela Srinivas Atla - Cybersecurity Expert
Experience: 2+ years in Penetration Testing
Specializations: VAPT, Red Teaming, Digital Forensics
Contact: leelasrinivasatla@gmail.com`;
            }
            
            if (cmd === 'skills') {
                return `Technical Skills:
• Penetration Testing: Burp Suite, Metasploit, Nmap
• Digital Forensics: EnCase, FTK, Autopsy
• SIEM: Splunk, ElasticSearch, Wazuh
• Programming: Python, Bash Scripting
• Cloud Security: AWS, Azure`;
            }
            
            if (cmd === 'contact') {
                return `Contact Information:
Email: leelasrinivasatla@gmail.com
Phone: +91-9885787799
Location: Tirupati, Andhra Pradesh`;
            }
            
            if (cmd.startsWith('nmap')) {
                return `Starting Nmap scan...
Host is up (0.045s latency)
Interesting ports on target:
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
Scan completed in 2.5 seconds`;
            }
            
            if (cmd.startsWith('hydra')) {
                return `Hydra password attack starting...
[ATTEMPT] target:22 login "admin" password "123456"
[ATTEMPT] target:22 login "admin" password "password"
[22][ssh] host: target login: admin password: admin123
1 of 1 target successfully completed`;
            }
            
            return `Command '${command}' not found. Type 'help' for available commands.`;
        }
    }
    
    // Export classes for external use
    window.CyberTerminal = CyberTerminal;
    window.TypingEffect = TypingEffect;
    window.MatrixRain = MatrixRain;
    
})();
