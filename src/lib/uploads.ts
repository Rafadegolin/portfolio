// Validação dos arquivos enviados pelo /admin antes de gravar no repositório.

export type Upload = {
  /** Caminho dentro de public/, ex.: "projects/pronix-hub-1.webp" */
  path: string;
  /** Conteúdo em base64 (sem o prefixo data:) */
  base64: string;
};

/** Uploads só podem cair em public/projects, public/profile ou public/cv. */
export const UPLOAD_PATH = /^(projects|profile|cv)\/[a-z0-9][a-z0-9_-]*\.(webp|png|jpe?g|pdf)$/;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_UPLOADS = 10;

/** Erro com mensagem segura para mostrar no admin. */
export class UserFacingError extends Error {}

/** Confere a assinatura binária do arquivo contra a extensão declarada. */
function matchesExtension(bytes: Buffer, ext: string): boolean {
  const ascii = (start: number, end: number) => bytes.subarray(start, end).toString("latin1");
  switch (ext) {
    case "webp":
      return ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP";
    case "png":
      return bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    case "jpg":
    case "jpeg":
      return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    case "pdf":
      return ascii(0, 5) === "%PDF-";
    default:
      return false;
  }
}

export function validateUploads(uploads: Upload[]): void {
  if (uploads.length > MAX_UPLOADS) throw new UserFacingError(`Máximo de ${MAX_UPLOADS} arquivos por publicação.`);
  for (const upload of uploads) {
    if (typeof upload?.path !== "string" || typeof upload?.base64 !== "string" || !UPLOAD_PATH.test(upload.path)) {
      throw new UserFacingError("Caminho de upload inválido.");
    }
    const bytes = Buffer.from(upload.base64, "base64");
    if (bytes.length === 0 || bytes.length > MAX_UPLOAD_BYTES) {
      throw new UserFacingError(`${upload.path}: arquivo vazio ou maior que 5 MB.`);
    }
    const ext = upload.path.split(".").pop()!.toLowerCase();
    if (!matchesExtension(bytes, ext)) {
      throw new UserFacingError(`${upload.path}: o conteúdo não é um .${ext} válido.`);
    }
  }
}
