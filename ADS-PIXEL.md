# Google Ads — Naqli lead tracking

Account: `905-794-0891` (EbookVerse)
Tag: `AW-17638857709`
GA4: `G-X2T792QM0E`

## Conversion

| Name | ID | Category | Label | send_to |
|---|---|---|---|---|
| Naqli Lead Form Submit | `7719575470` | SUBMIT_LEAD_FORM | `wvDvCK6__eAcEO237tpB` | `AW-17638857709/wvDvCK6__eAcEO237tpB` |

Fires on: `https://naqlisa.netlify.app/thank-you` after form submit (once per lead id).

## Site env

```bash
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-17638857709
NEXT_PUBLIC_GA_ID=G-X2T792QM0E
NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL=wvDvCK6__eAcEO237tpB
```

Default hardcoded in `components/GoogleAdsPixel.tsx` so Netlify works without env vars.
