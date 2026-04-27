# Genesis-Core Multi-Stage Build
# Classification: OMEGA-CORE

# ==========================================
# ÉTAPE 1: Compilation du Cœur Rust
# ==========================================
FROM rust:1.74 AS rust-builder
WORKDIR /usr/src/genesis-core
COPY core-engine/ .
RUN cargo build --release

# ==========================================
# ÉTAPE 2: Préparation de la Logique Python
# ==========================================
FROM python:3.11-slim AS python-builder
WORKDIR /usr/src/cognitive-nodes
COPY cognitive-nodes/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ==========================================
# ÉTAPE 3: Assemblage Final (Image Ultra-Légère)
# ==========================================
FROM debian:bookworm-slim
WORKDIR /app

# Injection du binaire Rust
COPY --from=rust-builder /usr/src/genesis-core/target/release/genesis_core /usr/local/bin/genesis_core

# Injection de l'environnement Python
COPY --from=python-builder /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/
COPY cognitive-nodes/ /app/cognitive-nodes/

EXPOSE 8080 50051

# Lancement du Ghost Daemon et de l'Hyperviseur
CMD ["genesis_core"]
