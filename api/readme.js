export default async function handler(req, res) {
  const repo = "robertpreshyl/allyship-securitylab-VpNSIEM";
  try {
    const gh = await fetch(`https://api.github.com/repos/${repo}/readme`, {
      headers: { Accept: "application/vnd.github.v3.html" }
    });
    const html = await gh.text();
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.status(200).send(`<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>README – ${repo}</title>
<style>
  body { margin:0; background:#0F172A; color:#F8FAFC; font-family: ui-sans-serif, -apple-system, system-ui, Segoe UI, Inter, sans-serif; }
  .wrap { max-width: 900px; margin: 2rem auto; padding: 1.25rem; background:#111827; border:1px solid #374151; border-radius:12px; }
  .wrap h1,h2,h3,h4,h5,h6 { color:#E5E7EB; }
  .wrap a { color:#0D9488; text-decoration:none; } .wrap a:hover { text-decoration:underline; }
  .wrap pre, .wrap code { background:#0B1220; color:#E5E7EB; }
  img { max-width:100%; height:auto; }
</style>
</head><body><main class="wrap">${html}</main></body></html>`);
  } catch (e) {
    res.status(500).json({ error: "Failed to load README" });
  }
}
