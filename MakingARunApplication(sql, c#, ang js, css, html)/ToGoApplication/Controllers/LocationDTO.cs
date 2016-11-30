
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace ToGoLibrary
{
	public class LocationDTO
    {
		public System.Int32 Id { get; set; }
		public System.String Image { get; set; }
		public System.String Name { get; set; }

        public static System.Linq.Expressions.Expression<Func< Location,  LocationDTO>> SELECT =
            x => new  LocationDTO
            {
                Id = x.Id,
                Image = x.Image,
                Name = x.Name,
            };

	}
}