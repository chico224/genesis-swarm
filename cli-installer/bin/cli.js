#!/usr/bin/env node
// Genesis-Core CLI — Production
// Author: Oumar Sow

'use strict';

const { execSync, spawnSync, spawn } = require('child_process');
const fs   = require('fs');
const os   = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const INTERFACE_DIR = path.join(ROOT, 'interface');

const c = {
    cyan:    '\x1b[36m',
    magenta: '\x1b[35m',
    green:   '\x1b[32m',
    yellow:  '\x1b[33m',
    blue:    '\x1b[34m',
    red:     '\x1b[31m',
    reset:   '\x1b[0m',
    bold:    '\x1b[1m',
    dim:     '\x1b[2m'
};

// ─── ASCII Banner ──────────────────────────────────────────────────────────────
function printBanner() {
    console.clear();
    console.log(`
${c.cyan}${c.bold}  ██████╗ ███████╗███╗   ██╗███████╗███████╗██╗███████╗    ██████╗ ██████╗ ██████╗ ███████╗
 ██╔════╝ ██╔════╝████╗  ██║██╔════╝██╔════╝██║██╔════╝   ██╔════╝██╔═══██╗██╔══██╗██╔════╝
 ██║  ███╗█████╗  ██╔██╗ ██║█████╗  ███████╗██║███████╗   ██║     ██║   ██║██████╔╝█████╗  
 ██║   ██║██╔══╝  ██║╚██╗██║██╔══╝  ╚════██║██║╚════██║   ██║     ██║   ██║██╔══██╗██╔══╝  
 ╚██████╔╝███████╗██║ ╚████║███████╗███████║██║███████║   ╚██████╗╚██████╔╝██║  ██║███████╗
  ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝╚══════╝╚═╝╚══════╝    ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝${c.reset}`);
    console.log(`${c.magenta}${c.bold}  ═══════════════════════════════════════════════════════════════════════════════${c.reset}`);
    console.log(`${c.cyan}  > ARCHITECTURE : ${c.bold}Enterprise Distributed Orchestrator${c.reset}`);
    console.log(`${c.cyan}  > VERSION      : ${c.bold}1.0.0${c.reset}`);
    console.log(`${c.yellow}  > CRÉÉ PAR     : ${c.bold}OUMAR SOW${c.reset}`);
    console.log(`${c.magenta}${c.bold}  ═══════════════════════════════════════════════════════════════════════════════${c.reset}\n`);
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function ok(msg)   { console.log(`  ${c.green}✔${c.reset}  ${msg}`); }
function warn(msg) { console.log(`  ${c.yellow}⚠${c.reset}  ${msg}`); }
function err(msg)  { console.log(`  ${c.red}✘${c.reset}  ${msg}`); }
function step(msg) { console.log(`\n${c.magenta}${c.bold}  ── ${msg}${c.reset}`); }

function isAvailable(cmd) {
    const r = spawnSync(cmd, ['--version'], { encoding: 'utf8', stdio: 'pipe' });
    return r.status === 0;
}

function runSync(cmd, label) {
    try {
        execSync(cmd, { stdio: 'inherit' });
        ok(`${label} prêt.`);
        return true;
    } catch {
        err(`Échec: ${label}`);
        return false;
    }
}

// ─── INSTALL COMMAND ──────────────────────────────────────────────────────────
async function install() {
    printBanner();
    step('VÉRIFICATION DES DÉPENDANCES SYSTÈME');

    // Python
    if (isAvailable('python3') || isAvailable('python')) {
        ok('Python détecté.');
    } else {
        warn('Python manquant — installation automatique...');
        const plat = os.platform();
        if (plat === 'win32')  runSync('winget install -e --id Python.Python.3.11 --silent', 'Python');
        else if (plat === 'darwin') runSync('brew install python@3.11', 'Python');
        else runSync('sudo apt-get install -y python3 python3-pip', 'Python');
    }

    // Rust / Cargo
    if (isAvailable('cargo')) {
        ok('Rust / Cargo détecté.');
    } else {
        warn('Rust manquant — installation automatique...');
        if (os.platform() === 'win32')
            runSync('winget install -e --id Rustlang.Rust.GNU --silent', 'Rust');
        else
            runSync('curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y', 'Rust');
    }

    // Node.js / npm
    if (isAvailable('node')) {
        ok('Node.js détecté.');
    } else {
        warn('Node.js manquant — installation automatique...');
        if (os.platform() === 'win32')
            runSync('winget install -e --id OpenJS.NodeJS.LTS --silent', 'Node.js');
        else
            runSync('curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs', 'Node.js');
    }

    // Docker
    if (isAvailable('docker')) { ok('Docker détecté.'); }
    else { warn('Docker non détecté. Le déploiement cloud le nécessitera.'); }

    step('INSTALLATION DES DÉPENDANCES DU PROJET');

    // Python deps
    const reqPath = path.join(ROOT, 'requirements.txt');
    if (fs.existsSync(reqPath)) {
        const pip = os.platform() === 'win32' ? 'pip' : 'pip3';
        runSync(`${pip} install -r "${reqPath}"`, 'Dépendances Python');
    }

    // Node deps (interface)
    if (fs.existsSync(path.join(INTERFACE_DIR, 'package.json'))) {
        runSync(`npm install --prefix "${INTERFACE_DIR}"`, 'Dépendances Node');
    }

    // Compiler Rust
    step('COMPILATION DU NOYAU RUST');
    const cargoPath = path.join(ROOT, 'core-engine', 'Cargo.toml');
    if (fs.existsSync(cargoPath)) {
        runSync(`cargo build --release --manifest-path "${cargoPath}"`, 'Hyperviseur Rust');
    }

    console.log(`\n${c.green}${c.bold}  ✅ Installation complète. Lancez maintenant : genesis-swarm run${c.reset}\n`);
}

// ─── RUN COMMAND ──────────────────────────────────────────────────────────────
function run() {
    printBanner();
    step('LANCEMENT DE GENESIS-CORE');

    const PORT = 3000;
    const HOST = 'localhost';

    // 1. Démarrage du Noyau Rust (Background)
    step('DÉMARRAGE DU NOYAU RUST (PORT 8080)');
    const coreEnginePath = path.join(ROOT, 'core-engine');
    const rustProc = spawn('cargo run --release', { 
        cwd: coreEnginePath, 
        shell: true, 
        stdio: 'pipe' // On capture la sortie pour éviter de polluer le terminal principal trop violemment
    });

    rustProc.stdout.on('data', (data) => {
        if (data.toString().includes('Core Engine listening')) {
            ok('Noyau Rust opérationnel.');
        }
    });

    rustProc.on('error', (e) => { err(`Échec du Noyau Rust: ${e.message}`); });

    // 2. Démarrage de l'Interface Next.js
    step('DÉMARRAGE DE L\'INTERFACE (PORT 3000)');
    const env = Object.assign({}, process.env, {
        PORT: String(PORT),
        HOSTNAME: HOST,
        NEXT_PUBLIC_WS_URL: `ws://${HOST}:8080/ws`,
        CORE_ENGINE_URL: `http://${HOST}:8080`
    });

    const hasBuild = fs.existsSync(path.join(INTERFACE_DIR, '.next'));
    const cmd      = hasBuild ? 'npm run start' : 'npm run dev';
    const label    = hasBuild ? 'Production' : 'Développement';

    console.log(`\n${c.dim}  Mode: ${label}${c.reset}`);
    console.log(`${c.cyan}${c.bold}\n  ➜ Ouvrez : http://${HOST}:${PORT}\n${c.reset}`);

    const uiProc = spawn(cmd, { cwd: INTERFACE_DIR, shell: true, stdio: 'inherit', env });

    uiProc.on('error', (e) => { err(`Impossible de démarrer l'UI: ${e.message}`); process.exit(1); });

    // Gestion CTRL+C propre
    process.on('SIGINT', () => {
        console.log(`\n${c.yellow}  ⚡ Arrêt de Genesis-Core...${c.reset}\n`);
        rustProc.kill('SIGTERM');
        uiProc.kill('SIGTERM');
        process.exit(0);
    });
}

// ─── ROUTER ───────────────────────────────────────────────────────────────────
const command = process.argv[2];

switch (command) {
    case 'run':     run();                break;
    case 'install': install();            break;
    default:
        printBanner();
        console.log(`  Usage:`);
        console.log(`  ${c.cyan}genesis-swarm install${c.reset}  — Installe toutes les dépendances`);
        console.log(`  ${c.cyan}genesis-swarm run${c.reset}      — Lance la plateforme sur localhost:3000\n`);
}
