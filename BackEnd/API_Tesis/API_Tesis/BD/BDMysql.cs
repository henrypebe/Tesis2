using API_Tesis.Datos;
using Microsoft.EntityFrameworkCore;
namespace API_Tesis.BD
{
    public class BDMysql: DbContext
    {
        public BDMysql(DbContextOptions<BDMysql> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
    }
}
