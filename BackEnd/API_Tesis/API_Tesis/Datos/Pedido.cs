namespace API_Tesis.Datos
{
    public class Pedido
    {
        public int IdPedido { get; set; }
        public int IdDuenho { get; set; }
        public string NombreCliente { get; set; }
        public string ApellidoCliente { get; set; }
        public int Estado { get; set; }
        public DateTime FechaEntrega { get; set; }
        public DateTime FechaCreacion { get; set; }
        public bool ReclamoPedido { get; set; }
        public double Total { get; set; }
        public double CostoEnvio { get; set; }
        public List<ProductoPedido> ProductosLista { get; set; }
    }
}
