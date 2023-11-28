using System.Text.Encodings.Web;
using System.Text.Unicode;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All);
});

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

app.MapGet("api/order", () => "¶©µ¥·þÎñ")
    .WithName("order")
    .RequireAuthorization();

app.Run();