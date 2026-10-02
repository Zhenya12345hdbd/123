export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/upload_image.php', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Ошибка загрузки файла');

  const data = await res.json();
  return data.path || null;
}