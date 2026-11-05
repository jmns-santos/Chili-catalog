/* CATÁLOGO CHILI · reconhecimento por fotografia, no próprio aparelho (a imagem não sai do navegador).
   1. U²-Netp separa o fruto do fundo (qualquer superfície).
   2. Cada fruto é endireitado (eixo maior na vertical), recortado e posto sobre cinzento neutro.
   3. A MobileNetV2 resume forma, textura e cor num vetor de 1280 números.
   4. O vetor é comparado com o das fotografias do catálogo (data/reconhecer.js), em 4 orientações,
      junto com um histograma de cor do fruto.
   Mesmo algoritmo que FERRAMENTAS-SITE/gerar_assinaturas.py: se mudar um, mudar o outro.
   Motor: ONNX Runtime Web (MIT), em assets/vendor/ort. Modelos em assets/modelos (ver LEIA-ME.txt). */
(function(){
  'use strict';
  const VER = '12';
  const ORT_DIR = 'assets/vendor/ort/';
  const FILES = {
    wasm: [ORT_DIR + 'ort-wasm-simd-threaded.wasm', 13961845],
    seg: ['assets/modelos/u2netp.onnx', 2333873],
    emb: ['assets/modelos/mobilenetv2.onnx', 4431402]
  };
  const MEAN = [0.485, 0.456, 0.406], STD = [0.229, 0.224, 0.225];
  const SIDE = 320, OUT = 224, MARGIN = 0.10, THR = 0.5;
  let state = 'idle', ready = null, sSeg = null, sEmb = null, REFS = null, W_COR = 0.4;

  function loadScript(src){
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src; s.onload = () => res(); s.onerror = () => { s.remove(); rej(new Error('script ' + src)); };
      document.head.appendChild(s);
    });
  }
  async function fetchBuf(url, onBytes){
    const r = await fetch(url, {credentials: 'same-origin'});
    if (!r.ok) throw new Error('fetch ' + url + ' ' + r.status);
    if (!r.body || !r.body.getReader){ const b = await r.arrayBuffer(); onBytes(b.byteLength); return b; }
    const rd = r.body.getReader(), parts = []; let n = 0;
    for (;;){ const {done, value} = await rd.read(); if (done) break; parts.push(value); n += value.length; onBytes(value.length); }
    const out = new Uint8Array(n); let o = 0; for (const p of parts){ out.set(p, o); o += p.length; }
    return out.buffer;
  }
  function b64(s){ const bin = atob(s), a = new Int8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = (bin.charCodeAt(i) << 24) >> 24; return a; }
  function decodeRefs(R){
    if (!R || R.v !== 1 || !Array.isArray(R.refs)) throw new Error('refs');
    const dim = R.dim, nv = R.nvar;
    return R.refs.filter(r => typeof r.id === 'string' && typeof r.e === 'string').map(r => {
      const q = b64(r.e); if (q.length !== dim * nv) throw new Error('ref dim');
      const vs = [];
      for (let k = 0; k < nv; k++){ const v = new Float32Array(dim), sc = +r.s[k] || 0; for (let i = 0; i < dim; i++) v[i] = q[k * dim + i] * sc; vs.push(v); }
      const h = Array.isArray(r.h) && r.h.length === 21 ? Float32Array.from(r.h, Number) : null;
      return {id: r.id, web: r.web, vs, h};
    });
  }

  /* Carrega motor, modelos e referências. onProgress(fração 0..1). */
  function preparar(onProgress){
    if (ready) return ready;
    state = 'loading';
    ready = (async () => {
      if (typeof WebAssembly !== 'object' || !window.fetch || !window.atob) throw new Error('sem WebAssembly');
      if (location.protocol === 'file:') throw new Error('file://');
      const R = window.RECONHECER || (await loadScript('data/reconhecer.js?v=' + VER), window.RECONHECER);
      if (R && R.bytes){ FILES.seg[1] = R.bytes.seg || 0; FILES.emb[1] = R.bytes.emb || 0; }
      if (R && R.modelos){ FILES.seg[0] = 'assets/modelos/' + R.modelos.seg; FILES.emb[0] = 'assets/modelos/' + R.modelos.emb; }
      const total = FILES.wasm[1] + FILES.seg[1] + FILES.emb[1] || 1; let got = 0;
      const tick = n => { got += n; if (onProgress) onProgress(Math.min(0.99, got / total)); };
      if (!window.ort) await loadScript(ORT_DIR + 'ort.wasm.min.js?v=' + VER);
      const ort = window.ort; if (!ort || !ort.InferenceSession) throw new Error('ort');
      ort.env.wasm.wasmPaths = new URL(ORT_DIR, document.baseURI).href;
      ort.env.wasm.numThreads = 1; ort.env.wasm.proxy = false;
      const [w, a, b] = await Promise.all([fetchBuf(FILES.wasm[0], tick), fetchBuf(FILES.seg[0], tick), fetchBuf(FILES.emb[0], tick)]);
      ort.env.wasm.wasmBinary = w;
      const opt = {executionProviders: ['wasm'], graphOptimizationLevel: 'all'};
      sSeg = await ort.InferenceSession.create(new Uint8Array(a), opt);
      sEmb = await ort.InferenceSession.create(new Uint8Array(b), opt);
      REFS = decodeRefs(R); if (typeof R.pesoCor === 'number' && R.pesoCor >= 0 && R.pesoCor <= 2) W_COR = R.pesoCor;
      state = 'ready'; if (onProgress) onProgress(1);
    })();
    ready.catch(() => { state = 'failed'; });
    return ready;
  }

  /* ---------- imagem ---------- */
  function imageData(img){
    const W0 = img.naturalWidth || img.width, H0 = img.naturalHeight || img.height;
    const k = Math.min(1, SIDE / Math.max(W0, H0));
    const w = Math.max(1, Math.round(W0 * k)), h = Math.max(1, Math.round(H0 * k));
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const cx = cv.getContext('2d', {willReadFrequently: true});
    cx.imageSmoothingEnabled = true; cx.imageSmoothingQuality = 'high';
    cx.drawImage(img, 0, 0, w, h);
    const d = cx.getImageData(0, 0, w, h).data, a = new Float32Array(w * h * 3);
    for (let i = 0, j = 0; i < w * h; i++, j += 4){ a[i * 3] = d[j] / 255; a[i * 3 + 1] = d[j + 1] / 255; a[i * 3 + 2] = d[j + 2] / 255; }
    return {a, w, h, cv};
  }
  /* bilinear com centros de pixel a +0,5 (igual ao Python) */
  function resize(a, W, H, C, w, h){
    const out = new Float32Array(w * h * C);
    for (let y = 0; y < h; y++){
      let sy = (y + 0.5) * H / h - 0.5; sy = Math.min(Math.max(sy, 0), H - 1);
      const y0 = Math.floor(sy), y1 = Math.min(y0 + 1, H - 1), fy = sy - y0;
      for (let x = 0; x < w; x++){
        let sx = (x + 0.5) * W / w - 0.5; sx = Math.min(Math.max(sx, 0), W - 1);
        const x0 = Math.floor(sx), x1 = Math.min(x0 + 1, W - 1), fx = sx - x0;
        for (let c = 0; c < C; c++){
          const t = a[(y0 * W + x0) * C + c] * (1 - fx) + a[(y0 * W + x1) * C + c] * fx;
          const b = a[(y1 * W + x0) * C + c] * (1 - fx) + a[(y1 * W + x1) * C + c] * fx;
          out[(y * w + x) * C + c] = t * (1 - fy) + b * fy;
        }
      }
    }
    return out;
  }
  async function saliency(im){
    const ort = window.ort, N = SIDE * SIDE;
    const x = resize(im.a, im.w, im.h, 3, SIDE, SIDE);
    let mx = 1e-6; for (let i = 0; i < x.length; i++) if (x[i] > mx) mx = x[i];
    const t = new Float32Array(3 * N);
    for (let i = 0; i < N; i++) for (let c = 0; c < 3; c++) t[c * N + i] = (x[i * 3 + c] / mx - MEAN[c]) / STD[c];
    const feeds = {}; feeds[sSeg.inputNames[0]] = new ort.Tensor('float32', t, [1, 3, SIDE, SIDE]);
    const r = await sSeg.run(feeds, [sSeg.outputNames[0]]);
    const o = r[sSeg.outputNames[0]].data;
    let mi = Infinity, ma = -Infinity; for (let i = 0; i < N; i++){ if (o[i] < mi) mi = o[i]; if (o[i] > ma) ma = o[i]; }
    const n = new Float32Array(N), dd = Math.max(1e-6, ma - mi); for (let i = 0; i < N; i++) n[i] = (o[i] - mi) / dd;
    return resize(n, SIDE, SIDE, 1, im.w, im.h);
  }
  function components(mask, w, h){
    const lab = new Int32Array(w * h), sizes = [0], stack = new Int32Array(w * h); let n = 0;
    for (let s = 0; s < w * h; s++){
      if (!mask[s] || lab[s]) continue;
      n++; lab[s] = n; let top = 0, c = 0; stack[top++] = s;
      while (top){
        const p = stack[--top]; c++; const x = p % w, y = (p / w) | 0;
        if (x > 0 && mask[p - 1] && !lab[p - 1]){ lab[p - 1] = n; stack[top++] = p - 1; }
        if (x < w - 1 && mask[p + 1] && !lab[p + 1]){ lab[p + 1] = n; stack[top++] = p + 1; }
        if (y > 0 && mask[p - w] && !lab[p - w]){ lab[p - w] = n; stack[top++] = p - w; }
        if (y < h - 1 && mask[p + w] && !lab[p + w]){ lab[p + w] = n; stack[top++] = p + w; }
      }
      sizes.push(c);
    }
    if (!n) return [];
    const big = Math.max(...sizes);
    const keep = []; for (let i = 1; i <= n; i++) if (sizes[i] >= 0.25 * big) keep.push(i);
    keep.sort((p, q) => sizes[q] - sizes[p]);
    return keep.map(id => { const m = new Uint8Array(w * h); for (let s = 0; s < w * h; s++) if (lab[s] === id) m[s] = 1; return m; });
  }
  function dilate(m, w, h, r){
    let cur = m;
    for (let k = 0; k < r; k++){
      const o = new Uint8Array(w * h);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++){
        const i = y * w + x;
        o[i] = cur[i] || (x > 0 && cur[i - 1]) || (x < w - 1 && cur[i + 1]) || (y > 0 && cur[i - w]) || (y < h - 1 && cur[i + w]) ? 1 : 0;
      }
      cur = o;
    }
    return cur;
  }
  function axis(m, w, h){
    let n = 0, sx = 0, sy = 0;
    for (let i = 0; i < w * h; i++) if (m[i]){ n++; sx += i % w; sy += (i / w) | 0; }
    const cx = sx / n, cy = sy / n; let xx = 0, yy = 0, xy = 0;
    for (let i = 0; i < w * h; i++) if (m[i]){ const dx = i % w - cx, dy = ((i / w) | 0) - cy; xx += dx * dx; yy += dy * dy; xy += dx * dy; }
    xx /= n; yy /= n; xy /= n;
    const ang = 0.5 * Math.atan2(2 * xy, xx - yy), ca = Math.cos(ang), sa = Math.sin(ang);
    let ext = 0;
    for (let i = 0; i < w * h; i++) if (m[i]){ const dx = i % w - cx, dy = ((i / w) | 0) - cy; ext = Math.max(ext, Math.abs(dx * ca + dy * sa), Math.abs(-dx * sa + dy * ca)); }
    return {cx, cy, ang, ext, n};
  }
  /* recorte OUT×OUT com o eixo maior na vertical; fundo cinzento 0,5 */
  function warp(im, alpha, g){
    const th = g.ang - Math.PI / 2, c = Math.cos(th), s = Math.sin(th);
    const scale = g.ext * (1 + MARGIN) * 2 / OUT, W = im.w, H = im.h, P = OUT * OUT;
    const t = new Float32Array(3 * P);
    for (let yo = 0; yo < OUT; yo++){
      const V = (yo + 0.5 - OUT / 2) * scale;
      for (let xo = 0; xo < OUT; xo++){
        const U = (xo + 0.5 - OUT / 2) * scale;
        const X = Math.min(Math.max(g.cx + c * U - s * V, 0), W - 1.0001), Y = Math.min(Math.max(g.cy + s * U + c * V, 0), H - 1.0001);
        const x0 = Math.floor(X), y0 = Math.floor(Y), fx = X - x0, fy = Y - y0;
        const i00 = y0 * W + x0, i01 = i00 + 1, i10 = i00 + W, i11 = i10 + 1;
        const w00 = (1 - fx) * (1 - fy), w01 = fx * (1 - fy), w10 = (1 - fx) * fy, w11 = fx * fy;
        const al = alpha[i00] * w00 + alpha[i01] * w01 + alpha[i10] * w10 + alpha[i11] * w11, p = yo * OUT + xo;
        for (let ch = 0; ch < 3; ch++){
          const v = im.a[i00 * 3 + ch] * w00 + im.a[i01 * 3 + ch] * w01 + im.a[i10 * 3 + ch] * w10 + im.a[i11 * 3 + ch] * w11;
          t[ch * P + p] = ((v * al + 0.5 * (1 - al)) - MEAN[ch]) / STD[ch];
        }
      }
    }
    return t;
  }
  /* cor do fruto: 18 tons + escuro, claro e cinzento, suavizado entre tons vizinhos (igual ao Python) */
  function hist(im, m){
    const h = new Float32Array(21); let n = 0;
    for (let i = 0; i < im.w * im.h; i++){
      if (!m[i]) continue;
      const r = im.a[i * 3], g = im.a[i * 3 + 1], b = im.a[i * 3 + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      const s = mx > 0 ? (mx - mn) / Math.max(mx, 1e-6) : 0, d = Math.max(mx - mn, 1e-6);
      let k;
      if (mx < 0.22) k = 18;
      else if (s < 0.2) k = mx > 0.72 ? 19 : 20;
      else { const hu = mx === r ? (((g - b) / d) % 6 + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; k = Math.floor(hu * 3) % 18; }
      h[k]++; n++;
    }
    const t = h.slice(0, 18);
    for (let i = 0; i < 18; i++) h[i] = 0.25 * t[(i + 17) % 18] + 0.5 * t[i] + 0.25 * t[(i + 1) % 18];
    let tot = 0; for (let i = 0; i < 21; i++) tot += h[i];
    for (let i = 0; i < 21; i++) h[i] /= tot || 1;
    return h;
  }
  async function embed(t){
    const ort = window.ort, feeds = {};
    feeds[sEmb.inputNames[0]] = new ort.Tensor('float32', t, [1, 3, OUT, OUT]);
    const r = await sEmb.run(feeds, [sEmb.outputNames[0]]);
    const f = r[sEmb.outputNames[0]].data, v = new Float32Array(f.length);
    let nn = 0; for (let i = 0; i < f.length; i++) nn += f[i] * f[i]; nn = Math.sqrt(nn) || 1;
    for (let i = 0; i < f.length; i++) v[i] = f[i] / nn;
    return v;
  }

  /* Analisa uma imagem já carregada. Devolve {ok, ranking:[{id, score, web}], w, h, mask, cv, area} */
  async function analisar(img){
    if (state !== 'ready') throw new Error('não preparado');
    const im = imageData(img), N = im.w * im.h;
    const sal = await saliency(im);
    const bin = new Uint8Array(N); for (let i = 0; i < N; i++) bin[i] = sal[i] > THR ? 1 : 0;
    const comps = components(bin, im.w, im.h);
    const whole = new Uint8Array(N); comps.forEach(m => { for (let i = 0; i < N; i++) if (m[i]) whole[i] = 1; });
    let area = 0; for (let i = 0; i < N; i++) area += whole[i];
    const base = {w: im.w, h: im.h, mask: whole, cv: im.cv, area: area / N};
    if (!comps.length || area < 30) return Object.assign(base, {ok: false, ranking: []});
    const regs = [whole].concat(comps.length > 1 ? comps.slice(0, 4) : []);
    const qs = [];
    for (const reg of regs){
      const g = axis(reg, im.w, im.h); if (g.n < 20 || !(g.ext > 0)) continue;
      const d = dilate(reg, im.w, im.h, 2), alpha = new Float32Array(N);
      for (let i = 0; i < N; i++) alpha[i] = d[i] ? sal[i] : 0;
      qs.push({e: await embed(warp(im, alpha, g)), h: hist(im, reg)});
    }
    /* semelhança = (melhor das 4 orientações + peso × semelhança de cor) / (1 + peso), de 0 a 1 */
    const best = Object.create(null);
    for (const r of REFS){
      let s = -1;
      for (const q of qs){
        let m = -1;
        for (const v of r.vs){ let dot = 0; for (let i = 0; i < v.length; i++) dot += v[i] * q.e[i]; if (dot > m) m = dot; }
        let bc = 0; if (r.h) for (let i = 0; i < 21; i++) bc += Math.sqrt(r.h[i] * q.h[i]);
        const sc = (m + W_COR * bc) / (1 + W_COR); if (sc > s) s = sc;
      }
      if (!best[r.id] || s > best[r.id].score) best[r.id] = {id: r.id, score: s, web: r.web};
    }
    const ranking = Object.values(best).sort((a, b) => b.score - a.score);
    return Object.assign(base, {ok: qs.length > 0, ranking});
  }

  const mb = () => Math.round((FILES.wasm[1] + FILES.seg[1] + FILES.emb[1]) / 1e6);
  window.Reconhecer = {preparar, analisar, mb, estado: () => state, nRefs: () => REFS ? REFS.length : 0};
})();
