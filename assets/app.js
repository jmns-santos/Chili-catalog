(function () {
'use strict';
const D = window.CATALOGO, M = window.MUNDO, C = window.CONFIG || {};
const ORDERS = C.encomendas !== false;
if (!ORDERS) document.documentElement.dataset.encomendas = 'off';
const V = D.variedades.filter(v => v.publico !== false);
const byId = Object.fromEntries(V.map(v => [v.id, v]));
window.I18N = window.I18N || {};

/* ================= textos da interface (português = base) ================= */
const PT = {
  skip:'Saltar para o catálogo', a11y:'Acessibilidade', a11y_text:'Tamanho do texto', a11y_normal:'Texto normal', a11y_big:'Texto grande', a11y_bigger:'Texto muito grande',
  a11y_theme:'Tema', theme_auto:'Automático', theme_light:'Claro', theme_dark:'Escuro', a11y_contrast:'Alto contraste', a11y_motion:'Reduzir animações', a11y_links:'Sublinhar ligações e botões',
  cart:'Encomenda', lang:'Língua',
  lede:'Malaguetas da coleção, da mais picante para a mais suave: quanto picam, que aroma têm, de onde vêm e com que pratos casam.',
  st_var:'variedades', st_fotos:'fotografias', st_paises:'países', st_arom:'muito aromáticas',
  presets_t:'Sugestões rápidas', pr_peixe:'Peixe e marisco', pr_perfume:'Muito aroma, pouco fogo', pr_rechear:'Para rechear', pr_secar:'Pó e flocos', pr_ferm:'Molhos fermentados', pr_super:'Superhots',
  filters:'Filtrar', search_label:'Procurar', search_ph:'Procurar nome, ingrediente, prato…',
  f_heat:'Picante', f_aroma:'Aroma', f_perfil:'Perfil de aroma', f_meal:'Refeição', f_prep:'Preparação', f_country:'Origem', f_species:'Espécie', f_photo:'Só com fotografia',
  clear:'Limpar filtros', show_n:'Ver {n} variedades', show_n_1:'Ver 1 variedade', no_country:'Sem país definido', other_species:'Outra / por confirmar',
  views:'Vistas', tab_cards:'Variedades', tab_map:'Mapa', tab_chart:'Picante × aroma',
  sort:'Ordenar', sort_desc:'Mais picante primeiro', sort_asc:'Menos picante primeiro', sort_aroma:'Mais aromático primeiro', sort_name:'Nome (A–Z)',
  count:'{n} de {t} variedades', remove_filter:'Remover filtro: {f}', search_tag:'Procura: «{q}»', photo_tag:'Com fotografia',
  empty:'Nenhuma variedade com estes filtros.', no_photo:'sem foto', no_photo_long:'Ainda sem fotografia', open_card:'Abrir ficha de {name}', photos_n:'{n} fotos',
  h0:'Doce', h1:'Suave', h2:'Médio', h3:'Picante', h4:'Muito picante', h5:'Extremo',
  hx0:'Pimento', hx1:'Biquinho, banana', hx2:'Jalapeño, Bishop Crown', hx3:'Rocoto, ajis, bird\'s eye', hx4:'Habanero, Scotch Bonnet', hx5:'Bhut Jolokia, Reaper',
  a1:'Discreto', a2:'Aromático', a3:'Muito aromático',
  ad1:'Notas verdes ou vegetais; pouco perfume.', ad2:'Fruta ou citrino presentes, sem dominar.', ad3:'Perfume intenso, tropical ou floral. Dá aroma mesmo em pouca quantidade.',
  aroma_label:'Aroma', heat_label:'Picante', no_data:'Sem dados', no_value:'Sem valor numérico', profile_none:'Perfil não descrito',
  t_referência:'referência', 't_vendedor':'vendedor', 't_estimativa':'estimativa', 't_sem dados':'sem dados',
  b_variedade:'Descrição publicada da variedade.', 'b_variedade-base':'Descrição da variedade-base (a cor ou seleção não tem descrição própria).', b_grupo:'Descrição do grupo a que pertence.',
  b_pais:'Deduzido dos pais do cruzamento.', 'b_espécie':'Sem descrição da variedade; classificação pela espécie.', 'b_sem dados':'Sem dados.',
  sp_unknown:'Espécie por confirmar',
  d_kitchen:'Na cozinha', d_meals:'Refeições', d_pair:'Harmoniza com', d_prep:'Preparações', d_flavor:'Sabor e aroma', d_look:'Aspeto', d_origin:'Origem', d_alts:'Alternativas na coleção', d_sources:'Fontes',
  close:'Fechar', flag_alt:'Bandeira: {c}',
  map_title:'Origem das variedades', map_help:'Toque num país ou num círculo para ver as malaguetas de lá, da mais picante para a menos picante. O anel mostra os níveis de picante das variedades de cada país. Arraste para mover; use + e −, dois dedos ou Ctrl + roda do rato para aproximar.',
  map_none:'{n} sem país definido: cruzamentos de colecionador, origem não publicada ou variedade por identificar.', map_empty:'Nenhuma variedade com origem nos filtros atuais.', map_aria:'Mapa-mundo com o número de variedades por país de origem',
  chart_help:'Cada ponto é uma variedade, no valor típico do seu intervalo de Scoville (escala logarítmica). Toque num ponto para abrir a ficha.', by_aroma:'Por aroma', by_species:'Por espécie', var_short:'var.', chart_aria:'Variedades na escala de Scoville',
  guide_t:'Como ler o catálogo', g_heat:'Picante', g_aroma:'Aroma', g_tech:'Técnica',
  g_heat_p:'Cada valor vem marcado como <b>referência</b> (intervalo publicado), <b>vendedor</b> (quem criou ou vende a semente; raramente testado em laboratório), <b>estimativa</b> (deduzido dos pais, da variedade-base ou do grupo) ou <b>sem dados</b>.',
  g_aroma_p:'Classificação do catálogo, apoiada na ciência: a <i>C. chinense</i> é a espécie mais rica em ésteres e terpenos, com aromas frutados e exóticos; a <i>C. baccatum</i> e a <i>C. pubescens</i> têm mais notas terrosas e vegetais (o rocoto cheira a pepino); na <i>C. annuum</i> misturam-se notas frutadas e verdes. Quando há descrição publicada da variedade, prevalece; quando não há, usa-se a espécie e a ficha di-lo.',
  tip1:'<b>Fresco ou seco.</b> Secar baixa a intensidade e a complexidade do aroma; os terpenos caem mais de 90%. Para perfume, usar fresco; para fumo e profundidade, seco ou fumado.',
  tip2:'<b>Controlar o ardor.</b> A capsaicina está sobretudo na placenta branca: retirá-la baixa muito o picante. Assar suaviza; ferver o rocoto também.',
  tip3:'<b>Inteira e retirada.</b> Num estufado, um superhot inteiro (sem pé) retirado no fim dá sabor com pouco ardor.',
  tip4:'<b>Superhots (nível 5).</b> Luvas, óculos e moer ao ar livre. Uma pitada chega para um tacho.',
  sources_t:'Fontes', updated:'Atualizado a {d}.', disclaimer:'Valores e descrições reunidos a partir das fontes listadas; os marcados como estimativa ou sem dados devem ser confirmados. O picante real varia com o sol, a rega e a maturação.',
  dev:'Desenvolvido por', ai_note:'Nota: website desenvolvido com recurso a inteligência artificial.', credit:'Sementes, produção e identificação:', ig:' no Instagram',
  tab_id:'Identificar', nav_id:'Identificar', id_t:'Identificar pela fotografia',
  id_help:'Fotografe o fruto inteiro, sozinho e bem iluminado, sobre uma superfície lisa e de cor neutra (bancada clara, tábua branca, prato). O fruto deve ocupar boa parte da imagem.',
  id_cam:'Tirar fotografia', id_gal:'Escolher da galeria', id_privacy:'A fotografia não sai do seu aparelho: é analisada no navegador e não é guardada nem enviada.',
  id_note:'Experimental. Compara a cor e a forma do fruto com as {n} fotografias do catálogo. Muitas variedades parecem-se e a mesma muda de cor ao amadurecer, por isso o resultado é uma sugestão: confirme sempre na ficha. Variedades sem fotografia não entram na comparação.',
  id_working:'A analisar…', id_res:'Mais parecidas', id_sim:'semelhança', id_show:'Mostrar estas no catálogo', id_warn:'Não foi possível separar bem o fruto do fundo. Tente sobre uma superfície lisa e neutra, com o fruto a ocupar boa parte da imagem.',
  id_err:'Não foi possível ler esta imagem.', id_prev:'Zona analisada (o resto foi considerado fundo)', id_tag:'Identificação: {n} sugestões', id_empty:'Ainda não há fotografia. Os resultados aparecem aqui.',
  cur_t:'Curiosidades',
  pr_more:'Mais sugestões', pr_groups:'Grupos de sugestões',
  cur_prev:'Curiosidade anterior', cur_next:'Curiosidade seguinte', cur_pause:'Pausar curiosidades', cur_play:'Retomar curiosidades', cur_pos:'Curiosidade {i} de {n}', cur_dot:'Mostrar a curiosidade {i}',
  care_t:'Cuidados', care_hand:'Manuseamento', care_prec:'Precauções',
  hand_low:'Sem cuidados especiais; lavar as mãos depois de cortar.', hand_2:'Lavar as mãos depois de cortar e evitar tocar nos olhos.', hand_3:'Lavar bem as mãos depois de cortar; não tocar nos olhos nem nas lentes de contacto.', hand_4:'Usar luvas para cortar; lavar a tábua e a faca logo a seguir; não tocar nos olhos.', hand_5:'Luvas e óculos; cortar, moer ou secar com boa ventilação ou ao ar livre; lavar tábua, faca e moinho logo a seguir.', hand_unk:'Sem dados de picante: usar luvas até provar.',
  prec_low:'Picante baixo: adequada para a maioria das pessoas.', prec_2:'Picante moderado; quem tem azia ou refluxo deve provar com moderação.', prec_3:'Dosear aos poucos e provar; quem tem azia ou refluxo deve usar pouco.', prec_4:'Usar em pequenas quantidades e avisar quem vai comer; desaconselhada a crianças e a quem tem azia ou refluxo.', prec_5:'Uma pitada chega para um prato inteiro. Não indicada para crianças. Em quantidade pode causar dor de estômago e vómitos; há casos graves descritos com superhots.', prec_unk:'Provar primeiro uma quantidade muito pequena.',
  map_legend:'Nível de picante no anel',
  c_old:'<b>6100 anos.</b> Há grãos de amido de malagueta dessa idade em sítios arqueológicos das Bahamas ao Peru.',
  c_art:'<b>Artefactos.</b> Vasos do Chiapas, no México, com cerca de 2400 anos guardam resíduos de capsaicina.',
  c_name:'<b>Viagem.</b> No século XVI, os portugueses levaram a malagueta para África e para a Ásia, incluindo Goa.',
  c_birds:'<b>Aves.</b> Não sentem o picante: comem os frutos e espalham as sementes intactas.',
  c_scov:'<b>Scoville.</b> A escala nasceu em 1912 e media o picante com provadores humanos.',
  c_nobel:'<b>Nobel 2021.</b> A capsaicina ajudou David Julius a descobrir o recetor do calor e da dor, o TRPV1.',
  add:'Adicionar', add_order:'Adicionar à encomenda', update_order:'Atualizar encomenda', in_cart:'Na encomenda · {q}', added:'{name}: {q} sementes na encomenda', unavailable:'Sem sementes disponíveis',
  qty:'Quantidade', seeds:'sementes', less:'Menos', more:'Mais',
  o_title:'Pedido de encomenda', o_empty:'Ainda não escolheu sementes. Use «Adicionar» nas fichas do catálogo.', o_seeds:'Sementes escolhidas', o_remove:'Remover', o_total:'{n} variedades · {q} sementes', o_total_1:'1 variedade · {q} sementes',
  o_data:'Dados para a encomenda', f_name:'Nome completo', f_email:'Email', f_phone:'Telefone', f_addr:'Morada', f_zip:'Código postal', f_city:'Localidade', f_ctry:'País', f_nif:'NIF (opcional, para fatura)',
  f_delivery:'Entrega', del_post:'Envio por correio', del_pickup:'Levantamento em mão', f_notes:'Observações', f_notes_ph:'Ex.: prazo, alternativas aceites, dúvidas…',
  f_consent:'Aceito que estes dados sejam usados apenas para tratar esta encomenda.',
  o_privacy:'O pedido é enviado por email a Jorge Santos através do serviço FormSubmit. Não há pagamento no site: o preço e os portes são confirmados por email.',
  o_send:'Enviar pedido', o_sending:'A enviar…', o_ok_t:'Pedido enviado', o_ok:'Referência {ref}. Vai receber resposta por email com a confirmação, o preço e os portes.',
  o_fail_t:'Não foi possível enviar automaticamente', o_fail:'Pode enviar o mesmo pedido pelo seu programa de email ou copiá-lo e colá-lo numa mensagem para {email}.',
  o_activation:'O envio automático ainda não está ativo (falta confirmar o email de ativação do FormSubmit). Envie o pedido pelo seu email.',
  o_mail:'Enviar pelo meu email', o_copy:'Copiar pedido', o_copied:'Pedido copiado', o_back:'Voltar ao catálogo', o_req:'Campo obrigatório', o_bad_email:'Indique um email válido', o_need_items:'Adicione pelo menos uma variedade.', o_need_consent:'É preciso aceitar para enviar.',
  o_fix:'Há campos por corrigir.', o_ref:'Referência', o_req_mark:'obrigatório',
  title:'CATÁLOGO CHILI', title_html:'CATÁLOGO <span>CHILI</span>',
  pg_pratos:'Pratos', pg_molhos:'Molhos e preparações', pg_mundo:'Cozinhas do mundo', pg_outras:'Outras sugestões',
  pr_carne:'Carnes', pr_aves:'Aves', pr_saladas:'Saladas e crus', pr_sopas:'Sopas, estufados e caldeiradas', pr_massas:'Arroz, massas e pizza', pr_petiscos:'Petiscos e entradas', pr_veg:'Vegetariano', pr_doces:'Doces e chocolate',
  pr_mpicante:'Molho picante', pr_salsa:'Salsa fresca', pr_piri:'Piri-piri e azeite picante', pr_marinada:'Marinadas', pr_conserva:'Conservas e pickles', pr_geleia:'Geleias e compotas', pr_fumado:'Fumados',
  pr_mx:'México', pr_pe:'Peru e Andes', pr_car:'Caraíbas', pr_br:'Brasil', pr_asia:'Ásia', pr_africa:'África', pr_na:'América do Norte',
  f_trad:'Tradição culinária',
  chef_t:'Para a cozinha', chef_force:'Força (por peso)', chef_force_v:'≈ {x}× o jalapeño', chef_force_0:'Sem picante', chef_force_note:'Calculada pelo valor típico de SHU (jalapeño = 2.500–10.000).', chef_equiv:'Picante equivalente no mercado', chef_trad:'Tradição culinária', chef_safety:'Cuidados',
  safe_low:'Manuseamento normal.', safe3:'Lavar as mãos depois de cortar e não tocar nos olhos.', safe4:'Usar luvas para cortar e não tocar nos olhos.', safe5:'Luvas, óculos e boa ventilação; moer ao ar livre. Não indicado para crianças.', safe_unk:'Sem dados de picante: provar primeiro uma quantidade pequena.',
  mk_bell:'Pimento', mk_cayenne:'Caiena', mk_name:'Malagueta', mk_x:'Força',
  g_market:'Equivalências de mercado', g_market_p:'Valores da tabela de Scoville da Wikipedia; força calculada pelo valor típico de cada intervalo.',
  health_t:'Saúde e segurança', health_intro:'Os estudos referem-se à malagueta e à capsaicina em geral, não a variedades. Informação geral, que não substitui aconselhamento médico.', health_levels:'Cuidados por nível de picante',
  h_mort:'<b>Consumo habitual.</b> Numa meta-análise de 4 estudos de coorte (564 748 pessoas), comer malagueta com regularidade, em comparação com raramente ou nunca, associou-se a menos 13% de mortalidade total, 11% cardiovascular e 8% por cancro. São associações: não provam que a malagueta seja a causa.',
  h_nutr:'<b>Nutrição.</b> 100 g de malagueta vermelha crua têm cerca de 40 kcal e 144 mg de vitamina C. Na cozinha usam-se poucos gramas, por isso o contributo real é pequeno.',
  h_met:'<b>Metabolismo.</b> Numa meta-análise de 9 ensaios, a capsaicina aumentou o gasto energético em cerca de 59 kcal por dia, e só em pessoas com excesso de peso. Outra revisão descreve o efeito como pequeno.',
  h_med:'<b>Medicina.</b> Um adesivo com 8% de capsaicina está autorizado na União Europeia desde 2009 para tratar a dor neuropática periférica em adultos. É um medicamento, não um alimento.',
  h_dig:'<b>Digestão.</b> A comida picante está entre os desencadeadores habituais de azia e refluxo; o NHS aconselha quem tem estes sintomas a evitar o que os provoca.',
  h_skin:'<b>Pele e olhos.</b> O óleo da malagueta irrita a pele e os olhos: lavar as mãos depois de cortar e ter cuidado com os olhos. Com as mais picantes, usar luvas.',
  h_hot:'<b>Superhots.</b> Comer malaguetas muito picantes pode causar dor de estômago, vómitos e, em alguns casos, internamento. Em 2018 foi descrito um homem com dores de cabeça súbitas e estreitamento temporário de artérias do cérebro depois de comer uma Carolina Reaper num concurso; recuperou.',
  map_tools:'Controlos do mapa', map_zin:'Aproximar', map_zout:'Afastar', map_reset:'Ver o mundo inteiro', map_keys:'Com o teclado: setas para mover, + e − para aproximar ou afastar, 0 para ver o mundo inteiro. Tab percorre os países.',
  map_back:'Voltar à lista de países', map_filter:'Ver só estas em Variedades', map_n:'{n} variedades', map_n_1:'1 variedade', map_zero:'Nenhuma variedade deste país com os filtros atuais.',
  nav:'Navegação', nav_cards:'Variedades', nav_map:'Mapa', nav_chart:'Gráfico', nav_guide:'Guia',
  id_cta_aria:'Identificar uma malagueta pela fotografia',
  cur_kick:'Sabia que…',
  cur_photo:'Na foto: {name}',
  ribbon_t:'Da mais suave à mais picante',
  ribbon_lo:'suave',
  ribbon_hi:'extremo',
  unid:'Por identificar',
  lang_err:'Não foi possível carregar esta língua. Recarregue a página e tente outra vez.',
  c_vitc:'<b>Vitamina C.</b> Em 1932, Szent-Györgyi extraiu-a em quantidade da paprika de Szeged. Nobel em 1937.',
  c_plac:'<b>Onde arde.</b> A capsaicina está na placenta branca que segura as sementes, não nas sementes.',
  c_milk:'<b>Contra o ardor.</b> Num estudo de 2019, o leite aliviou mais do que água, refrigerantes ou cerveja sem álcool.',
  c_rec:'<b>Recorde.</b> Desde 2023, a mais picante do Guinness é a Pepper X: 2,69 milhões de SHU em média.',
  c_sp5:'<b>Cinco espécies.</b> Cultivam-se sobretudo <i>C. annuum</i>, <i>C. baccatum</i>, <i>C. chinense</i>, <i>C. frutescens</i> e <i>C. pubescens</i>.',
  c_chin:'<b>Nome enganador.</b> Em 1776, Jacquin chamou-lhe <i>C. chinense</i> («da China»), mas a espécie é americana.'
};
const T = (k, vars) => {
  const L = I18N[lang] && I18N[lang].ui;
  let s = (L && L[k]) ?? PT[k] ?? k;
  if (vars) for (const [a, b] of Object.entries(vars)) s = s.split('{' + a + '}').join(b);
  return s;
};
const Tn = (k, n, vars) => { const L = lang === 'pt' ? PT : (I18N[lang] && I18N[lang].ui); return T(n === 1 && L && L[k + '_1'] ? k + '_1' : k, vars); };
const X = s => { if (s == null || s === '') return s; const L = I18N[lang] && I18N[lang].txt; return (L && L[s]) || s; };

/* ================= vocabulário ================= */
const PERFIS = {'Tropical':'--p-trop','Cítrico':'--p-citr','Floral':'--p-flor','Frutado doce':'--p-fdoce','Terroso / fumado':'--p-terr','Vegetal':'--p-veg'};
const REFEICOES = ['Peixe e marisco','Carnes','Aves','Vegetariano','Sopas e estufados','Arroz, massas e pizza','Saladas e crus','Petiscos','Salteados e wok','Molhos e condimentos','Doces e sobremesas'];
const ESPECIES = ['C. chinense','C. baccatum','C. annuum','C. pubescens','*outra'];
const espOf = v => { const e = v.especie || ''; if (/chinense/.test(e)) return 'C. chinense'; if (/baccatum/.test(e)) return 'C. baccatum'; if (/pubescens/.test(e)) return 'C. pubescens'; if (/^C\. annuum/.test(e)) return 'C. annuum'; return '*outra'; };
const espName = e => e === '*outra' ? T('other_species') : e;
const LOCALE = {pt:'pt-PT', en:'en-GB', de:'de-DE', fr:'fr-FR', it:'it-IT', es:'es-ES', zh:'zh-CN'};
let lang = 'pt';
let dn = null;
const country = iso => { if (!iso) return ''; try { dn = dn || new Intl.DisplayNames([LOCALE[lang]], {type:'region'}); return dn.of(iso); } catch (e) { return iso; } };

/* ================= utilitários ================= */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nf = (x, d = 0) => new Intl.NumberFormat(LOCALE[lang], {maximumFractionDigits:d}).format(x);
const heatVar = n => n == null ? 'var(--muted)' : `var(--h${n})`;
const aromaVar = n => n == null ? 'var(--muted)' : `var(--a${n})`;
const POD = `<svg class="pod" viewBox="0 0 32 32" aria-hidden="true"><path d="M18.2 10.6C21.4 10.2 22.6 13 21.6 15.4 20.2 18.9 16.4 22.2 11.4 23.4 10.2 23.7 9.6 22.6 10.5 21.9 13.6 19.5 15.2 16.6 15.8 13.6 16.1 12 16.9 10.8 18.2 10.6Z"/><path d="M19.6 10.8C19.9 8.9 21 7.6 22.8 7.1M16.9 11.6C17.9 10.3 20.4 10 21.6 11.3" fill="none" stroke-width="1.8" stroke-linecap="round"/></svg>`;
const unidTag = v => v.grupo === 'Por identificar' ? `<span class="unid">${esc(T('unid'))}</span>` : '';
const flagImg = (iso, cls) => iso ? `<img class="${cls || 'flag'}" src="bandeiras/${iso.toLowerCase()}.svg" alt="${esc(T('flag_alt', {c: country(iso)}))}" width="28" height="21" loading="lazy">` : '';
const store = {
  get(k, d){ try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
function cmp(x){
  if (lang === 'zh'){ if (x >= 1e4) return nf(Math.round(x / 1e3) / 10, 1) + '万'; return nf(x); }
  if (x >= 1e6) return nf(x / 1e6, 2) + ' M'; if (x >= 1e4) return nf(Math.round(x / 1e3)) + ' k'; return nf(x);
}
function shuShort(v){
  if (!v.shu) return '—';
  const [a, b] = v.shu;
  if (a === 0 && b === 0) return '0 SHU';
  if (b == null) return cmp(a) + '+ SHU';
  if (a === b) return '≈ ' + cmp(a) + ' SHU';
  return cmp(a) + '–' + cmp(b) + ' SHU';
}
function shuFull(v){
  if (!v.shu) return T('no_value');
  const [a, b] = v.shu;
  if (b == null) return nf(a) + '+ SHU';
  if (a === b) return '≈ ' + nf(a) + ' SHU';
  return nf(a) + '–' + nf(b) + ' SHU';
}
function shuRep(v){ if (!v.shu) return null; const [a, b] = v.shu; if (b == null) return a; if (a === 0) return b / 2; return Math.sqrt(a * b); }
const heatScore = v => v.nivel == null ? -1 : v.nivel * 1e8 + (shuRep(v) || 0);
const aromaI = v => v.aroma ? v.aroma.i : null;
const nome = v => X(v.nome);

function meter(n, kind, big){
  const max = kind === 'aroma' ? 3 : 5;
  const col = kind === 'aroma' ? aromaVar(n) : heatVar(n);
  const label = n == null ? T('no_data') : T((kind === 'aroma' ? 'a' : 'h') + n);
  const pre = kind === 'aroma' ? T('aroma_label') : T('heat_label');
  const segs = Array.from({length:max}, (_, i) => `<i class="${n != null && i < n ? 'on' : ''}"></i>`).join('');
  const num = n == null ? '?' : `${n}/${max}`;
  return `<span class="meter ${kind}${n == null ? ' none' : ''}" style="--c:${col}"><span class="segs" aria-hidden="true">${segs}</span>${big ? `<b>${esc(label)}</b>` : `<span>${esc(pre)}: <span class="num">${num}</span> ${esc(label)}</span>`}</span>`;
}
const pill = p => `<span class="pill" style="--c:var(${PERFIS[p] || '--muted'})"><i></i>${esc(X(p))}</span>`;
function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2600); }

/* ================= preferências de acessibilidade ================= */
const prefs = Object.assign({texto:'1', tema:'auto', contraste:false, motion:false, links:false}, store.get('cc.prefs.v1', {}));
function applyPrefs(){
  const r = document.documentElement;
  r.dataset.texto = prefs.texto;
  if (prefs.tema === 'auto') delete r.dataset.theme; else r.dataset.theme = prefs.tema;
  if (prefs.contraste) r.dataset.contraste = 'alto'; else delete r.dataset.contraste;
  if (prefs.motion) r.dataset.motion = 'reduzir'; else delete r.dataset.motion;
  if (prefs.links) r.dataset.links = '1'; else delete r.dataset.links;
  document.querySelectorAll('#aText button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === prefs.texto));
  document.querySelectorAll('#aTheme button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === prefs.tema));
  $('#aContrast').checked = prefs.contraste; $('#aMotion').checked = prefs.motion; $('#aLinks').checked = prefs.links;
  store.set('cc.prefs.v1', prefs);
}
$('#aText').addEventListener('click', e => { const b = e.target.closest('button'); if (b){ prefs.texto = b.dataset.v; applyPrefs(); } });
$('#aTheme').addEventListener('click', e => { const b = e.target.closest('button'); if (b){ prefs.tema = b.dataset.v; applyPrefs(); drawMap(currentList); } });
$('#aContrast').addEventListener('change', e => { prefs.contraste = e.target.checked; applyPrefs(); });
$('#aMotion').addEventListener('change', e => { prefs.motion = e.target.checked; applyPrefs(); });
$('#aLinks').addEventListener('change', e => { prefs.links = e.target.checked; applyPrefs(); });

/* menus (língua, acessibilidade) */
function setupMenu(btn, pop){
  const close = () => { pop.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', e => { e.stopPropagation(); const open = pop.hidden; document.querySelectorAll('.pop').forEach(p => p.hidden = true); document.querySelectorAll('[aria-haspopup]').forEach(b => b.setAttribute('aria-expanded', 'false')); pop.hidden = !open; btn.setAttribute('aria-expanded', String(open)); if (open){ const f = pop.querySelector('button,input'); f && f.focus(); } });
  pop.addEventListener('click', e => e.stopPropagation());
  pop.addEventListener('keydown', e => { if (e.key === 'Escape'){ close(); btn.focus(); } });
  document.addEventListener('click', close);
  return close;
}
const closeLang = setupMenu($('#bLang'), $('#pLang'));
setupMenu($('#bA11y'), $('#pA11y'));

/* ================= línguas ================= */
const LANGS = C.linguas || [['pt','pt','Português']];
const VER = '7';
let booted = false;
function loadLang(code){
  return new Promise(res => {
    if (code === 'pt' || I18N[code]) return res(true);
    const s = document.createElement('script'), t = setTimeout(() => res(!!I18N[code]), 15000);
    s.src = `i18n/${code}.js?v=${VER}`;
    s.onload = () => { clearTimeout(t); res(!!I18N[code]); };
    s.onerror = () => { clearTimeout(t); s.remove(); res(false); };
    document.head.appendChild(s);
  });
}
async function setLang(code, save = true){
  const ok = await loadLang(code);
  if (!ok){ toast(T('lang_err')); if (booted) return; code = 'pt'; }
  booted = true;
  lang = (code === 'pt' || I18N[code]) ? code : 'pt'; dn = null;
  if (save) store.set('cc.lang', lang);
  document.documentElement.lang = LOCALE[lang];
  const L = LANGS.find(l => l[0] === lang) || LANGS[0];
  $('#bLangFlag').src = `bandeiras/${L[1]}.svg`; $('#bLangName').textContent = L[2];
  $('#bLang').setAttribute('aria-label', `${T('lang')}: ${L[2]}`);
  $('#langList').innerHTML = LANGS.map(([c, f, n]) => `<li><button type="button" data-l="${c}" lang="${LOCALE[c]}" aria-current="${c === lang}"><img src="bandeiras/${f}.svg" alt="" width="28" height="21">${esc(n)}</button></li>`).join('');
  applyStatic(); buildStatic(); update(); drawChart(); dimChart();
  if ($('#ficha').open && openId) openFicha(openId);
  if ($('#encomenda').open) renderOrder();
}
$('#langList').addEventListener('click', e => { const b = e.target.closest('button[data-l]'); if (b){ setLang(b.dataset.l); closeLang(); $('#bLang').focus(); } });
function applyStatic(){
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = T(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = T(el.dataset.i18nPh); });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', T(el.dataset.i18nAria)); });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = T(el.dataset.i18nHtml); });
  document.title = T('title');
  const tl = T('title').split(/[\s-]+/).reduce((m, w) => Math.max(m, [...w].reduce((n, ch) => n + (/[\u3000-\u9fff]/.test(ch) ? 1.7 : 1), 0)), 0);
  $('#titulo').style.setProperty('--tl', tl);
  $('#bA11y').setAttribute('aria-label', T('a11y')); $('#bCart').setAttribute('aria-label', T('cart'));
}

/* ================= estado dos filtros ================= */
const SETS = ['nivel', 'aroma', 'perfil', 'ref', 'prep', 'trad', 'pais', 'esp'];
const blank = () => Object.assign({q:'', sort:'desc', foto:false, preset:null, ids:new Set()}, Object.fromEntries(SETS.map(k => [k, new Set()])));
const st = blank();
const PRESET_GROUPS = [
  ['pg_pratos', [
    ['carne', 'pr_carne', s => s.ref.add('Carnes')], ['aves', 'pr_aves', s => s.ref.add('Aves')], ['peixe', 'pr_peixe', s => s.ref.add('Peixe e marisco')],
    ['saladas', 'pr_saladas', s => s.ref.add('Saladas e crus')], ['sopas', 'pr_sopas', s => s.ref.add('Sopas e estufados')], ['massas', 'pr_massas', s => s.ref.add('Arroz, massas e pizza')],
    ['petiscos', 'pr_petiscos', s => s.ref.add('Petiscos')], ['veg', 'pr_veg', s => s.ref.add('Vegetariano')], ['doces', 'pr_doces', s => s.ref.add('Doces e sobremesas')]]],
  ['pg_molhos', [
    ['mpicante', 'pr_mpicante', s => s.prep.add('Molho picante')], ['salsa', 'pr_salsa', s => s.prep.add('Salsa')], ['ferm', 'pr_ferm', s => s.prep.add('Fermentado')],
    ['piri', 'pr_piri', s => s.prep.add('Azeite picante')], ['marinada', 'pr_marinada', s => s.prep.add('Marinada')], ['conserva', 'pr_conserva', s => s.prep.add('Conserva')],
    ['geleia', 'pr_geleia', s => s.prep.add('Geleia')], ['secar', 'pr_secar', s => s.prep.add('Seco / pó')], ['fumado', 'pr_fumado', s => s.prep.add('Fumado')]]],
  ['pg_mundo', [
    ['mx', 'pr_mx', s => s.trad.add('Mexicana')], ['pe', 'pr_pe', s => s.trad.add('Peruana')], ['car', 'pr_car', s => ['Caribenha', 'Surinamesa'].forEach(x => s.trad.add(x))],
    ['br', 'pr_br', s => s.trad.add('Brasileira')], ['asia', 'pr_asia', s => ['Indiana', 'Tailandesa', 'Indonésia'].forEach(x => s.trad.add(x))],
    ['africa', 'pr_africa', s => ['Etíope', 'Sul-africana', 'Africana ocidental'].forEach(x => s.trad.add(x))], ['na', 'pr_na', s => s.trad.add('Norte-americana')]]],
  ['pg_outras', [
    ['perfume', 'pr_perfume', s => { s.aroma.add('3'); ['0','1','2','3'].forEach(x => s.nivel.add(x)); }], ['rechear', 'pr_rechear', s => s.prep.add('Recheado')], ['super', 'pr_super', s => s.nivel.add('5')]]],
];
const PRESETS = PRESET_GROUPS.flatMap(([g, items]) => items.map(([id, k, set]) => ({id, k, set, g})));
const PRESET_COMMON = ['carne', 'peixe', 'saladas', 'mpicante', 'salsa', 'perfume'];
let moreOpen = false, moreGroup = 'pg_pratos';
function reset(){ st.q = ''; st.foto = false; st.preset = null; st.ids.clear(); SETS.forEach(k => st[k].clear()); }
const presetCount = p => { const t = blank(); p.set(t); return V.filter(v => match(v, null, t)).length; };
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
function hay(v){
  const parts = [v.nome, v.especie, v.grupo, v.origem, v.cozinha, v.sabor, v.aspeto, ...(v.usos || []), ...(v.refeicoes || []), ...(v.harmoniza || []), ...(v.aroma?.perfil || []), ...(v.tradicao || [])];
  const tr = lang === 'pt' ? [] : parts.map(X);
  return norm([...parts, ...tr, country(v.pais)].join(' '));
}
function match(v, skip, S = st){
  const has = (set, val) => !set.size || set.has(val);
  if (skip !== 'nivel' && !has(S.nivel, v.nivel == null ? 'x' : String(v.nivel))) return false;
  if (skip !== 'aroma' && !has(S.aroma, aromaI(v) == null ? 'x' : String(aromaI(v)))) return false;
  if (skip !== 'perfil' && S.perfil.size && !(v.aroma?.perfil || []).some(p => S.perfil.has(p))) return false;
  if (skip !== 'ref' && S.ref.size && !(v.refeicoes || []).some(r => S.ref.has(r))) return false;
  if (skip !== 'prep' && S.prep.size && !(v.usos || []).some(r => S.prep.has(r))) return false;
  if (skip !== 'trad' && S.trad.size && !(v.tradicao || []).some(r => S.trad.has(r))) return false;
  if (skip !== 'pais' && !has(S.pais, v.pais || '—')) return false;
  if (skip !== 'esp' && !has(S.esp, espOf(v))) return false;
  if (S.foto && !(v.fotos && v.fotos.length)) return false;
  if (S.ids && S.ids.size && !S.ids.has(v.id)) return false;
  if (S.q){ const h = hay(v); if (!norm(S.q).split(/\s+/).every(t => h.includes(t))) return false; }
  return true;
}
function sorted(list){
  const a = list.slice();
  if (st.sort === 'nome') a.sort((x, y) => nome(x).localeCompare(nome(y), LOCALE[lang]));
  else if (st.sort === 'asc') a.sort((x, y) => (x.nivel == null ? 1e12 : heatScore(x)) - (y.nivel == null ? 1e12 : heatScore(y)));
  else if (st.sort === 'aroma') a.sort((x, y) => ((aromaI(y) ?? -1) - (aromaI(x) ?? -1)) || (heatScore(y) - heatScore(x)));
  else a.sort((x, y) => heatScore(y) - heatScore(x));
  return a;
}

/* ================= controlos de filtro ================= */
function opts(key, items){
  /* items: [valor, html do rótulo, extra-attrs] ; contagem considera os outros filtros */
  const base = V.filter(v => match(v, key));
  const cnt = val => base.filter(v => {
    if (key === 'nivel') return (v.nivel == null ? 'x' : String(v.nivel)) === val;
    if (key === 'aroma') return (aromaI(v) == null ? 'x' : String(aromaI(v))) === val;
    if (key === 'perfil') return (v.aroma?.perfil || []).includes(val);
    if (key === 'ref') return (v.refeicoes || []).includes(val);
    if (key === 'prep') return (v.usos || []).includes(val);
    if (key === 'trad') return (v.tradicao || []).includes(val);
    if (key === 'pais') return (v.pais || '—') === val;
    if (key === 'esp') return espOf(v) === val;
  }).length;
  return items.map(([val, label, style]) => {
    const n = cnt(val), on = st[key].has(val);
    return `<button type="button" class="chip" data-k="${key}" data-v="${esc(val)}" aria-pressed="${on}" ${style || ''} ${!n && !on ? 'disabled' : ''}>${label}<span class="n">${n}</span></button>`;
  }).join('');
}
function buildFilters(){
  $('#fNivel').innerHTML = opts('nivel', [5,4,3,2,1,0].map(k => [String(k), `<span class="segs" aria-hidden="true">${[1,2,3,4,5].map(i => `<b class="${i <= k ? 'on' : ''}"></b>`).join('')}</span><span class="lab">${k} · ${esc(T('h' + k))}</span>`, `style="--c:var(--h${k})" title="${esc(T('hx' + k))}"`]).concat([['x', `<span class="lab">? · ${esc(T('no_data'))}</span>`, '']]));
  $('#fAroma').innerHTML = opts('aroma', [3,2,1].map(k => [String(k), `<i class="dot"></i>${esc(T('a' + k))}`, `style="--c:var(--a${k})" title="${esc(T('ad' + k))}"`]));
  $('#fPerfil').innerHTML = opts('perfil', Object.keys(PERFIS).map(p => [p, `<i class="dot"></i>${esc(X(p))}`, `style="--c:var(${PERFIS[p]})"`]));
  $('#fRef').innerHTML = opts('ref', REFEICOES.filter(r => V.some(v => (v.refeicoes || []).includes(r))).map(r => [r, esc(X(r)), '']));
  const preps = [...new Set(V.flatMap(v => v.usos || []))].sort((a, b) => X(a).localeCompare(X(b), LOCALE[lang]));
  $('#fPrep').innerHTML = opts('prep', preps.map(p => [p, esc(X(p)), '']));
  const trs = [...new Set(V.flatMap(v => v.tradicao || []))].sort((a, b) => X(a).localeCompare(X(b), LOCALE[lang]));
  $('#fTrad').innerHTML = opts('trad', trs.map(t => [t, esc(X(t)), '']));
  const ps = [...new Set(V.map(v => v.pais).filter(Boolean))].sort((a, b) => country(a).localeCompare(country(b), LOCALE[lang]));
  $('#fPais').innerHTML = opts('pais', ps.map(p => [p, `${flagImg(p, '')}${esc(country(p))}`, '']).concat([['—', esc(T('no_country')), '']]));
  $('#fEsp').innerHTML = opts('esp', ESPECIES.map(e => [e, e === '*outra' ? esc(espName(e)) : `<i>${esc(e)}</i>`, '']));
  renderPresets();
  if ($('#q').value.trim() !== st.q) $('#q').value = st.q; $('#fSort').value = st.sort; $('#fFoto').checked = st.foto;
}
$('#filtros').addEventListener('click', e => {
  const b = e.target.closest('.chip[data-k]'); if (!b || b.disabled) return;
  const set = st[b.dataset.k]; set.has(b.dataset.v) ? set.delete(b.dataset.v) : set.add(b.dataset.v);
  st.preset = null; update(); const nb = $(`.chip[data-k="${b.dataset.k}"][data-v="${CSS.escape(b.dataset.v)}"]`); nb && nb.focus();
});
function presetChip(p){ const n = presetCount(p); return n ? `<button type="button" class="chip" data-p="${p.id}" aria-pressed="${st.preset === p.id}">${esc(T(p.k))}<span class="n">${n}</span></button>` : ''; }
function renderPresets(){
  const act = PRESETS.find(p => p.id === st.preset);
  if (act && !PRESET_COMMON.includes(act.id)){ moreOpen = true; moreGroup = act.g; }
  $('#presets').innerHTML = PRESET_COMMON.map(id => presetChip(PRESETS.find(p => p.id === id))).join('') +
    `<button type="button" class="chip morebtn" id="pMoreBtn" aria-expanded="${moreOpen}" aria-controls="pMore"><span aria-hidden="true">${moreOpen ? '−' : '+'}</span>${esc(T('pr_more'))}</button>`;
  $('#pMore').hidden = !moreOpen;
  $('#pGroups').innerHTML = PRESET_GROUPS.map(([g]) => `<button type="button" data-g="${g}" aria-pressed="${g === moreGroup}">${esc(T(g))}</button>`).join('');
  $('#pMoreChips').innerHTML = PRESETS.filter(p => p.g === moreGroup).map(presetChip).join('');
}
document.querySelector('.presets').addEventListener('click', e => {
  if (e.target.closest('#pMoreBtn')){ moreOpen = !moreOpen; renderPresets(); $('#pMoreBtn').focus(); return; }
  const g = e.target.closest('[data-g]'); if (g){ moreGroup = g.dataset.g; renderPresets(); $(`#pGroups [data-g="${moreGroup}"]`).focus(); return; }
  const b = e.target.closest('.chip[data-p]'); if (!b) return;
  const was = st.preset === b.dataset.p; reset();
  if (!was){ const p = PRESETS.find(x => x.id === b.dataset.p); p.set(st); st.preset = p.id; }
  update(); $('#resultados').scrollIntoView({behavior: prefs.motion ? 'auto' : 'smooth', block:'start'});
});
let qTimer;
$('#q').addEventListener('input', e => { clearTimeout(qTimer); qTimer = setTimeout(() => { st.q = e.target.value.trim(); st.preset = null; update(false); }, 150); });
$('#fSort').addEventListener('change', e => { st.sort = e.target.value; update(false); });
$('#fFoto').addEventListener('change', e => { st.foto = e.target.checked; st.preset = null; update(); });
$('#limpar').addEventListener('click', () => { reset(); update(); });

/* gaveta de filtros no telemóvel */
const filtros = $('#filtros'), mainEls = () => [...document.querySelectorAll('.wrap > *:not(.layout), .layout > main, .bar, .mbar')];
function openFilters(){ filtros.classList.add('open'); filtros.setAttribute('role', 'dialog'); filtros.setAttribute('aria-modal', 'true'); mainEls().forEach(el => el.inert = true); document.body.style.overflow = 'hidden'; setTimeout(() => $('#q').focus(), 50); }
function closeFilters(){ if (!filtros.classList.contains('open')) return; filtros.classList.remove('open'); filtros.removeAttribute('role'); filtros.removeAttribute('aria-modal'); mainEls().forEach(el => el.inert = false); document.body.style.overflow = ''; $('#mFilter').focus(); }
$('#mFilter').addEventListener('click', openFilters);
$('#fClose').addEventListener('click', closeFilters);
$('#fDone').addEventListener('click', () => { closeFilters(); $('#resultados').focus(); });
filtros.addEventListener('keydown', e => { if (e.key === 'Escape') closeFilters(); });

/* filtros ativos (etiquetas removíveis) */
function activeTags(n){
  const tags = [];
  const add = (key, val, label) => tags.push(`<button type="button" class="tagx" data-k="${key}" data-v="${esc(val)}" aria-label="${esc(T('remove_filter', {f: label}))}">${esc(label)}<span aria-hidden="true">×</span></button>`);
  if (st.q) add('q', '', T('search_tag', {q: st.q}));
  [...st.nivel].forEach(v => add('nivel', v, `${T('f_heat')}: ${v === 'x' ? T('no_data') : T('h' + v)}`));
  [...st.aroma].forEach(v => add('aroma', v, `${T('f_aroma')}: ${v === 'x' ? T('no_data') : T('a' + v)}`));
  [...st.perfil].forEach(v => add('perfil', v, X(v)));
  [...st.ref].forEach(v => add('ref', v, X(v)));
  [...st.prep].forEach(v => add('prep', v, X(v)));
  [...st.trad].forEach(v => add('trad', v, X(v)));
  [...st.pais].forEach(v => add('pais', v, v === '—' ? T('no_country') : country(v)));
  [...st.esp].forEach(v => add('esp', v, espName(v)));
  if (st.foto) add('foto', '', T('photo_tag'));
  if (st.ids.size) add('ids', '', T('id_tag', {n: st.ids.size}));
  $('#active').innerHTML = `<span class="count">${esc(T('count', {n: n, t: V.length}))}</span>` + tags.join('') + (tags.length ? `<button type="button" class="btn ghost" id="limpar2">${esc(T('clear'))}</button>` : '');
  const nAct = tags.length;
  $('#mFilterCount').hidden = !nAct; $('#mFilterCount').textContent = nAct;
  $('#fDone').textContent = Tn('show_n', n, {n});
}
$('#active').addEventListener('click', e => {
  if (e.target.closest('#limpar2')){ reset(); update(); return; }
  const b = e.target.closest('.tagx'); if (!b) return;
  const k = b.dataset.k;
  if (k === 'q') st.q = ''; else if (k === 'foto') st.foto = false; else if (k === 'ids') st.ids.clear(); else st[k].delete(b.dataset.v);
  st.preset = null; update();
});

/* ================= fichas ================= */
function card(v){
  const f = v.fotos && v.fotos[0];
  const thumb = f
    ? `<img class="ph-img" src="${esc(f.web)}" alt="" loading="lazy">${v.fotos.length > 1 ? `<span class="nfotos">${esc(T('photos_n', {n: v.fotos.length}))}</span>` : ''}`
    : `<span class="ph" style="--c:${heatVar(v.nivel)}">${POD}<span>${esc(T('no_photo'))}</span></span>`;
  const per = (v.aroma?.perfil || []).slice(0, 2).map(pill).join('');
  const q = cart[v.id];
  const foot = v.disponivel === false
    ? `<span class="unav">${esc(T('unavailable'))}</span>`
    : (q ? `<button type="button" class="btn incart" data-cart="${esc(v.id)}">✓ ${esc(T('in_cart', {q}))}</button>`
         : `<button type="button" class="btn" data-add="${esc(v.id)}" aria-label="${esc(T('add_order'))}: ${esc(nome(v))}">+ ${esc(T('add'))}</button>`);
  return `<article class="card">
    <button type="button" class="cardmain" data-id="${esc(v.id)}" aria-label="${esc(T('open_card', {name: nome(v)}))}">
      <span class="thumb">${thumb}${flagImg(v.pais)}${unidTag(v)}</span>
      <span class="cbody">
        <span class="crow"><span class="sp">${esc(X(v.especie) || T('sp_unknown'))}</span><span>${esc(country(v.pais))}</span></span>
        <span class="cname">${esc(nome(v))}</span>
        <span class="meters">${meter(v.nivel, 'heat')}${meter(aromaI(v), 'aroma')}</span>
        <span class="crow"><span class="shu">${shuShort(v)}</span><span class="tag">${esc(T('t_' + v.tipoShu))}</span></span>
        <span class="pills">${per}</span>
      </span>
    </button>
    ${ORDERS ? `<div class="cfoot">${foot}</div>` : ''}
  </article>`;
}
const grid = $('#grid');
grid.addEventListener('click', e => {
  const a = e.target.closest('[data-add]'); if (a){ addToCart(a.dataset.add, C.quantidadePadrao || 10); return; }
  const c = e.target.closest('[data-cart]'); if (c){ openOrder(); return; }
  const m = e.target.closest('.cardmain'); if (m) openFicha(m.dataset.id);
});

/* ================= mapa ================= */
const mapEl = $('#map');
let currentList = V;
const MV = {x: 0, y: 0, w: M.w, h: M.h};
let mapSel = null, mapActive = false;
const RED = matchMedia('(prefers-reduced-motion: reduce)');
const panel = $('#mapPanel'), mapCountries = $('#mapCountries');
function applyView(){
  MV.w = Math.min(M.w, Math.max(M.w / 12, MV.w)); MV.h = MV.w * M.h / M.w;
  MV.x = Math.min(M.w - MV.w, Math.max(0, MV.x)); MV.y = Math.min(M.h - MV.h, Math.max(0, MV.y));
  const svg = mapEl.querySelector('svg'); if (!svg) return;
  svg.setAttribute('viewBox', `${MV.x.toFixed(1)} ${MV.y.toFixed(1)} ${MV.w.toFixed(1)} ${MV.h.toFixed(1)}`);
  const k = M.w / MV.w, f = Math.pow(k, .75);
  mapEl.classList.toggle('zoomed', k > 1.02);
  svg.querySelectorAll('.bg').forEach(g => g.setAttribute('transform', `translate(${g.dataset.x} ${g.dataset.y}) scale(${(1 / f).toFixed(4)})`));
}
function animateTo(t){
  t.h = t.w * M.h / M.w; const from = {...MV};
  if (prefs.motion || RED.matches){ Object.assign(MV, t); applyView(); return; }
  const t0 = performance.now();
  const step = now => { const q = Math.min(1, (now - t0) / 320), e = 1 - Math.pow(1 - q, 3); ['x', 'y', 'w', 'h'].forEach(k => { MV[k] = from[k] + (t[k] - from[k]) * e; }); applyView(); if (q < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function zoomAround(w, cx, cy){ w = Math.min(M.w, Math.max(M.w / 12, w)); return {x: cx - (cx - MV.x) * w / MV.w, y: cy - (cy - MV.y) * w / MV.w, w}; }
function zoomBy(f){ animateTo(zoomAround(MV.w / f, MV.x + MV.w / 2, MV.y + MV.h / 2)); }
function zoomToIso(iso){ const c = M.centro[iso]; if (!c) return; const w = Math.min(MV.w, M.w / 3.2); animateTo({x: c[0] - w / 2, y: c[1] - w * M.h / M.w / 2, w}); }
function toMap(cx, cy){ const r = mapEl.querySelector('svg').getBoundingClientRect(); return [MV.x + (cx - r.left) / r.width * MV.w, MV.y + (cy - r.top) / r.height * MV.h]; }
function drawMap(list){
  const byP = {};
  list.forEach(v => { if (v.pais) (byP[v.pais] = byP[v.pais] || []).push(v); });
  const land = M.paises.map(p => `<path class="land${p.iso && byP[p.iso] ? ' on' : ''}${p.iso && p.iso === mapSel ? ' sel' : ''}" ${p.iso && byP[p.iso] ? `data-p="${p.iso}"` : ''} d="${p.d}">${p.iso ? `<title>${esc(country(p.iso))}</title>` : ''}</path>`).join('');
  const bubs = Object.entries(byP).sort((a, b) => b[1].length - a[1].length).map(([iso, vs]) => {
    const [x, y] = M.centro[iso] || [0, 0];
    const R = 9 + Math.sqrt(vs.length) * 5, w = R * .42, m = R - w / 2, C = 2 * Math.PI * m;
    const lv = [5, 4, 3, 2, 1, 0, null].map(k => [k, vs.filter(v => (v.nivel ?? null) === k).length]).filter(([, n]) => n);
    let acc = 0;
    const ring = lv.map(([k, n]) => { const len = n / vs.length * C, seg = `<circle r="${m.toFixed(2)}" fill="none" stroke="${k == null ? 'var(--line-strong)' : `var(--h${k})`}" stroke-width="${w.toFixed(2)}" stroke-dasharray="${len.toFixed(2)} ${C.toFixed(2)}" stroke-dashoffset="${(-acc).toFixed(2)}" transform="rotate(-90)"/>`; acc += len; return seg; }).join('');
    const hi = lv[0][0], lo = lv[lv.length - 1][0];
    const lab = `${country(iso)}: ${Tn('map_n', vs.length, {n: vs.length})}; ${T('f_heat')}: ${hi == null ? T('no_data') : T('h' + hi)}${lo !== hi ? ' – ' + (lo == null ? T('no_data') : T('h' + lo)) : ''}`;
    return `<g class="bg${iso === mapSel ? ' sel' : ''}" data-p="${iso}" data-x="${x}" data-y="${y}" transform="translate(${x} ${y})" tabindex="0" role="button" aria-pressed="${iso === mapSel}" aria-label="${esc(lab)}"><title>${esc(lab)}</title><circle class="bub" r="${R.toFixed(2)}"/>${ring}<circle class="bin" r="${(R - w).toFixed(2)}"/><text class="blab" y="4" text-anchor="middle" aria-hidden="true">${vs.length}</text></g>`;
  }).join('');
  mapEl.innerHTML = `<svg viewBox="0 0 ${M.w} ${M.h}"><g aria-hidden="true"><path class="sphere" d="${M.sphere}"/><path class="grat" d="${M.grat}"/>${land}</g>${bubs}</svg>`;
  applyView();
  const rows = Object.entries(byP).sort((a, b) => b[1].length - a[1].length || country(a[0]).localeCompare(country(b[0]), LOCALE[lang]));
  $('#paises').innerHTML = rows.map(([iso, vs]) => `<li><button type="button" data-p="${iso}">${flagImg(iso, '')}<span>${esc(country(iso))}</span><span class="mono">${vs.length}</span></button></li>`).join('') || `<li class="muted small">${esc(T('map_empty'))}</li>`;
  const sem = list.filter(v => !v.pais).length;
  $('#semPais').textContent = sem ? T('map_none', {n: sem}) : '';
  if (mapSel) renderPanel(byP[mapSel] || []);
}
function renderPanel(vs){
  const iso = mapSel; vs = vs.slice().sort((a, b) => heatScore(b) - heatScore(a)); let lastLv;
  panel.innerHTML = `<div class="mphead">${flagImg(iso, '')}<h3 id="mpT">${esc(country(iso))}</h3><button type="button" class="iconbtn" id="mpBack" aria-label="${esc(T('map_back'))}">×</button></div>
    <p class="small muted">${esc(vs.length ? Tn('map_n', vs.length, {n: vs.length}) : T('map_zero'))}</p>
    <ul class="mplist" role="list">${vs.map(v => { const f = v.fotos?.[0], lv = v.nivel ?? null; const head = lv !== lastLv ? `<li class="lvh" style="--c:${heatVar(lv)}"><span class="sw"></span>${esc(lv == null ? T('no_data') : lv + ' · ' + T('h' + lv))}</li>` : ''; lastLv = lv; return `${head}<li><button type="button" data-open="${esc(v.id)}" style="--c:${heatVar(lv)}">${f ? `<img src="${esc(f.web)}" alt="" loading="lazy">` : `<span class="ph" style="--c:${heatVar(lv)}">${POD}</span>`}<span class="t"><b>${esc(nome(v))}</b>${meter(v.nivel, 'heat')}<span class="small">${esc(T('aroma_label'))}: ${esc(aromaI(v) == null ? T('no_data') : T('a' + aromaI(v)))}</span></span></button></li>`; }).join('')}</ul>
    ${vs.length ? `<button type="button" class="btn" id="mpFilter">${esc(T('map_filter'))}</button>` : ''}`;
  panel.setAttribute('aria-labelledby', 'mpT');
  panel.hidden = false; mapCountries.hidden = true;
}
function selectPais(iso){
  mapSel = iso; drawMap(currentList); zoomToIso(iso);
  panel.focus({preventScroll: true});
  if (innerWidth <= 1100) panel.scrollIntoView({behavior: prefs.motion || RED.matches ? 'auto' : 'smooth', block: 'nearest'});
}
function closePanel(refocus = true){
  const iso = mapSel; mapSel = null; panel.hidden = true; mapCountries.hidden = false; drawMap(currentList); animateTo({x: 0, y: 0, w: M.w});
  if (refocus){ const b = $(`#paises button[data-p="${iso}"]`); (b || mapEl).focus(); }
}
panel.addEventListener('click', e => {
  if (e.target.closest('#mpBack')) return closePanel();
  if (e.target.closest('#mpFilter')){ const iso = mapSel; closePanel(false); reset(); st.pais.add(iso); update(); showView('fichas'); $('#resultados').scrollIntoView({block: 'start'}); $('#resultados').focus({preventScroll: true}); return; }
  const o = e.target.closest('[data-open]'); if (o) openFicha(o.dataset.open);
});
panel.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
const ptrs = new Map(); let pinch = null, dragMoved = 0;
mapEl.addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  mapActive = true; ptrs.set(e.pointerId, [e.clientX, e.clientY]); dragMoved = 0;
  if (ptrs.size === 2){ const [a, b] = [...ptrs.values()]; pinch = {d: Math.hypot(a[0] - b[0], a[1] - b[1]) || 1, w: MV.w, c: toMap((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)}; }
});
addEventListener('pointermove', e => {
  if (!ptrs.has(e.pointerId)) return;
  const [px, py] = ptrs.get(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]);
  const svg = mapEl.querySelector('svg'); if (!svg) return;
  if (ptrs.size === 2 && pinch){
    const [a, b] = [...ptrs.values()]; const t = zoomAround(pinch.w * pinch.d / (Math.hypot(a[0] - b[0], a[1] - b[1]) || 1), pinch.c[0], pinch.c[1]);
    Object.assign(MV, t, {h: t.w * M.h / M.w}); applyView(); dragMoved = 99; return;
  }
  if (ptrs.size === 1 && M.w / MV.w > 1.02){
    const r = svg.getBoundingClientRect(), dx = e.clientX - px, dy = e.clientY - py;
    dragMoved += Math.abs(dx) + Math.abs(dy); MV.x -= dx / r.width * MV.w; MV.y -= dy / r.height * MV.h; applyView();
  }
});
const ptrEnd = e => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null; };
addEventListener('pointerup', ptrEnd); addEventListener('pointercancel', ptrEnd);
mapEl.addEventListener('pointerleave', () => { if (!ptrs.size) mapActive = false; });
mapEl.addEventListener('wheel', e => {
  if (!(e.ctrlKey || e.metaKey || mapActive)) return;
  e.preventDefault(); const [cx, cy] = toMap(e.clientX, e.clientY); const t = zoomAround(MV.w * Math.exp(e.deltaY * .0025), cx, cy);
  Object.assign(MV, t, {h: t.w * M.h / M.w}); applyView();
}, {passive: false});
mapEl.addEventListener('click', e => { if (dragMoved > 6){ dragMoved = 0; return; } const t = e.target.closest('[data-p]'); if (t) selectPais(t.dataset.p); });
mapEl.addEventListener('keydown', e => {
  const t = e.target.closest('[role=button][data-p]');
  if (t && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); selectPais(t.dataset.p); return; }
  const stp = MV.w * .12, k = e.key;
  if (k === '+' || k === '='){ e.preventDefault(); zoomBy(1.5); return; }
  if (k === '-' || k === '_'){ e.preventDefault(); zoomBy(1 / 1.5); return; }
  if (k === '0'){ e.preventDefault(); animateTo({x: 0, y: 0, w: M.w}); return; }
  const d = {ArrowLeft: [-stp, 0], ArrowRight: [stp, 0], ArrowUp: [0, -stp], ArrowDown: [0, stp]}[k];
  if (!d) return; e.preventDefault(); MV.x += d[0]; MV.y += d[1]; applyView();
});
$('#mzIn').addEventListener('click', () => zoomBy(1.6));
$('#mzOut').addEventListener('click', () => zoomBy(1 / 1.6));
$('#mzReset').addEventListener('click', () => animateTo({x: 0, y: 0, w: M.w}));
$('#paises').addEventListener('click', e => { const b = e.target.closest('button[data-p]'); if (b) selectPais(b.dataset.p); });

/* ================= régua picante × aroma ================= */
const chartEl = $('#chart');
let grouping = 'aroma';
$('#chartGroup').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  grouping = b.dataset.g;
  document.querySelectorAll('#chartGroup button').forEach(x => x.setAttribute('aria-pressed', x === b));
  drawChart(); dimChart();
});
const W = 1000, L0 = 170, R0 = 20, X0 = 50, X1 = 3e6;
const lx = x => L0 + (Math.log10(Math.max(x, X0)) - Math.log10(X0)) / (Math.log10(X1) - Math.log10(X0)) * (W - L0 - R0);
function drawChart(){
  const RAD = 6, LANE = 12.5;
  const groups = grouping === 'aroma'
    ? [3, 2, 1].map(k => ({lab: T('a' + k), it: false, items: V.filter(v => aromaI(v) === k && shuRep(v) != null)}))
    : ESPECIES.map(e => ({lab: espName(e), it: e !== '*outra', items: V.filter(v => espOf(v) === e && shuRep(v) != null)}));
  let y = 44; const out = []; const dots = [];
  groups.filter(g => g.items.length).forEach(g => {
    const items = g.items.map(v => ({v, x: lx(shuRep(v))})).sort((a, b) => a.x - b.x);
    const lanes = {}; let lo = 0, hi = 0;
    items.forEach(it => {
      for (let k = 0; ; k++){
        const lane = k === 0 ? 0 : (k % 2 ? (k + 1) / 2 : -k / 2);
        const arr = lanes[lane] = lanes[lane] || [];
        if (!arr.length || it.x - arr[arr.length - 1] >= RAD * 2 + 1){ arr.push(it.x); it.lane = lane; lo = Math.min(lo, lane); hi = Math.max(hi, lane); break; }
      }
    });
    const h = (hi - lo + 1) * LANE + 20, mid = y + 10 + (-lo) * LANE + LANE / 2;
    out.push(`<line x1="${L0}" x2="${W - R0}" y1="${y + h}" y2="${y + h}" stroke="var(--line)"/>`);
    out.push(`<text class="rowlab${g.it ? ' it' : ''}" x="8" y="${mid + 4}">${esc(g.lab)}</text><text x="8" y="${mid + 20}">${g.items.length} ${esc(T('var_short'))}</text>`);
    items.forEach(it => dots.push({v: it.v, x: it.x, y: mid + it.lane * LANE}));
    y += h;
  });
  const H = y + 30;
  const bounds = [X0, 100, 2500, 30000, 100000, 500000, X1];
  const bands = [0,1,2,3,4,5].map(i => {
    const a = lx(bounds[i]), b = lx(bounds[i + 1]);
    return `<rect x="${a}" y="30" width="${b - a}" height="${H - 60}" fill="var(--h${i})" opacity="0.1"/>${i < 5 ? `<line x1="${b}" x2="${b}" y1="30" y2="${H - 30}" stroke="var(--line)"/>` : ''}<text class="bandlab" x="${(a + b) / 2}" y="22" text-anchor="middle">${b - a > 80 ? esc(T('h' + i)) : i}</text>`;
  }).join('');
  const ticks = [[X0, '0'], [100, nf(100)], [1000, nf(1000)], [10000, nf(10000)], [100000, nf(100000)], [1000000, nf(1000000)]]
    .map(([v, t]) => `<line x1="${lx(v)}" x2="${lx(v)}" y1="${H - 30}" y2="${H - 25}" stroke="var(--muted)"/><text x="${lx(v)}" y="${H - 11}" text-anchor="middle">${t}</text>`).join('')
    + `<text x="${W - R0}" y="${H - 11}" text-anchor="end">SHU</text>`;
  const fill = d => grouping === 'aroma' ? `var(--h${d.v.nivel ?? 0})` : aromaVar(aromaI(d.v));
  const circles = dots.map(d => `<circle data-id="${esc(d.v.id)}" cx="${d.x.toFixed(1)}" cy="${d.y.toFixed(1)}" r="${RAD}" fill="${fill(d)}" tabindex="0" role="button" aria-label="${esc(nome(d.v))}, ${shuShort(d.v)}"><title>${esc(nome(d.v))} · ${shuShort(d.v)}</title></circle>`).join('');
  chartEl.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(T('chart_aria'))}">${bands}${out.join('')}${ticks}${circles}</svg>`;
}
function dimChart(){ const ok = new Set(currentList.map(v => v.id)); chartEl.querySelectorAll('circle').forEach(c => c.classList.toggle('dim', !ok.has(c.dataset.id))); }
chartEl.addEventListener('click', e => { const c = e.target.closest('circle'); if (c) openFicha(c.dataset.id); });
chartEl.addEventListener('keydown', e => { const c = e.target.closest('circle'); if (c && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); openFicha(c.dataset.id); } });

/* ================= separadores ================= */
const TABS = ['fichas', 'mapa', 'regua'];
function showView(v, focus){
  document.querySelectorAll('.tabs [role=tab]').forEach(t => { const on = t.dataset.v === v; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
  TABS.forEach(k => { $('#v-' + k).hidden = k !== v; });
  $('#resultados').dataset.view = v;
  setNav(v);
}
function setNav(v){ document.querySelectorAll('#mbar [data-nav]').forEach(b => b.setAttribute('aria-current', b.dataset.nav === v ? 'true' : 'false')); }
$('#mbar').addEventListener('click', e => {
  const b = e.target.closest('[data-nav]'); if (!b) return;
  const n = b.dataset.nav, beh = prefs.motion || RED.matches ? 'auto' : 'smooth';
  if (n === 'guia'){ setNav('guia'); $('#guia').scrollIntoView({behavior: beh, block: 'start'}); return; }
  showView(n); $('#resultados').scrollIntoView({behavior: beh, block: 'start'});
});
const tabsEl = document.querySelector('.tabs');
tabsEl.addEventListener('click', e => { const t = e.target.closest('[role=tab]'); if (t) showView(t.dataset.v); });
tabsEl.addEventListener('keydown', e => {
  const cur = TABS.indexOf(document.querySelector('.tabs [aria-selected=true]').dataset.v);
  if (e.key === 'ArrowRight') showView(TABS[(cur + 1) % TABS.length], true);
  if (e.key === 'ArrowLeft') showView(TABS[(cur + TABS.length - 1) % TABS.length], true);
});

/* ================= identificar pela fotografia =================
   Mesmo algoritmo que ferramentas/gerar_assinaturas.py: separar o fruto do fundo,
   histograma de tons + alongamento, comparar com as fotografias do catálogo. */
const SIG = window.ASSINATURAS || [];
const ID_BINS = 18;
function idComponents(mask, w, h){
  const lab = new Int32Array(w * h), sizes = [0]; let n = 0;
  const stack = new Int32Array(w * h);
  for (let s = 0; s < w * h; s++){
    if (!mask[s] || lab[s]) continue;
    n++; lab[s] = n; let top = 0, c = 0; stack[top++] = s;
    while (top){
      const p = stack[--top]; c++; const x = p % w, y = (p / w) | 0;
      const nb = [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, y > 0 ? p - w : -1, y < h - 1 ? p + w : -1];
      for (const q of nb) if (q >= 0 && mask[q] && !lab[q]){ lab[q] = n; stack[top++] = q; }
    }
    sizes.push(c);
  }
  if (!n) return mask;
  const big = Math.max(...sizes), out = new Uint8Array(w * h);
  for (let s = 0; s < w * h; s++) if (lab[s] && sizes[lab[s]] >= .25 * big) out[s] = 1;
  return out;
}
function idSignature(img){
  const k = Math.min(1, 128 / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * k)), h = Math.max(1, Math.round(img.height * k));
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const cx = cv.getContext('2d', {willReadFrequently: true}); cx.drawImage(img, 0, 0, w, h);
  const d = cx.getImageData(0, 0, w, h).data, N = w * h;
  { /* equilíbrio de brancos: o fundo é assumido neutro */
    const m0 = Math.max(2, Math.floor(w * .06)), ch = [[], [], []];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (x < m0 || x >= w - m0){ const i = (y * w + x) * 4; ch[0].push(d[i]); ch[1].push(d[i + 1]); ch[2].push(d[i + 2]); }
    const med = ch.map(a => { a.sort((p, q) => p - q); return a[a.length >> 1]; }), mean = (med[0] + med[1] + med[2]) / 3;
    if (mean >= 1){ const g = med.map(c => Math.min(1.6, Math.max(.6, mean / Math.max(1, c)))); for (let i = 0; i < N; i++) for (let c = 0; c < 3; c++) d[i * 4 + c] = Math.min(255, Math.round(d[i * 4 + c] * g[c])); }
    cx.putImageData(new ImageData(d, w, h), 0, 0);
  }
  const Vv = new Float32Array(N), Ss = new Float32Array(N);
  for (let i = 0; i < N; i++){ const r = d[i * 4] / 255, g = d[i * 4 + 1] / 255, b = d[i * 4 + 2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b); Vv[i] = mx; Ss[i] = mx ? (mx - mn) / mx : 0; }
  const m = Math.max(2, Math.floor(w * .06)), bgv = new Float32Array(h);
  for (let y = 0; y < h; y++){ const vs = []; for (let x = 0; x < m; x++) vs.push(Vv[y * w + x]); for (let x = w - m; x < w; x++) vs.push(Vv[y * w + x]); vs.sort((a, b) => a - b); bgv[y] = vs[vs.length >> 1]; }
  let mask = new Uint8Array(N);
  for (let i = 0; i < N; i++){ const v = Vv[i], s = Ss[i]; if (s >= .30 || v <= .22 || (Math.abs(v - bgv[(i / w) | 0]) > .28 && s >= .12)) mask[i] = 1; }
  mask = idComponents(mask, w, h);
  const hist = new Array(ID_BINS + 3).fill(0); let n = 0, sx = 0, sy = 0; const pts = [];
  for (let i = 0; i < N; i++){
    if (!mask[i]) continue;
    const x = i % w, y = (i / w) | 0, r = d[i * 4] / 255, g = d[i * 4 + 1] / 255, b = d[i * 4 + 2] / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), v = mx, s = mx ? (mx - mn) / mx : 0;
    let bin;
    if (v < .22) bin = ID_BINS;
    else if (s < .2) bin = v > .72 ? ID_BINS + 1 : ID_BINS + 2;
    else { const dd = mx - mn; let hu = mx === r ? ((g - b) / dd) % 6 : mx === g ? (b - r) / dd + 2 : (r - g) / dd + 4; if (hu < 0) hu += 6; bin = Math.floor(hu * 60 / 20) % ID_BINS; }
    hist[bin]++; n++; sx += x; sy += y; pts.push(x, y);
  }
  if (n < 20) return {ok: false, w, h, mask, cv, a: n / N};
  const tons = hist.slice(0, ID_BINS);
  for (let i = 0; i < ID_BINS; i++) hist[i] = .25 * tons[(i + ID_BINS - 1) % ID_BINS] + .5 * tons[i] + .25 * tons[(i + 1) % ID_BINS];
  const tot = hist.reduce((a, b) => a + b, 0); for (let i = 0; i < hist.length; i++) hist[i] /= tot;
  const mx_ = sx / n, my_ = sy / n; let cxx = 0, cyy = 0, cxy = 0;
  for (let j = 0; j < pts.length; j += 2){ const dx = pts[j] - mx_, dy = pts[j + 1] - my_; cxx += dx * dx; cyy += dy * dy; cxy += dx * dy; }
  cxx /= n; cyy /= n; cxy /= n;
  const t = (cxx + cyy) / 2, dd = Math.sqrt(Math.max(0, ((cxx - cyy) / 2) ** 2 + cxy * cxy));
  return {ok: true, h: hist, e: Math.min(8, Math.sqrt((t + dd) / Math.max(t - dd, 1e-6))), a: n / N, w, h: hist, hh: h, mask, cv};
}
function idRank(sig){
  const best = {};
  SIG.forEach(s => {
    if (!byId[s.id]) return;
    let bc = 0; for (let i = 0; i < s.h.length; i++) bc += Math.sqrt(s.h[i] * sig.h[i]);
    const de = Math.min(1, Math.abs(Math.log(s.e) - Math.log(sig.e)) / 1.2);
    const score = Math.max(0, 1 - (.75 * (1 - bc) + .25 * de));
    if (!best[s.id] || score > best[s.id].score) best[s.id] = {id: s.id, score, web: s.web};
  });
  return Object.values(best).sort((a, b) => b.score - a.score);
}
function idPreview(sig){
  const W = sig.w, H = sig.hh || sig.cv.height, src = sig.cv.getContext('2d').getImageData(0, 0, W, H);
  for (let i = 0; i < W * H; i++) if (!sig.mask[i]){ src.data[i * 4] *= .25; src.data[i * 4 + 1] *= .25; src.data[i * 4 + 2] *= .25; }
  const c = $('#idCanvas'); c.width = W; c.height = H; c.getContext('2d').putImageData(src, 0, 0);
  $('#idPrev').hidden = false;
}
let idLast = [];
function idRender(){
  const out = $('#idOut');
  $('#idNote').textContent = T('id_note', {n: SIG.length});
  if (!idLast.length){ out.innerHTML = `<p class="muted">${esc(T('id_empty'))}</p>`; return; }
  const top = idLast.slice(0, 6);
  out.innerHTML = `${idLast.warn ? `<p class="msg warn">${esc(T('id_warn'))}</p>` : ''}<h3>${esc(T('id_res'))}</h3>
    <ol class="idlist">${top.map(r => { const v = byId[r.id]; return `<li><button type="button" data-open="${esc(v.id)}"><img src="${esc(r.web)}" alt="" loading="lazy"><span class="t"><b>${esc(nome(v))}</b><span class="small">${esc(v.nivel == null ? T('no_data') : T('h' + v.nivel))} · ${esc(T('aroma_label'))}: ${esc(aromaI(v) == null ? T('no_data') : T('a' + aromaI(v)))}</span></span></button></li>`; }).join('')}</ol>
    <button type="button" class="btn" id="idShow">${esc(T('id_show'))}</button>`;
}
async function idFile(file){
  if (!file) return;
  const out = $('#idOut'); out.innerHTML = `<p>${esc(T('id_working'))}</p>`;
  try {
    const url = URL.createObjectURL(file);
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const sig = idSignature(img); URL.revokeObjectURL(url);
    idPreview(sig);
    if (!sig.ok){ idLast = []; out.innerHTML = `<p class="msg warn">${esc(T('id_warn'))}</p>`; return; }
    idLast = idRank(sig); idLast.warn = sig.a < .02 || sig.a > .7;
    idRender();
    const h3 = out.querySelector('h3'); if (h3){ h3.setAttribute('tabindex', '-1'); h3.focus({preventScroll: true}); h3.scrollIntoView({behavior: prefs.motion || RED.matches ? 'auto' : 'smooth', block: 'nearest'}); }
  } catch (e){ idLast = []; out.innerHTML = `<p class="msg warn">${esc(T('id_err'))}</p>`; }
}
const idDlg = $('#identificar'); let idBack = null;
function openIdent(){ if (idDlg.open) return; idBack = document.activeElement; $('#ficha').open && $('#ficha').close(); idDlg.showModal(); }
$('#bId').addEventListener('click', openIdent);
$('#idFechar').addEventListener('click', () => idDlg.close());
idDlg.addEventListener('click', e => { if (e.target === idDlg) idDlg.close(); });
idDlg.addEventListener('close', () => { if (idBack && document.contains(idBack)) idBack.focus(); });
['#idCam', '#idGal'].forEach(s => $(s).addEventListener('change', e => { idFile(e.target.files[0]); e.target.value = ''; }));
$('#idOut').addEventListener('click', e => {
  const o = e.target.closest('[data-open]'); if (o) return openFicha(o.dataset.open);
  if (e.target.closest('#idShow')){ idBack = null; idDlg.close(); reset(); idLast.slice(0, 6).forEach(r => st.ids.add(r.id)); st.sort = 'desc'; update(); showView('fichas'); $('#resultados').scrollIntoView({block: 'start'}); $('#resultados').focus({preventScroll: true}); }
});

/* ================= ficha ================= */
const dlg = $('#ficha');
$('#fBody').addEventListener('click', e => { if (e.target.closest('[data-close]')) dlg.close(); });
let openId = null, lastFocus = null;
$('#fechar').addEventListener('click', () => dlg.close());
dlg.addEventListener('close', () => { openId = null; if (lastFocus && document.contains(lastFocus)) lastFocus.focus(); });
dlg.addEventListener('click', e => {
  if (e.target === dlg) dlg.close();
  const a = e.target.closest('[data-alt]'); if (a) openFicha(a.dataset.alt);
  const s = e.target.closest('[data-step]');
  if (s){ const inp = $('#fQty'); inp.value = clampQ((+inp.value || 0) + (+s.dataset.step) * (C.quantidadePasso || 5)); }
  const add = e.target.closest('#fAdd'); if (add){ setQty(openId, clampQ(+$('#fQty').value)); toast(T('added', {name: nome(byId[openId]), q: cart[openId]})); openFicha(openId); }
});
const LUPA = '<svg class="lupa" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
function srcLinks(keys){ return (keys || []).map(k => D.fontes[k]).filter(Boolean).map(([t, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a>`); }
function srcDetails(keys){ const l = srcLinks(keys); return l.length ? `<details class="srcd"><summary>${LUPA}<span>${esc(T('d_sources'))} (${l.length})</span></summary><div class="src">${l.join(' · ')}</div></details>` : ''; }
/* malaguetas de mercado: tabela de Scoville da Wikipedia */
const MARKET = [['mk_bell', 0, 0], ['Banana pepper', 0, 500], ['Poblano', 1000, 2500], ['Jalapeño', 2500, 10000], ['Serrano', 10000, 25000], ['mk_cayenne', 25000, 50000], ["Bird's eye", 50000, 100000], ['Habanero / Scotch bonnet', 100000, 350000], ['Red Savina', 350000, 750000], ['Ghost pepper', 750000, 1500000], ['Carolina Reaper', 1500000, 2500000]];
const JAL = 5000;
const mkName = n => n.startsWith('mk_') ? T(n) : n;
const mkRep = m => m[1] === 0 ? m[2] / 2 : Math.sqrt(m[1] * m[2]);
const mkRange = m => m[1] === m[2] ? nf(m[1]) : `${nf(m[1])}–${nf(m[2])}`;
function fmtX(x){ if (x >= 10){ const q = Math.pow(10, Math.floor(Math.log10(x)) - 1); return nf(Math.round(x / q) * q); } return nf(x, x < 1 ? 2 : 1); }
function forceTxt(v){ const r = shuRep(v); if (r == null) return null; return r === 0 ? T('chef_force_0') : T('chef_force_v', {x: fmtX(r / JAL)}); }
function market(v){ const r = shuRep(v); if (r == null) return null; let best = null, bd = Infinity; MARKET.forEach(m => { const d = Math.abs(Math.log(r + 1) - Math.log(mkRep(m) + 1)); if (d < bd){ bd = d; best = m; } }); return best; }
const CURIOS = [['c_old', ['perry2007'], 'aji-challuaruro'], ['c_plac', ['wiki_capsaicin'], 'scotch-bonnet-laranja-lanterna'], ['c_art', ['powis2013'], 'dark-jalapeno-darth'], ['c_milk', ['psu_milk'], 'jay-s-white-ghost'], ['c_name', ['wiki_chili'], 'birds-eye'], ['c_rec', ['wiki_pepperx'], 'carolina-reaper-chocolate'], ['c_birds', ['tewksbury2001'], 'chiltepin'], ['c_sp5', ['wiki_capsicum'], 'rocoto-vermelho-ericeira'], ['c_scov', ['wiki_wscoville'], 'carolina-reaper-red'], ['c_chin', ['wiki_chinense'], 'madame-jeanette'], ['c_nobel', ['nobel2021'], 'bhut-jolokia-red'], ['c_vitc', ['nlm_szent'], 'ethiopian-brown-berbere']];
function alternatives(v){
  if (v.nivel == null) return [];
  return V.filter(o => o.id !== v.id && o.nivel != null && Math.abs(o.nivel - v.nivel) <= 1)
    .map(o => {
      let s = 0;
      (o.aroma?.perfil || []).forEach(p => { if ((v.aroma?.perfil || []).includes(p)) s += 3; });
      (o.refeicoes || []).forEach(r => { if ((v.refeicoes || []).includes(r)) s += 1; });
      if (o.nivel === v.nivel) s += 2;
      if (aromaI(o) === aromaI(v)) s += 1;
      if (espOf(o) === espOf(v)) s += 1;
      if (o.fotos?.length) s += 0.5;
      return [s, o];
    }).filter(x => x[0] >= 5).sort((a, b) => b[0] - a[0]).slice(0, 4).map(x => x[1]);
}
function chefBlock(v){
  const ft = forceTxt(v), mk = market(v);
  const pills = arr => `<span class="pills">${arr.map(x => `<span class="pill">${esc(X(x))}</span>`).join('')}</span>`;
  return `<section class="chef" aria-labelledby="chefT"><h3 id="chefT">${esc(T('chef_t'))}</h3><dl>
    ${ft ? `<div><dt>${esc(T('chef_force'))}</dt><dd><b>${esc(ft)}</b><span class="small muted">${esc(T('chef_force_note'))}</span></dd></div>` : ''}
    ${mk ? `<div><dt>${esc(T('chef_equiv'))}</dt><dd><b>${esc(mkName(mk[0]))}</b><span class="small muted">${mkRange(mk)} SHU</span></dd></div>` : ''}
    ${v.tradicao?.length ? `<div><dt>${esc(T('chef_trad'))}</dt><dd>${pills(v.tradicao)}</dd></div>` : ''}
  </dl></section>`;
}
function careBlock(v){
  const k = v.nivel == null ? 'unk' : v.nivel <= 1 ? 'low' : String(v.nivel);
  return `<section class="care" style="--c:${heatVar(v.nivel)}" aria-labelledby="careT"><h3 id="careT">${esc(T('care_t'))} <span class="lvl">${esc(v.nivel == null ? T('no_data') : v.nivel + ' · ' + T('h' + v.nivel))}</span></h3><dl>
    <div><dt>${esc(T('care_hand'))}</dt><dd>${esc(T('hand_' + k))}</dd></div>
    <div><dt>${esc(T('care_prec'))}</dt><dd>${esc(T('prec_' + k))}</dd></div>
  </dl>${srcDetails(['wiki_chili', 'nhs_reflux'].concat(v.nivel >= 5 ? ['ns_reaper'] : []))}</section>`;
}
function openFicha(id){
  const v = byId[id]; if (!v) return;
  if (!dlg.open) lastFocus = document.activeElement;
  openId = id;
  const pics = v.fotos?.length ? v.fotos.map(f => `<img src="${esc(f.web)}" alt="${esc(nome(v))}">`).join('')
    : `<div class="ph" style="--c:${heatVar(v.nivel)}">${POD}<b>${esc(nome(v))}</b><span>${esc(T('no_photo_long'))}</span></div>`;
  const row = (t, x) => x ? `<div><dt>${esc(T(t))}</dt><dd>${x}</dd></div>` : '';
  const pills = arr => arr && arr.length ? `<span class="pills">${arr.map(x => `<span class="pill">${esc(X(x))}</span>`).join('')}</span>` : '';
  const alts = alternatives(v);
  const a = v.aroma || {i: null, perfil: [], base: 'sem dados'};
  const q = cart[id];
  const order = !ORDERS ? '' : v.disponivel === false ? `<p class="muted">${esc(T('unavailable'))}</p>` : `<div class="order-box">
      <span class="lab" id="fQtyLab">${esc(T('qty'))}</span>
      <span class="stepper"><button type="button" data-step="-1" aria-label="${esc(T('less'))}">−</button><input id="fQty" type="number" inputmode="numeric" min="1" max="${C.quantidadeMax || 500}" value="${q || C.quantidadePadrao || 10}" aria-labelledby="fQtyLab"><span class="u">${esc(T('seeds'))}</span><button type="button" data-step="1" aria-label="${esc(T('more'))}">+</button></span>
      <button type="button" class="btn primary" id="fAdd">${esc(T(q ? 'update_order' : 'add_order'))}</button>
    </div>`;
  $('#fBody').innerHTML = `<div class="fx">
    <div class="pics">${pics}</div>
    <div class="info">
      <h2 id="fTitulo">${esc(nome(v))}</h2>
      <div class="origin">${flagImg(v.pais, '')}<span><span class="sp">${esc(X(v.especie) || T('sp_unknown'))}</span>${v.grupo ? ' · ' + esc(X(v.grupo)) : ''}${v.pais ? ' · ' + esc(country(v.pais)) : ''}</span></div>
      <div class="blocks">
        <div class="blk">${meter(v.nivel, 'heat', true)}<div class="shu">${shuFull(v)} <span class="tag">${esc(T('t_' + v.tipoShu))}</span></div>${v.shuTxt ? `<div class="small muted">${esc(X(v.shuTxt))}</div>` : ''}</div>
        <div class="blk">${meter(a.i, 'aroma', true)}<div class="pills">${(a.perfil || []).map(pill).join('') || `<span class="small muted">${esc(T('profile_none'))}</span>`}</div><div class="small muted">${esc(T('b_' + a.base))}</div></div>
      </div>
      ${order}
      ${chefBlock(v)}
      ${careBlock(v)}
      <dl>
        ${row('d_kitchen', esc(X(v.cozinha)))}
        ${row('d_meals', pills(v.refeicoes))}
        ${row('d_pair', pills(v.harmoniza))}
        ${row('d_prep', pills(v.usos))}
        ${row('d_flavor', esc(X(v.sabor)))}
        ${row('d_look', esc(X(v.aspeto)))}
        ${row('d_origin', esc(X(v.origem)))}
        ${alts.length ? row('d_alts', `<span class="alts">${alts.map(o => `<button type="button" data-alt="${esc(o.id)}">${o.fotos?.length ? `<img src="${esc(o.fotos[0].web)}" alt="">` : `<span class="dot" style="--c:${heatVar(o.nivel)}"></span>`}${esc(nome(o))}</button>`).join('')}</span>`) : ''}
      </dl>
      ${v.nota ? `<div class="note">${esc(X(v.nota))}</div>` : ''}
      ${srcDetails(v.fontes)}
    </div></div>`;
  if (!dlg.open) dlg.showModal();
  dlg.scrollTop = 0;
}

/* ================= encomenda ================= */
let cart = store.get('cc.encomenda.v1', {});
Object.keys(cart).forEach(k => { if (!byId[k] || !(cart[k] > 0)) delete cart[k]; });
const clampQ = n => Math.max(1, Math.min(C.quantidadeMax || 500, Math.round(n) || 1));
function saveCart(){ store.set('cc.encomenda.v1', cart); const n = Object.keys(cart).length; ['#cartCount', '#mCartCount'].forEach(s => { $(s).hidden = !n; $(s).textContent = n; }); }
function setQty(id, q){ if (q > 0) cart[id] = q; else delete cart[id]; saveCart(); update(false); }
function addToCart(id, q){ setQty(id, clampQ((cart[id] || 0) + q)); toast(T('added', {name: nome(byId[id]), q: cart[id]})); }
const od = $('#encomenda');
const form = {nome:'', email:'', tel:'', morada:'', cp:'', local:'', pais: C.paisPadrao || 'Portugal', nif:'', entrega:'correio', obs:'', consent:false};
Object.assign(form, store.get('cc.form.v1', {}));
let orderState = 'edit', lastOrder = null;
function openOrder(){ if (ORDERS && !od.open){ lastFocus = document.activeElement; orderState = 'edit'; renderOrder(); od.showModal(); } }
$('#bCart').addEventListener('click', openOrder);
$('#mCart').addEventListener('click', openOrder);
$('#oFechar').addEventListener('click', () => od.close());
od.addEventListener('close', () => { if (orderState !== 'edit'){ orderState = 'edit'; } if (lastFocus && document.contains(lastFocus)) lastFocus.focus(); });
od.addEventListener('click', e => { if (e.target === od) od.close(); });
function field(id, key, type, req, attrs = ''){
  return `<div class="field${['morada', 'obs', 'nome'].includes(key) ? ' full' : ''}"><label for="${id}">${esc(T(id))}${req ? ` <span class="req" aria-hidden="true">*</span><span class="vh">(${esc(T('o_req_mark'))})</span>` : ''}</label>
    ${type === 'textarea' ? `<textarea id="${id}" name="${key}" ${attrs}>${esc(form[key])}</textarea>` : `<input id="${id}" name="${key}" type="${type}" value="${esc(form[key])}" ${req ? 'required aria-required="true"' : ''} ${attrs}>`}
    <span class="err" id="${id}-err" hidden></span></div>`;
}
function itemsHTML(){
  const ids = Object.keys(cart).filter(id => byId[id]);
  if (!ids.length) return `<p class="muted">${esc(T('o_empty'))}</p>`;
  const totalQ = ids.reduce((s, id) => s + cart[id], 0);
  return `<ul class="items">${ids.map(id => { const v = byId[id], f = v.fotos?.[0]; return `<li>
      ${f ? `<img src="${esc(f.web)}" alt="">` : `<span class="dot" style="--c:${heatVar(v.nivel)}"></span>`}
      <div><div class="nm">${esc(nome(v))}</div><div class="sub">${v.pais ? esc(country(v.pais)) + ' · ' : ''}${v.nivel == null ? '' : esc(T('h' + v.nivel))}</div></div>
      <span></span>
      <div class="ctrl"><span class="stepper"><button type="button" data-oq="${esc(id)}" data-d="-1" aria-label="${esc(T('less'))}: ${esc(nome(v))}">−</button><input type="number" inputmode="numeric" min="1" max="${C.quantidadeMax || 500}" value="${cart[id]}" data-oi="${esc(id)}" aria-label="${esc(T('qty'))}: ${esc(nome(v))}"><span class="u">${esc(T('seeds'))}</span><button type="button" data-oq="${esc(id)}" data-d="1" aria-label="${esc(T('more'))}: ${esc(nome(v))}">+</button></span>
      <button type="button" class="rm" data-orm="${esc(id)}">${esc(T('o_remove'))}</button></div>
    </li>`; }).join('')}</ul><p class="total">${esc(Tn('o_total', ids.length, {n: ids.length, q: nf(totalQ)}))}</p>`;
}
function renderOrder(){
  const body = $('#oBody');
  if (orderState === 'ok'){
    body.innerHTML = `<div class="msg ok" tabindex="-1" id="oMsg"><h3>${esc(T('o_ok_t'))}</h3><p>${esc(T('o_ok', {ref: lastOrder.ref}))}</p></div><div class="actions"><button type="button" class="btn primary" id="oBack">${esc(T('o_back'))}</button></div>`;
    $('#oMsg').focus(); return;
  }
  if (orderState === 'fail' || orderState === 'activation'){
    body.innerHTML = `<div class="msg warn" tabindex="-1" id="oMsg"><h3>${esc(T('o_fail_t'))}</h3><p>${esc(orderState === 'activation' ? T('o_activation') : T('o_fail', {email: C.email}))}</p><pre>${esc(lastOrder.text)}</pre></div>
      <div class="actions"><a class="btn primary" href="${esc(mailtoHref(lastOrder))}">${esc(T('o_mail'))}</a><button type="button" class="btn" id="oCopy">${esc(T('o_copy'))}</button></div>
      <div class="actions"><button type="button" class="btn ghost" id="oEdit">← ${esc(T('o_title'))}</button></div>`;
    $('#oMsg').focus(); return;
  }
  body.innerHTML = `<section aria-labelledby="oSeeds"><h3 id="oSeeds">${esc(T('o_seeds'))}</h3>${itemsHTML()}</section>
    <form id="oForm" novalidate aria-labelledby="oDados">
      <h3 id="oDados" style="margin-bottom:.75rem">${esc(T('o_data'))}</h3>
      <div class="form">
        ${field('f_name', 'nome', 'text', true, 'autocomplete="name"')}
        ${field('f_email', 'email', 'email', true, 'autocomplete="email" inputmode="email"')}
        ${field('f_phone', 'tel', 'tel', false, 'autocomplete="tel" inputmode="tel"')}
        <div class="field full"><span class="lab" id="lEntrega" style="font-weight:600">${esc(T('f_delivery'))}</span><div class="radios" role="radiogroup" aria-labelledby="lEntrega">
          <label><input type="radio" name="entrega" value="correio" ${form.entrega === 'correio' ? 'checked' : ''}>${esc(T('del_post'))}</label>
          <label><input type="radio" name="entrega" value="mao" ${form.entrega === 'mao' ? 'checked' : ''}>${esc(T('del_pickup'))}</label></div></div>
        ${field('f_addr', 'morada', 'text', form.entrega === 'correio', 'autocomplete="street-address"')}
        ${field('f_zip', 'cp', 'text', form.entrega === 'correio', 'autocomplete="postal-code"')}
        ${field('f_city', 'local', 'text', form.entrega === 'correio', 'autocomplete="address-level2"')}
        ${field('f_ctry', 'pais', 'text', form.entrega === 'correio', 'autocomplete="country-name"')}
        ${field('f_nif', 'nif', 'text', false, 'inputmode="numeric"')}
        ${field('f_notes', 'obs', 'textarea', false, `placeholder="${esc(T('f_notes_ph'))}"`)}
      </div>
      <div class="hp" aria-hidden="true"><label>Website<input type="text" name="_honey" tabindex="-1" autocomplete="off"></label></div>
      <label class="consent" style="margin-top:1rem"><input type="checkbox" id="f_consent" name="consent" ${form.consent ? 'checked' : ''} required aria-describedby="f_consent-err"><span>${esc(T('f_consent'))} <span class="req" aria-hidden="true">*</span></span></label>
      <span class="err" id="f_consent-err" hidden style="color:var(--err);font-weight:600"></span>
      <p class="privacy" style="margin-top:.75rem">${esc(T('o_privacy'))}</p>
      <p class="err" id="oErr" role="alert" hidden style="color:var(--err);font-weight:700"></p>
      <div class="actions" style="margin-top:1rem"><button type="submit" class="btn primary" id="oSend">${esc(T('o_send'))}</button></div>
    </form>`;
}
$('#oBody').addEventListener('click', e => {
  const q = e.target.closest('[data-oq]');
  if (q){ const id = q.dataset.oq; setQty(id, clampQ((cart[id] || 0) + (+q.dataset.d) * (C.quantidadePasso || 5))); const inp = $(`[data-oi="${CSS.escape(id)}"]`); renderItems(); const ni = $(`[data-oq="${CSS.escape(id)}"][data-d="${q.dataset.d}"]`); ni && ni.focus(); return; }
  const r = e.target.closest('[data-orm]'); if (r){ setQty(r.dataset.orm, 0); renderItems(); $('#oSeeds').focus?.(); return; }
  if (e.target.closest('#oBack')){ od.close(); return; }
  if (e.target.closest('#oEdit')){ orderState = 'edit'; renderOrder(); return; }
  if (e.target.closest('#oCopy')) copyText(lastOrder.text);
});
function renderItems(){ const sec = $('#oSeeds')?.parentElement; if (sec) sec.innerHTML = `<h3 id="oSeeds" tabindex="-1">${esc(T('o_seeds'))}</h3>${itemsHTML()}`; }
$('#oBody').addEventListener('change', e => {
  const i = e.target.closest('[data-oi]'); if (i){ setQty(i.dataset.oi, clampQ(+i.value)); renderItems(); return; }
  if (e.target.name === 'entrega'){ form.entrega = e.target.value; saveForm(); renderOrder(); $(`input[name=entrega][value="${form.entrega}"]`).focus(); }
  if (e.target.id === 'f_consent'){ form.consent = e.target.checked; saveForm(); }
});
$('#oBody').addEventListener('input', e => { const n = e.target.name; if (n && n in form && n !== 'entrega' && n !== 'consent'){ form[n] = e.target.value; saveForm(); } });
function saveForm(){ const {consent, ...rest} = form; store.set('cc.form.v1', rest); }
function setErr(id, msg){ const el = $('#' + id), er = $('#' + id + '-err'); if (!el || !er) return; if (msg){ el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', id + '-err'); er.textContent = msg; er.hidden = false; } else { el.removeAttribute('aria-invalid'); er.hidden = true; } }
function validate(){
  let first = null; const bad = (id, m) => { setErr(id, m); if (!first) first = id; };
  ['f_name', 'f_email', 'f_addr', 'f_zip', 'f_city', 'f_ctry'].forEach(id => setErr(id, ''));
  if (!form.nome.trim()) bad('f_name', T('o_req'));
  if (!form.email.trim()) bad('f_email', T('o_req')); else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) bad('f_email', T('o_bad_email'));
  if (form.entrega === 'correio'){ [['f_addr', 'morada'], ['f_zip', 'cp'], ['f_city', 'local'], ['f_ctry', 'pais']].forEach(([id, k]) => { if (!form[k].trim()) bad(id, T('o_req')); }); }
  setErr('f_consent', form.consent ? '' : T('o_need_consent')); if (!form.consent && !first) first = 'f_consent';
  const err = $('#oErr');
  if (!Object.keys(cart).length){ err.textContent = T('o_need_items'); err.hidden = false; return false; }
  if (first){ err.textContent = T('o_fix'); err.hidden = false; $('#' + first).focus(); return false; }
  err.hidden = true; return true;
}
function makeRef(){ const d = new Date(), p = n => String(n).padStart(2, '0'); return `CC-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`; }
function buildOrder(){
  const ref = makeRef();
  const ids = Object.keys(cart).filter(id => byId[id]);
  const lines = ids.map(id => { const v = byId[id]; return `- ${v.nome} — ${cart[id]} sementes${v.lista?.length ? ` (lista nº ${v.lista.join(', ')})` : ''}`; });
  const totalQ = ids.reduce((s, id) => s + cart[id], 0);
  const entrega = form.entrega === 'correio' ? 'Envio por correio' : 'Levantamento em mão';
  const morada = form.entrega === 'correio' ? `${form.morada}, ${form.cp} ${form.local}, ${form.pais}` : '—';
  const text = [`Pedido de encomenda ${ref} — CATÁLOGO CHILI`, '', 'SEMENTES', ...lines, `Total: ${ids.length} variedades, ${totalQ} sementes`, '',
    'CLIENTE', `Nome: ${form.nome}`, `Email: ${form.email}`, `Telefone: ${form.tel || '—'}`, `Entrega: ${entrega}`, `Morada: ${morada}`, `NIF: ${form.nif || '—'}`, `Observações: ${form.obs || '—'}`, '',
    `Língua do site: ${lang} · Data: ${new Date().toLocaleString('pt-PT')}`].join('\n');
  const payload = {
    _subject: `Pedido de encomenda ${ref} — CATÁLOGO CHILI`, _template: 'table', _captcha: 'false', _replyto: form.email.trim(), _honey: $('input[name=_honey]')?.value || '',
    'Referência': ref, 'Nome': form.nome.trim(), 'email': form.email.trim(), 'Telefone': form.tel || '—', 'Entrega': entrega, 'Morada': morada, 'NIF': form.nif || '—',
    'Sementes': lines.join('\n'), 'Total': `${ids.length} variedades, ${totalQ} sementes`, 'Observações': form.obs || '—', 'Língua do site': lang
  };
  return {ref, text, payload};
}
function mailtoHref(o){ return `mailto:${C.email}?subject=${encodeURIComponent(o.payload._subject)}&body=${encodeURIComponent(o.text)}`; }
async function copyText(t){
  try { await navigator.clipboard.writeText(t); toast(T('o_copied')); }
  catch (e){ const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast(T('o_copied')); } catch (_) {} ta.remove(); }
}
$('#oBody').addEventListener('submit', async e => {
  e.preventDefault();
  if (!validate()) return;
  const btn = $('#oSend'); btn.disabled = true; btn.textContent = T('o_sending');
  lastOrder = buildOrder();
  try {
    const r = await fetch(C.envio, {method:'POST', headers:{'Content-Type':'application/json', 'Accept':'application/json'}, body: JSON.stringify(lastOrder.payload)});
    const j = await r.json().catch(() => ({}));
    const ok = r.ok && (j.success === true || j.success === 'true');
    if (ok){ orderState = 'ok'; cart = {}; saveCart(); update(false); }
    else orderState = /activ/i.test(j.message || '') ? 'activation' : 'fail';
  } catch (err){ orderState = 'fail'; }
  renderOrder();
});

/* ================= conteúdo estático traduzível ================= */
/* ================= curiosidades: faixa no topo, 3 s por curiosidade ================= */
const CUR_MS = 3000;
let curI = 0, curPlay = !(prefs.motion || RED.matches), curHold = false, curTimer = null;
const ICO_PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';
const ICO_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5l12 7-12 7z" fill="currentColor"/></svg>';
function curRender(announce){
  const n = CURIOS.length; if (!n) return;
  const [k, fs, vid] = CURIOS[curI], v = byId[vid], f = v && v.fotos && v.fotos[0];
  const sl = $('#cSlide');
  sl.setAttribute('aria-live', announce ? 'polite' : 'off');
  sl.innerHTML = `<div class="cfade"><p class="ctxt">${T(k)}</p><div class="cfoot">${v ? `<button type="button" class="linkish" data-open="${esc(v.id)}">${esc(T('cur_photo', {name: nome(v)}))}</button>` : ''}${srcDetails(fs)}</div></div>`;
  const ci = $('#cImg');
  ci.hidden = !f;
  if (f){ ci.dataset.open = v.id; ci.style.setProperty('--c', heatVar(v.nivel)); ci.setAttribute('aria-label', T('open_card', {name: nome(v)})); ci.innerHTML = `<img src="${esc(f.web)}" alt="" width="64" height="64">`; }
  $('#cPos').textContent = `${curI + 1}/${n}`;
  const pb = $('#cPlay'); pb.innerHTML = curPlay ? ICO_PAUSE : ICO_PLAY; pb.setAttribute('aria-label', T(curPlay ? 'cur_pause' : 'cur_play'));
  curBarRestart();
}
function curBarRestart(){
  const b = $('#cBar'); b.style.animation = 'none'; void b.offsetWidth;
  b.style.animation = curPlay && !(prefs.motion || RED.matches) ? `cbar ${CUR_MS}ms linear forwards` : 'none';
  b.style.animationPlayState = curHold ? 'paused' : 'running';
}
function curGo(d, announce = true){ curI = (curI + d + CURIOS.length) % CURIOS.length; curRender(announce); }
let curLeft = CUR_MS, curT0 = 0;
function curSched(ms){ clearTimeout(curTimer); curLeft = ms; curT0 = Date.now(); if (curPlay && !curHold) curTimer = setTimeout(() => { if (document.hidden || $('#cSlide details[open]')){ curSched(CUR_MS); return; } curGo(1, false); curSched(CUR_MS); }, ms); }
function curTick(){ curSched(CUR_MS); }
function curHoldSet(on){
  if (on === curHold) return; curHold = on;
  const b = $('#cBar'); b.style.animationPlayState = on ? 'paused' : 'running';
  if (on){ clearTimeout(curTimer); curLeft = Math.max(300, curLeft - (Date.now() - curT0)); } else curSched(curLeft);
}
$('#cPrev').addEventListener('click', () => { curGo(-1); curTick(); });
$('#cNext').addEventListener('click', () => { curGo(1); curTick(); });
$('#cPlay').addEventListener('click', () => { curPlay = !curPlay; curRender(false); curTick(); });
const curBox = $('#curiosidades');
curBox.addEventListener('click', e => { const o = e.target.closest('[data-open]'); if (o) openFicha(o.dataset.open); });
curBox.addEventListener('mouseenter', () => curHoldSet(true)); curBox.addEventListener('mouseleave', () => { if (!curBox.contains(document.activeElement)) curHoldSet(false); });
curBox.addEventListener('focusin', () => curHoldSet(true)); curBox.addEventListener('focusout', e => { if (!curBox.contains(e.relatedTarget) && !curBox.matches(':hover')) curHoldSet(false); });
curTick();

/* faixa de fotografias: da mais suave à mais picante */
function renderRibbon(){
  const ph = V.filter(v => v.fotos && v.fotos.length && v.nivel != null).sort((x, y) => heatScore(x) - heatScore(y));
  const N = Math.min(ph.length, 14), pick = [];
  for (let i = 0; i < N; i++) pick.push(ph[Math.round(i * (ph.length - 1) / Math.max(1, N - 1))]);
  $('#ribbon').innerHTML = [...new Set(pick)].map(v => `<button type="button" data-open="${esc(v.id)}" style="--c:${heatVar(v.nivel)}" aria-label="${esc(T('open_card', {name: nome(v)}))} (${esc(v.nivel + ' · ' + T('h' + v.nivel))})"><span class="rimg"><img src="${esc(v.fotos[0].web)}" alt="" width="72" height="72" loading="lazy"></span><span class="rn">${esc(nome(v))}</span></button>`).join('');
}
$('#ribbon').addEventListener('click', e => { const b = e.target.closest('[data-open]'); if (b) openFicha(b.dataset.open); });

function buildStatic(){
  $('#tNivel').innerHTML = [0,1,2,3,4,5].map(k => `<tr><td><span class="sw" style="--c:var(--h${k})"></span></td><td><b>${k} · ${esc(T('h' + k))}</b></td><td class="mono">${k < 5 ? nf([0, 100, 2500, 30000, 100000][k]) + '–' + nf([100, 2500, 30000, 100000, 500000][k]) : '> ' + nf(500000)}</td><td class="muted">${esc(T('hx' + k))}</td></tr>`).join('');
  $('#tAroma').innerHTML = [1,2,3].map(k => `<tr><td><span class="sw" style="--c:var(--a${k})"></span></td><td><b>${k} · ${esc(T('a' + k))}</b></td><td class="muted">${esc(T('ad' + k))}</td></tr>`).join('');
  $('#tips').innerHTML = ['tip1', 'tip2', 'tip3', 'tip4'].map(k => `<li>${T(k)}</li>`).join('');
  $('#tMercado').innerHTML = `<tr><th scope="col">${esc(T('mk_name'))}</th><th scope="col">SHU</th><th scope="col">${esc(T('mk_x'))}</th></tr>` + MARKET.map(m => `<tr><td><b>${esc(mkName(m[0]))}</b></td><td class="mono">${mkRange(m)}</td><td class="mono">${mkRep(m) ? '≈ ' + fmtX(mkRep(m) / JAL) + '×' : '0'}</td></tr>`).join('');
  $('#nFontes').textContent = Object.keys(D.fontes).length;
  curRender(false); renderRibbon();
  $('#mLegend').innerHTML = `<span class="lt">${esc(T('map_legend'))}</span>` + [5, 4, 3, 2, 1, 0].map(k => `<span class="li"><span class="sw" style="--c:var(--h${k})"></span>${k} · ${esc(T('h' + k))}</span>`).join('') + `<span class="li"><span class="sw" style="--c:var(--line-strong)"></span>${esc(T('no_data'))}</span>`;
  $('#locPais').textContent = country('PT');
  idRender();
  $('#fontes').innerHTML = Object.values(D.fontes).sort((a, b) => a[0].localeCompare(b[0], 'pt')).map(([t, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a></li>`).join('');
  $('#stats').innerHTML = [[V.length, 'st_var'], [new Set(V.map(v => v.pais).filter(Boolean)).size, 'st_paises']]
    .map(([n, k]) => `<div><dt>${esc(T(k))}</dt><dd class="mono">${nf(n)}</dd></div>`).join('');
  const d = new Date(D.atualizado + 'T12:00:00');
  $('#foot').textContent = `${T('updated', {d: new Intl.DateTimeFormat(LOCALE[lang], {dateStyle: 'long'}).format(d)})} ${T('disclaimer')}`;
}

/* ================= render ================= */
function update(rebuild = true){
  buildFilters();
  const list = sorted(V.filter(v => match(v)));
  currentList = list;
  grid.innerHTML = list.length ? list.map(card).join('') : `<div class="empty"><p>${esc(T('empty'))}</p><button class="btn" type="button" id="limpar3">${esc(T('clear'))}</button></div>`;
  const l3 = $('#limpar3'); if (l3) l3.addEventListener('click', () => { reset(); update(); });
  activeTags(list.length);
  drawMap(list); dimChart();
}

/* barra: marca aparece quando o título sai do ecrã */
const bar = $('#bar');
new IntersectionObserver(([en]) => bar.classList.toggle('scrolled', !en.isIntersecting), {rootMargin: '-60px 0px 0px 0px'}).observe(document.querySelector('.hero h1'));

/* ================= arranque ================= */
applyPrefs(); saveCart();
const saved = store.get('cc.lang', null);
const nav = (navigator.language || 'pt').slice(0, 2).toLowerCase();
const first = saved || (LANGS.some(l => l[0] === nav) ? nav : 'pt');
setLang(first, !!saved).then(() => {
  const h = (location.hash || '').slice(1);
  if (TABS.includes(h)) showView(h);
  else if (h === 'identificar') openIdent();
  else if (h.startsWith('v-') && byId[h.slice(2)]) openFicha(h.slice(2));
  else if (h === 'encomenda') openOrder();
});
})();
