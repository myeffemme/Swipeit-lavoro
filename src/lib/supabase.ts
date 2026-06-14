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

// Le 4 organizzazioni della sezione /onu. `slug` = segmento URL (/onu/<slug>).
export const ORGS = [
  { slug: 'fao', ente: 'FAO', full: 'Food and Agriculture Organization' },
  { slug: 'wfp', ente: 'WFP', full: 'World Food Programme' },
  { slug: 'ifad', ente: 'IFAD', full: 'International Fund for Agricultural Development' },
  { slug: 'bioversity', ente: 'Bioversity-CIAT', full: 'Alliance Bioversity International – CIAT' },
] as const

export type OrgSlug = (typeof ORGS)[number]['slug']

export function orgBySlug(slug: string) {
  return ORGS.find((o) => o.slug === slug) ?? null
}

// Categoria di posizione secondo il sistema ONU (G/P), normalizzata sulle 4 org.
// FAO/IFAD/Bioversity hanno campi (categoria/tipo_contratto); WFP no -> si deduce dal
// titolo (ruolo + codice di grado G#/P#/NO#/SC#). Ordine di precedenza nel match conta.
export type TipoPosizione = 'professional' | 'general' | 'consulenze' | 'tirocini'

export const GRUPPI_POSIZIONE: { key: TipoPosizione; label: string; nota: string }[] = [
  { key: 'professional', label: 'Professional (P)', nota: 'Profili internazionali: tecnici, specialisti, manager.' },
  { key: 'general', label: 'General Service (G)', nota: 'Supporto, amministrazione, ruoli reclutati localmente.' },
  { key: 'consulenze', label: 'Consulenze e contratti a progetto', nota: 'Consulenti, PSA/SSA, contratti non-staff.' },
  { key: 'tirocini', label: 'Tirocini e volontariato', nota: 'Internship, fellowship, programmi volontari.' },
]

export function tipoPosizione(v: Vacancy): TipoPosizione {
  const tit = (v.titolo ?? '').toLowerCase()
  const blob = `${v.categoria ?? ''} ${v.tipo_contratto ?? ''} ${v.titolo ?? ''}`.toLowerCase()

  // 1) Tirocini e volontariato
  if (/intern|tiroc|volunt|volontari|fellow|práctica|practica|estudiante|pasant|trainee|apprentice/.test(blob))
    return 'tirocini'
  // 2) Consulenze / non-staff (modalità contrattuale esplicita)
  if (/consultant|consultor|consulen|\bcst\b|\bpsa\b|\bssa\b|ssa-?\d|\bnpp\b|personal services|call for interest|non-staff|contractor/.test(blob))
    return 'consulenze'
  // 3) General Service: grado G#/GS#, dicitura "general service", o ruoli di supporto
  if (/\bg-?[1-7]\b|\bgs-?[1-7]\b|general service/.test(blob) ||
      /\b(assistant|assistant\(e\)|asistente|auxiliar|clerk|secretary|secretaria|driver|chauffeur|storekeeper|guard|receptionist|cleaner|cook)\b/.test(tit))
    return 'general'
  // 4) Professional (default): officer, specialist, coordinator, manager, JPO, P#, NO#, NPO…
  return 'professional'
}

// Bioversity-CIAT NON è un'agenzia ONU (niente gradi G/P): si raggruppa per traccia
// funzionale, usando la `categoria` nativa (Research/Administration/Agriculture) +
// parole chiave nel titolo.
export type TracciaBio = 'ricerca' | 'agricoltura' | 'operazioni' | 'tirocini'

export const GRUPPI_BIO: { key: TracciaBio; label: string; nota: string }[] = [
  { key: 'ricerca', label: 'Ricerca e scienza', nota: 'Conservazione, ecologia, scienza dei dati, ambiente.' },
  { key: 'agricoltura', label: 'Agricoltura e sistemi alimentari', nota: 'Agronomia, biodiversità agricola, filiere sostenibili.' },
  { key: 'operazioni', label: 'Amministrazione e operazioni', nota: 'Finanza, procurement, logistica, gestione progetti.' },
  { key: 'tirocini', label: 'Tirocini e volontariato', nota: 'Internship e programmi di pratica.' },
]

export function tracciaBio(v: Vacancy): TracciaBio {
  const blob = `${v.categoria ?? ''} ${v.titolo ?? ''}`.toLowerCase()
  if (/intern|práctica|practica|estudiante|pasant|trainee|fellow/.test(blob)) return 'tirocini'
  if (/admin|financ|finance|procurement|compras|logist|operation|operac|business|human resource|\bhr\b|account|gestion/.test(blob))
    return 'operazioni'
  if (/agricultur|agronom|\bcrop|food system|\bseed|\bsoil|livestock|value chain|nutrition|biodivers/.test(blob))
    return 'agricoltura'
  return 'ricerca'
}

// API unica per la pagina /onu/[org]: gruppi ordinati + classificatore giusto per org.
// FAO/WFP/IFAD = sistema ONU (P/G/consulenze/tirocini); Bioversity = tracce funzionali.
export function schemaGruppi(slug: OrgSlug): {
  gruppi: { key: string; label: string; nota: string }[]
  classifica: (v: Vacancy) => string
} {
  if (slug === 'bioversity') return { gruppi: GRUPPI_BIO, classifica: tracciaBio }
  return { gruppi: GRUPPI_POSIZIONE, classifica: tipoPosizione }
}

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
