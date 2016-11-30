
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
	public class UserDTO
    {
		public System.Int32 Id { get; set; }
		public System.String Username { get; set; }
		public System.String Password { get; set; }
		public System.String Name { get; set; }
		public System.String Company { get; set; }
		public int Orders_Count { get; set; }
		public int Trips_Count { get; set; }

        public static System.Linq.Expressions.Expression<Func< User,  UserDTO>> SELECT =
            x => new  UserDTO
            {
                Id = x.Id,
                Username = x.Username,
                Password = x.Password,
                Name = x.Name,
                Company = x.Company,
                Orders_Count = x.Orders.Count(),
                Trips_Count = x.Trips.Count(),
            };

	}
}