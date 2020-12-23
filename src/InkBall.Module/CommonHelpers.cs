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

		public static void RenderDependencyScripts(RazorPageBase page, IWebHostEnvironment env, IUrlHelper url, bool useMessagePackBinaryTransport)
		{
			page.WriteLiteral(@"<script nomodule src='https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.12.1/polyfill.min.js' integrity='sha512-uzOpZ74myvXTYZ+mXUsPhDF+/iL/n32GDxdryI2SJronkEyKC8FBFRLiBQ7l7U/PTYebDbgTtbqTa6/vGtU23A==' crossorigin='anonymous'></script>");
			if (env.IsDevelopment())
			{
				page.WriteLiteral($"<script src='{url.Content("~/lib/signalr/dist/browser/signalr.min.js")}'></script>");
				if (useMessagePackBinaryTransport)
				{
					page.WriteLiteral($"<script src='{url.Content("~/lib/msgpack5/dist/msgpack5.min.js")}'></script>");
					page.WriteLiteral($"<script src='{url.Content("~/lib/signalr-protocol-msgpack/dist/browser/signalr-protocol-msgpack.min.js")}'></script>");
				}
			}
			else
			{
				page.WriteLiteral(@"<script src='https://cdn.jsdelivr.net/npm/@microsoft/signalr@5.0.1/dist/browser/signalr.min.js' integrity='sha256-+rjfFXjblzn2o2pRhyBUXYY5C8gbBVszl5GHfeI8oZE=' crossorigin='anonymous'></script>");
				if (useMessagePackBinaryTransport)
				{
					page.WriteLiteral(@"<script src='https://cdn.jsdelivr.net/npm/msgpack5@4.4.0/dist/msgpack5.min.js' integrity='sha256-mY/RhkCJfd98j3c5s1EcUDJdRzffTeKzEzFIaI/2KQg=' crossorigin='anonymous'></script>");
					page.WriteLiteral(@"<script src='https://cdn.jsdelivr.net/npm/@microsoft/signalr-protocol-msgpack@5.0.1/dist/browser/signalr-protocol-msgpack.min.js' integrity='sha256-Vu6Oco+sYBWnny8L1WQ3xLzMAOUSIW362OHOnC9BrSc=' crossorigin='anonymous'></script>");
				}
			}
		}

		internal static void SetupHelpers(InkBallOptions options)
		{
			if (!string.IsNullOrEmpty(options.HeadElementsSectionName))
				HtmlHelpers.RenderHeaderSection = HtmlHelpers.HeaderRendererImpl;
		}
	}
}
