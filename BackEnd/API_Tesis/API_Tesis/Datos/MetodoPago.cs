namespace API_Tesis.Datos
{
    public class MetodoPago
    {
        public int IdMetodoPago { get; set; }
        public int Last4 { get; set; }
        public string FechaExpiracion { get; set; }
        public string Token { get; set; }
        public int CVC { get; set; }
    }
}
