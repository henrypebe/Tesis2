namespace API_Tesis.Datos
{
    public class ProductoReclamo
    {
        public int IdPedidoXProducto { get; set; }
        public int ProductoID { get; set; }
        public string FotoProducto { get; set; }
        public string NombreProducto { get; set; }
        public string NombreCliente { get; set; }
        public string ApellidoCliente { get; set; }
        public int CantidadProducto { get; set; }
    }
}
