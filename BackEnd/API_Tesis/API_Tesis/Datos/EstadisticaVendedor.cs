namespace API_Tesis.Datos
{
    public class EstadisticaVendedor
    {
        public int CantidadCliente { get; set; }
        public int CantidadProductosAprobados { get; set; }
        public int CantidadPedidosEstadoPendiente { get; set; }
        public int CantidadPedidosEstadoCompletado { get; set; }
        public int CantidadPedidoXProductoConSeguimientoPendiente { get; set; }
        public int CantidadPedidoXProductoConReclamo { get; set; }
        public double SumaPreciosPedidosCompletadosTotal { get; set; }
        public double SumaPreciosPedidosCompletadosMes1 { get; set; }
        public double SumaPreciosPedidosCompletadosMes2 { get; set; }
        public double SumaPreciosPedidosCompletadosMes3 { get; set; }
    }
}
