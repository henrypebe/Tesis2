﻿using API_Tesis.BD;
using API_Tesis.Datos;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using System.Data.SqlTypes;
using System;
using System.Net;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;

namespace API_Tesis.Controllers
{
    [ApiController]
    public class ApiControllerGet : ControllerBase
    {
        private readonly BDMysql _context;
        private readonly IConfiguration _configuration;
        public ApiControllerGet(BDMysql context, IConfiguration configuration)
        {
            _configuration = configuration;
            _context = context;
        }
        [HttpGet]
        [Route("/ProductosGeneral")]
        public ActionResult<IEnumerable<Producto>> GetListProductosGeneral()
        {
            List<Producto> productos = new List<Producto>();
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();
                string query = @"
                SELECT p.*, tv.SBoolean, tv.MBoolean, tv.LBoolean, tv.XLBoolean, tv.XXLBoolean 
                FROM Producto p
                LEFT JOIN TallaVestimenta tv ON p.IdProducto = tv.IdProducto
                WHERE p.Estado = 1 AND p.EstadoAprobacion = @EstadoAprobacion";

                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@EstadoAprobacion", "Pendiente");
                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            string tallaSeleccionada = "";
                            if (!reader.IsDBNull(reader.GetOrdinal("SBoolean")) && reader.GetBoolean("SBoolean")) tallaSeleccionada = "Short (S)";
                            else if (!reader.IsDBNull(reader.GetOrdinal("MBoolean")) && reader.GetBoolean("MBoolean")) tallaSeleccionada = "Medium (M)";
                            else if (!reader.IsDBNull(reader.GetOrdinal("LBoolean")) && reader.GetBoolean("LBoolean")) tallaSeleccionada = "Large (L)";
                            else if (!reader.IsDBNull(reader.GetOrdinal("XLBoolean")) && reader.GetBoolean("XLBoolean")) tallaSeleccionada = "XL (Extra Large)";
                            else if (!reader.IsDBNull(reader.GetOrdinal("XXLBoolean")) && reader.GetBoolean("XXLBoolean")) tallaSeleccionada = "XXL (Extra Extra Large)";

                            Producto producto = new Producto
                            {
                                IdProducto = reader.GetInt32("IdProducto"),
                                Nombre = reader.GetString("Nombre"),
                                Precio = reader.GetDouble("Precio"),
                                Stock = reader.GetInt32("Stock"),
                                FechaCreacion = reader.GetDateTime("FechaCreacion"),
                                Descripcion = reader.GetString("Descripcion") != "NE" ? reader.GetString("Descripcion") : "Sin Descripción",
                                CantidadOferta = reader.GetDouble("CantidadOferta"),
                                CostoEnvio = reader.GetDouble("CostoEnvio"),
                                CantidadGarantia = reader.GetString("CantidadGarantia"),
                                EstadoAprobacion = reader.GetString("EstadoAprobacion"),
                                TipoProducto = reader.GetString("TipoProducto"),
                                TiendaId = reader.GetInt32("TiendaId"),
                                Imagen = ConvertirBytesAImagen(reader["Foto"] as byte[]),
                                CantidadVentas = reader.GetInt32("CantidadVentas"),
                                Color = reader.GetString("Color"),
                                Talla = tallaSeleccionada
                            };
                            productos.Add(producto);
                        }
                    }
                }
                connection.Close();
            }

            return Ok(productos);
        }
        [HttpGet]
        [Route("/KeyEncript")]
        public IActionResult GetToken()
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    string query = "SELECT KeyVar FROM KeyEncript WHERE IdKey = 1";
                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        object result = command.ExecuteScalar();
                        if (result != null)
                        {
                            string key = result.ToString();
                            connection.Close();
                            return Ok(key);
                        }
                        else
                        {
                            connection.Close();
                            return NotFound("Usuario no encontrado");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener el token: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/TokenIdUsuario")]
        public IActionResult GetToken(int id)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    string query = "SELECT Token FROM Usuario WHERE IdUsuario = @Id AND Estado = 1";
                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);
                        object result = command.ExecuteScalar();
                        if (result != null)
                        {
                            string token = result.ToString();
                            connection.Close();
                            return Ok(token);
                        }
                        else
                        {
                            connection.Close();
                            return NotFound("Usuario no encontrado");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener el token: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/ObtenerRol")]
        public async Task<IActionResult> VerificarRoles(int idUsuario)
        {
            int opcionPantalla = 0;
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                await connection.OpenAsync();
                string query = @"SELECT EsAdministrador, EsComprador, EsVendedor FROM Usuario WHERE IdUsuario = @IdUsuario";
                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@IdUsuario", idUsuario);
                    using (MySqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            bool EsAdministrador = reader.GetBoolean("EsAdministrador");
                            bool EsComprador = reader.GetBoolean("EsComprador");
                            bool EsVendedor = reader.GetBoolean("EsVendedor");

                            if (EsAdministrador)
                            {
                                opcionPantalla = 1;
                            }
                            else if (EsComprador)
                            {
                                opcionPantalla = 2;
                            }
                            else if (EsVendedor)
                            {
                                opcionPantalla = 3;
                            }
                        }
                    }
                }
            }
            return Ok(opcionPantalla);
        }
        [HttpGet]
        [Route("/RecuperarContrasenha")]
        public async Task<IActionResult> VerifyUser(string correo)
        {
            try
            {
                ValoresRecuperacionContrasenha _valor = new ValoresRecuperacionContrasenha();
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

                    string query = "SELECT ContrasenhaVariado, IdUsuario FROM Usuario WHERE Correo = @Correo AND Estado = 1";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Correo", correo);

                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                int idUsuario = reader.GetInt32("IdUsuario");
                                string constranseha = reader.GetString("ContrasenhaVariado");
                                string decryptedText = Decrypt(constranseha, base64Key);
                                _valor.IdUsuario = idUsuario;
                                _valor.ContrasenhaVariado = decryptedText;

                                string correoOrigen = "test@sbperu.net";
                                string contraseñaCorreo = "oyzlwfgvducseiga";

                                string asunto = $"Correo de Recuperación de Contraseña";
                                StringBuilder htmlBody = new StringBuilder();
                                htmlBody.Append("<h3>Se envia la contraseña para que pueda realizar el login:</h3>");
                                htmlBody.Append($"<p style=\"font-size: 16px;\">{decryptedText}</p>");

                                MailMessage message = new MailMessage
                                {
                                    From = new MailAddress(correoOrigen, "Prueba Tesis 2"),
                                    Subject = asunto,
                                    Body = htmlBody.ToString(),
                                    IsBodyHtml = true
                                };

                                message.To.Add(correo);

                                SmtpClient clienteSmtp = new SmtpClient("smtp.gmail.com")
                                {
                                    Port = 587,
                                    Credentials = new NetworkCredential(correoOrigen, contraseñaCorreo),
                                    EnableSsl = true
                                };

                                try
                                {
                                    await clienteSmtp.SendMailAsync(message);
                                    Console.WriteLine("Correo enviado correctamente");
                                    return Ok(idUsuario);
                                }
                                catch (Exception ex)
                                {
                                    Console.WriteLine($"Error al enviar el correo: {ex.Message}");
                                    return BadRequest();
                                }
                            }
                            else
                            {
                                return NotFound("Usuario no encontrado.");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al verificar el usuario: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/ListasProductosGeneral")]
        public ActionResult<IEnumerable<Producto>> GetProductosGeneral(string busqueda)
        {
            List<Producto> productos = new List<Producto>();
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();
                string query = @"
                    SELECT p.*, t.Nombre AS NombreTienda, t.Foto AS FotoTienda, 
                           tv.SBoolean, tv.MBoolean, tv.LBoolean, tv.XLBoolean, tv.XXLBoolean
                    FROM Producto p 
                    INNER JOIN Tienda t ON p.TiendaID = t.IdTienda 
                    LEFT JOIN TallaVestimenta tv ON p.IdProducto = tv.IdProducto
                    WHERE p.Estado = 1 
                    AND p.EstadoAprobacion <> 'Pendiente' 
                    AND p.EstadoAprobacion <> 'Rechazado' 
                    AND p.Stock >= 1 
                    AND t.Estado = 1";

                if (busqueda != "nada")
                {
                    query += " AND (p.Nombre LIKE @Busqueda OR p.TipoProducto LIKE @Busqueda OR p.IdProducto LIKE @Busqueda)";
                }

                query += " ORDER BY p.CantidadVentas ASC";

                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    if (busqueda != "nada")
                    {
                        command.Parameters.AddWithValue("@Busqueda", $"%{busqueda}%");
                    }

                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            string tallaSeleccionada = "";
                            if (!reader.IsDBNull(reader.GetOrdinal("SBoolean")) && reader.GetBoolean("SBoolean")) tallaSeleccionada = "Short (S)";
                            else if (!reader.IsDBNull(reader.GetOrdinal("MBoolean")) && reader.GetBoolean("MBoolean")) tallaSeleccionada = "Medium (M)";
                            else if (!reader.IsDBNull(reader.GetOrdinal("LBoolean")) && reader.GetBoolean("LBoolean")) tallaSeleccionada = "Large (L)";
                            else if (!reader.IsDBNull(reader.GetOrdinal("XLBoolean")) && reader.GetBoolean("XLBoolean")) tallaSeleccionada = "XL (Extra Large)";
                            else if (!reader.IsDBNull(reader.GetOrdinal("XXLBoolean")) && reader.GetBoolean("XXLBoolean")) tallaSeleccionada = "XXL (Extra Extra Large)";

                            string nombreProducto = reader.GetString("Nombre").Replace("_", " ");
                            string descripcionProducto = reader.GetString("Descripcion").Replace("_", " ");
                            string FechaEnvio = reader.IsDBNull(reader.GetOrdinal("TiempoEnvio")) ? "" : reader.GetString("TiempoEnvio");

                            Producto producto = new Producto
                            {
                                IdProducto = reader.GetInt32("IdProducto"),
                                Nombre = nombreProducto,
                                Precio = reader.GetDouble("Precio"),
                                Stock = reader.GetInt32("Stock"),
                                Descripcion = descripcionProducto,
                                CantidadOferta = reader.GetDouble("CantidadOferta"),
                                CostoEnvio = reader.GetDouble("CostoEnvio"),
                                FechaEnvio = FechaEnvio,
                                CantidadGarantia = reader.IsDBNull(reader.GetOrdinal("CantidadGarantia")) ? "" : reader.GetString("CantidadGarantia"),
                                EstadoAprobacion = reader.IsDBNull(reader.GetOrdinal("EstadoAprobacion")) ? "" : reader.GetString("EstadoAprobacion"),
                                MotivoRechazo = reader.IsDBNull(reader.GetOrdinal("MotivoRechazo")) ? "" : reader.GetString("MotivoRechazo"),
                                TipoProducto = reader.IsDBNull(reader.GetOrdinal("TipoProducto")) ? "" : reader.GetString("TipoProducto"),
                                TiendaId = reader.GetInt32("TiendaId"),
                                TiendaNombre = reader.IsDBNull(reader.GetOrdinal("NombreTienda")) ? "" : reader.GetString("NombreTienda"),
                                TiendaFoto = ConvertirBytesAImagen(reader["FotoTienda"] as byte[]),
                                Imagen = ConvertirBytesAImagen(reader["Foto"] as byte[]),
                                CantidadVentas = reader.GetInt32("CantidadVentas"),
                                FechaCreacion = reader.GetDateTime("FechaCreacion"),
                                Color = reader.GetString("Color"),
                                Talla = tallaSeleccionada
                            };
                            productos.Add(producto);
                        }
                    }
                }
                connection.Close();
            }

            return Ok(productos);
        }
        [HttpGet]
        [Route("/GetTallasPorProducto")]
        public async Task<ActionResult> GetTallasPorProducto(int idProducto)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"SELECT IdTalla, IdProducto, SBoolean, MBoolean, LBoolean, XLBoolean, XXLBoolean 
                             FROM TallaVestimenta 
                             WHERE IdProducto = @IdProducto";

                    MySqlCommand command = new MySqlCommand(query, connection);
                    command.Parameters.AddWithValue("@IdProducto", idProducto);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (reader.HasRows)
                        {
                            DatoTallaVestimenta datoTallaVestimenta = new DatoTallaVestimenta();

                            while (await reader.ReadAsync())
                            {
                                datoTallaVestimenta.IdTallaVestimenta = reader.GetInt32("IdTalla");
                                datoTallaVestimenta.IdProducto = reader.GetInt32("IdProducto");
                                datoTallaVestimenta.S = reader.GetBoolean("SBoolean");
                                datoTallaVestimenta.M = reader.GetBoolean("MBoolean");
                                datoTallaVestimenta.L = reader.GetBoolean("LBoolean");
                                datoTallaVestimenta.XL = reader.GetBoolean("XLBoolean");
                                datoTallaVestimenta.XXL = reader.GetBoolean("XXLBoolean");
                            }

                            return Ok(datoTallaVestimenta);
                        }
                        else
                        {
                            return NotFound("No se encontraron tallas para el producto especificado.");
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
        [HttpGet]
        [Route("/ListasProductos")]
        public ActionResult<IEnumerable<Producto>> GetProductos(int idTienda, string busqueda)
        {
            List<Producto> productos = new List<Producto>();
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();
                string query = @"
                    SELECT p.*, tv.SBoolean, tv.MBoolean, tv.LBoolean, tv.XLBoolean, tv.XXLBoolean 
                    FROM Producto p
                    LEFT JOIN TallaVestimenta tv ON p.IdProducto = tv.IdProducto
                    WHERE p.Estado = 1 AND p.TiendaID = @TiendaID";

                if (busqueda != "nada")
                {
                    query += " AND (p.Nombre LIKE @Busqueda OR p.TipoProducto LIKE @Busqueda OR p.IdProducto LIKE @Busqueda)";
                }

                query += " ORDER BY p.CantidadVentas DESC";

                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@TiendaID", idTienda);
                    if (busqueda != "nada")
                    {
                        command.Parameters.AddWithValue("@Busqueda", $"%{busqueda}%");
                    }

                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            string tallaSeleccionada = "";
                            if (!reader.IsDBNull(reader.GetOrdinal("SBoolean")) && reader.GetBoolean("SBoolean")) tallaSeleccionada = "Short (S)";
                            else if (!reader.IsDBNull(reader.GetOrdinal("MBoolean")) && reader.GetBoolean("MBoolean")) tallaSeleccionada = "Medium (M)";
                            else if (!reader.IsDBNull(reader.GetOrdinal("LBoolean")) && reader.GetBoolean("LBoolean")) tallaSeleccionada = "Large (L)";
                            else if (!reader.IsDBNull(reader.GetOrdinal("XLBoolean")) && reader.GetBoolean("XLBoolean")) tallaSeleccionada = "XL (Extra Large)";
                            else if (!reader.IsDBNull(reader.GetOrdinal("XXLBoolean")) && reader.GetBoolean("XXLBoolean")) tallaSeleccionada = "XXL (Extra Extra Large)";

                            string nombreProducto = reader.GetString("Nombre").Replace("_", " ");
                            string descripcionProducto = reader.GetString("Descripcion").Replace("_", " ");
                            double CostoEnvio = reader.IsDBNull(reader.GetOrdinal("CostoEnvio")) ? 0 : reader.GetDouble("CostoEnvio");
                            string FechaEnvio = reader.IsDBNull(reader.GetOrdinal("TiempoEnvio")) ? "" : reader.GetString("TiempoEnvio");

                            Producto producto = new Producto
                            {
                                IdProducto = reader.GetInt32("IdProducto"),
                                Nombre = nombreProducto,
                                Precio = reader.GetDouble("Precio"),
                                Stock = reader.GetInt32("Stock"),
                                Descripcion = descripcionProducto == "NE" ? "" : descripcionProducto,
                                CantidadOferta = reader.GetDouble("CantidadOferta"),
                                CostoEnvio = CostoEnvio,
                                FechaEnvio = FechaEnvio,
                                CantidadGarantia = reader.GetString("CantidadGarantia"),
                                EstadoAprobacion = reader.GetString("EstadoAprobacion"),
                                MotivoRechazo = reader.IsDBNull(reader.GetOrdinal("MotivoRechazo")) ? "" : reader.GetString("MotivoRechazo"),
                                TipoProducto = reader.GetString("TipoProducto"),
                                TiendaId = reader.GetInt32("TiendaId"),
                                Imagen = ConvertirBytesAImagen(reader["Foto"] as byte[]),
                                CantidadVentas = reader.GetInt32("CantidadVentas"),
                                FechaCreacion = reader.GetDateTime("FechaCreacion"),
                                Color = reader.GetString("Color"),
                                Talla = tallaSeleccionada
                            };
                            productos.Add(producto);
                        }
                    }
                }
                connection.Close();
            }

            return Ok(productos);
        }
        [HttpGet]
        [Route("/ListarHistorialCambiosProducto")]
        public async Task<IActionResult> ListarHistorialCambiosProducto(int idProducto)
        {
            try
            {
                List<HistorialProducto> HistorialProductos = new List<HistorialProducto>();
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                        SELECT h.FechaHora, h.Descripcion FROM HistorialCambiosProducto h
                        WHERE h.ProductoID = @idProducto";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@idProducto", idProducto);
                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                HistorialProducto HistorialProducto = new HistorialProducto
                                {
                                    FechaHora = reader.GetDateTime("FechaHora"),
                                    Descripcion = reader.GetString("Descripcion"),
                                };

                                HistorialProductos.Add(HistorialProducto);
                            }
                            return Ok(HistorialProductos);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/ListarHistorialCambiosTienda")]
        public async Task<IActionResult> ListarHistorialCambiosTienda(int idTienda)
        {
            try
            {
                List<HistorialProducto> HistorialProductos = new List<HistorialProducto>();
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                        SELECT h.FechaHora, h.Descripcion FROM HistorialCambiosTienda h
                        WHERE h.TiendaID = @idTienda";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@idTienda", idTienda);
                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                HistorialProducto HistorialProducto = new HistorialProducto
                                {
                                    FechaHora = reader.GetDateTime("FechaHora"),
                                    Descripcion = reader.GetString("Descripcion"),
                                };

                                HistorialProductos.Add(HistorialProducto);
                            }
                            return Ok(HistorialProductos);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/ListarPedidosCompletadosPorFecha")]
        public async Task<IActionResult> ListarPedidosCompletadosPorFecha(int idUsuario, DateTime FechaFiltro)
        {
            try
            {
                List<Pedido> pedidos = new List<Pedido>();
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                        SELECT p.IdPedido, p.FechaEntrega, p.FechaCreacion, p.Total, p.Estado, p.Reclamo, p.CantidadProductos, 
	                    p.MetodoPago, t.IdTienda, t.Nombre AS NombreTienda, pp.ProductoID, pp.Cantidad, pr.Precio, 
                        pr.Nombre as NombreProducto, pp.TieneSeguimiento, pp.IdPedidoXProducto, pp.TieneReclamo,
                        u.Nombre AS NombreDuenho, u.Apellido AS ApellidoDuenho, u.IdUsuario as IdDuenho, pr.CantidadOferta,
                        p.CostoEnvio, pr.Color, tv.SBoolean, tv.MBoolean, tv.LBoolean, tv.XLBoolean, tv.XXLBoolean
                        FROM Pedidos p
                        INNER JOIN PedidoXProducto pp ON p.IdPedido = pp.PedidoID
                        INNER JOIN Producto pr ON pr.IdProducto = pp.ProductoID
                        INNER JOIN Tienda t ON t.IdTienda = pr.TiendaID
                        INNER JOIN Usuario u ON u.IdUsuario = t.UsuarioID
                        LEFT JOIN TallaVestimenta tv ON pr.IdProducto = tv.IdProducto
                        WHERE p.UsuarioID = @IdUsuario AND p.Estado <> 3";

                    if (FechaFiltro != DateTime.MinValue)
                    {
                        query += " AND (DATE_FORMAT(p.FechaEntrega, '%Y-%m-%d') = @FechaFiltro)";
                    }

                    query += " ORDER BY p.FechaEntrega DESC";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        if (FechaFiltro != DateTime.MinValue)
                        {
                            string fechaFiltroFormateada = FechaFiltro.ToString("yyyy-MM-dd");
                            command.Parameters.AddWithValue("@FechaFiltro", fechaFiltroFormateada);
                        }
                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                int idPedido = reader.GetInt32("IdPedido");
                                string tallaSeleccionada = "";
                                if (!reader.IsDBNull(reader.GetOrdinal("SBoolean")) && reader.GetBoolean("SBoolean")) tallaSeleccionada = "Short (S)";
                                else if (!reader.IsDBNull(reader.GetOrdinal("MBoolean")) && reader.GetBoolean("MBoolean")) tallaSeleccionada = "Medium (M)";
                                else if (!reader.IsDBNull(reader.GetOrdinal("LBoolean")) && reader.GetBoolean("LBoolean")) tallaSeleccionada = "Large (L)";
                                else if (!reader.IsDBNull(reader.GetOrdinal("XLBoolean")) && reader.GetBoolean("XLBoolean")) tallaSeleccionada = "XL (Extra Large)";
                                else if (!reader.IsDBNull(reader.GetOrdinal("XXLBoolean")) && reader.GetBoolean("XXLBoolean")) tallaSeleccionada = "XXL (Extra Extra Large)";

                                Pedido pedidoExistente = pedidos.FirstOrDefault(p => p.IdPedido == idPedido);
                                if (pedidoExistente == null)
                                {
                                    pedidoExistente = new Pedido
                                    {
                                        IdPedido = idPedido,
                                        IdDuenho = reader.GetInt32("IdDuenho"),
                                        FechaEntrega = reader.GetDateTime("FechaEntrega"),
                                        FechaCreacion = reader.GetDateTime("FechaCreacion"),
                                        Total = reader.GetDouble("Total"),
                                        Estado = reader.GetInt32("Estado"),
                                        ReclamoPedido = reader.GetBoolean("Reclamo"),
                                        CostoEnvio = reader.GetDouble("CostoEnvio"),
                                        ProductosLista = new List<ProductoPedido>()
                                    };

                                    pedidos.Add(pedidoExistente);
                                }
                                bool _tieneSeguimiento = reader.GetBoolean("TieneSeguimiento");
                                pedidoExistente.ProductosLista.Add(new ProductoPedido
                                {
                                    IdPedidoXProducto = reader.GetInt32("IdPedidoXProducto"),
                                    NombreTienda = reader.GetString("NombreTienda"),
                                    NombreDueño = reader.GetString("NombreDuenho"),
                                    ApellidoDuenho = reader.GetString("ApellidoDuenho"),
                                    IdProducto = reader.GetInt32("ProductoID"),
                                    IdTienda = reader.GetInt32("IdTienda"),
                                    NombreProducto = reader.GetString("NombreProducto"),
                                    Cantidad = reader.GetInt32("Cantidad"),
                                    Precio = reader.GetDouble("Precio"),
                                    CantidadOferta = reader.GetDouble("CantidadOferta"),
                                    Color = reader.GetString("Color"),
                                    Talla = tallaSeleccionada,
                                    TieneSeguimiento = _tieneSeguimiento,
                                    TieneReclamo = reader.GetBoolean("TieneReclamo"),
                                });
                            }
                            return Ok(pedidos);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/ObtenerInformacionChat")]
        public async Task<IActionResult> ObtenerInformacionChat(int IdPedido)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            List<object> valores = new List<object>();
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                await connection.OpenAsync();

                string query = @"
                        SELECT pp.IdPedidoXProducto, c.FinalizarCliente FROM Chat c 
                        INNER JOIN PedidoXProducto pp ON pp.IdPedidoXProducto = c.PedidoXProductoID
                        INNER JOIN Pedidos p ON p.IdPedido = pp.PedidoID
                        WHERE p.IdPedido = @IdPedido";


                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@IdPedido", IdPedido);
                    
                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            bool FinalizarCliente = reader.GetBoolean("FinalizarCliente");

                            var valor = new
                            {
                                IdPedidoXProducto = reader.GetInt32("IdPedidoXProducto"),
                                FinalizarCliente = FinalizarCliente
                            };

                            valores.Add(valor);
                        }
                        return Ok(valores);
                    }
                }
            }
        }
        [HttpGet]
        [Route("/ObtenerEstadoVendedor")]
        public async Task<IActionResult> ObtenerEstadoVendedor(int idVendedor)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    // Consulta SQL para obtener el Estado del vendedor
                    string query = @"
                        SELECT Estado 
                        FROM Vendedor 
                        WHERE usuarioId = @UsuarioId";

                    // Crear el comando SQL y añadir el parámetro
                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@UsuarioId", idVendedor);

                        // Ejecutar el comando y leer los resultados
                        using (MySqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            if (reader.Read())
                            {
                                int estado = reader.GetInt32("Estado");
                                return Ok(estado);
                            }
                            else
                            {
                                return NotFound("No se encontró el vendedor con el id proporcionado.");
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
        [HttpGet]
        [Route("/ListarVentasCompletadosPorFecha")]
        public async Task<IActionResult> ListarVentasCompletadosPorFecha(int idTienda, DateTime FechaFiltro)
        {
            try
            {
                List<Pedido> pedidos = new List<Pedido>();
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                        SELECT p.IdPedido, p.FechaEntrega, p.FechaCreacion, p.Total, p.Estado, p.Reclamo, p.CantidadProductos, 
	                   p.MetodoPago, t.IdTienda, t.Nombre AS NombreTienda, u.Nombre AS NombreCliente, u.Apellido AS ApellidoCliente,
	                   pp.ProductoID, pp.Cantidad, pr.Precio, pr.Nombre as NombreProducto, pp.TieneSeguimiento, pp.IdPedidoXProducto,
                       pr.CantidadOferta, pr.Color, tv.SBoolean, tv.MBoolean, tv.LBoolean, tv.XLBoolean, tv.XXLBoolean
                       FROM Pedidos p 
                       INNER JOIN PedidoXProducto pp ON p.IdPedido = pp.PedidoID
                       INNER JOIN Producto pr ON pr.IdProducto = pp.ProductoID
                       INNER JOIN Tienda t ON t.IdTienda = pr.TiendaID
                       INNER JOIN Usuario u ON u.IdUsuario = p.UsuarioID
                       LEFT JOIN TallaVestimenta tv ON pr.IdProducto = tv.IdProducto
                       WHERE pr.TiendaID = @IdTienda";

                    if (FechaFiltro != DateTime.MinValue)
                    {
                        query += " AND DATE_FORMAT(p.FechaEntrega, '%Y-%m-%d') = @FechaFiltro";
                    }
                    query += " ORDER BY p.FechaEntrega DESC";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@IdTienda", idTienda);
                        if (FechaFiltro != DateTime.MinValue)
                        {
                            string fechaFiltroFormateada = FechaFiltro.ToString("yyyy-MM-dd");
                            command.Parameters.AddWithValue("@FechaFiltro", fechaFiltroFormateada);
                        }
                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                int idPedido = reader.GetInt32("IdPedido");
                                string tallaSeleccionada = "";
                                if (!reader.IsDBNull(reader.GetOrdinal("SBoolean")) && reader.GetBoolean("SBoolean")) tallaSeleccionada = "Short (S)";
                                else if (!reader.IsDBNull(reader.GetOrdinal("MBoolean")) && reader.GetBoolean("MBoolean")) tallaSeleccionada = "Medium (M)";
                                else if (!reader.IsDBNull(reader.GetOrdinal("LBoolean")) && reader.GetBoolean("LBoolean")) tallaSeleccionada = "Large (L)";
                                else if (!reader.IsDBNull(reader.GetOrdinal("XLBoolean")) && reader.GetBoolean("XLBoolean")) tallaSeleccionada = "XL (Extra Large)";
                                else if (!reader.IsDBNull(reader.GetOrdinal("XXLBoolean")) && reader.GetBoolean("XXLBoolean")) tallaSeleccionada = "XXL (Extra Extra Large)";

                                Pedido pedidoExistente = pedidos.FirstOrDefault(p => p.IdPedido == idPedido);
                                if (pedidoExistente == null)
                                {
                                    pedidoExistente = new Pedido
                                    {
                                        IdPedido = idPedido,
                                        NombreCliente = reader.GetString("NombreCliente"),
                                        ApellidoCliente = reader.GetString("ApellidoCliente"),
                                        FechaEntrega = reader.GetDateTime("FechaEntrega"),
                                        FechaCreacion = reader.GetDateTime("FechaCreacion"),
                                        Total = reader.GetDouble("Total"),
                                        Estado = reader.GetInt32("Estado"),
                                        ProductosLista = new List<ProductoPedido>()
                                    };

                                    pedidos.Add(pedidoExistente);
                                }
                                pedidoExistente.ProductosLista.Add(new ProductoPedido
                                {
                                    IdTienda = reader.GetInt32("IdTienda"),
                                    IdProducto = reader.GetInt32("ProductoID"),
                                    IdPedidoXProducto = reader.GetInt32("IdPedidoXProducto"),
                                    NombreTienda = reader.GetString("NombreTienda"),
                                    NombreProducto = reader.GetString("NombreProducto"),
                                    Cantidad = reader.GetInt32("Cantidad"),
                                    Precio = reader.GetDouble("Precio"),
                                    CantidadOferta = reader.GetDouble("CantidadOferta"),
                                    TieneSeguimiento = reader.GetBoolean("TieneSeguimiento"),
                                    Color = reader.GetString("Color"),
                                    Talla = tallaSeleccionada,
                                });
                            }
                            return Ok(pedidos);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/ListarVendedoresAsistentesPendientes")]
        public async Task<IActionResult> ListarVendedoresAsistentesPendientes(int idTienda)
        {
            try
            {
                List<VendedorAsistente> vendedoresAsistentes = new List<VendedorAsistente>();
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                       SELECT u.IdUsuario, u.Correo, u.Nombre, u.Apellido, u.DNI
                        FROM Usuario u
                        INNER JOIN Vendedor v ON v.usuarioID = u.IdUsuario
                        WHERE v.TiendaID = @IdTienda AND v.Estado = 2";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@IdTienda", idTienda);
                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                int idUsuario = reader.GetInt32("IdUsuario");
                                VendedorAsistente usuarioExistente = vendedoresAsistentes.FirstOrDefault(p => p.idUsuario == idUsuario);
                                if (usuarioExistente == null)
                                {
                                    usuarioExistente = new VendedorAsistente
                                    {
                                        idUsuario = idUsuario,
                                        Nombre = reader.GetString("Nombre"),
                                        Apellido = reader.GetString("Apellido"),
                                        Correo = reader.GetString("Correo"),
                                        DNI = reader.GetInt32("DNI")
                                    };

                                    vendedoresAsistentes.Add(usuarioExistente);
                                }
                            }
                            return Ok(vendedoresAsistentes);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/ListarVendedoresAsistentesAceptados")]
        public async Task<IActionResult> ListarVendedoresAsistentesAceptados(int idTienda)
        {
            try
            {
                List<VendedorAsistente> vendedoresAsistentes = new List<VendedorAsistente>();
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                       SELECT u.IdUsuario, u.Correo, u.Nombre, u.Apellido, u.DNI
                        FROM Usuario u
                        INNER JOIN Vendedor v ON v.usuarioID = u.IdUsuario
                        WHERE v.TiendaID = @IdTienda AND v.Estado = 1 AND v.esAdministrador <> 1";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@IdTienda", idTienda);
                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                int idUsuario = reader.GetInt32("IdUsuario");
                                VendedorAsistente usuarioExistente = vendedoresAsistentes.FirstOrDefault(p => p.idUsuario == idUsuario);
                                if (usuarioExistente == null)
                                {
                                    usuarioExistente = new VendedorAsistente
                                    {
                                        idUsuario = idUsuario,
                                        Nombre = reader.GetString("Nombre"),
                                        Apellido = reader.GetString("Apellido"),
                                        Correo = reader.GetString("Correo"),
                                        DNI = reader.GetInt32("DNI")
                                    };

                                    vendedoresAsistentes.Add(usuarioExistente);
                                }
                            }
                            return Ok(vendedoresAsistentes);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/VisualizarSeguimientoPorTienda")]
        public async Task<IActionResult> VisualizarSeguimientoPorTienda(int idTienda)
        {
            try
            {
                List<Seguimiento> seguimientos = new List<Seguimiento>();
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                        SELECT t.Nombre AS NombreTienda, u.Nombre AS NombreCliente, u.Apellido AS ApellidoCliente, c.IdChat, pr.Nombre AS NombreProducto,
                               pr.Foto AS FotoProducto, p.Estado AS EstadoPedido, pp.IdPedidoXProducto, pp.TieneReclamo, p.FechaCreacion, c.FinalizarCliente,
                               p.IdPedido, pr.Color, tv.SBoolean, tv.MBoolean, tv.LBoolean, tv.XLBoolean, tv.XXLBoolean
                        FROM Pedidos p
                        INNER JOIN PedidoXProducto pp ON pp.PedidoID = p.IdPedido
                        INNER JOIN Chat c ON c.PedidoXProductoID = pp.IdPedidoXProducto
                        INNER JOIN Producto pr ON pp.ProductoID = pr.IdProducto
                        INNER JOIN Tienda t ON t.IdTienda = pr.TiendaID
                        INNER JOIN Usuario u ON u.IdUsuario = p.UsuarioID
                        LEFT JOIN TallaVestimenta tv ON pr.IdProducto = tv.IdProducto
                        WHERE c.TiendaID = @TiendaID AND pp.TieneSeguimiento = true
                        ORDER BY c.FinalizarCliente ASC";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@TiendaID", idTienda);
                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                int idChat = reader.GetInt32("IdChat");
                                Seguimiento seguimientoExistente = seguimientos.FirstOrDefault(p => p.IdChat == idChat);
                                if (seguimientoExistente == null)
                                {
                                    // Determinar la talla seleccionada
                                    string tallaSeleccionada = "";
                                    if (!reader.IsDBNull(reader.GetOrdinal("SBoolean")) && reader.GetBoolean("SBoolean")) tallaSeleccionada = "Short (S)";
                                    else if (!reader.IsDBNull(reader.GetOrdinal("MBoolean")) && reader.GetBoolean("MBoolean")) tallaSeleccionada = "Medium (M)";
                                    else if (!reader.IsDBNull(reader.GetOrdinal("LBoolean")) && reader.GetBoolean("LBoolean")) tallaSeleccionada = "Large (L)";
                                    else if (!reader.IsDBNull(reader.GetOrdinal("XLBoolean")) && reader.GetBoolean("XLBoolean")) tallaSeleccionada = "XL (Extra Large)";
                                    else if (!reader.IsDBNull(reader.GetOrdinal("XXLBoolean")) && reader.GetBoolean("XXLBoolean")) tallaSeleccionada = "XXL (Extra Extra Large)";

                                    seguimientoExistente = new Seguimiento
                                    {
                                        IdChat = idChat,
                                        IdPedido = reader.IsDBNull(reader.GetOrdinal("IdPedido")) ? 0 : reader.GetInt32("IdPedido"),
                                        IdPedidoXProducto = reader.GetInt32("IdPedidoXProducto"),
                                        NombreTienda = reader.GetString("NombreTienda"),
                                        NombreCliente = reader.GetString("NombreCliente"),
                                        ApellidoCliente = reader.GetString("ApellidoCliente"),
                                        NombreProducto = reader.GetString("NombreProducto"),
                                        FotoProducto = ConvertirBytesAImagen(reader["FotoProducto"] as byte[]),
                                        EstadoPedido = reader.GetInt32("EstadoPedido"),
                                        FechaCreacion = reader.GetDateTime("FechaCreacion"),
                                        TieneReclamo = reader.GetBoolean("TieneReclamo"),
                                        FinalizarCliente = reader.GetBoolean("FinalizarCliente"),
                                        Color = reader.GetString("Color"),
                                        Talla = tallaSeleccionada
                                    };

                                    seguimientos.Add(seguimientoExistente);
                                }
                            }
                            return Ok(seguimientos);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/VisualizarSeguimientoPorUsuario")]
        public async Task<IActionResult> VisualizarSeguimientoPorUsuario(int idUsuario)
        {
            try
            {
                List<Seguimiento> seguimientos = new List<Seguimiento>();
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                        SELECT t.Nombre AS NombreTienda, u.Nombre AS NombreDuenho,u.Apellido AS ApellidoDuenho, c.IdChat, pr.Nombre AS NombreProducto,
                        pr.Foto AS FotoProducto, p.Estado AS EstadoPedido, pp.IdPedidoXProducto, pp.TieneReclamo, c.FinalizarCliente, p.IdPedido,
                        pr.Color, tv.SBoolean, tv.MBoolean, tv.LBoolean, tv.XLBoolean, tv.XXLBoolean
                        FROM Pedidos p
                        INNER JOIN PedidoXProducto pp ON pp.PedidoID = p.IdPedido
                        INNER JOIN Chat c ON c.PedidoXProductoID = pp.IdPedidoXProducto
                        INNER JOIN Producto pr ON pp.ProductoID = pr.IdProducto
                        INNER JOIN Tienda t ON t.IdTienda = pr.TiendaID
                        INNER JOIN Usuario u ON u.IdUsuario = t.UsuarioID
                        LEFT JOIN TallaVestimenta tv ON pr.IdProducto = tv.IdProducto
                        WHERE p.UsuarioID = @IdUsuario 
                        ORDER BY c.FinalizarCliente ASC, p.FechaEntrega DESC";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                int idChat = reader.GetInt32("IdChat");
                                string tallaSeleccionada = "";
                                if (!reader.IsDBNull(reader.GetOrdinal("SBoolean")) && reader.GetBoolean("SBoolean")) tallaSeleccionada = "Short (S)";
                                else if (!reader.IsDBNull(reader.GetOrdinal("MBoolean")) && reader.GetBoolean("MBoolean")) tallaSeleccionada = "Medium (M)";
                                else if (!reader.IsDBNull(reader.GetOrdinal("LBoolean")) && reader.GetBoolean("LBoolean")) tallaSeleccionada = "Large (L)";
                                else if (!reader.IsDBNull(reader.GetOrdinal("XLBoolean")) && reader.GetBoolean("XLBoolean")) tallaSeleccionada = "XL (Extra Large)";
                                else if (!reader.IsDBNull(reader.GetOrdinal("XXLBoolean")) && reader.GetBoolean("XXLBoolean")) tallaSeleccionada = "XXL (Extra Extra Large)";

                                Seguimiento seguimientoExistente = seguimientos.FirstOrDefault(p => p.IdChat == idChat);
                                if (seguimientoExistente == null)
                                {
                                    seguimientoExistente = new Seguimiento
                                    {
                                        IdChat = idChat,
                                        IdPedido = reader.IsDBNull(reader.GetOrdinal("IdPedido")) ? 0 : reader.GetInt32("IdPedido"),
                                        IdPedidoXProducto = reader.GetInt32("IdPedidoXProducto"),
                                        NombreTienda = reader.GetString("NombreTienda"),
                                        NombreDuenho = reader.GetString("NombreDuenho"),
                                        ApellidoDuenho = reader.GetString("ApellidoDuenho"),
                                        NombreProducto = reader.GetString("NombreProducto"),
                                        FotoProducto = ConvertirBytesAImagen(reader["FotoProducto"] as byte[]),
                                        EstadoPedido = reader.GetInt32("EstadoPedido"),
                                        TieneReclamo = reader.GetBoolean("TieneReclamo"),
                                        FinalizarCliente = reader.GetBoolean("FinalizarCliente"),
                                        Color = reader.GetString("Color"),
                                        Talla = tallaSeleccionada,
                                    };

                                    seguimientos.Add(seguimientoExistente);
                                }
                            }
                            return Ok(seguimientos);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/VisualizarReclamosPorUsuario")]
        public async Task<IActionResult> VisualizarReclamosPorUsuario(int idUsuario)
        {
            try
            {
                Dictionary<int, object> pedidosConReclamo = new Dictionary<int, object>();
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                    SELECT p.IdPedido, p.FechaEntrega, p.Total, pp.TieneReclamo, p.Reclamo
                    FROM Pedidos p
                    INNER JOIN Usuario u ON p.UsuarioID = u.IdUsuario
                    INNER JOIN PedidoXProducto pp ON pp.PedidoID = p.IdPedido
                    WHERE u.IdUsuario = @IdUsuario AND (pp.TieneSeguimiento=true
                    OR pp.TieneReclamo = true OR p.Reclamo = 1)
                    ORDER BY pp.TieneReclamo ASC, p.FechaEntrega DESC";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                int idPedido = reader.GetInt32("IdPedido");
                                var usuario = new
                                {
                                    IdPedido = !reader.IsDBNull(reader.GetOrdinal("IdPedido")) ? reader.GetInt32("IdPedido") : (int?)null,
                                    FechaEntrega = reader.IsDBNull(reader.GetOrdinal("FechaEntrega")) ? (DateTime?)null : reader.GetDateTime("FechaEntrega"),
                                    Total = reader.IsDBNull(reader.GetOrdinal("Total")) ? (double?)null : reader.GetDouble("Total"),
                                    ContieneReclamoProducto = reader.IsDBNull(reader.GetOrdinal("TieneReclamo")) ? (bool?)null : reader.GetBoolean("TieneReclamo"),
                                    ContieneReclamoPedido = reader.IsDBNull(reader.GetOrdinal("Reclamo")) ? (bool?)null : reader.GetBoolean("Reclamo"),
                                };

                                if (!pedidosConReclamo.ContainsKey(idPedido))
                                {
                                    pedidosConReclamo.Add(idPedido, usuario);
                                }
                            }
                        }
                    }
                }
                return Ok(pedidosConReclamo.Values.ToList());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/InformacionPedidoReclamo")]
        public async Task<IActionResult> InformacionPedidoReclamo(int IdPedido)
        {
            try
            {
                List<Pedido> listaPedidos = new List<Pedido>();
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                        SELECT p.IdPedido, p.FechaEntrega, p.FechaCreacion, p.Total, p.Estado,
                        pr.IdProducto, pr.Nombre AS NombreProducto, pp.Cantidad AS CantidadProducto,
                        pr.Precio, pp.TieneReclamo, t.Nombre AS NombreTienda, pp.IdPedidoXProducto,
                        pp.ProductoID, t.Nombre AS NombreTienda, u.Nombre AS NombreDuenho, u.Apellido AS ApellidoDuenho,
                        p.Reclamo AS ReclamoPedido, pr.Color, tv.SBoolean, tv.MBoolean, tv.LBoolean, tv.XLBoolean, tv.XXLBoolean
                        FROM Pedidos p
                        INNER JOIN PedidoXProducto pp ON pp.PedidoID = p.IdPedido
                        INNER JOIN Producto pr ON pr.IdProducto = pp.ProductoID
                        INNER JOIN Tienda t ON t.IdTienda = pr.TiendaID
                        INNER JOIN Usuario u ON u.IdUsuario = t.UsuarioID
                        LEFT JOIN TallaVestimenta tv ON pr.IdProducto = tv.IdProducto
                        WHERE p.IdPedido = @IdPedido";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@IdPedido", IdPedido);
                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                int idPedido = reader.GetInt32("IdPedido");
                                string tallaSeleccionada = "";
                                if (!reader.IsDBNull(reader.GetOrdinal("SBoolean")) && reader.GetBoolean("SBoolean")) tallaSeleccionada = "Short (S)";
                                else if (!reader.IsDBNull(reader.GetOrdinal("MBoolean")) && reader.GetBoolean("MBoolean")) tallaSeleccionada = "Medium (M)";
                                else if (!reader.IsDBNull(reader.GetOrdinal("LBoolean")) && reader.GetBoolean("LBoolean")) tallaSeleccionada = "Large (L)";
                                else if (!reader.IsDBNull(reader.GetOrdinal("XLBoolean")) && reader.GetBoolean("XLBoolean")) tallaSeleccionada = "XL (Extra Large)";
                                else if (!reader.IsDBNull(reader.GetOrdinal("XXLBoolean")) && reader.GetBoolean("XXLBoolean")) tallaSeleccionada = "XXL (Extra Extra Large)";

                                Pedido pedidoExistente = listaPedidos.FirstOrDefault(p => p.IdPedido == idPedido);
                                if (pedidoExistente == null)
                                {
                                    pedidoExistente = new Pedido
                                    {
                                        IdPedido = idPedido,
                                        FechaEntrega = reader.GetDateTime("FechaEntrega"),
                                        FechaCreacion = reader.GetDateTime("FechaCreacion"),
                                        Total = reader.GetDouble("Total"),
                                        Estado = reader.GetInt32("Estado"),
                                        ReclamoPedido = reader.GetBoolean("ReclamoPedido"),
                                        ProductosLista = new List<ProductoPedido>()
                                    };

                                    listaPedidos.Add(pedidoExistente);
                                }
                                pedidoExistente.ProductosLista.Add(new ProductoPedido
                                {
                                    IdProducto = reader.GetInt32("ProductoID"),
                                    IdPedidoXProducto = reader.GetInt32("IdPedidoXProducto"),
                                    NombreTienda = reader.GetString("NombreTienda"),
                                    NombreProducto = reader.GetString("NombreProducto"),
                                    NombreDueño = reader.GetString("NombreDuenho"),
                                    ApellidoDuenho = reader.GetString("ApellidoDuenho"),
                                    Cantidad = reader.GetInt32("CantidadProducto"),
                                    Precio = reader.GetDouble("Precio"),
                                    TieneReclamo = reader.GetBoolean("TieneReclamo"),
                                    Color = reader.GetString("Color"),
                                    Talla = tallaSeleccionada,
                                });
                            }
                            return Ok(listaPedidos);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/ListarMensajesChatId")]
        public async Task<IActionResult> ListarMensajesChatId(int ChatId)
        {
            try
            {
                List<Mensaje> Mensajes = new List<Mensaje>();
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                        SELECT m.IdMensaje, m.Contenido, m.EmisorId, m.FechaEnvio, m.EsTienda, u.Nombre AS NombreEmisor, u.Apellido AS ApellidoEmisor,
                        u.EsComprador, u.EsVendedor
                        FROM Mensajes m
                        INNER JOIN Usuario u ON u.IdUsuario = m.EmisorId
                        WHERE ChatId = @ChatId ORDER BY m.IdMensaje ASC";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@ChatId", ChatId);
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (reader.Read())
                            {
                                int idMensaje = reader.GetInt32("IdMensaje");
                                Mensaje mensajeExistente = Mensajes.FirstOrDefault(p => p.IdMensaje == idMensaje);
                                if (mensajeExistente == null)
                                {
                                    mensajeExistente = new Mensaje
                                    {
                                        IdMensaje = idMensaje,
                                        Contenido = reader.GetString("Contenido"),
                                        EmisorId = reader.GetInt32("EmisorId"),
                                        NombreEmisor = reader.GetString("NombreEmisor"),
                                        ApellidoEmisor = reader.GetString("ApellidoEmisor"),
                                        FechaEnvio = reader.GetDateTime("FechaEnvio"),
                                        EsTienda = reader.GetBoolean("EsTienda"),
                                    };

                                    Mensajes.Add(mensajeExistente);
                                }
                            }
                            return Ok(Mensajes);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/ListarMensajesTiendaChatId")]
        public async Task<IActionResult> ListarMensajesTiendaChatId(int ChatId)
        {
            try
            {
                List<Mensaje> Mensajes = new List<Mensaje>();
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                        SELECT m.IdMensaje, m.Contenido, m.EmisorId, m.FechaEnvio, m.EsTienda, u.Nombre AS NombreEmisor, u.Apellido AS ApellidoEmisor,
                        u.EsComprador, u.EsVendedor, p.Nombre AS NombreProducto
                        FROM Mensajes m
                        INNER JOIN Usuario u ON u.IdUsuario = m.EmisorId
                        INNER JOIN Chat c ON c.IdChat = m.ChatId
                        INNER JOIN PedidoXProducto pp ON pp.IdPedidoXProducto = c.PedidoXProductoID
                        INNER JOIN Producto p ON p.IdProducto = pp.ProductoID
                        WHERE ChatId = @ChatId ORDER BY m.IdMensaje ASC";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@ChatId", ChatId);
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (reader.Read())
                            {
                                int idMensaje = reader.GetInt32("IdMensaje");
                                Mensaje mensajeExistente = Mensajes.FirstOrDefault(p => p.IdMensaje == idMensaje);
                                if (mensajeExistente == null)
                                {
                                    mensajeExistente = new Mensaje
                                    {
                                        IdMensaje = idMensaje,
                                        Contenido = reader.GetString("Contenido"),
                                        EmisorId = reader.GetInt32("EmisorId"),
                                        NombreEmisor = reader.GetString("NombreEmisor"),
                                        NombreProducto = reader.GetString("NombreProducto"),
                                        ApellidoEmisor = reader.GetString("ApellidoEmisor"),
                                        FechaEnvio = reader.GetDateTime("FechaEnvio"),
                                        EsTienda = reader.GetBoolean("EsTienda"),
                                    };

                                    Mensajes.Add(mensajeExistente);
                                }
                            }
                            return Ok(Mensajes);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/ListarTiendaGestion")]
        public async Task<IActionResult> ListarTiendaGestion()
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                List<Tienda> Tiendas = new List<Tienda>();
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                        SELECT t.IdTienda, t.Nombre, t.Descripcion, t.Direccion, t.Provincia, t.Pais, t.Foto, u.Nombre AS NombreDueño, u.Apellido AS ApellidoDueño
                        FROM Tienda t
                        INNER JOIN Usuario u ON u.IdUsuario = t.UsuarioID
                        WHERE t.Estado = 2";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (reader.Read())
                            {
                                int IdTienda = reader.GetInt32("IdTienda");
                                Tienda tienda = Tiendas.FirstOrDefault(p => p.IdTienda == IdTienda);
                                if (tienda == null)
                                {
                                    tienda = new Tienda
                                    {
                                        IdTienda = IdTienda,
                                        Nombre = reader.GetString("Nombre"),
                                        Descripcion = reader.GetString("Descripcion"),
                                        Foto = ConvertirBytesAImagen(reader["Foto"] as byte[]),
                                        Direccion = reader.GetString("Direccion"),
                                        Provincia = reader.GetString("Provincia"),
                                        NombreDueño = reader.GetString("NombreDueño"),
                                        ApellidoDueño = reader.GetString("ApellidoDueño"),
                                        Pais = reader.GetString("Pais")
                                    };

                                    Tiendas.Add(tienda);
                                }
                            }
                            return Ok(Tiendas);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/CantidadProductoXTienda")]
        public async Task<IActionResult> CantidadProductoXTienda(int idTienda)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                       SELECT COUNT(DISTINCT p.IdProducto) AS CantidadProductos
                        FROM Tienda t
                        INNER JOIN Usuario u ON u.IdUsuario = t.UsuarioID
                        INNER JOIN Producto p ON p.TiendaID = t.IdTienda
                        WHERE t.Estado = 1 AND t.IdTienda = @IdTienda";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@IdTienda", idTienda);
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            int count = 0;
                            if (reader.Read())
                            {
                                count = reader.GetInt32("CantidadProductos");
                            }
                            return Ok(count);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/ListarProductosPorTienda")]
        public async Task<IActionResult> ListarProductosPorTienda(int idTienda, string busqueda)
        {
            List<Producto> productos = new List<Producto>();
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                       SELECT p.*, t.Nombre AS NombreTienda, t.Foto AS FotoTienda
                        FROM Producto p
                        INNER JOIN Tienda t ON p.TiendaID = t.IdTienda
                        WHERE p.Estado = 1 AND p.EstadoAprobacion <> 'Pendiente' AND p.EstadoAprobacion <> 'Rechazado'
                        AND Stock >= 1 AND t.IdTienda = @IdTienda";

                    if (busqueda != "nada")
                    {
                        query += " AND (p.Nombre LIKE @Busqueda OR p.TipoProducto LIKE @Busqueda OR p.IdProducto LIKE @Busqueda)";
                    }

                    query += " ORDER BY CantidadVentas DESC";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        if (busqueda != "nada")
                        {
                            command.Parameters.AddWithValue("@Busqueda", $"%{busqueda}%");
                        }
                        command.Parameters.AddWithValue("@IdTienda", idTienda);
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (reader.Read())
                            {
                                string nombreProducto = reader.GetString("Nombre").Replace("_", " ");
                                string descripcionProducto = reader.GetString("Descripcion").Replace("_", " ");
                                string FechaEnvio = reader.IsDBNull(reader.GetOrdinal("TiempoEnvio")) ? "" : reader.GetString("TiempoEnvio");
                                Producto producto = new Producto
                                {
                                    IdProducto = reader.GetInt32("IdProducto"),
                                    Nombre = nombreProducto,
                                    Precio = reader.GetDouble("Precio"),
                                    Stock = reader.GetInt32("Stock"),
                                    Descripcion = descripcionProducto,
                                    CantidadOferta = reader.GetDouble("CantidadOferta"),
                                    CostoEnvio = reader.GetDouble("CostoEnvio"),
                                    FechaEnvio = FechaEnvio,
                                    CantidadGarantia = reader.IsDBNull(reader.GetOrdinal("CantidadGarantia")) ? "" : reader.GetString("CantidadGarantia"),
                                    EstadoAprobacion = reader.IsDBNull(reader.GetOrdinal("EstadoAprobacion")) ? "" : reader.GetString("EstadoAprobacion"),
                                    MotivoRechazo = reader.IsDBNull(reader.GetOrdinal("MotivoRechazo")) ? "" : reader.GetString("MotivoRechazo"),
                                    TipoProducto = reader.IsDBNull(reader.GetOrdinal("TipoProducto")) ? "" : reader.GetString("TipoProducto"),
                                    TiendaId = reader.GetInt32("TiendaId"),
                                    TiendaNombre = reader.IsDBNull(reader.GetOrdinal("NombreTienda")) ? "" : reader.GetString("NombreTienda"),
                                    TiendaFoto = ConvertirBytesAImagen(reader["FotoTienda"] as byte[]),
                                    Imagen = ConvertirBytesAImagen(reader["Foto"] as byte[]),
                                    CantidadVentas = reader.GetInt32("CantidadVentas"),
                                    FechaCreacion = reader.GetDateTime("FechaCreacion"),
                                };
                                productos.Add(producto);
                            }
                            return Ok(productos);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/ListarTiendaGeneral")]
        public async Task<IActionResult> ListarTiendaGeneral(string busquedaTienda)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                List<Tienda> Tiendas = new List<Tienda>();
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                        SELECT t.IdTienda, t.Nombre, t.Descripcion, t.Direccion, t.Provincia, t.Pais, t.Foto, u.Nombre AS NombreDueño, u.Apellido AS ApellidoDueño
                        FROM Tienda t
                        INNER JOIN Usuario u ON u.IdUsuario = t.UsuarioID
                        WHERE t.Estado = 1";

                    if (busquedaTienda != "nada")
                    {
                        query += " AND (t.Nombre LIKE @Busqueda OR t.IdTienda LIKE @Busqueda)";
                    }

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        if (busquedaTienda != "nada")
                        {
                            command.Parameters.AddWithValue("@Busqueda", $"%{busquedaTienda}%");
                        }
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (reader.Read())
                            {
                                int IdTienda = reader.GetInt32("IdTienda");
                                Tienda tienda = Tiendas.FirstOrDefault(p => p.IdTienda == IdTienda);
                                if (tienda == null)
                                {
                                    tienda = new Tienda
                                    {
                                        IdTienda = IdTienda,
                                        Nombre = reader.GetString("Nombre"),
                                        Descripcion = reader.GetString("Descripcion"),
                                        Foto = ConvertirBytesAImagen(reader["Foto"] as byte[]),
                                        Direccion = reader.GetString("Direccion"),
                                        Provincia = reader.GetString("Provincia"),
                                        NombreDueño = reader.GetString("NombreDueño"),
                                        ApellidoDueño = reader.GetString("ApellidoDueño"),
                                        Pais = reader.GetString("Pais")
                                    };

                                    Tiendas.Add(tienda);
                                }
                            }
                            return Ok(Tiendas);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/ListarProductoReclamos")]
        public async Task<IActionResult> ListarProductoReclamos(int idTienda)
        {
            try
            {
                List<ProductoReclamo> ProductosReclamos = new List<ProductoReclamo>();
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                    SELECT pp.ProductoID, pr.Nombre AS NombreProducto, pr.Foto AS FotoProducto,
                           u.Nombre AS NombreCliente, u.Apellido AS ApellidoCliente, pp.Cantidad AS CantidadProducto, 
                           pp.IdPedidoXProducto, pp.PedidoID, pr.Color, tv.SBoolean, tv.MBoolean, tv.LBoolean, 
                           tv.XLBoolean, tv.XXLBoolean
                    FROM PedidoXProducto pp
                    INNER JOIN Producto pr ON pr.IdProducto = pp.ProductoID
                    INNER JOIN Pedidos p ON p.IdPedido = pp.PedidoID
                    INNER JOIN Usuario u ON u.IdUsuario = p.UsuarioID
                    INNER JOIN Tienda t ON t.IdTienda = pr.TiendaID
                    LEFT JOIN TallaVestimenta tv ON pr.IdProducto = tv.IdProducto
                    WHERE t.IdTienda = @IdTienda AND pp.TieneReclamo = true";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@IdTienda", idTienda);
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (reader.Read())
                            {
                                int IdPedidoXProducto = reader.GetInt32("IdPedidoXProducto");
                                ProductoReclamo productoReclamo = ProductosReclamos.FirstOrDefault(p => p.IdPedidoXProducto == IdPedidoXProducto);
                                if (productoReclamo == null)
                                {
                                    string tallaSeleccionada = "";
                                    if (!reader.IsDBNull(reader.GetOrdinal("SBoolean")) && reader.GetBoolean("SBoolean")) tallaSeleccionada = "Short (S)";
                                    else if (!reader.IsDBNull(reader.GetOrdinal("MBoolean")) && reader.GetBoolean("MBoolean")) tallaSeleccionada = "Medium (M)";
                                    else if (!reader.IsDBNull(reader.GetOrdinal("LBoolean")) && reader.GetBoolean("LBoolean")) tallaSeleccionada = "Large (L)";
                                    else if (!reader.IsDBNull(reader.GetOrdinal("XLBoolean")) && reader.GetBoolean("XLBoolean")) tallaSeleccionada = "XL (Extra Large)";
                                    else if (!reader.IsDBNull(reader.GetOrdinal("XXLBoolean")) && reader.GetBoolean("XXLBoolean")) tallaSeleccionada = "XXL (Extra Extra Large)";

                                    productoReclamo = new ProductoReclamo
                                    {
                                        IdPedidoXProducto = IdPedidoXProducto,
                                        ProductoID = reader.GetInt32("ProductoID"),
                                        PedidoID = reader.GetInt32("PedidoID"),
                                        FotoProducto = ConvertirBytesAImagen(reader["FotoProducto"] as byte[]),
                                        NombreProducto = reader.GetString("NombreProducto"),
                                        NombreCliente = reader.GetString("NombreCliente"),
                                        ApellidoCliente = reader.GetString("ApellidoCliente"),
                                        CantidadProducto = reader.GetInt32("CantidadProducto"),
                                        Color = reader.GetString("Color"),
                                        Talla = tallaSeleccionada
                                    };

                                    ProductosReclamos.Add(productoReclamo);
                                }
                            }
                            return Ok(ProductosReclamos);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/EstadisticaVendedor")]
        public async Task<IActionResult> EstadisticaVendedor(int idTienda)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                        SELECT
	                        (SELECT COUNT(DISTINCT p.UsuarioID) AS CantidadClientes
	                        FROM PedidoXProducto pxp
	                        JOIN Pedidos p ON pxp.PedidoID = p.IdPedido
	                        JOIN Producto pr ON pxp.ProductoID = pr.IdProducto
	                        JOIN Tienda t ON pr.TiendaID = t.IdTienda
	                        WHERE t.IdTienda = @IdTienda) AS CantidadCliente,
    
                            (SELECT COUNT(*) 
                             FROM Producto 
                             WHERE TiendaID = @IdTienda AND EstadoAprobacion = 'Aprobado') 
                             AS CantidadProductosAprobados,
    
                            (SELECT COUNT(p.IdPedido) AS PedidosEstado2
                            FROM Pedidos p
                            JOIN PedidoXProducto pp ON p.IdPedido = pp.PedidoID
                            JOIN Producto pr ON pr.IdProducto = pp.ProductoID
                            JOIN Tienda t ON t.IdTienda = pr.TiendaID
                            WHERE p.Estado = 1 AND t.IdTienda = @IdTienda) AS CantidadPedidosEstadoPendiente,
    
                            (SELECT COUNT(p.IdPedido) AS PedidosEstado2
                            FROM Pedidos p
                            JOIN PedidoXProducto pp ON p.IdPedido = pp.PedidoID
                            JOIN Producto pr ON pr.IdProducto = pp.ProductoID
                            JOIN Tienda t ON t.IdTienda = pr.TiendaID
                            WHERE p.Estado = 2 AND t.IdTienda = @IdTienda) AS CantidadPedidosEstadoCompletado,
    
                            (SELECT COUNT(*) 
                             FROM PedidoXProducto pxp
                             JOIN Pedidos p ON pxp.PedidoID = p.IdPedido
                             JOIN Producto pr ON pxp.ProductoID = pr.IdProducto
                             JOIN Chat c ON c.PedidoXProductoID = pxp.IdPedidoXProducto
                             WHERE pxp.TieneSeguimiento = true AND c.FinalizarCliente = false
                             AND pr.TiendaID = @IdTienda) AS CantidadPedidoXProductoConSeguimientoPendiente,
    
                            (SELECT COUNT(pxp.IdPedidoXProducto) AS CantidadPedidoXProductoConReclamo
	                        FROM PedidoXProducto pxp
	                        JOIN Pedidos p ON pxp.PedidoID = p.IdPedido
	                        JOIN Producto pr ON pxp.ProductoID = pr.IdProducto
	                        JOIN Tienda t ON pr.TiendaID = t.IdTienda
	                        WHERE pxp.TieneReclamo = true AND t.IdTienda = @IdTienda) 
                            AS CantidadPedidoXProductoConReclamo,
                            
                            (SELECT SUM(pr.Precio*pp.Cantidad) AS SumaPreciosPedidosCompletadosTotal
                            FROM Pedidos p
                            JOIN PedidoXProducto pp ON p.IdPedido = pp.PedidoID
                            JOIN Producto pr ON pr.IdProducto = pp.ProductoID
                            JOIN Tienda t ON t.IdTienda = pr.TiendaID
                            WHERE p.Estado = 2 AND t.IdTienda = @IdTienda
                            AND p.FechaCreacion >= CURDATE() - INTERVAL 3 MONTH)
                            AS SumaPreciosPedidosCompletadosTotal,

                            (SELECT SUM(pr.Precio * pp.Cantidad) AS SumaPreciosPedidosCompletadosMes1
                            FROM Pedidos p
                            JOIN PedidoXProducto pp ON p.IdPedido = pp.PedidoID
                            JOIN Producto pr ON pr.IdProducto = pp.ProductoID
                            JOIN Tienda t ON t.IdTienda = pr.TiendaID
                            WHERE p.Estado = 2 AND t.IdTienda = @IdTienda
                            AND YEAR(p.FechaCreacion) = YEAR(CURDATE())
                            AND MONTH(p.FechaCreacion) = MONTH(CURDATE()))
                            AS SumaPreciosPedidosCompletadosMes1,

                            (SELECT SUM(pr.Precio * pp.Cantidad) AS SumaPreciosPedidosCompletadosMes2
                            FROM Pedidos p
                            JOIN PedidoXProducto pp ON p.IdPedido = pp.PedidoID
                            JOIN Producto pr ON pr.IdProducto = pp.ProductoID
                            JOIN Tienda t ON t.IdTienda = pr.TiendaID
                            WHERE p.Estado = 2 AND t.IdTienda = @IdTienda
                            AND YEAR(p.FechaCreacion) = YEAR(CURDATE() - INTERVAL 1 MONTH)
                            AND MONTH(p.FechaCreacion) = MONTH(CURDATE() - INTERVAL 1 MONTH))
                            AS SumaPreciosPedidosCompletadosMes2,

                            (SELECT SUM(pr.Precio * pp.Cantidad) AS SumaPreciosPedidosCompletadosMes3
                            FROM Pedidos p
                            JOIN PedidoXProducto pp ON p.IdPedido = pp.PedidoID
                            JOIN Producto pr ON pr.IdProducto = pp.ProductoID
                            JOIN Tienda t ON t.IdTienda = pr.TiendaID
                            WHERE p.Estado = 2 AND t.IdTienda = @IdTienda
                            AND YEAR(p.FechaCreacion) = YEAR(CURDATE() - INTERVAL 2 MONTH)
                            AND MONTH(p.FechaCreacion) = MONTH(CURDATE() - INTERVAL 2 MONTH))
                            AS SumaPreciosPedidosCompletadosMes3;
                     ";
                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@IdTienda", idTienda);
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                EstadisticaVendedor estadistica = new EstadisticaVendedor
                                {
                                    CantidadCliente = reader.GetInt32("CantidadCliente"),
                                    CantidadProductosAprobados = reader.GetInt32("CantidadProductosAprobados"),
                                    CantidadPedidosEstadoPendiente = reader.GetInt32("CantidadPedidosEstadoPendiente"),
                                    CantidadPedidosEstadoCompletado = reader.GetInt32("CantidadPedidosEstadoCompletado"),
                                    CantidadPedidoXProductoConSeguimientoPendiente = reader.GetInt32("CantidadPedidoXProductoConSeguimientoPendiente"),
                                    CantidadPedidoXProductoConReclamo = reader.GetInt32("CantidadPedidoXProductoConReclamo"),
                                    SumaPreciosPedidosCompletadosTotal = reader.IsDBNull(reader.GetOrdinal("SumaPreciosPedidosCompletadosTotal")) ? 
                                                             0: reader.GetDouble("SumaPreciosPedidosCompletadosTotal"),
                                    SumaPreciosPedidosCompletadosMes1 = reader.IsDBNull(reader.GetOrdinal("SumaPreciosPedidosCompletadosMes1")) ? 0 :
                                    reader.GetDouble("SumaPreciosPedidosCompletadosMes1"),
                                    SumaPreciosPedidosCompletadosMes2 = reader.IsDBNull(reader.GetOrdinal("SumaPreciosPedidosCompletadosMes2")) ? 0 :
                                    reader.GetDouble("SumaPreciosPedidosCompletadosMes2"),
                                    SumaPreciosPedidosCompletadosMes3 = reader.IsDBNull(reader.GetOrdinal("SumaPreciosPedidosCompletadosMes3")) ? 0 :
                                    reader.GetDouble("SumaPreciosPedidosCompletadosMes3"),
                                };
                                return Ok(estadistica);
                            }
                            else
                            {
                                connection.Close();
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
        [HttpGet]
        [Route("/InicioVendedor")]
        public async Task<IActionResult> InicioVendedor(int idTienda)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                       SELECT 
                        (SELECT SUM(p.Total + p.CostoEnvio) 
                         FROM Pedidos p 
                         INNER JOIN PedidoXProducto pp ON pp.PedidoID = p.IdPedido 
                         INNER JOIN Producto pr ON pr.IdProducto = pp.ProductoID 
                         WHERE pr.TiendaID = @idTienda AND p.Estado = 2) AS Ingresos,
                        (SELECT SUM(p.Total + p.CostoEnvio) 
                         FROM Pedidos p 
                         INNER JOIN PedidoXProducto pp ON pp.PedidoID = p.IdPedido 
                         INNER JOIN Producto pr ON pr.IdProducto = pp.ProductoID 
                         WHERE pr.TiendaID = @idTienda AND p.Estado = 1) AS IngresosPendientes,
                        (SELECT COUNT(distinct p.IdPedido) 
                         FROM Pedidos p 
                         INNER JOIN PedidoXProducto pp ON pp.PedidoID = p.IdPedido 
                         INNER JOIN Producto pr ON pr.IdProducto = pp.ProductoID 
                         WHERE pr.TiendaID = @idTienda AND p.Estado = 2) AS VentasCompletadas,
                        (SELECT COUNT(distinct p.IdPedido) 
                         FROM Pedidos p 
                         INNER JOIN PedidoXProducto pp ON pp.PedidoID = p.IdPedido 
                         INNER JOIN Producto pr ON pr.IdProducto = pp.ProductoID 
                         WHERE pr.TiendaID = @idTienda AND p.Estado = 1) AS VentasPendientes,
                        (SELECT COUNT(Distinct IdProducto) 
                         FROM Producto pr 
                         WHERE pr.EstadoAprobacion = 'Aprobado' AND pr.TiendaID = @idTienda) AS ProductosPublicados,
                        (SELECT pr.Nombre 
                         FROM Producto pr 
                         WHERE pr.TiendaID = @idTienda AND pr.CantidadVentas =
                                (SELECT MAX(CantidadVentas) 
                                 FROM Producto pro 
                                 WHERE pro.Estado = 1 AND pro.TiendaID = @idTienda)) AS ProductoMasVendido,
                        (SELECT COUNT(Distinct IdChat) 
                         FROM Chat c 
                         WHERE c.TiendaID = @idTienda AND c.FinalizarCliente = 0) AS CantidadChatsPendientes,
                        (SELECT 
                             (SELECT COUNT(pp.IdPedidoXProducto) 
                              FROM PedidoXProducto pp 
                              INNER JOIN Producto pr ON pp.ProductoID = pr.IdProducto 
                              WHERE pp.TieneReclamo = 0 AND pr.TiendaID = @idTienda)
                              /
                             (SELECT COUNT(pp.IdPedidoXProducto) 
                              FROM PedidoXProducto pp 
                              INNER JOIN Producto pr ON pp.ProductoID = pr.IdProducto 
                              WHERE pr.TiendaID = @idTienda) AS Resultado)
                        AS PorcentajeSatisfaccion,
                        (SELECT COUNT(pp.IdPedidoXProducto) 
                         FROM PedidoXProducto pp 
                         INNER JOIN Producto pr ON pp.ProductoID = pr.IdProducto 
                         WHERE pp.TieneReclamo = 1 AND pr.TiendaID = @idTienda) AS CantidadReclamo,
                        (SELECT COUNT(DISTINCT m.IdMetodoPago) FROM MetodoPago m
                        INNER JOIN Tienda t ON t.UsuarioID = m.UsuarioID
                        WHERE t.UsuarioID = @idTienda) AS CantidadMetodoPago";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@idTienda", idTienda);
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                InicioVendedor estadistica = new InicioVendedor
                                {
                                    Ingresos = reader.IsDBNull(reader.GetOrdinal("Ingresos")) ?
                                                             0 : reader.GetDouble("Ingresos"),
                                    IngresosPendientes = reader.IsDBNull(reader.GetOrdinal("IngresosPendientes")) ?
                                                             0 : reader.GetDouble("IngresosPendientes"),
                                    VentasCompletadas = reader.GetInt32("VentasCompletadas"),
                                    VentasPendientes = reader.GetInt32("VentasPendientes"),
                                    ProductosPublicados = reader.GetInt32("ProductosPublicados"),
                                    ProductoMasVendido = reader.IsDBNull(reader.GetOrdinal("ProductoMasVendido")) ?
                                                             "" : reader.GetString("ProductoMasVendido"),
                                    PorcentajeSatisfaccion = reader.IsDBNull(reader.GetOrdinal("PorcentajeSatisfaccion")) ?
                                                             0 : reader.GetDouble("PorcentajeSatisfaccion"),
                                    CantidadChatsPendientes = reader.GetInt32("CantidadChatsPendientes"),
                                    CantidadReclamo = reader.GetInt32("CantidadReclamo"),
                                    CantidadMetodoPago = reader.GetInt32("CantidadMetodoPago"),
                                };
                                return Ok(estadistica);
                            }
                            else
                            {
                                connection.Close();
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
        [HttpGet]
        [Route("/InicioComprador")]
        public async Task<IActionResult> InicioComprador(int idUsuario)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                       SELECT 
                        (SELECT COUNT(Distinct IdPedido) FROM Pedidos p WHERE p.UsuarioID = @IdUsuario) 
                            AS TotalPedidosUsuario,
                        (SELECT COUNT(Distinct IdPedido) FROM Pedidos p WHERE p.UsuarioID = @IdUsuario AND p.Estado=1) 
                            AS TotalPedidosUsuarioPendiente,
                        (SELECT COUNT(Distinct IdProducto) FROM Producto pr WHERE pr.EstadoAprobacion = 'Aprobado') 
                            AS TotalProductosPublicados,
                        (SELECT pr.Nombre FROM Producto pr WHERE pr.CantidadVentas =
                            (SELECT MAX(CantidadVentas) FROM Producto pro WHERE pro.Estado = 1) LIMIT 1) AS ProductoMasVendido,
                        (SELECT COUNT(Distinct IdChat) FROM Chat c WHERE c.CompradorID = @IdUsuario) AS TotalChats,
                        (SELECT COUNT(Distinct IdChat) FROM Chat c WHERE c.FinalizarCliente = 1 AND c.CompradorID = @IdUsuario) 
                            AS TotalChatsFinalizadosCliente,
                        (SELECT IFNULL(SUM(DISTINCT p.TotalDescuento), 0) FROM Pedidos p
                            JOIN PedidoXProducto pp ON p.IdPedido = pp.PedidoID
                            JOIN Producto pr ON pr.IdProducto = pp.ProductoID WHERE p.Estado = 1 AND p.UsuarioID = @IdUsuario) 
                            AS TotalDescuentoPedidosUsuario,
                        (SELECT COUNT(p.IdPedido) FROM Pedidos p WHERE p.Reclamo = 1 AND p.UsuarioID = @IdUsuario) 
                            AS TotalPedidosConReclamo,
                        (SELECT COUNT(pp.IdPedidoXProducto) FROM PedidoXProducto pp INNER JOIN Pedidos p ON p.IdPedido = pp.PedidoID
                        WHERE pp.TieneReclamo = 1 AND p.UsuarioID = @IdUsuario) 
                            AS TotalProductosConReclamo,
                        (SELECT COUNT(DISTINCT IdMetodoPago) FROM MetodoPago WHERE UsuarioID = @IdUsuario) AS CantidadMetodoPago";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                InicioComprador estadistica = new InicioComprador
                                {
                                    TotalPedidosUsuario = reader.GetInt32("TotalPedidosUsuario"),
                                    TotalPedidosUsuarioPendiente = reader.GetInt32("TotalPedidosUsuarioPendiente"),
                                    TotalProductosPublicados = reader.GetInt32("TotalProductosPublicados"),
                                    ProductoMasVendido = reader.IsDBNull(reader.GetOrdinal("ProductoMasVendido")) ?
                                                             "" : reader.GetString("ProductoMasVendido"),
                                    TotalChats = reader.GetInt32("TotalChats"),
                                    TotalChatsFinalizadosCliente = reader.GetInt32("TotalChatsFinalizadosCliente"),
                                    TotalDescuentoPedidosUsuario = reader.IsDBNull(reader.GetOrdinal("TotalDescuentoPedidosUsuario")) ?
                                                             0 : reader.GetDouble("TotalDescuentoPedidosUsuario"),
                                    TotalPedidosConReclamo = reader.GetInt32("TotalChats"),
                                    TotalProductosConReclamo = reader.GetInt32("TotalProductosConReclamo"),
                                    CantidadMetodoPago = reader.GetInt32("CantidadMetodoPago"),
                                };
                                return Ok(estadistica);
                            }
                            else
                            {
                                connection.Close();
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
        [HttpGet]
        [Route("/ObtenerLlavePublicaStripe")]
        public async Task<IActionResult> ObtenerLlavePublicaStripe()
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"SELECT ClaveStripePublica FROM LlavesSTRIPE";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                string llave = reader.IsDBNull(reader.GetOrdinal("ClaveStripePublica")) ?
                                                             "" : reader.GetString("ClaveStripePublica");
                                return Ok(llave);
                            }
                            else
                            {
                                connection.Close();
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
        [HttpGet]
        [Route("/ListarBilleteraVendedor")]
        public async Task<IActionResult> ListarBilleteraVendedor(int idUsuario)
        {
            try
            {
                List<MetodoPago> metodosPagos = new List<MetodoPago>();
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"SELECT IdMetodoPago, Last4, FechaExpiracion, Token FROM MetodoPago m WHERE m.UsuarioID = @IdUsuario AND m.Estado = 1";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                do
                                {
                                    int IdMetodoPago = reader.GetInt32("IdMetodoPago");
                                    MetodoPago metodoExistente = metodosPagos.FirstOrDefault(p => p.IdMetodoPago == IdMetodoPago);
                                    if (metodoExistente == null)
                                    {
                                        metodoExistente = new MetodoPago
                                        {
                                            IdMetodoPago = IdMetodoPago,
                                            Last4 = reader.GetInt32("Last4"),
                                            FechaExpiracion = reader.GetString("FechaExpiracion"),
                                            Token = reader.GetString("Token")
                                        };

                                        metodosPagos.Add(metodoExistente);
                                    }
                                } while (reader.Read());
                                return Ok(metodosPagos);
                            }
                            else
                            {
                                return Ok(metodosPagos);
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
        [HttpGet]
        [Route("/EstadisticaComprador")]
        public async Task<IActionResult> EstadisticaComprador(int idUsuario)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                       SELECT 
                        (SELECT COUNT(*) 
                         FROM Usuario 
                         JOIN Pedidos ON Usuario.IdUsuario = Pedidos.UsuarioID 
                         WHERE Usuario.IdUsuario = @IdUsuario AND Pedidos.Estado <> 3
                         GROUP BY Usuario.IdUsuario, Usuario.Nombre, Usuario.Apellido) AS CantidadPedidos,
    
                        (SELECT COUNT(*) 
                         FROM Usuario 
                         JOIN Pedidos ON Usuario.IdUsuario = Pedidos.UsuarioID 
                         WHERE Usuario.IdUsuario = @IdUsuario  AND Pedidos.Estado = 1 
                         GROUP BY Usuario.IdUsuario, Usuario.Nombre, Usuario.Apellido) AS CantidadPedidosEstadoPendiente,
    
                        (SELECT COUNT(*) 
                         FROM Usuario 
                         JOIN Pedidos ON Usuario.IdUsuario = Pedidos.UsuarioID 
                         WHERE Usuario.IdUsuario = @IdUsuario  AND Pedidos.Estado = 2 
                         GROUP BY Usuario.IdUsuario, Usuario.Nombre, Usuario.Apellido) AS CantidadPedidosEstadoCompletado,
    
                        (SELECT COUNT(*) 
                         FROM Chat 
                         JOIN PedidoXProducto ON Chat.PedidoXProductoID = PedidoXProducto.IdPedidoXProducto 
                         JOIN Pedidos ON PedidoXProducto.PedidoID = Pedidos.IdPedido 
                         WHERE Chat.FinalizarCliente = 1 AND Pedidos.UsuarioID = @IdUsuario) AS CantidadChatsFinalizados,
    
                        (SELECT COUNT(*) 
                         FROM Chat 
                         JOIN PedidoXProducto ON Chat.PedidoXProductoID = PedidoXProducto.IdPedidoXProducto 
                         JOIN Pedidos ON PedidoXProducto.PedidoID = Pedidos.IdPedido 
                         WHERE Chat.FinalizarCliente = 0 AND Pedidos.UsuarioID = @IdUsuario) AS CantidadChatsPendientes,
    
                        (SELECT COUNT(DISTINCT Pedidos.IdPedido) 
                         FROM Pedidos 
                         JOIN PedidoXProducto ON Pedidos.IdPedido = PedidoXProducto.PedidoID 
                         WHERE PedidoXProducto.TieneReclamo = true 
                         AND Pedidos.UsuarioID = @IdUsuario) AS CantidadPedidosConReclamo,
    
                        (SELECT IFNULL(SUM(DISTINCT p.TotalDescuento), 0) AS TotalDescuento
                        FROM Pedidos p
                        JOIN PedidoXProducto pp ON p.IdPedido = pp.PedidoID
                        JOIN Producto pr ON pr.IdProducto = pp.ProductoID
                        WHERE p.Estado = 1 
                        AND p.UsuarioID = @IdUsuario
                        AND p.FechaCreacion >= CURDATE() - INTERVAL 3 MONTH) AS TotalDescuento,

                        (SELECT IFNULL(SUM(DISTINCT p.TotalDescuento),0) 
                         FROM Pedidos p 
                         JOIN PedidoXProducto pp ON p.IdPedido = pp.PedidoID 
                         JOIN Producto pr ON pr.IdProducto = pp.ProductoID 
                         WHERE p.Estado = 1 AND p.UsuarioID = @IdUsuario 
                         AND YEAR(p.FechaCreacion) = YEAR(CURDATE()) 
                         AND MONTH(p.FechaCreacion) = MONTH(CURDATE())) AS TotalDescuentoMesActual,
    
                        (SELECT IFNULL(SUM(DISTINCT p.TotalDescuento), 0) 
                         FROM Pedidos p 
                         JOIN PedidoXProducto pp ON p.IdPedido = pp.PedidoID 
                         JOIN Producto pr ON pr.IdProducto = pp.ProductoID 
                         WHERE p.Estado = 1 
                         AND p.UsuarioID = @IdUsuario
                         AND YEAR(p.FechaCreacion) = YEAR(CURDATE() - INTERVAL 1 MONTH) 
                         AND MONTH(p.FechaCreacion) = MONTH(CURDATE() - INTERVAL 1 MONTH)) AS TotalDescuentoMesAnterior,
    
                        (SELECT IFNULL(SUM(DISTINCT p.TotalDescuento), 0) 
                         FROM Pedidos p 
                         JOIN PedidoXProducto pp ON p.IdPedido = pp.PedidoID 
                         JOIN Producto pr ON pr.IdProducto = pp.ProductoID 
                         WHERE p.Estado = 1 
                         AND p.UsuarioID = @IdUsuario
                         AND YEAR(p.FechaCreacion) = YEAR(CURDATE() - INTERVAL 2 MONTH) 
                         AND MONTH(p.FechaCreacion) = MONTH(CURDATE() - INTERVAL 2 MONTH)) AS TotalDescuentoDosMesesAntes;
                     ";
                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                EstadisticaComprador estadistica = new EstadisticaComprador
                                {
                                    CantidadPedidos = reader.IsDBNull(reader.GetOrdinal("CantidadPedidos")) ?
                                                             0 : reader.GetInt32("CantidadPedidos"),
                                    CantidadPedidosEstadoPendiente = reader.IsDBNull(reader.GetOrdinal("CantidadPedidosEstadoPendiente")) ?
                                                             0 : reader.GetInt32("CantidadPedidosEstadoPendiente"),
                                    CantidadPedidosEstadoCompletado = reader.IsDBNull(reader.GetOrdinal("CantidadPedidosEstadoCompletado")) ?
                                                             0 : reader.GetInt32("CantidadPedidosEstadoCompletado"),
                                    CantidadChatsFinalizados = reader.IsDBNull(reader.GetOrdinal("CantidadChatsFinalizados")) ?
                                                             0 : reader.GetInt32("CantidadChatsFinalizados"),
                                    CantidadChatsPendientes = reader.IsDBNull(reader.GetOrdinal("CantidadChatsPendientes")) ?
                                                             0 : reader.GetInt32("CantidadChatsPendientes"),
                                    CantidadPedidosConReclamo = reader.IsDBNull(reader.GetOrdinal("CantidadPedidosConReclamo")) ?
                                                             0 : reader.GetInt32("CantidadPedidosConReclamo"),
                                    TotalDescuento = reader.IsDBNull(reader.GetOrdinal("TotalDescuento")) ?
                                                             0 : reader.GetDouble("TotalDescuento"),
                                    TotalDescuentoMesActual = reader.IsDBNull(reader.GetOrdinal("TotalDescuentoMesActual")) ? 0 :
                                    reader.GetDouble("TotalDescuentoMesActual"),
                                    TotalDescuentoMesAnterior = reader.IsDBNull(reader.GetOrdinal("TotalDescuentoMesAnterior")) ? 0 :
                                    reader.GetDouble("TotalDescuentoMesAnterior"),
                                    TotalDescuentoDosMesesAntes = reader.IsDBNull(reader.GetOrdinal("TotalDescuentoDosMesesAntes")) ? 0 :
                                    reader.GetDouble("TotalDescuentoDosMesesAntes"),
                                };
                                return Ok(estadistica);
                            }
                            else
                            {
                                connection.Close();
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
        [HttpGet]
        [Route("/ListarPedidosAdministrador")]
        public async Task<IActionResult> ListarPedidosAdministrador(bool completados, bool pendientes)
        {
            try
            {
                List<Pedido> pedidos = new List<Pedido>();
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                      SELECT p.IdPedido, p.FechaEntrega, p.FechaCreacion, p.Estado AS EstadoPedido, p.Total,
                        t.Nombre AS NombreTienda, u.Nombre AS NombreCliente, u.Apellido AS ApellidoCliente,
                        us.Nombre AS NombreDueño, us.Apellido AS ApellidoDuenho, pp.TieneReclamo, pp.FechaReclamo,
                        pr.Nombre AS NombreProducto, pp.Cantidad AS CantidadProducto, pr.Precio, t.IdTienda,
                        pp.ProductoID, pp.IdPedidoXProducto,  pr.CantidadOferta
                        FROM Pedidos p
                        INNER JOIN PedidoXProducto pp ON pp.PedidoID = p.IdPedido
                        INNER JOIN Producto pr ON pr.IdProducto = pp.ProductoID
                        INNER JOIN Tienda t ON t.IdTienda = pr.TiendaID
                        INNER JOIN Usuario u ON u.IdUsuario = p.UsuarioID
                        INNER JOIN Usuario us ON us.IdUsuario = t.UsuarioID
                     ";

                    if (completados && !pendientes) query += " WHERE p.Estado = 2";
                    else if (!completados && pendientes) query += " WHERE p.Estado = 1";
                    else query += " WHERE p.Estado = 2 OR p.Estado = 1";

                    query += " ORDER BY p.FechaCreacion DESC";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                do
                                {
                                    int idPedido = reader.GetInt32("IdPedido");
                                    Pedido pedidoExistente = pedidos.FirstOrDefault(p => p.IdPedido == idPedido);
                                    if (pedidoExistente == null)
                                    {
                                        pedidoExistente = new Pedido
                                        {
                                            IdPedido = idPedido,
                                            NombreCliente = reader.GetString("NombreCliente"),
                                            ApellidoCliente = reader.GetString("ApellidoCliente"),
                                            FechaEntrega = reader.GetDateTime("FechaEntrega"),
                                            FechaCreacion = reader.GetDateTime("FechaCreacion"),
                                            Total = reader.GetDouble("Total"),
                                            Estado = reader.GetInt32("EstadoPedido"),
                                            ProductosLista = new List<ProductoPedido>()
                                        };

                                        pedidos.Add(pedidoExistente);
                                    }
                                    pedidoExistente.ProductosLista.Add(new ProductoPedido
                                    {
                                        IdTienda = reader.GetInt32("IdTienda"),
                                        IdProducto = reader.GetInt32("ProductoID"),
                                        IdPedidoXProducto = reader.GetInt32("IdPedidoXProducto"),
                                        NombreTienda = reader.GetString("NombreTienda"),
                                        NombreDueño = reader.GetString("NombreDueño"),
                                        ApellidoDuenho = reader.GetString("ApellidoDuenho"),
                                        NombreProducto = reader.GetString("NombreProducto"),
                                        Cantidad = reader.GetInt32("CantidadProducto"),
                                        Precio = reader.GetDouble("Precio"),
                                        TieneReclamo = reader.GetBoolean("TieneReclamo"),
                                        FechaReclamo = reader.IsDBNull(reader.GetOrdinal("FechaReclamo")) ? DateTime.MinValue : reader.GetDateTime("FechaReclamo"),
                                        CantidadOferta = reader.GetDouble("CantidadOferta"),
                                    });
                                } while (reader.Read());
                                return Ok(pedidos);
                            }
                            else
                            {
                                connection.Close();
                                return Ok(pedidos);
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
        [HttpGet]
        [Route("/ListarPedidosReclamosAdministrador")]
        public async Task<IActionResult> ListarPedidosReclamosAdministrador()
        {
            try
            {
                List<Pedido> pedidos = new List<Pedido>();
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                      SELECT p.IdPedido, p.FechaEntrega, p.FechaCreacion, p.Estado, p.Total,
                        t.Nombre AS NombreTienda, u.Nombre AS NombreCliente, u.Apellido AS ApellidoCliente,
                        us.Nombre AS NombreDueño, us.Apellido AS ApellidoDuenho, pp.TieneReclamo, pp.FechaReclamo,
                        pr.Nombre AS NombreProducto, pp.Cantidad AS CantidadProducto, pr.Precio,  t.IdTienda,
                        pp.ProductoID, pp.IdPedidoXProducto
                        FROM Pedidos p
                        INNER JOIN PedidoXProducto pp ON pp.PedidoID = p.IdPedido
                        INNER JOIN Producto pr ON pr.IdProducto = pp.ProductoID
                        INNER JOIN Tienda t ON t.IdTienda = pr.TiendaID
                        INNER JOIN Usuario u ON u.IdUsuario = p.UsuarioID
                        INNER JOIN Usuario us ON us.IdUsuario = t.UsuarioID
                        WHERE pp.TieneReclamo = 1
                        ORDER BY p.FechaCreacion DESC;
                     ";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                while (reader.Read())
                                {
                                    int idPedido = reader.GetInt32("IdPedido");
                                    Pedido pedidoExistente = pedidos.FirstOrDefault(p => p.IdPedido == idPedido);
                                    if (pedidoExistente == null)
                                    {
                                        pedidoExistente = new Pedido
                                        {
                                            IdPedido = idPedido,
                                            NombreCliente = reader.GetString("NombreCliente"),
                                            ApellidoCliente = reader.GetString("ApellidoCliente"),
                                            FechaEntrega = reader.IsDBNull(reader.GetOrdinal("FechaEntrega")) ? DateTime.MinValue : reader.GetDateTime("FechaEntrega"),
                                            FechaCreacion = reader.IsDBNull(reader.GetOrdinal("FechaCreacion")) ? DateTime.MinValue : reader.GetDateTime("FechaCreacion"),
                                            Total = reader.GetDouble("Total"),
                                            Estado = reader.GetInt32("Estado"),
                                            ProductosLista = new List<ProductoPedido>()
                                        };

                                        pedidos.Add(pedidoExistente);
                                    }
                                    pedidoExistente.ProductosLista.Add(new ProductoPedido
                                    {
                                        IdTienda = reader.GetInt32("IdTienda"),
                                        IdProducto = reader.GetInt32("ProductoID"),
                                        IdPedidoXProducto = reader.GetInt32("IdPedidoXProducto"),
                                        NombreTienda = reader.GetString("NombreTienda"),
                                        NombreDueño = reader.GetString("NombreDueño"),
                                        ApellidoDuenho = reader.GetString("ApellidoDuenho"),
                                        NombreProducto = reader.GetString("NombreProducto"),
                                        Cantidad = reader.GetInt32("CantidadProducto"),
                                        Precio = reader.GetDouble("Precio"),
                                        TieneReclamo = reader.GetBoolean("TieneReclamo"),
                                        FechaReclamo = reader.IsDBNull(reader.GetOrdinal("FechaReclamo")) ? DateTime.MinValue : reader.GetDateTime("FechaReclamo")
                                    });
                                }
                                return Ok(pedidos);
                            }
                            else
                            {
                                connection.Close();
                                return Ok(pedidos);
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
        [HttpGet]
        [Route("/VerificarContrasenha")]
        public async Task<IActionResult> VerificarContrasenha(int idUsuario, string contrasenha)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = "SELECT token, contrasenha FROM Usuario WHERE idUsuario = @IdUsuario AND Estado = 1";
                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                string contrasenhaHash = reader.GetString("contrasenha");
                                if (contrasenha == contrasenhaHash)
                                {
                                    string token = reader.GetString("token");
                                    connection.Close();
                                    return Ok(token);
                                }
                                else
                                {
                                    connection.Close();
                                    return Unauthorized();
                                }
                            }
                            else
                            {
                                connection.Close();
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
        [HttpGet]
        [Route("/VerificarToken")]
        public async Task<IActionResult> VerificarToken(int idUsuario)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
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

                    string query = "SELECT ContrasenhaVariado FROM Usuario WHERE idUsuario = @IdUsuario AND Estado = 1";
                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                string contrasenha = reader.GetString("ContrasenhaVariado");
                                byte[] salt = Encoding.UTF8.GetBytes("saltValue");
                                byte[] keyBytes = new Rfc2898DeriveBytes(secretKey, salt, 10000, HashAlgorithmName.SHA256).GetBytes(16);
                                string base64Key = Convert.ToBase64String(keyBytes);
                                string decryptedText = Decrypt(contrasenha, base64Key);
                                return Ok(decryptedText);
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
        [HttpGet]
        [Route("/InformacionIdUsuario")]
        public IActionResult GetUsuarios(int idUsuario)
        {
            bool esAdministradorVendedor;
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = "SELECT IdUsuario, Correo, Nombre, Apellido, DNI, Telefono, Direccion, EsComprador, EsVendedor, CorreoAlternativo, CantCambiosDireccion, CantMetodoPago " +
                        "FROM Usuario WHERE IdUsuario = @IdUsuario AND Estado = 1";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@IdUsuario", idUsuario);

                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                using (MySqlConnection connection2 = new MySqlConnection(connectionString))
                                {
                                    connection2.Open();
                                    string query2 = "SELECT EsAdministrador FROM Vendedor WHERE usuarioId = @IdUsuario";
                                    using (MySqlCommand command2 = new MySqlCommand(query2, connection2))
                                    {
                                        command2.Parameters.AddWithValue("@IdUsuario", idUsuario);

                                        using (MySqlDataReader reader2 = command2.ExecuteReader())
                                        {
                                            if (reader2.Read())
                                            {
                                                var usuario = new
                                                {
                                                    IdUsuario = !reader.IsDBNull(reader.GetOrdinal("IdUsuario")) ? reader.GetInt32("IdUsuario") : (int?)null,
                                                    Correo = reader.IsDBNull(reader.GetOrdinal("Correo")) ? null : reader.GetString("Correo"),
                                                    Nombre = reader.IsDBNull(reader.GetOrdinal("Nombre")) ? null : reader.GetString("Nombre"),
                                                    Apellido = reader.IsDBNull(reader.GetOrdinal("Apellido")) ? null : reader.GetString("Apellido"),
                                                    DNI = !reader.IsDBNull(reader.GetOrdinal("DNI")) ? reader.GetInt32("DNI") : (int?)null,
                                                    Telefono = !reader.IsDBNull(reader.GetOrdinal("Telefono")) ? reader.GetInt32("Telefono") : (int?)null,
                                                    Direccion = reader.IsDBNull(reader.GetOrdinal("Direccion")) ? null : reader.GetString("Direccion"),
                                                    CantCambiosDireccion = !reader.IsDBNull(reader.GetOrdinal("CantCambiosDireccion")) ? reader.GetInt32("CantCambiosDireccion") : (int?)null,
                                                    CantMetodoPago = !reader.IsDBNull(reader.GetOrdinal("CantMetodoPago")) ? reader.GetInt32("CantMetodoPago") : (int?)null,
                                                    EsComprador = !reader.IsDBNull(reader.GetOrdinal("EsComprador")) && reader.GetBoolean("EsComprador"),
                                                    EsVendedor = !reader.IsDBNull(reader.GetOrdinal("EsVendedor")) && reader.GetBoolean("EsVendedor"),
                                                    CorreoAlternativo = reader.IsDBNull(reader.GetOrdinal("CorreoAlternativo")) ? null : reader.GetString("CorreoAlternativo"),
                                                    EsVendedorAdministrador = !reader2.IsDBNull(reader2.GetOrdinal("EsAdministrador")) && reader2.GetBoolean("EsAdministrador")
                                                };
                                                connection.Close();
                                                return Ok(usuario);
                                            }
                                            else
                                            {
                                                var usuario = new
                                                {
                                                    IdUsuario = !reader.IsDBNull(reader.GetOrdinal("IdUsuario")) ? reader.GetInt32("IdUsuario") : (int?)null,
                                                    Correo = reader.IsDBNull(reader.GetOrdinal("Correo")) ? null : reader.GetString("Correo"),
                                                    Nombre = reader.IsDBNull(reader.GetOrdinal("Nombre")) ? null : reader.GetString("Nombre"),
                                                    Apellido = reader.IsDBNull(reader.GetOrdinal("Apellido")) ? null : reader.GetString("Apellido"),
                                                    DNI = !reader.IsDBNull(reader.GetOrdinal("DNI")) ? reader.GetInt32("DNI") : (int?)null,
                                                    Telefono = !reader.IsDBNull(reader.GetOrdinal("Telefono")) ? reader.GetInt32("Telefono") : (int?)null,
                                                    Direccion = reader.IsDBNull(reader.GetOrdinal("Direccion")) ? null : reader.GetString("Direccion"),
                                                    CantCambiosDireccion = !reader.IsDBNull(reader.GetOrdinal("CantCambiosDireccion")) ? reader.GetInt32("CantCambiosDireccion") : (int?)null,
                                                    CantMetodoPago = !reader.IsDBNull(reader.GetOrdinal("CantMetodoPago")) ? reader.GetInt32("CantMetodoPago") : (int?)null,
                                                    EsComprador = !reader.IsDBNull(reader.GetOrdinal("EsComprador")) && reader.GetBoolean("EsComprador"),
                                                    EsVendedor = !reader.IsDBNull(reader.GetOrdinal("EsVendedor")) && reader.GetBoolean("EsVendedor"),
                                                    CorreoAlternativo = reader.IsDBNull(reader.GetOrdinal("CorreoAlternativo")) ? null : reader.GetString("CorreoAlternativo"),
                                                    EsVendedorAdministrador = false
                                                };
                                                connection.Close();
                                                return Ok(usuario);
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                connection.Close();
                                return NotFound("Usuario no encontrado");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener el usuario: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/InformacionRolVendedor")]
        public IActionResult GetRolVendedor(int idUsuario)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = "SELECT esAdministrador FROM Vendedor WHERE usuarioId = @usuarioId AND Estado <> 4";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@usuarioId", idUsuario);

                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var rolVendedor = reader.GetBoolean("esAdministrador");
                                connection.Close();
                                return Ok(rolVendedor);
                            }
                            else
                            {
                                connection.Close();
                                return NotFound("Usuario no encontrado");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener el usuario: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("/InformacionTienda")]
        public IActionResult GetInformacionTienda(int idUsuario)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = @"SELECT T.IdTienda, T.Nombre, T.Descripcion, T.Direccion, T.Provincia, 
                    T.Pais, T.Foto, T.Estado, T.MotivoRechazo
                    FROM Vendedor V
                    INNER JOIN Tienda T ON T.IdTienda = V.TiendaID
                    WHERE V.usuarioId = @IdUsuario AND V.Estado <> 4";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@IdUsuario", idUsuario);

                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                Tienda tienda = new Tienda();
                                tienda.IdTienda = !reader.IsDBNull(reader.GetOrdinal("IdTienda")) ? reader.GetInt32("IdTienda") : -1;
                                tienda.Nombre = reader.IsDBNull(reader.GetOrdinal("Nombre")) ? null : reader.GetString("Nombre");
                                tienda.Foto = ConvertirBytesAImagen(reader["Foto"] as byte[]);
                                tienda.Descripcion = reader.IsDBNull(reader.GetOrdinal("Descripcion")) ? null : reader.GetString("Descripcion");
                                tienda.Direccion = reader.IsDBNull(reader.GetOrdinal("Direccion")) ? null : reader.GetString("Direccion");
                                tienda.Provincia = reader.IsDBNull(reader.GetOrdinal("Provincia")) ? null : reader.GetString("Provincia");
                                tienda.Pais = reader.IsDBNull(reader.GetOrdinal("Pais")) ? null : reader.GetString("Pais");
                                tienda.Estado = reader.IsDBNull(reader.GetOrdinal("Estado")) ? 0 : reader.GetInt32("Estado");
                                tienda.MotivoRechazo = reader.IsDBNull(reader.GetOrdinal("MotivoRechazo")) ? "" : reader.GetString("MotivoRechazo");
                                tienda.UsuarioId = idUsuario;
                                connection.Close();
                                return Ok(tienda);
                            }
                            else
                            {
                                connection.Close();
                                return NotFound("Usuario no encontrado");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener el usuario: {ex.Message}");
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
