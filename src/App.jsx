import { useState, useEffect, useCallback } from "react";

const PERSPECTIVES = ["Financeiro", "Clientes", "Processos Internos", "Aprendizado", "Cultura"];
const MONTHS = ["Abr/26", "Mai/26", "Jun/26"];

const PERSP_STYLES = {
  "Financeiro": { bg: "#FFF3E0", text: "#8B4513", border: "#E67E22" },
  "Clientes": { bg: "#E3F2FD", text: "#0D47A1", border: "#2196F3" },
  "Processos Internos": { bg: "#E8F5E9", text: "#1B5E20", border: "#4CAF50" },
  "Aprendizado": { bg: "#F3E5F5", text: "#4A148C", border: "#9C27B0" },
  "Cultura": { bg: "#FCE4EC", text: "#880E4F", border: "#E91E63" },
};

const DEPTS = {
  Entrega: {
    gestor: "Sheila", color: "#2196F3",
    colaboradores: [
      { id: "E01", nome: "Marcus" }, { id: "E02", nome: "Tulio" },
      { id: "E03", nome: "Thiago" }, { id: "E04", nome: "Ana" },
      { id: "E05", nome: "Luiza" }, { id: "E06", nome: "Alyne" },
      { id: "E07", nome: "Izabella" }, { id: "E08", nome: "Gabriela" },
      { id: "E09", nome: "Karol" }, { id: "E10", nome: "Carol Peneda" },
      { id: "E11", nome: "Silas" }, { id: "E12", nome: "Bryan" },
      { id: "E13", nome: "Mayra" }, { id: "E14", nome: "Raffaela" },
      { id: "E15", nome: "Ryan" }, { id: "E16", nome: "Iara" },
      { id: "E17", nome: "Travel" }, { id: "E18", nome: "Hunter 1" },
      { id: "E19", nome: "Hunter 2" }, { id: "E20", nome: "AVT 3" },
      { id: "E21", nome: "AVT 4" }, { id: "E22", nome: "AVT 5" },
      { id: "E23", nome: "AVT 6" },
    ],
    quesitos: {
      Financeiro: "Gerar receita com spread",
      Clientes: "Satisfação e retenção BF",
      "Processos Internos": "Tempo de resposta e SLA",
      Aprendizado: "Certificações e destinos",
      Cultura: "Alinhamento com valores"
    }
  },
  Produto: {
    gestor: "João / Marcus", color: "#9C27B0",
    colaboradores: [
      { id: "P01", nome: "Marcus" }, { id: "P02", nome: "João" },
      { id: "P03", nome: "Bryan" }, { id: "P04", nome: "Hunter" },
      { id: "P05", nome: "Emissor" }, { id: "P06", nome: "Emilly" },
      { id: "P07", nome: "Nicole" }, { id: "P08", nome: "Matheus" },
      { id: "P09", nome: "Suporte" },
    ],
    quesitos: {
      Financeiro: "Impacto na receita",
      Clientes: "Pesquisa com usuários",
      "Processos Internos": "Handoffs e documentação",
      Aprendizado: "Ferramentas e metodologias",
      Cultura: "Alinhamento com valores"
    }
  },
  Tech: {
    gestor: "Rigueira", color: "#607D8B",
    colaboradores: [
      { id: "T01", nome: "Rigueira" }, { id: "T02", nome: "Xande" },
      { id: "T03", nome: "Davi (Backend)" }, { id: "T04", nome: "Dev 1" },
      { id: "T05", nome: "Dev 2" }, { id: "T06", nome: "Davi (Mobile)" },
    ],
    quesitos: {
      Financeiro: "Entregas que impactam receita",
      Clientes: "Experiência do usuário",
      "Processos Internos": "Qualidade de código",
      Aprendizado: "Evolução técnica",
      Cultura: "Alinhamento com valores"
    }
  },
  Marketing: {
    gestor: "João Fergon", color: "#E91E63",
    colaboradores: [
      { id: "M01", nome: "João Fergon" }, { id: "M02", nome: "Lucas" },
      { id: "M03", nome: "Designer" }, { id: "M04", nome: "Marco" },
      { id: "M05", nome: "Copy" }, { id: "M06", nome: "Cotador Mkt" },
      { id: "M07", nome: "VideoMaker" },
    ],
    quesitos: {
      Financeiro: "ROAS das campanhas",
      Clientes: "Geração de leads",
      "Processos Internos": "Calendário editorial",
      Aprendizado: "Ferramentas e tendências",
      Cultura: "Alinhamento com valores"
    }
  },
  Comercial: {
    gestor: "Léo / Rogerio", color: "#E67E22",
    colaboradores: [
      { id: "C01", nome: "Léo" }, { id: "C02", nome: "Rogerio" },
      { id: "C03", nome: "Luiza" }, { id: "C04", nome: "Arthur" },
      { id: "C05", nome: "Felipe" }, { id: "C06", nome: "Closer 4" },
      { id: "C07", nome: "Closer 5" }, { id: "C08", nome: "Lucas Eduardo" },
      { id: "C09", nome: "SDR 2" }, { id: "C10", nome: "SDR 3" },
      { id: "C11", nome: "SDR 4" }, { id: "C12", nome: "SDR 5" },
    ],
    quesitos: {
      Financeiro: "Meta de vendas BF",
      Clientes: "Atendimento ao lead",
      "Processos Internos": "Playbook comercial",
      Aprendizado: "Técnicas de vendas",
      Cultura: "Alinhamento com valores"
    }
  },
  Financeiro: {
    gestor: "Flavia", color: "#4CAF50",
    colaboradores: [
      { id: "F01", nome: "Flavia" }, { id: "F02", nome: "Daniel" },
      { id: "F03", nome: "Gislane" },
    ],
    quesitos: {
      Financeiro: "Plano orçamentário",
      Clientes: "Demandas internas",
      "Processos Internos": "Fluxos e relatórios",
      Aprendizado: "Sistemas e ferramentas",
      Cultura: "Alinhamento com valores"
    }
  },
};

const API = {
  salvarNota: "/api/salvar-nota",
  carregarDados: "/api/carregar-dados",
  salvarObs: "/api/salvar-obs",
};

function rag(v) {
  if (v == null || isNaN(v)) return { l: "—", c: "#9E9E9E", bg: "#F5F5F5" };
  if (v >= 2.6) return { l: "Acima", c: "#0D47A1", bg: "#BBDEFB" };
  if (v >= 2) return { l: "No alvo", c: "#1B5E20", bg: "#C8E6C9" };
  if (v >= 1) return { l: "Atenção", c: "#F57F17", bg: "#FFF9C4" };
  return { l: "Crítico", c: "#B71C1C", bg: "#FFCDD2" };
}

function avg(arr) {
  const v = arr.filter(x => x != null && x !== "" && !isNaN(x));
  return v.length ? v.reduce((s, x) => s + Number(x), 0) / v.length : null;
}

function fmt(v) {
  return v != null && !isNaN(v) ? Number(v).toFixed(1) : "—";
}

function getColabId(dept, nome) {
  const info = DEPTS[dept];
  if (!info) return null;
  const c = info.colaboradores.find(x => x.nome === nome);
  return c ? c.id : null;
}

export default function App() {
  const [view, setView] = useState("painel");
  const [dept, setDept] = useState(null);
  const [colab, setColab] = useState(null);
  const [scores, setScores] = useState({});
  const [obs, setObs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [offline, setOffline] = useState(false);

  const flash = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const r = await fetch(API.carregarDados);
      if (!r.ok) throw new Error("HTTP " + r.status);
      const data = await r.json();
      const rows = Array.isArray(data) ? data : (data.data || []);
      const newScores = {};
      rows.forEach(row => {
        if (!row.departamento || !row.nome || !row.perspectiva || !row.mes) return;
        const key = `${row.departamento}|${row.nome}|${row.perspectiva}|${row.mes}`;
        newScores[key] = parseFloat(row.nota);
      });
      setScores(newScores);
      setOffline(false);
    } catch (e) {
      console.error("Erro ao carregar:", e);
      setOffline(true);
      flash("Erro ao conectar — modo offline", true);
      try {
        const cached = JSON.parse(window.localStorage.getItem("bsc-cache") || "{}");
        setScores(cached.scores || {});
        setObs(cached.obs || {});
      } catch {}
    }
    setLoading(false);
  }

  const saveScore = useCallback(async (d, c, p, m, v) => {
    const key = `${d}|${c}|${p}|${m}`;
    const val = v === "" ? null : Math.min(3, Math.max(0, parseFloat(v)));
    const ns = { ...scores, [key]: val };
    setScores(ns);
    try { window.localStorage.setItem("bsc-cache", JSON.stringify({ scores: ns, obs })); } catch {}

    if (val == null) return;

    setSaving(true);
    try {
      const info = DEPTS[d];
      const payload = {
        id_colaborador: getColabId(d, c),
        nome: c,
        departamento: d,
        perspectiva: p,
        mes: m,
        nota: val,
        gestor_avaliador: info.gestor,
        data_preenchimento: new Date().toISOString(),
      };
      const r = await fetch(API.salvarNota, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error("HTTP " + r.status);
      flash("Salvo");
      setOffline(false);
    } catch (e) {
      console.error("Erro ao salvar nota:", e);
      flash("Sem conexão — salvo localmente", true);
      setOffline(true);
    }
    setSaving(false);
  }, [scores, obs]);

  const saveObs = useCallback(async (d, c, p, m, text) => {
    const key = `${d}|${c}|${p}|${m}`;
    const no = { ...obs, [key]: text };
    setObs(no);
    try { window.localStorage.setItem("bsc-cache", JSON.stringify({ scores, obs: no })); } catch {}

    if (!text || text.trim() === "") return;

    try {
      const info = DEPTS[d];
      await fetch(API.salvarObs, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_colaborador: getColabId(d, c),
          nome: c,
          departamento: d,
          perspectiva: p,
          mes: m,
          observacao: text,
          gestor_avaliador: info.gestor,
          data_preenchimento: new Date().toISOString(),
        }),
      });
    } catch (e) {
      console.error("Erro ao salvar obs:", e);
    }
  }, [scores, obs]);

  const gs = (d, c, p, m) => scores[`${d}|${c}|${p}|${m}`] ?? null;
  const colabAvg = (d, c, m) => avg(PERSPECTIVES.map(p => gs(d, c, p, m)));
  const colabTotal = (d, c) => avg(MONTHS.map(m => colabAvg(d, c, m)));
  const deptAvg = (d, m) => avg(DEPTS[d].colaboradores.map(x => colabAvg(d, x.nome, m)));
  const deptTotal = (d) => avg(MONTHS.map(m => deptAvg(d, m)));
  const companyAvg = (m) => avg(Object.keys(DEPTS).map(d => deptAvg(d, m)));

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", fontFamily: "system-ui" }}>
      <p style={{ color: "#888" }}>Carregando BSC…</p>
    </div>
  );

  const Badge = ({ v }) => {
    const r = rag(v);
    return <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: r.bg, color: r.c, fontWeight: 500 }}>{r.l}</span>;
  };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: 900, margin: "0 auto", padding: "0 16px 40px" }}>
      {toast && (
        <div style={{
          position: "fixed", top: 16, right: 16,
          background: toast.isError ? "#B71C1C" : "#1B5E20",
          color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 13,
          zIndex: 999, boxShadow: "0 2px 12px rgba(0,0,0,.15)"
        }}>{toast.msg}</div>
      )}

      <div style={{
        background: "#1A3A5C", borderRadius: 12, padding: "16px 20px",
        margin: "8px 0 12px", display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: 8
      }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: 18, margin: 0, fontWeight: 600 }}>Falcão das Milhas — BSC</h1>
          <p style={{ color: "#94B8D4", fontSize: 11, margin: "2px 0 0" }}>
            Q2/2026 • 60 colaboradores {offline ? "• 🔴 Offline" : "• 🟢 Conectado"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { k: "painel", l: "Painel" },
            { k: "dept", l: "Departamento" },
            { k: "colab", l: "Avaliar" },
          ].map(t => (
            <button key={t.k} onClick={() => setView(t.k)}
              style={{
                padding: "5px 12px", borderRadius: 6, border: "none",
                fontSize: 11, fontWeight: 500, cursor: "pointer",
                background: view === t.k ? "#fff" : "rgba(255,255,255,.15)",
                color: view === t.k ? "#1A3A5C" : "#fff"
              }}>{t.l}</button>
          ))}
          <button onClick={loadData} title="Recarregar do N8N"
            style={{ padding: "5px 10px", borderRadius: 6, border: "none", fontSize: 11, cursor: "pointer",
              background: "rgba(255,255,255,.15)", color: "#fff" }}>↻</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
        {[
          { n: "0", l: "Não entregou", bg: "#FFCDD2", c: "#B71C1C" },
          { n: "1", l: "Abaixo", bg: "#FFF9C4", c: "#F57F17" },
          { n: "2", l: "Esperado", bg: "#C8E6C9", c: "#1B5E20" },
          { n: "3", l: "Acima", bg: "#BBDEFB", c: "#0D47A1" },
        ].map(s =>
          <span key={s.n} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 5, background: s.bg, color: s.c, fontWeight: 500 }}>
            {s.n} {s.l}
          </span>
        )}
      </div>

      {view === "painel" && <>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 16 }}>
          {MONTHS.map(m => {
            const v = companyAvg(m);
            return (
              <div key={m} style={{ background: "#f8f8f8", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                <p style={{ fontSize: 10, color: "#888", margin: 0 }}>{m}</p>
                <p style={{ fontSize: 22, fontWeight: 600, margin: "4px 0", color: "#1A3A5C" }}>{fmt(v)}</p>
                <Badge v={v} />
              </div>
            );
          })}
          {(() => {
            const v = avg(MONTHS.map(m => companyAvg(m)));
            return (
              <div style={{ background: "#1A3A5C", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                <p style={{ fontSize: 10, color: "#94B8D4", margin: 0 }}>Média Q2</p>
                <p style={{ fontSize: 22, fontWeight: 600, margin: "4px 0", color: "#fff" }}>{fmt(v)}</p>
                <Badge v={v} />
              </div>
            );
          })()}
        </div>

        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#1A3A5C" }}>
                <th style={{ color: "#fff", padding: "8px 12px", textAlign: "left", fontWeight: 500 }}>Departamento</th>
                <th style={{ color: "#fff", padding: "8px", textAlign: "center", fontWeight: 500 }}>Eq.</th>
                {MONTHS.map(m => <th key={m} style={{ color: "#fff", padding: "8px", textAlign: "center", fontWeight: 500 }}>{m}</th>)}
                <th style={{ color: "#fff", padding: "8px", textAlign: "center", fontWeight: 500, background: "#0f2236" }}>Média</th>
                <th style={{ color: "#fff", padding: "8px", textAlign: "center", fontWeight: 500, background: "#0f2236" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(DEPTS).map(([d, info], i) => {
                const t = deptTotal(d);
                return (
                  <tr key={d} style={{ background: i % 2 === 0 ? "#fafafa" : "#fff", cursor: "pointer" }}
                    onClick={() => { setDept(d); setView("dept"); }}>
                    <td style={{ padding: "8px 12px", fontWeight: 500 }}>
                      <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: info.color, marginRight: 6 }}></span>
                      {d}
                      <span style={{ fontSize: 10, color: "#888", marginLeft: 4 }}>({info.gestor})</span>
                    </td>
                    <td style={{ padding: "8px", textAlign: "center", color: "#888" }}>{info.colaboradores.length}</td>
                    {MONTHS.map(m => <td key={m} style={{ padding: "8px", textAlign: "center", fontWeight: 500 }}>{fmt(deptAvg(d, m))}</td>)}
                    <td style={{ padding: "8px", textAlign: "center", fontWeight: 600 }}>{fmt(t)}</td>
                    <td style={{ padding: "8px", textAlign: "center" }}><Badge v={t} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#1A3A5C", marginBottom: 8 }}>Média por perspectiva</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6 }}>
            {PERSPECTIVES.map(p => {
              const pc = PERSP_STYLES[p];
              const all = [];
              Object.entries(DEPTS).forEach(([d, info]) => {
                info.colaboradores.forEach(x => {
                  MONTHS.forEach(m => {
                    const s = gs(d, x.nome, p, m);
                    if (s != null) all.push(s);
                  });
                });
              });
              const v = all.length ? all.reduce((a, b) => a + b, 0) / all.length : null;
              return (
                <div key={p} style={{ background: pc.bg, borderRadius: 6, padding: "8px 10px", textAlign: "center", borderLeft: `3px solid ${pc.border}` }}>
                  <p style={{ fontSize: 9, color: pc.text, margin: 0, fontWeight: 500 }}>{p}</p>
                  <p style={{ fontSize: 20, fontWeight: 600, margin: "4px 0 0", color: pc.text }}>{fmt(v)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </>}

      {view === "dept" && <>
        <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
          {Object.entries(DEPTS).map(([d, info]) => (
            <button key={d} onClick={() => setDept(d)}
              style={{
                padding: "5px 12px", borderRadius: 5, border: `1px solid ${dept === d ? info.color : "#ddd"}`,
                fontSize: 11, fontWeight: 500, cursor: "pointer",
                background: dept === d ? info.color : "#fff", color: dept === d ? "#fff" : "#333"
              }}>{d}</button>
          ))}
        </div>
        {dept && DEPTS[dept] && (() => {
          const info = DEPTS[dept];
          return <>
            <div style={{ background: info.color, borderRadius: 8, padding: "12px 16px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ color: "#fff", fontSize: 16, margin: 0 }}>{dept}</h2>
                <p style={{ color: "rgba(255,255,255,.7)", fontSize: 11, margin: "2px 0 0" }}>
                  Gestor: {info.gestor} • {info.colaboradores.length} colaboradores
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: "#fff", fontSize: 22, fontWeight: 600, margin: 0 }}>{fmt(deptTotal(dept))}</p>
              </div>
            </div>
            <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ background: "#f5f5f5" }}>
                    <th style={{ padding: "7px 10px", textAlign: "left", fontWeight: 500, color: "#666" }}>Colaborador</th>
                    {MONTHS.map(m => <th key={m} style={{ padding: "7px 6px", textAlign: "center", fontWeight: 500, color: "#666" }}>{m}</th>)}
                    <th style={{ padding: "7px 6px", textAlign: "center", fontWeight: 500, color: "#333" }}>Média</th>
                    <th style={{ padding: "7px 6px", textAlign: "center", fontWeight: 500, color: "#333" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {info.colaboradores.map((x, i) => {
                    const t = colabTotal(dept, x.nome);
                    return (
                      <tr key={x.id} style={{ background: i % 2 === 0 ? "#fafafa" : "#fff", cursor: "pointer" }}
                        onClick={() => { setColab(x.nome); setView("colab"); }}>
                        <td style={{ padding: "7px 10px", fontWeight: 500 }}>{x.nome}</td>
                        {MONTHS.map(m => {
                          const v = colabAvg(dept, x.nome, m);
                          const r = rag(v);
                          return <td key={m} style={{ padding: "7px 6px", textAlign: "center", color: r.c, fontWeight: 500 }}>{fmt(v)}</td>;
                        })}
                        <td style={{ padding: "7px 6px", textAlign: "center", fontWeight: 600 }}>{fmt(t)}</td>
                        <td style={{ padding: "7px 6px", textAlign: "center" }}><Badge v={t} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>;
        })()}
      </>}

      {view === "colab" && <>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <select value={dept || ""} onChange={e => { setDept(e.target.value); setColab(null); }}
            style={{ padding: "7px 10px", borderRadius: 6, border: "1px solid #ddd", fontSize: 12, flex: "1 1 180px" }}>
            <option value="">Departamento</option>
            {Object.keys(DEPTS).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {dept && (
            <select value={colab || ""} onChange={e => setColab(e.target.value)}
              style={{ padding: "7px 10px", borderRadius: 6, border: "1px solid #ddd", fontSize: 12, flex: "1 1 180px" }}>
              <option value="">Colaborador</option>
              {DEPTS[dept].colaboradores.map(x => <option key={x.id} value={x.nome}>{x.nome}</option>)}
            </select>
          )}
        </div>
        {dept && colab && (() => {
          const info = DEPTS[dept];
          const t = colabTotal(dept, colab);
          return <>
            <div style={{ background: "#f8f8f8", borderRadius: 8, padding: "14px 16px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontSize: 16, margin: 0, color: "#1A3A5C" }}>{colab}</h2>
                <p style={{ fontSize: 11, color: "#888", margin: "2px 0 0" }}>{dept} • {info.gestor}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 26, fontWeight: 600, margin: 0, color: "#1A3A5C" }}>{fmt(t)}</p>
                <Badge v={t} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 12 }}>
              {MONTHS.map(m => {
                const v = colabAvg(dept, colab, m);
                const r = rag(v);
                return (
                  <div key={m} style={{ background: r.bg, borderRadius: 6, padding: "8px 10px", textAlign: "center" }}>
                    <p style={{ fontSize: 10, color: r.c, margin: 0 }}>{m}</p>
                    <p style={{ fontSize: 18, fontWeight: 600, margin: "2px 0 0", color: r.c }}>{fmt(v)}</p>
                  </div>
                );
              })}
            </div>
            {PERSPECTIVES.map(p => {
              const pc = PERSP_STYLES[p];
              return (
                <div key={p} style={{ background: "#fff", border: `1px solid ${pc.border}30`, borderLeft: `4px solid ${pc.border}`, borderRadius: 0, padding: "12px 14px", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: pc.text }}>{p}</span>
                      <p style={{ fontSize: 10, color: "#888", margin: "1px 0 0" }}>{info.quesitos[p]}</p>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: pc.text }}>
                      {fmt(avg(MONTHS.map(m => gs(dept, colab, p, m))))}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                    {MONTHS.map(m => (
                      <div key={m}>
                        <label style={{ fontSize: 9, color: "#888", display: "block", marginBottom: 2 }}>{m}</label>
                        <input type="number" min="0" max="3" step="0.5"
                          value={gs(dept, colab, p, m) ?? ""}
                          placeholder="0-3"
                          onBlur={e => saveScore(dept, colab, p, m, e.target.value)}
                          onChange={e => {
                            const key = `${dept}|${colab}|${p}|${m}`;
                            const val = e.target.value === "" ? null : parseFloat(e.target.value);
                            setScores({ ...scores, [key]: val });
                          }}
                          style={{ width: "100%", padding: "5px 6px", borderRadius: 5, border: "1px solid #ddd", fontSize: 13, textAlign: "center", fontWeight: 500, boxSizing: "border-box" }} />
                      </div>
                    ))}
                  </div>
                  <textarea placeholder="Obs. do gestor (ex: Abr/26 - bom desempenho)"
                    defaultValue={obs[`${dept}|${colab}|${p}|geral`] || ""}
                    onBlur={e => saveObs(dept, colab, p, "geral", e.target.value)}
                    style={{ width: "100%", marginTop: 6, padding: "5px 6px", borderRadius: 5, border: "1px solid #eee", fontSize: 10, resize: "vertical", minHeight: 28, fontFamily: "inherit", boxSizing: "border-box", color: "#666" }} />
                </div>
              );
            })}
          </>;
        })()}
      </>}

      <div style={{ textAlign: "center", marginTop: 20, padding: "10px 0", borderTop: "1px solid #eee" }}>
        <p style={{ fontSize: 10, color: "#aaa", margin: 0 }}>
          BSC Falcão das Milhas Q2/2026 {saving && "• salvando…"}
        </p>
      </div>
    </div>
  );
}
