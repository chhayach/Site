import { useMemo, useState } from "react";

type IconName =
  | "arrow"
  | "bag"
  | "check"
  | "close"
  | "menu"
  | "search"
  | "sparkle";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    bag: (
      <>
        <path d="M5 8h14l-1 12H6L5 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    menu: <path d="M4 8h16M4 16h16" />,
    search: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 4 4" />
      </>
    ),
    sparkle: (
      <>
        <path d="m12 2 1.5 5.1L18 10l-4.5 2.9L12 18l-1.5-5.1L6 10l4.5-2.9L12 2Z" />
        <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
        {paths[name]}
      </g>
    </svg>
  );
}

const products = [
  {
    id: 1,
    name: "Notion Life OS",
    creator: "Studio Sunday",
    price: 24,
    category: "Templates",
    art: "art-notion",
    badge: "Bestseller",
  },
  {
    id: 2,
    name: "Grain & Glow Presets",
    creator: "Mara Wells",
    price: 18,
    category: "Presets",
    art: "art-presets",
    badge: "12 presets",
  },
  {
    id: 3,
    name: "Editorial Type Kit",
    creator: "Form Foundry",
    price: 32,
    category: "Fonts",
    art: "art-fonts",
    badge: "New",
  },
  {
    id: 4,
    name: "Soft Shapes Vol. 01",
    creator: "Studio Tilde",
    price: 16,
    category: "Graphics",
    art: "art-shapes",
    badge: "48 assets",
  },
  {
    id: 5,
    name: "Focus Flow Audio Pack",
    creator: "Low Key Labs",
    price: 12,
    category: "Audio",
    art: "art-audio",
    badge: "2.5 hours",
  },
  {
    id: 6,
    name: "Launch Week Playbook",
    creator: "Good Brief",
    price: 29,
    category: "E-books",
    art: "art-ebook",
    badge: "Pro guide",
  },
];

const categories = ["All", "Templates", "Presets", "Fonts", "Graphics", "Audio", "E-books"];

export default function App() {
  const [page, setPage] = useState<"home" | "product" | "checkout" | "tracking">("home");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<number[]>([]);
  const [orderItems, setOrderItems] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;
      const matchesQuery = `${product.name} ${product.creator} ${product.category}`
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const cartProducts = cart
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean) as typeof products;
  const cartTotal = cartProducts.reduce((sum, product) => sum + product.price, 0);

  function addToCart(id: number) {
    setCart((current) => [...current, id]);
  }

  function goHome() {
    setPage("home");
    setCartOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showProduct(id: number) {
    setSelectedProductId(id);
    setPage("product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0];
  const checkoutItems = cartProducts.length ? cartProducts : [selectedProduct];
  const subtotal = checkoutItems.reduce((sum, product) => sum + product.price, 0);
  const bundleDiscount = checkoutItems.length >= 2 ? 5 : 0;
  const checkoutTotal = subtotal - bundleDiscount;

  return (
    <div className="site-shell">
      <header className="header">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); goHome(); }} aria-label="Noli home">
          noli<span>.</span>
        </a>

        <nav className={`nav ${menuOpen ? "nav-open" : ""}`} aria-label="Main navigation">
          <a href="#shop" onClick={() => { setMenuOpen(false); goHome(); }}>Shop</a>
          <a href="#collections" onClick={() => { setMenuOpen(false); goHome(); }}>Collections</a>
          <a href="#sell" onClick={() => { setMenuOpen(false); goHome(); }}>Sell on Noli</a>
        </nav>

        <div className="header-actions">
          <button
            className="icon-button search-toggle"
            onClick={() => setSearchOpen((current) => !current)}
            aria-label="Search"
          >
            <Icon name="search" />
          </button>
          <button className="cart-button" onClick={() => setCartOpen(true)}>
            <Icon name="bag" />
            <span>Cart</span>
            <b>{cart.length}</b>
          </button>
          <button
            className="icon-button menu-button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label="Open menu"
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </header>

      {searchOpen && (
        <div className="search-bar">
          <Icon name="search" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search templates, fonts, presets..."
            aria-label="Search products"
          />
          <button onClick={() => { setSearchOpen(false); setQuery(""); }} aria-label="Close search">
            <Icon name="close" size={18} />
          </button>
        </div>
      )}

      {page === "home" && <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><Icon name="sparkle" size={16} /> Made by independent creators</div>
            <h1>Good ideas,<br /><em>ready to use.</em></h1>
            <p>
              A considered marketplace of digital tools, resources, and
              inspiration for doing your best work.
            </p>
            <a className="primary-cta" href="#shop">
              Explore the collection <Icon name="arrow" />
            </a>
            <div className="trust-line">
              <div className="avatars" aria-hidden="true">
                <span>AM</span><span>JL</span><span>KO</span>
              </div>
              <p>Loved by 12,000+ curious minds</p>
            </div>
          </div>

          <div className="hero-art" aria-label="Featured digital product: Creative Reset Workbook">
            <div className="sun-shape"></div>
            <div className="scribble">new<br />perspective</div>
            <div className="workbook">
              <span className="workbook-kicker">A guided workbook</span>
              <strong>THE<br />CREATIVE<br />RESET</strong>
              <span className="workbook-mark">Vol. 01 — NOLI</span>
            </div>
            <div className="hero-sticker">25<br /><small>pages</small></div>
            <div className="feature-caption">
              <div>
                <span>Featured this week</span>
                <strong>Creative Reset Workbook</strong>
              </div>
              <span>$14</span>
            </div>
          </div>
        </section>

        <section className="shop-section" id="shop">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Curated for you</span>
              <h2>Find your next favorite thing</h2>
            </div>
            <p>Thoughtfully made. Instantly yours.</p>
          </div>

          <div className="category-row" id="collections">
            {categories.map((category) => (
              <button
                key={category}
                className={activeCategory === category ? "active" : ""}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {visibleProducts.length > 0 ? (
            <div className="product-grid">
              {visibleProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <button className="product-open" onClick={() => showProduct(product.id)} aria-label={`View ${product.name}`}>
                  <div className={`product-art ${product.art}`}>
                    <span className="product-badge">{product.badge}</span>
                    {product.id === 1 && <div className="notion-window"><b>MY<br />LIFE OS</b><i>Plan less. Live more.</i></div>}
                    {product.id === 2 && <><div className="photo-panel one"></div><div className="photo-panel two"></div><span className="preset-word">GRAIN</span></>}
                    {product.id === 3 && <div className="type-poster"><b>Aa</b><span>Editorial<br />Collection</span></div>}
                    {product.id === 4 && <div className="shape-stack"><i></i><i></i><i></i></div>}
                    {product.id === 5 && <div className="audio-disc"><span></span></div>}
                    {product.id === 6 && <div className="ebook-cover"><small>GOOD BRIEF</small><b>LAUNCH<br />WEEK</b><i>A clear plan for shipping your thing.</i></div>}
                  </div>
                  </button>
                  <div className="product-info">
                    <div>
                      <h3>{product.name}</h3>
                      <p>by {product.creator}</p>
                    </div>
                    <strong>${product.price}</strong>
                  </div>
                  <button className="add-button" onClick={() => addToCart(product.id)}>
                    <span>Add to cart</span><Icon name="arrow" size={18} />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Icon name="search" size={28} />
              <h3>Nothing found just yet</h3>
              <p>Try a different keyword or browse all products.</p>
              <button onClick={() => { setQuery(""); setActiveCategory("All"); }}>Show everything</button>
            </div>
          )}
        </section>

        <section className="creator-section" id="sell">
          <div className="creator-art">
            <div className="creator-card card-one">PDF</div>
            <div className="creator-card card-two">Aa</div>
            <div className="creator-card card-three">PLAY</div>
          </div>
          <div className="creator-copy">
            <span className="section-kicker">Make something good?</span>
            <h2>Turn your knowledge<br />into your <em>next thing.</em></h2>
            <p>
              Open your Noli shop in minutes. We handle payments and delivery,
              so you can focus on creating.
            </p>
            <button className="secondary-cta">Start selling <Icon name="arrow" /></button>
          </div>
        </section>
      </main>}

      {page === "product" && (
        <main className="detail-page">
          <div className="breadcrumb">
            <button onClick={goHome}>Shop</button><span>/</span><button onClick={goHome}>{selectedProduct.category}</button><span>/</span><b>{selectedProduct.name}</b>
          </div>
          <section className="product-detail">
            <div className={`detail-art ${selectedProduct.art}`}>
              <span className="detail-float-tag">{selectedProduct.badge}</span>
              <div className="detail-preview">
                <span>{selectedProduct.category}</span>
                <strong>{selectedProduct.name}</strong>
                <i>by {selectedProduct.creator}</i>
              </div>
              <div className="detail-format">DIGITAL<br />DOWNLOAD</div>
            </div>
            <div className="detail-copy">
              <span className="section-kicker">{selectedProduct.category} · Instant access</span>
              <h1>{selectedProduct.name}</h1>
              <p className="detail-creator">Created by <b>{selectedProduct.creator}</b> · ★ 4.9 <span>(128 reviews)</span></p>
              <p className="detail-description">
                A thoughtful, ready-to-use digital resource designed to make your
                next project feel clearer, faster, and more considered.
              </p>
              <ul className="feature-list">
                <li><Icon name="check" size={17} /> Instant download after purchase</li>
                <li><Icon name="check" size={17} /> Lifetime access and free updates</li>
                <li><Icon name="check" size={17} /> Simple commercial-use license</li>
              </ul>
              <div className="license-box">
                <div><span>License</span><strong>Personal &amp; commercial use</strong></div>
                <span>Included</span>
              </div>
              <div className="detail-purchase">
                <strong>${selectedProduct.price}</strong>
                <span>One-time payment</span>
              </div>
              <div className="detail-actions">
                <button className="detail-cart" onClick={() => addToCart(selectedProduct.id)}>Add to cart</button>
                <button className="detail-buy" onClick={() => { if (!cart.length) addToCart(selectedProduct.id); setPage("checkout"); window.scrollTo(0, 0); }}>Buy now <Icon name="arrow" /></button>
              </div>
              <p className="secure-note"><Icon name="check" size={14} /> Secure checkout · 14-day money-back guarantee</p>
            </div>
          </section>
          <section className="detail-about">
            <div><span className="section-kicker">Inside your download</span><h2>Everything you need,<br /><em>nothing you don't.</em></h2></div>
            <div className="detail-specs">
              <div><span>Format</span><strong>PDF, ZIP &amp; source files</strong></div>
              <div><span>Compatibility</span><strong>Works on any modern device</strong></div>
              <div><span>Delivery</span><strong>Instant email &amp; account access</strong></div>
              <div><span>Support</span><strong>Creator support included</strong></div>
            </div>
          </section>
        </main>
      )}

      {page === "checkout" && (
        <main className="checkout-page">
          <div className="checkout-top">
            <button onClick={() => setPage("product")}><Icon name="arrow" /> Back</button>
            <div><span>Secure checkout</span><b>256-bit SSL encrypted</b></div>
          </div>
          <div className="checkout-layout">
            <section className="payment-panel">
              <span className="step-label">01 · Contact &amp; delivery</span>
              <h1>Complete your order</h1>
              <p>Your download link and receipt will be sent to this email.</p>
              <div className="checkout-fields">
                <label className="wide">Email address<input type="email" placeholder="you@example.com" defaultValue="alex@example.com" /></label>
                <label>First name<input placeholder="Alex" /></label>
                <label>Last name<input placeholder="Morgan" /></label>
                <label className="wide">Billing address<input placeholder="Street address" /></label>
                <label>City<input placeholder="City" /></label>
                <label>Postal code<input placeholder="Postal code" /></label>
              </div>

              <div className="payment-title">
                <div><span className="step-label">02 · Payment</span><h2>Choose how to pay</h2></div>
                <span>All major methods accepted</span>
              </div>
              <div className="payment-options">
                {[
                  ["card", "Credit / Debit Card", "Visa · Mastercard · Amex"],
                  ["upi", "UPI", "Google Pay · PhonePe · Paytm"],
                  ["netbanking", "Net Banking", "All major banks supported"],
                  ["wallet", "Wallets", "Amazon Pay · Mobikwik"],
                  ["paypal", "PayPal", "Pay with your PayPal account"],
                  ["cod", "Cash on Delivery", "Available for eligible orders"],
                ].map(([value, label, hint]) => (
                  <button
                    key={value}
                    className={paymentMethod === value ? "selected" : ""}
                    onClick={() => setPaymentMethod(value)}
                  >
                    <i>{paymentMethod === value && <span></span>}</i>
                    <div><strong>{label}</strong><small>{hint}</small></div>
                    <b>{value === "card" ? "VISA" : value === "upi" ? "UPI" : value === "paypal" ? "P" : "→"}</b>
                  </button>
                ))}
              </div>

              {paymentMethod === "card" && (
                <div className="card-fields">
                  <label>Card number<input placeholder="1234 5678 9012 3456" /></label>
                  <label>Expiry<input placeholder="MM / YY" /></label>
                  <label>CVV<input placeholder="123" /></label>
                </div>
              )}
              {paymentMethod === "upi" && (
                <div className="single-payment-field"><label>UPI ID<input placeholder="yourname@upi" /></label><button>Verify</button></div>
              )}
              {paymentMethod === "cod" && (
                <div className="payment-message">Cash on delivery is available. Your digital files will unlock once payment is confirmed.</div>
              )}
            </section>

            <aside className="order-summary">
              <span className="step-label">Your order</span>
              <h2>Payment summary</h2>
              <div className="summary-products">
                {checkoutItems.map((product, index) => (
                  <div className="summary-product" key={`${product.id}-${index}`}>
                    <div className={`summary-thumb ${product.art}`}></div>
                    <div><strong>{product.name}</strong><span>by {product.creator}</span><small>Qty 1 · Digital</small></div>
                    <b>${product.price}</b>
                  </div>
                ))}
              </div>
              <label className="promo-field"><input placeholder="Promo code" /><button>Apply</button></label>
              <div className="totals">
                <div><span>Subtotal</span><b>${subtotal}</b></div>
                <div><span>Bundle discount</span><b className="discount">−${bundleDiscount}</b></div>
                <div><span>Taxes</span><b>$0</b></div>
                <div className="grand-total"><span>Total</span><b>${checkoutTotal}</b></div>
              </div>
              <button
                className="place-order"
                onClick={() => {
                  setOrderItems(checkoutItems.map((product) => product.id));
                  setCart([]);
                  setPage("tracking");
                  window.scrollTo(0, 0);
                }}
              >
                Pay ${checkoutTotal} &amp; confirm order <Icon name="arrow" />
              </button>
              <p><Icon name="check" size={14} /> Secure payment · Instant confirmation</p>
            </aside>
          </div>
        </main>
      )}

      {page === "tracking" && (
        <main className="tracking-page">
          <section className="confirmation-hero">
            <div className="success-mark"><Icon name="check" size={32} /></div>
            <span className="section-kicker">Order confirmed</span>
            <h1>Your good idea is<br /><em>on its way.</em></h1>
            <p>Order <b>#NOL-28491</b> · A confirmation was sent to alex@example.com</p>
          </section>
          <div className="tracking-layout">
            <section className="delivery-card">
              <div className="delivery-head">
                <div><span className="step-label">Delivery status</span><h2>Preparing your downloads</h2></div>
                <b>In progress</b>
              </div>
              <div className="tracking-progress">
                {[
                  ["Order confirmed", "Payment received", true],
                  ["Files preparing", "Quality check in progress", true],
                  ["Ready to download", "Estimated in 2–5 minutes", false],
                  ["Delivered", "Sent to your email & account", false],
                ].map(([title, hint, done], index) => (
                  <div className={done ? "tracking-step done" : "tracking-step"} key={title as string}>
                    <i>{done ? <Icon name="check" size={15} /> : index + 1}</i>
                    <div><strong>{title}</strong><span>{hint}</span></div>
                  </div>
                ))}
              </div>
              <div className="delivery-notice"><Icon name="sparkle" /><div><strong>No shipping wait</strong><span>Your digital products are delivered securely to your Noli library.</span></div></div>
            </section>
            <aside className="tracking-summary">
              <span className="step-label">Order #NOL-28491</span>
              <h2>Order details</h2>
              {(orderItems.length ? orderItems : [selectedProductId]).map((id, index) => {
                const product = products.find((item) => item.id === id) ?? selectedProduct;
                return <div className="summary-product" key={`${id}-${index}`}><div className={`summary-thumb ${product.art}`}></div><div><strong>{product.name}</strong><span>{product.creator}</span></div><b>${product.price}</b></div>;
              })}
              <div className="tracking-total"><span>Total paid</span><strong>${orderItems.length ? orderItems.reduce((sum, id) => sum + (products.find((item) => item.id === id)?.price ?? 0), 0) - (orderItems.length >= 2 ? 5 : 0) : selectedProduct.price}</strong></div>
              <button onClick={goHome}>Continue shopping <Icon name="arrow" /></button>
              <a href="mailto:support@noli.market">Need help? Contact support</a>
            </aside>
          </div>
        </main>
      )}

      {page === "home" && <footer>
        <a className="brand footer-brand" href="#" onClick={(event) => { event.preventDefault(); goHome(); }}>noli<span>.</span></a>
        <p>Good things for curious minds.</p>
        <div><a href="#shop">Shop</a><a href="#sell">Sell</a><a href="#">Instagram</a></div>
        <span>© 2025 Noli Market</span>
      </footer>}

      {cartOpen && (
        <div className="cart-overlay" onMouseDown={() => setCartOpen(false)}>
          <aside className="cart-drawer" onMouseDown={(event) => event.stopPropagation()}>
            <div className="cart-header">
              <div><span>Your bag</span><h2>Instant downloads</h2></div>
              <button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close cart"><Icon name="close" /></button>
            </div>
            <div className="cart-items">
              {cartProducts.length === 0 ? (
                <div className="cart-empty">
                  <Icon name="bag" size={32} />
                  <h3>Your bag is ready for good ideas.</h3>
                  <p>Browse the collection and add something inspiring.</p>
                  <button onClick={() => setCartOpen(false)}>Keep browsing</button>
                </div>
              ) : (
                cartProducts.map((product, index) => (
                  <div className="cart-item" key={`${product.id}-${index}`}>
                    <div className={`cart-thumb ${product.art}`}></div>
                    <div><strong>{product.name}</strong><span>Digital download</span></div>
                    <b>${product.price}</b>
                    <button
                      onClick={() => setCart((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                      aria-label={`Remove ${product.name}`}
                    >
                      <Icon name="close" size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>
            {cartProducts.length > 0 && (
              <div className="cart-footer">
                <div><span>Total</span><strong>${cartTotal}</strong></div>
                <button onClick={() => { setCartOpen(false); setPage("checkout"); window.scrollTo(0, 0); }}>Checkout securely <Icon name="arrow" /></button>
                <p><Icon name="check" size={14} /> Instant access after purchase</p>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
