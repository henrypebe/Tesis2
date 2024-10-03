using API_Tesis.BD;
using API_Tesis.Datos;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using System.Net;
using System.Net.Mail;
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
        [Route("/ActualizarConfirmacionPedido")]
        public async Task<IActionResult> ActualizarConfirmacionPedido(int idPedido)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();

                string query = @"
                    UPDATE Pedidos 
                    SET Estado = 2
                    WHERE IdPedido = @IdPedido";

                MySqlCommand command = new MySqlCommand(query, connection);
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
                            WHEN DATE(FechaEntrega) <= DATE(NOW()) THEN 4
                            ELSE 1 
                        END
                    WHERE Estado NOT IN (2, 3)";

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
        [Route("/ActualizarCantidadDireccion")]
        public async Task<IActionResult> ActualizarCantidadDireccion(int idUsuario)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();

                string query = @"
                    UPDATE Usuario 
                        SET CantCambiosDireccion = 1
                    WHERE IdUsuario = @IdUsuario
                        END";

                MySqlCommand command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@IdUsuario", idUsuario);
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
        [Route("/ActualizarCantidadMetodoPago")]
        public async Task<IActionResult> ActualizarCantidadMetodoPago(int idUsuario)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();

                string query = @"
                    UPDATE Usuario U
                    SET CantMetodoPago = (
                        SELECT COUNT(*)
                        FROM MetodoPago MP
                        WHERE MP.UsuarioID = U.IdUsuario AND MP.Estado = 1
                        AND IdUsuario = @IdUsuario
                    )
                    WHERE IdUsuario = @IdUsuario
                    ";

                MySqlCommand command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@IdUsuario", idUsuario);
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
        [Route("/UpdateOrCreateTallas")]
        public async Task<ActionResult> UpdateOrCreateTallas([FromForm] int idProducto, [FromForm] bool sBoolean, [FromForm] bool mBoolean, [FromForm] bool lBoolean,
            [FromForm] bool xlBoolean, [FromForm] bool xxlBoolean)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string checkQuery = @"SELECT COUNT(*) FROM TallaVestimenta WHERE IdProducto = @IdProducto";
                    MySqlCommand checkCommand = new MySqlCommand(checkQuery, connection);
                    checkCommand.Parameters.AddWithValue("@IdProducto", idProducto);

                    int count = Convert.ToInt32(await checkCommand.ExecuteScalarAsync());

                    if (count > 0)
                    {
                        string updateQuery = @"UPDATE TallaVestimenta 
                                       SET SBoolean = @SBoolean, MBoolean = @MBoolean, LBoolean = @LBoolean, 
                                           XLBoolean = @XLBoolean, XXLBoolean = @XXLBoolean
                                       WHERE IdProducto = @IdProducto";

                        MySqlCommand updateCommand = new MySqlCommand(updateQuery, connection);
                        updateCommand.Parameters.AddWithValue("@IdProducto", idProducto);
                        updateCommand.Parameters.AddWithValue("@SBoolean", sBoolean);
                        updateCommand.Parameters.AddWithValue("@MBoolean", mBoolean);
                        updateCommand.Parameters.AddWithValue("@LBoolean", lBoolean);
                        updateCommand.Parameters.AddWithValue("@XLBoolean", xlBoolean);
                        updateCommand.Parameters.AddWithValue("@XXLBoolean", xxlBoolean);

                        int rowsAffected = await updateCommand.ExecuteNonQueryAsync();

                        await connection.CloseAsync();

                        if (rowsAffected > 0)
                        {
                            return Ok("Tallas actualizadas exitosamente.");
                        }
                        else
                        {
                            return NotFound("No se encontraron tallas para actualizar.");
                        }
                    }
                    else
                    {
                        string insertQuery = @"INSERT INTO TallaVestimenta (IdProducto, SBoolean, MBoolean, LBoolean, XLBoolean, XXLBoolean)
                                       VALUES (@IdProducto, @SBoolean, @MBoolean, @LBoolean, @XLBoolean, @XXLBoolean)";

                        MySqlCommand insertCommand = new MySqlCommand(insertQuery, connection);
                        insertCommand.Parameters.AddWithValue("@IdProducto", idProducto);
                        insertCommand.Parameters.AddWithValue("@SBoolean", sBoolean);
                        insertCommand.Parameters.AddWithValue("@MBoolean", mBoolean);
                        insertCommand.Parameters.AddWithValue("@LBoolean", lBoolean);
                        insertCommand.Parameters.AddWithValue("@XLBoolean", xlBoolean);
                        insertCommand.Parameters.AddWithValue("@XXLBoolean", xxlBoolean);

                        int rowsInserted = await insertCommand.ExecuteNonQueryAsync();

                        await connection.CloseAsync();

                        if (rowsInserted > 0)
                        {
                            return Ok("Tallas creadas exitosamente.");
                        }
                        else
                        {
                            return BadRequest("Error al crear las tallas.");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Manejo de errores
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpPut]
        [Route("/EditarProducto")]
        public async Task<ActionResult<int>> EditarProducto([FromForm] int idProducto, [FromForm] string nombre, [FromForm] double precio, [FromForm] int cantidad, [FromForm] IFormFile image,
            [FromForm] string descripcion, [FromForm] double cantidadOferta, [FromForm] string cantidadGarantia, [FromForm] string tipoProducto, [FromForm] double costoEnvio,
            [FromForm] string tiempoEnvio, [FromForm] string idTienda, [FromForm] string tallaSeleccionada, [FromForm] string colorSeleccionado)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    if (tipoProducto == "Vestimenta")
                    {
                        string checkQuery = @"SELECT COUNT(*) FROM Producto p
                          JOIN TallaVestimenta t ON p.IdProducto = t.IdProducto
                          WHERE p.Nombre = @Nombre AND p.TipoProducto = @TipoProducto 
                          AND p.IdProducto != @IdProducto
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
                        checkCommand.Parameters.AddWithValue("@TallaSeleccionada", tallaSeleccionada == "NA"? "": tallaSeleccionada);
                        checkCommand.Parameters.AddWithValue("@IdProducto", idProducto);

                        int existingCount = Convert.ToInt32(await checkCommand.ExecuteScalarAsync());
                        if (existingCount > 0)
                        {
                            return BadRequest("Ya existe un producto con el mismo nombre, tipo Vestimenta y talla en esta tienda.");
                        }
                    }

                    byte[] imageBytes = null;
                    if (image != null)
                    {
                        using (var memoryStream = new MemoryStream())
                        {
                            await image.CopyToAsync(memoryStream);
                            imageBytes = memoryStream.ToArray();
                        }
                    }

                    // Verificar cambios en Producto
                    string selectQuery = "SELECT Nombre, Precio, Descripcion, CantidadOferta, CantidadGarantia, TipoProducto, Foto, Stock, CostoEnvio, TiempoEnvio, Color " +
                        "FROM Producto WHERE IdProducto = @IdProducto AND Estado = 1";
                    MySqlCommand selectCommand = new MySqlCommand(selectQuery, connection);
                    selectCommand.Parameters.AddWithValue("@IdProducto", idProducto);
                    MySqlDataReader reader = await selectCommand.ExecuteReaderAsync();
                    List<string> changes = new List<string>();
                    bool isTallaChanged = false;

                    if (reader.Read())
                    {
                        // Comparar y detectar cambios en los atributos del producto
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

                        if (reader.GetString("Color") != colorSeleccionado)
                            changes.Add($"Color: '{reader.GetString("Color")}' a '{colorSeleccionado}'");

                        reader.Close();

                        // Verificar cambios en TallaVestimenta
                        string selectTallaQuery = "SELECT SBoolean, MBoolean, LBoolean, XLBoolean, XXLBoolean FROM TallaVestimenta WHERE IdProducto = @IdProducto";
                        MySqlCommand selectTallaCommand = new MySqlCommand(selectTallaQuery, connection);
                        selectTallaCommand.Parameters.AddWithValue("@IdProducto", idProducto);
                        MySqlDataReader tallaReader = await selectTallaCommand.ExecuteReaderAsync();

                        if (tallaReader.Read())
                        {
                            bool currentS = tallaReader.GetBoolean("SBoolean");
                            bool currentM = tallaReader.GetBoolean("MBoolean");
                            bool currentL = tallaReader.GetBoolean("LBoolean");
                            bool currentXL = tallaReader.GetBoolean("XLBoolean");
                            bool currentXXL = tallaReader.GetBoolean("XXLBoolean");

                            tallaReader.Close();

                            bool newS = tallaSeleccionada == "Short (S)";
                            bool newM = tallaSeleccionada == "Medium (M)";
                            bool newL = tallaSeleccionada == "Large (L)";
                            bool newXL = tallaSeleccionada == "XL (Extra Large)";
                            bool newXXL = tallaSeleccionada == "XXL (Extra Extra Large)";

                            if (currentS != newS || currentM != newM || currentL != newL || currentXL != newXL || currentXXL != newXXL)
                            {
                                isTallaChanged = true;
                                changes.Add($"Talla cambiada a '{tallaSeleccionada}'");

                                // Actualizar la tabla TallaVestimenta
                                string updateTallaQuery = "UPDATE TallaVestimenta SET SBoolean = @S, MBoolean = @M, LBoolean = @L, XLBoolean = @XL, " +
                                    "XXLBoolean = @XXL WHERE IdProducto = @IdProducto";
                                MySqlCommand updateTallaCommand = new MySqlCommand(updateTallaQuery, connection);
                                updateTallaCommand.Parameters.AddWithValue("@IdProducto", idProducto);
                                updateTallaCommand.Parameters.AddWithValue("@S", newS);
                                updateTallaCommand.Parameters.AddWithValue("@M", newM);
                                updateTallaCommand.Parameters.AddWithValue("@L", newL);
                                updateTallaCommand.Parameters.AddWithValue("@XL", newXL);
                                updateTallaCommand.Parameters.AddWithValue("@XXL", newXXL);
                                await updateTallaCommand.ExecuteNonQueryAsync();
                            }
                        }
                        else
                        {
                            tallaReader.Close();
                        }

                        if (changes.Any())
                        {
                            string changeDescription = "Se realizaron cambios en los atributos: " + string.Join(", ", changes);
                            string updateQuery = "UPDATE Producto SET Nombre = @Nombre, Precio = @Precio, Descripcion = @Descripcion, CantidadOferta = @CantidadOferta," +
                                "CantidadGarantia = @CantidadGarantia, TipoProducto = @TipoProducto, Foto = @Foto, Stock = @Stock, EstadoAprobacion = @EstadoAprobacion, " +
                                "CostoEnvio = @CostoEnvio, TiempoEnvio = @TiempoEnvio, Color = @Color WHERE IdProducto = @IdProducto AND Estado = 1";
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
                            command.Parameters.AddWithValue("@Color", colorSeleccionado);
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
                            return Ok("No se hizo ningún cambio");
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

                    // Obtener la dirección actual del usuario
                    string queryGetDireccion = "SELECT Direccion FROM Usuario WHERE IdUsuario = @IdUsuario";
                    using (MySqlCommand commandGetDireccion = new MySqlCommand(queryGetDireccion, connection))
                    {
                        commandGetDireccion.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        string direccionActual = await commandGetDireccion.ExecuteScalarAsync() as string;

                        // Si la dirección es la misma, actualiza sin contar el cambio de dirección
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
                                command.Parameters.AddWithValue("@Telefono", numero == -1 ? -1 : numero);
                                command.Parameters.AddWithValue("@Direccion", direccion == "a" ? "" : direccion);
                                if (correoAlternativo != "a") command.Parameters.AddWithValue("@CorreoAlternativo", correoAlternativo);

                                int rowsAffected = await command.ExecuteNonQueryAsync();

                                if (rowsAffected > 0)
                                {
                                    // Verificar si el usuario es un vendedor
                                    string queryCheckVendedor = "SELECT COUNT(*) FROM Vendedor WHERE usuarioId = @UsuarioId";
                                    using (MySqlCommand commandCheckVendedor = new MySqlCommand(queryCheckVendedor, connection))
                                    {
                                        commandCheckVendedor.Parameters.AddWithValue("@UsuarioId", idUsuario);
                                        int vendedorCount = Convert.ToInt32(await commandCheckVendedor.ExecuteScalarAsync());

                                        // Si el usuario es un vendedor, actualizar el estado a 2
                                        if (vendedorCount > 0)
                                        {
                                            string queryUpdateVendedor = "UPDATE Vendedor SET Estado = 2 WHERE usuarioId = @UsuarioId";
                                            using (MySqlCommand commandUpdateVendedor = new MySqlCommand(queryUpdateVendedor, connection))
                                            {
                                                commandUpdateVendedor.Parameters.AddWithValue("@UsuarioId", idUsuario);
                                                await commandUpdateVendedor.ExecuteNonQueryAsync();
                                            }
                                        }
                                    }

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

                    // Si la dirección ha cambiado, actualiza y suma un cambio de dirección
                    string query = "";
                    if (correoAlternativo != "a")
                    {
                        query = "UPDATE Usuario SET Apellido = @Apellido, Nombre = @Nombre, Correo = @Correo, Telefono = @Telefono," +
                            "Direccion = @Direccion, CorreoAlternativo = @CorreoAlternativo, CantCambiosDireccion = CantCambiosDireccion + 1 WHERE idUsuario = @IdUsuario AND Estado = 1";
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
                            // Verificar si el usuario es un vendedor
                            string queryCheckVendedor = "SELECT COUNT(*) FROM Vendedor WHERE usuarioId = @UsuarioId";
                            using (MySqlCommand commandCheckVendedor = new MySqlCommand(queryCheckVendedor, connection))
                            {
                                commandCheckVendedor.Parameters.AddWithValue("@UsuarioId", idUsuario);
                                int vendedorCount = Convert.ToInt32(await commandCheckVendedor.ExecuteScalarAsync());

                                // Si el usuario es un vendedor, actualizar el estado a 2
                                if (vendedorCount > 0)
                                {
                                    string queryUpdateVendedor = "UPDATE Vendedor SET Estado = 2 WHERE usuarioId = @UsuarioId";
                                    using (MySqlCommand commandUpdateVendedor = new MySqlCommand(queryUpdateVendedor, connection))
                                    {
                                        commandUpdateVendedor.Parameters.AddWithValue("@UsuarioId", idUsuario);
                                        await commandUpdateVendedor.ExecuteNonQueryAsync();
                                    }
                                }
                            }

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

                MySqlConnection connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();
                
                byte[] imageBytes = null;
                if (image != null)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await image.CopyToAsync(memoryStream);
                        imageBytes = memoryStream.ToArray();
                    }
                }

                // Obtener los datos actuales de la tienda
                string selectQuery = @"SELECT Nombre, Descripcion, Direccion, Provincia, Pais, Foto FROM Tienda WHERE IdTienda = @IdTienda";
                MySqlCommand selectCommand = new MySqlCommand(selectQuery, connection);
                selectCommand.Parameters.AddWithValue("@IdTienda", idTienda);

                using (var reader = await selectCommand.ExecuteReaderAsync())
                {
                    if (reader.Read())
                    {
                        string nombreActual = reader.GetString(0);
                        string descripcionActual = reader.GetString(1);
                        string direccionActual = reader.GetString(2);
                        string provinciaActual = reader.GetString(3);
                        string paisActual = reader.GetString(4);
                        byte[] fotoActual = (byte[])reader.GetValue(5);

                        bool cambios = false;
                        StringBuilder detallesCambio = new StringBuilder();

                        // Verificar si hay cambios en los datos
                        if (nombre != nombreActual)
                        {
                            cambios = true;
                            detallesCambio.AppendLine($"Nombre cambiado de '{nombreActual}' a '{nombre}'");
                        }

                        if (descripcion != descripcionActual)
                        {
                            cambios = true;
                            detallesCambio.AppendLine($"Descripción cambiada de '{descripcionActual}' a '{descripcion}'");
                        }

                        if (direccion != direccionActual)
                        {
                            cambios = true;
                            detallesCambio.AppendLine($"Dirección cambiada de '{direccionActual}' a '{direccion}'");
                        }

                        if (Provincia != provinciaActual)
                        {
                            cambios = true;
                            detallesCambio.AppendLine($"Provincia cambiada de '{provinciaActual}' a '{Provincia}'");
                        }

                        if (pais != paisActual)
                        {
                            cambios = true;
                            detallesCambio.AppendLine($"País cambiado de '{paisActual}' a '{pais}'");
                        }

                        reader.Close();

                        if (cambios)
                        {
                            // Realizar el update en la tabla Tienda
                            string updateQuery = @"UPDATE Tienda SET Nombre = @Nombre, Descripcion = @Descripcion, Direccion = @Direccion, Provincia = @Provincia, Pais = @Pais, 
                                Foto = @Foto, Estado = @Estado WHERE IdTienda = @IdTienda AND Estado <> 4";
                            MySqlCommand updateCommand = new MySqlCommand(updateQuery, connection);
                            updateCommand.Parameters.AddWithValue("@Nombre", nombre);
                            updateCommand.Parameters.AddWithValue("@Descripcion", descripcion);
                            updateCommand.Parameters.AddWithValue("@Direccion", direccion);
                            updateCommand.Parameters.AddWithValue("@Provincia", Provincia);
                            updateCommand.Parameters.AddWithValue("@Pais", pais);
                            updateCommand.Parameters.AddWithValue("@IdTienda", idTienda);
                            updateCommand.Parameters.AddWithValue("@Estado", 2);
                            updateCommand.Parameters.AddWithValue("@Foto", imageBytes);

                            // Ejecutar el update
                            await updateCommand.ExecuteNonQueryAsync();

                            await connection.CloseAsync();
                            await connection.OpenAsync();

                            // Insertar el registro en la tabla HistorialCambiosTienda
                            string insertQuery = @"INSERT INTO HistorialCambiosTienda (FechaHora, Descripcion, TiendaID) VALUES (@FechaHora, @Descripcion, @TiendaID)";
                            MySqlCommand insertCommand = new MySqlCommand(insertQuery, connection);
                            insertCommand.Parameters.AddWithValue("@FechaHora", DateTime.Now);
                            insertCommand.Parameters.AddWithValue("@Descripcion", detallesCambio.ToString());
                            insertCommand.Parameters.AddWithValue("@TiendaID", idTienda);

                            await insertCommand.ExecuteNonQueryAsync();
                        }

                        if (cambios)
                        {
                            return Ok();
                        }
                        else
                        {
                            return NoContent(); // No hay cambios
                        }
                    }
                    else
                    {
                        return NotFound(); // Tienda no encontrada
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
                    command.Parameters.AddWithValue("@Estado", 2);
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
                        updateQuery = "UPDATE Tienda SET Estado = 4 WHERE UsuarioID = @IdUsuario";
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
        [Route("/AsignarTiendaVendedorAsistente")]
        public async Task<IActionResult> AsignarTiendaVendedorAsistente(int idUsuario, int idTienda)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string selectQuery = "SELECT COUNT(*) FROM Tienda WHERE IdTienda = @idTienda";
                    using (MySqlCommand selectCommand = new MySqlCommand(selectQuery, connection))
                    {
                        selectCommand.Parameters.AddWithValue("@idTienda", idTienda);
                        int count = Convert.ToInt32(await selectCommand.ExecuteScalarAsync());

                        if (count == 0)
                        {
                            return BadRequest("No se encontró una tienda con ese ID");
                        }
                    }

                    string updateQuery = "UPDATE Vendedor SET TiendaID = @TiendaID, Estado = @Estado WHERE usuarioId = @usuarioId";
                    using (MySqlCommand command = new MySqlCommand(updateQuery, connection))
                    {
                        command.Parameters.AddWithValue("@TiendaID", idTienda);
                        command.Parameters.AddWithValue("@usuarioId", idUsuario);
                        command.Parameters.AddWithValue("@Estado", 2);

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
        [Route("/EditarRolVendedorUsuario")]
        public async Task<IActionResult> EditarVendedorUsuario(int idUsuario, bool esAsistenteVendedor)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string updateQuery = "UPDATE Vendedor SET esAdministrador = @esAdministrador, Estado = @Estado WHERE usuarioId = @usuarioId";
                    using (MySqlCommand command = new MySqlCommand(updateQuery, connection))
                    {
                        command.Parameters.AddWithValue("@esAdministrador", !esAsistenteVendedor);
                        command.Parameters.AddWithValue("@usuarioId", idUsuario);
                        if(esAsistenteVendedor) command.Parameters.AddWithValue("@Estado", 2);
                        else command.Parameters.AddWithValue("@Estado", 1);

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
        [Route("/AprobaciónVendedorAsistente")]
        public async Task<IActionResult> AprobaciónVendedorAsistente(int idUsuario, int Estado)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string updateQuery = "UPDATE Vendedor SET Estado = @Estado WHERE usuarioId = @usuarioId";
                    using (MySqlCommand command = new MySqlCommand(updateQuery, connection))
                    {
                        command.Parameters.AddWithValue("@Estado", Estado);
                        command.Parameters.AddWithValue("@usuarioId", idUsuario);

                        await command.ExecuteNonQueryAsync();
                    }

                    string correoDestino = "";
                    string query = "SELECT Correo FROM Usuario WHERE IdUsuario = @usuarioId";
                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@usuarioId", idUsuario);

                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                correoDestino = reader.GetString("Correo");
                            }
                        }
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
                                string asunto = $"Estado de aprobación como vendedor asistente - {formattedDate}";
                                StringBuilder htmlBody = new StringBuilder();
                                htmlBody.Append("<h3>A continuación se informa el estado de la aprobación como vendedor Asistente</h3>");
                                if (Estado == 1)
                                {
                                    htmlBody.Append($"<b><p>Aprobado</p></b>");
                                    htmlBody.Append($"<p>Puede ingresar al login correctamente</p>");
                                }
                                else
                                {
                                    htmlBody.Append($"<b><p>Rechazado</p></b>");
                                    htmlBody.Append($"<p>Puede ingresar al login usando otro rol</p>");
                                }

                                MailMessage message = new MailMessage
                                {
                                    From = new MailAddress(correoOrigen, "Notificaciones E-Commerce"),
                                    Subject = asunto,
                                    Body = htmlBody.ToString(),
                                    IsBodyHtml = true
                                };

                                message.To.Add(correoDestino);

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
        [Route("/AprobaciónTienda")]
        public async Task<IActionResult> AprobaciónTienda(int idTienda, int Estado, string MotivoRechazo)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string updateQuery = "UPDATE Tienda SET Estado = @Estado, MotivoRechazo = @MotivoRechazo WHERE IdTienda = @IdTienda";
                    using (MySqlCommand command = new MySqlCommand(updateQuery, connection))
                    {
                        command.Parameters.AddWithValue("@Estado", Estado);
                        command.Parameters.AddWithValue("@IdTienda", idTienda);
                        if(MotivoRechazo != "?") command.Parameters.AddWithValue("@MotivoRechazo", MotivoRechazo);
                        else command.Parameters.AddWithValue("@MotivoRechazo", "");

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
