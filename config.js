/* Configuração do CATÁLOGO CHILI — editar aqui, sem mexer no resto do código. */
window.CONFIG = {
  /* Encomendas de sementes: false = desligadas (o site fica só como catálogo); true = ligadas */
  encomendas: false,

  /* Para onde vão os pedidos de encomenda (quando ligadas) */
  email: 'jmns.santos@gmail.com',

  /* Serviço que entrega o pedido por email (FormSubmit, gratuito).
     No primeiro pedido, o FormSubmit envia um email de ativação para o endereço acima: é preciso confirmar uma vez.
     Depois da ativação, o FormSubmit envia um código aleatório; pode trocar o email no fim do endereço por esse código
     para não o deixar visível no código da página. Ex.: 'https://formsubmit.co/ajax/abc123def456' */
  envio: 'https://formsubmit.co/ajax/jmns.santos@gmail.com',

  /* Quantidades de sementes por variedade */
  quantidadePadrao: 10,
  quantidadePasso: 5,
  quantidadeMax: 500,

  /* País pré-preenchido no formulário */
  paisPadrao: 'Portugal',

  /* Línguas disponíveis (código, bandeira, nome próprio) */
  linguas: [
    ['pt', 'pt', 'Português'],
    ['en', 'gb', 'English'],
    ['de', 'de', 'Deutsch'],
    ['fr', 'fr', 'Français'],
    ['it', 'it', 'Italiano'],
    ['es', 'es', 'Español'],
    ['zh', 'cn', '中文']
  ]
};
