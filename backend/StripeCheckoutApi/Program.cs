var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register Stripe service
builder.Services.AddScoped<StripeCheckoutApi.Services.StripeService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJsApp", builder =>
    {
        builder.WithOrigins("http://localhost:3000")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    
    // In development, allow requests from any origin for testing
    app.UseCors(builder => 
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader());
}
else
{
    // In production, use the specific CORS policy
    app.UseCors("AllowNextJsApp");
    
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
