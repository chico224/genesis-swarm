# -*- coding: utf-8 -*-
"""
Script de compilation globale (Générateur de __pycache__)
Author: Oumar Sow
"""
import sys
import os

# Ajout du path courant pour trouver les modules
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

print("Compilation de l'Usine Cognitive en cours...")

# Imports massifs pour forcer le compilateur Python à générer les .pyc
from models import schemas
from engines import reality_check
from memory import time_crystal_builder
from adapters.github import ast_parser
from skills import auto_forge

print("Toutes les architectures ont été compilées avec succès dans les dossiers __pycache__ respectifs.")
