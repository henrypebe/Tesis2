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
    public class ApiController: ControllerBase
    {
        private readonly BDMysql _context;
        private readonly IConfiguration _configuration;
        public ApiController(BDMysql context, IConfiguration configuration)
        {
            _configuration = configuration;
            _context = context;
        }
        [HttpPost]
        [Route("/login")]
        public ActionResult<ValorLogin> VerificarUsuario(string _correo, string _contrasenha, string _token)
        {
            ValorLogin _valorLogin = new ValorLogin();
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();
                string query = "SELECT IdUsuario, EsAdministrador, EsComprador, EsVendedor FROM Usuario WHERE Correo = @Correo AND contrasenha = @Contrasenha AND Token = @Token";

                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Correo", _correo);
                    command.Parameters.AddWithValue("@Contrasenha", _contrasenha);
                    command.Parameters.AddWithValue("@Token", _token);

                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            _valorLogin.idUsuario = reader.GetInt32(0);
                            bool esAdministrador;
                            if (reader.IsDBNull(1))
                            {
                                esAdministrador = false;
                            }
                            else
                            {
                                esAdministrador = reader.GetBoolean(1);
                            }
                            bool esComprador = reader.GetBoolean(2);
                            bool esVendedor = reader.GetBoolean(3);

                            if (esAdministrador)
                            {
                                _valorLogin.opcionPantalla = 1;
                            }
                            else if (esComprador)
                            {
                                _valorLogin.opcionPantalla = 2;
                            }
                            else if (esVendedor)
                            {
                                _valorLogin.opcionPantalla = 3;
                            }
                        }
                    }
                }
                connection.Close();
            }

            return Ok(_valorLogin);
        }
        [HttpPost]
        [Route("/CreateUsuario")]
        public async Task<ActionResult<int>> CrearUsuario(int DNI, string nombreApellido, string correo, string contrasenha, string token, string contrasenhaVariado)
        {

            string _token = token;

            while (VerificarTokenExistente(token))
            {
                _token = Guid.NewGuid().ToString();
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
                string query = "INSERT INTO Usuario (DNI, Nombre, Apellido, Correo, contrasenha, Token, ContrasenhaVariado, Estado) VALUES (@DNI, @Nombre, @Apellido, @Correo, @Contrasenha, @Token, @ContrasenhaVariado, @Estado)";
                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@DNI", DNI);
                    command.Parameters.AddWithValue("@Nombre", nombre);
                    command.Parameters.AddWithValue("@Apellido", apellido);
                    command.Parameters.AddWithValue("@Correo", correo);
                    command.Parameters.AddWithValue("@Contrasenha", contrasenha);
                    command.Parameters.AddWithValue("@Token", token);
                    command.Parameters.AddWithValue("@ContrasenhaVariado", encryptedText);
                    command.Parameters.AddWithValue("@Estado", 1);

                    int rowsAffected = await command.ExecuteNonQueryAsync();

                    if (rowsAffected > 0)
                    {
                        command.CommandText = "SELECT LAST_INSERT_ID()";
                        int idUsuario = Convert.ToInt32(command.ExecuteScalar());
                        string correoOrigen = "test@sbperu.net";
                        string contraseñaCorreo = "oyzlwfgvducseiga";

                        string asunto = $"Correo de Bienvenida";
                        StringBuilder htmlBody = new StringBuilder();
                        htmlBody.Append("<h3>Se hace entrega del token para el sistema:</h3>");
                        htmlBody.Append($"<p>{token}</p>");
                        htmlBody.Append($"<p>Es importante mencionar que no debe de divulgar su token de acceso por seguridad.</p>");

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
        public async Task<ActionResult<int>> CrearTienda(int idUsuario, string nombre, string descripcion, string direccion, string distrito, string pais)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    string query = @"INSERT INTO Tienda (Nombre, Descripcion, Direccion, Distrito, Pais, UsuarioID, Estado) 
                             VALUES (@Nombre, @Descripcion, @Direccion, @Distrito, @Pais, @UsuarioID, @Estado);
                             SELECT LAST_INSERT_ID();";
                    MySqlCommand command = new MySqlCommand(query, connection);
                    command.Parameters.AddWithValue("@Nombre", nombre);
                    command.Parameters.AddWithValue("@Descripcion", descripcion);
                    command.Parameters.AddWithValue("@Direccion", direccion);
                    command.Parameters.AddWithValue("@Distrito", distrito);
                    command.Parameters.AddWithValue("@Pais", pais);
                    command.Parameters.AddWithValue("@UsuarioID", idUsuario);
                    command.Parameters.AddWithValue("@Estado", 1);
                    int idGenerado = Convert.ToInt32(await command.ExecuteScalarAsync());

                    return Ok(idGenerado);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpPut]
        [Route("/EditarUsuario")]
        public async Task<ActionResult> EditarUsuario(int idUsuario, string nombre, string apellido, string correo, int numero, string direccion)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();
                string query = "UPDATE Usuario SET Apellido = @Apellido, Nombre = @Nombre, Correo = @Correo, Telefono = @Telefono, Direccion = @Direccion WHERE idUsuario = @IdUsuario AND Estado = 1";
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
                //[HttpPut]
        //[Route("/EditarTienda")]
        //public async Task<ActionResult<int>> EditarTienda(int idTienda, string nombre, string descripcion, string direccion, string distrito, string pais)
        //{
        //    try
        //    {
        //        string connectionString = _configuration.GetConnectionString("DefaultConnection");
        //        using (MySqlConnection connection = new MySqlConnection(connectionString))
        //        {
        //            connection.Open();
        //            string query = @"INSERT INTO Tienda (Nombre, Descripcion, Direccion, Distrito, Pais, UsuarioID, Estado) 
        //                     VALUES (@Nombre, @Descripcion, @Direccion, @Distrito, @Pais, @UsuarioID, @Estado);
        //                     SELECT LAST_INSERT_ID();";
        //            MySqlCommand command = new MySqlCommand(query, connection);
        //            command.Parameters.AddWithValue("@Nombre", nombre);
        //            command.Parameters.AddWithValue("@Descripcion", descripcion);
        //            command.Parameters.AddWithValue("@Direccion", direccion);
        //            command.Parameters.AddWithValue("@Distrito", distrito);
        //            command.Parameters.AddWithValue("@Pais", pais);
        //            command.Parameters.AddWithValue("@UsuarioID", idUsuario);
        //            command.Parameters.AddWithValue("@Estado", 1);
        //            int idGenerado = Convert.ToInt32(await command.ExecuteScalarAsync());

        //            return Ok(idGenerado);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Error interno del servidor: {ex.Message}");
        //    }
        //}
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
                                string insertVendedorQuery = "INSERT INTO Vendedor (usuarioId) VALUES (@UsuarioId)";
                                using (MySqlCommand insertCommand = new MySqlCommand(insertVendedorQuery, connection))
                                {
                                    insertCommand.Parameters.AddWithValue("@UsuarioId", idUsuario);
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
                                string insertCompradorQuery = "INSERT INTO Comprador (usuarioId) VALUES (@UsuarioId)";
                                using (MySqlCommand insertCommand = new MySqlCommand(insertCompradorQuery, connection))
                                {
                                    insertCommand.Parameters.AddWithValue("@UsuarioId", idUsuario);
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
        [HttpGet]
        [Route("/RecuperarContrasenha")]
        public async Task<IActionResult> VerifyUser(string correo, string token)
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

                    string query = "SELECT ContrasenhaVariado, IdUsuario FROM Usuario WHERE Correo = @Correo AND Token = @Token AND Estado = 1";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Correo", correo);
                        command.Parameters.AddWithValue("@Token", token);

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
        [HttpGet]
        [Route("/users")]
        public ActionResult<IEnumerable<Usuario>> GetUsers()
        {
            List<Usuario> usuarios = new List<Usuario>();
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();
                string query = "SELECT * FROM Usuario WHERE Estado = 1";

                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Usuario usuario = new Usuario
                            {
                                IdUsuario = reader.GetInt32("IdUsuario"),
                                Correo = reader.GetString("Correo"),
                                contrasenha = reader.GetString("contrasenha"),
                                Token = reader.GetString("Token"),
                                Nombre = reader.GetString("Nombre"),
                                Apellido = reader.GetString("Apellido"),
                                DNI = reader.GetInt32("DNI"),
                            };
                            usuarios.Add(usuario);
                        }
                    }
                }
                connection.Close();
            }

            return Ok(usuarios);
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
        public async Task<IActionResult> VerificarToken(int idUsuario, string token)
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

                    string query = "SELECT token, ContrasenhaVariado FROM Usuario WHERE idUsuario = @IdUsuario AND Estado = 1";
                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                string tokenHash = reader.GetString("token");
                                if (token == tokenHash)
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
                                    return Unauthorized();
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
        [HttpGet]
        [Route("/InformacionIdUsuario")]
        public IActionResult GetUsuarios(int idUsuario)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = "SELECT IdUsuario, Correo, Foto, Nombre, Apellido, DNI, Telefono, Direccion, EsComprador, EsVendedor FROM Usuario WHERE IdUsuario = @IdUsuario AND Estado = 1";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@IdUsuario", idUsuario);

                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var usuario = new
                                {
                                    IdUsuario = !reader.IsDBNull(reader.GetOrdinal("IdUsuario")) ? reader.GetInt32("IdUsuario") : (int?)null,
                                    Correo = reader.IsDBNull(reader.GetOrdinal("Correo")) ? null : reader.GetString("Correo"),
                                    Foto = reader.IsDBNull(reader.GetOrdinal("Foto")) ? null : (byte[])reader["Foto"],
                                    Nombre = reader.IsDBNull(reader.GetOrdinal("Nombre")) ? null : reader.GetString("Nombre"),
                                    Apellido = reader.IsDBNull(reader.GetOrdinal("Apellido")) ? null : reader.GetString("Apellido"),
                                    DNI = !reader.IsDBNull(reader.GetOrdinal("DNI")) ? reader.GetInt32("DNI") : (int?)null,
                                    Telefono = !reader.IsDBNull(reader.GetOrdinal("Telefono")) ? reader.GetInt32("Telefono") : (int?)null,
                                    Direccion = reader.IsDBNull(reader.GetOrdinal("Direccion")) ? null : reader.GetString("Direccion"),
                                    EsComprador = !reader.IsDBNull(reader.GetOrdinal("EsComprador")) && reader.GetBoolean("EsComprador"),
                                    EsVendedor = !reader.IsDBNull(reader.GetOrdinal("EsVendedor")) && reader.GetBoolean("EsVendedor")
                                };
                                connection.Close();
                                return Ok(usuario);
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
        private bool VerificarTokenExistente(string token)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();

                string query = "SELECT COUNT(*) FROM Usuario WHERE Token = @Token AND Estado = 1";

                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Token", token);

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
    }
}
