"""
RAG (Retrieval-Augmented Generation) Engine for AUREX Aiden AI.
Uses TF-IDF based similarity matching to retrieve relevant context chunks
from organization data, product catalogs, and custom uploaded data.
No external vector DB dependency — pure Python implementation.
"""

import json
import os
import re
import math
import logging
from typing import List, Dict, Any, Tuple
from collections import Counter

logger = logging.getLogger("aurex.rag")

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")


def _tokenize(text: str) -> List[str]:
    """Simple word tokenizer — lowercase, strip punctuation."""
    return re.findall(r'[a-z0-9]+', text.lower())


def _compute_tf(tokens: List[str]) -> Dict[str, float]:
    """Term frequency: count / total tokens."""
    counts = Counter(tokens)
    total = len(tokens)
    if total == 0:
        return {}
    return {word: count / total for word, count in counts.items()}


def _compute_idf(documents: List[List[str]]) -> Dict[str, float]:
    """Inverse document frequency across all document token lists."""
    n_docs = len(documents)
    if n_docs == 0:
        return {}
    
    df = Counter()
    for doc_tokens in documents:
        unique_tokens = set(doc_tokens)
        for token in unique_tokens:
            df[token] += 1
    
    return {word: math.log((n_docs + 1) / (freq + 1)) + 1 for word, freq in df.items()}


class RAGEngine:
    """
    Simple TF-IDF based retrieval engine.
    Loads documents from JSON data files, chunks them, and retrieves
    the most relevant chunks for a given query.
    """

    _documents: List[Dict[str, str]] = []  # [{"title": ..., "content": ...}]
    _token_lists: List[List[str]] = []
    _idf: Dict[str, float] = {}
    _initialized: bool = False

    @classmethod
    def initialize(cls):
        """Load and index all available data sources."""
        cls._documents = []
        cls._token_lists = []

        # 1. Load product catalog
        catalog_path = os.path.join(DATA_DIR, "product_catalog.json")
        if os.path.exists(catalog_path):
            try:
                with open(catalog_path, "r", encoding="utf-8") as f:
                    catalog = json.load(f)
                
                for product in catalog.get("products", []):
                    content = (
                        f"Product: {product['name']} (SKU: {product['sku']})\n"
                        f"Category: {product.get('category', 'General')}\n"
                        f"Brand: {product.get('brand', 'AUREX')}\n"
                        f"Price: ${product['price']}\n"
                        f"Inventory: {product.get('inventory', 0)} units in stock\n"
                        f"Description: {product.get('description', '')}\n"
                        f"Key Features: {', '.join(product.get('key_features', []))}\n"
                    )
                    ratings = product.get("ratings", {})
                    if ratings:
                        content += f"Ratings: {json.dumps(ratings)}\n"
                    
                    cls._add_document(
                        title=f"Product Catalog — {product['name']}",
                        content=content
                    )
                
                logger.info(f"[RAG] Loaded {len(catalog.get('products', []))} products from catalog")
            except Exception as e:
                logger.warning(f"[RAG] Failed to load product catalog: {e}")

        # 2. Load organization custom data
        org_path = os.path.join(DATA_DIR, "org_custom_data.json")
        if os.path.exists(org_path):
            try:
                with open(org_path, "r", encoding="utf-8") as f:
                    org_data = json.load(f)
                
                # Create a comprehensive org data document
                org_content = f"Organization: {org_data.get('organization_name', 'Unknown')}\n"
                org_content += f"Industry: {org_data.get('industry', 'Unknown')}\n"
                org_content += f"Annual Revenue: {org_data.get('annual_revenue', 'Unknown')}\n"
                
                if org_data.get("growth_rate"):
                    org_content += f"Growth Rate: {org_data['growth_rate']}\n"
                
                # Top products
                for product in org_data.get("top_products", []):
                    org_content += (
                        f"\nOrg Product: {product.get('name', '')} "
                        f"(SKU: {product.get('sku', '')}, "
                        f"Price: ${product.get('price', 0)}, "
                        f"Margin: {product.get('margin', '')}, "
                        f"Stock: {product.get('stock', 0)})\n"
                    )
                
                # Regional markets
                for market in org_data.get("regional_markets", []):
                    org_content += (
                        f"\nRegional Market: {market.get('region', '')} "
                        f"(Sales Share: {market.get('sales_share', '')}, "
                        f"Channel: {market.get('channel', '')})\n"
                    )
                
                # Key initiatives
                for initiative in org_data.get("key_initiatives", []):
                    org_content += f"\nKey Initiative: {initiative}\n"
                
                # Add any remaining fields as general context
                known_keys = {"organization_name", "industry", "annual_revenue", "growth_rate", 
                            "top_products", "regional_markets", "key_initiatives"}
                extra = {k: v for k, v in org_data.items() if k not in known_keys}
                if extra:
                    org_content += f"\nAdditional Organization Data: {json.dumps(extra, indent=2)}\n"
                
                cls._add_document(
                    title=f"Organization Data — {org_data.get('organization_name', 'Custom')}",
                    content=org_content
                )
                
                logger.info(f"[RAG] Loaded organization data for '{org_data.get('organization_name', 'Unknown')}'")
            except Exception as e:
                logger.warning(f"[RAG] Failed to load org data: {e}")

        # Build IDF index
        cls._idf = _compute_idf(cls._token_lists)
        cls._initialized = True
        logger.info(f"[RAG] Initialized with {len(cls._documents)} documents, {len(cls._idf)} unique terms")

    @classmethod
    def _add_document(cls, title: str, content: str):
        """Add a document to the index."""
        cls._documents.append({"title": title, "content": content})
        cls._token_lists.append(_tokenize(content))

    @classmethod
    def retrieve(cls, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Retrieve the top-K most relevant documents for a query.
        Returns list of {"title": str, "content": str, "score": float}.
        """
        if not cls._initialized:
            cls.initialize()

        if not cls._documents:
            return []

        query_tokens = _tokenize(query)
        if not query_tokens:
            return []

        query_tf = _compute_tf(query_tokens)
        
        # Score each document using TF-IDF cosine similarity
        scores: List[Tuple[int, float]] = []
        
        for idx, doc_tokens in enumerate(cls._token_lists):
            doc_tf = _compute_tf(doc_tokens)
            
            # Compute dot product of TF-IDF vectors
            score = 0.0
            for term, q_tf in query_tf.items():
                if term in doc_tf and term in cls._idf:
                    score += (q_tf * cls._idf[term]) * (doc_tf[term] * cls._idf[term])
            
            if score > 0:
                scores.append((idx, score))
        
        # Sort by score descending
        scores.sort(key=lambda x: x[1], reverse=True)
        
        results = []
        for idx, score in scores[:top_k]:
            results.append({
                "title": cls._documents[idx]["title"],
                "content": cls._documents[idx]["content"],
                "score": round(score, 4)
            })
        
        return results

    @classmethod
    def get_context_for_query(cls, query: str, max_chars: int = 3000) -> str:
        """
        Get formatted context string for injection into LLM system prompt.
        Returns relevant document chunks concatenated, truncated to max_chars.
        """
        results = cls.retrieve(query, top_k=5)
        
        if not results:
            return ""
        
        context_parts = []
        total_chars = 0
        
        for doc in results:
            chunk = f"### {doc['title']}\n{doc['content']}\n"
            if total_chars + len(chunk) > max_chars:
                remaining = max_chars - total_chars
                if remaining > 100:
                    context_parts.append(chunk[:remaining] + "...")
                break
            context_parts.append(chunk)
            total_chars += len(chunk)
        
        return "\n".join(context_parts)

    @classmethod
    def reload(cls):
        """Force reload all data sources and rebuild index."""
        cls._documents = []
        cls._token_lists = []
        cls._idf = {}
        cls._initialized = False
        cls.initialize()
