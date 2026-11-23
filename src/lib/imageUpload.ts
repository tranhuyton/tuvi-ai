/**
 * Tiện ích chuẩn hóa & nén ảnh sinh trắc học (Diện Tướng & Chỉ Tay) phía client
 * - Hỗ trợ JPG, PNG, WebP và ảnh iPhone HEIC/HEIF (lazy-load heic-to)
 * - Nén về JPEG max 800px (~60KB-80KB) tối ưu tốc độ gửi AI Vision & lưu DB
 */

export function isHeicFile(file: File): boolean {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return (
    name.endsWith('.heic') ||
    name.endsWith('.heif') ||
    type === 'image/heic' ||
    type === 'image/heif' ||
    type === 'image/heic-sequence' ||
    type === 'image/heif-sequence'
  );
}

export function compressImageBlob(blob: Blob, maxWidth = 800, quality = 0.65): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let width = img.width;
      let height = img.height;
      if (width > maxWidth || height > maxWidth) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxWidth) / height);
          height = maxWidth;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context không khả dụng'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };
    img.src = objectUrl;
  });
}

export async function processBiometricImageFile(file: File): Promise<string> {
  const MAX_RAW_IMAGE_BYTES = 15 * 1024 * 1024;
  if (file.size > MAX_RAW_IMAGE_BYTES) {
    throw new Error('Ảnh vượt quá 15MB. Vui lòng chọn ảnh nhẹ hơn hoặc chụp màn hình rồi tải lên.');
  }

  let targetBlob: Blob = file;
  const isStandardWebImage = /^image\/(jpeg|jpg|png|webp|gif)$/i.test(file.type || '');
  let isHeicFormat = isHeicFile(file);

  if (!isHeicFormat && !isStandardWebImage) {
    try {
      const { isHeic } = await import('heic-to');
      isHeicFormat = await isHeic(file);
    } catch {
      isHeicFormat = false;
    }
  }

  if (isHeicFormat) {
    let decodedNatively = false;
    const testUrl = URL.createObjectURL(file);
    try {
      const testImg = new Image();
      await new Promise<void>((resolve, reject) => {
        testImg.onload = () => resolve();
        testImg.onerror = () => reject();
        testImg.src = testUrl;
      });
      decodedNatively = true;
    } catch {
      decodedNatively = false;
    } finally {
      URL.revokeObjectURL(testUrl);
    }

    if (!decodedNatively) {
      const { heicTo } = await import('heic-to');
      targetBlob = await heicTo({
        blob: file,
        type: 'image/jpeg',
        quality: 0.85,
      });
    }
  }

  return compressImageBlob(targetBlob, 800, 0.65);
}
