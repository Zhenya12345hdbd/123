-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Хост: MySQL-8.0:3306
-- Время создания: Ноя 13 2026 г., 19:42
-- Версия сервера: 8.0.45
-- Версия PHP: 8.2.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `chat_db`
--

-- --------------------------------------------------------

--
-- Структура таблицы `friend_requests`
--

CREATE TABLE `friend_requests` (
  `id` int NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `friend_requests`
--

INSERT INTO `friend_requests` (`id`, `sender_id`, `receiver_id`, `status`, `created_at`) VALUES
(1, 11, 1, 'pending', '2026-11-06 10:52:38'),
(11, 1, 11, 'accepted', '2026-11-12 09:16:36'),
(19, 2, 11, 'accepted', '2026-11-06 13:07:14'),
(20, 1, 2, 'accepted', '2026-11-13 12:21:01');

-- --------------------------------------------------------

--
-- Структура таблицы `messages`
--

CREATE TABLE `messages` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `to_user_id` int UNSIGNED NOT NULL,
  `room_id` int UNSIGNED NOT NULL,
  `text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `image_paths` json DEFAULT NULL,
  `file_paths` json DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `forwarded_from_id` int DEFAULT NULL,
  `forwarded_time` datetime DEFAULT NULL,
  `forwarded_first_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `forwarded_last_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `messages`
--

INSERT INTO `messages` (`id`, `user_id`, `to_user_id`, `room_id`, `text`, `image_paths`, `file_paths`, `is_read`, `created_at`, `forwarded_from_id`, `forwarded_time`, `forwarded_first_name`, `forwarded_last_name`) VALUES
(1, 1, 11, 1, NULL, NULL, '[{\"mime\": \"image/png\", \"name\": \"Снимок экрана 2026-03-05 144918.png\", \"path\": \"/uploads/images/a16f4140558cc0df.png\", \"size\": 17433, \"type\": \"images\", \"safe_name\": \"a16f4140558cc0df.png\"}]', 1, '2026-10-08 19:20:09', NULL, NULL, NULL, NULL),
(2, 1, 11, 1, NULL, NULL, '[{\"mime\": \"video/mp4\", \"name\": \"sample-5s-720p.mp4\", \"path\": \"/uploads/videos/0fff7c3dafd3c57d.mp4\", \"size\": 2572910, \"type\": \"videos\", \"safe_name\": \"0fff7c3dafd3c57d.mp4\"}]', 1, '2026-10-08 19:24:38', NULL, NULL, NULL, NULL),
(3, 1, 11, 1, NULL, NULL, '[{\"mime\": \"video/mp4\", \"name\": \"sample-5s-720p.mp4\", \"path\": \"/uploads/videos/b3c66cefbaf7fa07.mp4\", \"size\": 2572910, \"type\": \"videos\", \"safe_name\": \"b3c66cefbaf7fa07.mp4\"}, {\"mime\": \"video/mp4\", \"name\": \"sample-10s.mp4\", \"path\": \"/uploads/videos/b9dc918bf9918b9c.mp4\", \"size\": 5485935, \"type\": \"videos\", \"safe_name\": \"b9dc918bf9918b9c.mp4\"}, {\"mime\": \"video/mp4\", \"name\": \"sample-5s.mp4\", \"path\": \"/uploads/videos/c57368fad7718509.mp4\", \"size\": 2848208, \"type\": \"videos\", \"safe_name\": \"c57368fad7718509.mp4\"}, {\"mime\": \"video/mp4\", \"name\": \"sample-5s-360p.mp4\", \"path\": \"/uploads/videos/1b056d07147139ed.mp4\", \"size\": 1137884, \"type\": \"videos\", \"safe_name\": \"1b056d07147139ed.mp4\"}]', 1, '2026-10-08 19:25:13', NULL, NULL, NULL, NULL),
(4, 1, 11, 1, NULL, NULL, '[{\"mime\": \"image/png\", \"name\": \"f3748da234cc9fa8cf9cc27444ae40ceb090ed0e.png\", \"path\": \"/uploads/images/ac2b68ed26885f1f.png\", \"size\": 5352164, \"type\": \"images\", \"safe_name\": \"ac2b68ed26885f1f.png\"}]', 1, '2026-10-08 19:27:55', NULL, NULL, NULL, NULL),
(5, 1, 11, 1, 'iohuig', NULL, NULL, 1, '2026-10-08 19:31:19', NULL, NULL, NULL, NULL),
(6, 1, 11, 1, NULL, NULL, '[{\"mime\": \"video/mp4\", \"name\": \"sample-10s.mp4\", \"path\": \"/uploads/videos/abdeb0f19017679d.mp4\", \"size\": 5485935, \"type\": \"videos\", \"safe_name\": \"abdeb0f19017679d.mp4\"}]', 1, '2026-10-08 19:56:05', NULL, NULL, NULL, NULL),
(7, 1, 11, 1, NULL, NULL, '[{\"mime\": \"video/mp4\", \"name\": \"sample-5s.mp4\", \"path\": \"/uploads/videos/e03997ece58ee6f6.mp4\", \"size\": 2848208, \"type\": \"videos\", \"safe_name\": \"e03997ece58ee6f6.mp4\"}]', 1, '2026-10-08 20:01:25', NULL, NULL, NULL, NULL),
(8, 1, 11, 1, NULL, NULL, '[{\"mime\": \"video/mp4\", \"name\": \"sample-5s.mp4\", \"path\": \"/uploads/videos/ccad6a22dc576609.mp4\", \"size\": 2848208, \"type\": \"videos\", \"safe_name\": \"ccad6a22dc576609.mp4\"}]', 1, '2026-10-08 20:02:23', NULL, NULL, NULL, NULL),
(9, 1, 11, 1, NULL, NULL, '[{\"mime\": \"video/mp4\", \"name\": \"sample-10s.mp4\", \"path\": \"/uploads/videos/ddf80af7030b4f34.mp4\", \"size\": 5485935, \"type\": \"videos\", \"safe_name\": \"ddf80af7030b4f34.mp4\"}]', 1, '2026-10-08 20:09:39', NULL, NULL, NULL, NULL),
(10, 1, 11, 1, NULL, NULL, '[{\"mime\": \"image/png\", \"name\": \"Shape sp-347-0-3.png\", \"path\": \"/uploads/images/a01934319961abdc.png\", \"size\": 149, \"type\": \"images\", \"safe_name\": \"a01934319961abdc.png\"}]', 1, '2026-10-08 20:09:54', NULL, NULL, NULL, NULL),
(11, 1, 11, 1, NULL, NULL, '[{\"mime\": \"application/x-empty\", \"name\": \"Текстовый документ (2).txt\", \"path\": \"/uploads/files/56bea1f93d14d4b3.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"56bea1f93d14d4b3.txt\"}]', 1, '2026-10-09 10:26:28', NULL, NULL, NULL, NULL),
(12, 1, 11, 1, NULL, '[{\"mime\": \"application/x-empty\", \"name\": \"Текстовый документ.txt\", \"path\": \"/uploads/files/5ab49bd902655943.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"5ab49bd902655943.txt\"}]', NULL, 1, '2026-10-09 14:25:56', NULL, NULL, NULL, NULL),
(13, 1, 11, 1, NULL, NULL, '[{\"mime\": \"application/x-empty\", \"name\": \"Текстовый документ (2).txt\", \"path\": \"/uploads/files/d18979fae0440dc2.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"d18979fae0440dc2.txt\"}]', 1, '2026-10-09 16:31:08', NULL, NULL, NULL, NULL),
(14, 1, 11, 1, NULL, NULL, '[{\"mime\": \"image/png\", \"name\": \"2026-10-05_14-55-16.png\", \"path\": \"/uploads/images/9338bfebbc1aff34.png\", \"size\": 441576, \"type\": \"images\", \"safe_name\": \"9338bfebbc1aff34.png\"}]', 1, '2026-10-09 16:43:24', NULL, NULL, NULL, NULL),
(15, 1, 11, 1, NULL, NULL, '[{\"mime\": \"image/png\", \"name\": \"Combined shape 352.png\", \"path\": \"/uploads/images/3d4f8c912ca00f6b.png\", \"size\": 331, \"type\": \"images\", \"safe_name\": \"3d4f8c912ca00f6b.png\"}, {\"mime\": \"image/png\", \"name\": \"Shape sp-352-0-1.png\", \"path\": \"/uploads/images/541151795262d16c.png\", \"size\": 149, \"type\": \"images\", \"safe_name\": \"541151795262d16c.png\"}, {\"mime\": \"image/png\", \"name\": \"Combined shape 363.png\", \"path\": \"/uploads/images/a69c7d1b009e7302.png\", \"size\": 302, \"type\": \"images\", \"safe_name\": \"a69c7d1b009e7302.png\"}, {\"mime\": \"image/png\", \"name\": \"Combined shape 364.png\", \"path\": \"/uploads/images/4ad27e0855b2019b.png\", \"size\": 323, \"type\": \"images\", \"safe_name\": \"4ad27e0855b2019b.png\"}]', 1, '2026-10-09 16:43:51', NULL, NULL, NULL, NULL),
(16, 1, 11, 1, NULL, NULL, '[{\"mime\": \"video/mp4\", \"name\": \"sample-5s.mp4\", \"path\": \"/uploads/videos/07f0ac464e4323fb.mp4\", \"size\": 2848208, \"type\": \"videos\", \"safe_name\": \"07f0ac464e4323fb.mp4\"}]', 1, '2026-10-09 16:44:08', NULL, NULL, NULL, NULL),
(17, 1, 2, 2, 'fff', NULL, NULL, 1, '2026-10-12 09:24:44', NULL, NULL, NULL, NULL),
(18, 1, 11, 1, NULL, NULL, '[{\"mime\": \"image/jpeg\", \"name\": \"a588f7c6788ac938b6df16e189eafb8f86b1d7da.jpg\", \"path\": \"/uploads/images/d8b82082cd9cab74.jpg\", \"size\": 525943, \"type\": \"images\", \"safe_name\": \"d8b82082cd9cab74.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"052de9b4a6388170ece6637bb07fd64cef6f4132.jpg\", \"path\": \"/uploads/images/3eb5e3ce25e49a11.jpg\", \"size\": 944274, \"type\": \"images\", \"safe_name\": \"3eb5e3ce25e49a11.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"5c80b82f358723e64d3838468561163c417ba50e.jpg\", \"path\": \"/uploads/images/1945fd956ef29c31.jpg\", \"size\": 3016315, \"type\": \"images\", \"safe_name\": \"1945fd956ef29c31.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"7c8fe6b5fdc4a29a652e2868b284bdfd36763913.jpg\", \"path\": \"/uploads/images/72bb55b002ff163d.jpg\", \"size\": 736404, \"type\": \"images\", \"safe_name\": \"72bb55b002ff163d.jpg\"}]', 1, '2026-10-12 09:31:26', NULL, NULL, NULL, NULL),
(19, 1, 11, 1, NULL, NULL, '[{\"mime\": \"image/jpeg\", \"name\": \"2f5ad843170ce4e03b8ed505a05a7f37ffed8384 (1).jpg\", \"path\": \"/uploads/images/e27820215934bd85.jpg\", \"size\": 809120, \"type\": \"images\", \"safe_name\": \"e27820215934bd85.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"345d346c58fd89f80a234db24accb8e61797ec0d.jpg\", \"path\": \"/uploads/images/3a9751ef8fd05af3.jpg\", \"size\": 799649, \"type\": \"images\", \"safe_name\": \"3a9751ef8fd05af3.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"263575249b4579082764e6bac3e8dc81c339328b.jpg\", \"path\": \"/uploads/images/fb224fb25544ccc5.jpg\", \"size\": 1759050, \"type\": \"images\", \"safe_name\": \"fb224fb25544ccc5.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"2c9fca96d91dca2f05a953260c50a29efb366482.jpg\", \"path\": \"/uploads/images/2227f67c0f1a9ee3.jpg\", \"size\": 711594, \"type\": \"images\", \"safe_name\": \"2227f67c0f1a9ee3.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"377c89c3cd4308c690d8508267cf30c75bc0270a.jpg\", \"path\": \"/uploads/images/fbb879d0681465f1.jpg\", \"size\": 670526, \"type\": \"images\", \"safe_name\": \"fbb879d0681465f1.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"2f5ad843170ce4e03b8ed505a05a7f37ffed8384.jpg\", \"path\": \"/uploads/images/c300d3ec32e223a2.jpg\", \"size\": 809120, \"type\": \"images\", \"safe_name\": \"c300d3ec32e223a2.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"a588f7c6788ac938b6df16e189eafb8f86b1d7da.jpg\", \"path\": \"/uploads/images/b6ac29c3d6e4bb88.jpg\", \"size\": 525943, \"type\": \"images\", \"safe_name\": \"b6ac29c3d6e4bb88.jpg\"}]', 1, '2026-10-12 09:32:11', NULL, NULL, NULL, NULL),
(20, 1, 11, 1, NULL, NULL, '[{\"mime\": \"application/x-empty\", \"name\": \"123.txt\", \"path\": \"/uploads/files/765a576739bee443.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"765a576739bee443.txt\"}]', 1, '2026-10-12 12:57:18', NULL, NULL, NULL, NULL),
(21, 1, 11, 1, NULL, NULL, '[{\"mime\": \"application/x-empty\", \"name\": \"123.txt\", \"path\": \"/uploads/files/10fb1f62ff78c250.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"10fb1f62ff78c250.txt\"}]', 1, '2026-10-12 14:43:36', NULL, NULL, NULL, NULL),
(22, 1, 11, 1, NULL, NULL, '[{\"mime\": \"application/x-empty\", \"name\": \"Текстовый документ.txt\", \"path\": \"/uploads/files/61a866ad8eacf75d.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"61a866ad8eacf75d.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"Текстовый документ (2).txt\", \"path\": \"/uploads/files/68e72b6c03b1b7d5.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"68e72b6c03b1b7d5.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"123.txt\", \"path\": \"/uploads/files/9b225993267040e1.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"9b225993267040e1.txt\"}]', 1, '2026-10-12 15:15:47', NULL, NULL, NULL, NULL),
(23, 1, 11, 1, NULL, NULL, '[{\"mime\": \"application/x-empty\", \"name\": \"Текстовый документ.txt\", \"path\": \"/uploads/files/209b865cfb8df219.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"209b865cfb8df219.txt\"}]', 1, '2026-10-14 16:26:49', NULL, NULL, NULL, NULL),
(24, 1, 11, 1, NULL, NULL, '[{\"mime\": \"application/x-empty\", \"name\": \"Текстовый документ.txt\", \"path\": \"/uploads/files/841b801f629a564f.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"841b801f629a564f.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"Текстовый документ (2).txt\", \"path\": \"/uploads/files/131858f67275e160.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"131858f67275e160.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"123.txt\", \"path\": \"/uploads/files/1fa4d467b4fafe26.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"1fa4d467b4fafe26.txt\"}, {\"mime\": \"image/jpeg\", \"name\": \"Маша.jpg\", \"path\": \"/uploads/images/e39c04ad87d3171b.jpg\", \"size\": 34841, \"type\": \"images\", \"safe_name\": \"e39c04ad87d3171b.jpg\"}, {\"mime\": \"application/x-empty\", \"name\": \"q90828s0.beget.tech.error (2).log\", \"path\": \"/uploads/files/2c140184ddffdeae.log\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"2c140184ddffdeae.log\"}, {\"mime\": \"application/x-empty\", \"name\": \"q90828s0.beget.tech.error (1).log\", \"path\": \"/uploads/files/6ef7829effed3ad4.log\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"6ef7829effed3ad4.log\"}, {\"mime\": \"application/x-empty\", \"name\": \"q90828s0.beget.tech.error.log\", \"path\": \"/uploads/files/ed36a6128f8e5967.log\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"ed36a6128f8e5967.log\"}]', 1, '2026-10-15 15:02:32', NULL, NULL, NULL, NULL),
(25, 1, 11, 1, NULL, NULL, '[{\"mime\": \"image/png\", \"name\": \"Combined shape 366.png\", \"path\": \"/uploads/images/c6b7ff434495ed81.png\", \"size\": 305, \"type\": \"images\", \"safe_name\": \"c6b7ff434495ed81.png\"}, {\"mime\": \"image/png\", \"name\": \"Combined shape 352.png\", \"path\": \"/uploads/images/0db316ca89a1d0be.png\", \"size\": 331, \"type\": \"images\", \"safe_name\": \"0db316ca89a1d0be.png\"}, {\"mime\": \"image/png\", \"name\": \"Shape sp-352-0-1.png\", \"path\": \"/uploads/images/fa19e6cf36b0f347.png\", \"size\": 149, \"type\": \"images\", \"safe_name\": \"fa19e6cf36b0f347.png\"}, {\"mime\": \"image/png\", \"name\": \"Combined shape 363.png\", \"path\": \"/uploads/images/5f267c1ed267c5dc.png\", \"size\": 302, \"type\": \"images\", \"safe_name\": \"5f267c1ed267c5dc.png\"}, {\"mime\": \"image/png\", \"name\": \"Combined shape 364.png\", \"path\": \"/uploads/images/9227b371a0e40399.png\", \"size\": 323, \"type\": \"images\", \"safe_name\": \"9227b371a0e40399.png\"}]', 1, '2026-10-15 15:36:46', NULL, NULL, NULL, NULL),
(26, 1, 11, 1, NULL, NULL, '[{\"mime\": \"image/png\", \"name\": \"free-icon-file-2745398.png\", \"path\": \"/uploads/images/23dc9d28e7c8db84.png\", \"size\": 4221, \"type\": \"images\", \"safe_name\": \"23dc9d28e7c8db84.png\"}, {\"mime\": \"application/x-empty\", \"name\": \"Текстовый документ.txt\", \"path\": \"/uploads/files/88947e1be9c00756.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"88947e1be9c00756.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"Текстовый документ (2).txt\", \"path\": \"/uploads/files/ed89e4eb556efbc3.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"ed89e4eb556efbc3.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"123.txt\", \"path\": \"/uploads/files/4971e0683945c4c3.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"4971e0683945c4c3.txt\"}, {\"mime\": \"image/png\", \"name\": \"2026-10-05_14-55-16.png\", \"path\": \"/uploads/images/43f397b5eb7a649a.png\", \"size\": 441576, \"type\": \"images\", \"safe_name\": \"43f397b5eb7a649a.png\"}, {\"mime\": \"image/png\", \"name\": \"Icon (4).png\", \"path\": \"/uploads/images/2b9c0aa23b24b7a6.png\", \"size\": 884, \"type\": \"images\", \"safe_name\": \"2b9c0aa23b24b7a6.png\"}]', 1, '2026-10-15 15:37:02', NULL, NULL, NULL, NULL),
(27, 1, 11, 1, NULL, NULL, '[{\"mime\": \"application/x-empty\", \"name\": \"Текстовый документ.txt\", \"path\": \"/uploads/files/935659b3f58f09d5.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"935659b3f58f09d5.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"Текстовый документ (2).txt\", \"path\": \"/uploads/files/3f49ce6b56976feb.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"3f49ce6b56976feb.txt\"}, {\"mime\": \"image/webp\", \"name\": \"7280fb998eee6de1f4a43a94a7d19a6d.jpg\", \"path\": \"/uploads/images/1cb1145b31da2c77.jpg\", \"size\": 151524, \"type\": \"images\", \"safe_name\": \"1cb1145b31da2c77.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"2f5ad843170ce4e03b8ed505a05a7f37ffed8384 (1).jpg\", \"path\": \"/uploads/images/07419e63856eef99.jpg\", \"size\": 809120, \"type\": \"images\", \"safe_name\": \"07419e63856eef99.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"345d346c58fd89f80a234db24accb8e61797ec0d.jpg\", \"path\": \"/uploads/images/e6baf2393b750e29.jpg\", \"size\": 799649, \"type\": \"images\", \"safe_name\": \"e6baf2393b750e29.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"263575249b4579082764e6bac3e8dc81c339328b.jpg\", \"path\": \"/uploads/images/c72770a04d1e7d60.jpg\", \"size\": 1759050, \"type\": \"images\", \"safe_name\": \"c72770a04d1e7d60.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"2c9fca96d91dca2f05a953260c50a29efb366482.jpg\", \"path\": \"/uploads/images/ca57a3d00951268e.jpg\", \"size\": 711594, \"type\": \"images\", \"safe_name\": \"ca57a3d00951268e.jpg\"}]', 1, '2026-10-15 15:40:22', NULL, NULL, NULL, NULL),
(28, 1, 11, 1, NULL, NULL, '[{\"mime\": \"image/jpeg\", \"name\": \"0bbcbb152cef014de95e46c85f186a46.jpg\", \"path\": \"/uploads/images/bb32d042fa7a2165.jpg\", \"size\": 51068, \"type\": \"images\", \"safe_name\": \"bb32d042fa7a2165.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"dbadbf531b29600a4d4c58e37251fd2f.jpg\", \"path\": \"/uploads/images/99d7ac7d32d1464c.jpg\", \"size\": 54556, \"type\": \"images\", \"safe_name\": \"99d7ac7d32d1464c.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"67876ba91a634.jpg\", \"path\": \"/uploads/images/d9ee337f38cf0f11.jpg\", \"size\": 197267, \"type\": \"images\", \"safe_name\": \"d9ee337f38cf0f11.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"053f96589e15cb609d57f1aa4c0d4869.jpg\", \"path\": \"/uploads/images/efe497baef8d4e1e.jpg\", \"size\": 110179, \"type\": \"images\", \"safe_name\": \"efe497baef8d4e1e.jpg\"}]', 1, '2026-10-15 15:40:58', NULL, NULL, NULL, NULL),
(29, 1, 11, 1, NULL, NULL, '[{\"mime\": \"application/x-empty\", \"name\": \"Текстовый документ.txt\", \"path\": \"/uploads/files/57e4fbb1adf39d79.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"57e4fbb1adf39d79.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"Текстовый документ (2).txt\", \"path\": \"/uploads/files/d00ecf18e0a2e260.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"d00ecf18e0a2e260.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"123.txt\", \"path\": \"/uploads/files/eb150a02b097c131.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"eb150a02b097c131.txt\"}, {\"mime\": \"image/jpeg\", \"name\": \"0bbcbb152cef014de95e46c85f186a46.jpg\", \"path\": \"/uploads/images/ddab676e2ae8b5bf.jpg\", \"size\": 51068, \"type\": \"images\", \"safe_name\": \"ddab676e2ae8b5bf.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"dbadbf531b29600a4d4c58e37251fd2f.jpg\", \"path\": \"/uploads/images/f6b4794d30ec74a1.jpg\", \"size\": 54556, \"type\": \"images\", \"safe_name\": \"f6b4794d30ec74a1.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"67876ba91a634.jpg\", \"path\": \"/uploads/images/cab919ed69ea6e4d.jpg\", \"size\": 197267, \"type\": \"images\", \"safe_name\": \"cab919ed69ea6e4d.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"053f96589e15cb609d57f1aa4c0d4869.jpg\", \"path\": \"/uploads/images/fae86c5d3c2cc266.jpg\", \"size\": 110179, \"type\": \"images\", \"safe_name\": \"fae86c5d3c2cc266.jpg\"}]', 1, '2026-10-15 15:41:14', NULL, NULL, NULL, NULL),
(30, 1, 11, 1, NULL, NULL, '[{\"mime\": \"application/x-empty\", \"name\": \"Текстовый документ.txt\", \"path\": \"/uploads/files/9e1f4053e026047f.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"9e1f4053e026047f.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"Текстовый документ (2).txt\", \"path\": \"/uploads/files/cc0b52b99e3a5ee7.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"cc0b52b99e3a5ee7.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"123.txt\", \"path\": \"/uploads/files/5d5594df0e7c0585.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"5d5594df0e7c0585.txt\"}, {\"mime\": \"image/jpeg\", \"name\": \"345d346c58fd89f80a234db24accb8e61797ec0d.jpg\", \"path\": \"/uploads/images/d3742d27d80d220f.jpg\", \"size\": 799649, \"type\": \"images\", \"safe_name\": \"d3742d27d80d220f.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"263575249b4579082764e6bac3e8dc81c339328b.jpg\", \"path\": \"/uploads/images/2a3cea7345c4cacd.jpg\", \"size\": 1759050, \"type\": \"images\", \"safe_name\": \"2a3cea7345c4cacd.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"2c9fca96d91dca2f05a953260c50a29efb366482.jpg\", \"path\": \"/uploads/images/503ce3a9a43fcf90.jpg\", \"size\": 711594, \"type\": \"images\", \"safe_name\": \"503ce3a9a43fcf90.jpg\"}]', 1, '2026-10-15 15:51:23', NULL, NULL, NULL, NULL),
(31, 1, 11, 1, NULL, NULL, '[{\"mime\": \"application/x-empty\", \"name\": \"Текстовый документ (2).txt\", \"path\": \"/uploads/files/cf997b134944987d.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"cf997b134944987d.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"123.txt\", \"path\": \"/uploads/files/6f0f58f0cb633105.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"6f0f58f0cb633105.txt\"}, {\"mime\": \"image/png\", \"name\": \"2026-10-05_14-55-16.png\", \"path\": \"/uploads/images/15bcb692980da9df.png\", \"size\": 441576, \"type\": \"images\", \"safe_name\": \"15bcb692980da9df.png\"}, {\"mime\": \"image/png\", \"name\": \"Icon (4).png\", \"path\": \"/uploads/images/8e37e51d6e676685.png\", \"size\": 884, \"type\": \"images\", \"safe_name\": \"8e37e51d6e676685.png\"}, {\"mime\": \"image/png\", \"name\": \"ad346907f4a987a36dacd595d9fa0b9c1f2f97c2.png\", \"path\": \"/uploads/images/4776f18014114e80.png\", \"size\": 4558, \"type\": \"images\", \"safe_name\": \"4776f18014114e80.png\"}, {\"mime\": \"image/png\", \"name\": \"Icon (3).png\", \"path\": \"/uploads/images/e3da2d14b3600094.png\", \"size\": 171, \"type\": \"images\", \"safe_name\": \"e3da2d14b3600094.png\"}]', 1, '2026-10-15 15:52:53', NULL, NULL, NULL, NULL),
(32, 1, 11, 1, NULL, NULL, '[{\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document.txt\", \"path\": \"/uploads/files/863ea5a93ade1643.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"863ea5a93ade1643.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия.txt\", \"path\": \"/uploads/files/2eafef0ffbc8246e.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"2eafef0ffbc8246e.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия (2).txt\", \"path\": \"/uploads/files/d982e3b8720d4990.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"d982e3b8720d4990.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия (3).txt\", \"path\": \"/uploads/files/565632d2e4dc45ac.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"565632d2e4dc45ac.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия (4).txt\", \"path\": \"/uploads/files/4d51c29275d23ebd.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"4d51c29275d23ebd.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия — копия.txt\", \"path\": \"/uploads/files/8677974453aad7ca.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"8677974453aad7ca.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия (2) — копия.txt\", \"path\": \"/uploads/files/a8445b80c5e1db35.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"a8445b80c5e1db35.txt\"}]', 1, '2026-10-15 16:05:17', NULL, NULL, NULL, NULL),
(33, 1, 11, 1, NULL, NULL, '[{\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия — копия.txt\", \"path\": \"/uploads/files/faa1d1ff66e10545.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"faa1d1ff66e10545.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия (2) — копия.txt\", \"path\": \"/uploads/files/5a61abb883ab1f92.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"5a61abb883ab1f92.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия (2).txt\", \"path\": \"/uploads/files/8d0385554f980b4e.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"8d0385554f980b4e.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия (3).txt\", \"path\": \"/uploads/files/93570b7e8fa5285e.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"93570b7e8fa5285e.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия (4).txt\", \"path\": \"/uploads/files/7b52e0cfd2d04981.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"7b52e0cfd2d04981.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия.txt\", \"path\": \"/uploads/files/4cb75cece56204d2.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"4cb75cece56204d2.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document.txt\", \"path\": \"/uploads/files/f10eb3689a8a87f0.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"f10eb3689a8a87f0.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия (2) — копия — копия.txt\", \"path\": \"/uploads/files/7749ecdb197e080c.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"7749ecdb197e080c.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия (3) — копия.txt\", \"path\": \"/uploads/files/02f4a4fe5c24255d.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"02f4a4fe5c24255d.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия (4) — копия.txt\", \"path\": \"/uploads/files/b9062016e226a2bf.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"b9062016e226a2bf.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия (5) — копия.txt\", \"path\": \"/uploads/files/3933f5a9b8435a45.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"3933f5a9b8435a45.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия — копия (2).txt\", \"path\": \"/uploads/files/35eb907a360b9685.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"35eb907a360b9685.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия (5).txt\", \"path\": \"/uploads/files/8471809c39befe2b.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"8471809c39befe2b.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия — копия — копия.txt\", \"path\": \"/uploads/files/1a58c0cb21a3b3f3.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"1a58c0cb21a3b3f3.txt\"}]', 1, '2026-10-15 16:06:20', NULL, NULL, NULL, NULL),
(34, 1, 11, 1, NULL, NULL, '[{\"mime\": \"image/webp\", \"name\": \"7280fb998eee6de1f4a43a94a7d19a6d.jpg\", \"path\": \"/uploads/images/dfd41abb7fbdd827.jpg\", \"size\": 151524, \"type\": \"images\", \"safe_name\": \"dfd41abb7fbdd827.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"2f5ad843170ce4e03b8ed505a05a7f37ffed8384 (1).jpg\", \"path\": \"/uploads/images/b859916fa8101a35.jpg\", \"size\": 809120, \"type\": \"images\", \"safe_name\": \"b859916fa8101a35.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"345d346c58fd89f80a234db24accb8e61797ec0d.jpg\", \"path\": \"/uploads/images/91e15b757fe7a020.jpg\", \"size\": 799649, \"type\": \"images\", \"safe_name\": \"91e15b757fe7a020.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"263575249b4579082764e6bac3e8dc81c339328b.jpg\", \"path\": \"/uploads/images/3feedc8bc9f20dc5.jpg\", \"size\": 1759050, \"type\": \"images\", \"safe_name\": \"3feedc8bc9f20dc5.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"2c9fca96d91dca2f05a953260c50a29efb366482.jpg\", \"path\": \"/uploads/images/8ab63e3c0eaf40b6.jpg\", \"size\": 711594, \"type\": \"images\", \"safe_name\": \"8ab63e3c0eaf40b6.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"377c89c3cd4308c690d8508267cf30c75bc0270a.jpg\", \"path\": \"/uploads/images/caede2ad903f1253.jpg\", \"size\": 670526, \"type\": \"images\", \"safe_name\": \"caede2ad903f1253.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"2f5ad843170ce4e03b8ed505a05a7f37ffed8384.jpg\", \"path\": \"/uploads/images/37832d60015b5991.jpg\", \"size\": 809120, \"type\": \"images\", \"safe_name\": \"37832d60015b5991.jpg\"}]', 1, '2026-10-15 16:06:54', NULL, NULL, NULL, NULL),
(35, 1, 11, 1, NULL, NULL, '[{\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия — копия — копия.txt\", \"path\": \"/uploads/files/de03011b5626dfec.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"de03011b5626dfec.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия — копия (2).txt\", \"path\": \"/uploads/files/d9b6641cf4a56c03.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"d9b6641cf4a56c03.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия — копия.txt\", \"path\": \"/uploads/files/4dbdf08f03e8e774.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"4dbdf08f03e8e774.txt\"}, {\"mime\": \"image/jpeg\", \"name\": \"0bbcbb152cef014de95e46c85f186a46.jpg\", \"path\": \"/uploads/images/1ee43ae2bcc2dd16.jpg\", \"size\": 51068, \"type\": \"images\", \"safe_name\": \"1ee43ae2bcc2dd16.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"dbadbf531b29600a4d4c58e37251fd2f.jpg\", \"path\": \"/uploads/images/b2d37c72d6f3e021.jpg\", \"size\": 54556, \"type\": \"images\", \"safe_name\": \"b2d37c72d6f3e021.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"67876ba91a634.jpg\", \"path\": \"/uploads/images/ea4b671ae660d297.jpg\", \"size\": 197267, \"type\": \"images\", \"safe_name\": \"ea4b671ae660d297.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"053f96589e15cb609d57f1aa4c0d4869.jpg\", \"path\": \"/uploads/images/f486c9a7492c202f.jpg\", \"size\": 110179, \"type\": \"images\", \"safe_name\": \"f486c9a7492c202f.jpg\"}]', 1, '2026-10-15 16:09:09', NULL, NULL, NULL, NULL),
(36, 1, 11, 1, NULL, NULL, '[{\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия — копия — копия.txt\", \"path\": \"/uploads/files/12372e174a53b9d6.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"12372e174a53b9d6.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия — копия (2).txt\", \"path\": \"/uploads/files/133fe399936c71d9.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"133fe399936c71d9.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия — копия.txt\", \"path\": \"/uploads/files/0c4310ead53ef473.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"0c4310ead53ef473.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия (2) — копия — копия.txt\", \"path\": \"/uploads/files/37a5b8a4d3b11bb8.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"37a5b8a4d3b11bb8.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия (2) — копия.txt\", \"path\": \"/uploads/files/6dc3debb87e5785e.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"6dc3debb87e5785e.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия (2).txt\", \"path\": \"/uploads/files/6bb6476de6cbc12d.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"6bb6476de6cbc12d.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия (3) — копия.txt\", \"path\": \"/uploads/files/8e8b36c23797b34e.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"8e8b36c23797b34e.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия (3).txt\", \"path\": \"/uploads/files/dc935810ca54943d.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"dc935810ca54943d.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия (4) — копия.txt\", \"path\": \"/uploads/files/485d035058d53727.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"485d035058d53727.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия (4).txt\", \"path\": \"/uploads/files/974ccfa88b237b86.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"974ccfa88b237b86.txt\"}, {\"mime\": \"image/webp\", \"name\": \"7280fb998eee6de1f4a43a94a7d19a6d.jpg\", \"path\": \"/uploads/images/978fbe336c0dde78.jpg\", \"size\": 151524, \"type\": \"images\", \"safe_name\": \"978fbe336c0dde78.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"2f5ad843170ce4e03b8ed505a05a7f37ffed8384 (1).jpg\", \"path\": \"/uploads/images/46f472f10cc4382a.jpg\", \"size\": 809120, \"type\": \"images\", \"safe_name\": \"46f472f10cc4382a.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"345d346c58fd89f80a234db24accb8e61797ec0d.jpg\", \"path\": \"/uploads/images/27f4a34160c07ed7.jpg\", \"size\": 799649, \"type\": \"images\", \"safe_name\": \"27f4a34160c07ed7.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"263575249b4579082764e6bac3e8dc81c339328b.jpg\", \"path\": \"/uploads/images/6f452a8940b2046b.jpg\", \"size\": 1759050, \"type\": \"images\", \"safe_name\": \"6f452a8940b2046b.jpg\"}]', 1, '2026-10-15 16:17:53', NULL, NULL, NULL, NULL),
(37, 1, 11, 1, NULL, NULL, '[{\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия — копия — копия.txt\", \"path\": \"/uploads/files/b75f95a787f8753d.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"b75f95a787f8753d.txt\"}, {\"mime\": \"application/x-empty\", \"name\": \"WPS Docs Document — копия — копия (2).txt\", \"path\": \"/uploads/files/182cb1fdc9498ca8.txt\", \"size\": 0, \"type\": \"files\", \"safe_name\": \"182cb1fdc9498ca8.txt\"}, {\"mime\": \"image/jpeg\", \"name\": \"2f5ad843170ce4e03b8ed505a05a7f37ffed8384 (1).jpg\", \"path\": \"/uploads/images/bad23cdf24cf9e57.jpg\", \"size\": 809120, \"type\": \"images\", \"safe_name\": \"bad23cdf24cf9e57.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"345d346c58fd89f80a234db24accb8e61797ec0d.jpg\", \"path\": \"/uploads/images/80bb75d4a53a201f.jpg\", \"size\": 799649, \"type\": \"images\", \"safe_name\": \"80bb75d4a53a201f.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"263575249b4579082764e6bac3e8dc81c339328b.jpg\", \"path\": \"/uploads/images/640f87a3a319cd18.jpg\", \"size\": 1759050, \"type\": \"images\", \"safe_name\": \"640f87a3a319cd18.jpg\"}, {\"mime\": \"image/jpeg\", \"name\": \"2c9fca96d91dca2f05a953260c50a29efb366482.jpg\", \"path\": \"/uploads/images/90dfe7bb49ed5eca.jpg\", \"size\": 711594, \"type\": \"images\", \"safe_name\": \"90dfe7bb49ed5eca.jpg\"}]', 1, '2026-10-15 16:36:09', NULL, NULL, NULL, NULL),
(38, 1, 11, 1, 'dhdf', NULL, NULL, 1, '2026-10-19 15:53:41', NULL, NULL, NULL, NULL),
(39, 1, 11, 1, 'fff', NULL, NULL, 1, '2026-10-19 16:13:25', NULL, NULL, NULL, NULL),
(40, 1, 11, 1, 'fff', NULL, NULL, 1, '2026-10-19 16:13:28', NULL, NULL, NULL, NULL),
(41, 1, 11, 1, 'f', NULL, NULL, 1, '2026-10-19 16:13:29', NULL, NULL, NULL, NULL),
(42, 1, 11, 1, 'f', NULL, NULL, 1, '2026-10-19 16:13:29', NULL, NULL, NULL, NULL),
(43, 1, 11, 1, 'f', NULL, NULL, 1, '2026-10-19 16:13:29', NULL, NULL, NULL, NULL),
(44, 1, 11, 1, 'f', NULL, NULL, 1, '2026-10-19 16:13:29', NULL, NULL, NULL, NULL),
(45, 1, 11, 1, 'f', NULL, NULL, 1, '2026-10-19 16:13:29', NULL, NULL, NULL, NULL),
(46, 1, 11, 1, 'f', NULL, NULL, 1, '2026-10-19 16:13:29', NULL, NULL, NULL, NULL),
(47, 1, 11, 1, 'f', NULL, NULL, 1, '2026-10-19 16:13:30', NULL, NULL, NULL, NULL),
(48, 1, 11, 1, 'f', NULL, NULL, 1, '2026-10-19 16:13:30', NULL, NULL, NULL, NULL),
(49, 1, 11, 1, 'f', NULL, NULL, 1, '2026-10-19 16:13:30', NULL, NULL, NULL, NULL),
(50, 1, 11, 1, 'f', NULL, NULL, 1, '2026-10-19 16:13:30', NULL, NULL, NULL, NULL),
(51, 1, 11, 1, 'f', NULL, NULL, 1, '2026-10-19 16:13:30', NULL, NULL, NULL, NULL),
(52, 1, 11, 1, 'f', NULL, NULL, 1, '2026-10-19 16:13:30', NULL, NULL, NULL, NULL),
(53, 1, 11, 1, 'f', NULL, NULL, 1, '2026-10-19 16:13:31', NULL, NULL, NULL, NULL),
(54, 1, 11, 1, 'f', NULL, NULL, 1, '2026-10-19 16:13:31', NULL, NULL, NULL, NULL),
(55, 1, 11, 1, 'f', NULL, NULL, 1, '2026-10-19 16:13:31', NULL, NULL, NULL, NULL),
(56, 1, 11, 1, 'f', NULL, NULL, 1, '2026-10-19 16:13:31', NULL, NULL, NULL, NULL),
(57, 1, 11, 1, 'f', NULL, NULL, 1, '2026-10-19 16:13:31', NULL, NULL, NULL, NULL),
(58, 1, 11, 1, 'а', NULL, NULL, 1, '2026-10-19 16:36:52', NULL, NULL, NULL, NULL),
(59, 1, 11, 1, 'fff', NULL, NULL, 1, '2026-10-20 08:46:12', NULL, NULL, NULL, NULL),
(60, 1, 11, 1, 'ffff', NULL, NULL, 1, '2026-10-20 10:29:28', NULL, NULL, NULL, NULL),
(61, 1, 11, 1, 'fgffgfg', NULL, NULL, 1, '2026-10-20 10:29:34', NULL, NULL, NULL, NULL),
(62, 1, 11, 1, 'ggg', NULL, NULL, 1, '2026-10-20 10:29:45', NULL, NULL, NULL, NULL),
(63, 1, 11, 1, 'ппп', NULL, NULL, 1, '2026-10-20 10:32:08', NULL, NULL, NULL, NULL),
(64, 1, 11, 1, 'привет', NULL, NULL, 1, '2026-10-20 10:32:53', NULL, NULL, NULL, NULL),
(65, 1, 11, 1, 'в', NULL, NULL, 1, '2026-10-20 10:40:52', NULL, NULL, NULL, NULL),
(66, 1, 11, 1, 'в', NULL, NULL, 1, '2026-10-20 10:40:52', NULL, NULL, NULL, NULL),
(67, 1, 11, 1, 'в', NULL, NULL, 1, '2026-10-20 10:40:53', NULL, NULL, NULL, NULL),
(68, 1, 11, 1, 'в', NULL, NULL, 1, '2026-10-20 10:40:53', NULL, NULL, NULL, NULL),
(69, 1, 11, 1, 'в', NULL, NULL, 1, '2026-10-20 10:40:53', NULL, NULL, NULL, NULL),
(70, 1, 11, 1, 'ппппп', NULL, NULL, 1, '2026-10-20 10:49:08', NULL, NULL, NULL, NULL),
(71, 1, 11, 1, 'а', NULL, NULL, 1, '2026-10-20 11:33:46', NULL, NULL, NULL, NULL),
(72, 1, 11, 1, 'а', NULL, NULL, 1, '2026-10-20 11:33:47', NULL, NULL, NULL, NULL),
(73, 1, 11, 1, 'а', NULL, NULL, 1, '2026-10-20 11:33:47', NULL, NULL, NULL, NULL),
(74, 1, 11, 1, 'аа', NULL, NULL, 1, '2026-10-20 11:33:47', NULL, NULL, NULL, NULL),
(75, 1, 11, 1, 'а', NULL, NULL, 1, '2026-10-20 11:33:47', NULL, NULL, NULL, NULL),
(76, 1, 11, 1, 'аа', NULL, NULL, 1, '2026-10-20 11:33:48', NULL, NULL, NULL, NULL),
(77, 1, 2, 2, 'а', NULL, NULL, 1, '2026-10-20 14:24:58', NULL, NULL, NULL, NULL),
(78, 1, 2, 2, 'а', NULL, NULL, 1, '2026-10-20 14:25:07', NULL, NULL, NULL, NULL),
(80, 1, 11, 1, 'привет', NULL, NULL, 1, '2026-10-21 11:34:12', NULL, NULL, NULL, NULL),
(81, 1, 11, 1, 'привт', NULL, NULL, 1, '2026-10-27 10:11:06', NULL, NULL, NULL, NULL),
(82, 11, 2, 3, 'п', NULL, NULL, 1, '2026-10-27 10:16:44', NULL, NULL, NULL, NULL),
(83, 11, 1, 1, 'привет', NULL, NULL, 1, '2026-10-27 10:21:51', NULL, NULL, NULL, NULL),
(84, 1, 11, 1, '😇', NULL, NULL, 1, '2026-11-04 16:06:01', NULL, NULL, NULL, NULL),
(85, 1, 11, 1, 'привет', NULL, NULL, 1, '2026-11-05 19:34:34', NULL, NULL, NULL, NULL),
(86, 1, 11, 1, 'ffff', NULL, NULL, 1, '2026-11-10 16:43:56', NULL, NULL, NULL, NULL),
(87, 2, 11, 3, 'ff', NULL, NULL, 1, '2026-11-10 16:44:56', NULL, NULL, NULL, NULL),
(88, 11, 2, 3, 'Переслано:\nffff', NULL, NULL, 0, '2026-11-11 08:58:47', NULL, NULL, NULL, NULL),
(89, 11, 2, 3, 'Переслано:\nпривет', NULL, NULL, 0, '2026-11-11 08:59:21', NULL, NULL, NULL, NULL),
(90, 1, 11, 1, 'привет', NULL, NULL, 1, '2026-11-11 09:29:49', NULL, NULL, NULL, NULL),
(91, 11, 1, 1, 'Переслано:\nff', NULL, NULL, 1, '2026-11-11 09:30:01', NULL, NULL, NULL, NULL),
(92, 1, 11, 1, 'Переслано:\nПереслано:\nff', NULL, NULL, 1, '2026-11-11 09:30:24', NULL, NULL, NULL, NULL),
(93, 1, 11, 1, 'аопвао', NULL, NULL, 1, '2026-11-12 12:16:53', NULL, NULL, NULL, NULL),
(94, 1, 11, 1, NULL, NULL, '[{\"mime\": \"image/png\", \"name\": \"Снимок экрана (2).png\", \"path\": \"/uploads/images/d1ea42b5a72902e8.png\", \"size\": 317712, \"type\": \"images\", \"safe_name\": \"d1ea42b5a72902e8.png\"}]', 1, '2026-11-12 12:18:16', NULL, NULL, NULL, NULL),
(95, 1, 11, 1, NULL, NULL, '[{\"mime\": \"image/png\", \"name\": \"Снимок экрана (1).png\", \"path\": \"/uploads/images/cbdaccb21bb1713d.png\", \"size\": 356839, \"type\": \"images\", \"safe_name\": \"cbdaccb21bb1713d.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана (2).png\", \"path\": \"/uploads/images/d372b177bac1b183.png\", \"size\": 317712, \"type\": \"images\", \"safe_name\": \"d372b177bac1b183.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана (3).png\", \"path\": \"/uploads/images/25b66a0705657457.png\", \"size\": 4171541, \"type\": \"images\", \"safe_name\": \"25b66a0705657457.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана (4).png\", \"path\": \"/uploads/images/6ceeccc04a94db0f.png\", \"size\": 755454, \"type\": \"images\", \"safe_name\": \"6ceeccc04a94db0f.png\"}]', 1, '2026-11-12 12:18:45', NULL, NULL, NULL, NULL),
(96, 1, 11, 1, NULL, NULL, '[{\"mime\": \"text/plain\", \"name\": \"deepseek_env_20261022_1d7a06.txt\", \"path\": \"/uploads/documents/84bc18ddd7fe8da9.txt\", \"size\": 61, \"type\": \"documents\", \"safe_name\": \"84bc18ddd7fe8da9.txt\"}]', 0, '2026-11-12 16:44:04', NULL, NULL, NULL, NULL),
(97, 1, 11, 1, NULL, NULL, '[{\"mime\": \"image/png\", \"name\": \"Снимок экрана (1).png\", \"path\": \"/uploads/images/b567c5f2df502d99.png\", \"size\": 356839, \"type\": \"images\", \"safe_name\": \"b567c5f2df502d99.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана (2).png\", \"path\": \"/uploads/images/af52d5bee325e3cf.png\", \"size\": 317712, \"type\": \"images\", \"safe_name\": \"af52d5bee325e3cf.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана (3).png\", \"path\": \"/uploads/images/5aa941b8c502ee72.png\", \"size\": 4171541, \"type\": \"images\", \"safe_name\": \"5aa941b8c502ee72.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана (4).png\", \"path\": \"/uploads/images/75fd0bcceeb19d12.png\", \"size\": 755454, \"type\": \"images\", \"safe_name\": \"75fd0bcceeb19d12.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана 2026-11-02 113854.png\", \"path\": \"/uploads/images/ec5d46d437dbe7b6.png\", \"size\": 28281, \"type\": \"images\", \"safe_name\": \"ec5d46d437dbe7b6.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана 2026-11-02 163052.png\", \"path\": \"/uploads/images/faad18c46b89592d.png\", \"size\": 14880, \"type\": \"images\", \"safe_name\": \"faad18c46b89592d.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана 2026-11-02 163605.png\", \"path\": \"/uploads/images/0430d5713df39920.png\", \"size\": 4878, \"type\": \"images\", \"safe_name\": \"0430d5713df39920.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана 2026-11-02 163814.png\", \"path\": \"/uploads/images/794068ee769e6926.png\", \"size\": 1227, \"type\": \"images\", \"safe_name\": \"794068ee769e6926.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана 2026-11-03 101959.png\", \"path\": \"/uploads/images/ea8a8c56bc9435cd.png\", \"size\": 34859, \"type\": \"images\", \"safe_name\": \"ea8a8c56bc9435cd.png\"}]', 0, '2026-11-13 10:18:10', NULL, NULL, NULL, NULL),
(98, 1, 11, 1, '', NULL, '[{\"mime\": \"image/png\", \"name\": \"Снимок экрана (1).png\", \"path\": \"/uploads/images/b567c5f2df502d99.png\", \"size\": 356839, \"type\": \"images\", \"safe_name\": \"b567c5f2df502d99.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана (2).png\", \"path\": \"/uploads/images/af52d5bee325e3cf.png\", \"size\": 317712, \"type\": \"images\", \"safe_name\": \"af52d5bee325e3cf.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана (3).png\", \"path\": \"/uploads/images/5aa941b8c502ee72.png\", \"size\": 4171541, \"type\": \"images\", \"safe_name\": \"5aa941b8c502ee72.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана (4).png\", \"path\": \"/uploads/images/75fd0bcceeb19d12.png\", \"size\": 755454, \"type\": \"images\", \"safe_name\": \"75fd0bcceeb19d12.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана 2026-11-02 113854.png\", \"path\": \"/uploads/images/ec5d46d437dbe7b6.png\", \"size\": 28281, \"type\": \"images\", \"safe_name\": \"ec5d46d437dbe7b6.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана 2026-11-02 163052.png\", \"path\": \"/uploads/images/faad18c46b89592d.png\", \"size\": 14880, \"type\": \"images\", \"safe_name\": \"faad18c46b89592d.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана 2026-11-02 163605.png\", \"path\": \"/uploads/images/0430d5713df39920.png\", \"size\": 4878, \"type\": \"images\", \"safe_name\": \"0430d5713df39920.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана 2026-11-02 163814.png\", \"path\": \"/uploads/images/794068ee769e6926.png\", \"size\": 1227, \"type\": \"images\", \"safe_name\": \"794068ee769e6926.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана 2026-11-03 101959.png\", \"path\": \"/uploads/images/ea8a8c56bc9435cd.png\", \"size\": 34859, \"type\": \"images\", \"safe_name\": \"ea8a8c56bc9435cd.png\"}]', 0, '2026-11-13 15:18:18', 1, '2026-11-13 10:18:00', NULL, NULL),
(99, 1, 2, 2, '', NULL, '[{\"mime\": \"image/png\", \"name\": \"Снимок экрана (1).png\", \"path\": \"/uploads/images/b567c5f2df502d99.png\", \"size\": 356839, \"type\": \"images\", \"safe_name\": \"b567c5f2df502d99.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана (2).png\", \"path\": \"/uploads/images/af52d5bee325e3cf.png\", \"size\": 317712, \"type\": \"images\", \"safe_name\": \"af52d5bee325e3cf.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана (3).png\", \"path\": \"/uploads/images/5aa941b8c502ee72.png\", \"size\": 4171541, \"type\": \"images\", \"safe_name\": \"5aa941b8c502ee72.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана (4).png\", \"path\": \"/uploads/images/75fd0bcceeb19d12.png\", \"size\": 755454, \"type\": \"images\", \"safe_name\": \"75fd0bcceeb19d12.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана 2026-11-02 113854.png\", \"path\": \"/uploads/images/ec5d46d437dbe7b6.png\", \"size\": 28281, \"type\": \"images\", \"safe_name\": \"ec5d46d437dbe7b6.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана 2026-11-02 163052.png\", \"path\": \"/uploads/images/faad18c46b89592d.png\", \"size\": 14880, \"type\": \"images\", \"safe_name\": \"faad18c46b89592d.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана 2026-11-02 163605.png\", \"path\": \"/uploads/images/0430d5713df39920.png\", \"size\": 4878, \"type\": \"images\", \"safe_name\": \"0430d5713df39920.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана 2026-11-02 163814.png\", \"path\": \"/uploads/images/794068ee769e6926.png\", \"size\": 1227, \"type\": \"images\", \"safe_name\": \"794068ee769e6926.png\"}, {\"mime\": \"image/png\", \"name\": \"Снимок экрана 2026-11-03 101959.png\", \"path\": \"/uploads/images/ea8a8c56bc9435cd.png\", \"size\": 34859, \"type\": \"images\", \"safe_name\": \"ea8a8c56bc9435cd.png\"}]', 1, '2026-11-13 15:21:40', 1, '2026-11-13 10:18:00', NULL, NULL),
(100, 1, 11, 1, 'Переслано:\nПереслано:\nff', NULL, NULL, 0, '2026-11-13 19:32:33', 1, NULL, 'Евгений', 'Абаров'),
(101, 1, 2, 2, 'Переслано:\nПереслано:\nff', NULL, NULL, 0, '2026-11-13 19:37:23', 1, '2026-11-13 19:32:00', 'Евгений', 'Абаров');

-- --------------------------------------------------------

--
-- Структура таблицы `rooms`
--

CREATE TABLE `rooms` (
  `id` int NOT NULL,
  `user1_id` int NOT NULL,
  `user2_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `rooms`
--

INSERT INTO `rooms` (`id`, `user1_id`, `user2_id`, `created_at`) VALUES
(1, 1, 11, '2026-09-21 13:09:22'),
(2, 1, 2, '2026-09-21 13:25:17'),
(3, 2, 11, '2026-09-21 13:25:36'),
(5, 1, 58, '2026-10-29 10:11:12'),
(6, 1, 54, '2026-11-04 13:06:27');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `first_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `friends` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `password`, `avatar_path`, `created_at`, `token`, `friends`) VALUES
(1, 'Евгений', 'Абаров', '$2y$10$NEYuO1AOHa8O7WocaKpdkumfqDxRcMbHtWob7IAHfgYFouaESrXeO', '/uploads/avatars/user_1789473036_444.jpg', '2026-09-15 11:50:36', 'ff245583c16cf17c33864097f0d598d1b2010e0e7e355a0585a20737f4558953', '[12, 13, 11, 2]'),
(2, 'Петр', 'Петров', '$2y$10$hDBGgNSdAv4.tu2w3RjxIuLT0Aq.ECTH5hOp4LtT.ejxSyovma8KC', '/uploads/avatars/user_1789473881_338.png', '2026-09-15 12:04:42', '68d0c88ec8b7faaa458f31ac7191fc2d373084010dd54dd8562d7838f771b0e5', '[11, 1]'),
(11, 'Маша', 'Машина', '$2y$10$SABnduzsimp0y8JRFZlZXO68g8SbSdJIospq1yDkyI/XtKimcwYT6', '/uploads/avatars/user_1789729897_266.jpg', '2026-09-18 11:11:37', '62ca5e27900d7fe8a2e403e3e9e33a5dfdd58f98eb7f796a666514e2d64d562f', '[14, 15, 2, 1]'),
(43, 'Анна', 'Кузнецова', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(44, 'Сергей', 'Морозов', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(45, 'Ольга', 'Волкова', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(46, 'Дмитрий', 'Соколов', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(47, 'Елена', 'Попова', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(48, 'Алексей', 'Лебедев', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(49, 'Татьяна', 'Козлова', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(50, 'Николай', 'Новиков', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(51, 'Ирина', 'Егорова', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(52, 'Павел', 'Павлов', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(53, 'Светлана', 'Семёнова', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(54, 'Андрей', 'Голубев', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(55, 'Наталья', 'Виноградова', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(56, 'Максим', 'Богданов', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(57, 'Юлия', 'Воробьёва', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(58, 'Артём', 'Фёдоров', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(59, 'Ксения', 'Михайлова', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(60, 'Роман', 'Беляев', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(61, 'Алина', 'Тарасова', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(62, 'Виктор', 'Белов', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(63, 'Марина', 'Комарова', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(64, 'Егор', 'Орлов', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(65, 'Валерия', 'Киселёва', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(66, 'Антон', 'Макаров', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(67, 'Дарья', 'Андреева', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(68, 'Илья', 'Ковалёв', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(69, 'Полина', 'Ильина', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(70, 'Григорий', 'Гусев', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(71, 'Вероника', 'Титова', '$2y$10$wpFd0K5Memo9MK3i1G2l7OFMbCTFTisSgk8ZFUT7iKPeskCgAwxUy', NULL, '2026-10-20 12:20:30', NULL, '[]'),
(72, 'Леха', 'Лехин', '$2y$10$nqtqcgSQXk.PnxGzgnajAu4KDwfkCSpsen0m.s99nS8apov4PqZce', '/uploads/avatars/user_1792653603_954.jpg', '2026-10-22 07:20:03', NULL, '[]'),
(73, 'Петр', 'Лехин', '$2y$10$i9robbyc4CeFUrECgk8zReDLsWN3fELo86d6wXaahJoUHJK0r/SdC', '/uploads/avatars/user_1792653657_899.jpg', '2026-10-22 07:20:57', NULL, '[]'),
(74, 'Петр', 'Лехин', '$2y$10$kjVW3mLnrY/54KuavN.63eQEIeOqCgwQm7sLt9z2gsuRe2o39zAWO', '/uploads/avatars/user_1792653690_733.jpg', '2026-10-22 07:21:30', NULL, '[]');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `friend_requests`
--
ALTER TABLE `friend_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_request` (`sender_id`,`receiver_id`);

--
-- Индексы таблицы `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_room` (`room_id`),
  ADD KEY `idx_user` (`user_id`);

--
-- Индексы таблицы `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_pair` (`user1_id`,`user2_id`),
  ADD KEY `user2_id` (`user2_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_token` (`token`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `friend_requests`
--
ALTER TABLE `friend_requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT для таблицы `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT для таблицы `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`user1_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `rooms_ibfk_2` FOREIGN KEY (`user2_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
