using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(yuri.Startup))]
namespace yuri
{
    public partial class Startup {
        public void Configuration(IAppBuilder app) {
            ConfigureAuth(app);
        }
    }
}
