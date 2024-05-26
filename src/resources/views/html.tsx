import ENV from "@/misc/env";
import { rootPath, url } from "@/misc/utils";
import { html, raw } from "hono/html";
import { JSXNode } from "hono/jsx";

let manifest: {file: string}[] = []
let isServerDevRun = false

async function loadManifest() {
  const fileManifest = Bun.file(rootPath("/public/dist/.vite/manifest.json"))
  if (await fileManifest.exists()) {
      manifest = await fileManifest.json().then(data => Object.values<{file: string}>(data))
      return true
  }
  return false
}

if (ENV.IS_PROD) {
  await loadManifest()
} else {
  isServerDevRun = await fetch('http://localhost:5173').then(() => true).catch(() => false)
  if (!isServerDevRun) {
    const loaded = await loadManifest()
    if (!loaded) {
      console.error("Manifest file not found and vite dev server not running");
    }
  }
}

export default function buildRawHTML(content: JSXNode) {

    const rawHTML = html`<!DOCTYPE html>
    <html>
      <head>
        <title>Simple demo</title>
        ${manifest.length ? raw(manifest.map(file => `<link rel="stylesheet" href="${url(`/dist/${file.file}`)}">`).join('')) : ''}
      </head>
      <body>
        ${content}
        ${(ENV.IS_PROD || !isServerDevRun)
          ? null
          : raw(`
          <script type="module">
            import RefreshRuntime from 'http://localhost:5173/@react-refresh'
            RefreshRuntime.injectIntoGlobalHook(window)
            window.$RefreshReg$ = () => {}
            window.$RefreshSig$ = () => (type) => type
            window.__vite_plugin_react_preamble_installed__ = true
          </script>
          <script
                type="module"
                src="http://localhost:5173/@vite/client"
            ></script>
            <script
                type="module"
                src="http://localhost:5173/src/resources/views/client.tsx"
            ></script>`)}
      </body>
    </html>`
   
    return rawHTML
};
