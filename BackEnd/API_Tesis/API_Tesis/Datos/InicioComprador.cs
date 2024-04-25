namespace API_Tesis.Datos
{
    public class InicioComprador
    {
        public int TotalPedidosUsuario { get; set; }
        public int TotalPedidosUsuarioPendiente { get; set; }
        public int TotalProductosPublicados { get; set; }
        public string ProductoMasVendido { get; set; }
        public int TotalChats { get; set; }
        public int TotalChatsFinalizadosCliente { get; set; }
        public double TotalDescuentoPedidosUsuario { get; set; }
        public int TotalPedidosConReclamo { get; set; }
        public int TotalProductosConReclamo { get; set; }
        public int CantidadMetodoPago { get; set; }
    }
}
