
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
	public class TripDTO
    {
		public System.Int32 Id { get; set; }
		public System.String Name { get; set; }
		public System.DateTime Time { get; set; }
        public System.DateTime EndTime { get; set; }
		public System.Int32 UserId { get; set; }
		public System.Int32 LocationId { get; set; }
		public string User_Username { get; set; }
		public int Orders_Count { get; set; }
		public string Location_Image { get; set; }
        public Location Location { get; set; }
        public ICollection<Order> Orders { get; set; }

        public static System.Linq.Expressions.Expression<Func<Trip, TripDTO>> SELECT =
            x => new TripDTO
            {
                Id = x.Id,
                Name = x.Name,
                Time = x.Time,
                EndTime = x.EndTime,
                UserId = x.UserId,
                LocationId = x.LocationId,
                User_Username = x.User.Username,
                Orders_Count = x.Orders.Count(),
                Location_Image = x.Location.Image,
                Location = x.Location,
                Orders = x.Orders,
            };

	}
}