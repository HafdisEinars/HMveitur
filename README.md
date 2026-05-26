# HMveitur

Spáleikur fyrir HM 2026 með boðskóðum, stigatöflu og sýnilegum spám allra leikmanna.

## Hvernig þetta virkar

- `index.html`, `styles.css`, `fixtures.js` og `app.js` keyra beint á GitHub Pages.
- Án `config.js` fer síðan í demo-ham og vistar spár bara í sama vafra.
- Með Supabase tengingu vistast spár miðlægt og allir sjá sömu stöðu.
- Boðskóði er notaður í stað innskráningar með lykilorði.
- Admin-kóði getur skráð úrslit og uppfært stigatöfluna.

## Stig

- 5 stig fyrir nákvæm úrslit.
- 3 stig fyrir rétt merki, sigur/jafntefli/tap.
- 1 stig fyrir rétta markatölu annars liðs.

## Demo-kóðar

- `HAFDIS-ADMIN`
- `HM-1001`
- `HM-1002`
- `HM-1003`

## Supabase uppsetning

1. Búðu til nýtt Supabase project.
2. Opnaðu SQL Editor í Supabase.
3. Keyrðu innihaldið úr `supabase-schema.sql`.
4. Afritaðu `config.example.js` yfir í `config.js`.
5. Settu Supabase Project URL og anon public key í `config.js`.
6. Breyttu leikmönnum og boðskóðum í Supabase töflunni `players`.

`config.js` er client-side skrá, þannig að anon lykillinn er eðlilega sýnilegur. Öryggið hér byggir á Supabase föllunum sem bera saman boðskóða áður en spár eða úrslit vistast.

## GitHub Pages

Í repo-inu: Settings -> Pages -> Deploy from branch -> veldu `main` og `/root`.

Þegar Supabase er klárt þarf bara að setja `config.js` með réttum gildum inn á repo-ið.
