using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace InkBall.Module
{
	#region Old code

	/*public static class SessionExtensions
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
	}*/

	#endregion Old code

	public class SynchronizedCache<V> : IDisposable
		where V : IEquatable<V>
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
			get { return EqualityComparer<V>.Default.Equals(_innerCache, default) ? 0 : 1; }
		}

		public V Value
		{
			get
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
		}

		public bool Any()
		{
			return !EqualityComparer<V>.Default.Equals(_innerCache, default);
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
				if (!EqualityComparer<V>.Default.Equals(result, default))
				{
					if (EqualityComparer<V>.Default.Equals(result, value))
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

		#region IDisposable Support
		private bool disposedValue = false; // To detect redundant calls

		protected virtual void Dispose(bool disposing)
		{
			if (!disposedValue)
			{
				if (disposing)
				{
					// TODO: dispose managed state (managed objects).

					if (_cacheLock != null)
						_cacheLock.Dispose();
				}

				// TODO: free unmanaged resources (unmanaged objects) and override a finalizer below.
				// TODO: set large fields to null.

				disposedValue = true;
			}
		}

		// TODO: override a finalizer only if Dispose(bool disposing) above has code to free unmanaged resources.
		// ~SynchronizedCache() {
		//   // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
		//   Dispose(false);
		// }

		// This code added to correctly implement the disposable pattern.
		public void Dispose()
		{
			// Do not change this code. Put cleanup code in Dispose(bool disposing) above.
			Dispose(true);
			// TODO: uncomment the following line if the finalizer is overridden above.
			// GC.SuppressFinalize(this);
		}
		#endregion
	}

	public static class HtmlHelpers
	{
		public static Action<RazorPageBase, IUrlHelper, IOptions<InkBallOptions>> RenderHeaderSection = HeaderRendererDummy;

		static void HeaderRendererDummy(RazorPageBase page, IUrlHelper url, IOptions<InkBallOptions> options)
		{
		}

		static void HeaderRendererImpl(RazorPageBase page, IUrlHelper url, IOptions<InkBallOptions> options)
		{
			page.DefineSection(options.Value.HeadElementsSectionName, () =>
			{
				page.WriteLiteral($"<link rel='stylesheet' href='{url.Content(Constants.WwwIncludeCSS)}' />");

				return Task.CompletedTask;
			});
		}

		internal static void SetupHelpers(InkBallOptions options)
		{
			if (!string.IsNullOrEmpty(options.HeadElementsSectionName))
				HtmlHelpers.RenderHeaderSection = HtmlHelpers.HeaderRendererImpl;
		}
	}
}
