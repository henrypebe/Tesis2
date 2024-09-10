using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace API_Tesis.Controllers
{
    [ApiController]
    public class ApiController: ControllerBase
    {
        [HttpPost]
        [Route("/emailToken")]
        public async Task EnviarCorreo(string email)
        {
            string correoOrigen = "test@sbperu.net";
            string contraseñaCorreo = "oyzlwfgvducseiga";

            string asunto = $"Correo de Bienvenida";
            StringBuilder htmlBody = new StringBuilder();
            htmlBody.Append("<h3>Se hace entrega del token para el sistema:</h3>");
            htmlBody.Append("<p>AKDAHSJDJKASHKJDAS123</p>");

            MailMessage message = new MailMessage
            {
                From = new MailAddress(correoOrigen, "Prueba Tesis 2"),
                Subject = asunto,
                Body = htmlBody.ToString(),
                IsBodyHtml = true
            };

            message.To.Add(email);

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
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al enviar el correo: {ex.Message}");
            }
        }
    }
}
