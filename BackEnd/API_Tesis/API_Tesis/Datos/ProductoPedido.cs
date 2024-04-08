namespace API_Tesis.Datos
{
    public class ProductoPedido
    {
        public int IdTienda { get; set; }
        public int IdProducto { get; set; }
        public int IdPedidoXProducto { get; set; }
        public string NombreProducto { get; set; }
        public string NombreTienda { get; set; }
        public string NombreDueño { get; set; }
        public string ApellidoDuenho { get; set; }
        public int Cantidad { get; set; }
        public double Precio { get; set; }
        public Boolean TieneSeguimiento { get; set; }
    }
}
