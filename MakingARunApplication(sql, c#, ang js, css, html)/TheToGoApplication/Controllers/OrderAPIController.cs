
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace ToGoLibrary
{
    public class newOrder
    {
        public Order NewlyMadeOrder { get; set; }
        public string EmailForTripCreator { get; set; }
        public string EmailForOrderCreator { get; set; }
        public string OrderCreatorName { get; set; }
    }
    public class OrderController : ApiController
    {
        private ToGoLibrary.ToGoEDMContainer db = new ToGoLibrary.ToGoEDMContainer();

        public IQueryable<OrderDTO> GetOrders(int pageSize = 10
                        ,System.Int32? UserId = null
                        ,System.Int32? TripId = null
                )
        {
            var model = db.Orders.AsQueryable();
                                if(UserId != null){
                        model = model.Where(m=> m.UserId == UserId.Value);
                    }
                                if(TripId != null){
                        model = model.Where(m=> m.TripId == TripId.Value);
                    }
                        
            return model.Select(OrderDTO.SELECT).Take(pageSize);
        }

        [ResponseType(typeof(OrderDTO))]
        public async Task<IHttpActionResult> GetOrder(int id)
        {
            var model = await db.Orders.Select(OrderDTO.SELECT).FirstOrDefaultAsync(x => x.Id == id);
            if (model == null)
            {
                return NotFound();
            }

            return Ok(model);
        }

        public IQueryable<OrderDTO> GetOrders(System.Int32 UserId
                )
        {
            var model = db.Orders.AsQueryable();
        
                model = model.Where(m => m.UserId == UserId);
            
            return model.Select(OrderDTO.SELECT);
        }

        public async Task<IHttpActionResult> PutOrder(int id, Order model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != model.Id)
            {
                return BadRequest();
            }

            db.Entry(model).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        [ResponseType(typeof(OrderDTO))]
        public async Task<IHttpActionResult> PostOrder(newOrder finalOrder)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Orders.Add(finalOrder.NewlyMadeOrder);
            await db.SaveChangesAsync();
            var ret = await db.Orders.Select(OrderDTO.SELECT).FirstOrDefaultAsync(x => x.Id == finalOrder.NewlyMadeOrder.Id);

            MailMessage mail = new MailMessage("From Email", "To Email");
            SmtpClient client = new SmtpClient("smtp.gmail.com", 587);
            client.Credentials = new NetworkCredential("Your Email", "Your Password");
            client.EnableSsl = true;
            mail.Subject = "Email Subject";
            mail.Body = "Email Body";
            client.Send(mail);

            return CreatedAtRoute("DefaultApi", new { id = finalOrder.NewlyMadeOrder.Id }, finalOrder.NewlyMadeOrder);
        }

        [ResponseType(typeof(OrderDTO))]
        public async Task<IHttpActionResult> DeleteOrder(int id)
        {
            Order model = await db.Orders.FindAsync(id);
            if (model == null)
            {
                return NotFound();
            }

            db.Orders.Remove(model);
            await db.SaveChangesAsync();
            var ret = await db.Orders.Select(OrderDTO.SELECT).FirstOrDefaultAsync(x => x.Id == model.Id);
            return Ok(ret);
        }


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool OrderExists(int id)
        {
            return db.Orders.Count(e => e.Id == id) > 0;
        }
    }
}