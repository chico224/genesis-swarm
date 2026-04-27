# -*- coding: utf-8 -*-
"""
Tests Unitaires: Ghost Wrapper & Auto Forge
Author: Oumar Sow
"""
import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from adapters.github.ast_parser import GhostASTParser
from skills.auto_forge import AutoForge

class TestGhostWrapper(unittest.TestCase):
    def test_ast_extraction(self):
        """Test la capacité du Ghost Wrapper à lire du code brut sans API."""
        code = '''
def calculate_gravity(mass: float) -> float:
    """Calcule la distorsion gravitationnelle."""
    return mass * 9.81
'''
        parser = GhostASTParser()
        result = parser.parse_python_code(code)
        
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]['name'], 'calculate_gravity')
        self.assertIn("distorsion", result[0]['docstring'])
        self.assertEqual(result[0]['args'], ['mass'])

    def test_auto_forge_skill(self):
        """Test la création automatique de compétence à partir de l'AST."""
        forge = AutoForge()
        metadata = {
            "name": "calculate_gravity",
            "docstring": "Calcule la distorsion gravitationnelle.",
            "args": ["mass"]
        }
        skill_code = forge.forge_skill(metadata)
        
        self.assertIn("def SKILL_CALCULATE_GRAVITY(mass):", skill_code)
        self.assertIn("AUTO-GENERATED SKILL", skill_code)
        self.assertIn("ghost_wrapper.execute_native", skill_code)

if __name__ == '__main__':
    unittest.main()
