export async function GET(request: Request) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  const startedAt = Date.now().toString();
  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store",
      "Set-Cookie": `contact_started_at=${startedAt}; Max-Age=3600; Path=/api/contact; HttpOnly; SameSite=Strict${secure}`,
    },
  });
}
