CREATE TABLE persona(
  nacionalidad    VARCHAR(1) NOT NULL,
  -- V: Venezolano
  -- E: cExtrangero
  cedula          INT(12) UNSIGNED NOT NULL,
  apellido        VARCHAR(40) NOT NULL,
  nombre          VARCHAR(40) NOT NULL,

  PRIMARY KEY(nacionalidad,cedula)
);


CREATE TABLE usuarios(
  email     VARCHAR(35) NOT NULL PRIMARY KEY,
  pass      VARCHAR(40) NOT NULL,
  rol       TINYINT UNSIGNED NOT NULL,
-- 1: Admin
-- 2: curriculum
-- 3: Facultad
  facultad  VARCHAR(15)
);

CREATE TABLE SolicitudAval(
  id                      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email                   VARCHAR(35) NOT NULL,
  fechaSolicitud          DATE NOT NULL,
  nombreSolicitud         VARCHAR(100) NOT NULL,
  solicitud               TINYINT UNSIGNED NOT NULL,
  -- 1: Creacion
  -- 2: Redise;o
  tipo                    TINYINT UNSIGNED NOT NULL,
  -- 1: Carrera
  -- 2: Programa de postgrado
  -- 3: Programa academico

  institucion              VARCHAR(30) NOT NULL,
  dependencia             VARCHAR(30) NOT NULL,
  disennador              VARCHAR(100) NOT NULL,
  coordinador             VARCHAR(60) NOT NULL,
  descripcion             VARCHAR(300) NOT NULL,
  miembros                VARCHAR(300) NOT NULL,
  status                  TINYINT UNSIGNED NOT NULL,
  -- 0: esperando correccion
  -- 1: recibido
  -- 2: para revisar
  -- 3: rechazado por DDC
  -- 4: validado
  -- 5: rechazado por consejo
  -- 6: aprobado
  fechaStatus             DATETIME NOT NULL,
  nota                    VARCHAR(200),

  PRIMARY KEY(id),
  INDEX fk_carreras_email_idx (email DESC),
    CONSTRAINT fk_carreras_email
    FOREIGN KEY (email)
    REFERENCES usuarios (email)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
CREATE TABLE Asesoria(
  idA                     INT UNSIGNED NOT NULL AUTO_INCREMENT,
  emailA                  VARCHAR(35) NOT NULL,
  fechaSolicitudA	        DATE NOT NULL,
  nombreSolicitudA        VARCHAR(100) NOT NULL,
  etapa                   TINYINT UNSIGNED NOT NULL,
  -- 1: Diagnostico
  -- 2: Disenno
  -- 3: Ejecusion
  -- 4: Evaluacion
  tipoA                    TINYINT UNSIGNED NOT NULL,
  -- 1: Carreras
  -- 2: Programas Postgrado
  -- 3: Programas academico

  institucionA            VARCHAR(30) NOT NULL,
  dependenciaA            VARCHAR(30) NOT NULL,
  comunidad                       VARCHAR(100) NOT NULL,
  cantidadBeneficiarios           TINYINT UNSIGNED NOT NULL,
  lugarA                  VARCHAR(300) NOT NULL,
  fechaA                  DATE NOT NULL,
  horaA                   TIME NOT NULL,
  descripcionA            VARCHAR(300) NOT NULL,
  statusA                  TINYINT UNSIGNED NOT NULL,
  -- 0: esperando correccion
  -- 1: recibido
  -- 2: para revisar
  -- 3: devuelto por DDC
  -- 4: validado
  -- 5: rechazado por consejo
  -- 6: aprobado
  fechaStatusA            DATETIME NOT NULL,
  notaA                   VARCHAR(200),
  PRIMARY KEY(idA),
  INDEX fk_asesoria_email_idx (emailA DESC),
    CONSTRAINT fk_asesoria_email
    FOREIGN KEY (emailA)
    REFERENCES usuarios (email)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE Investigacion(
  idI                     INT UNSIGNED NOT NULL AUTO_INCREMENT,
  emailI                  VARCHAR(35) NOT NULL,
  fechaSolicitudI  	      DATE NOT NULL,
  nombreSolicitudI        VARCHAR(100) NOT NULL,
  solicitudI              TINYINT UNSIGNED NOT NULL,
  -- 1: Creacion
  -- 2: Rediseño
  tipoI                    TINYINT UNSIGNED NOT NULL,
  -- 1: Carrera
  -- 2: Diplomado
  -- 3: Programa Academico
  institucionI                  VARCHAR(30) NOT NULL,
  dependenciaI            VARCHAR(30) NOT NULL,
  descripcionI            VARCHAR(500) NOT NULL,
  statusI                 TINYINT UNSIGNED NOT NULL,
  -- 0: esperando correccion
  -- 1: recibido
  -- 2: para revisar
  -- 3: rechazado por DDC
  -- 4: validado
  -- 5: rechazado por consejo
  -- 6: aprobado
  fechaStatusI            DATETIME NOT NULL,
  notaI                   VARCHAR(200),
  PRIMARY KEY(id),
  INDEX fk_investigacion_email_idx (email DESC),
    CONSTRAINT fk_investigacion_email
    FOREIGN KEY (email)
    REFERENCES usuarios (email)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

--//////////////Documentos//////////////////////////////////////////////////////

CREATE TABLE documentoSolicitudAval(
  idDocSolAval          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  refProyecto           INT UNSIGNED DEFAULT NULL,
  ruta                  VARCHAR(380) NOT NULL,
  nombreDoc             VARCHAR(350) NOT NULL,
  fechaSubida           DATE NOT NULL,
  tipo                  TINYINT UNSIGNED NOT NULL,
-- 1: inicio,
-- 2: actualizados,
-- 3: aval,
-- 4: avances,
-- 5: final
  numero                TINYINT UNSIGNED NOT NULL,
-- Para, en dado caso, saber cual es el archivo que se corrige

  PRIMARY KEY(idDocSolAval),
  INDEX fk_documentos_refProyecto_idx (refProyecto DESC),
  CONSTRAINT fk_documentos_refProyecto
    FOREIGN KEY (refProyecto)
    REFERENCES SolicitudAval (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE DocumentoAsesoria(
  idDocA             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  refProyectoA           INT UNSIGNED DEFAULT NULL,
  ruta                  VARCHAR(380) NOT NULL,
  nombreDoc             VARCHAR(350) NOT NULL,
  fechaSubida           DATE NOT NULL,
  tipo                  TINYINT UNSIGNED NOT NULL,
-- 1: inicio,
-- 2: actualizados,
-- 3: aval,
-- 4: avances,
-- 5: final
  numero                TINYINT UNSIGNED NOT NULL,
-- Para, en dado caso, saber cual es el archivo que se corrige

  PRIMARY KEY(idDocA),
  INDEX fk_documentosAsesoria_refProyecto_idx (refProyectoA DESC),
  CONSTRAINT fk_documentosAsesoria_refProyecto
    FOREIGN KEY (refProyectoA)
    REFERENCES Asesoria (idA)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE DocumentoInvestigacion(
  idDocI                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  refProyecto           INT UNSIGNED DEFAULT NULL,
  ruta                  VARCHAR(380) NOT NULL,
  nombreDoc             VARCHAR(350) NOT NULL,
  fechaSubida           DATE NOT NULL,
  tipo                  TINYINT UNSIGNED NOT NULL,
-- 1: inicio,
-- 2: actualizados,
-- 3: aval,
-- 4: avances,
-- 5: final
  numero                TINYINT UNSIGNED NOT NULL,
-- Para, en dado caso, saber cual es el archivo que se corrige

  PRIMARY KEY(idDocI),
  INDEX fk_documentos_refProyecto_idx (refProyecto DESC),
  CONSTRAINT fk_documentos_refProyecto
    FOREIGN KEY (refProyecto)
    REFERENCES Investigacion (idI)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,

);



/* SE AGREGARON CAMPOS NACIONALIDAD Y CEDULA A LAS TABLAS
ALTER TABLE `actualizacion` ADD `nacionalidad` VARCHAR(1) NULL DEFAULT NULL AFTER `tipo`, ADD `cedula` INT(12) UNSIGNED NULL DEFAULT NULL AFTER `nacionalidad`;
*/

/*SE AGREGO EL CAMPO FECHASTATUS A LAS TABLAS
ALTER TABLE `actualizacion` ADD `fechaStatus` DATETIME NOT NULL DEFAULT '2019-02-14 00:00:00' AFTER `status`;
*/
