// Gera a foto de perfil otimizada a partir do original em alta resolução.
// Uso: node scripts/process-photo.mjs "<caminho da foto original>"
// O original nunca entra no repositório; só o WebP resultante.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const input = process.argv[2];
if (!input) {
  console.error('Uso: node scripts/process-photo.mjs "<foto.jpg>"');
  process.exit(1);
}

const output = "public/profile/rafael.webp";
const image = sharp(input).rotate();
const { width, height } = await image.metadata();

// Recorte 4:5 centrado na horizontal, pegando cabeça e peito (topo da foto).
const cropW = Math.round(width * 0.72);
const cropH = Math.round(cropW * 1.25);
const left = Math.round((width - cropW) / 2);
const top = Math.round(height * 0.04);

await mkdir("public/profile", { recursive: true });
const info = await image
  .extract({ left, top, width: cropW, height: Math.min(cropH, height - top) })
  .resize({ width: 960 })
  .webp({ quality: 80 })
  .toFile(output);

console.log(`${output}: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB`);
