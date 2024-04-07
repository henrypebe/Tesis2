namespace API_Tesis.Datos
{
    public class Pedido
    {
        public int IdPedido { get; set; }
        public int IdTienda { get; set; }
        public string NombreTienda { get; set; }
        public string NombreDueño { get; set; }
        public int Estado { get; set; }
        public DateTime FechaEntrega { get; set; }
        public DateTime FechaCreacion { get; set; }
        public double Total { get; set; }
        public List<ProductoPedido> ProductosLista { get; set; }
    }
}
