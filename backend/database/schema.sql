-- Script de creación de la base de datos del Sistema de Gestión de Soporte Técnico.
-- Se puede ejecutar varias veces: borra y vuelve a crear la tabla con datos de ejemplo.

CREATE DATABASE IF NOT EXISTS soporte_tickets
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE soporte_tickets;

DROP TABLE IF EXISTS tickets;

CREATE TABLE tickets (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  asunto         VARCHAR(100)  NOT NULL,
  solicitante    VARCHAR(80)   NOT NULL,
  descripcion    VARCHAR(1000) NOT NULL,
  categoria      ENUM('Hardware', 'Software', 'Red', 'Cuentas y accesos', 'Otro') NOT NULL,
  prioridad      ENUM('Baja', 'Media', 'Alta', 'Crítica') NOT NULL,
  estado         ENUM('Abierto', 'En progreso', 'Resuelto', 'Cerrado') NOT NULL DEFAULT 'Abierto',
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Datos de ejemplo
INSERT INTO tickets (asunto, solicitante, descripcion, categoria, prioridad, estado) VALUES
('Impresora del piso 2 no imprime', 'Ana Pérez', 'La impresora muestra el mensaje "atasco de papel" pero no tiene papel atascado.', 'Hardware', 'Media', 'Abierto'),
('No puedo ingresar al correo', 'Carlos Muñoz', 'Al iniciar sesión en el correo corporativo aparece "contraseña incorrecta" aunque la acabo de cambiar.', 'Cuentas y accesos', 'Alta', 'En progreso'),
('Sin conexión a internet en bodega', 'Luis Soto', 'Los equipos de la bodega no tienen conexión a internet desde esta mañana.', 'Red', 'Crítica', 'Abierto'),
('Instalar Office en notebook nuevo', 'María González', 'Se necesita instalar el paquete Office en el notebook asignado al nuevo integrante del área contable.', 'Software', 'Baja', 'Resuelto');