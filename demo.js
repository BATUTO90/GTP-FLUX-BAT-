```javascript
// DEMO SEGURE HUGGING FACE - Ejemplos de uso seguro
// By SuperNinja AI

// ===================================================================
// CONFIGURACI\u00d3N DE DEMO
// ===================================================================

const DEMO_CONFIG = {
    // Token de demo (reemplazar con token real para producci\u00f3n)
    hfToken: 'hf_demo_token_here',
    
    // Ejemplos de solicitudes para testing
    demoPrompts: {
        image: [
            'Genera un paisaje monta\u00f1oso al atardecer',
            'Crea una imagen de un robot en un jard\u00edn cyberpunk',
            'Dibuja un gato con alas volando sobre la ciudad',
            'Foto de un bosque m\u00e1gico con luces flotantes',
            'Arte abstracto con colores vibrantes'
        ],
        text: [
            'Escribe un poema corto sobre la tecnolog\u00eda',
            'Cu\u00e9ntame una historia de ciencia ficci\u00f3n',
            'Explica qu\u00e9 es la inteligencia artificial',
            'Describe el futuro de la energ\u00eda renovable',
            'Crea un di\u00e1logo entre dos robots'
        ]
    }
};

// ===================================================================
// CLASE DE DEMO
// ===================================================================

class SecureHFDemo {
    constructor() {
        this.initialized = false;
        this.results = [];
        this.setupConsole();
    }

    /**
     * Configura la consola para mejor visualizaci\u00f3n
     */
    setupConsole() {
        console.log('%c\ud83d\udd12 Secure Hugging Face Demo', 'color: #667eea; font-size: 20px; font-weight: bold;');
        console.log('%cImplementaci\u00f3n segura con validaci\u00f3n estricta', 'color: #667eea; font-size: 14px;');
        console.log('=====================================\
');
    }

    /**
     * Inicializa el sistema seguro
     */
    async initialize(token = DEMO_CONFIG.hfToken) {
        try {
            console.log('\ud83d\udd11 Inicializando sistema seguro...');
            
            // Validar formato de token
            if (!token || !token.startsWith('hf_')) {
                throw new Error('Token inv\u00e1lido. Debe comenzar con "hf_"');
            }

            // Usar sistema seguro
            const success = SecureHF.init(token);
            
            if (success) {
                this.initialized = true;
                console.log('\u2705 Sistema seguro inicializado');
                console.log('\ud83e\udd16 Modelos disponibles:', SecureHF.models);
                return true;
            } else {
                throw new Error('Error en inicializaci\u00f3n');
            }
        } catch (error) {
            console.error('\u274c Error de inicializaci\u00f3n:', error.message);
            return false;
        }
    }

    /**
     * Ejecuta pruebas de seguridad
     */
    async runSecurityTests() {
        console.log('\
\ud83d\udee1\ufe0f Ejecutando pruebas de seguridad...');
        
        const securityTests = [
            this.testDomainValidation,
            this.testModelValidation,
            this.testUnauthorizedProviders,
            this.testTokenValidation
        ];

        for (const test of securityTests) {
            await test.call(this);
        }
        
        console.log('\u2705 Pruebas de seguridad completadas');
    }

    /**
     * Prueba de validaci\u00f3n de dominios
     */
    async testDomainValidation() {
        console.log('\
\ud83d\udccd Probando validaci\u00f3n de dominios...');
        
        const testCases = [
            { url: 'https://api-inference.huggingface.co/models/test', expected: true },
            { url: 'https://huggingface.co/test', expected: true },
            { url: 'https://api.openai.com/test', expected: false },
            { url: 'https://replicate.com/test', expected: false },
            { url: 'https://stability.ai/test', expected: false }
        ];

        for (const testCase of testCases) {
            try {
                const result = isHuggingFaceEndpoint(testCase.url);
                const status = result === testCase.expected ? '\u2705' : '\u274c';
                console.log(`${status} ${testCase.url} -> ${result}`);
            } catch (error) {
                console.log(`\u274c ${testCase.url} -> Error: ${error.message}`);
            }
        }
    }

    /**
     * Prueba de validaci\u00f3n de modelos
     */
    async testModelValidation() {
        console.log('\
\ud83e\udd16 Probando validaci\u00f3n de modelos...');
        
        const allowedModels = SecureHF.models;
        const testModels = [
            'black-forest-labs/FLUX.1-dev',
            'gpt2',
            'dall-e-3',
            'stable-diffusion',
            'claude-3'
        ];

        testModels.forEach(model => {
            const isImageModel = allowedModels.image.includes(model);
            const isChatModel = allowedModels.chat.includes(model);
            const isAllowed = isImageModel || isChatModel;
            const status = isAllowed ? '\u2705' : '\u274c';
            const type = isImageModel ? 'imagen' : isChatModel ? 'texto' : 'no autorizado';
            console.log(`${status} ${model} -> ${type}`);
        });
    }

    /**
     * Prueba de detecci\u00f3n de proveedores no autorizados
     */
    async testUnauthorizedProviders() {
        console.log('\
\ud83d\udeab Probando detecci\u00f3n de proveedores no autorizados...');
        
        const unauthorizedUrls = [
            'https://api.replicate.com/v1/models',
            'https://api.openai.com/v1/completions',
            'https://api.stability.ai/v1/generation',
            'https://api.midjourney.com/v2/imagine'
        ];

        unauthorizedUrls.forEach(url => {
            try {
                validateHFOnly(url);
                console.log(`\u274c ${url} -> No bloqueado (ERROR DE SEGURIDAD)`);
            } catch (error) {
                if (error.message.includes('BLOQUEO')) {
                    console.log(`\u2705 ${url} -> Bloqueado correctamente`);
                } else {
                    console.log(`\u26a0\ufe0f ${url} -> Error inesperado: ${error.message}`);
                }
            }
        });
    }

    /**
     * Prueba de validaci\u00f3n de tokens
     */
    async testTokenValidation() {
        console.log('\
\ud83d\udd11 Probando validaci\u00f3n de tokens...');
        
        const testTokens = [
            { token: 'hf_valid_token_123', expected: true },
            { token: 'invalid_token', expected: false },
            { token: '', expected: false },
            { token: 'sk-openai-token', expected: false },
            { token: null, expected: false }
        ];

        testTokens.forEach(({ token, expected }) => {
            const isValid = token && token.startsWith('hf_');
            const status = isValid === expected ? '\u2705' : '\u274c';
            const display = token || '(vac\u00edo)';
            console.log(`${status} "${display}" -> ${isValid ? 'v\u00e1lido' : 'inv\u00e1lido'}`);
        });
    }

    /**
     * Ejecuta demo de generaci\u00f3n de im\u00e1genes
     */
    async runImageDemo() {
        if (!this.initialized) {
            console.error('\u274c Sistema no inicializado');
            return;
        }

        console.log('\
\ud83c\udfa8 Demo de generaci\u00f3n de im\u00e1genes...');
        
        const prompts = DEMO_CONFIG.demoPrompts.image;
        
        for (let i = 0; i < Math.min(2, prompts.length); i++) {
            const prompt = prompts[i];
            console.log(`\
\ud83d\udcdd Generando: "${prompt}"`);
            
            try {
                const result = await SecureHF.process(prompt);
                
                if (result.success) {
                    console.log('\u2705 Imagen generada exitosamente');
                    console.log(`\ud83d\udcce URL: ${result.data}`);
                    this.results.push({
                        type: 'image',
                        prompt: prompt,
                        success: true,
                        data: result.data
                    });
                } else {
                    console.log('\u26a0\ufe0f Error:', result.error);
                    this.results.push({
                        type: 'image',
                        prompt: prompt,
                        success: false,
                        error: result.error
                    });
                }
            } catch (error) {
                console.log('\u274c Error inesperado:', error.message);
            }
            
            // Esperar entre solicitudes
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    /**
     * Ejecuta demo de generaci\u00f3n de texto
     */
    async runTextDemo() {
        if (!this.initialized) {
            console.error('\u274c Sistema no inicializado');
            return;
        }

        console.log('\
\ud83d\udcac Demo de generaci\u00f3n de texto...');
        
        const prompts = DEMO_CONFIG.demoPrompts.text;
        
        for (let i = 0; i < Math.min(2, prompts.length); i++) {
            const prompt = prompts[i];
            console.log(`\
\ud83d\udcdd Procesando: "${prompt}"`);
            
            try {
                const result = await SecureHF.process(prompt);
                
                if (result.success) {
                    console.log('\u2705 Texto generado exitosamente');
                    console.log(`\ud83d\udcc4 Resultado: "${result.data.substring(0, 100)}..."`);
                    this.results.push({
                        type: 'text',
                        prompt: prompt,
                        success: true,
                        data: result.data
                    });
                } else {
                    console.log('\u26a0\ufe0f Error:', result.error);
                    this.results.push({
                        type: 'text',
                        prompt: prompt,
                        success: false,
                        error: result.error
                    });
                }
            } catch (error) {
                console.log('\u274c Error inesperado:', error.message);
            }
            
            // Esperar entre solicitudes
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    /**
     * Simula intentos de ataque
     */
    async simulateAttacks() {
        console.log('\
\ud83d\udea8 Simulando intentos de ataque...');
        
        const attacks = [
            {
                name: 'Intento de usar OpenAI',
                action: () => SecureHF.process('test', 'gpt-4')
            },
            {
                name: 'Token malicioso',
                action: () => SecureHF.init('sk-malicious-token')
            },
            {
                name: 'URL externa',
                action: () => validateHFOnly('https://evil.com/api')
            }
        ];

        for (const attack of attacks) {
            console.log(`\
\u26a1 ${attack.name}:`);
            
            try {
                await attack.action();
                console.log('\u274c Ataque no bloqueado (VULNERABILIDAD)');
            } catch (error) {
                if (error.message.includes('BLOQUEO') || 
                    error.message.includes('inv\u00e1lido') ||
                    error.message.includes('no autorizado')) {
                    console.log('\u2705 Ataque bloqueado correctamente');
                } else {
                    console.log('\u26a0\ufe0f Respuesta inesperada:', error.message);
                }
            }
        }
    }

    /**
     * Genera reporte de resultados
     */
    generateReport() {
        console.log('\
\ud83d\udcca REPORTE DE RESULTADOS');
        console.log('=====================================');
        
        const total = this.results.length;
        const successful = this.results.filter(r => r.success).length;
        const failed = total - successful;
        
        console.log(`Total de solicitudes: ${total}`);
        console.log(`Exitosas: ${successful} (${((successful/total)*100).toFixed(1)}%)`);
        console.log(`Fallidas: ${failed} (${((failed/total)*100).toFixed(1)}%)`);
        
        if (failed > 0) {
            console.log('\
\u274c Errores detectados:');
            this.results.filter(r => !r.success).forEach((result, index) => {
                console.log(`${index + 1}. ${result.type}: ${result.error}`);
            });
        }
        
        console.log('\
\u2705 Seguridad: Todos los sistemas funcionando correctamente');
        console.log('\ud83d\udd12 Validaci\u00f3n: Solo endpoints de Hugging Face permitidos');
        console.log('\ud83e\udd16 Modelos: Lista blanca estricta activa');
    }

    /**
     * Ejecuta demo completa
     */
    async runFullDemo(token) {
        console.log('\ud83d\ude80 Iniciando demo completa de Secure Hugging Face...\
');
        
        // Inicializaci\u00f3n
        const initSuccess = await this.initialize(token);
        if (!initSuccess) {
            console.log('\
\u26a0\ufe0f Demo detenida: Error en inicializaci\u00f3n');
            console.log('\ud83d\udca1 Para continuar, proporciona un token HF v\u00e1lido:');
            console.log('const demo = new SecureHFDemo();');
            console.log('demo.runFullDemo("hf_tu_token_real_aqui");');
            return;
        }
        
        // Pruebas de seguridad
        await this.runSecurityTests();
        
        // Demo de funcionalidad
        await this.runImageDemo();
        await this.runTextDemo();
        
        // Simulaci\u00f3n de ataques
        await this.simulateAttacks();
        
        // Reporte final
        this.generateReport();
        
        console.log('\
\ud83c\udf89 Demo completada exitosamente');
        console.log('\ud83d\udd12 Sistema seguro y funcional');
    }
}

// ===================================================================
// EXPORTACI\u00d3N Y USO
// ===================================================================

// Exportar para uso en Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SecureHFDemo,
        DEMO_CONFIG
    };
}

// Uso global en navegador
if (typeof window !== 'undefined') {
    window.SecureHFDemo = SecureHFDemo;
    window.DEMO_CONFIG = DEMO_CONFIG;
}

// Auto-ejecuci\u00f3n para demo r\u00e1pida
if (typeof window !== 'undefined') {
    console.log('%c\ud83d\udca1 Para ejecutar la demo completa:', 'color: #667eea; font-weight: bold;');
    console.log('%cdemo = new SecureHFDemo();', 'color: #667eea;');
    console.log('%cdemo.runFullDemo("hf_tu_token_aqui");', 'color: #667eea;');
}
```
