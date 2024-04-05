namespace API_Tesis.Datos
{
    public class Tienda
    {
        public int IdTienda { get; set; }
        public string? Nombre { get; set; }
        public string? Descripcion { get; set; }
        public string? Direccion { get; set; }
        public string? Distrito { get; set; }
        public string? Pais { get; set; }
        public byte[]? Foto { get; set; }
        public int UsuarioId { get; set; }
    }
}
