# CATÁLOGO CHILI

Catálogo de malaguetas para a cozinha: picante (escala de Scoville), aroma, origem, pratos, harmonizações, cuidados e identificação por fotografia. Sete línguas (português, inglês, alemão, francês, italiano, espanhol e chinês), adaptado a computador e telemóvel.

- **159 variedades**: a coleção de Edgar Andrade (87, 64 com fotografia) e 72 variedades de referência, cada uma com fontes.
- Primeiro as fotografadas, da mais picante para a menos picante; filtros por picante, aroma, refeição, preparação, tradição, origem, espécie e coleção; mapa e gráfico picante × aroma.
- **Iniciar coleção**: cada visitante pode criar a sua coleção, com fotografias e datas. Nada é obrigatório e a coleção é privada por defeito; só aparece na comunidade se a pessoa o escolher.

Desenvolvido por Jorge dos Santos ([@jmns.santos](https://www.instagram.com/jmns.santos/)), com recurso a inteligência artificial.
Sementes, produção e identificação: Edgar Andrade ([@ed_racso](https://www.instagram.com/ed_racso/)).

© 2026 · Póvoa de Varzim, Porto, Portugal

## Técnica

Site estático (HTML, CSS e JavaScript), sem servidor próprio nem cookies de publicidade ou estatística. A página principal é `index.html`; a configuração está em `config.js`. Funciona sem rede depois da primeira visita e pode instalar-se no telemóvel.

A comunidade online é opcional e usa o Supabase (contas por email, regras de acesso por linha, fotografias num balde privado). Enquanto `config.js` não tiver os dados do Supabase, cada pessoa guarda a coleção só no próprio aparelho.

Identificar pela fotografia: tudo corre no navegador, a fotografia não sai do aparelho. O U²-Netp separa o fruto do fundo e a MobileNetV2 compara-o com as fotografias do catálogo (`assets/reconhecer.js`, dados em `data/reconhecer.js`), com o ONNX Runtime Web (MIT) em `assets/vendor/ort`. Modelos e licenças (Apache 2.0) em `assets/modelos/LEIA-ME.txt`.

Publicação: GitHub Pages, *Deploy from a branch*, `main`, pasta raiz.

Fontes dos dados: listadas em cada ficha e no fim da página (Wikipedia, PepperScale, artigos científicos e vendedores de sementes, indicados como tal).
