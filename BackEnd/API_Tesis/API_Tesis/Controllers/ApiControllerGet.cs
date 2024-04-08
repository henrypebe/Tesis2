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
    public class ApiControllerGet: ControllerBase
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
                string query = "SELECT * FROM Producto WHERE Estado = 1 AND EstadoAprobacion = @EstadoAprobacion";

                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@EstadoAprobacion", "Pendiente");
                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Producto producto = new Producto
                            {
                                IdProducto = reader.GetInt32("IdProducto"),
                                Nombre = reader.GetString("Nombre"),
                                Precio = reader.GetDouble("Precio"),
                                Stock = reader.GetInt32("Stock"),
                                FechaCreacion = reader.GetDateTime("FechaCreacion"),
                                Descripcion = reader.GetString("Descripcion"),
                                CantidadOferta = reader.GetDouble("CantidadOferta"),
                                CantidadGarantia = reader.GetString("CantidadGarantia"),
                                EstadoAprobacion = reader.GetString("EstadoAprobacion"),
                                TipoProducto = reader.GetString("TipoProducto"),
                                TiendaId = reader.GetInt32("TiendaId"),
                                Imagen = ConvertirBytesAImagen(reader["Foto"] as byte[]),
                                CantidadVentas = reader.GetInt32("CantidadVentas")
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
                                    Console.WriteLine("Correo enviado con la información de los tickets sin tareas.");
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
                string query = @"SELECT p.*, t.Nombre AS NombreTienda, t.Foto AS FotoTienda 
                        FROM Producto p 
                        INNER JOIN Tienda t ON p.TiendaID = t.IdTienda 
                        WHERE p.Estado = 1 AND p.EstadoAprobacion <> 'Pendiente' AND Stock >= 1";

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
                                CantidadGarantia = reader.GetString("CantidadGarantia"),
                                EstadoAprobacion = reader.GetString("EstadoAprobacion"),
                                TipoProducto = reader.GetString("TipoProducto"),
                                TiendaId = reader.GetInt32("TiendaId"),
                                TiendaNombre = reader.GetString("NombreTienda"),
                                TiendaFoto = ConvertirBytesAImagen(reader["FotoTienda"] as byte[]),
                                Imagen = ConvertirBytesAImagen(reader["Foto"] as byte[]),
                                CantidadVentas = reader.GetInt32("CantidadVentas"),
                                FechaCreacion = reader.GetDateTime("FechaCreacion"),
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
        [Route("/ListasProductos")]
        public ActionResult<IEnumerable<Producto>> GetProductos(int idTienda, string busqueda)
        {
            List<Producto> productos = new List<Producto>();
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();
                string query = "SELECT * FROM Producto WHERE Estado = 1 AND TiendaID = @TiendaID";

                if (busqueda != "nada")
                {
                    query += " AND (Nombre LIKE @Busqueda OR TipoProducto LIKE @Busqueda OR IdProducto LIKE @Busqueda)";
                }

                query += " ORDER BY CantidadVentas DESC";

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
                                Descripcion = descripcionProducto,
                                CantidadOferta = reader.GetDouble("CantidadOferta"),
                                CostoEnvio = CostoEnvio,
                                FechaEnvio = FechaEnvio,
                                CantidadGarantia = reader.GetString("CantidadGarantia"),
                                EstadoAprobacion = reader.GetString("EstadoAprobacion"),
                                TipoProducto = reader.GetString("TipoProducto"),
                                TiendaId = reader.GetInt32("TiendaId"),
                                Imagen = ConvertirBytesAImagen(reader["Foto"] as byte[]),
                                CantidadVentas = reader.GetInt32("CantidadVentas"),
                                FechaCreacion = reader.GetDateTime("FechaCreacion"),
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
	                   p.MetodoPago, t.IdTienda, t.Nombre AS NombreTienda, u.Nombre AS NombreDuenho, u.Apellido AS ApellidoDuenho,
	                   pp.ProductoID, pp.Cantidad, pr.Precio, pr.Nombre as NombreProducto, u.IdUsuario as IdDuenho, pp.TieneSeguimiento,
                       pp.IdPedidoXProducto
                       FROM Pedidos p 
                       INNER JOIN PedidoXProducto pp ON p.IdPedido = pp.PedidoID
                       INNER JOIN Producto pr ON pr.IdProducto = pp.ProductoID
                       INNER JOIN Tienda t ON t.IdTienda = pr.TiendaID
                       INNER JOIN Usuario u ON u.IdUsuario = t.UsuarioID
                       WHERE p.UsuarioID = @IdUsuario AND p.Estado = 1";

                    if (FechaFiltro != DateTime.MinValue)
                    {
                        query += " AND DATE_FORMAT(p.FechaEntrega, '%Y-%m-%d') = @FechaFiltro";
                    }

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
                                    TieneSeguimiento = _tieneSeguimiento
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
	                   pp.ProductoID, pp.Cantidad, pr.Precio, pr.Nombre as NombreProducto, pp.TieneSeguimiento, pp.IdPedidoXProducto
                       FROM Pedidos p 
                       INNER JOIN PedidoXProducto pp ON p.IdPedido = pp.PedidoID
                       INNER JOIN Producto pr ON pr.IdProducto = pp.ProductoID
                       INNER JOIN Tienda t ON t.IdTienda = pr.TiendaID
                       INNER JOIN Usuario u ON u.IdUsuario = p.UsuarioID
                       WHERE pr.TiendaID = @IdTienda AND p.Estado = 1";

                    if (FechaFiltro != DateTime.MinValue)
                    {
                        query += " AND DATE_FORMAT(p.FechaEntrega, '%Y-%m-%d') = @FechaFiltro";
                    }

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
                                    TieneSeguimiento = reader.GetBoolean("TieneSeguimiento"),
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
                        pr.Foto AS FotoProducto, p.Estado AS EstadoPedido, pp.IdPedidoXProducto, pp.TieneReclamo
                        FROM Pedidos p
                        INNER JOIN PedidoXProducto pp ON pp.PedidoID = p.IdPedido
                        INNER JOIN Chat c ON c.PedidoXProductoID = pp.IdPedidoXProducto
                        INNER JOIN Producto pr ON pp.ProductoID = pr.IdProducto
                        INNER JOIN Tienda t ON t.IdTienda = pr.TiendaID
                        INNER JOIN Usuario u ON u.IdUsuario = t.UsuarioID
                        WHERE p.UsuarioID = @IdUsuario AND pp.TieneSeguimiento=true";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                int idChat = reader.GetInt32("IdChat");
                                Seguimiento seguimientoExistente = seguimientos.FirstOrDefault(p => p.IdChat == idChat);
                                if (seguimientoExistente == null)
                                {
                                    seguimientoExistente = new Seguimiento
                                    {
                                        IdChat = idChat,
                                        IdPedidoXProducto = reader.GetInt32("IdPedidoXProducto"),
                                        NombreTienda = reader.GetString("NombreTienda"),
                                        NombreDuenho = reader.GetString("NombreDuenho"),
                                        ApellidoDuenho = reader.GetString("ApellidoDuenho"),
                                        NombreProducto = reader.GetString("NombreProducto"),
                                        FotoProducto = ConvertirBytesAImagen(reader["FotoProducto"] as byte[]),
                                        EstadoPedido = reader.GetInt32("EstadoPedido"),
                                        TieneReclamo = reader.GetBoolean("TieneReclamo"),
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

                    string query = "SELECT IdUsuario, Correo, Nombre, Apellido, DNI, Telefono, Direccion, EsComprador, EsVendedor " +
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
                                                    EsComprador = !reader.IsDBNull(reader.GetOrdinal("EsComprador")) && reader.GetBoolean("EsComprador"),
                                                    EsVendedor = !reader.IsDBNull(reader.GetOrdinal("EsVendedor")) && reader.GetBoolean("EsVendedor"),
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
                                                    EsComprador = !reader.IsDBNull(reader.GetOrdinal("EsComprador")) && reader.GetBoolean("EsComprador"),
                                                    EsVendedor = !reader.IsDBNull(reader.GetOrdinal("EsVendedor")) && reader.GetBoolean("EsVendedor"),
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

                    string query = "SELECT esAdministrador FROM Vendedor WHERE usuarioId = @usuarioId AND Estado = 1";

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

                    string query = "SELECT IdTienda, Nombre, Descripcion, Direccion, Provincia, Pais, Foto FROM Tienda WHERE UsuarioID = @IdUsuario AND Estado = 1";

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
