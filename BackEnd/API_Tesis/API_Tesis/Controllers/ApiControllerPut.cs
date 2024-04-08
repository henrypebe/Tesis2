using API_Tesis.BD;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using System.Security.Cryptography;
using System.Text;

namespace API_Tesis.Controllers
{
    [ApiController]
    public class ApiControllerPut: ControllerBase
    {
        private readonly BDMysql _context;
        private readonly IConfiguration _configuration;
        public ApiControllerPut(BDMysql context, IConfiguration configuration)
        {
            _configuration = configuration;
            _context = context;
            var timer = new System.Timers.Timer(TimeSpan.FromHours(24).TotalMilliseconds);
            timer.AutoReset = true;
            timer.Elapsed += (sender, e) => ActualizarEstadoPedidos();
            timer.Start();
        }
        private void ActualizarEstadoPedidos()
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();

                string query = "UPDATE Pedidos SET Estado = 2 WHERE DATE(FechaEntrega) <= DATE(NOW())";

                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    int rowsAffected = command.ExecuteNonQuery();
                    Console.WriteLine($"Se actualizaron {rowsAffected} pedidos.");
                }
            }
        }
        [HttpPut]
        [Route("/EditarProducto")]
        public async Task<ActionResult<int>> EditarProducto([FromForm] int idProducto, [FromForm] string nombre, [FromForm] double precio, [FromForm] int cantidad, [FromForm] IFormFile image,
            [FromForm] string descripcion, [FromForm] string cantidadOferta, [FromForm] string cantidadGarantia, [FromForm] string tipoProducto, [FromForm] double costoEnvio,
            [FromForm] string tiempoEnvio)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    byte[] imageBytes;
                    using (var memoryStream = new MemoryStream())
                    {
                        await image.CopyToAsync(memoryStream);
                        imageBytes = memoryStream.ToArray();
                    }
                    string query = "UPDATE Producto SET Nombre = @Nombre, Precio = @Precio, Descripcion = @Descripcion, CantidadOferta = @CantidadOferta," +
                        "CantidadGarantia = @CantidadGarantia, TipoProducto = @TipoProducto, Foto = @Foto, Stock = @Stock, EstadoAprobacion = @EstadoAprobacion, " +
                        "CostoEnvio = @CostoEnvio, TiempoEnvio = @TiempoEnvio WHERE IdProducto = @IdProducto AND Estado = 1";
                    MySqlCommand command = new MySqlCommand(query, connection);
                    command.Parameters.AddWithValue("@IdProducto", idProducto);
                    command.Parameters.AddWithValue("@Nombre", nombre);
                    command.Parameters.AddWithValue("@Precio", precio);
                    command.Parameters.AddWithValue("@Descripcion", descripcion);
                    command.Parameters.AddWithValue("@CantidadOferta", cantidadOferta);
                    command.Parameters.AddWithValue("@CantidadGarantia", cantidadGarantia);
                    command.Parameters.AddWithValue("@TipoProducto", tipoProducto);
                    command.Parameters.AddWithValue("@Foto", imageBytes);
                    command.Parameters.AddWithValue("@Stock", cantidad);
                    command.Parameters.AddWithValue("@EstadoAprobacion", "Pendiente");
                    command.Parameters.AddWithValue("@CostoEnvio", costoEnvio);
                    command.Parameters.AddWithValue("@TiempoEnvio", tiempoEnvio);
                    int rowsAffected = await command.ExecuteNonQueryAsync();

                    if (rowsAffected > 0)
                    {
                        connection.Close();
                        return Ok();
                    }
                    else
                    {
                        connection.Close();
                        return NotFound();
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpPut]
        [Route("/EditarUsuario")]
        public async Task<ActionResult> EditarUsuario([FromForm] int idUsuario, [FromForm] string nombre, [FromForm] string apellido, [FromForm] string correo, [FromForm] int numero,
            [FromForm] string direccion)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    string query = "UPDATE Usuario SET Apellido = @Apellido, Nombre = @Nombre, Correo = @Correo, Telefono = @Telefono," +
                        "Direccion = @Direccion WHERE idUsuario = @IdUsuario AND Estado = 1";
                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        command.Parameters.AddWithValue("@Apellido", apellido);
                        command.Parameters.AddWithValue("@Nombre", nombre);
                        command.Parameters.AddWithValue("@Correo", correo);
                        command.Parameters.AddWithValue("@Telefono", numero);
                        command.Parameters.AddWithValue("@Direccion", direccion);

                        int rowsAffected = await command.ExecuteNonQueryAsync();

                        if (rowsAffected > 0)
                        {
                            connection.Close();
                            return Ok();
                        }
                        else
                        {
                            connection.Close();
                            return NotFound();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex.Message);
                return NotFound();
            }
        }
        [HttpPut]
        [Route("/EditarTienda")]
        public async Task<ActionResult> EditarTienda([FromForm] int idTienda, [FromForm] string nombre, [FromForm] IFormFile image, [FromForm] string descripcion,
            [FromForm] string direccion, [FromForm] string Provincia, [FromForm] string pais)
        {
            try
            {
                descripcion = descripcion.Replace('_', ' ');
                direccion = direccion.Replace('_', ' ');
                Provincia = Provincia.Replace('_', ' ');
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    byte[] imageBytes;
                    using (var memoryStream = new MemoryStream())
                    {
                        await image.CopyToAsync(memoryStream);
                        imageBytes = memoryStream.ToArray();
                    }
                    connection.Open();
                    string query = @"UPDATE Tienda SET Nombre = @Nombre, Descripcion = @Descripcion, Direccion = @Direccion, Provincia = @Provincia, Pais = @Pais, Foto=@Foto WHERE IdTienda = @IdTienda AND Estado = 1";
                    MySqlCommand command = new MySqlCommand(query, connection);
                    command.Parameters.AddWithValue("@Nombre", nombre);
                    command.Parameters.AddWithValue("@Descripcion", descripcion);
                    command.Parameters.AddWithValue("@Direccion", direccion);
                    command.Parameters.AddWithValue("@Provincia", Provincia);
                    command.Parameters.AddWithValue("@Pais", pais);
                    command.Parameters.AddWithValue("@IdTienda", idTienda);
                    command.Parameters.AddWithValue("@Estado", 1);
                    command.Parameters.AddWithValue("@Foto", imageBytes);
                    int rowsAffected = await command.ExecuteNonQueryAsync();

                    if (rowsAffected > 0)
                    {
                        connection.Close();
                        return Ok();
                    }
                    else
                    {
                        connection.Close();
                        return NotFound();
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpPut]
        [Route("/EditarSeguimientoPedido")]
        public async Task<IActionResult> EditarSeguimientoPedido(int idPedidoXProducto, int idUsuario, int idTienda)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string updateQuery = "UPDATE PedidoXProducto SET TieneSeguimiento = @TieneSeguimiento WHERE IdPedidoXProducto = @IdPedidoXProducto";
                    MySqlCommand command = new MySqlCommand(updateQuery, connection);
                    command.Parameters.AddWithValue("@TieneSeguimiento", 1);
                    command.Parameters.AddWithValue("@IdPedidoXProducto", idPedidoXProducto);

                    await command.ExecuteNonQueryAsync();

                    string query = @"INSERT INTO Chat (Estado, FechaCreacion, CompradorID, TiendaID, PedidoXProductoID) 
                        VALUES (@Estado, @FechaCreacion, @CompradorID, @TiendaID, @PedidoXProductoID);
                        SELECT LAST_INSERT_ID();";
                    MySqlCommand command2 = new MySqlCommand(query, connection);
                    command2.Parameters.AddWithValue("@Estado", "Pendiente");
                    command2.Parameters.AddWithValue("@FechaCreacion", DateTime.Today);
                    command2.Parameters.AddWithValue("@CompradorID", idUsuario);
                    command2.Parameters.AddWithValue("@TiendaID", idTienda);
                    command2.Parameters.AddWithValue("@PedidoXProductoID", idPedidoXProducto);
                    await command2.ExecuteNonQueryAsync();
                    connection.Close();
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al editar el usuario: {ex.Message}");
            }
        }
        [HttpPut]
        [Route("/EditarReclamoPedido")]
        public async Task<IActionResult> EditarReclamoPedido(int idPedidoXProducto)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string updateQuery = "UPDATE PedidoXProducto SET TieneReclamo = @TieneReclamo AND TieneSeguimiento = @TieneSeguimiento" +
                        "WHERE IdPedidoXProducto = @IdPedidoXProducto";
                    MySqlCommand command = new MySqlCommand(updateQuery, connection);
                    command.Parameters.AddWithValue("@TieneReclamo", 1);
                    command.Parameters.AddWithValue("@TieneSeguimiento", 0);
                    command.Parameters.AddWithValue("@IdPedidoXProducto", idPedidoXProducto);

                    await command.ExecuteNonQueryAsync();
                    connection.Close();
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al editar el usuario: {ex.Message}");
            }
        }
        [HttpPut]
        [Route("/editarRolUsuario")]
        public async Task<IActionResult> EditarUsuario(int idUsuario, bool esComprador, bool esVendedor)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string updateQuery = "UPDATE Usuario SET EsComprador = @EsComprador, EsVendedor = @EsVendedor WHERE IdUsuario = @IdUsuario AND Estado = 1";
                    using (MySqlCommand command = new MySqlCommand(updateQuery, connection))
                    {
                        command.Parameters.AddWithValue("@EsComprador", esComprador);
                        command.Parameters.AddWithValue("@EsVendedor", esVendedor);
                        command.Parameters.AddWithValue("@IdUsuario", idUsuario);

                        await command.ExecuteNonQueryAsync();
                    }

                    if (esVendedor)
                    {
                        string selectVendedorQuery = "SELECT COUNT(*) FROM Vendedor WHERE usuarioId = @UsuarioId";
                        using (MySqlCommand command = new MySqlCommand(selectVendedorQuery, connection))
                        {
                            command.Parameters.AddWithValue("@UsuarioId", idUsuario);
                            int vendedorCount = Convert.ToInt32(await command.ExecuteScalarAsync());

                            // Si vendedorCount es 0, significa que no hay registros con el mismo usuarioId, por lo que se puede proceder con la inserción
                            if (vendedorCount == 0)
                            {
                                string insertVendedorQuery = "INSERT INTO Vendedor (usuarioId, Estado, TiendaID) VALUES (@UsuarioId, @Estado, @TiendaID)";
                                using (MySqlCommand insertCommand = new MySqlCommand(insertVendedorQuery, connection))
                                {
                                    insertCommand.Parameters.AddWithValue("@UsuarioId", idUsuario);
                                    insertCommand.Parameters.AddWithValue("@Estado", 1);
                                    insertCommand.Parameters.AddWithValue("@TiendaID", 0);
                                    await insertCommand.ExecuteNonQueryAsync();
                                }
                            }
                        }
                    }

                    if (esComprador)
                    {
                        string selectCompradorQuery = "SELECT COUNT(*) FROM Comprador WHERE usuarioId = @UsuarioId";
                        using (MySqlCommand command = new MySqlCommand(selectCompradorQuery, connection))
                        {
                            command.Parameters.AddWithValue("@UsuarioId", idUsuario);
                            int compradorCount = Convert.ToInt32(await command.ExecuteScalarAsync());

                            // Si compradorCount es 0, significa que no hay registros con el mismo usuarioId, por lo que se puede proceder con la inserción
                            if (compradorCount == 0)
                            {
                                string insertCompradorQuery = "INSERT INTO Comprador (usuarioId, Estado) VALUES (@UsuarioId, @Estado)";
                                using (MySqlCommand insertCommand = new MySqlCommand(insertCompradorQuery, connection))
                                {
                                    insertCommand.Parameters.AddWithValue("@UsuarioId", idUsuario);
                                    insertCommand.Parameters.AddWithValue("@Estado", 1);
                                    await insertCommand.ExecuteNonQueryAsync();
                                }
                            }
                        }
                    }
                    connection.Close();
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al editar el usuario: {ex.Message}");
            }
        }
        [HttpPut]
        [Route("/EditarRolVendedorUsuario")]
        public async Task<IActionResult> EditarVendedorUsuario(int idUsuario, bool esAsistenteVendedor)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string updateQuery = "UPDATE Vendedor SET esAdministrador = @esAdministrador WHERE usuarioId = @usuarioId AND Estado = 1";
                    using (MySqlCommand command = new MySqlCommand(updateQuery, connection))
                    {
                        command.Parameters.AddWithValue("@esAdministrador", !esAsistenteVendedor);
                        command.Parameters.AddWithValue("@usuarioId", idUsuario);

                        await command.ExecuteNonQueryAsync();
                    }

                    connection.Close();
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al editar el usuario: {ex.Message}");
            }
        }
        [HttpPut]
        [Route("/EditarContrasenha")]
        public async Task<IActionResult> EditarContrasenha(int idUsuario, string contrasenha, string ContrasenhaVariado)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

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
                    string encryptedText = Encrypt(ContrasenhaVariado, base64Key);

                    string updateQuery = "UPDATE Usuario SET contrasenha = @contrasenha, ContrasenhaVariado = @ContrasenhaVariado WHERE IdUsuario = @IdUsuario AND Estado = 1";
                    using (MySqlCommand command = new MySqlCommand(updateQuery, connection))
                    {
                        command.Parameters.AddWithValue("@contrasenha", contrasenha);
                        command.Parameters.AddWithValue("@ContrasenhaVariado", encryptedText);
                        command.Parameters.AddWithValue("@IdUsuario", idUsuario);

                        await command.ExecuteNonQueryAsync();
                    }
                    connection.Close();
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al editar el usuario: {ex.Message}");
            }
        }
        [HttpPut]
        [Route("/EliminarProducto")]
        public async Task<IActionResult> EliminarProducto(int idProducto)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string updateQuery = "UPDATE Producto SET Estado = @Estado WHERE IdProducto = @IdProducto";
                    using (MySqlCommand command = new MySqlCommand(updateQuery, connection))
                    {
                        command.Parameters.AddWithValue("@Estado", 0);
                        command.Parameters.AddWithValue("@IdProducto", idProducto);

                        await command.ExecuteNonQueryAsync();
                    }
                    connection.Close();
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al editar el usuario: {ex.Message}");
            }
        }
        [HttpPut]
        [Route("/CambioEstadoAprobaciónProducto")]
        public async Task<IActionResult> CambioEstadoAprobaciónProducto(int idProducto, string EstadoPuesto)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string updateQuery = "UPDATE Producto SET EstadoAprobacion = @EstadoAprobacion WHERE IdProducto = @IdProducto AND Estado = 1";
                    using (MySqlCommand command = new MySqlCommand(updateQuery, connection))
                    {
                        command.Parameters.AddWithValue("@EstadoAprobacion", EstadoPuesto);
                        command.Parameters.AddWithValue("@IdProducto", idProducto);

                        await command.ExecuteNonQueryAsync();
                    }
                    connection.Close();
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al editar el usuario: {ex.Message}");
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
    }
}
