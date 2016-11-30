
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
	public class OrderDTO
    {
		public System.Int32 Id { get; set; }
		public System.String Food { get; set; }
		public System.String Drink { get; set; }
		public System.String PaymentMethod { get; set; }
		public System.Int32 UserId { get; set; }
		public System.Int32 TripId { get; set; }
		public string User_Username { get; set; }
		public string Trip_Name { get; set; }
        public User User { get; set; }

        public static System.Linq.Expressions.Expression<Func< Order,  OrderDTO>> SELECT =
            x => new  OrderDTO
            {
                Id = x.Id,
                Food = x.Food,
                Drink = x.Drink,
                PaymentMethod = x.PaymentMethod,
                UserId = x.UserId,
                TripId = x.TripId,
                User_Username = x.User.Username,
                Trip_Name = x.Trip.Name,
                User = x.User,
            };

	}
}