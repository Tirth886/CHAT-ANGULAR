-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 10, 2019 at 02:12 PM
-- Server version: 10.3.16-MariaDB
-- PHP Version: 7.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chattest`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat message`
--

CREATE TABLE `chat message` (
  `id` int(11) NOT NULL,
  `toid` int(100) NOT NULL,
  `fromid` int(100) NOT NULL,
  `message` varchar(34600) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `chat message`
--

INSERT INTO `chat message` (`id`, `toid`, `fromid`, `message`, `timestamp`) VALUES
(1, 1, 2, 'hii', '2019-08-10 12:09:24'),
(2, 2, 1, 'No Friend Yet', '2019-08-10 12:09:24'),
(3, 1, 2, 'hello', '2019-08-10 12:09:24'),
(4, 1, 2, 'hii', '2019-08-10 12:09:24'),
(5, 1, 2, 'kya kreha ha ?', '2019-08-10 12:10:28'),
(6, 2, 1, 'kuch nhi', '2019-08-10 12:10:57');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `email` varchar(30) NOT NULL,
  `passkey` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `passkey`) VALUES
(1, 'Tirth', 'tirth886jain@gmail.com', '1532'),
(2, 'abhishek', 'abhishek@gmail.com', '2351');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat message`
--
ALTER TABLE `chat message`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat message`
--
ALTER TABLE `chat message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
