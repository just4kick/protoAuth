-- CREATE DATABASE IF NOT EXISTS logindb;

-- USE logindb;

-- DROP TABLE IF EXISTS loginlist;

-- CREATE TABLE loginlist(
--     login_ID BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
--     USERNAME VARCHAR(255) NOT NULL,
--     PASSWDHASH VARCHAR(128) NOT NULL,
--     CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     LASTLOGIN_AT DATE,
--     UPDATED_AT DATE,
--     PRIMARY KEY (ID),
--     CONSTRAINT UQ_LOGIN_USERNAME UNIQUE (USERNAME)
-- );

-- DROP TABLE IF EXISTS session_ls;

-- CREATE TABLE session_ls(
--     Session_ID BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
--     SESSION_VALUE VARCHAR(128) NOT NULL,
--     USER_ID BIGINT UNSIGNED NOT NULL,
--     PRIMARY KEY (ID),
--     FOREIGN KEY (USER_ID) REFERENCES loginlist(ID)
-- );


-- CREATE PROCEDURE createuser 
--     @username nvarchar(255),
--     @passwordhash nvarchar(128),
--     @session_val nvarchar(128)
-- AS
-- BEGIN
--     DECLARE @UserID BIGINT;

--     INSERT INTO loginlist (USERNAME, PASSWDHASH) 
--     OUTPUT inserted.ID INTO @UserID 
--     VALUES (@username, @passwordhash);

--     INSERT INTO session_ls (SESSION_VALUE, USER_ID) 
--     VALUES (@session_val, @UserID);

--     -- Selecting the session value for the newly created user
--     SELECT SESSION_VALUE FROM session_ls WHERE ID = @UserID;
-- END;


CREATE DATABASE IF NOT EXISTS logindb;
USE logindb;

DROP TABLE IF EXISTS loginlist;

CREATE TABLE loginlist(
    ID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    USERNAME VARCHAR(255) NOT NULL,
    PASSWDHASH VARCHAR(128) NOT NULL,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LASTLOGIN_AT DATE,
    UPDATED_AT DATE,
    PRIMARY KEY (ID),
    CONSTRAINT UQ_LOGIN_USERNAME UNIQUE (USERNAME)
);

DROP TABLE IF EXISTS session_ls;

CREATE TABLE session_ls(
    ID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    SESSION_VALUE VARCHAR(128) NOT NULL,
    USER_ID INT UNSIGNED NOT NULL,
    PRIMARY KEY (ID),
    CONSTRAINT UQ_LOGIN_SESSION UNIQUE (SESSION_VALUE),
    FOREIGN KEY (USER_ID) REFERENCES loginlist(ID)
);

DELIMITER //

CREATE PROCEDURE createuser 
    (IN p_username VARCHAR(255),
     IN p_passwordhash VARCHAR(128),
     IN p_session_val VARCHAR(128))
BEGIN
    DECLARE user_id_t INT UNSIGNED;

    INSERT INTO loginlist (USERNAME, PASSWDHASH) 
    VALUES (p_username, p_passwordhash);
    SET user_id_t = LAST_INSERT_ID();

    INSERT INTO session_ls (SESSION_VALUE, USER_ID) 
    VALUES (p_session_val, user_id_t);

    SELECT SESSION_VALUE, USER_ID FROM session_ls WHERE USER_ID = user_id_t;
END//

DELIMITER ;

DELIMITER //

CREATE PROCEDURE loginuser
    (IN p_username_lu  VARCHAR(255),
     IN p_passwordhash_lu VARCHAR(128)
    )
BEGIN
    DECLARE user_id_lu INT UNSIGNED;
    DECLARE session_value_lu VARCHAR(255);

    SELECT s.SESSION_VALUE , l.ID INTO session_value_lu, user_id_lu FROM session_ls s JOIN loginlist l ON l.ID = s.USER_ID WHERE l.USERNAME = p_username_lu AND l.PASSWDHASH = p_passwordhash_lu;

    IF user_id_lu IS NOT NULL THEN
        -- Successful login, you can generate a session token here and return it to the client
        SELECT user_id_lu AS USER_ID,session_value_lu AS SESSION_VALUE;
    ELSE
        -- Login failed
        SELECT NULL AS USER_ID, NULL AS SESSION_VALUE;
    END IF;
END//

DELIMITER ;

DELIMITER //

CREATE PROCEDURE updateuser
    (   
        IN p_ID_uu INT,
        IN p_username_uu VARCHAR(255),
        IN p_passwdhash_uu VARCHAR(128),
        IN p_newusername_uu VARCHAR(255),
        IN p_newpasswdhash_uu VARCHAR(128),
        IN p_newsession_uu VARCHAR(128)
    )
BEGIN
    DECLARE user_id_uu INT UNSIGNED; 
    
    SELECT l.ID INTO user_id_uu FROM session_ls s JOIN loginlist l ON l.ID = s.USER_ID 
    WHERE l.USERNAME = p_username_uu AND l.PASSWDHASH = p_passwdhash_uu AND l.ID=p_ID_uu;

    IF user_id_uu IS NOT NULL THEN
        UPDATE loginlist SET USERNAME = p_newusername_uu , PASSWDHASH = p_newpasswdhash_uu , UPDATED_AT = NOW()
        WHERE ID = p_ID_uu;
        UPDATE session_ls SET SESSION_VALUE = p_newsession_uu WHERE USER_ID = p_ID_uu;  
    ELSE
        SELECT NULL AS USER_ID, NULL AS SESSION_VALUE;
    END IF;

END //

DELIMITER ;



DELIMITER //

CREATE PROCEDURE deleteuser
(
    IN p_ID_du INT,
    IN p_username_du VARCHAR(255),
    IN p_passwdhash_du VARCHAR(128)
)

BEGIN
    DECLARE user_id_du INT UNSIGNED;
    
    SELECT l.ID INTO user_id_du FROM session_ls s JOIN loginlist l ON l.ID = s.USER_ID 
    WHERE l.USERNAME = p_username_du AND l.PASSWDHASH = p_passwdhash_du AND l.ID=p_ID_du;
    IF user_id_du IS NOT NULL THEN
        DELETE FROM session_ls WHERE USER_ID=user_id_du;
        DELETE FROM loginlist WHERE ID=user_id_du;
    ELSE
        SELECT NULL AS ID, NULL AS USERNAME;
    END IF;
    
END //




DELIMITER ;