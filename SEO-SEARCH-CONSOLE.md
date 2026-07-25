# Search Console — engangsoppsett

robots.txt og sitemap.xml finnes og er live. «robots.txt not found» + tomme
crawl stats skyldes property-oppsett/ventetid, ikke manglende fil.

1. **Add property → Domain** → `matlyst-app.no`. Verifiser med DNS TXT (Domeneshop).
   Domain-property er forutsetningen for Crawl stats og dekker apex+www+http/https.
2. **Settings → Crawl stats** — vises kun på Domain-property; trenger noen dager
   med Googlebot-aktivitet. Tomt på ny property i 1–2 uker er normalt.
3. **Settings → robots.txt report** — skal vise `https://matlyst-app.no/robots.txt`
   som *Fetched*. Be om re-fetch hvis «Not fetched yet».
4. **Indexing → Sitemaps** — send inn `sitemap.xml`, bekreft «Success».
5. **URL Inspection** på `https://matlyst-app.no/` → *Request indexing*. Gjenta for
   hver ny side etter deploy:
   - `https://matlyst-app.no/importer-oppskrifter`
   - `https://matlyst-app.no/ukemeny`
   - `https://matlyst-app.no/handleliste`
   - `https://matlyst-app.no/importer-fra-matprat`
