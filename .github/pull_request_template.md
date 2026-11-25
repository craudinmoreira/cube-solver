## O que muda

<!-- O quê e por quê. Link da issue, se houver: "Closes #123". -->

## Como validei

<!-- Testes, E2E, screenshot (claro e escuro, se for visual), preview do PR. -->

## Nota de versão (pt-BR)

<!--
Vai para o CHANGELOG, para a GitHub Release e para o modal "Novidades".
Escreva para quem usa o app. Mudança invisível ao usuário: apague o bloco.
Uma linha por item: tipo(escopo): texto. Ver docs/releases.md.
-->
BEGIN_COMMIT_OVERRIDE
feat(cube): **Título curto.** O que a pessoa ganha com isso.
END_COMMIT_OVERRIDE

## Checklist

- [ ] Título do PR em Conventional Commits, em inglês (`feat(cube): …`, `fix(ui): …`).
- [ ] Testes cobrindo a mudança; `npm run test:coverage` e `npm run test:e2e` passam.
- [ ] Sem segredo, `.env` ou dado pessoal no diff (o gitleaks roda no commit e no CI).
- [ ] Sem dependência nova, ou justificada acima.
- [ ] Nota de versão preenchida, ou bloco removido se não houver mudança visível.
