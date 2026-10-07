import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const SYSTEM_INSTRUCTION = `Eres DevAssistant, el asistente experto de ingeniería de sistemas, arquitectura de software, DevSecOps y despliegues CI/CD de la plataforma DevOpsHub AI.
Responde siempre en español de forma clara, estructurada, concisa y orientada a código listo para producción.
Tus áreas principales son:
1. Arquitectura de Software & Microservicios (DDD, Event-Driven, API Gateways, resiliencia, Circuit Breakers, Kubernetes).
2. Ciberseguridad & OWASP Top 10 (prevención de inyecciones, gestión de secretos, OAuth2/OIDC, escaneo SAST/DAST, contenedores sin privilegios root).
3. Plantillas CI/CD (GitHub Actions, GitLab CI, despliegues Canary/Blue-Green, Docker multi-stage, Terraform/IaC).
4. Estándares de Código (Clean Code, SOLID, pruebas automatizadas, linters, observabilidad OpenTelemetry).
Cuando incluyas fragmentos de configuración o código, utiliza bloques de código con sintaxis clara.`;

app.post('/api/dev-assistant', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'El mensaje es obligatorio.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.json({
        reply: generateFallbackEngineeringResponse(message),
        source: 'local-knowledge-base',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const formattedContents = Array.isArray(history)
      ? [
          ...history.map((m: { role: string; text: string }) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.text }],
          })),
          { role: 'user', parts: [{ text: message }] },
        ]
      : message;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });

    const text = response.text || generateFallbackEngineeringResponse(message);
    return res.json({ reply: text, source: 'gemini' });
  } catch (error) {
    console.error('Error en /api/dev-assistant:', error);
    const { message } = req.body || {};
    return res.json({
      reply: generateFallbackEngineeringResponse(message || ''),
      source: 'fallback',
    });
  }
});

function generateFallbackEngineeringResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('owasp') || q.includes('seguridad') || q.includes('ciberseguridad')) {
    return `### Recomendación OWASP & DevSecOps

Para endurecer tus servicios en producción según el estándar **OWASP Top 10**:

1. **A01 Broken Access Control**: Valida permisos y roles en el API Gateway y en cada microservicio mediante tokens JWT firmados (RS256) con expiración corta.
2. **A02 Cryptographic Failures**: Fuerza TLS 1.3 en tránsito y almacena secretos exclusivamente en gestores dedicados (Vault / Secret Manager), nunca en variables de entorno planas en el repositorio.
3. **Contenedores sin Root**:

\`\`\`dockerfile
FROM node:22-alpine AS runner
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
USER appuser
EXPOSE 8080
CMD ["node", "dist/main.js"]
\`\`\``;
  }

  if (q.includes('ci/cd') || q.includes('github') || q.includes('gitlab') || q.includes('pipeline')) {
    return `### Plantilla Estándar de Pipeline CI/CD

Estructura recomendada con validación de tipos, auditoría SAST, construcción multi-etapa y despliegue automatizado:

\`\`\`yaml
name: Production CI/CD Pipeline
on:
  push:
    branches: [ main ]
jobs:
  verify-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npm run lint && npm test
      - run: npm audit --audit-level=high
      - run: npm run build
\`\`\``;
  }

  return `### Guía de Ingeniería — DevOpsHub AI

He procesado tu consulta sobre **"${query}"**. En nuestra arquitectura de referencia recomendamos:

- **Desacoplamiento por Dominios (DDD)**: Definir contratos estrictos mediante OpenAPI 3.1 o gRPC antes de implementar la lógica del servicio.
- **Observabilidad Unificada**: Instrumentar trazas distribuidas con OpenTelemetry (\`trace_id\`, \`span_id\`) y logs estructurados en formato JSON.
- **Resiliencia**: Configurar *Circuit Breakers*, timeouts explícitos (máximo 3000ms entre servicios internos) y políticas de *Retry with Exponential Backoff*.`;
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DevOpsHub AI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
