```javascript
// SECURE HUGGING FACE CLIENT - Implementation Following Security Requirements
// By SuperNinja AI

// ===================================================================
// SECURITY CONFIGURATION
// ===================================================================

// LISTA BLANCA DE DOMINIOS PERMITIDOS
const ALLOWED_DOMAINS = [
  'api-inference.huggingface.co',
  'huggingface.co'
];

// LISTA BLANCA DE MODELOS AUTORIZADOS
const ALLOWED_MODELS = {
  chat: [
    'gpt2',
    'gpt2-medium', 
    'gpt2-large',
    'gpt2-xl'
  ],
  image: [
    'black-forest-labs/FLUX.1-dev',
    'black-forest-labs/FLUX.1-schnell',
    'black-forest-labs/FLUX.1-schnell-4bit'
  ]
};

// ===================================================================
// VALIDACI\u00d3N DE SEGURIDAD
// ===================================================================

/**
 * Valida que el endpoint sea de Hugging Face \u00fanicamente
 * @param {string} endpoint - URL del endpoint a validar
 * @throws {Error} Si el endpoint no est\u00e1 autorizado
 */
function validateHFOnly(endpoint) {
  try {
    const url = new URL(endpoint);
    
    // Verificar dominio permitido
    if (!ALLOWED_DOMAINS.includes(url.hostname)) {
      throw new Error('BLOQUEO: Intento de usar plataforma no autorizada');
    }
    
    // Verificar que no contenga proveedores no autorizados
    const unauthorizedProviders = ['replicate', 'openai', 'stability', 'midjourney'];
    for (const provider of unauthorizedProviders) {
      if (endpoint.toLowerCase().includes(provider)) {
        throw new Error(`BLOQUEO: Detecci\u00f3n de proveedor no autorizado: ${provider}`);
      }
    }
    
    return true;
  } catch (error) {
    if (error.message.includes('BLOQUEO')) {
      throw error;
    }
    throw new Error('BLOQUEO: URL inv\u00e1lida o no autorizada');
  }
}

/**
 * Verifica que un modelo est\u00e9 en la lista blanca
 * @param {string} model - Nombre del modelo a verificar
 * @param {string} type - Tipo de modelo ('chat' o 'image')
 * @returns {boolean} True si el modelo est\u00e1 autorizado
 */
function isAllowedModel(model, type) {
  const allowedModels = ALLOWED_MODELS[type] || [];
  return allowedModels.includes(model);
}

/**
 * Verificaci\u00f3n adicional de seguridad para URLs de HF
 * @param {string} url - URL a verificar
 * @returns {boolean} True si es una URL segura de HF
 */
function isHuggingFaceEndpoint(url) {
  return url.includes('huggingface.co') && 
         !url.includes('replicate') &&
         !url.includes('openai') &&
         !url.includes('stability') &&
         !url.includes('midjourney');
}

// ===================================================================
// CLIENTE SEGURO DE HUGGING FACE
// ===================================================================

class SecureHFClient {
  constructor(apiToken) {
    if (!apiToken) {
      throw new Error('Token de Hugging Face requerido para operaci\u00f3n segura');
    }
    
    this.apiToken = apiToken;
    this.baseURL = 'https://api-inference.huggingface.co/models';
  }

  /**
   * Realiza una solicitud segura a Hugging Face
   * @param {string} model - Modelo a usar
   * @param {Object} payload - Datos a enviar
   * @param {string} type - Tipo de modelo ('chat' o 'image')
   * @returns {Promise} Resultado de la solicitud
   */
  async secureHFRequest(model, payload, type = 'image') {
    // Validar que el modelo est\u00e9 permitido
    if (!isAllowedModel(model, type)) {
      throw new Error(`BLOQUEO: Modelo no autorizado: ${model}. Modelos permitidos: ${ALLOWED_MODELS[type].join(', ')}`);
    }

    const endpoint = `${this.baseURL}/${model}`;
    
    // Validaci\u00f3n de seguridad obligatoria
    validateHFOnly(endpoint);

    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error HF (${response.status}): ${errorData.error || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error.message.includes('BLOQUEO')) {
        throw error; // Propagar errores de seguridad
      }
      throw new Error(`Error en solicitud HF: ${error.message}`);
    }
  }

  /**
   * Genera imagen con cadena de fallback segura
   * @param {string} prompt - Descripci\u00f3n de la imagen
   * @returns {Promise<string>} URL de la imagen generada
   */
  async generateImage(prompt) {
    const imageModels = ALLOWED_MODELS.image;
    const payload = { inputs: prompt };

    // Intentar modelos en orden de preferencia
    for (const model of imageModels) {
      try {
        console.log(`Intentando generar imagen con: ${model}`);
        const result = await this.secureHFRequest(model, payload, 'image');
        
        // FLUX devuelve la imagen directamente
        if (result && typeof result === 'object') {
          // Convertir a blob si es necesario
          const imageBlob = await this.processImageResult(result);
          return URL.createObjectURL(imageBlob);
        }
        
        throw new Error('Respuesta inv\u00e1lida del modelo');
      } catch (error) {
        console.warn(`Fall\u00f3 modelo ${model}: ${error.message}`);
        
        // Si es error de seguridad, no continuar
        if (error.message.includes('BLOQUEO')) {
          throw error;
        }
        
        // Continuar con siguiente modelo
        continue;
      }
    }

    throw new Error('Hugging Face no disponible, intenta m\u00e1s tarde');
  }

  /**
   * Genera texto con modelo de chat seguro
   * @param {string} prompt - Texto de entrada
   * @returns {Promise<string>} Texto generado
   */
  async generateChat(prompt) {
    const chatModels = ALLOWED_MODELS.chat;
    const payload = { inputs: prompt };

    for (const model of chatModels) {
      try {
        console.log(`Intentando generar texto con: ${model}`);
        const result = await this.secureHFRequest(model, payload, 'chat');
        
        if (result && result[0] && result[0].generated_text) {
          return result[0].generated_text;
        }
        
        throw new Error('Respuesta inv\u00e1lida del modelo de chat');
      } catch (error) {
        console.warn(`Fall\u00f3 modelo ${model}: ${error.message}`);
        
        if (error.message.includes('BLOQUEO')) {
          throw error;
        }
        
        continue;
      }
    }

    throw new Error('Hugging Face no disponible, intenta m\u00e1s tarde');
  }

  /**
   * Procesa el resultado de imagen de FLUX
   * @param {*} result - Resultado del modelo
   * @returns {Promise<Blob>} Blob de la imagen
   */
  async processImageResult(result) {
    // FLUX puede devolver la imagen como bytes o base64
    if (result.bytes) {
      return new Blob([new Uint8Array(result.bytes)], { type: 'image/png' });
    }
    
    if (typeof result === 'string') {
      // Convertir base64 a blob
      const response = await fetch(`data:image/png;base64,${result}`);
      return await response.blob();
    }
    
    throw new Error('Formato de imagen no soportado');
  }
}

// ===================================================================
// GESTOR DE INTERFAZ SEGURO
// ===================================================================

class SecureAIInterface {
  constructor() {
    this.client = null;
    this.initialized = false;
  }

  /**
   * Inicializa el cliente con token seguro
   * @param {string} apiToken - Token de HF
   */
  initialize(apiToken) {
    if (!apiToken || typeof apiToken !== 'string') {
      throw new Error('Token de HF inv\u00e1lido o ausente');
    }

    // Validar formato b\u00e1sico del token
    if (!apiToken.startsWith('hf_')) {
      throw new Error('Formato de token HF inv\u00e1lido. Debe comenzar con "hf_"');
    }

    this.client = new SecureHFClient(apiToken);
    this.initialized = true;
    console.log('Cliente HF seguro inicializado');
  }

  /**
   * Detecta tipo de solicitud y procesa
   * @param {string} userInput - Entrada del usuario
   * @returns {Promise} Resultado procesado
   */
  async processRequest(userInput) {
    if (!this.initialized) {
      throw new Error('Cliente no inicializado. Proporciona token HF.');
    }

    // Detectar si es solicitud de imagen
    const imageKeywords = ['imagen', 'imagen de', 'dibuja', 'genera', 'paisaje', 'foto', 'crea'];
    const isImageRequest = imageKeywords.some(keyword => 
      userInput.toLowerCase().includes(keyword)
    );

    if (isImageRequest) {
      return await this.client.generateImage(userInput);
    } else {
      return await this.client.generateChat(userInput);
    }
  }
}

// ===================================================================
// EXPORTACI\u00d3N Y USO
// ===================================================================

// Instancia global del gestor seguro
const secureAI = new SecureAIInterface();

// Funci\u00f3n de inicializaci\u00f3n segura
function initSecureHF(token) {
  try {
    secureAI.initialize(token);
    console.log('\u2705 Sistema HF seguro inicializado');
    console.log(`Modelos imagen disponibles: ${ALLOWED_MODELS.image.join(', ')}`);
    console.log(`Modelos chat disponibles: ${ALLOWED_MODELS.chat.join(', ')}`);
    return true;
  } catch (error) {
    console.error('\u274c Error de inicializaci\u00f3n:', error.message);
    return false;
  }
}

// Funci\u00f3n principal de uso
async function processSecureRequest(userInput) {
  try {
    const result = await secureAI.processRequest(userInput);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error en procesamiento:', error.message);
    
    // Mensajes seguros para el usuario
    if (error.message.includes('BLOQUEO')) {
      return { 
        success: false, 
        error: '\u26a0\ufe0f Error: Solo usamos Hugging Face. Modelos actuales: FLUX.1-dev, FLUX.1-schnell, FLUX.1-schnell-4bit. Todos gratuitos con tu token de HF.' 
      };
    }
    
    if (error.message.includes('Hugging Face no disponible')) {
      return { 
        success: false, 
        error: 'Hugging Face no disponible, intenta m\u00e1s tarde' 
      };
    }
    
    return { 
      success: false, 
      error: 'Error temporal. Por favor intenta m\u00e1s tarde.' 
    };
  }
}

// Exportar para uso en frontend
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SecureHFClient,
    SecureAIInterface,
    initSecureHF,
    processSecureRequest,
    ALLOWED_MODELS
  };
}

// Uso global en navegador
if (typeof window !== 'undefined') {
  window.SecureHF = {
    init: initSecureHF,
    process: processSecureRequest,
    models: ALLOWED_MODELS
  };
}
```
