namespace API_Tesis.Datos
{
    public class Mensaje
    {
        public int IdMensaje { get; set; }
        public string Contenido { get; set; }
        public int EmisorId { get; set; }
        public string NombreEmisor { get; set; }
        public string NombreProducto { get; set; }
        public string ApellidoEmisor { get; set; }
        public DateTime FechaEnvio { get; set; }
        public bool EsTienda { get; set; }
    }
}
