# -*- coding: utf-8 -*-
"""
Tests Unitaires: Cognitive Engines & Memory
Author: Oumar Sow
"""

import unittest
import sys
import os

# Configuration du Path pour les imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from engines.reality_check import RealityCheckEngine
from memory.time_crystal_builder import SemanticTimeCrystal

class TestEngines(unittest.TestCase):
    def test_reality_check_valid(self):
        """Test qu'un prompt réaliste passe."""
        engine = RealityCheckEngine()
        valid, msg = engine.validate_prompt("Génère une API en Node.js pour gérer des utilisateurs.")
        self.assertTrue(valid)
        self.assertEqual(msg, "PROMPT_VALIDATED")

    def test_reality_check_invalid(self):
        """Test le blocage strict des hallucinations."""
        engine = RealityCheckEngine()
        valid, msg = engine.validate_prompt("Crée une Système capable de prédire l'avenir de la bourse à 100%.")
        self.assertFalse(valid)
        self.assertIn("Violation des lois", msg)

    def test_time_crystal_compression(self):
        """Test la génération déterministe de la mémoire cristallisée."""
        crystal_engine = SemanticTimeCrystal()
        logs = ["INIT OMEGA", "AGENT SPAWNED", "TASK COMPLETED"]
        crystal = crystal_engine.distill_memory(logs)
        
        self.assertTrue(crystal.startswith("CRYSTAL_"))
        self.assertEqual(len(crystal), 24) # "CRYSTAL_" (8) + 16 chars de hash
        
    def test_time_crystal_empty(self):
        """Test du comportement sans mémoire."""
        crystal_engine = SemanticTimeCrystal()
        self.assertEqual(crystal_engine.distill_memory([]), "CRYSTAL_EMPTY")

if __name__ == '__main__':
    unittest.main()
