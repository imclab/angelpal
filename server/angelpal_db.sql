-- phpMyAdmin SQL Dump
-- version 3.4.5deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 06, 2013 at 06:26 PM
-- Server version: 5.1.69
-- PHP Version: 5.3.6-13ubuntu3.10

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `synchro_pp`
--

-- --------------------------------------------------------

--
-- Table structure for table `disasters`
--

CREATE TABLE IF NOT EXISTS `disasters` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `owner` int(10) unsigned NOT NULL,
  `date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `date_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=47 ;

-- --------------------------------------------------------

--
-- Table structure for table `folders`
--

CREATE TABLE IF NOT EXISTS `folders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `creator` int(10) unsigned NOT NULL,
  `role` int(10) unsigned NOT NULL DEFAULT '0',
  `status` int(10) unsigned NOT NULL DEFAULT '0',
  `date_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `folders`
--

INSERT INTO `folders` (`id`, `creator`, `role`, `status`, `date_modified`) VALUES
(1, 1, 0, 5, '2013-06-05 16:57:52');

-- --------------------------------------------------------

--
-- Table structure for table `join_disasters`
--

CREATE TABLE IF NOT EXISTS `join_disasters` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `disaster_server_id` int(10) unsigned NOT NULL,
  `disaster_client_id` int(10) unsigned NOT NULL,
  `user_server_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

-- --------------------------------------------------------

--
-- Table structure for table `join_folders`
--

CREATE TABLE IF NOT EXISTS `join_folders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `folder_server_id` int(10) unsigned NOT NULL,
  `folder_client_id` int(10) unsigned NOT NULL,
  `user_server_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `join_folders`
--

INSERT INTO `join_folders` (`id`, `folder_server_id`, `folder_client_id`, `user_server_id`) VALUES
(1, 1, 100, 1);

-- --------------------------------------------------------

--
-- Table structure for table `join_payments`
--

CREATE TABLE IF NOT EXISTS `join_payments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `payment_server_id` int(10) unsigned NOT NULL,
  `payment_client_id` int(10) unsigned NOT NULL,
  `user_server_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE IF NOT EXISTS `payments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `folder` int(10) unsigned NOT NULL,
  `sender` int(10) unsigned NOT NULL,
  `receiver` int(10) unsigned NOT NULL,
  `amount` double NOT NULL DEFAULT '0',
  `state` smallint(6) NOT NULL DEFAULT '0',
  `type` smallint(6) NOT NULL DEFAULT '0',
  `date_created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `date_payment` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `date_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `login` varchar(511) NOT NULL,
  `password` varchar(1023) NOT NULL,
  `cle` varchar(1023) NOT NULL,
  `salt` varchar(511) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `login`, `password`, `cle`, `salt`) VALUES
(1, 'bobby', '90b228f78829fc45fc38287efe9fdad20e35c4892ec361b13a1e7cfd178f619c', '', 'salt'),
(2, 'joe', 'sisi', '', 'truc');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
