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

// ---------------------------------------------------------------------------
// BANDI PA — concorsi della Pubblica Amministrazione italiana (sezione /pa)
// Fonte: inPA. Distinta dai concorsi UE/EPSO (sezione futura e separata).
// ---------------------------------------------------------------------------
export type Bando = {
  id: number
  titolo: string
  ente: string
  posti: number | null
  codice_concorso: string | null
  link: string
  data_scadenza: string | null
  data_pubblicazione: string | null
  sedi: string[] | null
  figura: string | null
  stato: StatoArticolo
}

export const BANDO_FIELDS =
  'id, titolo, ente, posti, codice_concorso, link, data_scadenza, ' +
  'data_pubblicazione, sedi, figura, stato'

// Regioni italiane + "Nazionale". `slug` = segmento URL (/pa/<slug>); `match` =
// le stringhe (lowercase) che possono comparire nel campo `sedi` di inPA
// (incluse le varianti con/senza trattino). Le sedi a livello di provincia/città
// (es. "Milano", "Vicenza") restano nel record ma non guidano il raggruppamento:
// quasi tutti i bandi (1694/1695) portano già il tag della regione.
export const REGIONI = [
  { slug: 'lombardia', nome: 'Lombardia', match: ['lombardia'] },
  { slug: 'veneto', nome: 'Veneto', match: ['veneto'] },
  { slug: 'emilia-romagna', nome: 'Emilia-Romagna', match: ['emilia romagna', 'emilia-romagna'] },
  { slug: 'piemonte', nome: 'Piemonte', match: ['piemonte'] },
  { slug: 'toscana', nome: 'Toscana', match: ['toscana'] },
  { slug: 'lazio', nome: 'Lazio', match: ['lazio'] },
  { slug: 'campania', nome: 'Campania', match: ['campania'] },
  { slug: 'marche', nome: 'Marche', match: ['marche'] },
  { slug: 'calabria', nome: 'Calabria', match: ['calabria'] },
  { slug: 'friuli-venezia-giulia', nome: 'Friuli-Venezia Giulia', match: ['friuli venezia giulia', 'friuli-venezia giulia'] },
  { slug: 'sicilia', nome: 'Sicilia', match: ['sicilia'] },
  { slug: 'sardegna', nome: 'Sardegna', match: ['sardegna'] },
  { slug: 'liguria', nome: 'Liguria', match: ['liguria'] },
  { slug: 'puglia', nome: 'Puglia', match: ['puglia'] },
  { slug: 'abruzzo', nome: 'Abruzzo', match: ['abruzzo'] },
  { slug: 'umbria', nome: 'Umbria', match: ['umbria'] },
  { slug: 'basilicata', nome: 'Basilicata', match: ['basilicata'] },
  { slug: 'molise', nome: 'Molise', match: ['molise'] },
  { slug: 'trentino-alto-adige', nome: 'Trentino-Alto Adige', match: ['trentino alto adige', 'trentino-alto adige', 'trentino', 'alto adige', 'bolzano', 'trento'] },
  { slug: 'valle-aosta', nome: "Valle d'Aosta", match: ["valle d'aosta", 'valle daosta', 'aosta'] },
  { slug: 'nazionale', nome: 'Nazionale', match: ['nazionale'] },
] as const

export type RegioneSlug = (typeof REGIONI)[number]['slug']

export function regioneBySlug(slug: string) {
  return REGIONI.find((r) => r.slug === slug) ?? null
}

// Set di tutti i nomi-regione (lowercase) per riconoscere quali voci di `sedi`
// sono regioni e quali sono province/città.
const NOMI_REGIONE = new Set(REGIONI.flatMap((r) => r.match))

// Slug delle regioni in cui ricade un bando (può essere più di una).
export function regioniDiBando(b: Pick<Bando, 'sedi'>): string[] {
  const out = new Set<string>()
  for (const s of b.sedi ?? []) {
    const low = String(s).trim().toLowerCase()
    for (const r of REGIONI) if (r.match.includes(low)) out.add(r.slug)
  }
  return [...out]
}

// Sedi a livello di provincia/città (tutto ciò che in `sedi` non è una regione).
export function sediProvinciali(b: Pick<Bando, 'sedi'>): string {
  return (b.sedi ?? [])
    .filter((s) => !NOMI_REGIONE.has(String(s).trim().toLowerCase()))
    .join(' · ')
}

// Famiglie di profilo professionale, ricavate dal campo `figura` (testo libero
// disordinato) + il titolo. L'ordine dei controlli è una PRECEDENZA: il primo
// che matcha vince (es. "dirigente medico" → Sanità, non Dirigenza).
export type Profilo =
  | 'scuola' | 'sanita' | 'polizia' | 'tecnico'
  | 'ricerca' | 'amministrativo' | 'dirigenza' | 'altro'

export const PROFILI: { key: Profilo; label: string; nota: string }[] = [
  { key: 'scuola', label: 'Scuola e istruzione', nota: 'Docenti, insegnanti, dirigenti scolastici, personale ATA.' },
  { key: 'sanita', label: 'Sanità', nota: 'Medici, infermieri, professioni sanitarie, dirigenti di struttura.' },
  { key: 'ricerca', label: 'Ricerca e università', nota: 'Ricercatori, tecnologi, assegnisti, docenza universitaria.' },
  { key: 'polizia', label: 'Polizia locale e vigilanza', nota: 'Agenti e istruttori di polizia locale, vigilanza.' },
  { key: 'tecnico', label: 'Tecnici e ingegneria', nota: 'Istruttori e funzionari tecnici, ingegneri, geometri, informatici.' },
  { key: 'amministrativo', label: 'Amministrativi e contabili', nota: 'Istruttori e funzionari amministrativi, contabili, segreteria.' },
  { key: 'dirigenza', label: 'Dirigenza e direzione', nota: 'Dirigenti e direttori di area, settore o struttura.' },
  { key: 'altro', label: 'Altri profili', nota: 'Posizioni che non rientrano nelle categorie precedenti.' },
]

export function profiloBando(b: Pick<Bando, 'figura' | 'titolo'>): Profilo {
  const blob = `${b.figura ?? ''} ${b.titolo ?? ''}`.toLowerCase()
  if (/docent|insegnant|dirigente scolastic|scolastic|maestr|\bata\b|educator|scuola dell|istituto comprensiv/.test(blob))
    return 'scuola'
  if (/infermier|\bmedic|sanitar|\boss\b|operatore socio|ostetric|fisioterap|farmacist|\bbiolog|psicolog|veterinari|assistente sociale|struttura complessa|tecnico di laboratorio|radiolog|dietist|logopedist/.test(blob))
    return 'sanita'
  if (/ricercator|tecnolog|assegnist|professore|dottorat|collaboratore di ricerca|borsa di ricerca|\brtd\b|\brtt\b/.test(blob))
    return 'ricerca'
  if (/polizia local|agente di polizia|vigilanz|\bvigile|comandante.*polizia/.test(blob))
    return 'polizia'
  if (/tecnic|ingegner|geometr|architett|perito|informatic|sistemist|programmator|\bgis\b|cartograf|ambient/.test(blob))
    return 'tecnico'
  if (/amministrativ|contabil|ragionier|segretari|economic|finanziar|\bappalt|procurement|gestion/.test(blob))
    return 'amministrativo'
  if (/dirigent|direttore|comandante/.test(blob))
    return 'dirigenza'
  return 'altro'
}

// Carica TUTTI i bandi ACTIVE (paginando: Supabase tronca a 1000 righe/query).
export async function fetchBandiAttivi(): Promise<Bando[]> {
  const out: Bando[] = []
  const step = 1000
  for (let from = 0; ; from += step) {
    const { data, error } = await supabase
      .from('bandi_pa')
      .select(BANDO_FIELDS)
      .in('stato', STATI_VISIBILI)
      .range(from, from + step - 1)
    if (error) throw error
    const batch = (data ?? []) as Bando[]
    out.push(...batch)
    if (batch.length < step) break
  }
  return out
}
