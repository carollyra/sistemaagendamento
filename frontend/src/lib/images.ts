/**
 * Curated Unsplash photography — direct CDN URLs, no API key.
 *
 * The selection follows one brief: dark, high contrast, detail driven (tools,
 * chair, hands at work) and no faces in the foreground. Every `<img>` carries
 * the `photo` class so the whole set shares a single colour treatment.
 */
const UNSPLASH = 'https://images.unsplash.com/photo-';

interface PhotoOptions {
  width?: number;
  height?: number;
  quality?: number;
}

function photo(id: string, { width = 800, height, quality = 72 }: PhotoOptions = {}): string {
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
  /** Leather barber chair, close and dark. */
  chair: '1512690459411-b9245aed614b',
  /** Clippers working the nape — hands only. */
  clippers: '1493256338651-d82f7acb2b38',
  /** Straight razor along a beard, monochrome. */
  razor: '1517832606299-7ae9b720a186',
  /** Comb and fingers on the back of the head. */
  comb: '1622286342621-4bd786c2447c',
  /** Scissors, clippers and pomade on a slate board. */
  tools: '1621605815971-fbc98d665033',
  /** Shop interior: brick, mirrors, warm bulbs. */
  shop: '1585747860715-2ba37e788b70',
  /** Tight fade detail. */
  fade: '1599351431202-1e0f0137899a',
  /** Barber at the chair, seen from behind. */
  chairSide: '1622287162716-f311baa1a2b8',
} as const;

export const images = {
  hero: (options?: PhotoOptions) => photo(IDS.chair, { width: 1600, height: 1100, ...options }),
  shop: (options?: PhotoOptions) => photo(IDS.shop, { width: 1400, height: 900, ...options }),
  auth: (options?: PhotoOptions) => photo(IDS.clippers, { width: 1100, height: 1500, ...options }),
  tools: (options?: PhotoOptions) => photo(IDS.tools, { width: 1000, height: 640, ...options }),
  texture: (options?: PhotoOptions) => photo(IDS.fade, { width: 900, height: 600, ...options }),
  band: (options?: PhotoOptions) => photo(IDS.tools, { width: 1600, height: 420, ...options }),
};

const SERVICE_PHOTOS: { match: RegExp; id: string }[] = [
  { match: /(corte|cut).*(barba|beard)|combo|completo|\+/i, id: IDS.comb },
  { match: /barba|beard|shave/i, id: IDS.razor },
  { match: /infantil|kid|crian/i, id: IDS.chairSide },
  { match: /corte|cut|fade|degrad/i, id: IDS.clippers },
  { match: /colora|color|luzes|trat/i, id: IDS.tools },
];

const FALLBACKS = [IDS.fade, IDS.chair, IDS.tools, IDS.shop];

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
