# InnoAtlas

An interactive map platform for exploring innovation projects across Austria and the surrounding region. Projects are displayed on a filterable Leaflet map with a searchable card list and a detailed side panel. The app supports German and English.

## Tech stack

- React 19 + TypeScript, built with Vite
- Leaflet / react-leaflet for the map
- Tailwind CSS for styling
- XLSX library for reading the project data from Excel at runtime

## Development

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build → /dist
npm run preview   # preview the production build locally
npm run lint      # run ESLint
```

---

## Adding or editing projects

Projects are stored in a single Excel file:

```
src/data/InnoAtlasExampleDataSet.xlsx
```

The app fetches and parses this file at runtime — no build step is needed after editing it. Just save the file and reload the browser.

### Sheets

The workbook has two sheets, one per language:

| Sheet | Language |
|-------|----------|
| `ger` | German   |
| `eng` | English  |

Edit the appropriate sheet (or both) for each project.

### Column reference

Each row is one project. The columns are:

**Required — the row is silently skipped if any of these are missing:**

| Column | Description |
|--------|-------------|
| `ID` | Unique numeric ID |
| `ProjectTitle` | Project name |
| `LocationCity` | City name shown in the detail panel |
| `LocationLatitude` | Decimal latitude (e.g. `47.4103`) |
| `LocationLongitude` | Decimal longitude (e.g. `9.7440`) |
| `ProjectWebsite` | Full URL (e.g. `https://example.com`) |
| `PartnerLeadName` | Lead organisation name |
| `PartnerLeadLink` | Lead organisation URL |
| `FilterCountry` | Country or countries (comma-separated) |
| `FilterTopic` | Topic(s) — see valid values below |
| `FilterIndustry` | Industry/industries — see valid values below |
| `FilterStatus` | Status — see valid values below |

**Optional:**

| Column | Description |
|--------|-------------|
| `ProjectSubtitle` | Short tagline shown on the project card |
| `ProjectDescription` | Main descriptive text |
| `ProjectObjective` | Project objectives |
| `ProjectResults` | Results or outcomes |
| `ContactPersonName` | Contact person's name |
| `ContactPersonOrganisation` | Contact person's organisation |
| `ContactPersonEmail` | Contact email |
| `ContactPersonPhone` | Contact phone number |
| `ProjectDurationStart` | Start date (free text, e.g. `2022`) |
| `ProjectDurationEnd` | End date |
| `ProjectDurationTime` | Total duration (e.g. `36 Monate`) |
| `Partner1Name` … `Partner5Name` | Up to 5 additional partner names |
| `Partner1Link` … `Partner5Link` | Corresponding partner URLs |
| `FilterLab` | Lab affiliation(s), comma-separated |
| `ImageLink` | Full URL to a project image |
| `ImageCredits` | Image attribution text |

### Valid filter values

These values must match exactly (they drive the filter chips and map pin colours):

| Filter | Valid values |
|--------|-------------|
| `FilterTopic` | `Wirtschaft`, `Umwelt`, `Soziales`, `Sonstiges` |
| `FilterIndustry` | `Bildung`, `Logistik`, `Öffentlicher Verkehr` |
| `FilterStatus` | `Abgeschlossen`, `Laufend`, `Geplant` |

Multiple values are supported in any filter column — separate them with commas (e.g. `Wirtschaft, Umwelt`).

The **first** value in `FilterTopic` determines the colour of the project's map pin.

### Data cleaning rules

- Cells left **blank** or containing the word `MISSING` (any casing) are treated as empty.
- Trailing `#` characters are stripped automatically.
- Whitespace is trimmed from all values.

### Step-by-step: adding a new project

1. Open `src/data/InnoAtlasExampleDataSet.xlsx`.
2. Go to the `ger` sheet (and `eng` if you have an English version).
3. Add a new row at the bottom. Give it a unique `ID` (continue the existing numbering).
4. Fill in all required columns. Leave optional columns blank if you don't have the data.
5. For filter columns, use the exact values from the table above.
6. Save the file.
7. Reload the app in your browser — the new project will appear on the map immediately.

### Step-by-step: editing an existing project

1. Open the Excel file and find the row with the matching `ID`.
2. Edit the relevant cells.
3. Save and reload the browser.
