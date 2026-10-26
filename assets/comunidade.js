/* CATÁLOGO CHILI · coleção pessoal e comunidade de colecionadores
   Camada de dados, sem interface. Dois modos:
   - local: perfil e coleção ficam só neste aparelho (localStorage + IndexedDB para as fotografias);
   - online: com o Supabase configurado em config.js e sessão iniciada por email.
   Todos os campos do perfil são opcionais; o perfil é privado até o dono escolher "público". */
(() => {
'use strict';
const CFG = (window.CONFIG && window.CONFIG.comunidade) || {};
const ONLINE_OK = !!(CFG.url && CFG.chave);
const LKEY = 'cc.colecao.v1';
const ESTADOS = ['sementes', 'planta', 'fruto', 'quero'];
const MAX_FOTOS = 12;
const listeners = new Set();
const emit = (what) => listeners.forEach(fn => { try { fn(what); } catch (e) { console.error(e); } });

/* ---------- utilitários ---------- */
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10)).replace(/-/g, '').slice(0, 20);
const hoje = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
const ID_RE = /^[a-z0-9-]{1,60}$/;
const PATH_RE = /^[0-9a-f-]{36}\/[a-z0-9-]{1,60}\/[a-z0-9]{1,40}(_m)?\.jpg$/;
const cleanPath = x => typeof x === 'string' && PATH_RE.test(x) ? x : null;
const clean = (s, n) => { s = (s == null ? '' : String(s)).trim(); return s ? s.slice(0, n) : null; };
function cleanPerfil(p){
  p = p || {};
  const ig = clean(p.instagram, 31); const igc = ig ? ig.replace(/^@/, '') : null;
  const pais = clean(p.pais, 2);
  return {
    nome: clean(p.nome, 40), pais: pais && /^[A-Z]{2}$/.test(pais.toUpperCase()) ? pais.toUpperCase() : null,
    localidade: clean(p.localidade, 60), bio: clean(p.bio, 280),
    instagram: igc && /^[A-Za-z0-9._]{1,30}$/.test(igc) ? igc : null,
    cor: Math.max(0, Math.min(7, parseInt(p.cor, 10) || 0)), publico: !!p.publico
  };
}
function cleanItem(it){
  it = it || {};
  return {
    estado: ESTADOS.includes(it.estado) ? it.estado : 'sementes',
    desde: /^\d{4}-\d{2}-\d{2}$/.test(it.desde || '') ? it.desde : null,
    troca: !!it.troca, nota: clean(it.nota, 500),
    fotos: Array.isArray(it.fotos) ? it.fotos.filter(f => f && typeof f === 'object').slice(0, MAX_FOTOS).map(f => ({id: String(f.id).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40) || uid(), data: /^\d{4}-\d{2}-\d{2}$/.test(f.data || '') ? f.data : null, path: cleanPath(f.path), thumb: cleanPath(f.thumb)})) : [],
    atualizado: it.atualizado || new Date().toISOString()
  };
}
function dataUrlBlob(u){
  if (typeof u !== 'string' || u.length > 12e6) return null;
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(u); if (!m) return null;
  try { const b = atob(m[2]), a = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return new Blob([a], {type: m[1]}); } catch (e) { return null; }
}
const lsGet = () => { try { return JSON.parse(localStorage.getItem(LKEY)) || null; } catch (e) { return null; } };
const lsSet = (v) => { try { localStorage.setItem(LKEY, JSON.stringify(v)); return true; } catch (e) { return false; } };

/* ---------- fotografias: data EXIF, redução, remoção de metadados ---------- */
async function exifDate(file){
  try {
    const buf = await file.slice(0, 256 * 1024).arrayBuffer(), dv = new DataView(buf);
    if (dv.getUint16(0) !== 0xFFD8) return null;
    let o = 2;
    while (o + 4 < dv.byteLength){
      const m = dv.getUint16(o), len = dv.getUint16(o + 2);
      if (m === 0xFFE1 && dv.getUint32(o + 4) === 0x45786966){
        const t = o + 10, le = dv.getUint16(t) === 0x4949;
        const u16 = p => dv.getUint16(p, le), u32 = p => dv.getUint32(p, le);
        const ifd = (start, tag) => { const n = u16(start); for (let i = 0; i < n; i++){ const e = start + 2 + i * 12; if (u16(e) === tag) return e; } return null; };
        const e0 = ifd(t + u32(t + 4), 0x8769); if (!e0) return null;
        const e1 = ifd(t + u32(e0 + 8), 0x9003) || ifd(t + u32(e0 + 8), 0x9004); if (!e1) return null;
        const p = t + u32(e1 + 8); let s = '';
        for (let i = 0; i < 10; i++) s += String.fromCharCode(dv.getUint8(p + i));
        const d = s.replace(/:/g, '-');
        return /^\d{4}-\d{2}-\d{2}$/.test(d) && d > '1990' ? d : null;
      }
      if ((m & 0xFF00) !== 0xFF00) break;
      o += 2 + len;
    }
  } catch (e) {}
  return null;
}
async function decode(file){
  if (window.createImageBitmap){
    try { return await createImageBitmap(file, {imageOrientation: 'from-image'}); } catch (e) {}
  }
  return await new Promise((res, rej) => { const img = new Image(); img.onload = () => res(img); img.onerror = () => rej(new Error('img')); img.src = URL.createObjectURL(file); });
}
function toJpeg(src, max, q){
  const w0 = src.width, h0 = src.height, k = Math.min(1, max / Math.max(w0, h0));
  const c = document.createElement('canvas'); c.width = Math.round(w0 * k); c.height = Math.round(h0 * k);
  const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(src, 0, 0, c.width, c.height);
  return new Promise((res, rej) => c.toBlob(b => b ? res(b) : rej(new Error('blob')), 'image/jpeg', q));
}
/* Reencodar no canvas apaga os metadados (EXIF, incluindo GPS). */
async function prepararFoto(file){
  if (!file || !/^image\//.test(file.type || 'image/')) throw new Error('tipo');
  const data = (await exifDate(file)) || (file.lastModified ? new Date(file.lastModified - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10) : hoje());
  const img = await decode(file);
  const full = await toJpeg(img, 1600, 0.84), thumb = await toJpeg(img, 480, 0.8);
  if (img.close) img.close();
  return {full, thumb, data};
}

/* ---------- IndexedDB (fotografias do modo local) ---------- */
let dbp = null;
function idb(){
  if (dbp) return dbp;
  dbp = new Promise((res, rej) => {
    try {
      const r = indexedDB.open('cc-fotos', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('fotos');
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    } catch (e) { rej(e); }
  });
  return dbp;
}
async function idbDo(mode, fn){
  const db = await idb();
  return new Promise((res, rej) => { const tx = db.transaction('fotos', mode), st = tx.objectStore('fotos'); const r = fn(st); tx.oncomplete = () => res(r && r.result); tx.onerror = () => rej(tx.error); tx.onabort = () => rej(tx.error); });
}
const idbPut = (k, v) => idbDo('readwrite', st => st.put(v, k));
const idbGet = (k) => idbDo('readonly', st => st.get(k));
const idbDel = (k) => idbDo('readwrite', st => st.delete(k));
const idbClear = () => idbDo('readwrite', st => st.clear());

/* ---------- estado ---------- */
const S = {
  online: ONLINE_OK, ready: false, mode: 'local', user: null, email: null,
  perfil: null, itens: {}, err: null
};
const urlCache = new Map(); // chave -> {url, exp}

function localLoad(){
  const d = lsGet();
  S.perfil = d && d.perfil ? Object.assign(cleanPerfil(d.perfil), {publico: false, criado: d.perfil.criado || null}) : null;
  S.itens = {};
  if (d && d.itens) Object.entries(d.itens).forEach(([k, v]) => { if (ID_RE.test(k)) S.itens[k] = cleanItem(v); });
}
function localSave(){ return lsSet({perfil: S.perfil, itens: S.itens}); }

/* ---------- Supabase ---------- */
let sb = null;
function loadScript(src){ return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('script')); document.head.appendChild(s); }); }
async function client(){
  if (sb) return sb;
  if (!window.supabase || !window.supabase.createClient) await loadScript('assets/vendor/supabase.js');
  sb = window.supabase.createClient(CFG.url, CFG.chave, {auth: {persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce', storageKey: 'cc.sessao'}});
  return sb;
}
const must = ({data, error}) => { if (error) throw error; return data; };
async function onlineLoad(){
  const c = await client(), id = S.user.id;
  let p = must(await c.from('perfis').select('*').eq('id', id).maybeSingle());
  if (!p) p = must(await c.from('perfis').upsert({id}).select().single());
  S.perfil = Object.assign(cleanPerfil(p), {criado: p.criado, publico_desde: p.publico_desde || null});
  const rows = must(await c.from('itens').select('*').eq('user_id', id));
  S.itens = {}; rows.forEach(r => { if (ID_RE.test(r.variedade)) S.itens[r.variedade] = cleanItem(r); });
}
async function setSession(session){
  const u = session && session.user;
  if (u && (!S.user || S.user.id !== u.id)){
    S.user = {id: u.id}; S.email = u.email || null; S.mode = 'online';
    try { await onlineLoad(); S.err = null; } catch (e) { S.err = e; console.error(e); }
    emit('sessao');
  } else if (!u && S.user){
    S.user = null; S.email = null; S.mode = 'local'; localLoad(); emit('sessao');
  }
}

/* ---------- API pública ---------- */
const API = {
  ESTADOS, MAX_FOTOS, get online(){ return S.online; }, get mode(){ return S.mode; }, get ready(){ return S.ready; },
  get email(){ return S.email; }, get perfil(){ return S.perfil; }, get itens(){ return S.itens; }, get erro(){ return S.err; },
  on(fn){ listeners.add(fn); return () => listeners.delete(fn); },
  item(id){ return S.itens[id] || null; },
  count(){ return Object.keys(S.itens).length; },
  hasLocalData(){ const d = lsGet(); return !!(d && (d.perfil || (d.itens && Object.keys(d.itens).length))); },

  async init(){
    localLoad();
    if (S.online){
      try {
        const c = await client();
        const {data} = await c.auth.getSession();
        await setSession(data && data.session);
        c.auth.onAuthStateChange((ev, session) => { setTimeout(() => setSession(session), 0); });
      } catch (e) { S.err = e; console.error(e); }
    }
    S.ready = true; emit('pronto');
    return API;
  },

  async criarPerfil(p){ return API.guardarPerfil(p); },
  async guardarPerfil(p){
    const v = cleanPerfil(Object.assign({}, S.perfil || {}, p));
    if (S.mode === 'online'){
      const c = await client();
      const r = must(await c.from('perfis').upsert(Object.assign({id: S.user.id}, v)).select().single());
      S.perfil = Object.assign(cleanPerfil(r), {criado: r.criado, publico_desde: r.publico_desde || null});
    } else {
      v.publico = false;
      S.perfil = Object.assign(v, {criado: (S.perfil && S.perfil.criado) || new Date().toISOString()});
      if (!localSave()) throw new Error('armazenamento');
    }
    emit('perfil'); return S.perfil;
  },

  async guardarItem(id, patch){
    if (!S.perfil) await API.guardarPerfil({});
    const cur = S.itens[id] || {estado: 'sementes', desde: hoje(), fotos: []};
    const it = cleanItem(Object.assign({}, cur, patch, {atualizado: new Date().toISOString()}));
    if (S.mode === 'online'){
      const c = await client();
      const r = must(await c.from('itens').upsert({user_id: S.user.id, variedade: id, estado: it.estado, desde: it.desde, troca: it.troca, nota: it.nota, fotos: it.fotos}).select().single());
      S.itens[id] = cleanItem(r);
    } else {
      S.itens[id] = it;
      if (!localSave()) throw new Error('armazenamento');
    }
    emit('item'); return S.itens[id];
  },

  async removerItem(id){
    const it = S.itens[id]; if (!it) return;
    if (S.mode === 'online'){
      const c = await client();
      const paths = it.fotos.flatMap(f => [f.path, f.thumb]).filter(Boolean);
      if (paths.length) await c.storage.from('fotos').remove(paths);
      must(await c.from('itens').delete().eq('user_id', S.user.id).eq('variedade', id));
    } else {
      for (const f of it.fotos){ try { await idbDel(f.id); await idbDel(f.id + '_m'); } catch (e) {} }
    }
    delete S.itens[id];
    if (S.mode !== 'online') localSave();
    emit('item');
  },

  async juntarFoto(id, file, data){
    const it = S.itens[id] || await API.guardarItem(id, {});
    if (it.fotos.length >= MAX_FOTOS) throw new Error('max');
    const p = await prepararFoto(file), fid = uid();
    const foto = {id: fid, data: data || p.data, path: null, thumb: null};
    if (S.mode === 'online'){
      const c = await client(), base = `${S.user.id}/${id}/${fid}`;
      must(await c.storage.from('fotos').upload(base + '.jpg', p.full, {contentType: 'image/jpeg', upsert: false}));
      must(await c.storage.from('fotos').upload(base + '_m.jpg', p.thumb, {contentType: 'image/jpeg', upsert: false}));
      foto.path = base + '.jpg'; foto.thumb = base + '_m.jpg';
    } else {
      await idbPut(fid, p.full); await idbPut(fid + '_m', p.thumb);
    }
    await API.guardarItem(id, {fotos: [foto].concat(it.fotos)});
    return foto;
  },

  async alterarFoto(id, fid, patch){
    const it = S.itens[id]; if (!it) return;
    await API.guardarItem(id, {fotos: it.fotos.map(f => f.id === fid ? Object.assign({}, f, patch) : f)});
  },

  async removerFoto(id, fid){
    const it = S.itens[id]; if (!it) return;
    const f = it.fotos.find(x => x.id === fid); if (!f) return;
    if (S.mode === 'online'){ const c = await client(); await c.storage.from('fotos').remove([f.path, f.thumb].filter(Boolean)); }
    else { try { await idbDel(fid); await idbDel(fid + '_m'); } catch (e) {} }
    urlCache.delete(fid); urlCache.delete(fid + '_m');
    await API.guardarItem(id, {fotos: it.fotos.filter(x => x.id !== fid)});
  },

  /* URL para mostrar uma fotografia (miniatura por defeito). dono: id de outro colecionador (só online). */
  async urlFoto(f, grande){
    const key = f.id + (grande ? '' : '_m'), hit = urlCache.get(key);
    if (hit && hit.exp > Date.now()) return hit.url;
    let url = null;
    if (f.path){
      const c = await client();
      const {data} = await c.storage.from('fotos').createSignedUrl(grande ? f.path : (f.thumb || f.path), 3600);
      url = data && data.signedUrl; if (url) urlCache.set(key, {url, exp: Date.now() + 50 * 6e4});
    } else {
      const b = await idbGet(key).catch(() => null) || (grande ? null : await idbGet(f.id).catch(() => null));
      if (b){ url = URL.createObjectURL(b); urlCache.set(key, {url, exp: Infinity}); }
    }
    return url;
  },
  async urlsFotos(fotos){
    /* várias miniaturas de uma vez (online: um só pedido) */
    const out = {}, need = [];
    fotos.forEach(f => { const h = urlCache.get(f.id + '_m'); if (h && h.exp > Date.now()) out[f.id] = h.url; else need.push(f); });
    const online = need.filter(f => f.path);
    if (online.length){
      try {
        const c = await client();
        const {data} = await c.storage.from('fotos').createSignedUrls(online.map(f => f.thumb || f.path), 3600);
        (data || []).forEach((d, i) => { if (d && d.signedUrl){ out[online[i].id] = d.signedUrl; urlCache.set(online[i].id + '_m', {url: d.signedUrl, exp: Date.now() + 50 * 6e4}); } });
      } catch (e) { console.error(e); }
    }
    for (const f of need.filter(f => !f.path)){ const u = await API.urlFoto(f); if (u) out[f.id] = u; }
    return out;
  },

  /* ---- conta (só online) ---- */
  async enviarCodigo(email){
    const c = await client();
    must(await c.auth.signInWithOtp({email: String(email).trim(), options: {shouldCreateUser: true, emailRedirectTo: location.origin + location.pathname}}));
  },
  async confirmarCodigo(email, token){
    const c = await client();
    const d = must(await c.auth.verifyOtp({email: String(email).trim(), token: String(token).trim(), type: 'email'}));
    await setSession(d.session);
  },
  async sair(){ if (!sb) return; await sb.auth.signOut(); await setSession(null); },

  /* enviar para a conta o que estava só neste aparelho */
  async enviarLocalParaConta(){
    if (S.mode !== 'online') return 0;
    const d = lsGet(); if (!d) return 0;
    if (d.perfil){ const p = cleanPerfil(d.perfil); delete p.publico; const keep = {}; Object.entries(p).forEach(([k, v]) => { if (v != null && v !== 0 && !(S.perfil && S.perfil[k])) keep[k] = v; }); if (Object.keys(keep).length) await API.guardarPerfil(keep); }
    let n = 0;
    for (const [id, raw] of Object.entries(d.itens || {})){
      const it = cleanItem(raw);
      if (S.itens[id]) continue;
      await API.guardarItem(id, {estado: it.estado, desde: it.desde, troca: it.troca, nota: it.nota, fotos: []});
      for (const f of it.fotos.slice().reverse()){
        const blob = await idbGet(f.id).catch(() => null);
        if (blob) await API.juntarFoto(id, new File([blob], f.id + '.jpg', {type: 'image/jpeg'}), f.data);
      }
      n++;
    }
    /* já está na conta: retirar a cópia deste aparelho */
    try { localStorage.removeItem(LKEY); } catch (e) {}
    try { await idbClear(); } catch (e) {}
    return n;
  },

  /* ---- exportar / importar / apagar ---- */
  async exportar(comFotos = true){
    const out = {formato: 'catalogo-chili-colecao', versao: 1, exportado: new Date().toISOString(), conta: S.mode === 'online' ? S.email : null, perfil: S.perfil, itens: {}};
    for (const [id, it] of Object.entries(S.itens)){
      const fotos = [];
      for (const f of it.fotos){
        const o = {id: f.id, data: f.data};
        if (comFotos){
          try {
            let blob = null;
            if (f.path){ const u = await API.urlFoto(f, true); if (u) blob = await (await fetch(u)).blob(); }
            else blob = await idbGet(f.id);
            if (blob) o.jpeg = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); });
          } catch (e) {}
        }
        fotos.push(o);
      }
      out.itens[id] = Object.assign({}, it, {fotos});
    }
    return out;
  },
  async importar(obj){
    if (!obj || obj.formato !== 'catalogo-chili-colecao' || !obj.itens) throw new Error('formato');
    if (obj.perfil){ const p = cleanPerfil(obj.perfil); delete p.publico; await API.guardarPerfil(p); }
    let n = 0;
    for (const [id, raw] of Object.entries(obj.itens)){
      if (!ID_RE.test(id)) continue;
      const it = cleanItem(raw);
      await API.guardarItem(id, {estado: it.estado, desde: it.desde, troca: it.troca, nota: it.nota, fotos: (S.itens[id] && S.itens[id].fotos) || []});
      for (const f of (Array.isArray(raw && raw.fotos) ? raw.fotos : []).slice(0, MAX_FOTOS).reverse()){
        const blob = dataUrlBlob(f && f.jpeg);
        if (blob){
          await API.juntarFoto(id, new File([blob], 'f.jpg', {type: blob.type || 'image/jpeg'}), f.data);
        }
      }
      n++;
    }
    return n;
  },
  async apagarTudo(){
    if (S.mode === 'online'){
      const c = await client();
      const paths = Object.values(S.itens).flatMap(it => it.fotos.flatMap(f => [f.path, f.thumb])).filter(Boolean);
      for (let i = 0; i < paths.length; i += 100) await c.storage.from('fotos').remove(paths.slice(i, i + 100));
      must(await c.rpc('apagar_conta'));
      await c.auth.signOut();
      S.user = null; S.email = null; S.mode = 'local';
    }
    try { localStorage.removeItem(LKEY); } catch (e) {}
    try { await idbClear(); } catch (e) {}
    urlCache.clear(); S.perfil = null; S.itens = {};
    emit('apagado');
  },

  /* ---- comunidade (só online; vê apenas perfis públicos) ---- */
  async colecionadores(){
    if (!S.online) return [];
    const c = await client();
    const perfis = must(await c.from('perfis').select('id,nome,pais,localidade,bio,instagram,cor,criado,publico').eq('publico', true).order('atualizado', {ascending: false}).limit(300));
    const ids = new Set(perfis.map(p => p.id));
    const itens = ids.size ? must(await c.from('itens').select('user_id,variedade,estado,troca,fotos').limit(10000)) : [];
    const by = {};
    itens.forEach(r => { if (!ids.has(r.user_id)) return; (by[r.user_id] = by[r.user_id] || []).push(r); });
    return perfis.map(p => ({id: p.id, eu: S.user && S.user.id === p.id, perfil: cleanPerfil(p), criado: p.criado,
      itens: Object.fromEntries((by[p.id] || []).filter(r => ID_RE.test(r.variedade)).map(r => { const it = cleanItem(r); it.fotos = it.fotos.filter(f => f.path); return [r.variedade, it]; }))}));
  }
};
window.CCStore = API;
})();
