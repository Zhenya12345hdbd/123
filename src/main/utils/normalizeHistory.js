export function normalizeHistoryMessage(m) {
  let imagePaths = null;

  if (m.image_paths) {
    try {
      imagePaths =
        typeof m.image_paths === 'string'
          ? JSON.parse(m.image_paths)
          : m.image_paths;
    } catch {
      imagePaths = null;
    }
  }

  if (!imagePaths && m.image_path) {
    imagePaths = [m.image_path];
  }

  let type = 'message';
  if (imagePaths && m.text) {
    type = 'image_batch_with_text';
  } else if (imagePaths) {
    type = 'image_batch';
  }

  return {
    id: m.id,
    type,
    text: m.text,
    image_paths: imagePaths,
    from: String(m.from_user_id),
    room_id: m.room_id,
    is_read: m.is_read,
    username: m.username,
    avatar_path: m.avatar_path,
    time: m.created_at,
  };
}

export function normalizeHistory(list) {
  return list.map(normalizeHistoryMessage);
}