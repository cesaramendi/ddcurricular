CREATE TABLE carreras(
  id                      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email                   VARCHAR(35) NOT NULL,
  fechaSolicitud          DATE,
  facultadSolicitud       VARCHAR(10) NOT NULL,
  nombreSolicitud         VARCHAR(100) NOT NULL,
  tipo                    TINYINT UNSIGNED NOT NULL,
  -- 1: Pregrado
  -- 2: Postgrado
  -- 3: Diplomado
  apellidoSolicitante     VARCHAR(30) NOT NULL,
  nombreSolicitante       VARCHAR(30) NOT NULL,
  disenno                 VARCHAR(100) NOT NULL,
  coordinador             VARCHAR(60) NOT NULL,
  introduccion            VARCHAR(100) NOT NULL,
  participantes           VARCHAR(100) NOT NULL,
  descripcion             VARCHAR(100) NOT NULL,

  status                  TINYINT UNSIGNED NOT NULL,
-- 0: esperando correccion
-- 1: recibido
-- 2: para revisar
-- 3: rechazado por desco
-- 4: validado
-- 5: rechazado por consejo
-- 6: aprobado
  nota                    VARCHAR(200) NOT NULL,

  PRIMARY KEY(id),
  INDEX fk_carreras_email_idx (email DESC),
    CONSTRAINT fk_carreras_email
    FOREIGN KEY (email)
    REFERENCES usuarios (email)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
CREATE TABLE asesorias(
  id                      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email                   VARCHAR(35) NOT NULL,
  titulo                   VARCHAR(300) NOT NULL,
  apellidoSolicitanteA     VARCHAR(300) NOT NULL,
  nombreSolicitanteA       VARCHAR(300) NOT NULL,
  lugar                    VARCHAR(300) NOT NULL,
  cantidadParticipantes    TINYINT UNSIGNED NOT NULL,
  fecha                    DATE,
  tipo                     TINYINT UNSIGNED NOT NULL,
  -- 1: Curso
  -- 2: Taller
  -- 3: Formacion
  introduccion             VARCHAR(300) NOT NULL,
  status                   TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY(id),
  INDEX fk_asesoria_email_idx (email DESC),
    CONSTRAINT fk_asesoria_email
    FOREIGN KEY (email)
    REFERENCES usuarios (email)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
