# Athometis UI

**Athometis UI** è il tema React/Next di Metis web agency:  
una raccolta di **atoms, molecules, sections** e un **PageWrapper** per costruire pagine in modo dichiarativo a partire da una configurazione (es. JSON).

> ⚠️ Stato attuale:
> - pensato per progetti **Next.js 16 + React 19 + Tailwind CSS v4**
> - pronto per essere usato come **local package** con `pnpm`  
> - in futuro potrà essere pubblicato su npm e integrato con un CMS (Strapi, Payload, ecc.)

# Build for next
nvm use 22 
rm -rf .next deploy
pnpm run build

mkdir -p deploy

# trova il server.js generato da Next (standalone)
STANDALONE_DIR="$(dirname "$(find .next/standalone -type f -name server.js | head -n 1)")"

# Copia lo standalone (server.js + package.json + node_modules minimi)
rsync -a --delete "$STANDALONE_DIR/" deploy/

# Copia static
mkdir -p deploy/.next
rsync -a --delete .next/static/ deploy/.next/static/

# Copia public
rsync -a --delete public/ deploy/public/

# Copia content (routing)
rsync -a --delete content/ deploy/content/

# Pulizia macOS
find deploy -name ".DS_Store" -o -name "._*" -delete

test -f deploy/server.js || echo "Manca deploy/server.js"
test -d deploy/node_modules/next || echo "Manca deploy/node_modules/next"
test -d deploy/.next/static || echo "Manca deploy/.next/static"

# Crea tgz (root piatta: server.js in cima)
export COPYFILE_DISABLE=1
tar -czf deploy.tgz -C deploy .


## Installazione (uso come pacchetto locale con pnpm)

### 1. Aggiungi il pacchetto a un altro progetto Next

Nel progetto consumer:

```bash
pnpm add ../percorso/a/athometis-ui


