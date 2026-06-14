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

// PRODUZIONE: solo articoli pubblicati. Le bozze (DRAFT) restano private,
// bloccate anche dalla policy RLS `public read articoli` su Supabase.
export const STATI_VISIBILI: StatoArticolo[] = ['ACTIVE']

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

// ---------------------------------------------------------------------------
// VACANCY — offerte di lavoro delle organizzazioni internazionali (sezione /onu)
// ---------------------------------------------------------------------------
export type Vacancy = {
  id: number
  ente: string
  sistema: string | null
  titolo: string
  categoria: string | null
  tipo_contratto: string | null
  sedi: string[] | null
  home_based: boolean
  valida_italia: boolean
  data_pubblicazione: string | null
  data_scadenza_raw: string | null
  scadenza: string | null
  url: string
  fonte_url: string | null
  stato: StatoArticolo
}

export const VACANCY_FIELDS =
  'id, ente, sistema, titolo, categoria, tipo_contratto, sedi, home_based, ' +
  'valida_italia, data_pubblicazione, data_scadenza_raw, scadenza, url, fonte_url, stato'

// Giorni mancanti alla scadenza (negativo = passata, null = nessuna scadenza).
export function giorniAllaScadenza(scadenza: string | null): number | null {
  if (!scadenza) return null
  const oggi = new Date()
  oggi.setHours(0, 0, 0, 0)
  const fine = new Date(scadenza + 'T00:00:00')
  return Math.round((fine.getTime() - oggi.getTime()) / 86_400_000)
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
