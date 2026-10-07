export interface TechnicalGuideCard {
  id: 'arquitectura' | 'seguridad' | 'cicd';
  number: string;
  title: string;
  subtitle: string;
  category: string;
  readingTime: string;
  updatedAt: string;
  metrics: {
    label: string;
    value: string;
  }[];
  summaryPoints: string[];
  codeFilename: string;
  codeLanguage: string;
  codeSnippet: string;
}

export interface OwaspChecklistItem {
  id: string;
  code: string;
  title: string;
  severity: 'Crítica' | 'Alta' | 'Media';
  description: string;
  remediationCode: string;
  defaultChecked?: boolean;
}

export interface PipelineTemplate {
  id: string;
  platform: 'GitHub Actions' | 'GitLab CI' | 'Docker Multi-Stage';
  name: string;
  filename: string;
  description: string;
  stages: string[];
  avgDuration: string;
  yamlContent: string;
}

export interface CodeStandardItem {
  id: string;
  domain: string;
  title: string;
  ruleId: string;
  rationale: string;
  badExample: string;
  goodExample: string;
}

export const TECHNICAL_DASHBOARD_CARDS: TechnicalGuideCard[] = [
  {
    id: 'arquitectura',
    number: '01',
    title: 'Guía de Arquitectura de Software & Microservicios',
    subtitle:
      'Patrones de diseño distribuido, Domain-Driven Design (DDD), comunicación asíncrona por eventos y resiliencia con Circuit Breakers.',
    category: 'Arquitectura de Sistemas',
    readingTime: '14 min lectura',
    updatedAt: 'Oct 2026',
    metrics: [
      { label: 'Disponibilidad Objetivo', value: '99.95%' },
      { label: 'Latencia P99 Gateway', value: '< 45 ms' },
    ],
    summaryPoints: [
      'Aislamiento estricto de bases de datos por contexto delimitado (Bounded Context) con patrón Outbox transaccional.',
      'Implementación de API Gateway con límite de tasa (Rate Limiting), validación de esquemas OpenAPI 3.1 y trazabilidad OpenTelemetry.',
      'Políticas de tolerancia a fallos: Timeouts explícitos, Circuit Breaker y reintentos con retroceso exponencial y jitter.',
    ],
    codeFilename: 'resilient-order-service.ts',
    codeLanguage: 'typescript',
    codeSnippet: `// Patrón Circuit Breaker + Propagación de Contexto OpenTelemetry
export interface ServiceCallConfig {
  timeoutMs: number;
  maxRetries: number;
  failureThreshold: number;
}

export async function invokeInventoryService(
  orderId: string,
  traceId: string,
  config: ServiceCallConfig = { timeoutMs: 2200, maxRetries: 3, failureThreshold: 5 }
): Promise<{ reserved: boolean; warehouseNode: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch('https://inventory.internal.svc/v1/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-B3-TraceId': traceId,
        'X-Idempotency-Key': \`resv_\${orderId}\`,
      },
      body: JSON.stringify({ orderId, timestamp: new Date().toISOString() }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(\`Upstream HTTP \${response.status}\`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}`,
  },
  {
    id: 'seguridad',
    number: '02',
    title: 'Checklist de Ciberseguridad & OWASP',
    subtitle:
      'Controles de endurecimiento DevSecOps, prevención de vulnerabilidades OWASP Top 10, gestión de secretos y contenedores sin privilegios root.',
    category: 'Seguridad & DevSecOps',
    readingTime: '11 min lectura',
    updatedAt: 'Oct 2026',
    metrics: [
      { label: 'Controles OWASP', value: '10 / 10' },
      { label: 'Escaneo SAST/DAST', value: 'Bloqueante' },
    ],
    summaryPoints: [
      'Validación de control de acceso basado en roles (RBAC) y atributos (ABAC) en cada endpoint mediante middleware verificable.',
      'Eliminación de secretos hardcodeados mediante rotación automática en Vault / Secret Manager y firmas OIDC sin llaves estáticas.',
      'Cabeceras de seguridad HTTP estrictas (CSP, HSTS, X-Content-Type-Options) y sanitización parametrizada contra inyecciones SQL/NoSQL.',
    ],
    codeFilename: 'security-headers.middleware.ts',
    codeLanguage: 'typescript',
    codeSnippet: `// Configuración de Endurecimiento HTTP y Prevención OWASP A01/A05
import type { Request, Response, NextFunction } from 'express';

export function enforceZeroTrustHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests;"
  );
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Verificación de cabecera de correlación para auditoría SIEM
  if (!req.headers['x-request-id']) {
    res.setHeader('X-Request-Id', crypto.randomUUID());
  }
  next();
}`,
  },
  {
    id: 'cicd',
    number: '03',
    title: 'Plantillas de CI/CD (GitHub Actions, GitLab CI)',
    subtitle:
      'Pipelines automatizados de integración y entrega continua con compilación determinista, análisis de vulnerabilidades y despliegue Canary.',
    category: 'Automatización & Entrega',
    readingTime: '9 min lectura',
    updatedAt: 'Oct 2026',
    metrics: [
      { label: 'Tiempo Medio de Build', value: '3m 40s' },
      { label: 'Estrategia Release', value: 'Canary / OIDC' },
    ],
    summaryPoints: [
      'Ejecución en paralelo de verificación de tipos estáticos, pruebas unitarias con cobertura mínima del 85% y auditoría SAST.',
      'Construcción de imágenes OCI multi-etapa con caché en registro distribuido y firma criptográfica Cosign.',
      'Despliegue progresivo en clústeres Kubernetes con reversión automática (Auto-Rollback) ante degradación de métricas.',
    ],
    codeFilename: '.github/workflows/production-release.yml',
    codeLanguage: 'yaml',
    codeSnippet: `name: Production Release Pipeline
on:
  push:
    branches: [ main ]

permissions:
  id-token: write
  contents: read

jobs:
  quality-and-security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci --ignore-scripts
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm audit --audit-level=high`,
  },
];

export const OWASP_CHECKLIST_ITEMS: OwaspChecklistItem[] = [
  {
    id: 'owasp-a01',
    code: 'A01:2025',
    title: 'Broken Access Control — Validación de Propiedad y Roles en Servidor',
    severity: 'Crítica',
    description:
      'Denegar acceso por defecto y verificar en cada petición que el sujeto autenticado posee autorización explícita sobre el identificador de recurso solicitado (prevención de IDOR).',
    remediationCode: `if (resource.organizationId !== req.user.orgId && !req.user.roles.includes('PLATFORM_ADMIN')) {\n  return res.status(403).json({ error: 'Acceso denegado al recurso solicitado' });\n}`,
    defaultChecked: true,
  },
  {
    id: 'owasp-a02',
    code: 'A02:2025',
    title: 'Cryptographic Failures — TLS 1.3 y Gestión de Secretos en Bóveda',
    severity: 'Crítica',
    description:
      'Prohibir claves privadas o credenciales en el repositorio. Cifrar datos sensibles en reposo con AES-256-GCM y emplear Argon2id para el hash de contraseñas.',
    remediationCode: `const hash = await argon2.hash(plainPassword, {\n  type: argon2.argon2id,\n  memoryCost: 65536,\n  timeCost: 3,\n});`,
    defaultChecked: true,
  },
  {
    id: 'owasp-a03',
    code: 'A03:2025',
    title: 'Injection — Consultas Parametrizadas y Validación de Esquemas',
    severity: 'Crítica',
    description:
      'Utilizar exclusivamente sentencias preparadas o constructores tipados y validar cargas útiles de entrada con esquemas estrictos antes de tocar la capa de persistencia.',
    remediationCode: `const result = await db.query(\n  'SELECT id, email, role FROM users WHERE organization_id = $1 AND status = $2',\n  [orgId, 'ACTIVE']\n);`,
    defaultChecked: true,
  },
  {
    id: 'owasp-a05',
    code: 'A05:2025',
    title: 'Security Misconfiguration — Contenedores Distroless / Non-Root',
    severity: 'Alta',
    description:
      'Ejecutar procesos de aplicación con un usuario sin privilegios (UID >= 10001), sistema de archivos raíz de solo lectura y capacidades del kernel de Linux recortadas.',
    remediationCode: `securityContext:\n  runAsNonRoot: true\n  runAsUser: 10001\n  readOnlyRootFilesystem: true\n  allowPrivilegeEscalation: false`,
    defaultChecked: false,
  },
  {
    id: 'owasp-a07',
    code: 'A07:2025',
    title: 'Identification and Authentication Failures — Tokens JWT de Corta Vida',
    severity: 'Alta',
    description:
      'Emitir tokens de acceso con expiración máxima de 15 minutos firmados asimétricamente (RS256/EdDSA) y rotación estricta de Refresh Tokens con detección de reúso.',
    remediationCode: `const accessToken = jwt.sign({ sub: user.id, scope: user.scopes }, privateKey, {\n  algorithm: 'RS256',\n  expiresIn: '15m',\n  issuer: 'https://auth.devopshub.internal',\n});`,
    defaultChecked: false,
  },
  {
    id: 'owasp-a08',
    code: 'A08:2025',
    title: 'Software and Data Integrity Failures — Verificación SBOM y Lockfiles',
    severity: 'Media',
    description:
      'Instalar dependencias de manera determinista mediante npm ci --ignore-scripts y verificar firmas de procedencia en el pipeline CI/CD.',
    remediationCode: `npm ci --ignore-scripts && npx @cyclonedx/cyclonedx-npm --output-file sbom.json`,
    defaultChecked: false,
  },
];

export const PIPELINE_TEMPLATES: PipelineTemplate[] = [
  {
    id: 'gh-actions-k8s',
    platform: 'GitHub Actions',
    name: 'GitHub Actions — Build, Escaneo SAST & Despliegue Kubernetes',
    filename: '.github/workflows/ci-cd-kubernetes.yml',
    description:
      'Flujo completo para servicios Node.js/TypeScript con caché de dependencias, análisis estático, construcción de imagen OCI y despliegue mediante autenticación OIDC sin claves estáticas.',
    stages: ['Checkout & Cache', 'Typecheck & Unit Tests', 'Trivy Container Scan', 'Rollout GKE/EKS'],
    avgDuration: '3m 45s',
    yamlContent: `name: CI/CD Microservice Pipeline

on:
  push:
    branches: [ "main", "release/*" ]
  pull_request:
    branches: [ "main" ]

permissions:
  id-token: write
  contents: read
  security-events: write

jobs:
  verify:
    name: Lint, Typecheck & Unit Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout código fuente
        uses: actions/checkout@v4

      - name: Configurar entorno Node.js 22 LTS
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Instalación determinista
        run: npm ci --ignore-scripts

      - name: Verificación de tipos y linter
        run: npm run lint

      - name: Pruebas unitarias y cobertura
        run: npm test -- --ci --coverage

  build-and-scan:
    name: Build Docker & Escaneo Trivy
    needs: verify
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Construir imagen multi-stage
        run: docker build -t registry.devopshub.io/core-api:\${{ github.sha }} .

      - name: Escaneo de vulnerabilidades de contenedor (Trivy)
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'registry.devopshub.io/core-api:\${{ github.sha }}'
          format: 'table'
          exit-code: '1'
          ignore-unfixed: true
          severity: 'CRITICAL,HIGH'`,
  },
  {
    id: 'gitlab-ci-enterprise',
    platform: 'GitLab CI',
    name: 'GitLab CI — Pipeline Multi-Etapa con SAST y Despliegue Canary',
    filename: '.gitlab-ci.yml',
    description:
      'Plantilla corporativa para GitLab CI/CD con artefactos en caché, pruebas de integración con servicios efímeros PostgreSQL/Redis y despliegue gradual Canary en producción.',
    stages: ['validate', 'test', 'security', 'package', 'deploy_canary'],
    avgDuration: '4m 15s',
    yamlContent: `stages:
  - validate
  - test
  - security
  - package
  - deploy_canary

variables:
  DOCKER_DRIVER: overlay2
  NODE_OPTIONS: "--max-old-space-size=4096"

cache:
  key: \${CI_COMMIT_REF_SLUG}
  paths:
    - .npm/

lint_and_types:
  stage: validate
  image: node:22-alpine
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run lint

integration_tests:
  stage: test
  image: node:22-alpine
  services:
    - postgres:16-alpine
    - redis:7-alpine
  variables:
    POSTGRES_DB: test_db
    POSTGRES_USER: runner
    POSTGRES_PASSWORD: runner_password
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run test:integration

deploy_production_canary:
  stage: deploy_canary
  image: bitnami/kubectl:latest
  only:
    - main
  script:
    - kubectl set image deployment/core-api-canary core-api=\$CI_REGISTRY_IMAGE:\$CI_COMMIT_SHA -n prod
    - kubectl rollout status deployment/core-api-canary -n prod --timeout=120s`,
  },
  {
    id: 'docker-multistage-hardened',
    platform: 'Docker Multi-Stage',
    name: 'Dockerfile Multi-Stage Endurecido (Non-Root + Imagen Mínima)',
    filename: 'Dockerfile.production',
    description:
      'Construcción optimizada en tres etapas que separa dependencias de compilación y genera una imagen final ligera ejecutada con usuario sin privilegios.',
    stages: ['deps', 'builder', 'runner-non-root'],
    avgDuration: '1m 20s',
    yamlContent: `# Etapa 1: Instalación aislada de dependencias
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Etapa 2: Compilación de artefactos TypeScript y Frontend
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm prune --production

# Etapa 3: Imagen de ejecución endurecida sin privilegios root
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

RUN addgroup -g 10001 -S nodejs && adduser -S appuser -u 10001 -G nodejs
COPY --from=builder --chown=appuser:nodejs /app/dist ./dist
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/package.json ./package.json

USER 10001
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/healthz || exit 1

CMD ["node", "dist/main.js"]`,
  },
];

export const CODE_STANDARDS_LIST: CodeStandardItem[] = [
  {
    id: 'std-error-handling',
    domain: 'Resiliencia & Tipado',
    title: 'Errores de Dominio Tipados y Respuestas RFC 9457 (Problem Details)',
    ruleId: 'STD-ARCH-01',
    rationale:
      'Evita capturar excepciones genéricas silenciosas o devolver cadenas de texto arbitrarias. Estandariza los errores HTTP con códigos semánticos trazables.',
    badExample: `try {\n  await processPayment(order);\n} catch (e: any) {\n  // Anti-patrón: pierde stacktrace y expone detalles internos\n  res.status(500).send(e.message);\n}`,
    goodExample: `try {\n  await processPayment(order);\n} catch (error) {\n  logger.error({ err: error, orderId: order.id, traceId: req.traceId }, 'Fallo en pasarela');\n  res.status(502).json({\n    type: 'https://devopshub.internal/errors/upstream-payment-timeout',\n    title: 'Pasarela de pagos temporalmente no disponible',\n    status: 502,\n    instance: req.originalUrl,\n    traceId: req.traceId,\n  });\n}`,
  },
  {
    id: 'std-structured-logging',
    domain: 'Observabilidad & Telemetría',
    title: 'Logs Estructurados en JSON con Correlación de Trazas (OpenTelemetry)',
    ruleId: 'STD-OBS-02',
    rationale:
      'Los mensajes con console.log impiden indexación eficiente y correlación entre microservicios. Todo evento debe incluir nivel, timestamp ISO-8601, service_name y trace_id.',
    badExample: `console.log("Usuario " + userId + " actualizó configuración de facturación");`,
    goodExample: `logger.info({\n  event: 'billing.config.updated',\n  actorId: userId,\n  organizationId: orgId,\n  traceId: span.spanContext().traceId,\n}, 'Configuración de facturación actualizada correctamente');`,
  },
  {
    id: 'std-env-validation',
    domain: 'Configuración & 12-Factor App',
    title: 'Validación Estricta de Variables de Entorno al Arranque (Fail-Fast)',
    ruleId: 'STD-CFG-03',
    rationale:
      'El servicio debe validar todas las variables de entorno requeridas en el instante de inicialización antes de aceptar tráfico HTTP.',
    badExample: `// Si DATABASE_URL no está definida, fallará en producción durante la primera petición\nconst dbUrl = process.env.DATABASE_URL!;`,
    goodExample: `function requireEnv(name: string): string {\n  const val = process.env[name];\n  if (!val || val.trim() === '') {\n    throw new Error(\`[Config Error] Variable de entorno obligatoria ausente: \${name}\`);\n  }\n  return val;\n}\nexport const config = {\n  databaseUrl: requireEnv('DATABASE_URL'),\n  port: Number(process.env.PORT ?? 8080),\n};`,
  },
];
