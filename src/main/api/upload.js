/* export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  // user_id больше не передаём — сервер берёт из сессии
  const res = await fetch('/upload.php', { method: 'POST', body: formData });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || 'Ошибка загрузки');
  return data;
} */

  import { API } from "../../config";
  import { USE_MOCK } from "../../config";
import { request } from "./request";

export async function uploadImage(file) {
  if (USE_MOCK) {
    // в моке файл реально не грузим
    return request(API.upload);
  }

  const formData = new FormData();
  formData.append('file', file);
  return request(API.upload, { method: 'POST', body: formData });
}
