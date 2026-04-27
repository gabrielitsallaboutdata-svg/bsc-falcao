export async function GET() {
  const res = await fetch("https://ia.falcaodasmilhasdata.com/webhook/bsc-carregar-dados", {
    method: "GET",
    cache: "no-store",
  });
  const data = await res.json().catch(() => []);
  return Response.json(data);
}
