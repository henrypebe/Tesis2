namespace API_Tesis.Datos
{
    public class Producto
    {
        public int IdProducto { get; set; }
        public string Nombre { get; set; }
        public double Precio { get; set; }
        public int Stock { get; set; }
        public string Descripcion { get; set; }
        public double CantidadOferta { get; set; }
        public string CantidadGarantia { get; set; }
        public string EstadoAprobacion { get; set; }
        public string TipoProducto { get; set; }
        public int TiendaId { get; set; }
        public string Imagen { get; set; }
        public DateTime FechaCreacion { get; set; }
        public int CantidadVentas { get; set; }
    }
}
