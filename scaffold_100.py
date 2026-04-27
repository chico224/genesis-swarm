import os

structure = {
    "core-engine": {
        "src": {
            "models": ["mod.rs", "agent.rs", "memory_block.rs", "synapse.rs", "quantum_state.rs", "task.rs"],
            "services": ["mod.rs", "hypervisor.rs", "ghost_daemon.rs", "synaptic_router.rs", "crystallizer.rs", "telemetry.rs"],
            "utils": ["mod.rs", "logger.rs", "config.rs", "errors.rs", "crypto.rs"],
            "api": ["mod.rs", "grpc_server.rs", "websocket.rs", "rest_bridge.rs"]
        },
        "tests": ["test_hypervisor.rs", "test_memory.rs", "test_router.rs", "test_daemon.rs", "test_crypto.rs"],
        "build.rs": ""
    },
    "cognitive-nodes": {
        "models": ["__init__.py", "schemas.py", "agent_model.py", "prompt_templates.py", "memory_models.py"],
        "engines": ["__init__.py", "hallucination_engine.py", "forge_engine.py", "compression_engine.py", "reality_check.py"],
        "skills": {
            "__init__.py": "",
            "base_skill.py": "",
            "web_crawler.py": "",
            "code_executor.py": "",
            "math_solver.py": "",
            "auto_forge.py": "",
            "github_assimilation.py": ""
        },
        "utils": ["__init__.py", "logger.py", "telemetry.py", "config_parser.py", "exceptions.py"],
        "tests": ["__init__.py", "test_engines.py", "test_skills.py", "test_memory.py", "test_routing.py"],
        "main.py": "",
        "requirements.txt": "",
        "pyproject.toml": ""
    },
    "interface": {
        "src": {
            "components": {
                "3d": ["SwarmCanvas.tsx", "AgentNode.tsx", "SynapseLink.tsx", "ParticleFlow.tsx", "CameraRig.tsx"],
                "ui": ["GlassPanel.tsx", "Terminal.tsx", "Sidebar.tsx", "MetricsChart.tsx", "CommandInput.tsx"],
                "layout": ["MainLayout.tsx", "Header.tsx", "Footer.tsx"]
            },
            "hooks": ["useSwarm.ts", "useAgent.ts", "useMetrics.ts", "useWebSocket.ts", "useThreeContext.ts"],
            "contexts": ["SwarmContext.tsx", "ThemeContext.tsx", "AuthContext.tsx"],
            "services": ["api.ts", "websocket.ts", "metrics_aggregator.ts"],
            "utils": ["constants.ts", "helpers.ts", "math3d.ts", "colors.ts"],
            "pages": ["index.tsx", "_app.tsx", "_document.tsx", "agents.tsx", "memory.tsx", "skills.tsx"],
            "styles": ["globals.css", "theme.css", "animations.css"]
        },
        "public": ["favicon.ico", "manifest.json", "robots.txt"],
        "package.json": "",
        "tsconfig.json": "",
        "next.config.js": "",
        "tailwind.config.js": ""
    },
    "cli-installer": {
        "commands": ["init.js", "start.js", "stop.js", "status.js", "forge.js", "assimilate.js"],
        "utils": ["os_detector.js", "downloader.js", "logger.js", "env_setup.js"]
    },
    "docs": {
        "architecture": ["OVERVIEW.md", "HYPERVISOR.md", "COGNITIVE_NODES.md", "INTERFACE.md"],
        "guides": ["INSTALLATION.md", "SKILL_CREATION.md", "GHOST_WRAPPER.md"],
        "api": ["GRPC_SCHEMA.md", "REST_API.md"]
    },
    "infrastructure": {
        "docker": ["Dockerfile.rust", "Dockerfile.python", "Dockerfile.node", "docker-compose.yml"],
        "k8s": ["deployment.yaml", "service.yaml", "ingress.yaml", "configmap.yaml", "secrets.yaml"]
    }
}

def create_structure(base_path, struct):
    count = 0
    for key, value in struct.items():
        current_path = os.path.join(base_path, key)
        if isinstance(value, dict):
            os.makedirs(current_path, exist_ok=True)
            count += create_structure(current_path, value)
        elif isinstance(value, list):
            os.makedirs(base_path, exist_ok=True)
            for item in value:
                file_path = os.path.join(base_path, item)
                if not os.path.exists(file_path):
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(f"// Genesis Swarm File: {item}\\n// Author: Oumar Sow\\n// Component: {key}\\n")
                    count += 1
        else:
            os.makedirs(base_path, exist_ok=True)
            if not os.path.exists(current_path):
                with open(current_path, "w", encoding="utf-8") as f:
                    f.write(value if value else f"// Genesis Swarm File: {key}\\n// Author: Oumar Sow\\n")
                count += 1
    return count

base_dir = r"C:\Users\gando\.gemini\antigravity\scratch\genesis-swarm"
total_files = create_structure(base_dir, structure)
print(f"Architecture d'entreprise déployée ! {total_files} fichiers générés.")
