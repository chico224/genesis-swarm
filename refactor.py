import os
import re

base_dir = r"C:\Users\gando\.gemini\antigravity\scratch\genesis-swarm"

replacements = {
    r"OMEGA-ANTIGRAVITY": "OMEGA-CORE",
    r"(?i)antigravity": "Genesis-Core",
    r"\bIA\b": "Système",
    r"l'IA\b": "le Système",
    r"d'IA\b": "de Système",
    r"\bAI\b": "System"
}

for root, _, files in os.walk(base_dir):
    for file in files:
        if file.endswith((".py", ".rs", ".md", ".txt", ".toml", ".js", ".json", ".proto")):
            fpath = os.path.join(root, file)
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    content = f.read()
                
                new_content = content
                for pattern, rep in replacements.items():
                    new_content = re.sub(pattern, rep, new_content)
                    
                if new_content != content:
                    with open(fpath, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"Refactored: {fpath}")
            except Exception as e:
                pass

print("Refactoring complet. Traces d'IA et d'Antigravity purgées.")
