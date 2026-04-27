export async function POST(request) {
  const body = await request.json();
  const res = await fetch("https://ia.falcaodasmilhasdata.com/webhook/bsc-salvar-nota", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({ ok: true }));
  return Response.json(data);
}
