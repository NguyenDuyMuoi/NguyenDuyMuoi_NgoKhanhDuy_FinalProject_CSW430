using Microsoft.EntityFrameworkCore;
using TechStore.Api.Data;
using TechStore.Api.Helpers;

var builder = WebApplication.CreateBuilder(args);
UrlHelper.BaseUrl = builder.Configuration["BaseUrl"];
// Add DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", b =>
    {
        b.WithOrigins("http://localhost:3000") // cổng React
         .AllowAnyHeader()
         .AllowAnyMethod();
    });
});
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});



var app = builder.Build();
//app.UseCors(MyAllowSpecificOrigins);
app.UseCors("AllowReact");
app.UseRouting();
app.UseStaticFiles();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();
