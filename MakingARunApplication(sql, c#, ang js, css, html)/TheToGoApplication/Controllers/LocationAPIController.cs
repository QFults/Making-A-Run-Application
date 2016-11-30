
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
    public class LocationController : ApiController
    {
        private ToGoLibrary.ToGoEDMContainer db = new ToGoLibrary.ToGoEDMContainer();

        public IQueryable<LocationDTO> GetLocations(int pageSize = 10
                )
        {
            var model = db.Locations.AsQueryable();
                        
            return model.Select(LocationDTO.SELECT).Take(pageSize);
        }

        [ResponseType(typeof(LocationDTO))]
        public async Task<IHttpActionResult> GetLocation(int id)
        {
            var model = await db.Locations.Select(LocationDTO.SELECT).FirstOrDefaultAsync(x => x.Id == id);
            if (model == null)
            {
                return NotFound();
            }

            return Ok(model);
        }

        public async Task<IHttpActionResult> PutLocation(int id, Location model)
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
                if (!LocationExists(id))
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

        [ResponseType(typeof(LocationDTO))]
        public async Task<IHttpActionResult> PostLocation(Location model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Locations.Add(model);
            await db.SaveChangesAsync();
            var ret = await db.Locations.Select(LocationDTO.SELECT).FirstOrDefaultAsync(x => x.Id == model.Id);
            return CreatedAtRoute("DefaultApi", new { id = model.Id }, model);
        }

        [ResponseType(typeof(LocationDTO))]
        public async Task<IHttpActionResult> DeleteLocation(int id)
        {
            Location model = await db.Locations.FindAsync(id);
            if (model == null)
            {
                return NotFound();
            }

            db.Locations.Remove(model);
            await db.SaveChangesAsync();
            var ret = await db.Locations.Select(LocationDTO.SELECT).FirstOrDefaultAsync(x => x.Id == model.Id);
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

        private bool LocationExists(int id)
        {
            return db.Locations.Count(e => e.Id == id) > 0;
        }
    }
}