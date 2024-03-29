-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 29, 2024 at 01:52 PM
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
-- Database: `metro_event_1`
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
(15, 'Amara', 1, 1),
(16, 'Earl', 0, 1),
(17, 'Hark', 0, 1),
(18, 'Herald', 0, 1),
(19, 'Micro', 0, 0);

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
  `event_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_info`
--

INSERT INTO `event_info` (`event_id`, `event_organizer`, `event_type`, `event_name`, `event_description`, `event_participants_limit`, `event_location`, `event_date`, `event_time`) VALUES
(34, 'Hark', 'Study Session', 'PhilNits Study Session', 'i miss her i miss her i miss her i miss her i miss her i miss her i miss her i miss her i miss her ', 40, 'Library', '2024-04-05', '07:00:00'),
(35, 'Hark', 'Bootcamp', 'Solana Bootcamp', 'i miss her i miss her i miss her i miss her i miss her i miss her i miss her i miss her ', 50, 'Case Room', '2024-04-03', '07:00:00'),
(37, 'Herald', 'Presentation', 'Interpreter Presentation', 'i miss her i miss her i miss her i miss her i miss her i miss her i miss her i miss her i miss her ', 100, 'GLE 503', '2024-04-02', '15:00:00'),
(38, 'Herald', 'Reporting', 'Programming Language Presentation', 'i miss her i miss her i miss her i miss her i miss her i miss her i miss her i miss her ', 60, 'GLE 503', '2024-04-26', '15:00:00'),
(41, 'Earl', 'Exam', 'Pre-Final Exam', 'i miss her i miss her i miss her i miss her i miss her i miss her i miss her ', 50, 'CIT', '2024-04-25', '07:00:00'),
(42, 'Earl', 'Tournament', 'Dota Tournament', 'i miss her i miss her i miss her i miss her i miss her i miss her ', 30, 'Voyager Internet Cafe', '2024-04-03', '10:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `event_upvote`
--

CREATE TABLE `event_upvote` (
  `event_id` int(11) NOT NULL,
  `username` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_upvote`
--

INSERT INTO `event_upvote` (`event_id`, `username`) VALUES
(41, 'Micro'),
(38, 'Micro'),
(34, 'Micro'),
(37, 'Micro'),
(42, 'Micro');

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

--
-- Dumping data for table `event_user_request`
--

INSERT INTO `event_user_request` (`event_user_request_id`, `event_id`, `username`, `is_accepted`) VALUES
(70, 41, 'Micro', 1),
(84, 41, 'Omcm', 1),
(100, 41, 'Chaeshin', 0),
(114, 41, 'Herald', 0);

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

--
-- Dumping data for table `event_user_review`
--

INSERT INTO `event_user_review` (`event_review_id`, `event_id`, `username`, `event_review`) VALUES
(5, 35, 'Omcm', 'sadbashbdhasd'),
(6, 42, 'Herald', 'asdasd');

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
(7, 'Upcoming event'),
(8, 'A user register on your event.');

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
('Amara', 2, 'Ama', 'ra', '123456'),
('Chaeshin', 0, 'Chae', 'shin', '123456'),
('Earl', 1, 'Earl', 'pogi', '123456'),
('Hark', 1, 'Ha', 'rk', '123456'),
('Herald', 1, 'He', 'rald', '123456'),
('Micro', 0, 'Micro', 'Fuentes', '123456'),
('Omcm', 0, 'Om', 'cm', '123456');

-- --------------------------------------------------------

--
-- Table structure for table `user_notification`
--

CREATE TABLE `user_notification` (
  `username` varchar(200) NOT NULL,
  `notification_category` int(2) NOT NULL,
  `notification_info` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_notification`
--

INSERT INTO `user_notification` (`username`, `notification_category`, `notification_info`) VALUES
('Amara', 1, 'Request to become an administrator is accepted'),
('Earl', 3, 'Request to become an organizer is accepted'),
('Hark', 3, 'Request to become an organizer is accepted'),
('Herald', 3, 'Request to become an organizer is accepted'),
('Chaeshin', 7, 'An organizer has created an event: Pre-Final Exam'),
('Micro', 7, 'An organizer has created an event: Pre-Final Exam'),
('Omcm', 7, 'An organizer has created an event: Pre-Final Exam'),
('Chaeshin', 7, 'Earl has created an event: Dota Tournament'),
('Micro', 7, 'Earl has created an event: Dota Tournament'),
('Omcm', 7, 'Earl has created an event: Dota Tournament'),
('Hark', 8, 'User Micro registered to your event named PhilNits Study Session.'),
('Hark', 8, 'User Micro registered to your event named Software Engineering Presentation.'),
('Earl', 8, 'User Micro registered to your event named Pre-Final Exam.'),
('Herald', 8, 'User Micro registered to your event named Unwind in the beach.'),
('Herald', 8, 'User Chaeshin registered to your event named I miss her tutorial.'),
('Hark', 8, 'User Chaeshin registered to your event named Software Engineering Presentation.'),
('Herald', 8, 'User Chaeshin registered to your event named Unwind in the beach.'),
('Herald', 8, 'User Chaeshin registered to your event named Interpreter Presentation.'),
('Hark', 8, 'User Chaeshin registered to your event named PhilNits Study Session.'),
('Herald', 8, 'User Omcm registered to your event named I miss her tutorial.'),
('Herald', 8, 'User Omcm registered to your event named Unwind in the beach.'),
('Earl', 8, 'User Omcm registered to your event named Dota Tournament.'),
('Herald', 8, 'User Chaeshin registered to your event named Unwind in the beach.'),
('Hark', 8, 'User Chaeshin registered to your event named PhilNits Study Session.'),
('Earl', 8, 'User Omcm registered to your event named Dota Tournament.'),
('Herald', 8, 'User Chaeshin registered to your event named Interpreter Presentation.'),
('Herald', 8, 'User Omcm registered to your event named Unwind in the beach.'),
('Herald', 8, 'User Omcm registered to your event named I miss her tutorial.'),
('Herald', 8, 'User Omcm registered to your event named Programming Language Presentation.'),
('Hark', 8, 'User Omcm registered to your event named Software Engineering Presentation.'),
('Herald', 8, 'User Omcm registered to your event named Interpreter Presentation.'),
('Hark', 8, 'User Omcm registered to your event named Solana Bootcamp.'),
('Earl', 8, 'User Omcm registered to your event named Pre-Final Exam.'),
('Omcm', 5, 'You have successfully registered to the event Dota Tournament.'),
('Micro', 5, 'You have successfully registered to the event Pre-Final Exam.'),
('Omcm', 5, 'You have successfully registered to the event Pre-Final Exam.'),
('Chaeshin', 5, 'You have successfully registered to the event Interpreter Presentation.'),
('Omcm', 4, 'The organizer declined your request to join the event Interpreter Presentation.'),
('Omcm', 4, 'The organizer declined your request to join the event Programming Language Presentation.'),
('Chaeshin', 5, 'You have successfully registered to the event I miss her tutorial.'),
('Omcm', 4, 'The organizer declined your request to join the event I miss her tutorial.'),
('Micro', 4, 'The organizer declined your request to join the event Unwind in the beach.'),
('Chaeshin', 4, 'The organizer declined your request to join the event Unwind in the beach.'),
('Omcm', 5, 'You have successfully registered to the event Unwind in the beach.'),
('Micro', 4, 'The organizer declined your request to join the event PhilNits Study Session.'),
('Chaeshin', 5, 'You have successfully registered to the event PhilNits Study Session.'),
('Omcm', 5, 'You have successfully registered to the event Solana Bootcamp.'),
('Micro', 4, 'The organizer declined your request to join the event Software Engineering Presentation.'),
('Chaeshin', 4, 'The organizer declined your request to join the event Software Engineering Presentation.'),
('Omcm', 4, 'The organizer declined your request to join the event Software Engineering Presentation.'),
('Herald', 8, 'User Micro registered to your event named I miss her tutorial.'),
('Hark', 8, 'User Micro registered to your event named Solana Bootcamp.'),
('Hark', 8, 'User Micro registered to your event named PhilNits Study Session.'),
('Micro', 5, 'You have successfully registered to the event Solana Bootcamp.'),
('Micro', 4, 'The organizer declined your request to join the event PhilNits Study Session.'),
('Herald', 8, 'User Micro registered to your event named Interpreter Presentation.'),
('Hark', 8, 'User Micro registered to your event named PhilNits Study Session.'),
('Herald', 8, 'User Micro registered to your event named Programming Language Presentation.'),
('Earl', 8, 'User Micro registered to your event named Dota Tournament.'),
('Micro', 4, 'The organizer declined your request to join the event Interpreter Presentation.'),
('Micro', 4, 'The organizer declined your request to join the event Programming Language Presentation.'),
('Micro', 4, 'The organizer declined your request to join the event I miss her tutorial.'),
('Micro', 4, 'The organizer declined your request to join the event PhilNits Study Session.'),
('Micro', 4, 'The organizer declined your request to join the event Dota Tournament.'),
('Hark', 8, 'User Micro registered to your event named PhilNits Study Session.'),
('Herald', 8, 'User Micro registered to your event named Interpreter Presentation.'),
('Herald', 8, 'User Micro registered to your event named I miss her tutorial.'),
('Herald', 8, 'User Micro registered to your event named Unwind in the beach.'),
('Hark', 8, 'User Micro registered to your event named Software Engineering Presentation.'),
('Herald', 8, 'User Micro registered to your event named Programming Language Presentation.'),
('Hark', 8, 'User Chaeshin registered to your event named Solana Bootcamp.'),
('Herald', 8, 'User Chaeshin registered to your event named Unwind in the beach.'),
('Earl', 8, 'User Chaeshin registered to your event named Pre-Final Exam.'),
('Hark', 8, 'User Chaeshin registered to your event named Software Engineering Presentation.'),
('Herald', 8, 'User Chaeshin registered to your event named Programming Language Presentation.'),
('Earl', 8, 'User Chaeshin registered to your event named Dota Tournament.'),
('Herald', 8, 'User Chaeshin registered to your event named Programming Language Presentation.'),
('Earl', 8, 'User Chaeshin registered to your event named Pre-Final Exam.'),
('Herald', 8, 'User Chaeshin registered to your event named Unwind in the beach.'),
('Hark', 8, 'User Chaeshin registered to your event named Software Engineering Presentation.'),
('Earl', 8, 'User Chaeshin registered to your event named Dota Tournament.'),
('Hark', 8, 'User Chaeshin registered to your event named Solana Bootcamp.'),
('Hark', 8, 'User Omcm registered to your event named PhilNits Study Session.'),
('Herald', 8, 'User Omcm registered to your event named Interpreter Presentation.'),
('Herald', 8, 'User Omcm registered to your event named I miss her tutorial.'),
('Hark', 8, 'User Omcm registered to your event named Software Engineering Presentation.'),
('Herald', 8, 'User Omcm registered to your event named Programming Language Presentation.'),
('Herald', 8, 'User Hark registered to your event named Interpreter Presentation.'),
('Hark', 5, 'You have successfully registered to the event Interpreter Presentation.'),
('Omcm', 6, 'Cancelled event Solana Bootcamp'),
('Micro', 6, 'Cancelled event Solana Bootcamp'),
('Chaeshin', 6, 'Cancelled event Solana Bootcamp'),
('Chaeshin', 6, 'Cancelled event PhilNits Study Session'),
('Micro', 6, 'Cancelled event PhilNits Study Session'),
('Omcm', 6, 'Cancelled event PhilNits Study Session'),
('Herald', 8, 'User Hark registered to your event named Unwind in the beach.'),
('Hark', 4, 'The organizer declined your request to join the event Unwind in the beach.'),
('Herald', 8, 'User Hark registered to your event named I miss her tutorial.'),
('Hark', 4, 'The organizer declined your request to join the event I miss her tutorial.'),
('Hark', 8, 'User Herald registered to your event named PhilNits Study Session.'),
('Earl', 8, 'User Herald registered to your event named Pre-Final Exam.'),
('Earl', 8, 'User Hark registered to your event named Dota Tournament.'),
('Herald', 6, 'Cancelled event PhilNits Study Session'),
('Micro', 6, 'Cancelled event Software Engineering Presentation'),
('Chaeshin', 6, 'Cancelled event Software Engineering Presentation'),
('Omcm', 6, 'Cancelled event Software Engineering Presentation'),
('earl', 6, 'Cancelled event Samgyup Party'),
('Herald', 8, 'User Hark registered to your event named Unwind in the beach.'),
('Omcm', 6, 'Cancelled event Dota Tournament'),
('Chaeshin', 6, 'Cancelled event Dota Tournament'),
('Hark', 6, 'Cancelled event Dota Tournament'),
('Omcm', 6, 'Cancelled event Unwind in the beach'),
('Micro', 6, 'Cancelled event Unwind in the beach'),
('Chaeshin', 6, 'Cancelled event Unwind in the beach'),
('Hark', 6, 'Cancelled event Unwind in the beach'),
('Chaeshin', 6, 'Cancelled event Interpreter Presentation'),
('Micro', 6, 'Cancelled event Interpreter Presentation'),
('Omcm', 6, 'Cancelled event Interpreter Presentation'),
('Hark', 6, 'Cancelled event Interpreter Presentation'),
('Micro', 6, 'Cancelled event Programming Language Presentation'),
('Chaeshin', 6, 'Cancelled event Programming Language Presentation'),
('Omcm', 6, 'Cancelled event Programming Language Presentation'),
('Chaeshin', 6, 'Cancelled event I miss her tutorial'),
('Micro', 6, 'Cancelled event I miss her tutorial'),
('Omcm', 6, 'Cancelled event I miss her tutorial');

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
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `event_info`
--
ALTER TABLE `event_info`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `event_user_request`
--
ALTER TABLE `event_user_request`
  MODIFY `event_user_request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- AUTO_INCREMENT for table `event_user_review`
--
ALTER TABLE `event_user_review`
  MODIFY `event_review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_list`
--
ALTER TABLE `admin_list`
  ADD CONSTRAINT `admin_list_ibfk_1` FOREIGN KEY (`username`) REFERENCES `user_info` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `admin_list_ibfk_2` FOREIGN KEY (`request_type`) REFERENCES `request_type` (`request_type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `event_attendees`
--
ALTER TABLE `event_attendees`
  ADD CONSTRAINT `event_attendees_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event_info` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `event_attendees_ibfk_2` FOREIGN KEY (`username`) REFERENCES `user_info` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `event_info`
--
ALTER TABLE `event_info`
  ADD CONSTRAINT `event_info_ibfk_2` FOREIGN KEY (`event_organizer`) REFERENCES `user_info` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `event_upvote`
--
ALTER TABLE `event_upvote`
  ADD CONSTRAINT `event_upvote_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event_info` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `event_user_request`
--
ALTER TABLE `event_user_request`
  ADD CONSTRAINT `event_user_request_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event_info` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `event_user_request_ibfk_2` FOREIGN KEY (`username`) REFERENCES `user_info` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `event_user_review`
--
ALTER TABLE `event_user_review`
  ADD CONSTRAINT `event_user_review_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event_info` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `event_user_review_ibfk_2` FOREIGN KEY (`username`) REFERENCES `user_info` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_info`
--
ALTER TABLE `user_info`
  ADD CONSTRAINT `user_info_ibfk_1` FOREIGN KEY (`user_type`) REFERENCES `user_type` (`user_type_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_notification`
--
ALTER TABLE `user_notification`
  ADD CONSTRAINT `user_notification_ibfk_1` FOREIGN KEY (`username`) REFERENCES `user_info` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_notification_ibfk_2` FOREIGN KEY (`notification_category`) REFERENCES `notification_category` (`notification_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
