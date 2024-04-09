namespace API_Tesis.Datos
{
    public class Seguimiento
    {
        public int IdChat { get; set; }
        public int IdPedidoXProducto { get; set; }
        public string NombreTienda { get; set; }
        public string NombreDuenho { get; set; }
        public string ApellidoDuenho { get; set; }
        public string NombreCliente { get; set; }
        public string ApellidoCliente { get; set; }
        public string NombreProducto { get; set; }
        public string FotoProducto { get; set; }
        public int EstadoPedido { get; set; }
        public DateTime FechaCreacion { get; set; }
        public bool TieneReclamo { get; set; }
    }
}
