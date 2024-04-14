USE tesis2;

DROP TABLE Comprador;
DROP TABLE Vendedor;
DROP TABLE Usuario;
DROP TABLE mensajes;
DROP TABLE chat;
DROP TABLE Tienda;
DROP TABLE Producto;
DROP TABLE HistorialProducto;
DROP TABLE Pedidos;
DROP TABLE PedidoXProducto;

CREATE TABLE Usuario (
    IdUsuario INT AUTO_INCREMENT PRIMARY KEY,
    Correo TEXT,
    contrasenha TEXT,
    ContrasenhaVariado Text,
    Token TEXT,
    Nombre Text,
    Apellido Text,
    DNI int,
    Telefono int,
    Direccion text,
    EsAdministrador boolean,
    EsComprador boolean,
    EsVendedor boolean,
    Estado boolean
);

CREATE TABLE Comprador(
	idComprador INT AUTO_INCREMENT PRIMARY KEY,
    usuarioId INT NOT NULL,
    FOREIGN KEY (usuarioId) REFERENCES Usuario(IdUsuario),
    Estado boolean
);

CREATE TABLE Vendedor(
	idVendedor INT AUTO_INCREMENT PRIMARY KEY,
    esAdministrador boolean,
    usuarioId INT NOT NULL,
    TiendaID INT,
    FOREIGN KEY (usuarioId) REFERENCES Usuario(IdUsuario),
    Estado boolean
);

CREATE TABLE Chat (
    IdChat INT AUTO_INCREMENT PRIMARY KEY,
    Estado TEXT,
    FechaCreacion datetime,
    FinalizarCliente bool,
    CompradorID INT NOT NULL,
    TiendaID INT NOT NULL,
    PedidoXProductoID INT NOT NULL,
    FOREIGN KEY (PedidoXProductoID) REFERENCES PedidoXProducto(IdPedidoXProducto),
    FOREIGN KEY (CompradorID) REFERENCES Usuario(IdUsuario)
);

CREATE TABLE Mensajes (
    IdMensaje INT AUTO_INCREMENT PRIMARY KEY,
    ChatId INT NOT NULL,
    Contenido TEXT,
    EsTienda boolean,
    EmisorId INT NOT NULL,
    FOREIGN KEY (ChatId) REFERENCES Chat(IdChat),
    FOREIGN KEY (EmisorId) REFERENCES Usuario(IdUsuario),
    FechaEnvio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE KeyEncript (
    IdKey INT AUTO_INCREMENT PRIMARY KEY,
    KeyVar Text
);

CREATE TABLE Tienda (
    IdTienda INT AUTO_INCREMENT PRIMARY KEY,
    Nombre TEXT,
    Descripcion TEXT,
    Direccion TEXT,
    Provincia Text,
    Pais text,
    Foto LONGBLOB,
    UsuarioID INT NOT NULL,
    FOREIGN KEY (UsuarioID) REFERENCES Usuario(IdUsuario),
    Estado boolean
);

CREATE TABLE Producto (
    IdProducto INT AUTO_INCREMENT PRIMARY KEY,
    Nombre TEXT,
    Precio Double,
    Stock int,
    FechaCreacion datetime,
    Descripcion TEXT,
    CantidadOferta Double,
    CostoEnvio Double,
    TiempoEnvio TEXT,
    Foto LONGBLOB,
    CantidadGarantia TEXT,
    EstadoAprobacion TEXT,
    TipoProducto TEXT,
    CantidadVentas INT,
    TiendaID INT NOT NULL,
    FOREIGN KEY (TiendaID) REFERENCES Tienda(IdTienda),
    Estado boolean
);

CREATE TABLE HistorialCambiosProducto (
    IdHistorialProducto INT AUTO_INCREMENT PRIMARY KEY,
    FechaHora Datetime,
    Descripcion TEXT,
    ProductoID INT NOT NULL,
    FOREIGN KEY (ProductoID) REFERENCES Producto(IdProducto)
);

CREATE TABLE Pedidos(
	IdPedido INT AUTO_INCREMENT PRIMARY KEY,
    FechaEntrega TEXT,
    FechaCreacion Datetime,
    Total Double,
    TotalDescuento Double,
    Estado int,
    Reclamo boolean,
	CantidadProductos int,
    MetodoPago TEXT,
    CostoEnvio Double,
    UsuarioID INT NOT NULL,
    FOREIGN KEY (UsuarioID) REFERENCES Usuario(IdUsuario)
);

CREATE TABLE PedidoXProducto(
	IdPedidoXProducto INT AUTO_INCREMENT PRIMARY KEY,
    ProductoID INT NOT NULL,
    PedidoID INT NOT NULL,
    Cantidad INT,
    FechaEnvio Datetime,
    TieneSeguimiento boolean,
    TieneReclamo boolean,
    FechaReclamo datetime,
    FOREIGN KEY (ProductoID) REFERENCES Producto(IdProducto),
    FOREIGN KEY (PedidoID) REFERENCES Pedidos(IdPedido)
);

CREATE TABLE CorreoEmisor(
	IdCorreoEmisor INT auto_increment PRIMARY KEY,
    Correo TEXT,
    Contrasenha TEXT
);

CREATE TABLE Facturacion(
	IdFacturacion INT auto_increment PRIMARY KEY,
    Fecha date,
    CantidadCompra DOUBLE,
    PedidoID INT NOT NULL,
    FOREIGN KEY (PedidoID) REFERENCES Pedidos(IdPedido)
);

INSERT INTO KeyEncript (KeyVar) 
VALUES ('tesis2');

INSERT INTO CorreoEmisor(Correo, Contrasenha) VALUES ('test@sbperu.net','oyzlwfgvducseiga');

INSERT INTO Usuario (Correo, contrasenha, Token, Nombre, Apellido, DNI, Telefono, Direccion, EsAdministrador, EsComprador, EsVendedor) 
VALUES ('a20191425@pucp.edu.pe', 'henrypebe11', 'token123', 'Henry', 'Pebe', 12345678, 987654321, 'Calle 123', 1, 0, 0);

SELECT * FROM Usuario;
SELECT * FROM Vendedor;
SELECT * FROM Comprador;
SELECT * FROM KeyEncript;
SELECT * FROM Tienda;
SELECT * FROM Chat;
SELECT * FROM PedidoXProducto;
SELECT * FROM Mensajes;
SELECT * FROM CorreoEmisor;
SELECT * FROM Producto;
SELECT * FROM Pedidos;
SELECT * FROM Chat;
SELECT * FROM Usuario WHERE Estado = 1;

ALTER TABLE Producto MODIFY COLUMN Foto LONGBLOB;
ALTER TABLE Usuario MODIFY COLUMN Foto LONGBLOB;
ALTER TABLE PedidoXProducto MODIFY COLUMN FechaEnvio Datetime;
ALTER TABLE Tienda CHANGE COLUMN Distrito Provincia TEXT;
ALTER TABLE PedidoXProducto ADD FechaEnvio Datetime;
ALTER TABLE Producto ADD TiempoEnvio TEXT;
ALTER TABLE Pedidos ADD FechaCreacion Datetime;
ALTER TABLE Pedidos ADD TieneSeguimiento boolean;
ALTER TABLE Mensajes ADD EsTienda boolean;
ALTER TABLE PedidoXProducto DROP COLUMN FechaEnvio;
ALTER TABLE Chat ADD FinalizarCliente boolean;
ALTER TABLE PedidoXProducto ADD FechaReclamo Datetime;

SELECT SUM(p.Total + p.CostoEnvio) FROM Pedidos p
INNER JOIN PedidoXProducto pp ON pp.PedidoID = p.IdPedido
INNER JOIN Producto pr ON pr.IdProducto = pp.ProductoID
WHERE pr.TiendaID = 1 AND p.Estado = 2;

SELECT SUM(p.Total + p.CostoEnvio) FROM Pedidos p
INNER JOIN PedidoXProducto pp ON pp.PedidoID = p.IdPedido
INNER JOIN Producto pr ON pr.IdProducto = pp.ProductoID
WHERE pr.TiendaID = 1 AND p.Estado = 1;

SELECT COUNT(distinct p.IdPedido) FROM Pedidos p
INNER JOIN PedidoXProducto pp ON pp.PedidoID = p.IdPedido
INNER JOIN Producto pr ON pr.IdProducto = pp.ProductoID
WHERE pr.TiendaID = 1 AND p.Estado = 2;

SELECT COUNT(distinct p.IdPedido) FROM Pedidos p
INNER JOIN PedidoXProducto pp ON pp.PedidoID = p.IdPedido
INNER JOIN Producto pr ON pr.IdProducto = pp.ProductoID
WHERE pr.TiendaID = 1 AND p.Estado = 1;

SELECT COUNT(Distinct IdProducto) FROM Producto pr 
WHERE pr.EstadoAprobacion = 'Aprobado' AND pr.TiendaID = 1;

SELECT pr.Nombre FROM Producto pr 
WHERE pr.TiendaID = 1 AND pr.CantidadVentas =
	(SELECT MAX(CantidadVentas) FROM Producto pro WHERE pro.Estado = 1 AND pro.TiendaID = 1);
    
SELECT COUNT(Distinct IdChat) FROM Chat c WHERE c.TiendaID = 1 AND c.FinalizarCliente = 0;

SELECT 
    (SELECT COUNT(pp.IdPedidoXProducto) 
     FROM PedidoXProducto pp 
     INNER JOIN Producto pr ON pp.ProductoID = pr.IdProducto 
     WHERE pp.TieneReclamo = 0 AND pr.TiendaID = 1)
     /
    (SELECT COUNT(pp.IdPedidoXProducto) 
     FROM PedidoXProducto pp 
     INNER JOIN Producto pr ON pp.ProductoID = pr.IdProducto 
     WHERE pr.TiendaID = 1) AS Resultado;
     
SELECT COUNT(pp.IdPedidoXProducto) 
     FROM PedidoXProducto pp 
     INNER JOIN Producto pr ON pp.ProductoID = pr.IdProducto 
     WHERE pp.TieneReclamo = 1 AND pr.TiendaID = 1;
     
     SELECT SUM(p.Total + p.CostoEnvio) 
                         FROM Pedidos p 
                         INNER JOIN PedidoXProducto pp ON pp.PedidoID = p.IdPedido 
                         INNER JOIN Producto pr ON pr.IdProducto = pp.ProductoID 
                         WHERE pr.TiendaID = 1 AND p.Estado = 2