CREATE TABLE carreras(
  id                      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email                   VARCHAR(35) NOT NULL,
  nombreProyecto          VARCHAR(300) NOT NULL,
  Asunto          VARCHAR(300) NOT NULL,
  Dependencia          VARCHAR(300) NOT NULL,
  tipo                    TINYINT UNSIGNED NOT NULL,
-- 1: Pregrado
-- 2: Postgrado
-- 2: Diplomado
  status                  TINYINT UNSIGNED NOT NULL,
-- 0: esperando correccion
-- 1: recibido
-- 2: para revisar
-- 3: rechazado por desco
-- 4: validado
-- 5: rechazado por consejo
-- 6: aprobado
  nota                    VARCHAR(300),
  avances                 TINYINT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY(id),
  INDEX fk_carreras_email_idx (email DESC),
    CONSTRAINT fk_carreras_email
    FOREIGN KEY (email)
    REFERENCES usuarios (email)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
CREATE TABLE SolicitudDeA(
   id                      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  identidicacion                   VARCHAR(35) NOT NULL,
  titulo          VARCHAR(300) NOT NULL,
  solicitante          VARCHAR(300) NOT NULL,
  lugar          VARCHAR(300) NOT NULL,
  cantidadP          int NOT NULL,
  fecha         date,
  tipo                    TINYINT UNSIGNED NOT NULL,
  inntroducion                    VARCHAR(300)  NOT NULL,
  status int NOT NULL,
  PRIMARY KEY(id)

);
