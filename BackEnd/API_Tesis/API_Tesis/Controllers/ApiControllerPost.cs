using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;
using System.Text;
using Microsoft.EntityFrameworkCore;
using API_Tesis.BD;
using API_Tesis.Datos;
using MySqlConnector;
using System.Security.Cryptography;
using Stripe;

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
                    string query1 = "SELECT IdUsuario, Estado, EsAdministrador, EsComprador, EsVendedor, Contrasenha FROM Usuario WHERE Correo = @Correo";

                    using (MySqlCommand command1 = new MySqlCommand(query1, connection))
                    {
                        command1.Parameters.AddWithValue("@Correo", _correo);
                        using (MySqlDataReader reader1 = command1.ExecuteReader())
                        {
                            if (reader1.Read())
                            {
                                string contrasenhaUsuario = reader1.GetString("Contrasenha");
                                if (contrasenhaUsuario != _contrasenha)
                                {
                                    return BadRequest("La contraseña no es correcta.");
                                }

                                int estadoUsuario = reader1.GetInt32("Estado");
                                if (estadoUsuario == 0)
                                {
                                    return BadRequest("El usuario está eliminado.");
                                }

                                idUsuario = reader1.GetInt32("IdUsuario");
                                Guid token = Guid.NewGuid();
                                string tokenString = token.ToString();
                                reader1.Close();

                                // Actualizar el token solo si el usuario está activo
                                string updateQuery = "UPDATE Usuario SET Token = @Token WHERE Correo = @Correo";
                                using (MySqlCommand updateCommand = new MySqlCommand(updateQuery, connection))
                                {
                                    updateCommand.Parameters.AddWithValue("@Token", tokenString);
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

                                            DateTime now = DateTime.Now;

                                            string formattedDate = now.ToString("dd/MM/yyyy HH:mm");
                                            string asunto = $"Token de acceso para el login - {formattedDate}";
                                            StringBuilder htmlBody = new StringBuilder();
                                            htmlBody.Append("<h3>Se hace entrega del token para acceso al sistema:</h3>");
                                            htmlBody.Append($"<b><p>{tokenString}</p></b>");
                                            htmlBody.Append($"<p>Es importante mencionar que no debe de divulgar su token de acceso por seguridad.</p>");

                                            MailMessage message = new MailMessage
                                            {
                                                From = new MailAddress(correoOrigen, "Notificaciones E-Commerce"),
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

                                Console.WriteLine("Correo enviado con la información de los tickets sin tareas.");
                            }
                            else
                            {
                                return BadRequest("El usuario no existe en el sistema.");
                            }
                        }
                        //command1.Parameters.AddWithValue("@Contrasenha", _contrasenha);

                        
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
        [Route("/EnviarCorreo")]
        public async Task<IActionResult> EnviarCorreo(int idUsuario)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    string query1 = "SELECT CorreoAlternativo FROM Usuario WHERE IdUsuario = @IdUsuario AND Estado = 1";

                    using (MySqlCommand command1 = new MySqlCommand(query1, connection))
                    {
                        command1.Parameters.AddWithValue("@IdUsuario", idUsuario);

                        using (MySqlDataReader reader1 = command1.ExecuteReader())
                        {
                            if (reader1.Read())
                            {
                                string correoAlternativo = reader1.GetString("CorreoAlternativo");
                                reader1.Close();
                                Guid token = Guid.NewGuid();
                                string tokenString = token.ToString();

                                string updateQuery = "UPDATE Usuario SET Token = @Token WHERE IdUsuario = @IdUsuario";
                                using (MySqlCommand updateCommand = new MySqlCommand(updateQuery, connection))
                                {
                                    updateCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                                    updateCommand.Parameters.AddWithValue("@Token", tokenString);
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

                                            DateTime now = DateTime.Now;

                                            string formattedDate = now.ToString("dd/MM/yyyy HH:mm");
                                            string asunto = $"Token para la verificación de la transacción - {formattedDate}";

                                            StringBuilder htmlBody = new StringBuilder();
                                            htmlBody.Append("<h3>Ingrese este token para la verificación de la transacción sospechosa:</h3>");
                                            htmlBody.Append($"<b><p>{tokenString}</p></b>");
                                            htmlBody.Append($"<p>Es importante mencionar que no debe de divulgar su token de acceso por seguridad.</p>");

                                            MailMessage message = new MailMessage
                                            {
                                                From = new MailAddress(correoOrigen, "Notificaciones E-Commerce"),
                                                Subject = asunto,
                                                Body = htmlBody.ToString(),
                                                IsBodyHtml = true
                                            };

                                            message.To.Add(correoAlternativo);

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
                            else
                            {
                                return BadRequest("El usuario no existe en el sistema");
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
        public async Task<IActionResult> CrearUsuario(int DNI, string nombreApellido, string correo, string contrasenha, string contrasenhaVariado)
        {
            (int countDNI, bool estadoUsuarioDNI) = VerificarDNIExistente(DNI);
            if (countDNI>0)
            {
                if (estadoUsuarioDNI) return BadRequest("El DNI ya está registrado");
            }
            (int count, bool estadoUsuario, int idUsuarioExistente) = VerificarCorreoExistente(correo);
            if (count>0)
            {
                if(estadoUsuario) return BadRequest("El correo electrónico ya está registrado");
            }
            if(!(count>0))
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string secretKey;
                    //Llamado a la clave almacenada en la base de datos
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
                    //Inicio de la encriptación
                    byte[] salt = Encoding.UTF8.GetBytes("saltValue");
                    byte[] keyBytes = new Rfc2898DeriveBytes(secretKey, salt, 10000, HashAlgorithmName.SHA256).GetBytes(16);
                    string base64Key = Convert.ToBase64String(keyBytes);
                    string encryptedText = Encrypt(contrasenhaVariado, base64Key);
                    
                    string[] nombreApellidoArray = nombreApellido.Split(' ');
                    string nombre = nombreApellidoArray[0];
                    string apellido = nombreApellidoArray.Length > 1 ? nombreApellidoArray[1] : string.Empty;
                    string query = "INSERT INTO Usuario (DNI, Nombre, Apellido, Correo, contrasenha, ContrasenhaVariado, Estado, EsAdministrador, CantCambiosDireccion, CantMetodoPago) " +
                        "VALUES (@DNI, @Nombre, @Apellido, @Correo, @Contrasenha, @ContrasenhaVariado, @Estado, @EsAdministrador, @CantCambiosDireccion, @CantMetodoPago)";
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
                        command.Parameters.AddWithValue("@CantCambiosDireccion", 0);
                        command.Parameters.AddWithValue("@CantMetodoPago", 0);

                        int rowsAffected = await command.ExecuteNonQueryAsync();

                        if (rowsAffected > 0)
                        {
                            command.CommandText = "SELECT LAST_INSERT_ID()";
                            int idUsuario = Convert.ToInt32(command.ExecuteScalar());
                            idUsuarioExistente = idUsuario;

                            return Ok(new { idUsuarioExistente, existente = false });
                        }
                        else
                        {
                            return BadRequest();
                        }
                    }
                }
            }
            else
            {
                try
                {
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
                        string query = @"UPDATE Usuario SET DNI = @DNI, Nombre=@Nombre, Apellido=@Apellido, Correo=@Correo, Contrasenha=@Contrasenha, Estado=@Estado " +
                           "WHERE IdUsuario = @IdUsuario";
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
                            command.Parameters.AddWithValue("@IdUsuario", idUsuarioExistente);

                            int rowsAffected = await command.ExecuteNonQueryAsync();

                            if (rowsAffected > 0)
                            {
                                return Ok(new { idUsuarioExistente, existente = true });
                            }
                            else
                            {
                                return BadRequest();
                            }
                        }
                    }
                }
                catch(Exception ex)
                {
                    Console.WriteLine(ex);
                    return NotFound();
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
                    command.Parameters.AddWithValue("@Estado", 2);
                    int idGenerado = Convert.ToInt32(await command.ExecuteScalarAsync());

                    string updateQuery = "UPDATE Vendedor SET TiendaID = @TiendaID WHERE usuarioId = @UsuarioID";
                    MySqlCommand updateCommand = new MySqlCommand(updateQuery, connection);
                    updateCommand.Parameters.AddWithValue("@TiendaID", idGenerado);
                    updateCommand.Parameters.AddWithValue("@UsuarioID", idUsuario);
                    await updateCommand.ExecuteNonQueryAsync();

                    await connection.OpenAsync();
                    query = @"INSERT INTO HistorialCambiosTienda (FechaHora, Descripcion, TiendaID) VALUES (@FechaHora, @Descripcion, @idGenerado)";
                    command = new MySqlCommand(query, connection);
                    command.Parameters.AddWithValue("@FechaHora", DateTime.Now);
                    command.Parameters.AddWithValue("@Descripcion", "Se realizó la creación de la tienda");
                    command.Parameters.AddWithValue("@idGenerado", idGenerado);
                    await command.ExecuteScalarAsync();
                    await connection.CloseAsync();

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
        public async Task<ActionResult<int>> CrearProducto([FromForm] string nombre, [FromForm] double precio, [FromForm] int cantidad, [FromForm] IFormFile image, [FromForm] string descripcion,
            [FromForm] double cantidadOferta, [FromForm] string cantidadGarantia, [FromForm] string tipoProducto, [FromForm] string idTienda, [FromForm] double costoEnvio,
            [FromForm] string tiempoEnvio, [FromForm] string tallaSeleccionada, [FromForm] string colorSeleccionado)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    descripcion = descripcion.Replace('_', ' ');
                    nombre = nombre.Replace('_', ' ');
                    cantidadGarantia = cantidadGarantia.Replace('_', ' ');
                    await connection.OpenAsync();

                    // Verificación previa de existencia del producto
                    if (tipoProducto == "Vestimenta")
                    {
                        string checkQuery = @"SELECT COUNT(*) FROM Producto p
                                      JOIN TallaVestimenta t ON p.IdProducto = t.IdProducto
                                      WHERE p.Nombre = @Nombre AND p.TipoProducto = @TipoProducto 
                                      AND ((@TallaSeleccionada = 'Short (S)' AND t.SBoolean = TRUE) OR
                                           (@TallaSeleccionada = 'Medium (M)' AND t.MBoolean = TRUE) OR
                                           (@TallaSeleccionada = 'Large (L)' AND t.LBoolean = TRUE) OR
                                           (@TallaSeleccionada = 'XL (Extra Large)' AND t.XLBoolean = TRUE) OR
                                           (@TallaSeleccionada = 'XXL (Extra Extra Large)' AND t.XXLBoolean = TRUE))
                                      AND p.TiendaID = @TiendaID";

                        MySqlCommand checkCommand = new MySqlCommand(checkQuery, connection);
                        checkCommand.Parameters.AddWithValue("@Nombre", nombre);
                        checkCommand.Parameters.AddWithValue("@TipoProducto", tipoProducto);
                        checkCommand.Parameters.AddWithValue("@TiendaID", idTienda);
                        checkCommand.Parameters.AddWithValue("@TallaSeleccionada", tallaSeleccionada);

                        int existingCount = Convert.ToInt32(await checkCommand.ExecuteScalarAsync());
                        if (existingCount > 0)
                        {
                            return BadRequest("Ya existe un producto con el mismo nombre, tipo Vestimenta y talla en esta tienda.");
                        }
                    }

                    // Conversión de la imagen a bytes
                    byte[] imageBytes;
                    using (var ms = new MemoryStream())
                    {
                        image.CopyTo(ms);
                        imageBytes = ms.ToArray();
                    }

                    // Inserción del nuevo producto
                    string query = @"INSERT INTO Producto (Nombre, Precio, Stock, Descripcion, CantidadOferta, CantidadGarantia, EstadoAprobacion, TipoProducto, TiendaID, Estado, 
                             Foto, FechaCreacion, CostoEnvio, CantidadVentas, TiempoEnvio, Color) 
                             VALUES (@Nombre, @Precio, @Stock, @Descripcion, @CantidadOferta, @CantidadGarantia, @EstadoAprobacion, @TipoProducto, @TiendaID, 
                             @Estado, @Foto, @FechaCreacion, @CostoEnvio, @CantidadVentas, @TiempoEnvio, @Color);
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
                    command.Parameters.AddWithValue("@Color", colorSeleccionado == ""? "NA" : colorSeleccionado);
                    command.Parameters.AddWithValue("@Estado", 1);
                    int idGenerado = Convert.ToInt32(await command.ExecuteScalarAsync());

                    // Inserción en el historial de cambios
                    query = @"INSERT INTO HistorialCambiosProducto (FechaHora, Descripcion, ProductoID) 
                      VALUES (@FechaHora, @Descripcion, @idGenerado)";
                    command = new MySqlCommand(query, connection);
                    command.Parameters.AddWithValue("@FechaHora", DateTime.Now);
                    command.Parameters.AddWithValue("@Descripcion", "Se realizó la creación del producto");
                    command.Parameters.AddWithValue("@idGenerado", idGenerado);
                    await command.ExecuteNonQueryAsync();

                    return Ok(idGenerado);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpPost]
        [Route("/RegisterTallas")]
        public async Task<ActionResult> RegistrarTallas([FromForm] int idProducto, [FromForm] string talla)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    bool sBoolean = talla == "Short (S)";
                    bool mBoolean = talla == "Medium (M)";
                    bool lBoolean = talla == "Large (L)";
                    bool xlBoolean = talla == "XL (Extra Large)";
                    bool xxlBoolean = talla == "XXL (Extra Extra Large)";

                    string query = @"INSERT INTO TallaVestimenta (IdProducto, SBoolean, MBoolean, LBoolean, XLBoolean, XXLBoolean)
                             VALUES (@IdProducto, @SBoolean, @MBoolean, @LBoolean, @XLBoolean, @XXLBoolean);";

                    MySqlCommand command = new MySqlCommand(query, connection);
                    command.Parameters.AddWithValue("@IdProducto", idProducto);
                    command.Parameters.AddWithValue("@SBoolean", sBoolean);
                    command.Parameters.AddWithValue("@MBoolean", mBoolean);
                    command.Parameters.AddWithValue("@LBoolean", lBoolean);
                    command.Parameters.AddWithValue("@XLBoolean", xlBoolean);
                    command.Parameters.AddWithValue("@XXLBoolean", xxlBoolean);

                    await command.ExecuteNonQueryAsync();
                    await connection.CloseAsync();

                    return Ok("Tallas registradas exitosamente.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpPost]
        [Route("/CreatePedido")]
        public async Task<ActionResult<int>> CrearPedido([FromForm] DateTime FechaEntrega, [FromForm] double Total, [FromForm] double TotalDescuento, [FromForm] int Estado, [FromForm] int CantidadProductos,
            [FromForm] string MetodoPago, [FromForm] int UsuarioID,  [FromForm] double CostoEnvio, [FromForm] string DireccionEntrega)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = @"INSERT INTO Pedidos (FechaEntrega, Total, Estado, Reclamo, CantidadProductos, MetodoPago, FechaCreacion, UsuarioID, TotalDescuento, CostoEnvio, DireccionEntrega) VALUES 
                    (@FechaEntrega, @Total, @Estado, @Reclamo, @CantidadProductos, @MetodoPago, @FechaCreacion, @UsuarioID, @TotalDescuento, @CostoEnvio, @DireccionEntrega);
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
                    command.Parameters.AddWithValue("@TotalDescuento", TotalDescuento);
                    command.Parameters.AddWithValue("@CostoEnvio", CostoEnvio);
                    command.Parameters.AddWithValue("@DireccionEntrega", DireccionEntrega);
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
        public async Task<ActionResult<int>> CreatePedidoXProducto([FromForm] int productoId, [FromForm] int pedidoId, [FromForm] int cantidad, [FromForm] int stock)
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
        [Route("/IngresarHashBlockchain")]
        public async Task<IActionResult> IngresarHashBlockchain(string hash)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = @"INSERT INTO Blockchain (HashBlockchain) VALUES 
                    (@HashBlockchain);
                     SELECT LAST_INSERT_ID();";
                    MySqlCommand command = new MySqlCommand(query, connection);
                    command.Parameters.AddWithValue("@HashBlockchain", hash);
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
        [Route("/ProcesarPago")]
        public async Task<IActionResult> ProcesarPago([FromForm] string token, [FromForm] double Monto, [FromForm] string NombreApellido, [FromForm] string correo, [FromForm] int opcion,
            [FromForm] int IdUsuario)
        {
            try
            {
                string _claveSecretaStripe = "";
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = @"SELECT ClaveStripeSecreto FROM LlavesSTRIPE";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                _claveSecretaStripe = reader.IsDBNull(reader.GetOrdinal("ClaveStripeSecreto")) ?
                                                             "" : reader.GetString("ClaveStripeSecreto");
                            }
                            else
                            {
                                connection.Close();
                                return NotFound();
                            }
                        }
                    }

                }
                StripeConfiguration.ApiKey = _claveSecretaStripe;
                if(opcion == 1)
                {
                    var paymentMethodService = new PaymentMethodService();
                    var paymentMethod = paymentMethodService.Get(token);
                    string customerId;
                    if (paymentMethod.CustomerId == null)
                    {
                        CustomerCreateOptions customerOptions = new CustomerCreateOptions
                        {
                            Name = NombreApellido,
                            Email = correo
                        };
                        var customerService = new CustomerService();
                        Customer customer = customerService.Create(customerOptions);
                        PaymentMethodAttachOptions attachOptions = new PaymentMethodAttachOptions
                        {
                            Customer = customer.Id
                        };
                        paymentMethodService.Attach(token, attachOptions);
                        long montoEnCentavos = (long)(Monto * 100);
                        var options = new PaymentIntentCreateOptions
                        {
                            Amount = montoEnCentavos,
                            Currency = "usd",
                            PaymentMethod = token,
                            Customer = customer.Id,
                            ConfirmationMethod = "manual",
                            Confirm = true,
                            ReturnUrl = "http://localhost:3000/MenuComprador/3"
                        };

                        var service = new PaymentIntentService();
                        PaymentIntent paymentIntent = service.Create(options);
                        return Ok(new { Mensaje = "Pago exitoso", PaymentIntentId = paymentIntent.Id });
                    }
                    else
                    {
                        long montoEnCentavos = (long)(Monto * 100);
                        var options = new PaymentIntentCreateOptions
                        {
                            Amount = montoEnCentavos,
                            Currency = "usd",
                            PaymentMethod = token,
                            Customer = paymentMethod.CustomerId,
                            ConfirmationMethod = "manual",
                            Confirm = true,
                            ReturnUrl = "http://localhost:3000/MenuComprador/3"
                        };

                        var service = new PaymentIntentService();
                        PaymentIntent paymentIntent = service.Create(options);
                        return Ok(new { Mensaje = "Pago exitoso", PaymentIntentId = paymentIntent.Id });
                    }
                }
                else
                {
                    long montoEnCentavos = (long)(Monto * 100);
                    var options = new PaymentIntentCreateOptions
                    {
                        Amount = montoEnCentavos,
                        Currency = "usd",
                        PaymentMethod = token,
                        ConfirmationMethod = "manual",
                        Confirm = true,
                        ReturnUrl = "http://localhost:3000/MenuComprador/3"
                    };

                    var service = new PaymentIntentService();
                    PaymentIntent paymentIntent = service.Create(options);

                    using (MySqlConnection connection = new MySqlConnection(connectionString))
                    {
                        connection.Open();
                        string queryUpdate = @"UPDATE Usuario SET CantMetodoPago = CantMetodoPago + 1 WHERE IdUsuario = @IdUsuario";
                        MySqlCommand commandUpdate = new MySqlCommand(queryUpdate, connection);
                        commandUpdate.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                        await commandUpdate.ExecuteNonQueryAsync();
                    }

                    return Ok(new { Mensaje = "Pago exitoso", PaymentIntentId = paymentIntent.Id });
                }
            }
            catch (StripeException e)
            {
                return BadRequest(new { Mensaje = "Error al procesar el pago", Error = e.Message });
            }
        }
        [HttpPost]
        [Route("/GuardarMetodoPago")]
        public async Task<IActionResult> GuardarMetodoPago([FromForm] int Last4, [FromForm] string FechaExpiracion, [FromForm] string Token, [FromForm] int idUsuario,
    [FromForm] string NombreApellido, [FromForm] string Correo)
        {
            try
            {
                string _claveSecretaStripe = "";
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = @"SELECT ClaveStripeSecreto FROM LlavesSTRIPE";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                _claveSecretaStripe = reader.IsDBNull(reader.GetOrdinal("ClaveStripeSecreto")) ?
                                                                "" : reader.GetString("ClaveStripeSecreto");
                            }
                            else
                            {
                                connection.Close();
                                return NotFound();
                            }
                        }
                    }

                }

                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    StripeConfiguration.ApiKey = _claveSecretaStripe;
                    var paymentMethodService = new PaymentMethodService();
                    var paymentMethod = paymentMethodService.Get(Token);
                    string customerId;

                    if (paymentMethod?.CustomerId == null)
                    {
                        CustomerCreateOptions customerOptions = new CustomerCreateOptions
                        {
                            Name = NombreApellido,
                            Email = Correo
                        };

                        var customerService = new CustomerService();
                        Customer customer = customerService.Create(customerOptions);

                        PaymentMethodAttachOptions attachOptions = new PaymentMethodAttachOptions
                        {
                            Customer = customer.Id
                        };

                        paymentMethodService.Attach(Token, attachOptions);

                        customerId = customer.Id;
                    }
                    else
                    {
                        customerId = paymentMethod.CustomerId;
                    }

                    string queryInsert = @"INSERT INTO MetodoPago (Last4, FechaExpiracion, Token, Estado, UsuarioID) VALUES 
                        (@Last4, @FechaExpiracion, @Token, @Estado, @UsuarioID)";
                    MySqlCommand command = new MySqlCommand(queryInsert, connection);
                    command.Parameters.AddWithValue("@Last4", Last4);
                    command.Parameters.AddWithValue("@FechaExpiracion", FechaExpiracion);
                    command.Parameters.AddWithValue("@Token", Token);
                    command.Parameters.AddWithValue("@UsuarioID", idUsuario);
                    command.Parameters.AddWithValue("@Cuenta", customerId);
                    command.Parameters.AddWithValue("@Estado", 1);
                    int idGenerado = Convert.ToInt32(await command.ExecuteScalarAsync());

                    // Realizar el update para aumentar CantCambiosMetodoPago
                    string queryUpdate = @"UPDATE Usuario SET CantMetodoPago = CantMetodoPago + 1 WHERE IdUsuario = @IdUsuario";
                    MySqlCommand commandUpdate = new MySqlCommand(queryUpdate, connection);
                    commandUpdate.Parameters.AddWithValue("@IdUsuario", idUsuario);
                    await commandUpdate.ExecuteNonQueryAsync();

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
                                
                                //Llamada a la clave en la base de datos
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
                                //Inicio de la desencriptación
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
        private (int, bool, int) VerificarCorreoExistente(string correo)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                int count = 0;
                int idUsuario = 0;
                bool estadoUsuario = false;

                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = "SELECT COUNT(*) FROM Usuario WHERE Correo = @Correo";
                    string estadoQuery = "SELECT IdUsuario, Estado FROM Usuario WHERE Correo = @Correo";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Correo", correo);

                        count = Convert.ToInt32(command.ExecuteScalar());
                    }

                    using (MySqlCommand estadoCommand = new MySqlCommand(estadoQuery, connection))
                    {
                        estadoCommand.Parameters.AddWithValue("@Correo", correo);

                        using (MySqlDataReader reader = estadoCommand.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                idUsuario = reader.GetInt32("IdUsuario");
                                estadoUsuario = reader.GetBoolean("Estado");
                            }
                        }
                    }

                    connection.Close();
                }

                return (count, estadoUsuario, idUsuario);
            }
            catch(Exception ex)
            {
                return (0,false, 0);
            }
        }
        private (int, bool) VerificarDNIExistente(int DNI)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            int count = 0;
            bool estadoUsuario = false;

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();

                string query = "SELECT COUNT(*) FROM Usuario WHERE DNI = @DNI";
                string estadoQuery = "SELECT Estado FROM Usuario WHERE DNI = @DNI";

                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@DNI", DNI);

                    count = Convert.ToInt32(command.ExecuteScalar());
                }

                using (MySqlCommand estadoCommand = new MySqlCommand(estadoQuery, connection))
                {
                    estadoCommand.Parameters.AddWithValue("@DNI", DNI);

                    estadoUsuario = Convert.ToBoolean(estadoCommand.ExecuteScalar());
                }
            }
            return (count, estadoUsuario);
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
