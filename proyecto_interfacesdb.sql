-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-11-2025 a las 00:56:24
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyecto_interfacesdb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `email`, `password`, `nombre`, `fecha_creacion`) VALUES
(1, 'prueba@test.com', '$2y$10$rS6nf1AtE0.oDhwjuHbG1eWa42vlr3SqIxA7afS2JyLCjKMFQ.AGS', 'Seba Sana', '2025-11-07 02:50:54'),
(2, 'prueba2@test.com', '$2y$10$ySVO0NdiCIiSMoJMtUXPYOip7hUsUtdWxhdT7wjKeCxwEOYHnwKKG', 'Aylu Lucero', '2025-11-07 02:55:54'),
(3, 'prueba3@test.com', '$2y$10$.ujG/HIVhGrO/GBXVhyyUeOTJHrrh.fp3y9vCXFfF4VIeZ0r3usEW', 'Seba Sanas', '2025-11-07 22:37:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_favoritos`
--

CREATE TABLE `usuarios_favoritos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `pelicula_id` varchar(20) DEFAULT NULL,
  `pelicula_titulo` varchar(255) DEFAULT NULL,
  `poster` varchar(500) DEFAULT NULL,
  `ano` varchar(10) DEFAULT NULL,
  `fecha_agregado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios_favoritos`
--

INSERT INTO `usuarios_favoritos` (`id`, `usuario_id`, `pelicula_id`, `pelicula_titulo`, `poster`, `ano`, `fecha_agregado`) VALUES
(2, 2, '0', 'Shrek Forever After', 'https://m.media-amazon.com/images/M/MV5BMTY0OTU1NzkxMl5BMl5BanBnXkFtZTcwMzI2NDUzMw@@._V1_SX300.jpg', '2010', '2025-11-07 04:13:50'),
(3, 1, '0', 'Cars 3', 'https://m.media-amazon.com/images/M/MV5BMTc0NzU2OTYyN15BMl5BanBnXkFtZTgwMTkwOTg2MTI@._V1_SX300.jpg', '2017', '2025-11-07 04:17:56'),
(4, 1, '813', 'Shrek 2', 'https://m.media-amazon.com/images/M/MV5BMzNmNjQ1NmUtNzhiZS00YWE2LTg4N2ItZTA2ODdmOTMwOTQ1XkEyXkFqcGc@._V1_SX300.jpg', '2004', '2025-11-07 04:37:03'),
(6, 1, '416', 'Harry Potter and the Deathly Hallows: Part 2', 'https://m.media-amazon.com/images/M/MV5BOTA1Mzc2N2ItZWRiNS00MjQzLTlmZDQtMjU0NmY1YWRkMGQ4XkEyXkFqcGc@._V1_SX300.jpg', '2011', '2025-11-07 04:37:54'),
(7, 2, '240', 'The Avengers', 'https://m.media-amazon.com/images/M/MV5BNGE0YTVjNzUtNzJjOS00NGNlLTgxMzctZTY4YTE1Y2Y1ZTU4XkEyXkFqcGc@._V1_SX300.jpg', '2012', '2025-11-07 04:38:15'),
(8, 1, 'tt0317219', 'Cars', 'https://m.media-amazon.com/images/M/MV5BMTg5NzY0MzA2MV5BMl5BanBnXkFtZTYwNDc3NTc2._V1_SX300.jpg', '2006', '2025-11-07 05:03:37'),
(9, 1, 'tt1216475', 'Cars 2', 'https://m.media-amazon.com/images/M/MV5BMTUzNTc3MTU3M15BMl5BanBnXkFtZTcwMzIxNTc3NA@@._V1_SX300.jpg', '2011', '2025-11-07 05:03:39'),
(10, 1, 'tt0413267', 'Shrek the Third', 'https://m.media-amazon.com/images/M/MV5BOTgyMjc3ODk2MV5BMl5BanBnXkFtZTcwMjY0MjEzMw@@._V1_SX300.jpg', '2007', '2025-11-07 05:03:56'),
(11, 1, 'tt0241527', 'Harry Potter and the Sorcerer\'s Stone', 'https://m.media-amazon.com/images/M/MV5BNTU1MzgyMDMtMzBlZS00YzczLThmYWEtMjU3YmFlOWEyMjE1XkEyXkFqcGc@._V1_SX300.jpg', '2001', '2025-11-07 05:05:03'),
(12, 1, 'tt0108778', 'Friends', 'https://m.media-amazon.com/images/M/MV5BOTU2YmM5ZjctOGVlMC00YTczLTljM2MtYjhlNGI5YWMyZjFkXkEyXkFqcGc@._V1_SX300.jpg', '1994–2004', '2025-11-07 05:18:57'),
(13, 1, 'tt14016500', 'The Summer I Turned Pretty', 'https://m.media-amazon.com/images/M/MV5BYjY0OWZkYjEtYzBmZC00NThhLWFjOGYtM2Q5NDA5MWJjZGVkXkEyXkFqcGc@._V1_SX300.jpg', '2022–2025', '2025-11-07 05:20:14'),
(14, 1, 'tt0120338', 'Titanic', 'https://m.media-amazon.com/images/M/MV5BYzYyN2FiZmUtYWYzMy00MzViLWJkZTMtOGY1ZjgzNWMwN2YxXkEyXkFqcGc@._V1_SX300.jpg', '1997', '2025-11-07 05:29:30'),
(16, 1, 'tt0460681', 'Supernatural', 'https://m.media-amazon.com/images/M/MV5BMDFmMGZmMGItNGRjNC00NjVjLWI5ODEtNzhjMTE5MmJhN2FkXkEyXkFqcGc@._V1_SX300.jpg', '2005–2020', '2025-11-07 05:51:43'),
(17, 1, 'tt0098635', 'When Harry Met Sally...', 'https://m.media-amazon.com/images/M/MV5BMjE0ODEwNjM2NF5BMl5BanBnXkFtZTcwMjU2Mzg3NA@@._V1_SX300.jpg', '1989', '2025-11-07 06:13:35'),
(18, 1, 'tt0435761', 'Toy Story 3', 'https://m.media-amazon.com/images/M/MV5BMTgxOTY4Mjc0MF5BMl5BanBnXkFtZTcwNTA4MDQyMw@@._V1_SX300.jpg', '2010', '2025-11-07 06:53:07'),
(19, 1, 'tt1201607', 'Harry Potter and the Deathly Hallows: Part 2', 'https://m.media-amazon.com/images/M/MV5BOTA1Mzc2N2ItZWRiNS00MjQzLTlmZDQtMjU0NmY1YWRkMGQ4XkEyXkFqcGc@._V1_SX300.jpg', '2011', '2025-11-07 21:59:54'),
(20, 1, 'tt14353898', 'Bienvenidos al infierno', 'https://m.media-amazon.com/images/M/MV5BOTUxNDkyYWItMTQyYi00Mzk4LWIyY2ItZDIwY2M1ZmMxYTQ5XkEyXkFqcGc@._V1_SX300.jpg', '2021', '2025-11-07 22:25:17'),
(21, 1, 'tt11981568', 'Cars on the Road', 'https://m.media-amazon.com/images/M/MV5BYzc3YWViOTQtNTkzNy00OTg3LWE5MDktYWNjYWRmM2JhNGI5XkEyXkFqcGc@._V1_SX300.jpg', '2022', '2025-11-11 23:44:59');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `usuarios_favoritos`
--
ALTER TABLE `usuarios_favoritos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios_favoritos`
--
ALTER TABLE `usuarios_favoritos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `usuarios_favoritos`
--
ALTER TABLE `usuarios_favoritos`
  ADD CONSTRAINT `usuarios_favoritos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
