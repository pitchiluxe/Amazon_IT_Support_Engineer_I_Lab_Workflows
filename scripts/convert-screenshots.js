const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const screenshotsDir = path.join(__dirname, '..', 'public', 'screenshots');
const screenshots = [
  'dashboard',
  'lab-interface',
  'ai-tutor',
  'incidents',
  'network',
  'skills'
];

// Icon logo to add to corner of each screenshot
const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <defs>
    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#0066CC"/>
      <stop offset="100%" style="stop-color:#0052A3"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="32" fill="url(#logoGrad)"/>
  <text x="128" y="170" text-anchor="middle" font-family="Arial" font-size="80" font-weight="bold" fill="white">IT</text>
  <text x="128" y="210" text-anchor="middle" font-family="Arial" font-size="24" fill="rgba(255,255,255,0.8)">SUPPORT</text>
</svg>
`;

// Create logo image
function createLogo() {
  const canvas = createCanvas(64, 64);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 64);
  gradient.addColorStop(0, '#0066CC');
  gradient.addColorStop(1, '#0052A3');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(0, 0, 64, 64, 12);
  ctx.fill();

  // Text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('IT', 32, 42);

  return canvas;
}

// Process each screenshot
function processScreenshots() {
  console.log('Converting SVG screenshots to PNG...\n');

  for (const name of screenshots) {
    const svgPath = path.join(screenshotsDir, `${name}.svg`);
    const pngPath = path.join(screenshotsDir, `${name}.png`);

    if (fs.existsSync(svgPath)) {
      try {
        // Read SVG content
        let svgContent = fs.readFileSync(svgPath, 'utf8');

        // Get dimensions from SVG
        const widthMatch = svgContent.match(/width="(\d+)"/);
        const heightMatch = svgContent.match(/height="(\d+)"/);
        const width = widthMatch ? parseInt(widthMatch[1]) : 1200;
        const height = heightMatch ? parseInt(heightMatch[1]) : 800;

        // Create canvas with exact dimensions
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Fill background
        ctx.fillStyle = '#0b1020';
        ctx.fillRect(0, 0, width, height);

        // Draw background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#0b1020');
        gradient.addColorStop(1, '#1a1f3a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Draw placeholder UI elements based on screenshot type
        if (name === 'dashboard') {
          drawDashboard(ctx, width, height);
        } else if (name === 'lab-interface') {
          drawLabInterface(ctx, width, height);
        } else if (name === 'ai-tutor') {
          drawAiTutor(ctx, width, height);
        } else if (name === 'incidents') {
          drawIncidents(ctx, width, height);
        } else if (name === 'network') {
          drawNetwork(ctx, width, height);
        } else if (name === 'skills') {
          drawSkills(ctx, width, height);
        }

        // Add watermark/logo
        const logo = createLogo();
        ctx.drawImage(logo, width - 80, height - 80, 64, 64);

        // Save PNG
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(pngPath, buffer);
        console.log(`✓ Created: ${name}.png (${width}x${height})`);

        // Also copy SVG for reference
        console.log(`✓ Keeping: ${name}.svg`);

      } catch (error) {
        console.error(`✗ Error processing ${name}:`, error.message);
      }
    } else {
      console.warn(`⚠ Missing: ${name}.svg`);
    }
  }

  console.log('\nScreenshot conversion complete!');
}

// Draw functions for each screenshot type
function drawDashboard(ctx, w, h) {
  // Sidebar
  ctx.fillStyle = '#0f1428';
  ctx.fillRect(0, 0, 240, h);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px Arial';
  ctx.fillText('IT Support Lab', 20, 40);

  // Sidebar items
  ctx.fillStyle = '#9ca3af';
  ctx.font = '14px Arial';
  const sidebarItems = ['📊 Dashboard', '🧪 Labs (22)', '🚨 Incidents', '🌐 Network', '💻 Assets', '📚 SOPs', '📋 Projects', '🤖 AI Tutor', '🎯 Roadmap', '⚡ Skills', '📁 Portfolio', '🎤 Interview'];
  sidebarItems.forEach((item, i) => {
    ctx.fillText(item, 20, 100 + i * 30);
  });

  // Main header
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 28px Arial';
  ctx.fillText('Welcome back, IT Engineer', 280, 60);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '14px Arial';
  ctx.fillText('Continue your training journey', 280, 90);

  // Stats cards
  const stats = [
    { value: '68%', label: 'Labs Complete', color: '#3b82f6', progress: 0.68 },
    { value: '89%', label: 'Avg Score', color: '#10b981', progress: 0.89 },
    { value: '15', label: 'Day Streak', color: '#f59e0b', progress: 0.76 },
    { value: '2,450', label: 'Total Points', color: '#8b5cf6', progress: 0.8 }
  ];

  stats.forEach((stat, i) => {
    const x = 280 + i * 180;
    const y = 140;

    ctx.fillStyle = '#1a1f3a';
    roundRect(ctx, x, y, 160, 180, 12);
    ctx.fill();

    // Progress ring
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(x + 80, y + 80, 50, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = stat.color;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(x + 80, y + 80, 50, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * stat.progress);
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(stat.value, x + 80, y + 85);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#9ca3af';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(stat.label, x + 80, y + 160);
    ctx.textAlign = 'left';
  });

  // Next Lab card
  ctx.fillStyle = '#1a1f3a';
  roundRect(ctx, 280, 360, 400, 200, 12);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px Arial';
  ctx.fillText('Next Lab', 300, 400);

  ctx.fillStyle = '#3b82f6';
  ctx.font = 'bold 20px Arial';
  ctx.fillText('Lab 14: High Availability', 300, 440);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '14px Arial';
  ctx.fillText('Configure clustering and failover', 300, 470);

  ctx.fillStyle = '#3b82f6';
  roundRect(ctx, 300, 510, 120, 35, 6);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Start Lab →', 360, 533);
  ctx.textAlign = 'left';
}

function drawLabInterface(ctx, w, h) {
  // Simplified lab interface
  ctx.fillStyle = '#0f1428';
  ctx.fillRect(0, 0, 240, h);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px Arial';
  ctx.fillText('IT Support Lab', 20, 40);

  // Header
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('Lab 14: High Availability', 280, 60);

  // Scenario box
  ctx.fillStyle = '#1a1f3a';
  roundRect(ctx, 280, 100, 880, 140, 12);
  ctx.fill();

  ctx.fillStyle = '#3b82f6';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('SCENARIO', 300, 130);

  ctx.fillStyle = '#e5e7eb';
  ctx.font = '14px Arial';
  ctx.fillText('A primary file server has become unresponsive.', 300, 160);
  ctx.fillText('Picking operations are halted. Failover required.', 300, 185);

  // Tasks
  ctx.fillStyle = '#1a1f3a';
  roundRect(ctx, 280, 260, 540, 420, 12);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px Arial';
  ctx.fillText('✓ Tasks', 300, 290);

  const tasks = [
    { text: 'Check failover cluster status', done: true },
    { text: 'Identify primary node failure', done: true },
    { text: 'Move cluster resources to node B', done: true },
    { text: 'Verify services are online on node B', done: false },
    { text: 'Update DNS records if needed', done: false },
    { text: 'Test application connectivity', done: false },
    { text: 'Document incident in ticket system', done: false }
  ];

  tasks.forEach((task, i) => {
    const y = 320 + i * 40;
    ctx.fillStyle = task.done ? '#10b981' : '#374151';
    roundRect(ctx, 300, y, 18, 18, 3);
    ctx.fill();

    ctx.fillStyle = task.done ? '#9ca3af' : '#fff';
    ctx.font = '13px Arial';
    ctx.fillText(task.text, 330, y + 14);
  });

  // Incident details
  ctx.fillStyle = '#1a1f3a';
  roundRect(ctx, 840, 260, 320, 420, 12);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px Arial';
  ctx.fillText('🚨 Incident #P1-2401', 860, 290);

  ctx.fillStyle = '#ef4444';
  roundRect(ctx, 860, 310, 50, 20, 4);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('P1', 885, 324);
  ctx.textAlign = 'left';

  ctx.fillStyle = '#9ca3af';
  ctx.font = '12px Arial';
  ctx.fillText('SLA', 860, 360);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px Arial';
  ctx.fillText('12:34 remaining', 860, 380);
}

function drawAiTutor(ctx, w, h) {
  ctx.fillStyle = '#0f1428';
  ctx.fillRect(0, 0, 240, h);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px Arial';
  ctx.fillText('IT Support Lab', 20, 40);

  // Header
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('🤖 AI Tutor', 280, 60);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '14px Arial';
  ctx.fillText('Socratic learning — I guide, you discover', 280, 85);

  // Connection status
  ctx.fillStyle = '#1a1f3a';
  roundRect(ctx, 800, 35, 150, 30, 15);
  ctx.fill();

  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(815, 50, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#9ca3af';
  ctx.font = '12px Arial';
  ctx.fillText('Ollama • Connected', 830, 55);

  // Chat container
  ctx.fillStyle = '#1a1f3a';
  roundRect(ctx, 280, 120, 880, 580, 12);
  ctx.fill();

  // Messages
  // User message
  ctx.fillStyle = '#3b82f6';
  roundRect(ctx, 600, 150, 340, 60, 12);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = '13px Arial';
  ctx.fillText('How do I configure VLAN routing?', 620, 180);

  // AI response
  ctx.fillStyle = '#252d4a';
  roundRect(ctx, 300, 240, 500, 120, 12);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.font = '14px Arial';
  ctx.fillText('Great question! Let me ask you first:', 320, 270);

  ctx.fillStyle = '#fbbf24';
  ctx.fillText('What do you know about how VLANs', 320, 300);
  ctx.fillText('isolate traffic between broadcast domains?', 320, 325);

  // Input area
  ctx.fillStyle = '#252d4a';
  roundRect(ctx, 300, 620, 840, 50, 8);
  ctx.fill();

  ctx.fillStyle = '#6b7280';
  ctx.font = '14px Arial';
  ctx.fillText('Ask a question or paste error logs...', 330, 650);

  ctx.fillStyle = '#3b82f6';
  roundRect(ctx, 1040, 625, 70, 30, 6);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Send', 1075, 645);
  ctx.textAlign = 'left';
}

function drawIncidents(ctx, w, h) {
  ctx.fillStyle = '#0f1428';
  ctx.fillRect(0, 0, 240, h);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px Arial';
  ctx.fillText('IT Support Lab', 20, 40);

  // Header
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('🚨 Incident Queue', 280, 60);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '14px Arial';
  ctx.fillText('4 active incidents • 2 critical', 280, 85);

  // Incidents
  const incidents = [
    { id: 'INC-2024-001', priority: 'P1', title: 'Warehouse DC - Complete outage', sla: '00:42', color: '#ef4444' },
    { id: 'INC-2024-002', priority: 'P2', title: 'Print server queue overflow', sla: 'On Track', color: '#f97316' },
    { id: 'INC-2024-003', priority: 'P2', title: 'AD replication failure site-2', sla: 'On Track', color: '#f97316' },
    { id: 'INC-2024-004', priority: 'P3', title: 'VPN slow on MacBooks', sla: 'Next shift', color: '#eab308' }
  ];

  incidents.forEach((inc, i) => {
    const y = 130 + i * 120;

    ctx.fillStyle = '#1a1f3a';
    roundRect(ctx, 280, y, 880, 100, 8);
    ctx.fill();

    // Priority indicator
    ctx.fillStyle = inc.color;
    roundRect(ctx, 280, y, 6, 100, 3);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(inc.id, 305, y + 30);

    // Priority badge
    ctx.fillStyle = inc.color;
    roundRect(ctx, 305, y + 40, 40, 20, 4);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(inc.priority, 325, y + 54);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#9ca3af';
    ctx.font = '12px Arial';
    ctx.fillText(inc.title, 360, y + 54);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '12px Arial';
    ctx.fillText('SLA: ' + inc.sla, 305, y + 80);
  });
}

function drawNetwork(ctx, w, h) {
  ctx.fillStyle = '#0f1428';
  ctx.fillRect(0, 0, 240, h);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px Arial';
  ctx.fillText('IT Support Lab', 20, 40);

  // Header
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('🌐 Network Topology', 280, 60);

  // Network diagram background
  ctx.fillStyle = '#1a1f3a';
  roundRect(ctx, 280, 100, 880, 640, 12);
  ctx.fill();

  // Internet cloud
  ctx.fillStyle = '#3b82f6';
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.ellipse(720, 130, 60, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.font = '11px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Internet', 720, 135);
  ctx.textAlign = 'left';

  // Firewall
  ctx.fillStyle = '#ef4444';
  roundRect(ctx, 670, 200, 100, 40, 6);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('🔥 Firewall', 720, 225);
  ctx.textAlign = 'left';

  // Core switch
  ctx.fillStyle = '#8b5cf6';
  roundRect(ctx, 670, 300, 100, 50, 6);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.fillText('Core Switch', 720, 330);
  ctx.textAlign = 'left';

  // Distribution switches
  const distSwitches = [
    { x: 380, label: 'Dist Switch A' },
    { x: 670, label: 'Dist Switch B' },
    { x: 960, label: 'Dist Switch C' }
  ];

  distSwitches.forEach(sw => {
    ctx.fillStyle = '#06b6d4';
    roundRect(ctx, sw.x, 420, 120, 50, 6);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(sw.label, sw.x + 60, 450);
    ctx.textAlign = 'left';
  });

  // Servers
  const servers = [
    { x: 250, label: 'Server A', ip: '10.1.1.10' },
    { x: 380, label: 'Server B', ip: '10.1.1.11' },
    { x: 510, label: 'Server C', ip: '10.1.1.12' }
  ];

  servers.forEach(srv => {
    ctx.fillStyle = '#10b981';
    roundRect(ctx, srv.x, 540, 100, 60, 6);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(srv.label, srv.x + 50, 560);
    ctx.font = '9px Arial';
    ctx.fillText(srv.ip, srv.x + 50, 580);
  });

  // End devices
  const devices = [
    { x: 670, label: 'Workstations', sub: '40 devices' },
    { x: 800, label: 'Printers', sub: '12 devices' },
    { x: 930, label: 'Scanners', sub: '25 devices' }
  ];

  devices.forEach(dev => {
    ctx.fillStyle = '#f59e0b';
    roundRect(ctx, dev.x, 540, 100, 60, 6);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(dev.label, dev.x + 50, 560);
    ctx.font = '9px Arial';
    ctx.fillText(dev.sub, dev.x + 50, 580);
  });

  ctx.textAlign = 'left';
}

function drawSkills(ctx, w, h) {
  ctx.fillStyle = '#0f1428';
  ctx.fillRect(0, 0, 240, h);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px Arial';
  ctx.fillText('IT Support Lab', 20, 40);

  // Header
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('⚡ Skills Matrix', 280, 60);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '14px Arial';
  ctx.fillText('Track your competency across 6 IT domains', 280, 85);

  // Skills grid
  const skills = [
    { name: 'Active Directory', progress: 1.0, color: '#3b82f6', completed: '5/5 labs' },
    { name: 'Networking', progress: 0.75, color: '#8b5cf6', completed: '3/4 labs' },
    { name: 'Hardware', progress: 1.0, color: '#10b981', completed: '1/1 labs' },
    { name: 'Operations', progress: 0.67, color: '#f59e0b', completed: '2/3 labs' },
    { name: 'Deployment', progress: 1.0, color: '#06b6d4', completed: '2/2 labs' },
    { name: 'Documentation', progress: 0.5, color: '#ec4899', completed: '1/2 labs' }
  ];

  skills.forEach((skill, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 280 + col * 450;
    const y = 120 + row * 200;

    ctx.fillStyle = '#1a1f3a';
    roundRect(ctx, x, y, 430, 180, 12);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(skill.name, x + 20, y + 30);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '12px Arial';
    ctx.fillText(skill.completed, x + 20, y + 55);

    // Progress bar
    ctx.fillStyle = '#252d4a';
    roundRect(ctx, x + 20, y + 75, 390, 20, 10);
    ctx.fill();

    ctx.fillStyle = skill.color;
    roundRect(ctx, x + 20, y + 75, 390 * skill.progress, 20, 10);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px Arial';
    ctx.fillText(Math.round(skill.progress * 100) + '%', x + 30, y + 90);

    // Sub-skills
    ctx.fillStyle = '#10b981';
    ctx.font = '12px Arial';
    ctx.fillText('✓ User Management', x + 20, y + 120);
    ctx.fillText('✓ GPOs', x + 200, y + 120);
  });
}

// Helper function for rounded rectangles
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Run
processScreenshots();
