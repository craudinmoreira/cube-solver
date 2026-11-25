# Política de segurança

## Reportar uma vulnerabilidade

Não abra uma issue pública. Use o **[reporte privado de vulnerabilidade](https://github.com/craudinmoreira/cube-solver/security/advisories/new)** do GitHub. Respondo em até 7 dias.

## Escopo

O Virtual Cube Solver é um webapp estático (React + Three.js) servido pelo Firebase Hosting. Ele não tem backend, não cria contas e não coleta dados. O que importa aqui:

- Injeção de script (XSS) ou bypass da Content Security Policy.
- Segredos vazados no repositório ou nos artefatos de build.
- Comprometimento da cadeia de build e deploy (GitHub Actions, dependências).

## Medidas em vigor

| Camada | Medida |
|---|---|
| Commits | gitleaks no pre-commit e no CI (`.gitleaks.toml`); secret scanning e push protection do GitHub |
| Dependências | Dependabot semanal, `npm audit` e dependency review no CI |
| Navegador | CSP restrita a `'self'`, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy e Permissions-Policy (`firebase.json`); fontes servidas localmente |
| Deploy | OIDC sem chave, build sem credencial, produção só por release com aprovação; runner self-hosted só para eventos confiáveis (`docs/deploy.md`) |

## Histórico

- [Auditoria de 2026-11](docs/security/audit-2026-11.md)
