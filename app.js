
const LOJAS = [
["Metropolitan Mall","Goiânia","Goiânia","Shopping"],["Shopping Flamboyant","Goiânia","Goiânia","Shopping"],["Shopping Goiânia","Goiânia","Goiânia","Shopping"],["WTC Goiânia","Goiânia","Goiânia","Corporativo"],
["GPA São Caetano","São Caetano do Sul","Grande SP e ABC","Supermercado"],["Park Shopping São Caetano","São Caetano do Sul","Grande SP e ABC","Shopping"],["Shopping Grand Plaza","Santo André","Grande SP e ABC","Shopping"],["Shopping Iguatemi Alphaville","Barueri","Grande SP e ABC","Shopping"],["Shopping Metropole","São Bernardo do Campo","Grande SP e ABC","Shopping"],
["Georgina Rio Preto","São José do Rio Preto","Interior e Litoral SP","Corporativo"],["Outlet Premium","Itupeva","Interior e Litoral SP","Shopping"],["Shopping Center Vale","São José dos Campos","Interior e Litoral SP","Shopping"],["Shopping Iguatemi Campinas","Campinas","Interior e Litoral SP","Shopping"],["Shopping Iguatemi Esplanada","Votorantim","Interior e Litoral SP","Shopping"],["Shopping Iguatemi Rio Preto","São José do Rio Preto","Interior e Litoral SP","Shopping"],["Shopping Litoral Plaza","Praia Grande","Interior e Litoral SP","Shopping"],
["Park Shopping Jacarepaguá","Rio de Janeiro","Rio de Janeiro","Shopping"],
["Aeroporto Congonhas","São Paulo","SP Capital","Aeroporto"],["Carrefour Casa Verde","São Paulo","SP Capital","Supermercado"],["Club Athletico Paulistano","São Paulo","SP Capital","Clube"],["GPA Brigadeiro","São Paulo","SP Capital","Supermercado"],["GPA Vila Clementino","São Paulo","SP Capital","Supermercado"],["Mais Shopping","São Paulo","SP Capital","Shopping"],["Morumbi Corporate","São Paulo","SP Capital","Corporativo"],["Porto Seguro","São Paulo","SP Capital","Corporativo"],["Praça Pamplona","São Paulo","SP Capital","Corporativo"],["Rochaverá","São Paulo","SP Capital","Corporativo"],["SP Corporate","São Paulo","SP Capital","Corporativo"],["SP Market","São Paulo","SP Capital","Shopping"],["Shopping Anália Franco","São Paulo","SP Capital","Shopping"],["Shopping Center Norte","São Paulo","SP Capital","Shopping"],["Shopping Eldorado","São Paulo","SP Capital","Shopping"],["Shopping Iguatemi São Paulo","São Paulo","SP Capital","Shopping"],["Shopping Jardim Pamplona","São Paulo","SP Capital","Shopping"],["Shopping Jardim Sul","São Paulo","SP Capital","Shopping"],["Shopping Market Place","São Paulo","SP Capital","Shopping"],["Shopping Morumbi","São Paulo","SP Capital","Shopping"],["Shopping Pátio Paulista","São Paulo","SP Capital","Shopping"],["Shopping Vila Olímpia","São Paulo","SP Capital","Shopping"],["Shopping Villa Lobos","São Paulo","SP Capital","Shopping"],["Shopping West Plaza","São Paulo","SP Capital","Shopping"],["Sociedade Harmonia de Tênis","São Paulo","SP Capital","Clube"],["Vila Leopoldina","São Paulo","SP Capital","Rua"]
];
// ---------- premissas ----------
const P = {tmin:100,tmax:170,conv:.40,dias:30,dlanc:56,lancShare:.20,volta:.15,manter:.10,digMin:.5,offRef:.10,offPiso:700}; // Reforçado: mídia off obrigatória = 10% da verba digital ou R$ 700, o que for maior
P.tmed=(P.tmin+P.tmax)/2;
// Catálogo digital: custo médio por contato (CPL) em R$. Valores de referência da Layer Up, a calibrar no piloto.
const DIG = {
 raio:{canal:"Instagram e Facebook · raio da loja",desc:"Anúncios para quem está no empreendimento ou no bairro, com a oferta do mês.",cpl:17.5},
 remarketing:{canal:"Instagram e Facebook · remarketing",desc:"Anunciar de novo para quem viu, visitou o perfil ou já é cliente.",cpl:12},
 busca:{canal:"Google Busca",desc:"Aparecer para quem procura “lavagem a seco” ou “lavar carro” perto da loja.",cpl:32.5},
 maps:{canal:"Google Maps · perfil da loja",desc:"Destaque da loja no mapa para quem está por perto e decide agora.",cpl:25},
 youtube:{canal:"YouTube Shorts",desc:"Vídeos curtos mostrando o resultado do serviço, no raio da loja.",cpl:22}
};
// Pesos padrão por pacote (0 = disponível, fora do padrão; entra com peso 0,10 se selecionado).
const W = {
 "Atrair quem passa":{raio:.45,busca:.25,maps:.15,remarketing:.10,youtube:.05},
 "Conquistar a casa":{raio:.55,remarketing:.20,maps:.15,busca:.10,youtube:0},
 "Trazer de volta":{remarketing:.45,raio:.20,youtube:.20,maps:.15,busca:0},
 "Manter aquecido":{remarketing:.55,raio:.25,youtube:.20,maps:0,busca:0}
};
// Mídia off: inventário real por unidade (Canal do Mídia, coleta 13/11/2026). OFFDB/THUMB injetados abaixo.
const EXTRAS = [
 {id:"pdv",grupo:"Extras",nome:"Material de ponto de venda",desc:"Totem, adesivo de vaga e flyer com a oferta do mês. Produção pela rede; o valor é confirmado pela DryWash e não entra no investimento de mídia.",valor:null,un:"mês"},
 {id:"rede",grupo:"Extras",nome:"Campanha da rede",desc:"Sua loja entra na próxima campanha nacional com oferta e endereço próprios. A cota é definida pela DryWash em cada campanha.",valor:null,un:"campanha"}
];
const GRUPOS = ["Rua (OOH/DOOH)","Elevadores e edifícios","Shoppings","Supermercados","Academias e clubes","Aeroportos","Comércio e serviços do entorno","Rádio e jornal local","Extras"];
const GNOME = {"Rua (OOH/DOOH)":"Rua: painéis, relógios e pontos","Elevadores e edifícios":"Elevadores e prédios","Shoppings":"Shoppings","Supermercados":"Supermercados","Academias e clubes":"Academias e clubes","Aeroportos":"Aeroportos","Comércio e serviços do entorno":"Comércio do entorno","Rádio e jornal local":"Rádio e jornal local","Extras":"Extras da rede"};
const PK = {
 "Atrair quem passa":{cor:"--p-atrair",col:"passagem",row:"vagas",frase:"Transformar quem circula no shopping, mercado ou aeroporto em cliente.",ex:"Shopping, supermercado, aeroporto, rua",
   msg:"Lave o carro enquanto faz suas compras.",kpi:"Custo por agendamento"},
 "Conquistar a casa":{cor:"--p-conquistar",col:"cativo",row:"vagas",frase:"Fazer quem frequenta o prédio ou o clube experimentar o serviço.",ex:"Prédio comercial, clube",
   msg:"Seu carro lavado durante o expediente ou o treino.",kpi:"Novos clientes do próprio local"},
 "Trazer de volta":{cor:"--p-volta",col:"passagem",row:"cheia",frase:"Fazer quem já lavou voltar, de preferência nos dias mais vazios.",ex:"Loja de passagem com agenda cheia",
   msg:"Seu carro está pedindo outra lavagem; venha no meio da semana.",kpi:"Clientes que voltaram em até 60 dias"},
 "Manter aquecido":{cor:"--p-manter",col:"cativo",row:"cheia",frase:"Manter os clientes da casa voltando, com ofertas de fidelidade.",ex:"Público fiel com agenda cheia",
   msg:"Ofertas de fidelidade, incluindo as promoções do Clube Infinite.",kpi:"Clientes reativados (sem visita há 30 dias ou mais)"}
};
const CEN = {
 essencial:{nome:"Essencial",f:.5},
 equilibrado:{nome:"Equilibrado",f:1},
 reforcado:{nome:"Reforçado",f:1.25}
};
const brl = v => "R$ " + Math.round(v).toLocaleString("pt-BR");
const brlk = v => v >= 1000 ? "R$ " + (v/1000).toLocaleString("pt-BR",{maximumFractionDigits:1}) + " mil" : brl(v);
const x1 = v => isFinite(v)&&v>0 ? v.toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:1}) + "x" : "-";
const d1 = v => (Math.round(v*10)/10).toLocaleString("pt-BR",{maximumFractionDigits:1});
const $ = id => document.getElementById(id);
const cssv = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
function esc(s){return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
const MESES=["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const now=new Date(); const ini=new Date(now.getFullYear(),now.getMonth()+1,1);
const PERIODO=ini.getFullYear()+"-"+String(ini.getMonth()+1).padStart(2,"0"), PERIODO_TXT=MESES[ini.getMonth()]+" de "+ini.getFullYear();

// ---------- estado ----------
const S = {nova:"nao", publico:null, cen:"equilibrado", dig:null, off:{}, lanc:true, lista:null, usos:{remarketing:true,semelhante:true,excluir:false}};
const sel=$("loja");
LOJAS.forEach((l,i)=>{const o=document.createElement("option");o.value=i;o.textContent=l[0]+" · "+l[1];sel.appendChild(o);});
sel.value=LOJAS.findIndex(l=>l[0]==="Shopping Eldorado");
document.querySelectorAll(".inicio").forEach(e=>e.textContent=PERIODO_TXT);
$("novaChips").addEventListener("click",e=>{const b=e.target.closest(".choice");if(!b)return;S.nova=b.dataset.v;
  $("novaChips").querySelectorAll(".choice").forEach(c=>c.setAttribute("aria-pressed",c===b?"true":"false"));calc();});
sel.addEventListener("input",()=>{S.publico=null;calc();});
["cap","atual","desej","resp"].forEach(id=>$(id).addEventListener("input",calc));
document.querySelectorAll(".stepper button").forEach(b=>b.onclick=()=>{const i=$(b.dataset.t);i.value=Math.max(0,(+i.value||0)+(+b.dataset.d));calc();});

// ---------- modelo ----------
function lojaInfo(){const l=LOJAS[+sel.value];const pubDef=(l[3]==="Corporativo"||l[3]==="Clube")?"cativo":"passagem";return {l,pubDef};}
function pesos(pacote,cenK,selecao){
  const w=W[pacote]; const ids=Object.keys(DIG);
  let on = selecao || (cenK==="essencial" ? ids.filter(i=>w[i]>0).sort((a,b)=>w[b]-w[a]).slice(0,2)
                     : cenK==="reforcado" ? ids : ids.filter(i=>w[i]>0));
  const ww={}; on.forEach(i=>ww[i]=w[i]>0?w[i]:.10); const t=Object.values(ww).reduce((a,b)=>a+b,0)||1;
  Object.keys(ww).forEach(i=>ww[i]/=t); return ww;
}
function cplMix(ww){return Object.entries(ww).reduce((s,[i,f])=>s+f*DIG[i].cpl,0);}
let PLAN=null;
function calc(){
  const {l,pubDef}=lojaInfo(); const tipo=l[3];
  $("lojaTags").innerHTML=[l[2],tipo].map(t=>`<span class="tag">${esc(t)}</span>`).join("");
  const cap=Math.max(0,+$("cap").value||0), atual=Math.max(0,+$("atual").value||0), desej=Math.max(0,+$("desej").value||0);
  const vagas=desej>atual; const row=vagas?"vagas":"cheia";
  const pub=S.publico||pubDef;
  const pacote=Object.keys(PK).find(k=>PK[k].col===pub&&PK[k].row===row);
  const gap=Math.max(0,desej-atual), folga=Math.max(0,cap-atual);
  const cens={};
  Object.entries(CEN).forEach(([k,c])=>{
    let dia, cli;
    if(vagas){dia=Math.min(gap*c.f,folga); cli=Math.round(dia*P.dias);}
    else {cli=Math.round(atual*P.dias*(pub==="passagem"?P.volta:P.manter)*c.f); dia=cli/P.dias;}
    const ww=pesos(pacote,k), cpl=cplMix(ww), leads=Math.round(cli/P.conv), verba=leads*cpl;
    const off=k==="reforcado"?Math.round(Math.max(verba*P.offRef,P.offPiso)):0, total=verba+off;
    cens[k]={k,cli,dia,ww,verba,off,total,roi:cli*P.tmed/total,resultado:vagas?atual+dia:atual};
  });
  const lanc = S.nova==="sim" ? (()=>{const c=Math.round(cap*P.dlanc*P.lancShare);return {cli:c,valor:Math.round(c/P.conv)*20.5};})() : null;
  PLAN={loja:l[0],cidade:l[1],praca:l[2],tipo,publico:pub,cap,atual,desej,vagas,agenda:vagas?"Com vagas":"Cheia",pacote,cens,lanc,periodo:PERIODO,periodoTxt:PERIODO_TXT,resp:$("resp").value.trim()};
  $("capErr").textContent=(atual>cap||desej>cap)?"Os carros atendidos não podem passar da capacidade da loja.":"";
  renderMatriz(); renderCens(); renderPersonal();
}

// ---------- passo 3: público ----------
function renderMatriz(){
  const row=PLAN.vagas?"vagas":"cheia";
  document.querySelectorAll(".matriz.sel .ax-row").forEach(r=>r.classList.toggle("hide",r.dataset.row!==row));
  $("rowHint").innerHTML=`<span class="mini" aria-hidden="true"><i class="${PLAN.vagas?"on":""}"></i><i class="${PLAN.vagas?"on":""}"></i><i class="${PLAN.vagas?"":"on"}"></i><i class="${PLAN.vagas?"":"on"}"></i></span><span>${PLAN.vagas?`Sua agenda tem <b>vagas</b>: você atende ${PLAN.atual} e quer chegar a ${PLAN.desej} carros por dia. Seu plano fica na linha <b>Agenda com vagas</b>.`:`Sua agenda está <b>cheia</b> para a meta que você definiu. Seu plano fica na linha <b>Agenda cheia</b>.`}</span>`;
  $("agendaTxt").innerHTML=PLAN.vagas?`Sua agenda tem vagas, então seu plano está entre estes dois. Escolha o que descreve a maioria dos seus clientes.`:`Sua agenda está cheia, então seu plano está entre estes dois. Escolha o que descreve a maioria dos seus clientes.`;
  document.querySelectorAll(".matriz.sel .mcard").forEach(b=>{
    const k=b.dataset.k, pk=PK[k], ativo=pk.row===row;
    b.classList.toggle("hide",!ativo); b.setAttribute("aria-pressed",k===PLAN.pacote?"true":"false");
    b.style.setProperty("--c",cssv(pk.cor));
  });
}
document.querySelectorAll(".matriz.sel .mcard").forEach(b=>b.onclick=()=>{S.publico=PK[b.dataset.k].col;S.dig=null;calc();});

// ---------- passo 4: investimento ----------
function renderCens(){
  const p=PLAN, max=Math.max(p.cap,1);
  $("pkName2").textContent=p.pacote; $("pkBox").style.background=cssv(PK[p.pacote].cor);
  $("pkFrase").textContent=PK[p.pacote].frase;
  $("cens").innerHTML=Object.entries(p.cens).map(([k,c])=>{
    let titulo, sub;
    if(p.vagas){
      const res=d1(c.resultado);
      titulo = k==="essencial"?`Metade do caminho até a sua meta`:k==="equilibrado"?`Chega na sua meta`:`Passa da sua meta`;
      sub = `De ${p.atual} para <b>${res}</b> carros por dia${k==="reforcado"&&c.resultado<p.atual+(p.desej-p.atual)*1.25?" (limitado pela capacidade)":""}`;
    } else {
      titulo = k==="essencial"?`Protege parte da recorrência`:k==="equilibrado"?`Mantém a agenda cheia`:`Folga para crescer`;
      sub = `Cerca de <b>${d1(c.dia)}</b> carros por dia vindos de clientes que voltam`;
    }
    const bar = p.vagas ? `<div class="gbar" aria-hidden="true"><i class="g0" style="width:${p.atual/max*100}%"></i><i class="g1" style="left:${p.atual/max*100}%;width:${(c.resultado-p.atual)/max*100}%"></i><span class="gm" style="left:${p.desej/max*100}%"></span></div>
      <div class="glab"><span>hoje ${p.atual}</span><span>meta ${p.desej}</span><span>capacidade ${p.cap}</span></div>` : "";
    return `<button type="button" class="cen" data-k="${k}" aria-pressed="${k===S.cen}">
      ${k==="equilibrado"?'<span class="rec">Recomendado</span>':""}
      <b class="cname">${CEN[k].nome}</b>
      <span class="ctit">${titulo}</span>
      <span class="csub">${sub}</span>${bar}
      <span class="cval num">${brl(c.total)}<small>/mês</small></span>
      ${c.off?`<span class="coff">${brl(c.verba)} no digital <b>+ ${brl(c.off)} em mídia off</b> perto da loja (já incluso)</span>`:""}
      <span class="cmeta">${c.cli} clientes novos por mês · ROI ${x1(c.roi)}</span>
      <span class="cch">${Object.keys(c.ww).length} canais digitais</span>
    </button>`;}).join("");
  $("cens").querySelectorAll(".cen").forEach(b=>b.onclick=()=>{S.cen=b.dataset.k;S.dig=null;calc();});
  if(p.lanc){$("lancBox").classList.remove("hidden");$("lancBox").innerHTML=`<b>Loja nova: lançamento de ${brl(p.lanc.valor)} em 8 semanas</b>, valor único somado ao plano contínuo. Você confirma no próximo passo.`;}
  else $("lancBox").classList.add("hidden");
}

// ---------- passo 5: personalizar e aprovar ----------
function offDisponiveis(){
  const u=OFFDB.map[PLAN.loja]; const d=(u!=null&&OFFDB.u[u])||{R:3,it:[]};
  const it=d.it.map(o=>({id:o.sku,grupo:o.g,nome:o.v+" · "+o.t,valor:o.m,un:"mês",img:o.i!=null?THUMB[o.i]:null,il:o.il||0,dist:o.d,
    desc:`${o.e?o.e+". ":""}Compra: ${o.p}${o.pm?` · mínimo ${o.pm} dias`:""}${o.est?" · valor mensal estimado":""}.`,fonte:o}));
  return it.concat(EXTRAS);
}
function offRaio(){const u=OFFDB.map[PLAN.loja];return (u!=null&&OFFDB.u[u])?OFFDB.u[u].R:3;}
function renderPersonal(){
  const p=PLAN, c=p.cens[S.cen], B=c.verba;
  if(!S.dig) S.dig=Object.keys(c.ww);
  const ww=pesos(p.pacote,S.cen,S.dig);
  const offSel=offDisponiveis().filter(o=>S.off[o.id]);
  const offMes=offSel.filter(o=>o.un!=="campanha"&&o.un!=="ação").reduce((s,o)=>s+(o.valor||0),0);
  const offPont=offSel.filter(o=>o.un==="campanha"||o.un==="ação").reduce((s,o)=>s+(o.valor||0),0);
  const offMin=c.off||0, base=B+offMin;           // Reforçado: 10% obrigatório de mídia off, somado à verba digital
  const offEff=Math.max(offMes,offMin), aDefinir=Math.max(offMin-offMes,0);
  const D=Math.max(base-offEff,B*P.digMin);
  const total=D+offEff;
  const alloc={}; Object.entries(ww).forEach(([i,f])=>alloc[i]=D*f);
  const leads=D/cplMix(ww); // mesmo custo por contato médio usado nos cenários do passo 5
  const cli=Math.round(leads*P.conv);
  const roi=cli*P.tmed/total;
  // digital
  const cor=cssv(PK[p.pacote].cor);
  $("dig").innerHTML=Object.keys(DIG).map(i=>{const on=!!ww[i];const v=alloc[i]||0;const pad=W[p.pacote][i]>0;
    return `<label class="item${on?"":" off"}"><input type="checkbox" data-dig="${i}" ${on?"checked":""}>
      <span class="itxt"><b>${DIG[i].canal}${pad?"":' <em class="opt">opcional</em>'}</b><span>${DIG[i].desc}</span>
      ${on?`<span class="bar"><i style="width:${Math.round(ww[i]*100)}%;background:${cor}"></i></span>`:""}</span>
      <span class="ival num">${on?brl(v)+"<small>/mês</small>":"-"}</span></label>`;}).join("");
  $("dig").querySelectorAll("input[data-dig]").forEach(cb=>cb.onchange=()=>{
    const id=cb.dataset.dig; let s=S.dig.slice();
    if(cb.checked){if(!s.includes(id))s.push(id);} else { if(s.length<=1){cb.checked=true;$("digErr").textContent="O plano precisa de pelo menos um canal digital.";return;} s=s.filter(x=>x!==id);}
    $("digErr").textContent=""; S.dig=s; renderPersonal();});
  // off
  const offs=offDisponiveis(); const R=offRaio();
  $("offNota").innerHTML=(offMin?`<div class="reserva"><b>Reforçado inclui ${brl(offMin)}/mês de mídia off</b> (10% da verba digital, com mínimo de ${brl(P.offPiso)}). Escolha os pontos abaixo. ${aDefinir>0?`Faltam <b>${brl(aDefinir)}</b>: o que não for escolhido a Layer Up indica e traz para a sua aprovação.`:`Reserva preenchida${offMes>offMin?`; o que passar dos ${brl(offMin)} sai da verba digital`:""}.`}<div class="rb"><i style="width:${Math.min(100,offMes/offMin*100)}%"></i></div></div>`:"")+`Pontos reais num raio de ${R} km da sua loja, com preço de tabela do Canal do Mídia (13/11/2026). Use para completar a verba escolhida; a compra é confirmada pela Layer Up. Quando a plataforma não tem foto do ponto, mostramos uma foto do mesmo formato, marcada como ilustrativa.`
    +(R>3?`<div class="avis5">Não encontramos oferta avulsa em até 3 km desta loja, então abrimos a busca para ${R} km.</div>`:"");
  const linha=o=>{const on=!!S.off[o.id];const ph=o.grupo!=="Extras";
    return `<label class="item${ph?" ph":""}${on?"":" off"}"><input type="checkbox" data-off="${esc(o.id)}" ${on?"checked":""}>
      ${ph?(o.img?`<span class="phw"><img src="${o.img}" alt="">${o.il===1?`<em class="ilus">foto ilustrativa</em>`:""}</span>`:`<span class="noimg">sem foto</span>`):""}
      <span class="itxt"><b>${esc(o.nome)}</b><span>${o.dist!=null?`<i class="dist">${String(o.dist.toFixed(1)).replace(".",",")} km</i>`:""}${esc(o.desc)}</span></span>
      <span class="ival num">${o.valor==null?`<small>a confirmar</small>`:`${brl(o.valor)}<small>/${o.un}</small>`}</span></label>`;};
  $("offs").innerHTML=GRUPOS.map(g=>{const a=offs.filter(o=>o.grupo===g); if(!a.length) return "";
      return `<div class="ogrp">${GNOME[g]}<span>${a.length} ${a.length>1?"opções":"opção"}</span></div>`+a.map(linha).join("");}).join("")
    + (p.lanc?`<div class="ogrp">Lançamento</div><label class="item${S.lanc?"":" off"}"><input type="checkbox" id="cbLanc" ${S.lanc?"checked":""}><span class="itxt"><b>Lançamento da loja (8 semanas)</b><span>Pré-abertura, abertura e consolidação, com meta de ${p.lanc.cli} clientes. Valor único.</span></span><span class="ival num">${brl(p.lanc.valor)}<small>/único</small></span></label>`:"");
  $("offs").querySelectorAll("input[data-off]").forEach(cb=>cb.onchange=()=>{S.off[cb.dataset.off]=cb.checked;renderPersonal();});
  if($("cbLanc")) $("cbLanc").onchange=e=>{S.lanc=e.target.checked;renderPersonal();};
  // regra
  const acima=total>base+1;
  $("regra").innerHTML = acima
    ? `A mídia off escolhida passa de metade da verba. Para manter a força do digital, o investimento mensal sobe para <b>${brl(total)}</b>, acima dos ${brl(base)} escolhidos.`
    : offMin ? `No Reforçado, ${brl(offMin)} por mês vão obrigatoriamente para mídia off perto da loja, somados aos ${brl(B)} do digital. O investimento mensal fica em <b>${brl(total)}</b>.`
    : offMes>0 ? `A mídia off sai da verba escolhida: ${brl(offMes)} em mídia off e ${brl(D)} redistribuídos no digital. O investimento mensal continua em <b>${brl(B)}</b>.`
    : `Ao desmarcar um canal, a verba dele vai para os outros. O investimento mensal fica sempre em <b>${brl(B)}</b>, o valor escolhido no passo anterior.`;
  $("regra").classList.toggle("alert",acima);
  const pont=offPont+(p.lanc&&S.lanc?p.lanc.valor:0);
  $("totais").innerHTML=`<div><span>Investimento mensal</span><b class="num">${brl(total)}</b></div>
    <div><span>Digital · Mídia off</span><b class="num">${brlk(D)} · ${brlk(offEff)}</b></div>
    <div><span>Clientes novos/mês (digital)</span><b class="num">${cli}</b></div>
    <div><span>Ações pontuais</span><b class="num">${pont?brl(pont):"-"}</b></div>`;
  $("resumoTopo").innerHTML=`<b>${esc(p.loja)}</b> · ${esc(p.pacote)} · cenário ${CEN[S.cen].nome} · início em ${PERIODO_TXT}`;
  p.sel={B:base,total,D,offMes:offEff,offMin,aDefinir,offPont,pont,cli,roi,
    itens:Object.entries(alloc).map(([i,v])=>({canal:DIG[i].canal,valor:Math.round(v)})),
    off:offSel.map(o=>({nome:o.nome,valor:o.valor,un:o.un,grupo:o.grupo,dist:o.dist,end:o.fonte?o.fonte.e:"",compra:o.fonte?o.fonte.p:"",sku:o.fonte?o.fonte.sku:""})),lanc:!!(p.lanc&&S.lanc)};
}
// upload da lista
$("lista").addEventListener("change",async e=>{
  const f=e.target.files&&e.target.files[0]; if(!f){S.lista=null;$("listaInfo").textContent="";return;}
  if(!/\.(csv|txt)$/i.test(f.name)||f.size>5*1024*1024){S.lista=null;e.target.value="";$("listaInfo").textContent="Selecione CSV ou TXT de até 5 MB.";return;}
  let linhas=null;
  if(/\.(csv|txt)$/i.test(f.name)){try{const t=await f.text();linhas=t.split(/\r?\n/).filter(x=>x.trim()).length-1;}catch(err){}}
  S.lista={nome:f.name,linhas:linhas!=null&&linhas>=0?linhas:null};
  $("listaInfo").textContent=`Arquivo selecionado: ${f.name}${S.lista.linhas!=null?` · ${S.lista.linhas.toLocaleString("pt-BR")} contatos`:""}. O arquivo será enviado de forma privada somente quando você aprovar o plano e autorizar o compartilhamento.`;
});
document.querySelectorAll("input[data-uso]").forEach(cb=>cb.onchange=()=>S.usos[cb.dataset.uso]=cb.checked);

// ---------- navegação ----------
let STEP=1; const N=6;
function go(n){
  STEP=Math.max(1,Math.min(N,n));
  document.querySelectorAll(".pane").forEach(p=>p.classList.toggle("on",+p.dataset.step===STEP));
  document.querySelectorAll("#progress li").forEach(li=>{const k=+li.dataset.s;li.classList.toggle("done",k<STEP);li.classList.toggle("cur",k===STEP);});
  $("btnBack").style.visibility=STEP===1?"hidden":"visible";
  $("btnNext").classList.toggle("hidden",STEP===N);
  $("btnNext").textContent=["Continuar","Entendi, vamos lá","Continuar","Ver investimento","Personalizar e aprovar"][STEP-1]||"Continuar";
  $("stepErr").classList.add("hidden"); window.scrollTo({top:0,behavior:"auto"});
}
function validStep(){
  if(STEP===1&&(!$("resp").value.trim()||$("resp").value.length>120)) return "Informe seu nome para continuar.";
  if(STEP===3){const c=+$("cap").value,a=+$("atual").value,d=+$("desej").value;
    if(!(c>0)) return "Informe quantos carros a loja consegue atender por dia.";
    if(![c,a,d].every(Number.isSafeInteger)||a<0||c>10000) return "Use números inteiros entre 0 e 10.000.";
    if(a>c||d>c) return "Os carros atendidos e desejados não podem passar da capacidade.";
    if(!(d>0)) return "Informe quantos carros você gostaria de atender por dia.";}
  return "";
}
$("btnNext").onclick=()=>{const e=validStep(); if(e){$("stepErr").textContent=e;$("stepErr").classList.remove("hidden");return;} go(STEP+1);};
$("btnBack").onclick=()=>go(STEP-1);
document.querySelectorAll("#progress li").forEach(li=>li.onclick=()=>{const k=+li.dataset.s; if(k<STEP) go(k);});
$("aceite").onchange=e=>$("btnConfirm").disabled=!e.target.checked;
calc(); go(1);

// ---------- autenticação e solicitações protegidas ----------
let CLIENT=null, UID=null, ADMIN=false, ALL=[];
const CFG=window.DRYWASH_CONFIG||{};
if(CFG.url&&CFG.key&&window.supabase) CLIENT=window.supabase.createClient(CFG.url,CFG.key,{auth:{persistSession:true,detectSessionInUrl:true}});
async function refreshUser(){
  if(!CLIENT){$("authNote").textContent="Salvamento indisponível. Você ainda pode baixar a simulação em PDF.";return;}
  const {data:{user}}=await CLIENT.auth.getUser(); UID=user?.id||null;
  ADMIN=false;
  if(UID){const {data}=await CLIENT.rpc("drywash_is_admin");ADMIN=data===true;}
  $("authStatus").textContent=UID?"Você entrou como "+user.email+". Suas solicitações e arquivos têm acesso restrito.":"Você pode simular sem entrar. Entre para registrar o plano e enviar sua lista de clientes.";
  $("authForm").classList.toggle("hidden",!!UID);$("authLogout").classList.toggle("hidden",!UID);
  $("navPainel").classList.toggle("hidden",!ADMIN); if(!UID) ALL=[];
  route();if(ADMIN) await startPainel();
}
$("authForm").onsubmit=async e=>{
 e.preventDefault();if(!CLIENT){$("authNote").textContent="Acesso temporariamente indisponível.";return;}
 const b=$("authLogin");b.disabled=true;
 try{const {error}=await CLIENT.auth.signInWithOtp({email:$("authEmail").value.trim(),options:{emailRedirectTo:location.origin+location.pathname}});if(error)throw error;
 $("authNote").textContent="Confira seu e-mail e abra o link de acesso. Se não chegar, verifique o spam.";
 }catch(e){$("authNote").textContent="Não foi possível enviar o link de acesso. Aguarde alguns minutos ou fale com a equipe administradora.";}finally{b.disabled=false;}
};
$("authLogout").onclick=async()=>{await CLIENT.auth.signOut();ALL=[];$("tabPainel").textContent="";await refreshUser();};
if(CLIENT){CLIENT.auth.onAuthStateChange(()=>{setTimeout(refreshUser,0);});refreshUser();}
function currentRecord(){
 const p=PLAN,s=p.sel;
 return {id:crypto.randomUUID(),aprovadoEm:new Date().toISOString(),status:"aprovado",
 loja:p.loja,cidade:p.cidade,praca:p.praca,tipo:p.tipo,publico:p.publico,resp:p.resp,cap:p.cap,atual:p.atual,desej:p.desej,agenda:p.agenda,
 pacote:p.pacote,cenario:S.cen,periodo:PERIODO,periodoTxt:PERIODO_TXT,verbaEscolhida:Math.round(s.B),verba:Math.round(s.total),digital:Math.round(s.D),off:Math.round(s.offMes),offObrig:Math.round(s.offMin||0),offADefinir:Math.round(s.aDefinir||0),
 cli:s.cli,roi:Math.round(s.roi*10)/10,itens:s.itens,offItens:s.off,pontual:Math.round(s.pont),
 lanc:s.lanc?{valor:Math.round(p.lanc.valor),cli:p.lanc.cli}:null,
 lista:S.lista?{nome:S.lista.nome,linhas:S.lista.linhas,usos:Object.keys(S.usos).filter(k=>S.usos[k])}:null};
}
async function downloadPDF(rec){
 const blob=await makePDF(rec),url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=`Plano de midia DryWash - ${rec.loja} - ${rec.periodo}.pdf`.replace(/[\\/]/g,"-");
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
}
$("btnPdf").onclick=async()=>{try{const r=currentRecord();r.simulacao=true;await downloadPDF(r);$("feedback").textContent="Simulação baixada. Nenhuma solicitação foi enviada.";}catch(e){$("feedback").textContent="Não foi possível gerar o PDF. Tente novamente.";}};
$("btnConfirm").onclick=async()=>{
 if(!CLIENT||!UID){$("feedback").textContent="Entre pelo e-mail no topo da página para registrar a aprovação. Você pode baixar uma simulação sem entrar.";return;}
 if(!$("aceite").checked)return;
 const file=$("lista").files?.[0];
 if(file&&(!$("listaConsent").checked||!Object.values(S.usos).some(Boolean))){$("feedback").textContent="Autorize o compartilhamento da lista e selecione pelo menos um uso, ou remova o arquivo.";return;}
 const btn=$("btnConfirm");btn.disabled=true;btn.textContent="Registrando…";
 const rec=currentRecord();let path=null,saved=false;
 try{
  if(file){
   if(!/\.(csv|txt)$/i.test(file.name)||file.size>5242880)throw Error("Arquivo inválido");
   path=UID+"/"+rec.id+"."+file.name.split(".").pop().toLowerCase();
   const {error}=await CLIENT.storage.from("drywash-lists").upload(path,file,{upsert:false,contentType:"text/plain"});if(error)throw error;
  }
  const {error}=await CLIENT.from("drywash_plans").insert({id:rec.id,owner_id:UID,plan:rec,file_path:path});if(error)throw error;
  saved=true;$("feedback").textContent="Plano registrado com sucesso. A equipe pode consultá-lo no painel interno.";
  try{await downloadPDF(rec);}catch(e){$("feedback").textContent+=" O PDF não foi gerado; use o botão de simulação para tentar novamente.";}
  if(ADMIN)await startPainel();
 }catch(e){
  if(path&&!saved)await CLIENT.storage.from("drywash-lists").remove([path]);
  $("feedback").textContent="Não foi possível registrar o plano. Nenhuma aprovação foi confirmada. Verifique sua conexão e tente novamente.";
 }finally{btn.textContent=saved?"Plano registrado":"Aprovar e baixar o PDF";btn.disabled=saved||!$("aceite").checked;}
};

// ---------- PDF ----------
function logoPNG(){return new Promise(res=>{const im=new Image();im.onload=()=>{const c=document.createElement("canvas");c.width=644;c.height=190;c.getContext("2d").drawImage(im,0,0,644,190);try{res(c.toDataURL("image/png"));}catch(e){res(null);}};im.onerror=()=>res(null);im.src=$("logo").src;});}
async function makePDF(r){
  const {jsPDF}=window.jspdf; const d=new jsPDF({unit:"mm",format:"a4"}); const W_=210,M=16; let y;
  const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
  const pk=PK[r.pacote], cor=hex(cssv(pk.cor)), blue=[0,79,158];
  const page=()=>{if(y>262){d.addPage();y=20;}};
  d.setFillColor(255,236,0); d.rect(0,0,W_,28,"F");
  const lg=await logoPNG(); if(lg) d.addImage(lg,"PNG",M,6,54,16);
  d.setTextColor(...blue); d.setFont("helvetica","bold"); d.setFontSize(14); d.text(r.simulacao?"Simulação de mídia local":"Plano de mídia local",W_-M,13,{align:"right"});
  d.setFont("helvetica","normal"); d.setFontSize(8.5); d.text("Proposta Layer Up · valores estimados, sujeitos a confirmação",W_-M,19,{align:"right"});
  d.setTextColor(20,20,20); y=38; d.setFont("helvetica","bold"); d.setFontSize(13); d.text(r.loja,M,y);
  d.setFont("helvetica","normal"); d.setFontSize(10); y+=6; d.text(`${r.cidade} · ${r.praca} · ${r.tipo} · público ${r.publico==="cativo"?"cativo":"de passagem"}`,M,y);
  y+=5; d.text(`Início: ${r.periodoTxt}   ·   ${r.simulacao?"Simulado":"Aprovado"} por ${r.resp} em ${new Date(r.aprovadoEm).toLocaleDateString("pt-BR")}`,M,y);
  y+=7; d.setFillColor(...cor); d.roundedRect(M,y,W_-2*M,22,3,3,"F"); d.setTextColor(255,255,255);
  d.setFontSize(9); d.text("PACOTE · CENÁRIO "+CEN[r.cenario].nome.toUpperCase(),M+5,y+7);
  d.setFont("helvetica","bold"); d.setFontSize(16); d.text(r.pacote,M+5,y+15); d.text(brl(r.verba)+"/mês",W_-M-5,y+15,{align:"right"});
  d.setTextColor(20,20,20); y+=30;
  const box=(items)=>{items.forEach(([a,b],i)=>{const cx=M+(i%4)*((W_-2*M)/4), cy=y+Math.floor(i/4)*11; d.setFont("helvetica","normal");d.setFontSize(8.5);d.setTextColor(107,106,100);d.text(a,cx,cy);
     d.setFont("helvetica","bold");d.setFontSize(11);d.setTextColor(20,20,20);d.text(String(b),cx,cy+5);}); y+=Math.ceil(items.length/4)*11+2;};
  const h=t=>{page();d.setFont("helvetica","bold");d.setFontSize(11);d.setTextColor(20,20,20);d.text(t,M,y);y+=6;};
  h("Diagnóstico informado");
  box([["Capacidade",r.cap+" carros/dia"],["Atende hoje",r.atual+" carros/dia"],["Quer atender",r.desej+" carros/dia"],["Agenda",r.agenda]]);
  h("Projeção mensal");
  box([["Investimento",brl(r.verba)],["Clientes novos (digital)",String(r.cli)],["ROI estimado",x1(r.roi)],["Carros que pagam a mídia",String(Math.ceil(r.verba/P.tmed))]]);
  h("Mídia digital");
  d.setDrawColor(226,224,216); d.setFontSize(10);
  r.itens.forEach(it=>{page();d.line(M,y-4.5,W_-M,y-4.5);d.setFont("helvetica","normal");d.text(it.canal,M,y);d.text(brl(it.valor)+"/mês",W_-M,y,{align:"right"});y+=7;});
  if(r.offItens.length||r.offADefinir){y+=2;h(r.offObrig?`Mídia off e extras (Reforçado: ${brl(r.offObrig)}/mês obrigatórios em mídia off)`:"Mídia off e extras");d.setFontSize(10);
    r.offItens.forEach(o=>{page();d.line(M,y-4.5,W_-M,y-4.5);d.setFont("helvetica","normal");d.setFontSize(10);d.text(d.splitTextToSize(o.nome,W_-2*M-40)[0],M,y);d.text(o.valor==null?"valor a confirmar":brl(o.valor)+"/"+o.un,W_-M,y,{align:"right"});
      if(o.end||o.dist!=null){y+=4.5;d.setFontSize(8);d.setTextColor(110);d.text(d.splitTextToSize([(o.dist!=null?String(o.dist.toFixed(1)).replace(".",",")+" km da loja":""),o.end,o.compra?"compra "+o.compra:""].filter(Boolean).join(" · "),W_-2*M-40)[0],M,y);d.setTextColor(0);}
      y+=7;});
    if(r.offADefinir){page();d.line(M,y-4.5,W_-M,y-4.5);d.setFont("helvetica","normal");d.setFontSize(10);d.text("Mídia off perto da loja, a indicar pela Layer Up para aprovação",M,y);d.text(brl(r.offADefinir)+"/mês",W_-M,y,{align:"right"});y+=7;}
    if(r.offItens.some(o=>o.sku)){page();d.setFontSize(8);d.setTextColor(110);d.text("Mídia off: preços de tabela do Canal do Mídia em 13/11/2026, sujeitos a disponibilidade e confirmação pela Layer Up.",M,y);d.setTextColor(0);y+=6;}}
  if(r.lanc){page();d.setFont("helvetica","normal");d.text(`Lançamento da loja (8 semanas, meta de ${r.lanc.cli} clientes)`,M,y);d.text(brl(r.lanc.valor)+" único",W_-M,y,{align:"right"});y+=7;}
  y+=2; h("Mensagem e medição"); d.setFontSize(10); d.setFont("helvetica","normal");
  d.text("Mensagem principal: "+pk.msg,M,y); y+=5.5; d.text("KPI principal: "+pk.kpi,M,y); y+=5.5;
  d.text(d.splitTextToSize("Relatório mensal com investimento, contatos, agendamentos e custo por agendamento. A origem do cliente é medida por link de campanha, cupom, perfil da loja no Google e a pergunta “como nos conheceu?”.",W_-2*M),M,y); y+=12;
  if(r.lista){page();h("Lista de clientes");d.setFontSize(10);d.setFont("helvetica","normal");
    const usos={remarketing:"remarketing",semelhante:"público semelhante",excluir:"excluir clientes atuais das campanhas de novos clientes"};
    d.text(d.splitTextToSize(`Arquivo ${r.lista.nome}${r.lista.linhas!=null?` (${r.lista.linhas} contatos)`:""}. Uso autorizado: ${r.lista.usos.map(u=>usos[u]).join(", ")||"nenhum"}.`,W_-2*M),M,y); y+=11;}
  page(); d.setFillColor(244,246,250); d.roundedRect(M,y,W_-2*M,18,2,2,"F");
  d.setFont("helvetica","bold"); d.setFontSize(10.5); d.text("Total do primeiro mês: "+brl(r.verba+r.pontual),M+4,y+7);
  d.setFont("helvetica","normal"); d.setFontSize(8.5); d.text("A verba de mídia é investida pela loja. A Layer Up revisa o plano a cada trimestre.",M+4,y+13);
  d.setFontSize(7.5); d.setTextColor(107,106,100);
  d.text(d.splitTextToSize("ROI = receita estimada das lavagens (ticket médio de R$ 135) dividida pelo investimento. Custos por contato são referências da Layer Up; mídia off com preços de tabela do Canal do Mídia em 13/11/2026, sujeitos a disponibilidade; 40% dos contatos viram cliente (hipótese a calibrar no piloto). Projeções não são garantia de resultado.",W_-2*M),M,284);
  return d.output("blob");
}

// ---------- painel: autorização também aplicada no banco ----------
async function startPainel(){
 if(!ADMIN||!CLIENT)return;
 const {data,error}=await CLIENT.from("drywash_plans").select("id,created_at,status,plan,file_path").order("created_at",{ascending:false}).limit(1000);
 if(error){$("painelNote").textContent="Não foi possível carregar as solicitações.";return;}
 ALL=data.map(r=>({...r.plan,id:r.id,status:r.status,aprovadoEm:r.created_at,_file:r.file_path}));
 $("painelNote").textContent=data.length===1000?"Mostrando as 1.000 solicitações mais recentes.":"";fillPeriodos();renderPainel();
}
function fillPeriodos(){const f=$("fPeriodo"),cur=f.value,ps=[...new Set(ALL.map(p=>String(p.periodo||"")))].sort();
 f.replaceChildren(new Option("Todos os períodos",""));
 ps.forEach(p=>{const [y,m]=p.split("-");f.add(new Option((MESES[+m-1]||"Período")+" de "+y,p));});f.value=ps.includes(cur)?cur:"";}
$("fPeriodo").onchange=renderPainel;
function rows(){const f=$("fPeriodo").value;return ALL.filter(p=>!f||p.periodo===f);}
function renderPainel(){
  const R=rows(),tb=$("tabPainel");
  tb.innerHTML=R.length?R.map(p=>`<tr><td><b>${esc(p.loja)}</b><br><span class="note">${esc(p.praca)} · ${esc(p.resp)}</span></td><td>${esc(p.periodoTxt)}</td>
    <td><span class="pill" style="background:${cssv(PK[p.pacote]?.cor||"--ink")}">${esc(p.pacote)}</span><br><span class="note">${esc(CEN[p.cenario]?.nome||p.cenario)}</span></td>
    <td class="r num">${brl(p.verba)}<br><span class="note">dig ${brlk(p.digital||0)} · off ${brlk(p.off||0)}</span></td><td class="r num">${p.pontual?brl(p.pontual):"-"}</td>
    <td>${p._file?`<button class="btn ghost" type="button" data-file="${esc(p.id)}">Baixar lista</button>`:"-"}</td>
    <td><select data-id="${esc(p.id)}" aria-label="Status"><option value="aprovado"${p.status==="aprovado"?" selected":""}>Aprovado</option><option value="execucao"${p.status==="execucao"?" selected":""}>Em execução</option><option value="encerrado"${p.status==="encerrado"?" selected":""}>Encerrado</option></select></td></tr>`).join("")
    :'<tr><td colspan="7" class="note">Nenhum plano aprovado ainda. Aprove um plano na calculadora para vê-lo aqui.</td></tr>';
  $("tPlanos").textContent=R.length; $("tLojas").textContent=new Set(R.map(p=>p.loja)).size;
  $("tVerba").textContent=brlk(R.reduce((s,p)=>s+(p.verba||0),0)); $("tPont").textContent=brlk(R.reduce((s,p)=>s+(p.pontual||0),0));
  const grp=(key,el,col)=>{const m=Object.create(null);R.forEach(p=>{m[p[key]]=(m[p[key]]||0)+(p.verba||0);});const mx=Math.max(1,...Object.values(m));
    $(el).innerHTML=Object.keys(m).length?Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:13px"><span>${esc(k)}</span><b class="num">${brl(v)}</b></div><div class="bar"><i style="width:${v/mx*100}%;background:${col?cssv(PK[k]?.cor||"--blue"):"#004F9E"}"></i></div></div>`).join(""):'<p class="note">Sem dados.</p>';};
  grp("pacote","porPacote",true); grp("praca","porPraca",false);
}
$("tabPainel").addEventListener("change",async e=>{
 const s=e.target.closest("select");if(!s||!ADMIN||!CLIENT)return;s.disabled=true;
 const {error}=await CLIENT.from("drywash_plans").update({status:s.value}).eq("id",s.dataset.id);
 if(error)$("painelNote").textContent="Não foi possível mudar o status.";else await startPainel();s.disabled=false;
});
$("tabPainel").addEventListener("click",async e=>{
 const b=e.target.closest("button[data-file]");if(!b||!ADMIN)return;
 const r=ALL.find(r=>r.id===b.dataset.file);if(!r?._file)return;
 const {data,error}=await CLIENT.storage.from("drywash-lists").download(r._file);
 if(error){$("painelNote").textContent="Não foi possível baixar a lista.";return;}
 const url=URL.createObjectURL(data),a=document.createElement("a");a.href=url;a.download=(r.lista?.nome||"lista.csv").replace(/[\\/]/g,"-");a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);
});
$("btnCsv").onclick=()=>{
 if(!ADMIN)return;const R=rows();if(!R.length){$("painelNote").textContent="Não há planos para exportar.";return;}
 const q=v=>'"'+String(v??"").replace(/^(?:\s*[=+@\-]|[\t\r])/,"'$&").replace(/"/g,'""')+'"';
 const lines=[["aprovado_em","loja","responsavel","periodo","pacote","verba","status"],...R.map(p=>[p.aprovadoEm,p.loja,p.resp,p.periodo,p.pacote,p.verba,p.status])].map(r=>r.map(q).join(";")).join("\r\n");
 const url=URL.createObjectURL(new Blob(["\ufeff"+lines],{type:"text/csv;charset=utf-8"})),a=document.createElement("a");a.href=url;a.download="solicitacoes_drywash.csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);
};
function route(){
  const painel=location.hash==="#painel"&&ADMIN;
  $("viewCalc").classList.toggle("hidden",painel); $("viewPainel").classList.toggle("hidden",!painel);
  $("navCalc").setAttribute("aria-current",painel?"false":"page"); $("navPainel").setAttribute("aria-current",painel?"page":"false");
  if(painel) renderPainel();
}
window.addEventListener("hashchange",route); route();

