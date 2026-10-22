<?php
session_start();

// Генерируем 5-символьный код (без похожих символов: 0/O, 1/l/I)
$chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
$code = '';
for ($i = 0; $i < 5; $i++) {
    $code .= $chars[random_int(0, strlen($chars) - 1)];
}

// Сохраняем в сессии (в нижнем регистре — для сравнения без учёта регистра)
$_SESSION['captcha_code'] = strtolower($code);
$_SESSION['captcha_time'] = time();   // для проверки «не старше 10 минут»

// Рисуем картинку
$width  = 160;
$height = 60;
$img = imagecreatetruecolor($width, $height);

// Фон
$bg = imagecolorallocate($img, 240, 240, 240);
imagefilledrectangle($img, 0, 0, $width, $height, $bg);

// Шум (линии)
for ($i = 0; $i < 8; $i++) {
    $c = imagecolorallocate($img, random_int(150, 220), random_int(150, 220), random_int(150, 220));
    imageline($img, random_int(0, $width), random_int(0, $height), random_int(0, $width), random_int(0, $height), $c);
}

// Шум (точки)
for ($i = 0; $i < 200; $i++) {
    $c = imagecolorallocate($img, random_int(150, 220), random_int(150, 220), random_int(150, 220));
    imagesetpixel($img, random_int(0, $width), random_int(0, $height), $c);
}

// Символы (каждый со своим цветом и наклоном)
$font = __DIR__ . '/arial.ttf';   // ← нужен TTF-шрифт, см. ниже
if (!file_exists($font)) {
    // fallback: встроенный шрифт (некрасиво, но работает)
    $color = imagecolorallocate($img, 30, 30, 30);
    imagestring($img, 5, 50, 20, $code, $color);
} else {
    for ($i = 0; $i < 5; $i++) {
        $c = imagecolorallocate($img, random_int(20, 80), random_int(20, 80), random_int(20, 80));
        $angle = random_int(-20, 20);
        $x = 15 + $i * 28;
        $y = 42 + random_int(-5, 5);
        imagettftext($img, 22, $angle, $x, $y, $c, $font, $code[$i]);
    }
}

// Отдаём как PNG, без кэша
header('Content-Type: image/png');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
imagepng($img);
imagedestroy($img);