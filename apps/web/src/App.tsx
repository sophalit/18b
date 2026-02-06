import { useState, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface Product {
  id: number;
  title: string;
  priceCents: number;
  imageUrl: string | null;
}

interface CartItem {
  productId: number;
  qty: number;
  title: string;
  priceCents: number;
}

interface OrderResponse {
  id: number;
  totalCents: number;
  status: string;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    // Check if running inside Telegram
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initData) {
      setIsTelegram(true);
      tg.ready();
      tg.expand();
    }

    // Load products
    fetch(`${API_URL}/products`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setStatus("មិនអាចផ្ទុក products បានទេ");
        setLoading(false);
      });
  }, []);

  const addToCart = useCallback(
    (product: Product) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.productId === product.id);
        if (existing) {
          return prev.map((i) =>
            i.productId === product.id ? { ...i, qty: i.qty + 1 } : i
          );
        }
        return [
          ...prev,
          {
            productId: product.id,
            qty: 1,
            title: product.title,
            priceCents: product.priceCents,
          },
        ];
      });
    },
    []
  );

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing && existing.qty > 1) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, qty: i.qty - 1 } : i
        );
      }
      return prev.filter((i) => i.productId !== productId);
    });
  }, []);

  const totalCents = cart.reduce(
    (sum, item) => sum + item.priceCents * item.qty,
    0
  );

  const checkout = async () => {
    if (cart.length === 0) {
      setStatus("កន្ត្រក ទទេ!");
      return;
    }

    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) {
      setStatus("សូមបើកក្នុង Telegram ដើម្បី checkout");
      return;
    }

    setStatus("កំពុង​ដំណើរការ...");

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-telegram-init-data": initData,
        },
        body: JSON.stringify({
          items: cart.map((i) => ({ productId: i.productId, qty: i.qty })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setStatus(`Error: ${err.error}`);
        return;
      }

      const order: OrderResponse = await res.json();
      setStatus(`✅ Order #${order.id} ត្រូវបានបង្កើត! សរុប: $${(order.totalCents / 100).toFixed(2)}`);
      setCart([]);

      // Send order data back to bot
      try {
        window.Telegram.WebApp.sendData(
          JSON.stringify({ orderId: order.id, totalCents: order.totalCents })
        );
      } catch (sendErr) {
        console.warn("sendData failed (expected outside keyboard-launched webapps):", sendErr);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setStatus("❌ Checkout failed. សូមព្យាយាមម្ដងទៀត។");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-500">កំពុងផ្ទុក...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 pb-32">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">🛒 Mini App Shop</h1>
        <p className="text-gray-500 text-sm mt-1">
          ជ្រើសរើស products ហើយ checkout!
        </p>
        {!isTelegram && (
          <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
            ⚠️ សូមបើកក្នុង Telegram ដើម្បី authenticate។
            <br />
            Open in Telegram to authenticate.
          </div>
        )}
      </div>

      {/* Products */}
      <div className="space-y-3 mb-6">
        <h2 className="text-lg font-semibold text-gray-700">📦 Products</h2>
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow p-4 flex items-center gap-4"
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{product.title}</h3>
              <p className="text-blue-600 font-semibold">
                ${(product.priceCents / 100).toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 active:bg-blue-700"
            >
              + បន្ថែម
            </button>
          </div>
        ))}
      </div>

      {/* Cart */}
      {cart.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            🛒 កន្ត្រក ({cart.reduce((s, i) => s + i.qty, 0)} items)
          </h2>
          <div className="bg-white rounded-lg shadow divide-y">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="p-3 flex items-center justify-between"
              >
                <div>
                  <span className="font-medium">{item.title}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    x{item.qty}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-semibold">
                    ${((item.priceCents * item.qty) / 100).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-500 text-sm px-2 py-1 hover:bg-red-50 rounded"
                  >
                    −
                  </button>
                </div>
              </div>
            ))}
            <div className="p-3 flex items-center justify-between font-bold">
              <span>សរុប</span>
              <span className="text-blue-600">
                ${(totalCents / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Button */}
      <button
        onClick={checkout}
        disabled={cart.length === 0}
        className={`w-full py-3 rounded-lg font-semibold text-white text-lg ${
          cart.length === 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600 active:bg-green-700"
        }`}
      >
        💳 Checkout
      </button>

      {/* Status */}
      {status && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-center text-sm">
          {status}
        </div>
      )}
    </div>
  );
}

export default App;
