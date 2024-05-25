USE tesis2;

DROP TABLE HistorialCambiosProducto;
DROP TABLE mensajes;
DROP TABLE chat;
DROP TABLE Comprador;
DROP TABLE Vendedor;
DROP TABLE PedidoXProducto;
DROP TABLE Pedidos;
DROP TABLE Producto;
DROP TABLE Tienda;
DROP TABLE MetodoPago;
DROP TABLE Usuario;
DROP TABLE blockchain;

CREATE TABLE Usuario (
    IdUsuario INT AUTO_INCREMENT PRIMARY KEY,
    Correo TEXT,
    CorreoAlternativo TEXT,
    contrasenha TEXT,
    ContrasenhaVariado Text,
    Token TEXT,
    Nombre Text,
    Apellido Text,
    DNI int,
    Telefono int,
    CantCambiosDireccion int,
    CantMetodoPago int,
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
    Estado INT
);

CREATE TABLE Tienda (
    IdTienda INT AUTO_INCREMENT PRIMARY KEY,
    Nombre TEXT,
    Descripcion TEXT,
    Direccion TEXT,
    Provincia Text,
    Pais text,
    Foto LONGBLOB,
    MotivoRechazo TEXT,
    UsuarioID INT NOT NULL,
    FOREIGN KEY (UsuarioID) REFERENCES Usuario(IdUsuario),
    Estado INT
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
    MotivoRechazo TEXT,
    TiendaID INT NOT NULL,
    FOREIGN KEY (TiendaID) REFERENCES Tienda(IdTienda),
    Estado boolean
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
    DireccionEntrega TEXT,
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

CREATE TABLE HistorialCambiosProducto (
    IdHistorialProducto INT AUTO_INCREMENT PRIMARY KEY,
    FechaHora Datetime,
    Descripcion TEXT,
    ProductoID INT NOT NULL,
    FOREIGN KEY (ProductoID) REFERENCES Producto(IdProducto)
);

CREATE TABLE HistorialCambiosTienda (
    IdHistorialCambiosTienda INT AUTO_INCREMENT PRIMARY KEY,
    FechaHora Datetime,
    Descripcion TEXT,
    TiendaID INT NOT NULL,
    FOREIGN KEY (TiendaID) REFERENCES Tienda(IdTienda)
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

CREATE TABLE MetodoPago(
	IdMetodoPago INT auto_increment PRIMARY KEY,
    Last4 INT,
    FechaExpiracion TEXT,
    Token TEXT,
    Cuenta TEXT,
    UsuarioID INT NOT NULL,
    Estado boolean,
    FOREIGN KEY (UsuarioID) REFERENCES Usuario(IdUsuario)
);

CREATE TABLE Blockchain(
	IdBlockchain INT auto_increment PRIMARY KEY,
    HashBlockchain TEXT
);

CREATE TABLE KeyEncript (
    IdKey INT AUTO_INCREMENT PRIMARY KEY,
    KeyVar Text
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

CREATE TABLE LlavesSTRIPE(
	ClaveStripePublica text,
    ClaveStripeSecreto text
);

/*************************************************/
DROP TABLE PRUEBA;
CREATE TABLE PRUEBA (
    IDPRUEBA INT auto_increment PRIMARY KEY,
    Contrasenha BLOB
);
SELECT * FROM PRUEBA;
INSERT INTO PRUEBA (Contrasenha) values (aes_encrypt('12345','tesis2'));
SELECT cast(aes_decrypt(Contrasenha,'tesis2') as CHAR) FROM PRUEBA;
/*************************************************/

ALTER INSTANCE ROTATE INNODB MASTER KEY;

ALTER TABLE PRUEBA ENCRYPTION='Y';

SELECT VERSION();

INSERT INTO LlavesSTRIPE (ClaveStripePublica, ClaveStripeSecreto) 
VALUES ('pk_test_51Oie68G77lj0glGvTr2uYiqcG0rIUCcZXorf26c8hcV7aKptz02DfQHY49fcB69JKjgHirxew6HXxMHpOwgiTGzp00cosFcBDA',
'sk_test_51Oie68G77lj0glGvYBwkFB9A0NoA8we1Gis7g46tEqt1czNNWaR5wAJBdTOD6MCfAW8jiXOa6QEU1LYICB66k28K00pAXrkJEw');

INSERT INTO CorreoEmisor(Correo, Contrasenha) VALUES ('test@sbperu.net','oyzlwfgvducseiga');

INSERT INTO Usuario (Correo, contrasenha, Token, Nombre, Apellido, DNI, Telefono, Direccion, EsAdministrador, EsComprador, EsVendedor) 
VALUES ('a20191425@pucp.edu.pe', 'henrypebe11', 'token123', 'Henry', 'Pebe', 12345678, 987654321, 'Calle 123', 1, 0, 0);

SELECT * FROM Usuario;
SELECT * FROM Blockchain;
SELECT * FROM HistorialCambiosProducto;
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
SELECT * FROM PedidoXProducto;
SELECT * FROM Chat;
SELECT * FROM MetodoPago;
SELECT * FROM Usuario WHERE Estado = 1;

ALTER TABLE Tienda MODIFY COLUMN Estado INT;
ALTER TABLE Usuario MODIFY COLUMN Foto LONGBLOB;
ALTER TABLE PedidoXProducto MODIFY COLUMN FechaEnvio Datetime;
ALTER TABLE Tienda CHANGE COLUMN Distrito Provincia TEXT;
ALTER TABLE Tienda ADD MotivoRechazo TEXT;
ALTER TABLE Producto ADD TiempoEnvio TEXT;
ALTER TABLE Pedidos ADD FechaCreacion Datetime;
ALTER TABLE Pedidos ADD TieneSeguimiento boolean;
ALTER TABLE Mensajes ADD EsTienda boolean;
ALTER TABLE MetodoPago DROP COLUMN Cuenta;
ALTER TABLE MetodoPago DROP COLUMN FechaEnvio;
ALTER TABLE Chat ADD FinalizarCliente boolean;
ALTER TABLE PedidoXProducto ADD FechaReclamo Datetime;

 UPDATE Usuario U
                    SET CantMetodoPago = (
                        SELECT COUNT(*)
                        FROM MetodoPago MP
                        WHERE MP.UsuarioID = U.IdUsuario AND MP.Estado = 1
                        AND IdUsuario = 3
                    )
                    WHERE IdUsuario = 3