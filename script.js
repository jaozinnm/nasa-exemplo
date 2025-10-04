// Rolagem suave para âncoras
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id.length > 1){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// Estado ativo da camada (afeta pins/legenda via CSS)
const body = document.body;
const segContainer = document.getElementById('segments');

if (segContainer) {
  segContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('button.seg');
    if (!btn) return;
    segContainer.querySelectorAll('.seg').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const layer = btn.dataset.layer;
    body.setAttribute('data-active', layer); // CSS cuida do destaque
    // Atualiza métricas mock
    updateMetrics(layer);
  });
}

// Métricas mock por camada
function updateMetrics(layer){
  const mHeat  = document.getElementById('m-heat');
  const mGreen = document.getElementById('m-green');
  const mAir   = document.getElementById('m-air');
  const mFlood = document.getElementById('m-flood');
  const pri    = document.getElementById('priorityList');

  const presets = {
    heat : { heat:'3,8 °C', green:'12%', air:'24 µg/m³', flood:'72%', top:['Bairro X — 8,9','Bairro Z — 7,7','Bairro Y — 6,2','Subprefeitura A — 5,8','Região 1 — 5,1'] },
    green: { heat:'2,2 °C', green:'35%', air:'20 µg/m³', flood:'40%', top:['Bairro Z — 7,2','Bairro X — 6,9','Bairro Y — 6,1','Subprefeitura A — 5,5','Região 1 — 5,0'] },
    air  : { heat:'3,0 °C', green:'18%', air:'28 µg/m³', flood:'51%', top:['Bairro X — 8,4','Bairro Y — 6,6','Bairro Z — 6,2','Subprefeitura A — 5,9','Região 1 — 5,3'] },
    flood: { heat:'2,6 °C', green:'15%', air:'22 µg/m³', flood:'78%', top:['Bairro X — 9,1','Bairro Z — 8,0','Bairro Y — 6,4','Subprefeitura A — 6,0','Região 1 — 5,7'] },
  };
  const p = presets[layer] || presets.heat;
  if(mHeat)  mHeat.textContent  = p.heat;
  if(mGreen) mGreen.textContent = p.green;
  if(mAir)   mAir.textContent   = p.air;
  if(mFlood) mFlood.textContent = p.flood;

  if (pri) {
    pri.innerHTML = p.top.map(i => `<li>${i}</li>`).join('');
  }
}

// Exportar “relatório” (JSON simulado)
document.getElementById('btnReport')?.addEventListener('click', (e)=>{
  e.preventDefault();
  const payload = {
    city: document.getElementById('citySel')?.textContent?.trim(),
    activeLayer: document.body.getAttribute('data-active') || 'heat',
    metrics: {
      heat:  document.getElementById('m-heat')?.textContent,
      green: document.getElementById('m-green')?.textContent,
      air:   document.getElementById('m-air')?.textContent,
      flood: document.getElementById('m-flood')?.textContent,
    },
    generatedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `city-health-report.json`; a.click();
  URL.revokeObjectURL(url);
});

// Simular PNG (tira screenshot da área do dashboard via html2canvas se disponível)
document.getElementById('btnPng')?.addEventListener('click', async (e)=>{
  e.preventDefault();
  try{
    const el = document.getElementById('dashboard');
    const html2canvas = (await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js')).default;
    const canvas = await html2canvas(el, {backgroundColor:null});
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png'); a.download = 'dashboard.png'; a.click();
  }catch(err){ console.warn('PNG stub falhou', err); }
});

// Inicial
updateMetrics('heat');
body.setAttribute('data-active','heat');
