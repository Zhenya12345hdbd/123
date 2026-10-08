export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/upload.php', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Ошибка загрузки файла');
  }

  return res.json(); // { path, type, mime, name, size }
}
