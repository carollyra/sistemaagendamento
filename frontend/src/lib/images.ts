/**
 * Curated Unsplash photography used across the app.
 * Direct CDN URLs — no API key, no runtime requests to the Unsplash API.
 */
const UNSPLASH = 'https://images.unsplash.com/photo-';

interface PhotoOptions {
  width?: number;
  height?: number;
  quality?: number;
}

function photo(id: string, { width = 800, height, quality = 70 }: PhotoOptions = {}): string {
  const params = new URLSearchParams({
    auto: 'format',
    fit: 'crop',
    w: String(width),
    q: String(quality),
  });

  if (height) {
    params.set('h', String(height));
  }

  return `${UNSPLASH}${id}?${params.toString()}`;
}

const IDS = {
  shave: '1503951914875-452162b0f3f1',
  shop: '1585747860715-2ba37e788b70',
  fade: '1599351431202-1e0f0137899a',
  tools: '1621605815971-fbc98d665033',
  haircut: '1622286342621-4bd786c2447c',
  barberAtWork: '1567894340315-735d7c361db0',
  blowDry: '1605497788044-5a32c7078486',
  razor: '1517832606299-7ae9b720a186',
  styling: '1593702295094-aea22597af65',
  youngClient: '1622287162716-f311baa1a2b8',
  portrait: '1614289371518-722f2615943d',
} as const;

export const images = {
  hero: (options?: PhotoOptions) => photo(IDS.shave, { width: 1600, height: 1000, ...options }),
  shop: (options?: PhotoOptions) => photo(IDS.shop, { width: 1200, height: 900, ...options }),
  auth: (options?: PhotoOptions) =>
    photo(IDS.barberAtWork, { width: 1000, height: 1400, ...options }),
  tools: (options?: PhotoOptions) => photo(IDS.tools, { width: 900, height: 600, ...options }),
  portrait: (options?: PhotoOptions) =>
    photo(IDS.portrait, { width: 600, height: 800, ...options }),
  styling: (options?: PhotoOptions) => photo(IDS.styling, { width: 900, height: 600, ...options }),
};

/** Photos used when a service has no picture of its own, picked by name. */
const SERVICE_PHOTOS: { match: RegExp; id: string }[] = [
  { match: /(corte|cut).*(barba|beard)|combo|completo|\+/i, id: IDS.blowDry },
  { match: /barba|beard|shave/i, id: IDS.razor },
  { match: /infantil|kid|crian/i, id: IDS.youngClient },
  { match: /corte|cut|fade|degrad/i, id: IDS.haircut },
  { match: /colora|color|luzes/i, id: IDS.styling },
];

const FALLBACKS = [IDS.fade, IDS.barberAtWork, IDS.styling, IDS.shop, IDS.haircut];

/** Stable pick so the same service always shows the same photo. */
function hash(value: string): number {
  let total = 0;

  for (let index = 0; index < value.length; index += 1) {
    total = (total * 31 + value.charCodeAt(index)) % 100000;
  }

  return total;
}

export function serviceImage(name: string, options?: PhotoOptions): string {
  const matched = SERVICE_PHOTOS.find((entry) => entry.match.test(name));
  const id = matched?.id ?? FALLBACKS[hash(name) % FALLBACKS.length];

  return photo(id, { width: 600, height: 420, ...options });
}
