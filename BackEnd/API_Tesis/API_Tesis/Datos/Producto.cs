namespace API_Tesis.Datos
{
    public class Producto
    {
        public int IdProducto { get; set; }
        public string Nombre { get; set; }
        public double Precio { get; set; }
        public int Stock { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaCreacion { get; set; }
        public double CantidadOferta { get; set; }
        public double CostoEnvio { get; set; }
        public string FechaEnvio { get; set; }
        public string CantidadGarantia { get; set; }
        public string EstadoAprobacion { get; set; }
        public string MotivoRechazo { get; set; }
        public string TipoProducto { get; set; }
        public int TiendaId { get; set; }
        public string TiendaNombre { get; set; }
        public string TiendaFoto { get; set; }
        public string Imagen { get; set; }
        public int CantidadVentas { get; set; }
    }
}
