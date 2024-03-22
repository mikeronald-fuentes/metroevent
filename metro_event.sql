-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 22, 2024 at 06:10 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `metro_event`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_list`
--

CREATE TABLE `admin_list` (
  `request_id` int(11) NOT NULL,
  `username` varchar(200) NOT NULL,
  `request_type` int(11) NOT NULL,
  `is_approved` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_list`
--

INSERT INTO `admin_list` (`request_id`, `username`, `request_type`, `is_approved`) VALUES
(1, 'Winds', 0, 1),
(3, 'Hark', 0, 0),
(4, 'Herald', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `event_attendees`
--

CREATE TABLE `event_attendees` (
  `event_id` int(11) NOT NULL,
  `username` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_info`
--

CREATE TABLE `event_info` (
  `event_id` int(11) NOT NULL,
  `event_organizer` varchar(200) NOT NULL,
  `event_type` varchar(200) NOT NULL,
  `event_name` varchar(200) NOT NULL,
  `event_description` longtext NOT NULL,
  `event_participants_limit` int(11) NOT NULL,
  `event_location` varchar(200) NOT NULL,
  `event_date` date NOT NULL,
  `event_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_upvote`
--

CREATE TABLE `event_upvote` (
  `event_id` int(11) NOT NULL,
  `event_vote_count` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_user_request`
--

CREATE TABLE `event_user_request` (
  `event_user_request_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `username` varchar(200) NOT NULL,
  `is_accepted` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_user_review`
--

CREATE TABLE `event_user_review` (
  `event_review_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `username` varchar(200) NOT NULL,
  `event_review` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification_category`
--

CREATE TABLE `notification_category` (
  `notification_id` int(11) NOT NULL,
  `notification_type` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification_category`
--

INSERT INTO `notification_category` (`notification_id`, `notification_type`) VALUES
(0, 'Request to be an administrator declined'),
(1, 'Request to be an administrator confirmed'),
(2, 'Request to be an organizer declined'),
(3, 'Request to be an organizer confirmed'),
(4, 'Request to join event declined'),
(5, 'Request to join event confirmed'),
(6, 'Cancelled event'),
(7, 'Upcoming event');

-- --------------------------------------------------------

--
-- Table structure for table `request_type`
--

CREATE TABLE `request_type` (
  `request_type_id` int(11) NOT NULL,
  `request_type` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `request_type`
--

INSERT INTO `request_type` (`request_type_id`, `request_type`) VALUES
(0, 'Organizer'),
(1, 'Administrator');

-- --------------------------------------------------------

--
-- Table structure for table `user_info`
--

CREATE TABLE `user_info` (
  `username` varchar(200) NOT NULL,
  `user_type` int(1) NOT NULL,
  `first_name` varchar(200) NOT NULL,
  `last_name` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_info`
--

INSERT INTO `user_info` (`username`, `user_type`, `first_name`, `last_name`, `password`) VALUES
('Amara', 2, 'Arianne Marie Angela', 'Luvite', 'Amara'),
('Dominic', 0, 'Dominic', 'Cañete', 'Dominic'),
('Hark', 0, 'Hark Noel', 'Bontilao', 'Hark'),
('Herald', 0, 'Herald Noel', 'Bontilao', 'Herald'),
('Micro', 0, 'Mike Ronald', 'Fuentes', 'Micro'),
('Winds', 1, 'Wendell', 'Tamayo', 'Winds\r\n');

-- --------------------------------------------------------

--
-- Table structure for table `user_notification`
--

CREATE TABLE `user_notification` (
  `username` varchar(200) NOT NULL,
  `notification_category` int(2) NOT NULL,
  `notification_info` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_type`
--

CREATE TABLE `user_type` (
  `user_type_ID` int(1) NOT NULL,
  `user_type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_type`
--

INSERT INTO `user_type` (`user_type_ID`, `user_type`) VALUES
(0, 'user'),
(1, 'organizer'),
(2, 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_list`
--
ALTER TABLE `admin_list`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `username` (`username`),
  ADD KEY `request_type` (`request_type`);

--
-- Indexes for table `event_attendees`
--
ALTER TABLE `event_attendees`
  ADD KEY `event_id` (`event_id`),
  ADD KEY `username` (`username`);

--
-- Indexes for table `event_info`
--
ALTER TABLE `event_info`
  ADD PRIMARY KEY (`event_id`),
  ADD KEY `event_organizer` (`event_organizer`);

--
-- Indexes for table `event_upvote`
--
ALTER TABLE `event_upvote`
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `event_user_request`
--
ALTER TABLE `event_user_request`
  ADD PRIMARY KEY (`event_user_request_id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `username` (`username`);

--
-- Indexes for table `event_user_review`
--
ALTER TABLE `event_user_review`
  ADD PRIMARY KEY (`event_review_id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `username` (`username`);

--
-- Indexes for table `notification_category`
--
ALTER TABLE `notification_category`
  ADD PRIMARY KEY (`notification_id`);

--
-- Indexes for table `request_type`
--
ALTER TABLE `request_type`
  ADD PRIMARY KEY (`request_type_id`);

--
-- Indexes for table `user_info`
--
ALTER TABLE `user_info`
  ADD PRIMARY KEY (`username`),
  ADD KEY `user_type` (`user_type`);

--
-- Indexes for table `user_notification`
--
ALTER TABLE `user_notification`
  ADD KEY `username` (`username`),
  ADD KEY `notification_category` (`notification_category`);

--
-- Indexes for table `user_type`
--
ALTER TABLE `user_type`
  ADD PRIMARY KEY (`user_type_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_list`
--
ALTER TABLE `admin_list`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `event_info`
--
ALTER TABLE `event_info`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_user_request`
--
ALTER TABLE `event_user_request`
  MODIFY `event_user_request_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_user_review`
--
ALTER TABLE `event_user_review`
  MODIFY `event_review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_list`
--
ALTER TABLE `admin_list`
  ADD CONSTRAINT `admin_list_ibfk_1` FOREIGN KEY (`username`) REFERENCES `user_info` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `admin_list_ibfk_2` FOREIGN KEY (`request_type`) REFERENCES `request_type` (`request_type_id`);

--
-- Constraints for table `event_attendees`
--
ALTER TABLE `event_attendees`
  ADD CONSTRAINT `event_attendees_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event_info` (`event_id`),
  ADD CONSTRAINT `event_attendees_ibfk_2` FOREIGN KEY (`username`) REFERENCES `user_info` (`username`);

--
-- Constraints for table `event_info`
--
ALTER TABLE `event_info`
  ADD CONSTRAINT `event_info_ibfk_2` FOREIGN KEY (`event_organizer`) REFERENCES `user_info` (`username`);

--
-- Constraints for table `event_upvote`
--
ALTER TABLE `event_upvote`
  ADD CONSTRAINT `event_upvote_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event_info` (`event_id`);

--
-- Constraints for table `event_user_request`
--
ALTER TABLE `event_user_request`
  ADD CONSTRAINT `event_user_request_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event_info` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `event_user_request_ibfk_2` FOREIGN KEY (`username`) REFERENCES `user_info` (`username`);

--
-- Constraints for table `event_user_review`
--
ALTER TABLE `event_user_review`
  ADD CONSTRAINT `event_user_review_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event_info` (`event_id`),
  ADD CONSTRAINT `event_user_review_ibfk_2` FOREIGN KEY (`username`) REFERENCES `user_info` (`username`);

--
-- Constraints for table `user_info`
--
ALTER TABLE `user_info`
  ADD CONSTRAINT `user_info_ibfk_1` FOREIGN KEY (`user_type`) REFERENCES `user_type` (`user_type_ID`);

--
-- Constraints for table `user_notification`
--
ALTER TABLE `user_notification`
  ADD CONSTRAINT `user_notification_ibfk_1` FOREIGN KEY (`username`) REFERENCES `user_info` (`username`),
  ADD CONSTRAINT `user_notification_ibfk_2` FOREIGN KEY (`notification_category`) REFERENCES `notification_category` (`notification_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
