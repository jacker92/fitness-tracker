using FitnessTrackerApi.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly FitnessDbContext _db;

        public Repository(FitnessDbContext context)
        {
            _db = context;
        }

        public IQueryable<T> GetAll()
        {
            return _db.Set<T>().AsNoTracking();
        }

        public IQueryable<T> Get(Expression<Func<T, bool>> expression, Expression<Func<T, object>> include = null)
        {
            if (include == null)
            {
                return _db.Set<T>().Where(expression);
            }
            else
            {
                return _db.Set<T>().Where(expression).Include(include);
            }
        }

        public T GetById(object id)
        {
            return _db.Set<T>().Find(id);
        }

        public async Task Add(T entity)
        {
            _db.Set<T>().Add(entity);
            await _db.SaveChangesAsync();
        }

        public async Task Update(T entity)
        {
            _db.Set<T>().Update(entity);
            await _db.SaveChangesAsync();
        }

        public async Task Delete(T entity)
        {
            _db.Set<T>().Remove(entity);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteRange(List<T> entities)
        {
            _db.Set<T>().RemoveRange(entities);
            await _db.SaveChangesAsync();
        }
    }
}