# Projeto Semana 05 - Consumo de APIs e DOM Dinâmico

Este repositório contém a resolução do mini projeto focado em requisições assíncronas no JavaScript. O projeto demonstra:
1. **Manipulação de Arrays:** Uso de métodos como `filter`, `reduce` e `map` para validação e transformação de dados em memória.
2. **Buscador de CEP:** Integração com a API ViaCEP, utilizando `fetch` e `async/await`, validando campos com Expressões Regulares (`RegExp`) e manipulando nós no DOM dinamicamente de forma segura (prevenindo vulnerabilidades de XSS com `textContent` e `createElement`). Conta com implementação de controle de Timeout (`AbortSignal.timeout`) e histórico de buscas.
3. **Mini Pokédex:** Integração com a PokéAPI que renderiza dinamicamente imagens e dados. Trata perfeitamente o cenário em que o usuário digita um Pokémon que não existe (Erro HTTP 404), convertendo a falha de requisição no estado "Vazio/Não Encontrado" para o usuário.

Em todas as integrações, a interface lida com os **quatro estados fundamentais de uma tela**: Carregando, Erro, Vazio (Não Encontrado) e Sucesso.

## Reflexão: Por que `Promise.all` pode ser mais rápido que vários `await` seguidos?

O uso sequencial do `await` (colocar um `await` na linha 1 e outro na linha 2) faz com que o Event Loop aguarde a primeira Promise ser totalmente resolvida antes de sequer iniciar a requisição da segunda. Se cada requisição levar 2 segundos, duas requisições levarão 4 segundos no total.

O `Promise.all([promise1, promise2])`, por outro lado, dispara todas as requisições em paralelo. Ele envia ambas as solicitações para a rede ao mesmo tempo e apenas aguarda que o conjunto inteiro seja finalizado. Dessa forma, aproveita-se melhor o tempo de latência da rede — as mesmas duas requisições de 2 segundos serão concluídas em aproximadamente 2 segundos no total, pois acontecem simultaneamente.