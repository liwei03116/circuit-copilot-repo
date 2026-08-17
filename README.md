# Circuit Aide

An AI agent that turns a plain-English hardware project description into a
starting design: chip selection with reasoning, a wiring diagram, working
firmware, and an ordered build plan.

- `index.html` — landing/introduction page
- `circuit-copilot.html` — the working app

## Live demo
Once GitHub Pages is enabled for this repo, it will be published at:
`https://circuitaide.com/`

## Before you deploy: about the API key
`circuit-copilot.html` lets each visitor pick a provider from a dropdown —
Google Gemini (free, default), Anthropic Claude, or OpenAI — and paste
their own API key for whichever one they choose. A typed key is kept only
in that browser tab for the session; it's never saved or sent anywhere but
the chosen provider's API.

### Optional: a built-in key so visitors need zero setup
Near the top of the `<script>` block there's a `BUILT_IN_KEYS` object. If
you fill in a key there, that provider works with **no key required** from
visitors — the key/dropdown UI stays visible so people can still switch
providers or use their own key, but Gemini (or whichever you fill in) just
works out of the box.

**⚠️ This key ships to every visitor's browser.** Static sites have no
hidden server, so anything in this file — "backend" constant or not — is
visible to anyone who opens dev tools or views page source. Before putting
a real key in `BUILT_IN_KEYS`:

1. **Restrict the key at the source.** In Google AI Studio / Google Cloud
   Console, open the key's settings and set an *Application restriction* of
   **HTTP referrers**, then add your `*.github.io` page's exact URL. This
   makes the key fail for anyone using it from outside your site, even if
   they copy it.
2. **Use only a free-tier key**, never a paid or high-limit one, for this
   pattern.
3. **Expect it to get scraped and abused eventually** if the site gets any
   real traffic — treat the free daily quota as a shared, disposable
   resource, not a guarantee of availability.
4. Leave `BUILT_IN_KEYS` blank (`""`) for any provider if you'd rather every
   visitor supply their own key — that's the safer default.

Provider-specific notes:
- **Gemini**: free tier, works well from the browser, no billing needed.
- **OpenAI**: paid, usage-based; standard browser CORS support.
- **Anthropic**: paid, usage-based; the app sends the
  `anthropic-dangerous-direct-browser-access` header to allow a direct
  browser call — same exposure risk applies if you ever hardcode this one.

Model names for all three providers are set as constants near the top of
the script (`MODEL_IDS`) — provider model names change fairly often, so if
a request starts failing with a "model not found" style error, that's the
first place to check and update.

## Disclaimer
Component picks, pricing, and code are AI-generated starting points.
Verify datasheets and pin-outs before ordering parts or powering anything on.
