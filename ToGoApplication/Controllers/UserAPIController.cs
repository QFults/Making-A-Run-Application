
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
    public class UserController : ApiController
    {
        private ToGoLibrary.ToGoEDMContainer db = new ToGoLibrary.ToGoEDMContainer();

        public IQueryable<UserDTO> GetUsers(int pageSize = 10
                )
        {
            var model = db.Users.AsQueryable();
                        
            return model.Select(UserDTO.SELECT).Take(pageSize);
        }

        [ResponseType(typeof(UserDTO))]
        public async Task<IHttpActionResult> GetUser(int id)
        {
            var model = await db.Users.Select(UserDTO.SELECT).FirstOrDefaultAsync(x => x.Id == id);
            if (model == null)
            {
                return NotFound();
            }

            return Ok(model);
        }

        public async Task<IHttpActionResult> PutUser(int id, User model)
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
                if (!UserExists(id))
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

        [ResponseType(typeof(UserDTO))]
        public async Task<IHttpActionResult> PostUser(User model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Users.Add(model);
            await db.SaveChangesAsync();
            var ret = await db.Users.Select(UserDTO.SELECT).FirstOrDefaultAsync(x => x.Id == model.Id);
            return CreatedAtRoute("DefaultApi", new { id = model.Id }, model);
        }

        [ResponseType(typeof(UserDTO))]
        public async Task<IHttpActionResult> DeleteUser(int id)
        {
            User model = await db.Users.FindAsync(id);
            if (model == null)
            {
                return NotFound();
            }

            db.Users.Remove(model);
            await db.SaveChangesAsync();
            var ret = await db.Users.Select(UserDTO.SELECT).FirstOrDefaultAsync(x => x.Id == model.Id);
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

        private bool UserExists(int id)
        {
            return db.Users.Count(e => e.Id == id) > 0;
        }
    }
}