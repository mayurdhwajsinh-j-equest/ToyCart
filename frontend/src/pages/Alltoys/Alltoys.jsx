import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Actioncard from "../../components/Actioncard/Actioncard.jsx";
import arrow from "../../assets/arrow.svg";
import "./Alltoys.css";
import fanimg1 from "../../../public/images/fan-img1.jpg";
import fanimg2 from "../../../public/images/fan-img2.png";
import fanimg3 from "../../../public/images/fan-img3.png";
import fanimg4 from "../../../public/images/fan-img4.png";
import fanimg5 from "../../../public/images/fan-img5.png";
import fanimg6 from "../../../public/images/fan-img6.png";
import fanimg7 from "../../../public/images/fan-img7.png";
import fanimg8 from "../../../public/images/fan-img8.png";
import navprev from "../../assets/nav-prev.svg";
import navnext from "../../assets/nav-next.svg";
import Productcard, { SkeletonCard } from "../../components/Productcard/Productcard.jsx";
import APIService from "../../services/api";

const SORT_OPTIONS = [
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating",     label: "Top Rated" },
  { value: "newest",     label: "Newest" },
];

const PAGE_LIMIT = 12;

const FAN_ITEMS = [
  { type: "photo",      span: "tall",   img: fanimg1, alt: "Fan 1" },
  { type: "photo",      span: "tall",   img: fanimg2, alt: "Fan 2" },
  { type: "review",     span: "normal", title: "Thank you whirli!!", text: "It's been wonderful for my three kids to play with so many different toys in such an environmentally friendly and cost effective way.", name: "– Jessica Lucey, Mum of three" },
  { type: "review",     span: "normal", title: "What a great idea!",  text: "Children get bored of toys so quickly and we were able to send back and get different toys whenever we wanted easily. Their customer service is also 10/10...", name: "– Jennifer Mello, Mum of two" },
  { type: "photo",      span: "tall",   img: fanimg3, alt: "Fan 3" },
  { type: "review",     span: "normal", title: "What a great idea!",  text: "Children get bored of toys so quickly and we were able to send back and get different toys whenever we wanted easily. Their customer service is also 10/10...", name: "– Jennifer Mello, Mum of two" },
  { type: "review",     span: "normal", title: "Absolutely love it!", text: "My daughter plays for hours every day. The quality is amazing and the variety keeps her engaged. Best purchase we've made this year.", name: "– Sarah Thompson, Mum of one" },
  { type: "photo",      span: "normal", img: fanimg4, alt: "Fan 4" },
  { type: "photo",      span: "normal", img: fanimg5, alt: "Fan 5" },
  { type: "trustpilot", span: "normal" },
  { type: "photo",      span: "normal", img: fanimg6, alt: "Fan 6" },
  { type: "review",     span: "normal", title: "What a great idea!",  text: "Children get bored of toys so quickly and we were able to send back and get different toys whenever we wanted easily. Their customer service is also 10/10...", name: "– Jennifer Mello, Mum of two" },
  { type: "review",     span: "normal", title: "So impressed!",       text: "The selection is incredible, toys arrived quickly and in perfect condition. Our kids have never been happier.", name: "– Mark & Lisa, Parents of three" },
  { type: "photo",      span: "tall",   img: fanimg7, alt: "Fan 7" },
  { type: "photo",      span: "tall",   img: fanimg8, alt: "Fan 8" },
];

const COL_W = 212;

function FanSection() {
  const trackRef    = useRef(null);
  const viewportRef = useRef(null);
  const [offset,    setOffset]    = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);

  useEffect(() => {
    const calc = () => {
      if (trackRef.current && viewportRef.current) {
        setMaxOffset(Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth));
      }
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const slide = (dir) => {
    setOffset((prev) => Math.max(0, Math.min(prev + dir * COL_W * 2, maxOffset)));
  };

  return (
    <section className="fan-section">
      <div className="fan-section__header">
        <h2 className="fan-section__title">Our smallest fans</h2>
        <div className="fan-nav">
          <button
            className="nav-btn"
            onClick={() => slide(-1)}
            disabled={offset === 0}
            aria-label="Previous"
            data-tooltip="Previous"
          >
            <img src={navprev} alt="prev" />
          </button>
          <button
            className="nav-btn"
            onClick={() => slide(1)}
            disabled={offset >= maxOffset}
            aria-label="Next"
            data-tooltip="Next"
          >
            <img src={navnext} alt="next" />
          </button>
        </div>
      </div>

      <div className="fan-slider-viewport" ref={viewportRef}>
        <div
          className="fan-slider-track"
          ref={trackRef}
          style={{ transform: `translateX(-${offset}px)` }}
        >
          {FAN_ITEMS.map((item, i) => {
            const spanClass = item.span === "tall" ? "fan-card--tall" : "fan-card--normal";

            if (item.type === "photo") return (
              <div key={i} className={`fan-photo-card ${spanClass}`}>
                <img src={item.img} alt={item.alt} />
              </div>
            );

            if (item.type === "trustpilot") return (
              <div key={i} className={`fan-review-card fan-review-card--trustpilot ${spanClass}`}>
                <div className="fan-trustpilot-logo">
                  <span className="fan-trustpilot-star">★</span>
                  Trustpilot
                </div>
              </div>
            );

            return (
              <div key={i} className={`fan-review-card ${spanClass}`}>
                <div className="fan-stars">★★★★★</div>
                <p className="fan-review-title">{item.title}</p>
                <p className="fan-review-text">{item.text}</p>
                <p className="fan-review-name">{item.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Alltoys() {
  const location = useLocation();
  const navigate = useNavigate();

  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error,       setError]       = useState("");
  const [totalCount,  setTotalCount]  = useState(0);
  const [filterOpen,  setFilterOpen]  = useState(false);
  const [sortOpen,    setSortOpen]    = useState(false);
  const [page,        setPage]        = useState(1);
  const [hasMore,     setHasMore]     = useState(false);
  const [filters, setFilters] = useState({ search: "", category: "", minPrice: "", maxPrice: "", rating: "", availability: "" });
  const [sort,    setSort]    = useState("");
  const [applied, setApplied] = useState({});

  const filterRef = useRef(null);
  const sortRef   = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || "";
    if (q) setFilters((prev) => ({ ...prev, search: q }));
  }, [location.search]);

  useEffect(() => {
    APIService.getCategories?.()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPage(1);
    fetchProducts(1, false);
  }, [applied, sort]);

  const fetchProducts = async (currentPage = 1, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError("");

      const params = { page: currentPage, limit: PAGE_LIMIT };
      if (applied.search)       params.search       = applied.search;
      if (applied.category)     params.category     = applied.category;
      if (applied.minPrice)     params.minPrice     = applied.minPrice;
      if (applied.maxPrice)     params.maxPrice     = applied.maxPrice;
      if (applied.rating)       params.rating       = applied.rating;
      if (applied.availability) params.availability = applied.availability;
      if (sort)                 params.sort         = sort;

      const data  = await APIService.getProducts(params);
      const list  = Array.isArray(data) ? data : (data.products || []);
      const total = data?.pagination?.total ?? list.length;
      const nowLoaded = append ? (currentPage * PAGE_LIMIT) : list.length;

      setHasMore(nowLoaded < total);
      setProducts((prev) => append ? [...prev, ...list] : list);
      setTotalCount(total);
    } catch {
      setError("Unable to load toys right now.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
      if (sortRef.current   && !sortRef.current.contains(e.target))   setSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleApplyFilters = () => { setApplied({ ...filters }); setFilterOpen(false); };
  const handleClearFilters = () => {
    const empty = { search: "", category: "", minPrice: "", maxPrice: "", rating: "", availability: "" };
    setFilters(empty); setApplied(empty); setSort("");
    navigate("/Alltoys", { replace: true });
  };
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, true);
  };

  const activeFilterCount = Object.values(applied).filter(Boolean).length;
  const currentSortLabel  = sort ? SORT_OPTIONS.find((o) => o.value === sort)?.label : "Sort by";

  return (<>
    <section className="hero">
      <div className="hero-content">
        <p className="hero-content__p1">Browse toys <span><img src={arrow} alt="arrow" className="arrow-icon" /></span> All toys</p>
        <h1 className="hero-content__h1">All toys</h1>
        <p className="hero-content__p2">Nam leo porta sit id aliquam in lobortis vitae consequat. Massa purus orci volutpat duis parturient.</p>
      </div>
    </section>

    <section className="product-section">
      <div className="at-toolbar">
        <div className="at-toolbar-left" ref={filterRef}>
          <button className={`at-filter-btn ${activeFilterCount > 0 ? "at-filter-btn--active" : ""}`}
            onClick={() => { setFilterOpen((p) => !p); setSortOpen(false); }}>
            <span className="at-filter-icon">⚙</span>
            Filter
            {activeFilterCount > 0 && <span className="at-filter-badge">{activeFilterCount}</span>}
          </button>
          {filterOpen && (
            <div className="at-filter-panel">
              <div className="at-filter-header">
                <h3>Filters</h3>
                <button className="at-filter-close" onClick={() => setFilterOpen(false)}>✕</button>
              </div>
              <div className="at-filter-body">
                <div className="at-filter-group">
                  <label>Search</label>
                  <input type="text" placeholder="Search toys..." value={filters.search}
                    onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))} />
                </div>
                <hr className="at-filter-divider" />
                {categories.length > 0 && (
                  <div className="at-filter-group">
                    <label>Category</label>
                    <select value={filters.category} onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}>
                      <option value="">All categories</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                )}
                <hr className="at-filter-divider" />
                <div className="at-filter-group">
                  <label>Price Range (₹)</label>
                  <div className="at-price-row">
                    <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => setFilters((p) => ({ ...p, minPrice: e.target.value }))} />
                    <span>–</span>
                    <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => setFilters((p) => ({ ...p, maxPrice: e.target.value }))} />
                  </div>
                </div>
                <hr className="at-filter-divider" />
                <div className="at-filter-group">
                  <label>Min Rating</label>
                  <div className="at-rating-options">
                    {[4, 3, 2, 1].map((r) => (
                      <button key={r} className={`at-rating-opt ${filters.rating == r ? "at-rating-opt--active" : ""}`}
                        onClick={() => setFilters((p) => ({ ...p, rating: p.rating == r ? "" : r }))}>
                        {"★".repeat(r)}<br />& up
                      </button>
                    ))}
                  </div>
                </div>
                <hr className="at-filter-divider" />
                <div className="at-filter-group">
                  <label>Availability</label>
                  <div className="at-avail-options">
                    {[{ value: "in_stock", label: "✓ In Stock" }, { value: "out_of_stock", label: "✕ Out of Stock" }].map((opt) => (
                      <button key={opt.value} className={`at-avail-opt ${filters.availability === opt.value ? "at-avail-opt--active" : ""}`}
                        onClick={() => setFilters((p) => ({ ...p, availability: p.availability === opt.value ? "" : opt.value }))}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="at-filter-actions">
                <button className="at-clear-btn" onClick={handleClearFilters}>Clear All</button>
                <button className="at-apply-btn" onClick={handleApplyFilters}>Apply Filters</button>
              </div>
            </div>
          )}
        </div>

        <p className="at-results-count">
          {!loading && totalCount > 0 && (<>
            Showing {products.length} of {totalCount} toy{totalCount !== 1 ? "s" : ""}
            {activeFilterCount > 0 && <button className="at-clear-link" onClick={handleClearFilters}>Clear filters</button>}
          </>)}
        </p>

        <div className="at-toolbar-right" ref={sortRef}>
          <button className={`at-sort-btn ${sort ? "at-sort-btn--active" : ""}`}
            onClick={() => { setSortOpen((p) => !p); setFilterOpen(false); }}>
            {currentSortLabel} <span className="at-sort-icon">↕</span>
          </button>
          {sortOpen && (
            <div className="at-sort-panel">
              {SORT_OPTIONS.map((opt) => (
                <button key={opt.value} className={`at-sort-option ${sort === opt.value ? "at-sort-option--active" : ""}`}
                  onClick={() => { setSort(opt.value); setSortOpen(false); }}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="product-section__content">
        {loading && [...Array(PAGE_LIMIT)].map((_, i) => <SkeletonCard key={i} />)}
        {error && !loading && <p style={{ gridColumn: "1/-1", color: "#c00", textAlign: "center" }}>{error}</p>}
        {!loading && !error && products.length === 0 && (
          <div className="at-empty">
            <p>🧸 No toys found. <button className="at-clear-link" onClick={handleClearFilters}>Clear filters</button></p>
          </div>
        )}
        {!loading && products.map((product) => (
          <Productcard key={product.id} id={product.id} ProductImage={product.image_url}
            ProductName={product.name} Price={product.price} rating={product.rating}
            reviewCount={product.number_of_reviews} isNew={product.is_new} />
        ))}
      </div>

      <div className="at-load-more-wrap">
        {hasMore && !loadingMore && (
          <button className="at-load-more-btn" onClick={handleLoadMore}>Load More Toys 🧸</button>
        )}
        {loadingMore && (
          <div className="at-load-more-spinner">
            <div className="at-spinner" />
            <span>Loading more toys...</span>
          </div>
        )}
        {!hasMore && !loading && products.length > 0 && (
          <p className="at-all-loaded">🎉 You've seen all {totalCount} toys!</p>
        )}
      </div>
    </section>

    <FanSection />

    <section className="toy-actions">
      <Actioncard title="Buy this toy new and pre-loved" text="Nam leo porttitor sit aliquam in lobortis vitae consequat." button="Buy this toy" variant="yellow" />
      <Actioncard title="Sell a toy like this back to Whirli" text="Placerat sollicitudin faucibus egestas viverra, cursus nascetur fermentum nam." button="Sell this toy back" variant="white" />
      <Actioncard title="Gift this toy with a Whirli subscription" text="Porta sit id aliquam in lobortis vitae consequat." button="Gift this toy" variant="pink" />
    </section>
  </>);
}

export default Alltoys;
