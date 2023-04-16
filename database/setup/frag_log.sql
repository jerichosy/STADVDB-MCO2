CREATE TABLE log_table (
    `log_id` INT NOT NULL AUTO_INCREMENT,
	`action` VARCHAR(255) NOT NULL,
    `action_time` TIMESTAMP NOT NULL,
    `id` INT,
	`title` VARCHAR(255),
    `year` INT,
    `genre` VARCHAR(255),
    `director` VARCHAR(255),
    `actor` VARCHAR(255),
    PRIMARY KEY (`log_id`)
);

CREATE TRIGGER insert_movie AFTER INSERT 
ON movies FOR EACH ROW
	INSERT INTO log_table SET
    `action` = 'INSERT',
    `action_time` = NOW(),
    id = NEW.id,
    title = NEW.title,
    `year` = NEW.`year`,
    genre = NEW.genre,
    director = NEW.director,
    actor = NEW.actor;

CREATE TRIGGER delete_movie AFTER DELETE 
ON movies FOR EACH ROW
	INSERT INTO log_table SET
    `action` = 'DELETE',
    `action_time` = NOW(),
    id = OLD.id,
    title = OLD.title,
    `year` = OLD.`year`,
    genre = OLD.genre,
    director = OLD.director,
    actor = OLD.actor;

CREATE TRIGGER update_movie AFTER UPDATE 
ON movies FOR EACH ROW
	INSERT INTO log_table SET
    `action` = 'UPDATE',
    `action_time` = NOW(),
    id = NEW.id,
    title = NEW.title,
    `year` = NEW.`year`,
    genre = NEW.genre,
    director = NEW.director,
    actor = NEW.actor;
    
SHOW TRIGGERS;
DROP TRIGGER insert_movie;
DROP TRIGGER delete_movie;
DROP TRIGGER update_movie;

# TESTING

INSERT INTO movies (title, `year`, genre, director, actor) VALUES ('Your Name', 2016, 'Romance', 'Makoto Shinkai', 'Mone Kamishiraishi'); 
INSERT INTO movies (title, `year`, genre, director, actor) VALUES ('Your Name', 2016, 'Romance', 'Makoto Shinkai', 'Mone Kamishiraishi'); 

SELECT * FROM movies WHERE title = 'Your Name';

SELECT * FROM log_table;

DELETE FROM movies WHERE id = 378609;

DELETE FROM log_table WHERE log_id = 1 OR log_id = 2;