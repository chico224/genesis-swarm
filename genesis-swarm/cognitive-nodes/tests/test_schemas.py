# -*- coding: utf-8 -*-
"""
Tests Unitaires: Enterprise Data Contracts
Author: Oumar Sow
"""

import unittest
from pydantic import ValidationError
import sys
import os

# Ajout du path pour les imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from models.schemas import AgentSignalSchema, HypervisorCommandSchema

class TestSchemas(unittest.TestCase):
    def test_valid_agent_signal(self):
        """Test la création d'un signal agent valide."""
        data = {
            "agent_id": "OMEGA_001",
            "status": "ONLINE",
            "cpu_usage": 15.5,
            "memory_crystal_size_mb": 42.1,
            "current_task": "Analyzing GitHub Repo"
        }
        signal = AgentSignalSchema(**data)
        self.assertEqual(signal.agent_id, "OMEGA_001")
        self.assertEqual(signal.status, "ONLINE")

    def test_invalid_agent_status(self):
        """Test qu'un statut invalide lève une erreur stricte (Anti-Hallucination)."""
        data = {
            "agent_id": "OMEGA_002",
            "status": "CONFUSED", # Statut illégal
            "cpu_usage": 10.0,
            "memory_crystal_size_mb": 1.0
        }
        with self.assertRaises(ValidationError):
            AgentSignalSchema(**data)

    def test_invalid_cpu_usage(self):
        """Test que l'utilisation CPU ne peut pas être absurde."""
        data = {
            "agent_id": "OMEGA_003",
            "status": "BUSY",
            "cpu_usage": 150.0, # Impossible
            "memory_crystal_size_mb": 1.0
        }
        with self.assertRaises(ValidationError):
            AgentSignalSchema(**data)

if __name__ == '__main__':
    unittest.main()
