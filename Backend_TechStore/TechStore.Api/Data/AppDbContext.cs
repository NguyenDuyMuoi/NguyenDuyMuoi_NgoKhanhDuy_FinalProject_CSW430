using Microsoft.EntityFrameworkCore;
using TechStore.Api.Models;

namespace TechStore.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // ===== DbSet =====
        public DbSet<User> Users { get; set; }
        public DbSet<HomeAddress> HomeAddresses { get; set; }

        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }

        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }

        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        public DbSet<Payment> Payments { get; set; }

        public DbSet<FlashSale> FlashSales { get; set; }
        public DbSet<FlashSaleItem> FlashSaleItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ===== USERS =====
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");

                entity.HasKey(u => u.Id);

                entity.Property(u => u.Name)
                      .HasMaxLength(100)
                      .IsRequired();

                entity.Property(u => u.Email)
                      .HasMaxLength(100)
                      .IsRequired();

                entity.Property(u => u.PasswordHash)
                      .IsRequired();

                entity.Property(u => u.Role)
                      .HasMaxLength(20)
                      .IsRequired();

                entity.Property(u => u.AvatarUrl)
                      .HasMaxLength(4000);

                entity.Property(u => u.IsActive)
                      .HasDefaultValue(true);

                entity.Property(u => u.CreatedAt)
                      .HasColumnType("datetime");

                entity.HasMany(u => u.HomeAddresses)
                      .WithOne(h => h.User)
                      .HasForeignKey(h => h.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(u => u.Orders)
                      .WithOne(o => o.User)
                      .HasForeignKey(o => o.UserId);

                entity.HasMany(u => u.Carts)
                      .WithOne(c => c.User)
                      .HasForeignKey(c => c.UserId);

                entity.HasMany(u => u.Payments)
                      .WithOne(p => p.User)
                      .HasForeignKey(p => p.UserId);
            });

            // ===== HOME ADDRESS =====
            modelBuilder.Entity<HomeAddress>(entity =>
            {
                entity.ToTable("HomeAddress");
                entity.HasKey(h => h.Id);

                entity.Property(h => h.FullName)
                      .HasMaxLength(100)
                      .IsRequired();

                entity.Property(h => h.Phone)
                      .HasMaxLength(20)
                      .IsRequired();

                entity.Property(h => h.Province)
                      .HasMaxLength(100)
                      .IsRequired();

                entity.Property(h => h.District)
                      .HasMaxLength(100)
                      .IsRequired();

                entity.Property(h => h.Ward)
                      .HasMaxLength(100)
                      .IsRequired();

                entity.Property(h => h.AddressLine)
                      .HasMaxLength(200)
                      .IsRequired();

                entity.Property(h => h.CreatedAt)
                      .HasColumnType("datetime");
            });

            // ===== PRODUCTS =====
            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("Products");
                entity.HasKey(p => p.Id);

                entity.Property(p => p.Name).HasMaxLength(200).IsRequired();
                entity.Property(p => p.Brand).HasMaxLength(200);
                entity.Property(p => p.Category).HasMaxLength(100);

                entity.Property(p => p.Description)
                      .HasColumnType("nvarchar(max)");

                entity.Property(p => p.OriginalPrice)
                      .HasColumnType("decimal(18,2)");

                entity.Property(p => p.FinalPrice)
                      .HasColumnType("decimal(18,2)");

                entity.Property(p => p.DiscountPercent)
                      .HasDefaultValue(0);

                entity.Property(p => p.Quantity)
                      .HasDefaultValue(0);

                entity.Property(p => p.IsActive)
                      .HasDefaultValue(true);

                entity.Property(p => p.CreatedAt)
                      .HasColumnType("datetime");

                // ⭐ FIX: cascade delete for images
                entity.HasMany(p => p.ProductImages)
                      .WithOne(i => i.Product)
                      .HasForeignKey(i => i.ProductId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(p => p.CartItems)
                      .WithOne(ci => ci.Product)
                      .HasForeignKey(ci => ci.ProductId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(p => p.OrderItems)
                      .WithOne(oi => oi.Product)
                      .HasForeignKey(oi => oi.ProductId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(p => p.FlashSaleItems)
                      .WithOne(fi => fi.Product)
                      .HasForeignKey(fi => fi.ProductId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
            //productimages
            modelBuilder.Entity<ProductImage>(entity =>
            {
                entity.ToTable("ProductImages");
                entity.HasKey(pi => pi.Id);

                entity.Property(pi => pi.ImageUrl)
                      .HasMaxLength(4000)
                      .IsRequired();

                entity.Property(pi => pi.CreatedAt)
                      .HasColumnType("datetime");

                // ⭐ Bổ sung đầy đủ quan hệ
                entity.HasOne(pi => pi.Product)
                      .WithMany(p => p.ProductImages)
                      .HasForeignKey(pi => pi.ProductId)
                      .OnDelete(DeleteBehavior.Cascade);
            });



            // ===== CART =====
            modelBuilder.Entity<Cart>(entity =>
            {
                entity.ToTable("Carts");
                entity.HasKey(c => c.Id);

                entity.Property(c => c.Status)
                      .HasMaxLength(20)
                      .IsRequired();

                entity.Property(c => c.CreatedAt)
                      .HasColumnType("datetime");
            });

            modelBuilder.Entity<CartItem>(entity =>
            {
                entity.ToTable("CartItems");

                // 🔥 KHÓA CHÍNH COMPOSITE (CartId + ProductId)
                entity.HasKey(ci => new { ci.CartId, ci.ProductId });

                entity.Property(ci => ci.UnitPrice)
                      .HasColumnType("decimal(18,2)");

                entity.Property(ci => ci.CreatedAt)
                      .HasColumnType("datetime");

                entity.HasOne(ci => ci.Cart)
                      .WithMany(c => c.CartItems)
                      .HasForeignKey(ci => ci.CartId);

                entity.HasOne(ci => ci.Product)
                      .WithMany(p => p.CartItems)
                      .HasForeignKey(ci => ci.ProductId);
            });


            // ===== ORDERS =====
            modelBuilder.Entity<Order>(entity =>
            {
                entity.ToTable("Orders");
                entity.HasKey(o => o.Id);

                entity.Property(o => o.TotalPrice)
                      .HasColumnType("decimal(18,2)");

                entity.Property(o => o.Status)
                      .HasMaxLength(50)
                      .IsRequired();

                entity.Property(o => o.CreatedAt)
                      .HasColumnType("datetime");

                entity.HasOne(o => o.User)
                      .WithMany(u => u.Orders)
                      .HasForeignKey(o => o.UserId);
            });

            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.ToTable("OrderItems");
                entity.HasKey(oi => oi.Id);

                entity.Property(oi => oi.UnitPrice)
                      .HasColumnType("decimal(18,2)");

                entity.Property(oi => oi.FinalPrice)
                      .HasColumnType("decimal(18,2)");

                entity.Property(oi => oi.CreatedAt)
                      .HasColumnType("datetime");

                entity.HasOne(oi => oi.Order)
                      .WithMany(o => o.OrderItems)
                      .HasForeignKey(oi => oi.OrderId);

                entity.HasOne(oi => oi.Product)
                      .WithMany(p => p.OrderItems)
                      .HasForeignKey(oi => oi.ProductId);
            });
            // ===== PAYMENTS =====
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.ToTable("Payments");
                entity.HasKey(p => p.Id);

                entity.Property(p => p.Amount)
                      .HasColumnType("decimal(18,2)");

                entity.Property(p => p.Method)
                      .HasMaxLength(50)
                      .IsRequired();

                entity.Property(p => p.Status)
                      .HasMaxLength(50)
                      .IsRequired();

                entity.Property(p => p.TransactionId)
                      .HasMaxLength(200);

                entity.Property(p => p.CreatedAt)
                      .HasColumnType("datetime");

                entity.HasOne(p => p.Order)
                      .WithMany(o => o.Payments)
                      .HasForeignKey(p => p.OrderId);

                entity.HasOne(p => p.User)
                      .WithMany(u => u.Payments)
                      .HasForeignKey(p => p.UserId);
            });

            // ===== FLASH SALE =====
            modelBuilder.Entity<FlashSale>(entity =>
            {
                entity.ToTable("FlashSales");
                entity.HasKey(fs => fs.Id);

                entity.Property(fs => fs.Name)
                      .HasMaxLength(100);

                entity.Property(fs => fs.Status)
                      .HasMaxLength(20)
                      .IsRequired();

                entity.Property(fs => fs.StartTime)
                      .HasColumnType("datetime");

                entity.Property(fs => fs.EndTime)
                      .HasColumnType("datetime");

                entity.Property(fs => fs.CreatedAt)
                      .HasColumnType("datetime");
            });

            modelBuilder.Entity<FlashSaleItem>(entity =>
            {
                entity.ToTable("FlashSaleItems");
                entity.HasKey(fi => fi.Id);

                entity.Property(fi => fi.FlashPrice)
                      .HasColumnType("decimal(18,2)");

                entity.Property(fi => fi.Status)
                      .HasMaxLength(20)
                      .IsRequired();

                entity.Property(fi => fi.CreatedAt)
                      .HasColumnType("datetime");

                entity.HasOne(fi => fi.FlashSale)
                      .WithMany(fs => fs.Items)    // sửa tại đây
                      .HasForeignKey(fi => fi.FlashSaleId);

                entity.HasOne(fi => fi.Product)
                      .WithMany(p => p.FlashSaleItems)
                      .HasForeignKey(fi => fi.ProductId);
            });

        }
    }
}
