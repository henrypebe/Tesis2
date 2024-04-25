namespace API_Tesis.Datos
{
    public class InicioVendedor
    {
        public double Ingresos { get; set; }
        public double IngresosPendientes { get; set; }
        public int VentasCompletadas { get; set; }
        public int VentasPendientes { get; set; }
        public int ProductosPublicados { get; set; }
        public string ProductoMasVendido { get; set; }
        public int CantidadChatsPendientes { get; set; }
        public double PorcentajeSatisfaccion { get; set; }
        public int CantidadReclamo { get; set; }
        public int CantidadMetodoPago { get; set; }
    }
}
