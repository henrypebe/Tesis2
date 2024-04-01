namespace API_Tesis.Datos
{
    public class Usuario
    {
        public int IdUsuario { get; set; }
        public string Correo { get; set; }
        public string contrasenha { get; set; }
        public string Token { get; set; }
        public byte[] Foto { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public int DNI { get; set; }
        public int Telefono { get; set; }
        public string Direccion { get; set; }
        public bool EsComprador { get; set; }
        public bool EsVendedor { get; set; }
    }
}
