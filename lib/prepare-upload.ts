// Runs in the browser before an upload. Phones deliver HEIC photos, huge 48 MP shots and
// .mov videos; this turns every photo into a JPEG of at most 2560 px (which also drops the
// GPS location stored in the photo) and gives videos a type the server accepts.
export const MAX_SIDE = 2560;
export const VIDEO_TYPES: Record<string, string> = {mp4: 'video/mp4', m4v: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm'};
const PHOTO_EXT = /\.(jpe?g|png|webp|heic|heif|avif|gif|bmp|tiff?)$/i;
const PASS_THROUGH = ['image/jpeg', 'image/png', 'image/webp'];

const ext = (name: string) => (name.split('.').pop() || '').toLowerCase();

export function videoType(file: File) {
  if (Object.values(VIDEO_TYPES).includes(file.type)) return file.type;
  return VIDEO_TYPES[ext(file.name)] || '';
}

export const isPhoto = (file: File) => file.type.startsWith('image/') || PHOTO_EXT.test(file.name);

function load(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('unreadable')); };
    img.src = url;
  });
}

async function toJpeg(file: File) {
  const img = await load(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx || !canvas.width || !canvas.height) throw new Error('unreadable');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/jpeg', 0.86));
  if (!blob) throw new Error('unreadable');
  return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', {type: 'image/jpeg'});
}

/** Returns a file the server accepts, or throws an error with a message for the user. */
export async function prepareUpload(file: File): Promise<File> {
  if (isPhoto(file)) {
    try {
      return await toJpeg(file);
    } catch {
      if (PASS_THROUGH.includes(file.type)) return file;
      throw new Error(`"${file.name}" kan niet gelezen worden. Kies een JPG- of PNG-foto.`);
    }
  }
  const type = videoType(file);
  if (!type) throw new Error(`"${file.name}" is geen foto of video. Kies een foto, of een MP4-, MOV- of WebM-video.`);
  return type === file.type ? file : new File([file], file.name, {type});
}
