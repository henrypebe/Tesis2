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
            //var timer = new System.Timers.Timer(TimeSpan.FromHours(24).TotalMilliseconds);
            //timer.AutoReset = true;
            //timer.Elapsed += (sender, e) => ActualizarEstadoPedidos();
            //timer.Start();
        }
        [HttpPut]
        [Route("/ActualizarFechasPedidos")]
        public async Task<IActionResult> ActualizarFechasPedidos()
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();

                string query = @"
                    UPDATE Pedidos 
                        SET Estado = 
                        CASE 
                            WHEN Estado = 3 THEN Estado   -- No se hace ningún cambio si el estado actual es 3
                            WHEN DATE(FechaEntrega) <= DATE(NOW()) THEN 2 
                            ELSE 1 
                        END";

                MySqlCommand command = new MySqlCommand(query, connection);
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
        [HttpPut]
        [Route("/ActualizarEstadoPedido")]
        public async Task<IActionResult> ActualizarEstadoPedido(int idPedido, int valor)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();

                string query = @"
                    UPDATE Pedidos 
                    SET Estado = @Estado
                    WHERE IdPedido = @IdPedido";

                MySqlCommand command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@IdPedido", idPedido);
                command.Parameters.AddWithValue("@Estado", valor);
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
        [HttpPut]
        [Route("/EditarProducto")]
        public async Task<ActionResult<int>> EditarProducto([FromForm] int idProducto, [FromForm] string nombre, [FromForm] double precio, [FromForm] int cantidad, [FromForm] IFormFile image,
        [FromForm] string descripcion, [FromForm] double cantidadOferta, [FromForm] string cantidadGarantia, [FromForm] string tipoProducto, [FromForm] double costoEnvio,
        [FromForm] string tiempoEnvio)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    byte[] imageBytes = null;
                    if (image != null)
                    {
                        using (var memoryStream = new MemoryStream())
                        {
                            await image.CopyToAsync(memoryStream);
                            imageBytes = memoryStream.ToArray();
                        }
                    }
                    string selectQuery = "SELECT Nombre, Precio, Descripcion, CantidadOferta, CantidadGarantia, TipoProducto, Foto, Stock, CostoEnvio, TiempoEnvio " +
                        "FROM Producto WHERE IdProducto = @IdProducto AND Estado = 1";
                    MySqlCommand selectCommand = new MySqlCommand(selectQuery, connection);
                    selectCommand.Parameters.AddWithValue("@IdProducto", idProducto);
                    MySqlDataReader reader = await selectCommand.ExecuteReaderAsync();
                    if (reader.Read())
                    {
                        List<string> changes = new List<string>();

                        if (reader.GetString("Nombre") != nombre)
                            changes.Add($"Nombre: '{reader.GetString("Nombre")}' a '{nombre}'");

                        if (reader.GetDouble("Precio") != precio)
                            changes.Add($"Precio: '{reader.GetDouble("Precio")}' a '{precio}'");

                        if (reader.GetString("Descripcion") != descripcion)
                            changes.Add($"Descripcion: '{reader.GetString("Descripcion")}' a '{descripcion}'");

                        if (reader.GetDouble("CantidadOferta") != cantidadOferta)
                            changes.Add($"Cantidad oferta: '{reader.GetDouble("CantidadOferta")}' a '{cantidadOferta}'");

                        if (reader.GetString("CantidadGarantia") != cantidadGarantia)
                            changes.Add($"Cantidad garantía: '{reader.GetString("CantidadGarantia")}' a '{cantidadGarantia}'");

                        if (reader.GetString("TipoProducto") != tipoProducto)
                            changes.Add($"Tipo producto: '{reader.GetString("TipoProducto")}' a '{tipoProducto}'");

                        if (reader.GetInt32("Stock") != cantidad)
                            changes.Add($"Stock: '{reader.GetInt32("Stock")}' a '{cantidad}'");

                        if (reader.GetDouble("CostoEnvio") != costoEnvio)
                            changes.Add($"CostoEnvio: '{reader.GetDouble("CostoEnvio")}' a '{costoEnvio}'");

                        if (reader.GetString("TiempoEnvio") != tiempoEnvio)
                            changes.Add($"TiempoEnvio: '{reader.GetString("TiempoEnvio")}' a '{tiempoEnvio}'");

                        reader.Close();

                        if (changes.Any())
                        {
                            string changeDescription = "Se realizaron cambios en los siguientes atributos: " + string.Join(", ", changes);
                            string updateQuery = "UPDATE Producto SET Nombre = @Nombre, Precio = @Precio, Descripcion = @Descripcion, CantidadOferta = @CantidadOferta," +
                                "CantidadGarantia = @CantidadGarantia, TipoProducto = @TipoProducto, Foto = @Foto, Stock = @Stock, EstadoAprobacion = @EstadoAprobacion, " +
                                "CostoEnvio = @CostoEnvio, TiempoEnvio = @TiempoEnvio WHERE IdProducto = @IdProducto AND Estado = 1";
                            MySqlCommand command = new MySqlCommand(updateQuery, connection);
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
                                await connection.CloseAsync();
                                await connection.OpenAsync();
                                string insertQuery = @"INSERT INTO HistorialCambiosProducto (FechaHora, Descripcion, ProductoID) VALUES (@FechaHora, @Descripcion, @idGenerado)";
                                MySqlCommand insertCommand = new MySqlCommand(insertQuery, connection);
                                insertCommand.Parameters.AddWithValue("@FechaHora", DateTime.Now);
                                insertCommand.Parameters.AddWithValue("@Descripcion", changeDescription);
                                insertCommand.Parameters.AddWithValue("@idGenerado", idProducto);
                                await insertCommand.ExecuteScalarAsync();
                                await connection.CloseAsync();
                                return Ok();
                            }
                            else
                            {
                                connection.Close();
                                return NotFound();
                            }
                        }
                        else
                        {
                            connection.Close();
                            return BadRequest("No se hizo ningún cambio");
                        }
                    }
                    else
                    {
                        reader.Close();
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

        //[HttpPut]
        //[Route("/EditarProducto")]
        //public async Task<ActionResult<int>> EditarProducto([FromForm] int idProducto, [FromForm] string nombre, [FromForm] double precio, [FromForm] int cantidad, [FromForm] IFormFile image,
        //    [FromForm] string descripcion, [FromForm] string cantidadOferta, [FromForm] string cantidadGarantia, [FromForm] string tipoProducto, [FromForm] double costoEnvio,
        //    [FromForm] string tiempoEnvio)
        //{
        //    try
        //    {
        //        string connectionString = _configuration.GetConnectionString("DefaultConnection");
        //        using (MySqlConnection connection = new MySqlConnection(connectionString))
        //        {
        //            connection.Open();
        //            byte[] imageBytes;
        //            using (var memoryStream = new MemoryStream())
        //            {
        //                await image.CopyToAsync(memoryStream);
        //                imageBytes = memoryStream.ToArray();
        //            }
        //            string query = "UPDATE Producto SET Nombre = @Nombre, Precio = @Precio, Descripcion = @Descripcion, CantidadOferta = @CantidadOferta," +
        //                "CantidadGarantia = @CantidadGarantia, TipoProducto = @TipoProducto, Foto = @Foto, Stock = @Stock, EstadoAprobacion = @EstadoAprobacion, " +
        //                "CostoEnvio = @CostoEnvio, TiempoEnvio = @TiempoEnvio WHERE IdProducto = @IdProducto AND Estado = 1";
        //            MySqlCommand command = new MySqlCommand(query, connection);
        //            command.Parameters.AddWithValue("@IdProducto", idProducto);
        //            command.Parameters.AddWithValue("@Nombre", nombre);
        //            command.Parameters.AddWithValue("@Precio", precio);
        //            command.Parameters.AddWithValue("@Descripcion", descripcion);
        //            command.Parameters.AddWithValue("@CantidadOferta", cantidadOferta);
        //            command.Parameters.AddWithValue("@CantidadGarantia", cantidadGarantia);
        //            command.Parameters.AddWithValue("@TipoProducto", tipoProducto);
        //            command.Parameters.AddWithValue("@Foto", imageBytes);
        //            command.Parameters.AddWithValue("@Stock", cantidad);
        //            command.Parameters.AddWithValue("@EstadoAprobacion", "Pendiente");
        //            command.Parameters.AddWithValue("@CostoEnvio", costoEnvio);
        //            command.Parameters.AddWithValue("@TiempoEnvio", tiempoEnvio);
        //            int rowsAffected = await command.ExecuteNonQueryAsync();

        //            if (rowsAffected > 0)
        //            {
        //                await connection.CloseAsync();
        //                await connection.OpenAsync();
        //                query = @"INSERT INTO HistorialCambiosProducto (FechaHora, Descripcion, ProductoID) VALUES (@FechaHora, @Descripcion, @idGenerado)";
        //                command = new MySqlCommand(query, connection);
        //                command.Parameters.AddWithValue("@FechaHora", DateTime.Now);
        //                command.Parameters.AddWithValue("@Descripcion", "Se realizó la creación del producto");
        //                command.Parameters.AddWithValue("@idGenerado", idProducto);
        //                await command.ExecuteScalarAsync();
        //                await connection.CloseAsync();
        //                return Ok();
        //            }
        //            else
        //            {
        //                connection.Close();
        //                return NotFound();
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Error interno del servidor: {ex.Message}");
        //    }
        //}
        [HttpPut]
        [Route("/EditarUsuario")]
        public async Task<ActionResult> EditarUsuario([FromForm] int idUsuario, [FromForm] string nombre, [FromForm] string apellido, [FromForm] string correo, [FromForm] int numero,
            [FromForm] string direccion, [FromForm] string correoAlternativo)
        {
          
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                try
                {
                    using (MySqlConnection connection = new MySqlConnection(connectionString))
                    {
                        connection.Open();
                        string queryGetDireccion = "SELECT Direccion FROM Usuario WHERE IdUsuario = @IdUsuario";
                        using (MySqlCommand commandGetDireccion = new MySqlCommand(queryGetDireccion, connection))
                        {
                            commandGetDireccion.Parameters.AddWithValue("@IdUsuario", idUsuario);
                            string direccionActual = await commandGetDireccion.ExecuteScalarAsync() as string;

                            if (direccionActual == direccion)
                            {
                                string querySinCambioDireccion = "";
                                if (correoAlternativo != "a")
                                {
                                    querySinCambioDireccion = "UPDATE Usuario SET Apellido = @Apellido, Nombre = @Nombre, Correo = @Correo, Telefono = @Telefono," +
                                        "Direccion = @Direccion, CorreoAlternativo = @CorreoAlternativo WHERE idUsuario = @IdUsuario AND Estado = 1";
                                }
                                else
                                {
                                    querySinCambioDireccion = "UPDATE Usuario SET Apellido = @Apellido, Nombre = @Nombre, Correo = @Correo, Telefono = @Telefono," +
                                    "Direccion = @Direccion WHERE idUsuario = @IdUsuario AND Estado = 1";
                                }
                                using (MySqlCommand command = new MySqlCommand(querySinCambioDireccion, connection))
                                {
                                    command.Parameters.AddWithValue("@IdUsuario", idUsuario);
                                    command.Parameters.AddWithValue("@Apellido", apellido);
                                    command.Parameters.AddWithValue("@Nombre", nombre);
                                    command.Parameters.AddWithValue("@Correo", correo);
                                    command.Parameters.AddWithValue("@Telefono", numero);
                                    command.Parameters.AddWithValue("@Direccion", direccion);
                                    if (correoAlternativo != "a") command.Parameters.AddWithValue("@CorreoAlternativo", correoAlternativo);

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

                        string query = "";
                    if (correoAlternativo != "a")
                    {
                        query = "UPDATE Usuario SET Apellido = @Apellido, Nombre = @Nombre, Correo = @Correo, Telefono = @Telefono," +
                            "Direccion = @Direccion,CorreoAlternativo = @CorreoAlternativo, CantCambiosDireccion = CantCambiosDireccion + 1 WHERE idUsuario = @IdUsuario AND Estado = 1";
                    }
                    else
                    {
                        query = "UPDATE Usuario SET Apellido = @Apellido, Nombre = @Nombre, Correo = @Correo, Telefono = @Telefono," +
                            "Direccion = @Direccion, CantCambiosDireccion = CantCambiosDireccion + 1 WHERE idUsuario = @IdUsuario AND Estado = 1";
                    }
                    using (MySqlCommand command = new MySqlCommand(query, connection))
                        {
                            command.Parameters.AddWithValue("@IdUsuario", idUsuario);
                            command.Parameters.AddWithValue("@Apellido", apellido);
                            command.Parameters.AddWithValue("@Nombre", nombre);
                            command.Parameters.AddWithValue("@Correo", correo);
                            command.Parameters.AddWithValue("@Telefono", numero);
                            command.Parameters.AddWithValue("@Direccion", direccion);
                            if (correoAlternativo != "a") command.Parameters.AddWithValue("@CorreoAlternativo", correoAlternativo);

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
        [Route("/EditarMetodoPago")]
        public async Task<ActionResult> EditarMetodoPago( int idPedido, string token)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    string query = @"UPDATE Pedidos SET MetodoPago = @MetodoPago WHERE IdPedido = @IdPedido AND Estado = 1";
                    MySqlCommand command = new MySqlCommand(query, connection);
                    command.Parameters.AddWithValue("@MetodoPago", token);
                    command.Parameters.AddWithValue("@IdPedido", idPedido);
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
                    connection.Close();
                    await connection.OpenAsync();

                    string query = @"INSERT INTO Chat (Estado, FechaCreacion, CompradorID, TiendaID, PedidoXProductoID, FinalizarCliente) 
                        VALUES (@Estado, @FechaCreacion, @CompradorID, @TiendaID, @PedidoXProductoID, @FinalizarCliente);
                        SELECT LAST_INSERT_ID();";
                    MySqlCommand command2 = new MySqlCommand(query, connection);
                    command2.Parameters.AddWithValue("@Estado", "Pendiente");
                    command2.Parameters.AddWithValue("@FechaCreacion", DateTime.Today);
                    command2.Parameters.AddWithValue("@CompradorID", idUsuario);
                    command2.Parameters.AddWithValue("@TiendaID", idTienda);
                    command2.Parameters.AddWithValue("@PedidoXProductoID", idPedidoXProducto);
                    command2.Parameters.AddWithValue("@FinalizarCliente", 0);
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

                    string updateQuery = "UPDATE PedidoXProducto SET TieneReclamo = @TieneReclamo, TieneSeguimiento = @TieneSeguimiento, FechaReclamo = @FechaReclamo " +
                        "WHERE IdPedidoXProducto = @IdPedidoXProducto";
                    MySqlCommand command = new MySqlCommand(updateQuery, connection);
                    command.Parameters.AddWithValue("@TieneReclamo", 1);
                    command.Parameters.AddWithValue("@TieneSeguimiento", 0);
                    command.Parameters.AddWithValue("@IdPedidoXProducto", idPedidoXProducto);
                    command.Parameters.AddWithValue("@FechaReclamo", DateTime.Today);

                    await command.ExecuteNonQueryAsync();
                    connection.Close();
                    await connection.OpenAsync();

                    string updateQuery2 = "UPDATE Chat SET FinalizarCliente = @FinalizarCliente " +
                        "WHERE PedidoXProductoID = @IdPedidoXProducto";
                    MySqlCommand command2 = new MySqlCommand(updateQuery2, connection);
                    command2.Parameters.AddWithValue("@IdPedidoXProducto", idPedidoXProducto);
                    command2.Parameters.AddWithValue("@FinalizarCliente", 1);

                    await command2.ExecuteNonQueryAsync();
                    
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al editar el usuario: {ex.Message}");
            }
        }
        [HttpPut]
        [Route("/IniciarTiendaExistente")]
        public async Task<IActionResult> IniciarTiendaExistente(int idUsuario)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string updateQuery = "UPDATE Tienda SET Estado = @Estado " +
                        "WHERE UsuarioID = @idUsuario";
                    MySqlCommand command = new MySqlCommand(updateQuery, connection);
                    command.Parameters.AddWithValue("@Estado", 1);
                    command.Parameters.AddWithValue("@idUsuario", idUsuario);

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
        [Route("/RealizarReclamoPedido")]
        public async Task<IActionResult> RealizarReclamoPedido(int idPedido)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string updateQuery = "UPDATE Pedidos SET Reclamo = @Reclamo " +
                        "WHERE IdPedido = @IdPedido";
                    MySqlCommand command = new MySqlCommand(updateQuery, connection);
                    command.Parameters.AddWithValue("@Reclamo", 1);
                    command.Parameters.AddWithValue("@IdPedido", idPedido);

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
        [HttpPut]
        [Route("/FinalizarChatCliente")]
        public async Task<IActionResult> FinalizarChatCliente(int idChat)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string updateQuery = "UPDATE Chat SET FinalizarCliente = @FinalizarCliente " +
                        "WHERE IdChat = @IdChat";
                    MySqlCommand command = new MySqlCommand(updateQuery, connection);
                    command.Parameters.AddWithValue("@IdChat", idChat);
                    command.Parameters.AddWithValue("@FinalizarCliente", 1);

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
        [Route("/EliminarCuentaComprador")]
        public async Task<IActionResult> EliminarCuentaComprador(int idUsuario)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string updateQuery = "UPDATE Usuario SET Estado = @Estado " +
                        "WHERE IdUsuario = @IdUsuario";
                    MySqlCommand command = new MySqlCommand(updateQuery, connection);
                    command.Parameters.AddWithValue("@IdUsuario", idUsuario);
                    command.Parameters.AddWithValue("@Estado", 0);
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
        [Route("/EliminarMetodoPago")]
        public async Task<IActionResult> EliminarMetodoPago(int MetodoPago)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    string updateQuery = "UPDATE MetodoPago SET Estado = @Estado " +
                        "WHERE IdMetodoPago = @MetodoPago";
                    MySqlCommand command = new MySqlCommand(updateQuery, connection);
                    command.Parameters.AddWithValue("@MetodoPago", MetodoPago);
                    command.Parameters.AddWithValue("@Estado", 0);
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
        [Route("/EliminarCuentaVendedor")]
        public async Task<IActionResult> EliminarCuentaVendedor(int idUsuario, bool esAdministrador)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    string updateQuery = "UPDATE Usuario SET Estado = @Estado " +
                        "WHERE IdUsuario = @IdUsuario";
                    MySqlCommand command = new MySqlCommand(updateQuery, connection);
                    command.Parameters.AddWithValue("@IdUsuario", idUsuario);
                    command.Parameters.AddWithValue("@Estado", 0);
                    await command.ExecuteNonQueryAsync();
                    connection.Close();

                    if (esAdministrador)
                    {
                        await connection.OpenAsync();
                        updateQuery = "UPDATE Tienda SET Estado = 0 WHERE UsuarioID = @IdUsuario";
                        command = new MySqlCommand(updateQuery, connection);
                        command.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        await command.ExecuteNonQueryAsync();
                        connection.Close();

                        await connection.OpenAsync();
                        updateQuery = @"UPDATE Producto
                                        SET Estado = 0
                                        WHERE TiendaID IN(SELECT IdTienda FROM Tienda WHERE UsuarioID = @IdUsuario)";
                        command = new MySqlCommand(updateQuery, connection);
                        command.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        await command.ExecuteNonQueryAsync();
                        connection.Close();
                    }
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
        public async Task<IActionResult> CambioEstadoAprobaciónProducto(int idProducto, string EstadoPuesto, string MotivoRechazo)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string updateQuery = "UPDATE Producto SET EstadoAprobacion = @EstadoAprobacion, MotivoRechazo = @MotivoRechazo WHERE IdProducto = @IdProducto AND Estado = 1";
                    using (MySqlCommand command = new MySqlCommand(updateQuery, connection))
                    {
                        command.Parameters.AddWithValue("@EstadoAprobacion", EstadoPuesto);
                        command.Parameters.AddWithValue("@IdProducto", idProducto);
                        if(MotivoRechazo == "?") command.Parameters.AddWithValue("@MotivoRechazo", "");
                        else command.Parameters.AddWithValue("@MotivoRechazo", MotivoRechazo);

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
