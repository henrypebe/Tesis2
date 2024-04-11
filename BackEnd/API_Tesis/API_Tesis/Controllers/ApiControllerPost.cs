using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;
using System.Text;
using Microsoft.EntityFrameworkCore;
using API_Tesis.BD;
using API_Tesis.Datos;
using MySqlConnector;
using System.Security.Cryptography;

namespace API_Tesis.Controllers
{
    [ApiController]
    public class ApiControllerPost: ControllerBase
    {
        private readonly BDMysql _context;
        private readonly IConfiguration _configuration;
        public ApiControllerPost(BDMysql context, IConfiguration configuration)
        {
            _configuration = configuration;
            _context = context;
        }
        [HttpPost]
        [Route("/login")]
        public async Task<IActionResult> VerificarUsuario(string _correo, string _contrasenha)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            int idUsuario = 0;
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    string query1 = "SELECT IdUsuario, EsAdministrador, EsComprador, EsVendedor FROM Usuario WHERE Correo = @Correo AND contrasenha = @Contrasenha";

                    using (MySqlCommand command1 = new MySqlCommand(query1, connection))
                    {
                        command1.Parameters.AddWithValue("@Correo", _correo);
                        command1.Parameters.AddWithValue("@Contrasenha", _contrasenha);

                        using (MySqlDataReader reader1 = command1.ExecuteReader())
                        {
                            if (reader1.Read())
                            {
                                idUsuario = reader1.GetInt32(0);
                                Guid token = Guid.NewGuid();
                                string tokenString = token.ToString();
                                reader1.Close();
                                string updateQuery = "UPDATE Usuario SET Token = @Token WHERE Correo = @Correo AND contrasenha = @Contrasenha";
                                using (MySqlCommand updateCommand = new MySqlCommand(updateQuery, connection))
                                {
                                    updateCommand.Parameters.AddWithValue("@Token", tokenString);
                                    updateCommand.Parameters.AddWithValue("@Contrasenha", _contrasenha);
                                    updateCommand.Parameters.AddWithValue("@Correo", _correo);
                                    updateCommand.ExecuteNonQuery();
                                }
                                string query2 = "SELECT Correo, Contrasenha FROM CorreoEmisor WHERE IdCorreoEmisor=1;";
                                using (MySqlCommand command2 = new MySqlCommand(query2, connection))
                                {
                                    using (MySqlDataReader reader2 = command2.ExecuteReader())
                                    {
                                        while (reader2.Read())
                                        {
                                            string correoOrigen = reader2.GetString("Correo");
                                            string contraseñaCorreo = reader2.GetString("Contrasenha");

                                            string asunto = $"Token de acceso para el login";
                                            StringBuilder htmlBody = new StringBuilder();
                                            htmlBody.Append("<h3>Se hace entrega del token para acceso al sistema:</h3>");
                                            htmlBody.Append($"<p>{tokenString}</p>");
                                            htmlBody.Append($"<p>Es importante mencionar que no debe de divulgar su token de acceso por seguridad.</p>");

                                            MailMessage message = new MailMessage
                                            {
                                                From = new MailAddress(correoOrigen, "Prueba Tesis 2"),
                                                Subject = asunto,
                                                Body = htmlBody.ToString(),
                                                IsBodyHtml = true
                                            };

                                            message.To.Add(_correo);

                                            SmtpClient clienteSmtp = new SmtpClient("smtp.gmail.com")
                                            {
                                                Port = 587,
                                                Credentials = new NetworkCredential(correoOrigen, contraseñaCorreo),
                                                EnableSsl = true
                                            };

                                            await clienteSmtp.SendMailAsync(message);
                                            Console.WriteLine("Correo enviado con la información de los tickets sin tareas.");
                                        }
                                    }
                                }
                            }
                        }
                        if (idUsuario == 0) idUsuario = -1;
                    }
                    connection.Close();
                }

                return Ok(idUsuario);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al enviar el correo: {ex.Message}");
                return BadRequest();
            }
        }
        [HttpPost]
        [Route("/CreateUsuario")]
        public async Task<ActionResult<int>> CrearUsuario(int DNI, string nombreApellido, string correo, string contrasenha, string contrasenhaVariado)
        {
            if (VerificarDNIExistente(DNI))
            {
                return BadRequest("El DNI ya está registrado");
            }
            if (VerificarCorreoExistente(correo))
            {
                return BadRequest("El correo electrónico ya está registrado");
            }
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();
                string secretKey;
                string query2 = "SELECT KeyVar FROM KeyEncript WHERE IdKey = 1";
                using (MySqlCommand command = new MySqlCommand(query2, connection))
                {
                    using (MySqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            secretKey = reader.GetString("KeyVar");
                        }
                        else
                        {
                            throw new Exception("No se encontró ningún secretKey en la tabla KeyEncript");
                        }
                    }
                }
                byte[] salt = Encoding.UTF8.GetBytes("saltValue");
                byte[] keyBytes = new Rfc2898DeriveBytes(secretKey, salt, 10000, HashAlgorithmName.SHA256).GetBytes(16);
                string base64Key = Convert.ToBase64String(keyBytes);
                string encryptedText = Encrypt(contrasenhaVariado, base64Key);
                string[] nombreApellidoArray = nombreApellido.Split(' ');
                string nombre = nombreApellidoArray[0];
                string apellido = nombreApellidoArray.Length > 1 ? nombreApellidoArray[1] : string.Empty;
                string query = "INSERT INTO Usuario (DNI, Nombre, Apellido, Correo, contrasenha, ContrasenhaVariado, Estado, EsAdministrador) " +
                    "VALUES (@DNI, @Nombre, @Apellido, @Correo, @Contrasenha, @ContrasenhaVariado, @Estado, @EsAdministrador)";
                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@DNI", DNI);
                    command.Parameters.AddWithValue("@Nombre", nombre);
                    command.Parameters.AddWithValue("@Apellido", apellido);
                    command.Parameters.AddWithValue("@Correo", correo);
                    command.Parameters.AddWithValue("@Contrasenha", contrasenha);
                    command.Parameters.AddWithValue("@ContrasenhaVariado", encryptedText);
                    command.Parameters.AddWithValue("@Estado", 1);
                    command.Parameters.AddWithValue("@EsAdministrador", false);

                    int rowsAffected = await command.ExecuteNonQueryAsync();

                    if (rowsAffected > 0)
                    {
                        command.CommandText = "SELECT LAST_INSERT_ID()";
                        int idUsuario = Convert.ToInt32(command.ExecuteScalar());
                        
                        return Ok(idUsuario);
                    }
                    else
                    {
                        return BadRequest();
                    }
                }
            }
        }
        [HttpPost]
        [Route("/CreateTienda")]
        public async Task<ActionResult<int>> CrearTienda(int idUsuario, string nombre, string descripcion, string direccion, string Provincia, string pais)
        {
            try
            {
                if (VerificarNombreTiendaExistente(nombre))
                {
                    return BadRequest("El nombre de la tienda ya está registrada");
                }
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    descripcion = descripcion.Replace('_', ' ');
                    direccion = direccion.Replace('_', ' ');
                    Provincia = Provincia.Replace('_', ' ');
                    connection.Open();
                    string query = @"INSERT INTO Tienda (Nombre, Descripcion, Direccion, Provincia, Pais, UsuarioID, Estado) 
                             VALUES (@Nombre, @Descripcion, @Direccion, @Provincia, @Pais, @UsuarioID, @Estado);
                             SELECT LAST_INSERT_ID();";
                    MySqlCommand command = new MySqlCommand(query, connection);
                    command.Parameters.AddWithValue("@Nombre", nombre);
                    command.Parameters.AddWithValue("@Descripcion", descripcion);
                    command.Parameters.AddWithValue("@Direccion", direccion);
                    command.Parameters.AddWithValue("@Provincia", Provincia);
                    command.Parameters.AddWithValue("@Pais", pais);
                    command.Parameters.AddWithValue("@UsuarioID", idUsuario);
                    command.Parameters.AddWithValue("@Estado", 1);
                    int idGenerado = Convert.ToInt32(await command.ExecuteScalarAsync());

                    string updateQuery = "UPDATE Vendedor SET TiendaID = @TiendaID WHERE usuarioId = @UsuarioID";
                    MySqlCommand updateCommand = new MySqlCommand(updateQuery, connection);
                    updateCommand.Parameters.AddWithValue("@TiendaID", idGenerado);
                    updateCommand.Parameters.AddWithValue("@UsuarioID", idUsuario);
                    await updateCommand.ExecuteNonQueryAsync();

                    return Ok(idGenerado);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpPost]
        [Route("/CreateProducto")]
        public async Task<ActionResult<int>> CrearProducto([FromForm] string nombre, [FromForm] double precio, [FromForm] int cantidad, [FromForm] IFormFile image, [FromForm] string descripcion, [FromForm] string cantidadOferta,
            [FromForm] string cantidadGarantia, [FromForm] string tipoProducto, [FromForm] string idTienda, [FromForm] double costoEnvio, [FromForm] string tiempoEnvio)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    descripcion = descripcion.Replace('_', ' ');
                    nombre = nombre.Replace('_', ' ');
                    cantidadGarantia = cantidadGarantia.Replace('_', ' ');
                    connection.Open();

                    byte[] imageBytes;
                    using (var ms = new MemoryStream())
                    {
                        image.CopyTo(ms);
                        imageBytes = ms.ToArray();
                    }

                    string query = @"INSERT INTO Producto (Nombre, Precio, Stock, Descripcion, CantidadOferta, CantidadGarantia, EstadoAprobacion, TipoProducto, TiendaID, Estado, Foto, FechaCreacion, CostoEnvio,
                     CantidadVentas, TiempoEnvio) VALUES (@Nombre, @Precio, @Stock, @Descripcion, @CantidadOferta, @CantidadGarantia, @EstadoAprobacion, @TipoProducto, @TiendaID, @Estado, @Foto, @FechaCreacion, 
                     @CostoEnvio, @CantidadVentas, @TiempoEnvio);
                     SELECT LAST_INSERT_ID();";
                    MySqlCommand command = new MySqlCommand(query, connection);
                    command.Parameters.AddWithValue("@Nombre", nombre);
                    command.Parameters.AddWithValue("@Precio", precio);
                    command.Parameters.AddWithValue("@Stock", cantidad);
                    command.Parameters.AddWithValue("@Descripcion", descripcion);
                    command.Parameters.AddWithValue("@CantidadOferta", cantidadOferta);
                    command.Parameters.AddWithValue("@CantidadGarantia", cantidadGarantia);
                    command.Parameters.AddWithValue("@EstadoAprobacion", "Pendiente");
                    command.Parameters.AddWithValue("@TipoProducto", tipoProducto);
                    command.Parameters.AddWithValue("@TiendaID", idTienda);
                    command.Parameters.AddWithValue("@Foto", imageBytes);
                    command.Parameters.AddWithValue("@FechaCreacion", DateTime.Now);
                    command.Parameters.AddWithValue("@CostoEnvio", costoEnvio);
                    command.Parameters.AddWithValue("@CantidadVentas", 0);
                    command.Parameters.AddWithValue("@TiempoEnvio", tiempoEnvio);
                    command.Parameters.AddWithValue("@Estado", 1);
                    int idGenerado = Convert.ToInt32(await command.ExecuteScalarAsync());

                    return Ok(idGenerado);
                    //return Ok();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpPost]
        [Route("/CreatePedido")]
        public async Task<ActionResult<int>> CrearPedido([FromForm] DateTime FechaEntrega, [FromForm] double Total, [FromForm] int Estado, [FromForm] int CantidadProductos,
            [FromForm] string MetodoPago, [FromForm] int UsuarioID)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = @"INSERT INTO Pedidos (FechaEntrega, Total, Estado, Reclamo, CantidadProductos, MetodoPago, FechaCreacion, UsuarioID) VALUES 
                    (@FechaEntrega, @Total, @Estado, @Reclamo, @CantidadProductos, @MetodoPago, @FechaCreacion, @UsuarioID);
                     SELECT LAST_INSERT_ID();";
                    MySqlCommand command = new MySqlCommand(query, connection);
                    command.Parameters.AddWithValue("@FechaEntrega", FechaEntrega);
                    command.Parameters.AddWithValue("@Total", Total);
                    command.Parameters.AddWithValue("@Estado", Estado);
                    command.Parameters.AddWithValue("@Reclamo", 0);
                    command.Parameters.AddWithValue("@CantidadProductos", CantidadProductos);
                    command.Parameters.AddWithValue("@MetodoPago", MetodoPago);
                    command.Parameters.AddWithValue("@FechaCreacion", DateTime.Now);
                    command.Parameters.AddWithValue("@UsuarioID", UsuarioID);
                    int idGenerado = Convert.ToInt32(await command.ExecuteScalarAsync());

                    return Ok(idGenerado);
                    //return Ok();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpPost]
        [Route("/CreatePedidoXProducto")]
        public async Task<ActionResult<int>> CrearPedido(int productoId, int pedidoId, int cantidad, int stock)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = @"INSERT INTO PedidoXProducto (ProductoID, PedidoID, Cantidad, TieneSeguimiento, TieneReclamo) VALUES 
                    (@ProductoID, @PedidoID, @Cantidad, @TieneSeguimiento, @TieneReclamo);
                     SELECT LAST_INSERT_ID();";
                    MySqlCommand command = new MySqlCommand(query, connection);
                    command.Parameters.AddWithValue("@ProductoID", productoId);
                    command.Parameters.AddWithValue("@PedidoID", pedidoId);
                    command.Parameters.AddWithValue("@Cantidad", cantidad);
                    command.Parameters.AddWithValue("@TieneSeguimiento", 0);
                    command.Parameters.AddWithValue("@TieneReclamo", 0);
                    int idGenerado = Convert.ToInt32(await command.ExecuteScalarAsync());

                    string query2 = "UPDATE Producto SET Stock = @Stock, CantidadVentas = CantidadVentas + 1 WHERE IdProducto = @IdProducto AND Estado = 1";
                    MySqlCommand command2 = new MySqlCommand(query2, connection);
                    int diferencia = stock - cantidad;
                    command2.Parameters.AddWithValue("@IdProducto", productoId);
                    command2.Parameters.AddWithValue("@Stock", diferencia);
                    int rowsAffected = await command2.ExecuteNonQueryAsync();

                    return Ok(idGenerado);
                    //return Ok();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpPost]
        [Route("/CreateMensaje")]
        public async Task<ActionResult<int>> CreateMensaje(int ChatId, int EmisorId, string Contenido)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = @"INSERT INTO Mensajes (ChatId, Contenido, EmisorId, FechaEnvio, EsTienda) VALUES 
                    (@ChatId, @Contenido, @EmisorId, @FechaEnvio, @EsTienda);
                     SELECT LAST_INSERT_ID();";
                    MySqlCommand command = new MySqlCommand(query, connection);
                    command.Parameters.AddWithValue("@ChatId", ChatId);
                    command.Parameters.AddWithValue("@Contenido", Contenido);
                    command.Parameters.AddWithValue("@EmisorId", EmisorId);
                    command.Parameters.AddWithValue("@FechaEnvio", DateTime.Now);
                    command.Parameters.AddWithValue("@EsTienda", 0);
                    int idGenerado = Convert.ToInt32(await command.ExecuteScalarAsync());

                    return Ok(idGenerado);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpPost]
        [Route("/CreateMensajeTienda")]
        public async Task<ActionResult<int>> CreateMensajeTienda(int ChatId, int EmisorId, string Contenido)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = @"INSERT INTO Mensajes (ChatId, Contenido, EmisorId, FechaEnvio, EsTienda) VALUES 
                    (@ChatId, @Contenido, @EmisorId, @FechaEnvio, @EsTienda);
                     SELECT LAST_INSERT_ID();";
                    MySqlCommand command = new MySqlCommand(query, connection);
                    command.Parameters.AddWithValue("@ChatId", ChatId);
                    command.Parameters.AddWithValue("@Contenido", Contenido);
                    command.Parameters.AddWithValue("@EmisorId", EmisorId);
                    command.Parameters.AddWithValue("@FechaEnvio", DateTime.Now);
                    command.Parameters.AddWithValue("@EsTienda", 1);
                    int idGenerado = Convert.ToInt32(await command.ExecuteScalarAsync());

                    return Ok(idGenerado);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpPost]
        [Route("/CambiarEstadoUsuario")]
        public async Task<ActionResult> EliminarUsuario(int idUsuario, string contrasenha, string token)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");

                // Abrir una nueva conexión para ejecutar la consulta
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    // Consulta para obtener el estado del usuario
                    string selectUserQuery = "SELECT EsVendedor, ContrasenhaVariado, Token FROM Usuario WHERE IdUsuario = @IdUsuario AND Estado = 1";
                    using (MySqlCommand selectUserCommand = new MySqlCommand(selectUserQuery, connection))
                    {
                        selectUserCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);

                        // Ejecutar la consulta y leer el resultado
                        using (var reader = await selectUserCommand.ExecuteReaderAsync())
                        {
                            if (reader.Read())
                            {
                                string ContrasenhaVariado = reader.GetString("ContrasenhaVariado");
                                string Token = reader.GetString("Token");
                                bool esVendedor = reader.GetBoolean("EsVendedor");
                                await connection.CloseAsync();
                                await connection.OpenAsync();
                                string secretKey;
                                string query2 = "SELECT KeyVar FROM KeyEncript WHERE IdKey = 1";
                                using (MySqlCommand command = new MySqlCommand(query2, connection))
                                {
                                    using (MySqlDataReader _reader = await command.ExecuteReaderAsync())
                                    {
                                        if (await _reader.ReadAsync())
                                        {
                                            secretKey = _reader.GetString("KeyVar");
                                        }
                                        else
                                        {
                                            throw new Exception("No se encontró ningún secretKey en la tabla KeyEncript");
                                        }
                                    }
                                }
                                byte[] salt = Encoding.UTF8.GetBytes("saltValue");
                                byte[] keyBytes = new Rfc2898DeriveBytes(secretKey, salt, 10000, HashAlgorithmName.SHA256).GetBytes(16);
                                string base64Key = Convert.ToBase64String(keyBytes);
                                string decryptedText = Decrypt(ContrasenhaVariado, base64Key);

                                if (decryptedText == contrasenha && token == Token)
                                {
                                    await connection.CloseAsync();
                                    await connection.OpenAsync();

                                    string updateUserQuery = "UPDATE Usuario SET Estado = @Estado WHERE IdUsuario = @IdUsuario";
                                    using (MySqlCommand updateUserCommand = new MySqlCommand(updateUserQuery, connection))
                                    {
                                        updateUserCommand.Parameters.AddWithValue("@Estado", 0);
                                        updateUserCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                                        await updateUserCommand.ExecuteNonQueryAsync();
                                    }

                                    if (esVendedor)
                                    {
                                        await connection.CloseAsync();
                                        await connection.OpenAsync();

                                        string updateTiendasQuery = "UPDATE Tienda SET Estado = @Estado WHERE UsuarioID = @UsuarioID";
                                        using (MySqlCommand updateTiendasCommand = new MySqlCommand(updateTiendasQuery, connection))
                                        {
                                            updateTiendasCommand.Parameters.AddWithValue("@Estado", 0);
                                            updateTiendasCommand.Parameters.AddWithValue("@UsuarioID", idUsuario);
                                            await updateTiendasCommand.ExecuteNonQueryAsync();
                                        }
                                    }

                                    return Ok();
                                }
                                else
                                {
                                    return NotFound();
                                }
                            }
                            else
                            {
                                return NotFound();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        private bool VerificarCorreoExistente(string correo)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();

                string query = "SELECT COUNT(*) FROM Usuario WHERE Correo = @Correo AND Estado = 1";

                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Correo", correo);

                    int count = Convert.ToInt32(command.ExecuteScalar());

                    connection.Close();
                    // Si count es mayor que cero, significa que el correo ya está registrado
                    return count > 0;
                }
            }
        }
        private bool VerificarDNIExistente(int DNI)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();

                string query = "SELECT COUNT(*) FROM Usuario WHERE DNI = @DNI AND Estado = 1";

                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@DNI", DNI);

                    int count = Convert.ToInt32(command.ExecuteScalar());

                    connection.Close();
                    // Si count es mayor que cero, significa que el correo ya está registrado
                    return count > 0;
                }
            }
        }
        private bool VerificarNombreTiendaExistente(string nombreTienda)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();

                string query = "SELECT COUNT(*) FROM Tienda WHERE Nombre = @Nombre AND Estado = 1";

                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Nombre", nombreTienda);

                    int count = Convert.ToInt32(command.ExecuteScalar());

                    connection.Close();
                    // Si count es mayor que cero, significa que el correo ya está registrado
                    return count > 0;
                }
            }
        }
        public static string Encrypt(string plainText, string key)
        {
            try
            {
                using (Aes aesAlg = Aes.Create())
                {
                    aesAlg.Key = Encoding.UTF8.GetBytes(key);
                    aesAlg.IV = new byte[16]; // Usar un IV (Initialization Vector) seguro para AES

                    ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                    using (MemoryStream msEncrypt = new MemoryStream())
                    {
                        using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                        {
                            using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                            {
                                swEncrypt.Write(plainText);
                            }
                        }
                        return Convert.ToBase64String(msEncrypt.ToArray());
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error durante la encriptación: " + ex.Message);
                return null;
            }
        }
        public static string Decrypt(string cipherText, string key)
        {
            byte[] cipherBytes = Convert.FromBase64String(cipherText);

            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Encoding.UTF8.GetBytes(key);
                aesAlg.IV = new byte[16]; // Usar el mismo IV que se usó para encriptar

                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                using (MemoryStream msDecrypt = new MemoryStream(cipherBytes))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {
                            return srDecrypt.ReadToEnd();
                        }
                    }
                }
            }
        }
        private string ConvertirBytesAImagen(byte[] bytesImagen)
        {
            if (bytesImagen != null)
            {
                string base64String = Convert.ToBase64String(bytesImagen);
                return $"data:image/jpeg;base64,{base64String}";
            }
            else
            {
                return null;
            }
        }
    }
}
