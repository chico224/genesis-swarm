# -*- coding: utf-8 -*-
"""
Module: Abstract Syntax Tree Parser (Ghost Wrapper)
Classification: OMEGA-CORE
Author: Oumar Sow

Description:
Analyse statiquement le code source brut d'un dépôt externe
pour en extraire la logique métier (fonctions/classes) et
générer une API virtuelle native à la volée — sans exécuter le code.
"""
import ast
import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class GhostASTParser:
    """Parseur AST de production — extraction statique de la logique d'un module Python."""

    def parse_python_code(self, source_code: str) -> List[Dict[str, Any]]:
        """
        Extrait toutes les fonctions, leurs arguments et docstrings
        à partir du code source brut passé en chaîne de caractères.

        Args:
            source_code: Le code source Python brut à analyser.

        Returns:
            Liste de dictionnaires contenant name, docstring et args.
        """
        if not source_code or not isinstance(source_code, str):
            return []

        try:
            tree = ast.parse(source_code)
        except SyntaxError as exc:
            logger.error("[AST] Erreur de syntaxe lors de l'analyse: %s", exc)
            return [{"error": f"SyntaxError: {exc}"}]

        extracted: List[Dict[str, Any]] = []
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                extracted.append({
                    "name": node.name,
                    "docstring": ast.get_docstring(node) or "",
                    "args": [arg.arg for arg in node.args.args],
                    "lineno": node.lineno,
                })

        logger.info("[AST] %d fonction(s) extraite(s).", len(extracted))
        return extracted

    def parse_classes(self, source_code: str) -> List[Dict[str, Any]]:
        """Extrait les classes et leurs méthodes publiques."""
        if not source_code:
            return []
        try:
            tree = ast.parse(source_code)
        except SyntaxError:
            return []

        classes = []
        for node in ast.walk(tree):
            if isinstance(node, ast.ClassDef):
                methods = [
                    n.name for n in ast.walk(node)
                    if isinstance(n, ast.FunctionDef) and not n.name.startswith("_")
                ]
                classes.append({
                    "name": node.name,
                    "methods": methods,
                    "docstring": ast.get_docstring(node) or "",
                })
        return classes
