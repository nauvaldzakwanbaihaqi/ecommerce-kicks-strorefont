interface Product {
    id: string;
    name: string;
    price: number;
}

async function getProducts(): Promise<Product[]> {
    const res = await fetch("http://localhost:3000/api/products", {
        cache: "no-store"
    })
    if (!res.ok) {
        throw new Error("Gagal mengambil data produk");
    }
    return res.json()
}

export default async function ProductsPage() {
    const products = await getProducts()
    return (
        <div className="p-10 bg-slate min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-10 text-slate-900 text-center">
                    ALL PRODUCTS
                </h1>
                <div className="grid grid-cols-1 gap-6 p-8">
                    {products.map((p: Product) => (
                        <div key={p.id} className="group bg-white border border-slate-200 rounded-3xl p-5">
                            <h2>{p.name}</h2>
                            <p>Rp {p.price.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
