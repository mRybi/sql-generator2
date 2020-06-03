SET
  @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS,
  UNIQUE_CHECKS = 0;
SET
  @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS,
  FOREIGN_KEY_CHECKS = 0;
SET
  @OLD_SQL_MODE = @@SQL_MODE,
  SQL_MODE = 'TRADITIONAL,ALLOW_INVALID_DATES';
CREATE SCHEMA IF NOT EXISTS `DatabaseName2` DEFAULT CHARACTER
SET
  utf8;
USE `DatabaseName2`;
CREATE TABLE IF NOT EXISTS `DatabaseName2`.`Entity1` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Entity2Id` INT NULL,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `Id_UNIQUE` (`Id` ASC)
  ) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `DatabaseName2`.`Entity2` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `Id_UNIQUE` (`Id` ASC)
  ) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `DatabaseName2`.`Entity3` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Entity4Id` INT NOT NULL,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `Id_UNIQUE` (`Id` ASC)
  ) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `DatabaseName2`.`Entity4` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `Id_UNIQUE` (`Id` ASC)
  ) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `DatabaseName2`.`Entity5` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Entity6Id` INT NULL,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `Id_UNIQUE` (`Id` ASC)
  ) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `DatabaseName2`.`Entity6` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `Id_UNIQUE` (`Id` ASC)
  ) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `DatabaseName2`.`Entity7` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `Id_UNIQUE` (`Id` ASC)
  ) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `DatabaseName2`.`Entity8` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Entity7Id` INT NOT NULL,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `Id_UNIQUE` (`Id` ASC)
  ) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `DatabaseName2`.`Entity9` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `Id_UNIQUE` (`Id` ASC)
  ) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `DatabaseName2`.`Entity10` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Entity9Id` INT NULL,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `Id_UNIQUE` (`Id` ASC)
  ) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `DatabaseName2`.`Entity11` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `Id_UNIQUE` (`Id` ASC)
  ) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `DatabaseName2`.`Entity12` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `Id_UNIQUE` (`Id` ASC)
  ) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `DatabaseName2`.`Entity13` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Entity14Id` INT NOT NULL,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `Id_UNIQUE` (`Id` ASC)
  ) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `DatabaseName2`.`Entity14` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `Id_UNIQUE` (`Id` ASC)
  ) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `DatabaseName2`.`Entity15` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Entity16Id` INT NULL,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `Id_UNIQUE` (`Id` ASC)
  ) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `DatabaseName2`.`Entity16` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `Id_UNIQUE` (`Id` ASC)
  ) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `DatabaseName2`.`Entity17` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `Id_UNIQUE` (`Id` ASC)
  ) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `DatabaseName2`.`Entity18` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `Id_UNIQUE` (`Id` ASC)
  ) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `DatabaseName2`.`rl_Entity11_relation name_Entity12` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Entity11Id` INT NOT NULL,
    `Entity12Id` INT NOT NULL,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `Id_UNIQUE` (`Id` ASC)
  ) ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `DatabaseName2`.`rl_Entity17_relation name_Entity18` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Entity17Id` INT NOT NULL,
    `Entity18Id` INT NOT NULL,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `Id_UNIQUE` (`Id` ASC)
  ) ENGINE = InnoDB;
ALTER TABLE
  `DatabaseName2`.`Entity1`
ADD
  CONSTRAINT `fk_Entity1_Entity2Id` FOREIGN KEY(`Entity2Id`) REFERENCES `DatabaseName2`.`Entity2`(`Id`) ON DELETE NO ACTION ON
UPDATE
  NO ACTION;
CREATE INDEX `fk_Entity1_Entity2Id_idx` ON `DatabaseName2`.`Entity1` (`Id` ASC);
ALTER TABLE
  `DatabaseName2`.`Entity3`
ADD
  CONSTRAINT `fk_Entity3_Entity4Id` FOREIGN KEY(`Entity4Id`) REFERENCES `DatabaseName2`.`Entity4`(`Id`) ON DELETE NO ACTION ON
UPDATE
  NO ACTION;
CREATE INDEX `fk_Entity3_Entity4Id_idx` ON `DatabaseName2`.`Entity3` (`Id` ASC);
ALTER TABLE
  `DatabaseName2`.`Entity5`
ADD
  CONSTRAINT `fk_Entity5_Entity6Id` FOREIGN KEY(`Entity6Id`) REFERENCES `DatabaseName2`.`Entity6`(`Id`) ON DELETE NO ACTION ON
UPDATE
  NO ACTION;
CREATE INDEX `fk_Entity5_Entity6Id_idx` ON `DatabaseName2`.`Entity5` (`Id` ASC);
ALTER TABLE
  `DatabaseName2`.`Entity8`
ADD
  CONSTRAINT `fk_Entity8_Entity7Id` FOREIGN KEY(`Entity7Id`) REFERENCES `DatabaseName2`.`Entity7`(`Id`) ON DELETE NO ACTION ON
UPDATE
  NO ACTION;
CREATE INDEX `fk_Entity8_Entity7Id_idx` ON `DatabaseName2`.`Entity8` (`Id` ASC);
ALTER TABLE
  `DatabaseName2`.`Entity10`
ADD
  CONSTRAINT `fk_Entity10_Entity9Id` FOREIGN KEY(`Entity9Id`) REFERENCES `DatabaseName2`.`Entity9`(`Id`) ON DELETE NO ACTION ON
UPDATE
  NO ACTION;
CREATE INDEX `fk_Entity10_Entity9Id_idx` ON `DatabaseName2`.`Entity10` (`Id` ASC);
ALTER TABLE
  `DatabaseName2`.`Entity13`
ADD
  CONSTRAINT `fk_Entity13_Entity14Id` FOREIGN KEY(`Entity14Id`) REFERENCES `DatabaseName2`.`Entity14`(`Id`) ON DELETE NO ACTION ON
UPDATE
  NO ACTION;
CREATE INDEX `fk_Entity13_Entity14Id_idx` ON `DatabaseName2`.`Entity13` (`Id` ASC);
ALTER TABLE
  `DatabaseName2`.`Entity15`
ADD
  CONSTRAINT `fk_Entity15_Entity16Id` FOREIGN KEY(`Entity16Id`) REFERENCES `DatabaseName2`.`Entity16`(`Id`) ON DELETE NO ACTION ON
UPDATE
  NO ACTION;
CREATE INDEX `fk_Entity15_Entity16Id_idx` ON `DatabaseName2`.`Entity15` (`Id` ASC);
ALTER TABLE
  `DatabaseName2`.`rl_Entity11_relation name_Entity12`
ADD
  CONSTRAINT `fk_rl_Entity11_relation name_Entity12_Entity11Id` FOREIGN KEY(`Entity11Id`) REFERENCES `DatabaseName2`.`Entity12`(`Id`) ON DELETE NO ACTION ON
UPDATE
  NO ACTION;
CREATE INDEX `fk_rl_Entity11_relation name_Entity12_Entity11Id_idx` ON `DatabaseName2`.`rl_Entity11_relation name_Entity12` (`Id` ASC);
ALTER TABLE
  `DatabaseName2`.`rl_Entity11_relation name_Entity12`
ADD
  CONSTRAINT `fk_rl_Entity11_relation name_Entity12_Entity12Id` FOREIGN KEY(`Entity12Id`) REFERENCES `DatabaseName2`.`Entity12`(`Id`) ON DELETE NO ACTION ON
UPDATE
  NO ACTION;
CREATE INDEX `fk_rl_Entity11_relation name_Entity12_Entity12Id_idx` ON `DatabaseName2`.`rl_Entity11_relation name_Entity12` (`Id` ASC);
ALTER TABLE
  `DatabaseName2`.`rl_Entity17_relation name_Entity18`
ADD
  CONSTRAINT `fk_rl_Entity17_relation name_Entity18_Entity17Id` FOREIGN KEY(`Entity17Id`) REFERENCES `DatabaseName2`.`rl_Entity11_relation name_Entity12`(`Id`) ON DELETE NO ACTION ON
UPDATE
  NO ACTION;
CREATE INDEX `fk_rl_Entity17_relation name_Entity18_Entity17Id_idx` ON `DatabaseName2`.`rl_Entity17_relation name_Entity18` (`Id` ASC);
ALTER TABLE
  `DatabaseName2`.`rl_Entity17_relation name_Entity18`
ADD
  CONSTRAINT `fk_rl_Entity17_relation name_Entity18_Entity18Id` FOREIGN KEY(`Entity18Id`) REFERENCES `DatabaseName2`.`rl_Entity11_relation name_Entity12`(`Id`) ON DELETE NO ACTION ON
UPDATE
  NO ACTION;
CREATE INDEX `fk_rl_Entity17_relation name_Entity18_Entity18Id_idx` ON `DatabaseName2`.`rl_Entity17_relation name_Entity18` (`Id` ASC);
SET
  SQL_MODE = @OLD_SQL_MODE;
SET
  FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET
  UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;