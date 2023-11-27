using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using IdentityServer4.Extensions;
using Microsoft.Extensions.Configuration;

namespace IdentityServerWithSpaLogin;

/// <summary>
/// ids源的中间件
/// </summary>
public class IdentityServerOriginMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;

    /// <summary>
    /// 构造函数
    /// </summary>
    /// <param name="next"></param>
    /// <param name="configuration"></param>
    public IdentityServerOriginMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
        _configuration = configuration;
    }

    /// <summary>
    /// 调用
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    public async Task InvokeAsync(HttpContext context)
    {
        context.SetIdentityServerOrigin(_configuration["AuthServer:Authority"]);

        await _next(context);
    }
}

/// <summary>
/// ids源的中间件扩展
/// </summary>
public static class IdentityServerOriginMiddlewareExtensions
{
    /// <summary>
    /// 使用ids源的中间件
    /// </summary>
    /// <param name="builder"></param>
    /// <returns></returns>
    public static IApplicationBuilder UseIdentityServerOrigin(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<IdentityServerOriginMiddleware>();
    }
}