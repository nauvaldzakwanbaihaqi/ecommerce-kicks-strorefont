// prisma/seed.ts
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🚀 Memulai proses seeding Produk & Kategori...");

  // ==========================================
  // 1. CLEANING DATABASE (HANYA HAPUS SEPATU & KATEGORI)
  // ==========================================
  console.log("🧹 Membersihkan database lama (Tabel User aman!)...");

  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();

  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // ==========================================
  // 2. SEED CATEGORIES
  // ==========================================
  console.log("📦 Seeding categories...");
  const categories = [
    { name: "Lifestyle Shoes", slug: "lifestyle", imageUrl: "/category-2.svg", color: "bg-[#ECEEF0]" },
    { name: "Basketball Shoes", slug: "basketball", imageUrl: "/category-1.svg", color: "bg-[#F6F6F6]" },
    { name: "Running Shoes", slug: "running", imageUrl: "/category-3.svg", color: "bg-[#E7E7E3]" },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const c = await prisma.category.create({ data: cat });
    createdCategories.push(c);
  }

  // ==========================================
  // 3. SEED PRODUCTS & VARIANTS
  // ==========================================
  console.log("👟 Seeding products...");
  const productData = [
    {
      name: "Adidas 4DFWD X Parley",
      description: "Hypebeast running sneaker with 3D printed midsole",
      price: 2500000,
      brand: "Adidas",
      categorySlug: "lifestyle",
      images: [
        "/shoes/1/1.svg",
        "/shoes/1/1-kaki.svg",
        "/shoes/1/1-depan.svg",
        "/shoes/1/1-belakang.svg"
      ]
    },
    {
      name: "Adidas 4DFWD 2 Running Shoes",
      description: "",
      price: 4200000,
      brand: "Adidas",
      categorySlug: "lifestyle",
      images: [
        "/shoes/2/2.svg",
        "/shoes/2/2-dpn.avif",
        "/shoes/2/2-atas.avif",
        "/shoes/2/2-belakang.avif"
      ]
    },
    {
      name: "Adidas Ultraboost 1.0",
      description: "Miami Hurricane",
      price: 2092000,
      brand: "Adidas",
      categorySlug: "lifestyle",
      images: [
        "/shoes/3/3.svg",
        "/shoes/3/3-depan.webp",
        "/shoes/3/3-bawah.webp",
        "/shoes/3/3-belakang.webp"
      ]
    },
    {
      name: "Adidas Ozelia Shadow",
      description: "Impact Orange Gray performance runner",
      price: 4200000,
      brand: "Adidas",
      categorySlug: "basketball",
      images: [
        "/shoes/4/4.svg",
        "/shoes/4/4-atas.jpg",
        "/shoes/4/4-bawah.jpg",
        "/shoes/4/4-samping.jpg"
      ]
    },
    {
      name: "Adidas Yeezy Boost 350 V2",
      description: "Carbon Beluga HQ7045",
      price: 1373000,
      brand: "Adidas",
      categorySlug: "lifestyle",
      images: [
        "/shoes/5/5.png",
        "/shoes/5/5-samping.webp",
        "/shoes/5/5-belakang.webp",
        "/shoes/5/5-bawah.webp"
      ]
    },
    {
      name: "Adidas Adizero Evo SL",
      description: "White Black JH6206",
      price: 2155000,
      brand: "Adidas",
      categorySlug: "running",
      images: [
        "/shoes/6/6-.png",
        "/shoes/6/6-samping.avif",
        "/shoes/6/6-atas.avif",
        "/shoes/6/6-bawah.avif",
      ]
    },
    {
      name: "Adidas Adizero Evo SL",
      description: "Lucid Lemon JR3416",
      price: 2208000,
      brand: "Adidas",
      categorySlug: "running",
      images: [
        "/shoes/7/7-.png",
        "/shoes/7/7-atas.avif",
        "/shoes/7/7-bawah.avif",
        "/shoes/7/7-samping.avif"
      ]
    },
    {
      name: "Fragment Design x Travis Scott",
      description: "Sail Military Blue DM7866-104",
      price: 18625000,
      brand: "Nike",
      categorySlug: "lifestyle",
      images: [
        "/shoes/8/8.avif",
        "/shoes/8/8-atas.avif",
        "/shoes/8/8-belakang.avif",
        "/shoes/8/8-samping.avif",
      ]
    },
    {
      name: "Nike Air Force 1 Low Off-White Black White",
      description: "The latest Nike Air Force 1 in collaboration with Virgil Abloh’s Off-White brand reemerges definitely one of the stars of the first drop in 2017. ",
      price: 21640000,
      brand: "Nike",
      categorySlug: "lifestyle",
      images: [
        "/shoes/9/9-.jpg",
        "/shoes/9/9-atas.jpg",
        "/shoes/9/9-depan.jpg",
        "/shoes/9/9-samping.jpg"
      ]
    },
    {
      name: "Nike SB Dunk Low The Powerpuff Girls Bubbles",
      description: "Fast forward to the upcoming holiday season of 2023, and we find Nike SB collaborating with The Powerpuff Girls to unveil a remarkable collection of Dunk Low sneakers. ",
      price: 20190000,
      brand: "Nike",
      categorySlug: "lifestyle",
      images: [
        "/shoes/10/10.png",
        "/shoes/10/10-bawah.webp",
        "/shoes/10/10-depan.webp",
        "/shoes/10/10-shoot.webp",
      ]
    },
    {
      name: "Nike Kobe 5 Protro 2K Gamer Exclusive",
      description: "",
      price: 20000000,
      brand: "Nike",
      categorySlug: "basketball",
      images: [
        "/shoes/11/11-.jpg",
      ]
    },
    {
      name: "Nike Kobe 8 Protro Lakers Home",
      description: "",
      price: 2590000,
      brand: "Nike",
      categorySlug: "basketball",
      images: [
        "/shoes/12/12-.webp",
        "/shoes/12/12-bawah.webp",
        "/shoes/12/12-samping.webp",
        "/shoes/12/12-belakang.webp",
      ]
    },
    {
      name: "Nike SB Dunk Low Supreme Rammellzee",
      description: "",
      price: 23890000,
      brand: "Nike",
      categorySlug: "lifestyle",
      images: [
        "/shoes/13/13.png",
        "/shoes/13/13-belakang.avif",
        "/shoes/13/13-depan.avif",
        "/shoes/13/13-samping.avif"
      ]
    },
    {
      name: "Air Jordan 3 Retro Levi's Lunar New Year",
      description: "This sneaker features a clean and modern design with a premium textile upper in a soft beige tone, giving it a natural and minimalist look. The shoe is accented with subtle suede overlays around the toe and heel for added texture and durability. A white midsole with a visible air unit provides lightweight cushioning and comfort for all-day wear. The gum rubber outsole enhances traction while adding a classic touch to the overall style. Finished with a red heel detail for contrast, this sneaker combines sporty performance with everyday casual appeal.",
      price: 3450000,
      brand: "Jordan",
      categorySlug: "basketball",
      images: [
        "/shoes/14/14.png",
        "/shoes/14/14-bawah.png",
        "/shoes/14/14-belakang.png",
        "/shoes/14/14-depan.png"
      ]
    },
    {
      name: "Air Jordan 7 Retro Cardinal (2022)",
      description: "This high-top basketball shoe features a clean white leather upper with perforations for breathability. The padded collar and supportive structure provide stability and comfort during play. A durable rubber outsole with strong traction ensures reliable grip on the court.",
      price: 500000,
      brand: "Jordan",
      categorySlug: "basketball",
      images: [
        "/shoes/15/15.png",
        "/shoes/15/15-bawah.png",
        "/shoes/15/15-belakang.png",
        "/shoes/15/15-depan.png"
      ]
    },
    {
      name: "Air Jordan 1 Retro Low OG Zion Williamson Voodoo Alternate Regency Purple",
      description: "This low-top sneaker features a textured canvas and suede upper in blue and purple tones for a unique, casual look. The padded collar and cushioned midsole provide comfort for everyday wear. A rubber outsole offers reliable traction and durability.",
      price: 2340000,
      brand: "Jordan",
      categorySlug: "lifestyle",
      images: [
        "/shoes/16/16.png",
        "/shoes/16/16-bawah.png",
        "/shoes/16/16-belakang.png",
        "/shoes/16/16-depan.png"
      ]
    },
    {
      name: "Air Jordan 4 Retro Black Cat (2025)",
      description: "This high-top sneaker features an all-black leather upper with mesh panels for a sleek and breathable design. The cushioned midsole with visible air unit provides comfort and impact protection. A durable rubber outsole delivers strong traction and stability on the court or street.",
      price: 3750000,
      brand: "Jordan",
      categorySlug: "basketball",
      images: [
        "/shoes/17/17.png",
        "/shoes/17/17-bawah.png",
        "/shoes/17/17-belakang.png",
        "/shoes/17/17-depan.png"
      ]
    },
    {
      name: "Puma Speedcat Metallic Silver Black",
      description: "This low-profile sneaker features a sleek silver upper with bold black accents for a sporty and modern look. The lightweight design and cushioned sole provide comfort for everyday wear. A durable rubber outsole ensures stable grip and long-lasting performance.",
      price: 1500000,
      brand: "Puma",
      categorySlug: "lifestyle",
      images: [
        "/shoes/18/18.png",
        "/shoes/18/18-depan.png"
      ]
    },
    {
      name: "Puma Speedcat OG Red White",
      description: "This low-profile Puma Speedcat features a vibrant red suede upper accented by a classic white formstrip and a sleek black rubber outsole. It showcases gold-foiled branding and a signature cat logo on the toe, emphasizing its motorsport-inspired heritage and style. The slim, aerodynamic silhouette makes it a perfect choice for those who appreciate a blend of racing performance and casual streetwear.",
      price: 1200000,
      brand: "Puma",
      categorySlug: "lifestyle",
      images: [
        "/shoes/19/19.png",
        "/shoes/19/19-bawah.png",
        "/shoes/19/19-belakang.png",
        "/shoes/19/19-depan.png"
      ]
    }

  ];

  for (const p of productData) {
    const category = createdCategories.find(c => c.slug === p.categorySlug);
    if (!category) continue;

    // 🔥 JURUS DUPLIKAT FOTO OTOMATIS 🔥
    // Kalau fotonya cuma 1, kita gandain jadi 4 foto yang sama
    const imagesToSave = p.images.length === 1
      ? [p.images[0], p.images[0], p.images[0], p.images[0]]
      : p.images;

    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        brand: p.brand,
        categoryId: category.id,
        images: {
          // Pake array gambar yang udah digandain tadi
          create: imagesToSave.map(url => ({ url }))
        },
        variants: {
          create: [38, 39, 40, 41, 42, 43, 44, 45].map(s => ({
            size: s,
            stock: 10,
            color: 'Standard'
          }))
        }
      }
    });
  }

  console.log("✅ Seed Selesai! Data sepatu seger, data User AMAN.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });