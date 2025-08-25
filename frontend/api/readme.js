export default async function handler(req, res) {
  const repo = "robertpreshyl/allyship-securitylab-VpNSIEM";
  const base = `https://raw.githubusercontent.com/${repo}/main/`;
  try {
    const gh = await fetch(`https://api.github.com/repos/${repo}/readme`, {
      headers: { Accept: "application/vnd.github.v3.html" }
    });
    let html = await gh.text();
    // Optional: make topmost image clickable back to home
    try {
      const firstImgMatch = html.match(/<img[^>]*src=\"([^\"]+)\"[^>]*>/i);
      if (firstImgMatch) {
        const imgTag = firstImgMatch[0];
        html = html.replace(imgTag, `<a href=\"/\" aria-label=\"Back to Home\">${imgTag}</a>`);
      }
    } catch(_) {}
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.status(200).send(`<!doctype html>
<html lang=\"en\"><head>
<meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">
<base href=\"${base}\">
<title>README – ${repo}</title>
<style>
  body { margin:0; background:#0F172A; color:#F8FAFC; font-family: ui-sans-serif, -apple-system, system-ui, Segoe UI, Inter, sans-serif; }
  .wrap { max-width: 900px; margin: 2rem auto; padding: 1.25rem; background:#111827; border:1px solid #374151; border-radius:12px; }
  .wrap h1,h2,h3,h4,h5,h6 { color:#E5E7EB; }
  .wrap a { color:#0D9488; text-decoration:none; } .wrap a:hover { text-decoration:underline; }
  .wrap pre, .wrap code { background:#0B1220; color:#E5E7EB; }
  img { max-width:100%; height:auto; }
  .mermaid { background:#0B1220; border-radius:8px; padding:12px; }
</style>
</head>
<body>
  <main class=\"wrap\" id=\"readme-root\">${html}</main>
  <script src=\"https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js\"></script>
  <script>
  (function(){
    const root = document.getElementById('readme-root');
    if (!root) return;
    // Look at all <pre> blocks (GitHub may wrap code differently)
    const preBlocks = root.querySelectorAll('pre');
    preBlocks.forEach(pre => {
      const txt = (pre.textContent || '').trim();
      if (/^(graph|flowchart)\s/i.test(txt)) {
        const div = document.createElement('div');
        div.className = 'mermaid';
        div.textContent = txt;
        pre.replaceWith(div);
      }
    });
    if (document.querySelector('.mermaid') && window.mermaid) {
      try {
        window.mermaid.initialize({ startOnLoad: false, theme: 'dark' });
        window.mermaid.run({ querySelector: '.mermaid' });
      } catch (e) { /* noop */ }
    }
  })();
  </script>
</body>
</html>`);
  } catch (e) {
    res.status(500).json({ error: "Failed to load README" });
  }
}
