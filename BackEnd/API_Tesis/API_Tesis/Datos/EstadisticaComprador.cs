namespace API_Tesis.Datos
{
    public class EstadisticaComprador
    {
        public int CantidadPedidos { get; set; }
        public int CantidadPedidosEstadoPendiente { get; set; }
        public int CantidadPedidosEstadoCompletado { get; set; }
        public int CantidadChatsFinalizados { get; set; }
        public int CantidadChatsPendientes { get; set; }
        public int CantidadPedidosConReclamo { get; set; }
        public double TotalDescuento { get; set; }
        public double TotalDescuentoMesActual { get; set; }
        public double TotalDescuentoMesAnterior { get; set; }
        public double TotalDescuentoDosMesesAntes { get; set; }
    }
}
