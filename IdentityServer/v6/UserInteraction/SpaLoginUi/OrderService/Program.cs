using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

CultureInfo.DefaultThreadCurrentCulture = new CultureInfo("zh-CN", true)
{
    DateTimeFormat = {
          ShortDatePattern = "yyyy-MM-dd",
          FullDateTimePattern = "yyyy-MM-dd HH:mm:ss",
          LongTimePattern = "HH:mm:ss"
        }
};

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services
    .AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        //options.Authority = "http://localhost:5000";
        options.Authority = "http://124.221.169.49:5000";
        options.Audience = "ms.shop";
        options.RequireHttpsMetadata = false;

        options.TokenValidationParameters.ValidateAudience = false;
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options => options.AddPolicy("DefaultPolicy", policyBuilder => policyBuilder
    .SetIsOriginAllowed(_ => true)
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("DefaultPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("api/order", () => "订单服务")
    .WithName("order")
    .RequireAuthorization();

app.Run();