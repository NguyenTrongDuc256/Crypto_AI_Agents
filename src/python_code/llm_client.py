"""
LLM Client - Kết nối thực tế với Groq, Gemini, Claude
"""

import os
from typing import Dict, Any, Optional
import json

# Import actual LLM libraries
try:
    from groq import Groq
except ImportError:
    Groq = None

try:
    import google.generativeai as genai
except ImportError:
    genai = None

try:
    import anthropic
except ImportError:
    anthropic = None


class LLMClient:
    """Quản lý kết nối với nhiều LLM providers"""
    
    def __init__(self):
        self.groq_client = None
        self.gemini_client = None
        self.claude_client = None
        
        # Initialize clients
        self._init_groq()
        self._init_gemini()
        self._init_claude()
    
    def _init_groq(self):
        """Khởi tạo Groq client"""
        api_key = os.getenv('GROQ_API_KEY')
        if api_key and Groq:
            self.groq_client = Groq(api_key=api_key)
            print("✅ Groq client initialized")
        else:
            print("⚠️ Groq not available (missing API key or library)")
    
    def _init_gemini(self):
        """Khởi tạo Gemini client"""
        api_key = os.getenv('GEMINI_API_KEY')
        if api_key and genai:
            genai.configure(api_key=api_key)
            self.gemini_client = genai.GenerativeModel('gemini-2.0-flash')
            print("✅ Gemini client initialized")
        else:
            print("⚠️ Gemini not available (missing API key or library)")
    
    def _init_claude(self):
        """Khởi tạo Claude client"""
        api_key = os.getenv('ANTHROPIC_API_KEY')
        if api_key and anthropic:
            self.claude_client = anthropic.Anthropic(api_key=api_key)
            print("✅ Claude client initialized")
        else:
            print("⚠️ Claude not available (missing API key or library)")
    
    def call_groq(self, system_prompt: str, user_message: str, model: str = 'llama-3.3-70b-versatile') -> Dict[str, Any]:
        """Gọi Groq API"""
        if not self.groq_client:
            return {'error': 'Groq client not initialized', 'tokens': 0, 'cost': 0}
        
        try:
            response = self.groq_client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.7,
                max_tokens=2000,
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            usage = response.usage
            
            return {
                'content': json.loads(content),
                'input_tokens': usage.prompt_tokens,
                'output_tokens': usage.completion_tokens,
                'total_tokens': usage.total_tokens,
                'cost': 0,  # Groq is free
                'model': model,
                'provider': 'groq'
            }
        except Exception as e:
            return {'error': str(e), 'tokens': 0, 'cost': 0}
    
    def call_gemini(self, system_prompt: str, user_message: str, model: str = 'gemini-2.0-flash') -> Dict[str, Any]:
        """Gọi Gemini API"""
        if not self.gemini_client:
            return {'error': 'Gemini client not initialized', 'tokens': 0, 'cost': 0}
        
        try:
            prompt = f"{system_prompt}\n\n{user_message}"
            response = self.gemini_client.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=2000,
                    response_mime_type="application/json"
                )
            )
            
            content = response.text
            
            # Estimate tokens (rough approximation)
            input_tokens = len(prompt.split()) * 1.3
            output_tokens = len(content.split()) * 1.3
            
            return {
                'content': json.loads(content),
                'input_tokens': int(input_tokens),
                'output_tokens': int(output_tokens),
                'total_tokens': int(input_tokens + output_tokens),
                'cost': 0,  # Gemini Flash is free
                'model': model,
                'provider': 'gemini'
            }
        except Exception as e:
            return {'error': str(e), 'tokens': 0, 'cost': 0}
    
    def call_claude(self, system_prompt: str, user_message: str, model: str = 'claude-3-5-sonnet-20241022') -> Dict[str, Any]:
        """Gọi Claude API"""
        if not self.claude_client:
            return {'error': 'Claude client not initialized', 'tokens': 0, 'cost': 0}
        
        try:
            response = self.claude_client.messages.create(
                model=model,
                max_tokens=2000,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_message}
                ]
            )
            
            content = response.content[0].text
            usage = response.usage
            
            # Calculate cost
            input_cost = (usage.input_tokens / 1_000_000) * 3.0  # $3 per 1M
            output_cost = (usage.output_tokens / 1_000_000) * 15.0  # $15 per 1M
            total_cost = input_cost + output_cost
            
            return {
                'content': json.loads(content),
                'input_tokens': usage.input_tokens,
                'output_tokens': usage.output_tokens,
                'total_tokens': usage.input_tokens + usage.output_tokens,
                'cost': total_cost,
                'model': model,
                'provider': 'claude'
            }
        except Exception as e:
            return {'error': str(e), 'tokens': 0, 'cost': 0}
    
    def call_llm(self, provider: str, system_prompt: str, user_message: str, **kwargs) -> Dict[str, Any]:
        """Gọi LLM theo provider"""
        if provider == 'groq':
            return self.call_groq(system_prompt, user_message, **kwargs)
        elif provider == 'gemini':
            return self.call_gemini(system_prompt, user_message, **kwargs)
        elif provider == 'claude':
            return self.call_claude(system_prompt, user_message, **kwargs)
        else:
            return {'error': f'Unknown provider: {provider}', 'tokens': 0, 'cost': 0}


# Singleton instance
llm_client = LLMClient()
