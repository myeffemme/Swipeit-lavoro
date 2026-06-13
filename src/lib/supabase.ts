import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.PUBLIC_SUPABASE_URL
const key = import.meta.env.PUBLIC_SUPABASE_KEY

if (!url || !key) {
  throw new Error('Mancano PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_KEY nel file .env')
}

// Chiave PUBBLICA (sb_publishable_…): rispetta la RLS. Niente service_role qui.
export const supabase = createClient(url, key, {
  auth: { persistSession: false },
})

export type StatoArticolo = 'DRAFT' | 'ACTIVE' | 'TRASH' | 'EXPIRED'

export type Fonte = {
  url?: string
  titolo?: string
  title?: string
}

export type Articolo = {
  id: number
  data_sessione: string
  argomento: string
  slug: string | null
  stato: StatoArticolo
  testo_markdown: string | null
  fonti: Fonte[] | null
  created_at: string
}

export const ARTICOLO_FIELDS =
  'id, data_sessione, argomento, slug, stato, testo_markdown, fonti, created_at'

// TEST: mostriamo anche le bozze per vedere subito i contenuti.
// PRIMA DEL LANCIO → restringere a ['ACTIVE'].
export const STATI_VISIBILI: StatoArticolo[] = ['DRAFT', 'ACTIVE']

// Slugify: minuscole, niente accenti, solo a-z0-9 separati da trattino.
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '')
}

// URL pubblico dell'articolo: "<id>-<titolo-slugificato>".
// Gli slug nel DB sono sporchi/troncati (°, :, parole tagliate) → li rigeneriamo
// qui dal titolo. TODO: sistemare la generazione slug a monte nel pipeline.
export function articoloSlug(a: Pick<Articolo, 'id' | 'argomento'>): string {
  const base = slugify(a.argomento)
  return base ? `${a.id}-${base}` : String(a.id)
}

export function dataItaliana(d: string): string {
  try {
    return new Date(d + 'T00:00:00').toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return d
  }
}
