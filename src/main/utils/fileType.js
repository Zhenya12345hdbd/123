export function getFileType(file) {
  const ext = file.name.toLowerCase().split('.').pop();
  const videoExts = ['mp4', 'mov', 'webm', 'avi', 'mkv'];
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'];

  if (videoExts.includes(ext)) return 'video';
  if (imageExts.includes(ext)) return 'image';
  return 'other';
}
