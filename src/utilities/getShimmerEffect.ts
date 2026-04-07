import { canUseDOM } from "./canUseDOM";

const shimmer = (w: number | string, h: number | string) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      /* Base color: White / Very Light Grey */
      <stop stop-color="#f6f7f8" offset="20%" />
      /* Shimmer color: Light Grey */
      <stop stop-color="#edeef1" offset="50%" />
      /* Base color: White / Very Light Grey */
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  /* Background Rect */
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  /* Shimmer Rect */
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) => canUseDOM ? window.btoa(str) : Buffer.from(str).toString('base64')

export const getShimmerDataUrl = (
  w: number | string = 700,
  h: number | string = 475,
  color?: string
) => {
  const base = color || '#f6f7f8';
  const highlight = color ? `${color}99` : '#edeef1';

  // Width aur height ko string format me handle karne ke liye (e.g. '100%')
  return `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`
}