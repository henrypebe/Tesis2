USE tesis2;

DROP TABLE Usuario;
DROP TABLE Comprador;
DROP TABLE Vendedor;
DROP TABLE mensajes;
DROP TABLE chats;

CREATE TABLE Usuario (
    IdUsuario INT AUTO_INCREMENT PRIMARY KEY,
    Correo TEXT,
    contrasenha TEXT,
    Token Text,
    ContrasenhaVariado Text,
    Foto BLOB,
    Nombre Text,
    Apellido Text,
    DNI int,
    Telefono int,
    Direccion text,
    EsAdministrador boolean,
    EsComprador boolean,
    EsVendedor boolean
);

CREATE TABLE Comprador(
	idComprador INT AUTO_INCREMENT PRIMARY KEY,
    usuarioId INT NOT NULL,
    FOREIGN KEY (usuarioId) REFERENCES Usuario(IdUsuario)
);

CREATE TABLE Vendedor(
	idVendedor INT AUTO_INCREMENT PRIMARY KEY,
    usuarioId INT NOT NULL,
    FOREIGN KEY (usuarioId) REFERENCES Usuario(IdUsuario)
);

CREATE TABLE Chats (
    IdChat INT AUTO_INCREMENT PRIMARY KEY,
    Estado TEXT,
    FechaEnvio datetime
);

CREATE TABLE Mensajes (
    IdMensaje INT AUTO_INCREMENT PRIMARY KEY,
    ChatId INT NOT NULL,
    Contenido TEXT,
    EmisorId INT NOT NULL,
    FOREIGN KEY (ChatId) REFERENCES Chats(IdChat),
    FOREIGN KEY (EmisorId) REFERENCES Usuario(IdUsuario),
    FechaEnvio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE KeyEncript (
    IdKey INT AUTO_INCREMENT PRIMARY KEY,
    KeyVar Text
);

INSERT INTO KeyEncript (KeyVar) 
VALUES ('tesis2');

INSERT INTO Usuario (Correo, contrasenha, Token, Nombre, Apellido, DNI, Telefono, Direccion, EsAdministrador, EsComprador, EsVendedor) 
VALUES ('a20191425@pucp.edu.pe', 'henrypebe11', 'token123', 'Henry', 'Pebe', 12345678, 987654321, 'Calle 123', 1, 0, 0);

SELECT * FROM Usuario;
SELECT * FROM Vendedor;
SELECT * FROM Comprador;
SELECT * FROM KeyEncript;