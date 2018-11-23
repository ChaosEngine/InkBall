using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading;

namespace InkBall.Module
{
	public static class SessionExtensions
	{
		static readonly JsonSerializerSettings _jsonSerializerSettings = new JsonSerializerSettings
		{
			TypeNameHandling = TypeNameHandling.All,
		};

		public static void Set<T>(this ISession session, string key, T value)
		{
			string str = JsonConvert.SerializeObject(value, _jsonSerializerSettings);

			session.SetString(key, str);
		}

		public static T Get<T>(this ISession session, string key)
		{
			var value = session.GetString(key);

			if (value == null)
			{
				return default(T);
			}
			else
			{
				var obj = JsonConvert.DeserializeObject<T>(value, _jsonSerializerSettings);
				return obj;
			}
		}
	}

	public class SynchronizedCache<V> where V : IEquatable<V>
	{
		public enum AddOrUpdateStatus
		{
			Added,
			Updated,
			Unchanged
		}

		private ReaderWriterLockSlim _cacheLock = new ReaderWriterLockSlim();
		private V _innerCache = default;

		public int Count
		{
			get { return _innerCache != default ? 1 : 0; }
		}

		public bool Any()
		{
			return _innerCache != default;
		}

		public V Read()
		{
			_cacheLock.EnterReadLock();
			try
			{
				return _innerCache;
			}
			finally
			{
				_cacheLock.ExitReadLock();
			}
		}

		public void Add(V value)
		{
			_cacheLock.EnterWriteLock();
			try
			{
				_innerCache = value;
			}
			finally
			{
				_cacheLock.ExitWriteLock();
			}
		}

		public bool AddWithTimeout(V value, int timeout)
		{
			if (_cacheLock.TryEnterWriteLock(timeout))
			{
				try
				{
					_innerCache = value;
				}
				finally
				{
					_cacheLock.ExitWriteLock();
				}
				return true;
			}
			else
			{
				return false;
			}
		}

		public bool ContainsValue(V value)
		{
			_cacheLock.EnterReadLock();
			try
			{
				return EqualityComparer<V>.Default.Equals(_innerCache, value);
			}
			finally
			{
				_cacheLock.ExitReadLock();
			}
		}

		public AddOrUpdateStatus AddOrUpdate(V value)
		{
			_cacheLock.EnterUpgradeableReadLock();
			try
			{
				V result = _innerCache;
				if (result != default)
				{
					if (!EqualityComparer<V>.Default.Equals(result, value))
					{
						return AddOrUpdateStatus.Unchanged;
					}
					else
					{
						_cacheLock.EnterWriteLock();
						try
						{
							_innerCache = value;
						}
						finally
						{
							_cacheLock.ExitWriteLock();
						}
						return AddOrUpdateStatus.Updated;
					}
				}
				else
				{
					_cacheLock.EnterWriteLock();
					try
					{
						_innerCache = value;
					}
					finally
					{
						_cacheLock.ExitWriteLock();
					}
					return AddOrUpdateStatus.Added;
				}
			}
			finally
			{
				_cacheLock.ExitUpgradeableReadLock();
			}
		}

		public void Delete()
		{
			_cacheLock.EnterWriteLock();
			try
			{
				_innerCache = default;
			}
			finally
			{
				_cacheLock.ExitWriteLock();
			}
		}

		~SynchronizedCache()
		{
			if (_cacheLock != null)
				_cacheLock.Dispose();
		}
	}
}
