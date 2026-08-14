# Kicks Storefront

Fullstack sneakers e-commerce storefront — dari katalog produk dengan varian (ukuran & warna), keranjang belanja, wishlist, checkout, sampai dashboard admin yang dilindungi role-based access.

**Live demo:** [ecommerce-kicks-strorefont.vercel.app](https://ecommerce-kicks-strorefont.vercel.app)

---

## Tech Stack

| Layer | Teknologi | Catatan |
|---|---|---|
| Framework | Next.js 16 (App Router) + React 19 | |
| Database | PostgreSQL | via Prisma 7 dengan `@prisma/adapter-pg` (driver adapter, bukan default query engine) |
| Auth | NextAuth.js v4 | role-based middleware (`USER` / `ADMIN`), password di-hash dengan `bcrypt` |
| Validation | Zod | |
| UI | Tailwind CSS v4, Radix UI, shadcn/ui | |
| Animasi & UX | Framer Motion, Lenis (smooth scroll) | |
| Lainnya | Sonner (toast), next-themes (dark/light mode) | |

> Catatan arsitektur: project ini pakai `@prisma/adapter-pg` alih-alih koneksi default Prisma. Artinya koneksi ke Postgres lewat driver `pg` langsung — pilihan yang relevan kalau target deploy-nya edge runtime atau serverless environment yang butuh connection pooling lebih eksplisit (misal Neon/Supabase).

## Fitur Utama

- **Katalog produk** — produk dikelompokkan per kategori, tiap produk punya banyak gambar dan varian (kombinasi ukuran + warna) dengan stok terpisah per varian.
- **Cart & Wishlist** — tersimpan per user di database (bukan localStorage), jadi konsisten lintas device.
- **Checkout & Order tracking** — status order (`PENDING → PAID → SHIPPED → DONE / CANCELLED`) terpisah dari status pembayaran (`PENDING / SUCCESS / FAILED`), plus alamat pengiriman per order.
- **Review produk** — rating & komentar per user per produk.
- **Autentikasi & otorisasi** — login via NextAuth, dengan middleware yang menjaga route `/admin`, `/dashboard`, dan `/profile`. User dengan role selain `ADMIN` yang coba akses halaman admin otomatis di-redirect.
- **Dark/Light mode** dan micro-interaction (Framer Motion + Lenis) untuk pengalaman browsing yang lebih halus.

## Struktur Proyek

```
app/            # Routes & pages (Next.js App Router)
components/     # Reusable UI components (termasuk shadcn/ui)
lib/            # Utilities, konfigurasi (auth, prisma client, dll)
prisma/         # Schema database & migrations
public/         # Static assets
types/          # TypeScript type definitions
middleware.ts   # Route protection berbasis role (admin/dashboard/profile)
```

## Skema Database (ringkas)

Entitas inti: `User`, `Category`, `Product` → `ProductImage` & `ProductVariant`, lalu `Cart`/`CartItem`, `Wishlist`/`WishlistItem`, `Order`/`OrderItem` → `Payment` & `ShippingAddress`, dan `Review`.

Poin desain yang perlu dipahami sebelum kontribusi:
- Stok **tidak** disimpan di level `Product`, tapi di `ProductVariant` (kombinasi size + color). Ini penting supaya pengecekan stok saat checkout selalu merujuk ke varian, bukan produk induk.
- `Order` dan `Payment` dipisah 1-to-1 tapi berdiri sendiri — memudahkan kalau nanti mau ganti/tambah payment gateway tanpa mengubah struktur order.

Lihat detail lengkap di [`prisma/schema.prisma`](./prisma/schema.prisma).

## Getting Started

### 1. Clone & install dependencies

```bash
git clone https://github.com/nauvaldzakwanbaihaqi/ecommerce-kicks-strorefont.git
cd ecommerce-kicks-strorefont
pnpm install
```

### 2. Setup environment variables

Buat file `.env` di root project:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/kicks_db"
NEXTAUTH_SECRET="generate-dengan-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Migrasi database

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Jalankan development server

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Fungsi |
|---|---|
| `pnpm dev` | Menjalankan development server |
| `pnpm build` | `prisma generate` lalu build production (Next.js) |
| `pnpm start` | Menjalankan production server |
| `pnpm lint` | Menjalankan ESLint |

## Roadmap / Ide Pengembangan

- [ ] Integrasi payment gateway (Midtrans/Xendit) ke model `Payment`
- [ ] Server-side pagination & filtering untuk katalog produk
- [ ] Test coverage (unit test untuk logic checkout & stock validation)
- [ ] Rate limiting di API routes autentikasi

## Kontribusi

Pull request dan issue sangat terbuka. Untuk perubahan besar (terutama yang menyentuh `prisma/schema.prisma`), mohon buka issue dulu untuk didiskusikan.

## Lisensi

Belum ditentukan — tambahkan file `LICENSE` sesuai kebutuhan (MIT direkomendasikan untuk project open-source seperti ini).
