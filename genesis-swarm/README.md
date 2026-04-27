# Genesis-Core — Enterprise Swarm Orchestrator

> Créé par **Oumar Sow** | Architecture Polyglot : Rust × Python × Next.js

---

## 🚀 Installation (Première fois)

```bash
npx genesis-swarm install
```

Le CLI détecte et installe automatiquement **Python**, **Rust**, **Node.js** s'ils sont manquants, puis compile et configure tout le système.

---

## ▶️ Lancement (Utilisateurs existants)

```bash
genesis-swarm run
```

La plateforme démarre sur **[http://localhost:3000](http://localhost:3000)** (toujours en local).

---

## Architecture

```
genesis-swarm/
├── core-engine/        # Hyperviseur Rust (Tokio, AES-256-GCM)
├── cognitive-nodes/    # Moteurs Python (Anti-Hallucination, Mémoire)
├── interface/          # Dashboard Next.js (Chat + 3D + Métriques)
├── infrastructure/     # Docker + Terraform + Ansible
├── cli-installer/      # CLI genesis-swarm
└── requirements.txt    # Dépendances Python
```

---

## Variables d'environnement

Copiez `.env.example` → `.env.local` dans le dossier `interface/` :

```env
CORE_ENGINE_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
```
