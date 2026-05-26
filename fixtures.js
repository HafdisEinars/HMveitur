window.HMVEITUR_SEED = (() => {
  const players = [
    {
      "id": "p-admin",
      "name": "Hafdís",
      "inviteCode": "HAFDIS-ADMIN",
      "isAdmin": true
    },
    {
      "id": "p-01",
      "name": "Leikmaður 1",
      "inviteCode": "HM-1001",
      "isAdmin": false
    },
    {
      "id": "p-02",
      "name": "Leikmaður 2",
      "inviteCode": "HM-1002",
      "isAdmin": false
    },
    {
      "id": "p-03",
      "name": "Leikmaður 3",
      "inviteCode": "HM-1003",
      "isAdmin": false
    }
  ];

  const fixtures = `
M01|2026-06-11T19:00:00Z|Riðill|A|Mexico|South Africa|Mexico City Stadium
M02|2026-06-12T02:00:00Z|Riðill|A|Korea Republic|Czechia|Estadio Guadalajara
M03|2026-06-12T19:00:00Z|Riðill|B|Canada|Bosnia and Herzegovina|Toronto Stadium
M04|2026-06-13T01:00:00Z|Riðill|D|USA|Paraguay|Los Angeles Stadium
M05|2026-06-14T01:00:00Z|Riðill|C|Haiti|Scotland|Boston Stadium
M06|2026-06-14T04:00:00Z|Riðill|D|Australia|Türkiye|BC Place Vancouver
M07|2026-06-13T22:00:00Z|Riðill|C|Brazil|Morocco|New York New Jersey Stadium
M08|2026-06-13T19:00:00Z|Riðill|B|Qatar|Switzerland|San Francisco Bay Area Stadium
M09|2026-06-14T23:00:00Z|Riðill|E|Côte d'Ivoire|Ecuador|Philadelphia Stadium
M10|2026-06-14T17:00:00Z|Riðill|E|Germany|Curaçao|Houston Stadium
M11|2026-06-14T20:00:00Z|Riðill|F|Netherlands|Japan|Dallas Stadium
M12|2026-06-15T02:00:00Z|Riðill|F|Sweden|Tunisia|Estadio Monterrey
M13|2026-06-15T22:00:00Z|Riðill|H|Saudi Arabia|Uruguay|Miami Stadium
M14|2026-06-15T16:00:00Z|Riðill|H|Spain|Cabo Verde|Atlanta Stadium
M15|2026-06-16T01:00:00Z|Riðill|G|IR Iran|New Zealand|Los Angeles Stadium
M16|2026-06-15T19:00:00Z|Riðill|G|Belgium|Egypt|Seattle Stadium
M17|2026-06-16T19:00:00Z|Riðill|I|France|Senegal|New York New Jersey Stadium
M18|2026-06-16T22:00:00Z|Riðill|I|Iraq|Norway|Boston Stadium
M19|2026-06-17T01:00:00Z|Riðill|J|Argentina|Algeria|Kansas City Stadium
M20|2026-06-17T04:00:00Z|Riðill|J|Austria|Jordan|San Francisco Bay Area Stadium
M21|2026-06-17T23:00:00Z|Riðill|L|Ghana|Panama|Toronto Stadium
M22|2026-06-17T20:00:00Z|Riðill|L|England|Croatia|Dallas Stadium
M23|2026-06-17T17:00:00Z|Riðill|K|Portugal|Congo DR|Houston Stadium
M24|2026-06-18T02:00:00Z|Riðill|K|Uzbekistan|Colombia|Mexico City Stadium
M25|2026-06-18T16:00:00Z|Riðill|A|Czechia|South Africa|Atlanta Stadium
M26|2026-06-18T19:00:00Z|Riðill|B|Switzerland|Bosnia and Herzegovina|Los Angeles Stadium
M27|2026-06-18T22:00:00Z|Riðill|B|Canada|Qatar|BC Place Vancouver
M28|2026-06-19T01:00:00Z|Riðill|A|Mexico|Korea Republic|Estadio Guadalajara
M29|2026-06-19T19:00:00Z|Riðill|D|USA|Australia|Seattle Stadium
M30|2026-06-19T22:00:00Z|Riðill|C|Scotland|Morocco|Boston Stadium
M31|2026-06-20T00:30:00Z|Riðill|C|Brazil|Haiti|Philadelphia Stadium
M32|2026-06-20T03:00:00Z|Riðill|D|Türkiye|Paraguay|San Francisco Bay Area Stadium
M33|2026-06-20T17:00:00Z|Riðill|F|Netherlands|Sweden|Houston Stadium
M34|2026-06-20T20:00:00Z|Riðill|E|Germany|Côte d'Ivoire|Toronto Stadium
M35|2026-06-21T00:00:00Z|Riðill|E|Ecuador|Curaçao|Kansas City Stadium
M36|2026-06-21T04:00:00Z|Riðill|F|Tunisia|Japan|Estadio Monterrey
M37|2026-06-21T16:00:00Z|Riðill|H|Spain|Saudi Arabia|Atlanta Stadium
M38|2026-06-21T19:00:00Z|Riðill|G|Belgium|IR Iran|Los Angeles Stadium
M39|2026-06-21T22:00:00Z|Riðill|H|Uruguay|Cabo Verde|Miami Stadium
M40|2026-06-22T01:00:00Z|Riðill|G|New Zealand|Egypt|BC Place Vancouver
M41|2026-06-22T17:00:00Z|Riðill|J|Argentina|Austria|Dallas Stadium
M42|2026-06-22T21:00:00Z|Riðill|I|France|Iraq|Philadelphia Stadium
M43|2026-06-23T00:00:00Z|Riðill|I|Norway|Senegal|New York New Jersey Stadium
M44|2026-06-23T03:00:00Z|Riðill|J|Jordan|Algeria|San Francisco Bay Area Stadium
M45|2026-06-23T17:00:00Z|Riðill|K|Portugal|Uzbekistan|Houston Stadium
M46|2026-06-23T20:00:00Z|Riðill|L|England|Ghana|Boston Stadium
M47|2026-06-23T23:00:00Z|Riðill|L|Panama|Croatia|Toronto Stadium
M48|2026-06-24T02:00:00Z|Riðill|K|Colombia|Congo DR|Estadio Guadalajara
M49|2026-06-24T19:00:00Z|Riðill|B|Switzerland|Canada|BC Place Vancouver
M50|2026-06-24T19:00:00Z|Riðill|B|Bosnia and Herzegovina|Qatar|Seattle Stadium
M51|2026-06-24T22:00:00Z|Riðill|C|Scotland|Brazil|Miami Stadium
M52|2026-06-24T22:00:00Z|Riðill|C|Morocco|Haiti|Atlanta Stadium
M53|2026-06-25T01:00:00Z|Riðill|A|Czechia|Mexico|Mexico City Stadium
M54|2026-06-25T01:00:00Z|Riðill|A|South Africa|Korea Republic|Estadio Monterrey
M55|2026-06-25T20:00:00Z|Riðill|E|Curaçao|Côte d'Ivoire|Philadelphia Stadium
M56|2026-06-25T20:00:00Z|Riðill|E|Ecuador|Germany|New York New Jersey Stadium
M57|2026-06-25T23:00:00Z|Riðill|F|Japan|Sweden|Dallas Stadium
M58|2026-06-25T23:00:00Z|Riðill|F|Tunisia|Netherlands|Kansas City Stadium
M59|2026-06-26T02:00:00Z|Riðill|D|Türkiye|USA|Los Angeles Stadium
M60|2026-06-26T02:00:00Z|Riðill|D|Paraguay|Australia|San Francisco Bay Area Stadium
M61|2026-06-26T19:00:00Z|Riðill|I|Norway|France|Boston Stadium
M62|2026-06-26T19:00:00Z|Riðill|I|Senegal|Iraq|Toronto Stadium
M63|2026-06-27T03:00:00Z|Riðill|G|Egypt|IR Iran|Seattle Stadium
M64|2026-06-27T03:00:00Z|Riðill|G|New Zealand|Belgium|BC Place Vancouver
M65|2026-06-27T00:00:00Z|Riðill|H|Cabo Verde|Saudi Arabia|Houston Stadium
M66|2026-06-27T00:00:00Z|Riðill|H|Uruguay|Spain|Estadio Guadalajara
M67|2026-06-27T21:00:00Z|Riðill|L|Panama|England|New York New Jersey Stadium
M68|2026-06-27T21:00:00Z|Riðill|L|Croatia|Ghana|Philadelphia Stadium
M69|2026-06-28T02:00:00Z|Riðill|J|Algeria|Austria|Kansas City Stadium
M70|2026-06-28T02:00:00Z|Riðill|J|Jordan|Argentina|Dallas Stadium
M71|2026-06-27T23:30:00Z|Riðill|K|Colombia|Portugal|Miami Stadium
M72|2026-06-27T23:30:00Z|Riðill|K|Congo DR|Uzbekistan|Atlanta Stadium
M73|2026-06-28T19:00:00Z|32-liða úrslit||Runner-up Group A|Runner-up Group B|Los Angeles Stadium
M74|2026-06-29T17:00:00Z|32-liða úrslit||Winner Group E|Third place A/B/C/D/F|Boston Stadium
M75|2026-06-29T20:30:00Z|32-liða úrslit||Winner Group F|Runner-up Group C|Estadio Monterrey
M76|2026-06-29T23:00:00Z|32-liða úrslit||Winner Group C|Runner-up Group F|Houston Stadium
M77|2026-06-30T19:00:00Z|32-liða úrslit||Winner Group I|Third place C/D/F/G/H|New York New Jersey Stadium
M78|2026-06-30T22:00:00Z|32-liða úrslit||Runner-up Group E|Runner-up Group I|Dallas Stadium
M79|2026-07-01T01:00:00Z|32-liða úrslit||Winner Group A|Third place C/E/F/H/I|Mexico City Stadium
M80|2026-07-01T19:00:00Z|32-liða úrslit||Winner Group L|Third place E/H/I/J/K|Atlanta Stadium
M81|2026-07-01T22:00:00Z|32-liða úrslit||Winner Group D|Third place B/E/F/I/J|San Francisco Bay Area Stadium
M82|2026-07-02T01:00:00Z|32-liða úrslit||Winner Group G|Third place A/E/H/I/J|Seattle Stadium
M83|2026-07-02T19:00:00Z|32-liða úrslit||Runner-up Group K|Runner-up Group L|Toronto Stadium
M84|2026-07-02T22:00:00Z|32-liða úrslit||Winner Group H|Runner-up Group J|Los Angeles Stadium
M85|2026-07-03T01:00:00Z|32-liða úrslit||Winner Group B|Third place E/F/G/I/J|BC Place Vancouver
M86|2026-07-03T19:00:00Z|32-liða úrslit||Winner Group J|Runner-up Group H|Miami Stadium
M87|2026-07-03T22:00:00Z|32-liða úrslit||Winner Group K|Third place D/E/I/J/L|Kansas City Stadium
M88|2026-07-04T01:00:00Z|32-liða úrslit||Runner-up Group D|Runner-up Group G|Dallas Stadium
M89|2026-07-04T19:00:00Z|16-liða úrslit||Winner Match 74|Winner Match 77|Philadelphia Stadium
M90|2026-07-04T22:00:00Z|16-liða úrslit||Winner Match 73|Winner Match 75|Houston Stadium
M91|2026-07-05T19:00:00Z|16-liða úrslit||Winner Match 76|Winner Match 78|New York New Jersey Stadium
M92|2026-07-05T22:00:00Z|16-liða úrslit||Winner Match 79|Winner Match 80|Mexico City Stadium
M93|2026-07-06T19:00:00Z|16-liða úrslit||Winner Match 83|Winner Match 84|Dallas Stadium
M94|2026-07-06T22:00:00Z|16-liða úrslit||Winner Match 81|Winner Match 82|Seattle Stadium
M95|2026-07-07T19:00:00Z|16-liða úrslit||Winner Match 86|Winner Match 88|Atlanta Stadium
M96|2026-07-07T22:00:00Z|16-liða úrslit||Winner Match 85|Winner Match 87|BC Place Vancouver
M97|2026-07-09T20:00:00Z|Fjórðungsúrslit||Winner Match 89|Winner Match 90|Boston Stadium
M98|2026-07-10T20:00:00Z|Fjórðungsúrslit||Winner Match 93|Winner Match 94|Los Angeles Stadium
M99|2026-07-11T19:00:00Z|Fjórðungsúrslit||Winner Match 91|Winner Match 92|Miami Stadium
M100|2026-07-11T22:00:00Z|Fjórðungsúrslit||Winner Match 95|Winner Match 96|Kansas City Stadium
M101|2026-07-14T20:00:00Z|Undanúrslit||Winner Match 97|Winner Match 98|Dallas Stadium
M102|2026-07-15T20:00:00Z|Undanúrslit||Winner Match 99|Winner Match 100|Atlanta Stadium
M103|2026-07-18T20:00:00Z|Bronsleikur||Runner-up Match 101|Runner-up Match 102|Miami Stadium
M104|2026-07-19T20:00:00Z|Úrslitaleikur||Winner Match 101|Winner Match 102|New York New Jersey Stadium
  `.trim();

  const matches = fixtures.split("\n").map((line) => {
    const [id, startsAt, stage, groupName, homeTeam, awayTeam, venue] = line.split("|");
    return { id, startsAt, stage, groupName, homeTeam, awayTeam, venue };
  });

  return { players, matches, predictions: [] };
})();
