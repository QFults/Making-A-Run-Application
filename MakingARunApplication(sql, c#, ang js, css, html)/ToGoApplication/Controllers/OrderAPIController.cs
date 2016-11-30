
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
        public async Task<IHttpActionResult> PostOrder(Order model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Orders.Add(model);
            await db.SaveChangesAsync();
            var ret = await db.Orders.Select(OrderDTO.SELECT).FirstOrDefaultAsync(x => x.Id == model.Id);
            return CreatedAtRoute("DefaultApi", new { id = model.Id }, model);
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