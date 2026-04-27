# -*- coding: utf-8 -*-
"""
Module: Enterprise Data Contracts
Author: Oumar Sow
Classification: OMEGA-CORE

Description:
Miroir Pydantic strict du contrat gRPC (swarm.proto).
Assure l'intégrité absolue des données dans le cluster cognitif.
"""

from pydantic import BaseModel, Field
from typing import Optional

class AgentSignalSchema(BaseModel):
    """Signal envoyé par l'Agent Python vers l'Hyperviseur Rust."""
    agent_id: str = Field(..., description="ID unique du noeud.")
    status: str = Field(..., pattern="^(ONLINE|BUSY|ERROR|SLEEPING)$", description="État de conscience.")
    cpu_usage: float = Field(..., ge=0.0, le=100.0, description="Usage CPU en %.")
    memory_crystal_size_mb: float = Field(..., ge=0.0, description="Taille du cristal mémoire.")
    current_task: Optional[str] = Field(None, description="Tâche en cours d'exécution.")

class HypervisorCommandSchema(BaseModel):
    """Commande reçue de l'Hyperviseur Rust."""
    target_agent_id: str = Field(..., description="Agent visé.")
    action: str = Field(..., pattern="^(SLEEP|WAKE|PROCESS_PROMPT|ASSIMILATE)$")
    payload: str = Field(..., description="JSON contenant le Hyper-Prompt.")
    timestamp_ms: int = Field(..., description="Horodatage Unix en millisecondes.")
