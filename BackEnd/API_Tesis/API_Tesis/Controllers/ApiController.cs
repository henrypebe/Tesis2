﻿using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;
using System.Text;
using Microsoft.EntityFrameworkCore;
using API_Tesis.BD;
using API_Tesis.Datos;
using MySqlConnector;

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
            }

            return Ok(_valorLogin);
        }
        [HttpPost]
        [Route("/CreateUsuario")]
        public async Task<ActionResult<int>> CrearUsuario(int DNI, string nombreApellido, string correo, string contrasenha, string token)
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
                string[] nombreApellidoArray = nombreApellido.Split(' ');
                string nombre = nombreApellidoArray[0];
                string apellido = nombreApellidoArray.Length > 1 ? nombreApellidoArray[1] : string.Empty;
                string query = "INSERT INTO Usuario (DNI, Nombre, Apellido, Correo, contrasenha, Token) VALUES (@DNI, @Nombre, @Apellido, @Correo, @Contrasenha, @Token)";
                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@DNI", DNI);
                    command.Parameters.AddWithValue("@Nombre", nombre);
                    command.Parameters.AddWithValue("@Apellido", apellido);
                    command.Parameters.AddWithValue("@Correo", correo);
                    command.Parameters.AddWithValue("@Contrasenha", contrasenha);
                    command.Parameters.AddWithValue("@Token", token);

                    int idUsuario = Convert.ToInt32(command.ExecuteScalar());

                    if (idUsuario > 0)
                    {
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
        [HttpPut]
        [Route("/EditarUsuario")]
        public async Task<ActionResult> EditarUsuario(int idUsuario, string nombre, string apellido, string correo, int numero, string direccion)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();
                string query = "UPDATE Usuario SET Apellido = @Apellido, Nombre = @Nombre, Correo = @Correo, Telefono = @Telefono, Direccion = @Direccion WHERE idUsuario = @IdUsuario";
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
                        return Ok();
                    }
                    else
                    {
                        return NotFound();
                    }
                }
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
                    string query = "SELECT Token FROM Usuario WHERE IdUsuario = @Id";
                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);
                        object result = command.ExecuteScalar();
                        if (result != null)
                        {
                            string token = result.ToString();
                            return Ok(token);
                        }
                        else
                        {
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

                    string updateQuery = "UPDATE Usuario SET EsComprador = @EsComprador, EsVendedor = @EsVendedor WHERE IdUsuario = @IdUsuario";
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
                string query = "SELECT * FROM Usuario";

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
            }

            return Ok(usuarios);
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

                    string query = "SELECT IdUsuario, Correo, Foto, Nombre, Apellido, DNI, Telefono, Direccion, EsComprador, EsVendedor FROM Usuario WHERE IdUsuario = @IdUsuario";

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

                                return Ok(usuario);
                            }
                            else
                            {
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
        private bool VerificarCorreoExistente(string correo)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();

                string query = "SELECT COUNT(*) FROM Usuario WHERE Correo = @Correo";

                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Correo", correo);

                    int count = Convert.ToInt32(command.ExecuteScalar());

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

                string query = "SELECT COUNT(*) FROM Usuario WHERE Token = @Token";

                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Token", token);

                    int count = Convert.ToInt32(command.ExecuteScalar());

                    // Si count es mayor que cero, significa que el correo ya está registrado
                    return count > 0;
                }
            }
        }
    }
}
