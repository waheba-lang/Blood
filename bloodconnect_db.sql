-- MySQL Script for BloodConnect Database
-- Generated for use with MySQL Workbench

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema bloodconnect
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `bloodconnect` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
USE `bloodconnect` ;

-- -----------------------------------------------------
-- Table `bloodconnect`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bloodconnect`.`users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('donor', 'patient', 'admin') NOT NULL DEFAULT 'donor',
  `phone` VARCHAR(255) NULL DEFAULT NULL,
  `city` VARCHAR(255) NULL DEFAULT NULL,
  `blood_type` VARCHAR(255) NULL DEFAULT NULL,
  `is_available` TINYINT(1) NOT NULL DEFAULT 1,
  `remember_token` VARCHAR(100) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `users_email_unique` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bloodconnect`.`password_reset_tokens`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bloodconnect`.`password_reset_tokens` (
  `email` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`email`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bloodconnect`.`sessions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bloodconnect`.`sessions` (
  `id` VARCHAR(255) NOT NULL,
  `user_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `ip_address` VARCHAR(45) NULL DEFAULT NULL,
  `user_agent` TEXT NULL DEFAULT NULL,
  `payload` LONGTEXT NOT NULL,
  `last_activity` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `sessions_user_id_index` (`user_id` ASC) VISIBLE,
  INDEX `sessions_last_activity_index` (`last_activity` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bloodconnect`.`cache`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bloodconnect`.`cache` (
  `key` VARCHAR(255) NOT NULL,
  `value` MEDIUMTEXT NOT NULL,
  `expiration` INT NOT NULL,
  PRIMARY KEY (`key`),
  INDEX `cache_expiration_index` (`expiration` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bloodconnect`.`cache_locks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bloodconnect`.`cache_locks` (
  `key` VARCHAR(255) NOT NULL,
  `owner` VARCHAR(255) NOT NULL,
  `expiration` INT NOT NULL,
  PRIMARY KEY (`key`),
  INDEX `cache_locks_expiration_index` (`expiration` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bloodconnect`.`jobs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bloodconnect`.`jobs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` VARCHAR(255) NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `attempts` TINYINT UNSIGNED NOT NULL,
  `reserved_at` INT UNSIGNED NULL DEFAULT NULL,
  `available_at` INT UNSIGNED NOT NULL,
  `created_at` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `jobs_queue_index` (`queue` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bloodconnect`.`job_batches`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bloodconnect`.`job_batches` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `total_jobs` INT NOT NULL,
  `pending_jobs` INT NOT NULL,
  `failed_jobs` INT NOT NULL,
  `failed_job_ids` LONGTEXT NOT NULL,
  `options` MEDIUMTEXT NULL DEFAULT NULL,
  `cancelled_at` INT NULL DEFAULT NULL,
  `created_at` INT NOT NULL,
  `finished_at` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bloodconnect`.`failed_jobs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bloodconnect`.`failed_jobs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` VARCHAR(255) NOT NULL,
  `connection` TEXT NOT NULL,
  `queue` TEXT NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `exception` LONGTEXT NOT NULL,
  `failed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `failed_jobs_uuid_unique` (`uuid` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bloodconnect`.`personal_access_tokens`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bloodconnect`.`personal_access_tokens` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` VARCHAR(255) NOT NULL,
  `tokenable_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `token` VARCHAR(64) NOT NULL,
  `abilities` TEXT NULL DEFAULT NULL,
  `last_used_at` TIMESTAMP NULL DEFAULT NULL,
  `expires_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `personal_access_tokens_token_unique` (`token` ASC) VISIBLE,
  INDEX `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type` ASC, `tokenable_id` ASC) VISIBLE,
  INDEX `personal_access_tokens_expires_at_index` (`expires_at` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bloodconnect`.`donation_requests`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bloodconnect`.`donation_requests` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `patient_name` VARCHAR(255) NULL DEFAULT NULL,
  `blood_type` VARCHAR(255) NOT NULL,
  `quantity` INT NOT NULL,
  `urgency` ENUM('Normal', 'Urgent', 'Critical') NOT NULL DEFAULT 'Normal',
  `hospital` VARCHAR(255) NOT NULL,
  `city` VARCHAR(255) NOT NULL,
  `contact_note` TEXT NULL DEFAULT NULL,
  `status` ENUM('Open', 'In Progress', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Open',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `donation_requests_user_id_foreign_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `donation_requests_user_id_foreign`
    FOREIGN KEY (`user_id`)
    REFERENCES `bloodconnect`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bloodconnect`.`donations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bloodconnect`.`donations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `donation_request_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `hospital` VARCHAR(255) NULL DEFAULT NULL,
  `donation_date` DATE NULL DEFAULT NULL,
  `status` ENUM('Pending', 'Confirmed', 'Cancelled') NOT NULL DEFAULT 'Pending',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `donations_user_id_foreign_idx` (`user_id` ASC) VISIBLE,
  INDEX `donations_donation_request_id_foreign_idx` (`donation_request_id` ASC) VISIBLE,
  CONSTRAINT `donations_user_id_foreign`
    FOREIGN KEY (`user_id`)
    REFERENCES `bloodconnect`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `donations_donation_request_id_foreign`
    FOREIGN KEY (`donation_request_id`)
    REFERENCES `bloodconnect`.`donation_requests` (`id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bloodconnect`.`notifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bloodconnect`.`notifications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `type` VARCHAR(255) NOT NULL DEFAULT 'system',
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `notifications_user_id_foreign_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `notifications_user_id_foreign`
    FOREIGN KEY (`user_id`)
    REFERENCES `bloodconnect`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bloodconnect`.`comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bloodconnect`.`comments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `donation_request_id` BIGINT UNSIGNED NOT NULL,
  `body` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `comments_user_id_foreign_idx` (`user_id` ASC) VISIBLE,
  INDEX `comments_donation_request_id_foreign_idx` (`donation_request_id` ASC) VISIBLE,
  CONSTRAINT `comments_user_id_foreign`
    FOREIGN KEY (`user_id`)
    REFERENCES `bloodconnect`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `comments_donation_request_id_foreign`
    FOREIGN KEY (`donation_request_id`)
    REFERENCES `bloodconnect`.`donation_requests` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Optional: Insert a default admin user
-- -----------------------------------------------------
-- INSERT INTO `bloodconnect`.`users` (name, email, password, role, created_at, updated_at) 
-- VALUES ('Admin', 'admin@bloodconnect.com', '$2y$12$nilpaHbSctaQrSCSeGPo1kuO+1dLuCz3LvVxU7kWuyI=', 'admin', NOW(), NOW());
