---
name: security-audit
description: Auditoria periódica de segurança e performance do cube-solver, cobrindo segredos no histórico, dependências, headers em produção, alertas do GitHub, workflows e bundle, registrada em docs/security/audit-AAAA-MM.md com um PR de correções. Use quando a pessoa pedir auditoria, revisão de segurança ou checagem de vazamento.
---

# Auditoria

Modelo: `docs/security/audit-2026-11.md`. Registre cada achado com severidade e o PR que o trata.

## 1. Segredos

```bash
npm run secrets      # gitleaks em todo o histórico, todas as branches
gh api repos/{owner}/{repo}/secret-scanning/alerts --jq '.[] | select(.state=="open")'
```

Vazamento confirmado: **pare e avise a pessoa na hora**. Rotacionar a credencial vem antes de limpar o histórico, e reescrever histórico exige aprovação explícita.

## 2. Dependências

```bash
npm audit
npm outdated
gh api repos/{owner}/{repo}/dependabot/alerts --jq '.[] | select(.state=="open") | .security_advisory.summary'
```

## 3. Produção

```bash
curl -sI https://virtual-cube-solver.web.app | grep -iE 'content-security|x-frame|x-content-type|referrer|permissions|strict-transport|cache-control'
```

Confira que a CSP ainda é `'self'` e que nenhum recurso de terceiros entrou (o E2E também checa).

## 4. Código e workflows

```bash
gh api "repos/{owner}/{repo}/code-scanning/alerts?state=open" --jq '.[] | "\(.rule.severity) \(.rule.id) \(.most_recent_instance.location.path)"'
grep -rn "uses:" .github/workflows | grep -vE '@[0-9a-f]{40}'   # actions sem SHA
grep -rn "pull_request_target\|secrets\.\|id-token" .github/workflows
```

Confira contra o `AGENTS.md` e o `docs/deploy.md`: permissões mínimas, código de PR nunca roda com credencial nem no self-hosted, e o OIDC continua restrito ao `repository_id`.

## 5. Performance

```bash
npm run build && npm run size
```

Compare com a auditoria anterior. Regressões de render se medem com contadores temporários (veja o PR de performance #5), nunca commitados.

## 6. Registrar e corrigir

1. Escreva `docs/security/audit-AAAA-MM.md` e adicione a linha em `SECURITY.md › Histórico`.
2. Corrija o que for direto num PR (`fix(security): …`). O que precisar de decisão vai como pergunta à pessoa, com recomendação.
