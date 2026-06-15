// ---------------------------------------------------------------------------
// ARTICOLI DEMO — contenuti FINTI per la fase di costruzione del sito.
// Servono solo a vedere la struttura popolata (News, LongForm, tessere, tag).
// Vengono usati SOLO in `npm run dev` (import.meta.env.DEV) e SOLO se il DB non
// restituisce articoli pubblicati: in build di produzione non compaiono mai.
// Quando i 3 articoli reali passano ad ACTIVE, questi spariscono da soli.
// ---------------------------------------------------------------------------
import type { Articolo } from './supabase'

export const DEMO_ARTICOLI: Articolo[] = [
  {
    id: 9001,
    data_sessione: '2026-06-14',
    argomento: 'Detassazione 2026: cosa cambia davvero in busta paga da luglio',
    slug: null,
    stato: 'ACTIVE',
    created_at: '2026-06-14T06:00:00Z',
    rubrica: 'articolo',
    fonti: [
      { titolo: 'Agenzia delle Entrate — circolare detassazione', url: 'https://www.agenziaentrate.gov.it' },
      { titolo: 'INPS — premi di produttività', url: 'https://www.inps.it' },
    ],
    testo_markdown: `Da luglio scatta la nuova **detassazione** su premi di produttività e lavoro notturno. Per chi guadagna fino a 35.000 euro l'aliquota agevolata sui premi scende dal 10% al 5%: su un premio di 1.500 euro significa circa **75 euro netti in più**.

## Chi ne beneficia

La misura riguarda i lavoratori dipendenti del settore privato con un premio legato a obiettivi misurabili (produttività, qualità, efficienza) previsto dalla contrattazione di secondo livello.

- Tetto del premio agevolabile: 3.000 euro l'anno.
- Aliquota sostitutiva: 5% (era 10%).
- Esclusi i redditi sopra i 35.000 euro nell'anno precedente.

## Cosa controllare

Verifica in busta paga la voce «premio di risultato»: l'agevolazione si applica solo se l'accordo aziendale è depositato presso l'Ispettorato del Lavoro. Senza deposito, niente aliquota ridotta.`,
  },
  {
    id: 9002,
    data_sessione: '2026-06-13',
    argomento: 'Concorsi PA 2026: il grande ritorno delle assunzioni pubbliche, settore per settore',
    slug: null,
    stato: 'ACTIVE',
    created_at: '2026-06-13T06:00:00Z',
    rubrica: 'longform',
    fonti: [
      { titolo: 'inPA — Portale unico del reclutamento', url: 'https://www.inpa.gov.it' },
      { titolo: 'Ministero della PA — piano assunzioni', url: 'https://www.funzionepubblica.gov.it' },
      { titolo: 'ISTAT — occupazione settore pubblico', url: 'https://www.istat.it' },
    ],
    testo_markdown: `Il 2026 si conferma l'anno della ripartenza per il **reclutamento pubblico**. Sul portale inPA sono aperti oltre 1.600 bandi, dopo un decennio di blocco del turnover che ha lasciato la pubblica amministrazione italiana tra le più anziane d'Europa: l'età media dei dipendenti statali supera i 50 anni.

## Una macchina che riparte da numeri pesanti

Il vuoto generazionale non è un'astrazione. Negli ultimi quindici anni il blocco delle assunzioni ha eroso le competenze interne, soprattutto quelle digitali e tecniche, proprio mentre il PNRR chiedeva agli enti di gestire miliardi di investimenti in tempi stretti. Il risultato è un paradosso: risorse disponibili, ma mancanza di personale capace di spenderle.

Il piano assunzioni prova a invertire la rotta su tre direttrici principali, ciascuna con logiche e requisiti molto diversi.

## Sanità: la voragine più urgente

Il comparto sanitario assorbe la quota maggiore di bandi. Servono medici, infermieri e personale delle professioni sanitarie, con concorsi banditi soprattutto a livello regionale dalle aziende ospedaliere e dalle ASL. Qui la difficoltà non è il numero di posti, ma la **scarsità di candidati**: in molte specializzazioni le graduatorie restano semivuote, e gli enti faticano a coprire le sedi periferiche.

## Enti locali: tecnici e amministrativi

Comuni, province e regioni cercano soprattutto **istruttori e funzionari tecnici** — ingegneri, geometri, informatici — oltre al classico profilo amministrativo-contabile. È il segmento dove il mismatch è più visibile: i Comuni del Nord faticano a trattenere i vincitori, che spesso usano il posto come trampolino verso enti più grandi o verso il privato.

## Scuola e ricerca: i numeri grandi

Il comparto istruzione muove le platee più ampie, con procedure per docenti e personale ATA che coinvolgono centinaia di migliaia di candidati. Accanto, cresce il reclutamento di ricercatori e tecnologi negli enti pubblici di ricerca e nelle università, alimentato anche dai fondi del Piano Nazionale.

## Il nodo dei salari pubblici

C'è un convitato di pietra in ogni concorso che fatica a coprirsi: lo stipendio. Le retribuzioni d'ingresso nella pubblica amministrazione sono ferme a parametri vecchi, erosi da anni di inflazione e di contratti rinnovati in ritardo. Per un funzionario tecnico neoassunto, la busta paga pubblica è spesso più bassa di quella che lo stesso profilo otterrebbe in un'azienda privata di medie dimensioni.

Il risultato si vede nelle graduatorie: in alcuni concorsi per profili informatici o ingegneristici, i vincitori rinunciano alla nomina prima ancora di firmare, perché nel frattempo hanno trovato di meglio. È il paradosso di uno Stato che bandisce posti ma non riesce a trattenerli.

## Riserve, quote e mobilità

Una parte crescente dei posti non è realmente aperta a tutti. Le **riserve** per chi ha già prestato servizio nella PA, le quote per le categorie protette e i meccanismi di mobilità interna riducono lo spazio per i candidati esterni. Non è un male in sé — servono a stabilizzare precari storici — ma vanno letti con attenzione: un bando da cento posti può averne molti meno effettivamente contendibili dall'esterno.

Per questo la prima regola, prima ancora di studiare, è leggere bene la struttura del bando: quanti posti, quante riserve, quali requisiti di accesso.

## Come orientarsi tra i bandi

Tre regole pratiche per non perdersi:

1. **Imposta gli alert su inPA** filtrando per regione e profilo: i bandi hanno scadenze brevi, spesso 30 giorni.
2. **Leggi i requisiti prima del titolo**: molti concorsi richiedono abilitazioni o esperienze specifiche che escludono a monte.
3. **Tieni d'occhio la riserva**: una quota crescente di posti è riservata a chi ha già maturato servizio nella PA.

## Cosa aspettarsi nei prossimi mesi

Il calendario dei concorsi resta fitto, trainato dalle scadenze del Piano Nazionale e dal bisogno di sostituire le ondate di pensionamenti. Ma la quantità, da sola, non basta. La vera partita si gioca sulla capacità di rendere il lavoro pubblico di nuovo attraente: stipendi d'ingresso dignitosi, percorsi di carriera chiari, formazione vera dopo l'assunzione.

La sfida, in altre parole, non è bandire i concorsi: è **riempirli e trattenere chi li vince**. In un mercato del lavoro in cui il privato compete sui salari e sulla flessibilità, lo Stato deve ancora dimostrare di saper attrarre — e tenere — i profili che cerca.`,
  },
  {
    id: 9003,
    data_sessione: '2026-06-11',
    argomento: 'Assegno unico, gli importi aggiornati di giugno: chi prende di più',
    slug: null,
    stato: 'ACTIVE',
    created_at: '2026-06-11T06:00:00Z',
    rubrica: 'articolo',
    fonti: [{ titolo: 'INPS — assegno unico universale', url: 'https://www.inps.it' }],
    testo_markdown: `L'INPS ha aggiornato gli importi dell'**assegno unico universale** con la rivalutazione legata all'inflazione. La cifra dipende dall'ISEE: si va da un minimo per i redditi più alti a oltre 200 euro a figlio per le famiglie con ISEE basso.

## Le maggiorazioni

Oltre all'importo base, restano attive le maggiorazioni per:

- Figli disabili (a prescindere dall'età).
- Famiglie numerose, dal terzo figlio in poi.
- Madri under 21 e nuclei con entrambi i genitori lavoratori.

## Cosa fare adesso

Chi ha già la domanda attiva non deve rifare nulla: l'importo si aggiorna in automatico. Va però **rinnovato l'ISEE 2026** entro fine mese, altrimenti l'assegno scende all'importo minimo indipendentemente dal reddito reale.`,
  },
  {
    id: 9004,
    data_sessione: '2026-06-09',
    argomento: 'PNRR e lavoro: il mismatch tra competenze e posti che frena la ripresa',
    slug: null,
    stato: 'ACTIVE',
    created_at: '2026-06-09T06:00:00Z',
    rubrica: 'longform',
    fonti: [
      { titolo: 'Unioncamere — sistema informativo Excelsior', url: 'https://www.unioncamere.gov.it' },
      { titolo: 'CNEL — rapporto mercato del lavoro', url: 'https://www.cnel.it' },
      { titolo: 'Ministero del Lavoro — fabbisogni formativi', url: 'https://www.lavoro.gov.it' },
    ],
    testo_markdown: `C'è un dato che, più di ogni altro, racconta la fatica del mercato del lavoro italiano nel 2026: quasi **un'assunzione su due** è considerata di difficile reperimento dalle imprese. Non per mancanza di domanda, ma perché i candidati con le competenze richieste semplicemente non si trovano. È il **mismatch**, il disallineamento tra ciò che le aziende cercano e ciò che il sistema formativo produce.

## Un problema di numeri, non solo di parole

Le rilevazioni sui fabbisogni delle imprese fotografano una forbice che si allarga. Da un lato i settori che assumono — manifattura avanzata, costruzioni sostenibili, informatica, sanità — chiedono profili tecnici specifici. Dall'altro, l'offerta di lavoro resta concentrata su qualifiche generaliste o su titoli di studio non allineati alla domanda.

Il paradosso è doppio: l'Italia ha ancora una disoccupazione giovanile alta, e contemporaneamente centinaia di migliaia di posti che restano scoperti. Le due cose convivono perché parlano lingue diverse.

## Dove il PNRR doveva incidere

Il Piano Nazionale di Ripresa e Resilienza ha messo sul tavolo risorse importanti per la **formazione** e le competenze digitali. L'idea era semplice: usare i fondi europei per riqualificare i lavoratori e colmare il divario. Tre i pilastri principali:

1. **Reskilling e upskilling** dei lavoratori adulti, per accompagnare le transizioni dei settori in crisi verso quelli in crescita.
2. **Competenze digitali** diffuse, dalla pubblica amministrazione alle piccole imprese.
3. **Istruzione tecnica superiore** (gli ITS), il segmento più vicino alla domanda delle aziende.

Sulla carta, la strategia è coerente. Nella pratica, l'attuazione sconta tempi lunghi e una frammentazione tra enti che rende difficile misurare i risultati.

## Il nodo degli ITS

Gli istituti tecnologici superiori sono spesso citati come la risposta più efficace: percorsi brevi, in stretto contatto con le imprese del territorio, con tassi di occupazione a un anno superiori all'80%. Il problema è la scala: gli iscritti restano poche decine di migliaia, contro i numeri ben più ampi dei paesi che su questo modello hanno costruito la loro manifattura.

Aumentare i posti negli ITS è una delle leve più discusse, ma richiede docenti, laboratori e un rapporto con le aziende che non si improvvisa.

## Il confronto con l'Europa

Guardare ai paesi vicini aiuta a misurare il ritardo. In Germania e in Austria il sistema duale — scuola e impresa che formano insieme, fin dall'adolescenza — alimenta un flusso costante di tecnici qualificati. Non è un modello esportabile tale e quale, perché affonda le radici in una cultura industriale diversa, ma indica una direzione: la formazione funziona quando è incardinata nel territorio produttivo, non quando cala dall'alto.

L'Italia ha gli ingredienti — distretti, piccole e medie imprese, un tessuto manifatturiero ancora vivo — ma fatica a tenerli insieme. Gli ITS sono l'esperimento più vicino a quel modello, e i numeri lo confermano; manca però la scala per spostare davvero gli equilibri del mercato del lavoro.

## Le politiche attive che non decollano

C'è poi un secondo fronte, più trascurato: le **politiche attive del lavoro**, cioè i servizi che dovrebbero accompagnare chi cerca un'occupazione verso i posti disponibili. Centri per l'impiego sotto organico, banche dati che non dialogano tra loro, scarso raccordo con le imprese: il sistema che dovrebbe far incontrare domanda e offerta è da anni il punto debole.

Senza una rete capace di orientare, formare e ricollocare, anche i fondi meglio spesi rischiano di disperdersi. La formazione produce competenze; le politiche attive le mettono in contatto con i posti. Se manca il secondo pezzo, il primo resta un investimento a metà.

## Cosa serve perché funzioni

Gli osservatori concordano su alcuni punti:

- **Orientamento precoce**, già nella scuola secondaria, per ridurre le scelte fatte alla cieca.
- **Dati condivisi** sui fabbisogni reali delle imprese, aggiornati e accessibili.
- **Formazione continua** finanziata, perché le competenze invecchiano in fretta.
- **Servizi per l'impiego** rafforzati, capaci di accompagnare davvero le transizioni.

Il rischio, altrimenti, è di spendere i fondi senza spostare l'ago: corsi che si fanno perché vanno fatti, scollegati dai posti che le aziende offrono davvero. Il mismatch non si chiude con i bandi, ma con la capacità di mettere in dialogo scuola, imprese e politiche del lavoro. Una capacità che, per ora, resta la vera incognita della ripresa.`,
  },
  {
    id: 9005,
    data_sessione: '2026-06-05',
    argomento: 'Rinnovi CCNL: a che punto sono i contratti scaduti e quanti lavoratori riguardano',
    slug: null,
    stato: 'ACTIVE',
    created_at: '2026-06-05T06:00:00Z',
    rubrica: 'articolo',
    fonti: [
      { titolo: 'CNEL — archivio contratti collettivi', url: 'https://www.cnel.it' },
      { titolo: 'CGIL CISL UIL — piattaforme di rinnovo', url: 'https://www.cgil.it' },
    ],
    testo_markdown: `Milioni di lavoratori italiani attendono il **rinnovo del contratto collettivo**. Molti CCNL sono scaduti da anni, e nel frattempo l'inflazione ha eroso il potere d'acquisto delle buste paga. Il tema è tornato centrale nel confronto tra sindacati e imprese.

## I comparti più indietro

Tra i contratti scaduti pesano alcuni settori ad alta intensità di manodopera:

- Commercio e terziario.
- Logistica e trasporti.
- Servizi e pulizie.

In questi comparti il ritardo nel rinnovo si traduce in salari fermi a parametri di diversi anni fa.

## Il nodo salari–inflazione

La trattativa ruota attorno a una domanda: di quanto vanno adeguati i minimi tabellari per recuperare l'inflazione accumulata? I sindacati chiedono aumenti che proteggano il potere d'acquisto; le imprese frenano sui costi, soprattutto nei settori a margini ridotti.

La posta in gioco non è solo economica: un sistema in cui i contratti restano scaduti a lungo svuota di fatto la **contrattazione collettiva**, lasciando i salari in balìa dell'inflazione.`,
  },
  {
    id: 9006,
    data_sessione: '2026-06-12',
    argomento: 'La settimana corta avanza in Europa: cosa dicono i primi bilanci',
    slug: null,
    stato: 'ACTIVE',
    created_at: '2026-06-12T06:00:00Z',
    rubrica: 'dalmondo',
    fonti: [
      { titolo: 'The Economist — “The four-day week, revisited”', url: 'https://www.economist.com' },
    ],
    testo_markdown: `*Sintesi e traduzione da un articolo di **The Economist**. I dati e le opinioni sono della testata originale; la traduzione è redazionale.*

La **settimana lavorativa di quattro giorni** non è più solo un esperimento di nicchia. Dopo le sperimentazioni nel Regno Unito e in alcuni paesi del Nord Europa, i primi bilanci pluriennali iniziano a offrire numeri solidi, e il quadro è più sfumato di quanto raccontino sia gli entusiasti sia gli scettici.

## Cosa dicono i dati

Nelle aziende che hanno mantenuto la riduzione d'orario senza tagliare i salari, la produttività è rimasta stabile o leggermente cresciuta. I benefici più netti riguardano benessere dei dipendenti e turnover: meno dimissioni, meno giorni di malattia.

Ma il modello non si adatta a tutti i settori allo stesso modo. Funziona meglio nei lavori a obiettivi, dove conta il risultato più delle ore; molto meno dove il servizio richiede presenza continua, come sanità e commercio.

## Il nodo italiano

In Italia il dibattito resta più timido. Il costo del lavoro e la frammentazione del tessuto produttivo — fatto di piccole imprese — rendono difficile generalizzare. Eppure alcune aziende hanno avviato sperimentazioni volontarie, spesso legate a obiettivi di produttività.

La lezione dei primi bilanci, scrive la testata, è che la settimana corta non è una bacchetta magica: è uno strumento che premia chi sa misurare il lavoro per risultati, non per timbrature.`,
  },
  {
    id: 9007,
    data_sessione: '2026-06-08',
    argomento: 'Lo Statuto dei lavoratori del 1970: come nacque la legge che cambiò il lavoro in Italia',
    slug: null,
    stato: 'ACTIVE',
    created_at: '2026-06-08T06:00:00Z',
    rubrica: 'storia',
    fonti: [
      { titolo: 'Legge 20 maggio 1970, n. 300', url: 'https://www.normattiva.it' },
    ],
    testo_markdown: `Il 20 maggio 1970 il Parlamento approvò la **Legge 300**, passata alla storia come **Statuto dei lavoratori**. Per la prima volta i diritti costituzionali entravano davvero dentro i cancelli della fabbrica.

## Il contesto

Erano gli anni dell'**autunno caldo**: scioperi, occupazioni, un movimento operaio al massimo della forza contrattuale. Le condizioni in molte fabbriche erano dure, e il potere del datore di lavoro quasi assoluto.

Lo Statuto, ispirato dal giurista e ministro Giacomo Brodolini e scritto in larga parte da Gino Giugni, nacque per riequilibrare quel rapporto.

## Cosa introdusse

- Libertà sindacale e diritto di assemblea sul luogo di lavoro.
- Limiti ai controlli del datore sui dipendenti.
- L'**articolo 18**: la tutela contro i licenziamenti senza giusta causa, per decenni il cuore politico della norma.

## Perché conta ancora

Molti equilibri sono stati poi rivisti — l'articolo 18 è stato profondamente modificato dalle riforme degli anni 2010. Ma lo Statuto resta il momento in cui il lavoro, in Italia, smise di essere solo una merce e diventò un terreno di diritti. Capire come nacque aiuta a leggere ogni dibattito di oggi sul lavoro.`,
  },
  {
    id: 9008,
    data_sessione: '2026-06-10',
    argomento: 'AI generativa e lavoro: cosa cambia davvero per chi inizia oggi',
    slug: null,
    stato: 'ACTIVE',
    created_at: '2026-06-10T06:00:00Z',
    rubrica: 'trend',
    fonti: [
      { titolo: 'OCSE — Employment Outlook, capitolo su AI', url: 'https://www.oecd.org' },
    ],
    testo_markdown: `L'**intelligenza artificiale generativa** è passata in pochi anni da curiosità tecnologica a strumento quotidiano in molti mestieri. La domanda non è più *se* cambierà il lavoro, ma *come* — e soprattutto *per chi*.

## Non sostituisce i mestieri, ne sposta i compiti

Le analisi più recenti convergono su un punto: l'AI raramente cancella un lavoro intero. Automatizza **compiti** — bozze, sintesi, prime versioni di codice — lasciando alle persone revisione, giudizio e relazione.

Il risultato è una ridefinizione silenziosa dei ruoli. Chi entra oggi nel mondo del lavoro si trova ad avere strumenti potentissimi, ma anche un'asticella più alta: il valore si sposta su ciò che la macchina non sa fare.

## I giovani e i nuovi modi di lavorare

Per le nuove generazioni il cambiamento si intreccia con altre dinamiche: più mobilità tra i lavori, meno fedeltà alla singola azienda, una ricerca di senso e flessibilità che le imprese faticano a intercettare.

L'AI accelera tutto questo. Sa chi la usa bene parte avvantaggiato; chi la ignora rischia di restare indietro. La vera competenza, oggi, non è "saper usare l'AI" ma **sapere cosa chiederle e come verificarla**.

## La posta in gioco

Il rischio è un mercato del lavoro a due velocità: chi padroneggia gli strumenti e chi li subisce. Ridurre questa forbice — con formazione accessibile e diffusa — è la sfida delle politiche del lavoro dei prossimi anni.`,
  },
]
