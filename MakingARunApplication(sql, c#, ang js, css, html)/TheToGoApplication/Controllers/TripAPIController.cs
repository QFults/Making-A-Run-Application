
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
    public class TripController : ApiController
    {
        private ToGoLibrary.ToGoEDMContainer db = new ToGoLibrary.ToGoEDMContainer();

        public IQueryable<TripDTO> GetTrips(int pageSize = 10
                        ,System.Int32? UserId = null
                        ,System.Int32? LocationId = null
                )
        {
            var model = db.Trips.AsQueryable();
                                if(UserId != null){
                        model = model.Where(m=> m.UserId == UserId.Value);
                    }
                                if(LocationId != null){
                        model = model.Where(m=> m.LocationId == LocationId.Value);
                    }
                        
            return model.Select(TripDTO.SELECT).Take(pageSize);
        }

        [ResponseType(typeof(TripDTO))]
        public async Task<IHttpActionResult> GetTrip(int id)
        {
            var model = await db.Trips.Include("Orders").Select(TripDTO.SELECT).FirstOrDefaultAsync(x => x.Id == id);
            if (model == null)
            {
                return NotFound();
            }

            return Ok(model);
        }

        public async Task<IHttpActionResult> PutTrip(int id, Trip model)
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
                if (!TripExists(id))
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

        [ResponseType(typeof(TripDTO))]
        public async Task<IHttpActionResult> PostTrip(Trip model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Trips.Add(model);
            await db.SaveChangesAsync();
            var ret = await db.Trips.Select(TripDTO.SELECT).FirstOrDefaultAsync(x => x.Id == model.Id);
            return CreatedAtRoute("DefaultApi", new { id = model.Id }, model);
        }

        [ResponseType(typeof(TripDTO))]
        public async Task<IHttpActionResult> DeleteTrip(int id)
        {
            Trip model = await db.Trips.FindAsync(id);
            if (model == null)
            {
                return NotFound();
            }

            db.Trips.Remove(model);
            await db.SaveChangesAsync();
            var ret = await db.Trips.Select(TripDTO.SELECT).FirstOrDefaultAsync(x => x.Id == model.Id);
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

        private bool TripExists(int id)
        {
            return db.Trips.Count(e => e.Id == id) > 0;
        }
    }
}