namespace API_Tesis.Datos
{
    public class Tienda
    {
        public int IdTienda { get; set; }
        public string? Nombre { get; set; }
        public string? Descripcion { get; set; }
        public string? Direccion { get; set; }
        public string? Provincia { get; set; }
        public string? Pais { get; set; }
        public string? Foto { get; set; }
        public string? NombreDueño { get; set; }
        public string? ApellidoDueño { get; set; }
        public int UsuarioId { get; set; }
        public int Estado { get; set; }
        public string MotivoRechazo { get; set; }
    }
}
