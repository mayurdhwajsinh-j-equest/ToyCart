import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Navbar pop-in on load ──
export function useNavbarAnimation(navRef) {
  useEffect(() => {
    if (!navRef?.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".nav-left", { y: -30, opacity: 0, duration: 0.6, ease: "back.out(1.7)", delay: 0.1 });
      gsap.from(".nav-center li", { y: -20, opacity: 0, duration: 0.5, ease: "back.out(2)", stagger: 0.08, delay: 0.2 });
      gsap.from(".nav-right > *", { y: -20, opacity: 0, duration: 0.5, ease: "back.out(2)", stagger: 0.07, delay: 0.35 });
    }, navRef);
    return () => ctx.revert();
  }, []);
}

// ── Hero section bounce-in ──
export function useHeroAnimation(heroRef) {
  useEffect(() => {
    if (!heroRef?.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-title", { y: 60, opacity: 0, duration: 0.9, ease: "back.out(1.4)", delay: 0.2 });
      gsap.from(".hero-text p", { y: 40, opacity: 0, duration: 0.7, ease: "back.out(1.4)", delay: 0.45 });
      gsap.from(".hero-buttons button", { y: 30, opacity: 0, scale: 0.8, duration: 0.6, ease: "back.out(2)", stagger: 0.12, delay: 0.65 });
      gsap.from(".dinosaur-img", { x: 60, opacity: 0, rotation: 15, duration: 0.9, ease: "back.out(1.7)", delay: 0.3 });
      gsap.from(".closed-box", { y: -40, opacity: 0, scale: 0.8, duration: 0.9, ease: "bounce.out", delay: 0.5 });
    }, heroRef);
    return () => ctx.revert();
  }, []);
}

// ── Scroll-triggered section reveal ──
export function useScrollReveal() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section headings
      gsap.utils.toArray(".section-heading h4, .section-heading h2").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
          y: 40, opacity: 0, duration: 0.7, ease: "back.out(1.7)",
        });
      });

      // Product cards stagger
      gsap.utils.toArray(".fav-swiper .product-card, .related-swiper .product-card, .checkout-swiper .product-card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none none" },
          y: 50, opacity: 0, scale: 0.9, duration: 0.6, ease: "back.out(2)", delay: (i % 4) * 0.08,
        });
      });

      // Toy grid cards bounce
      gsap.utils.toArray(".toy-card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none none" },
          y: 50, opacity: 0, scale: 0.85, rotation: i % 2 === 0 ? -5 : 5,
          duration: 0.65, ease: "back.out(2)", delay: i * 0.07,
        });
      });

      // Text sections slide in
      gsap.utils.toArray(".safety-text, .sollicit-text, .commitment-text, .gift-text").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
          x: -50, opacity: 0, duration: 0.8, ease: "back.out(1.4)",
        });
      });

      // Images bounce in
      gsap.utils.toArray(".safety-img1, .sollicit-img1, .commitment-img1, .gift-img1").forEach((img) => {
        gsap.from(img, {
          scrollTrigger: { trigger: img, start: "top 85%", toggleActions: "play none none none" },
          y: 60, opacity: 0, scale: 0.85, duration: 0.9, ease: "back.out(1.7)",
        });
      });

      // Workflow steps
      gsap.utils.toArray(".workflow-steps li").forEach((li, i) => {
        gsap.from(li, {
          scrollTrigger: { trigger: li, start: "top 85%", toggleActions: "play none none none" },
          x: 50, opacity: 0, duration: 0.6, ease: "back.out(1.7)", delay: i * 0.1,
        });
      });

      // Sustainability section number count-up feel
      gsap.utils.toArray(".sustainability-section__top-img, .pdp-sustainability-section__top-img").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
          scale: 0.5, opacity: 0, duration: 1, ease: "elastic.out(1, 0.5)",
        });
      });

      // Action cards
      gsap.utils.toArray(".pdp-toy-actions .action-card, .checkout-actions .action-card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" },
          y: 60, opacity: 0, scale: 0.9, duration: 0.7, ease: "back.out(2)", delay: i * 0.12,
        });
      });

      // Openbox floating animals
      gsap.utils.toArray(".dinosaur-img1, .puppy-img, .beaver-img, .simpleFlamingo-img").forEach((img, i) => {
        gsap.from(img, {
          scrollTrigger: { trigger: img, start: "top 90%", toggleActions: "play none none none" },
          y: 80, opacity: 0, rotation: i % 2 === 0 ? -20 : 20,
          duration: 0.9, ease: "back.out(2)", delay: i * 0.1,
        });
        // Floating idle animation
        gsap.to(img, {
          y: "-=12", rotation: i % 2 === 0 ? "+=5" : "-=5",
          duration: 2 + i * 0.3, ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.4,
        });
      });
    });
    return () => ctx.revert();
  }, []);
}

// ── Button hover bounce ──
export function useButtonHover() {
  useEffect(() => {
    const buttons = document.querySelectorAll(
      ".btn-primary, .btn-outline, .btn-start, .addToCart, .addToToybox, .login-btn, .cta-btn-primary, .cta-btn-secondary, .see-all-btn"
    );
    const handlers = [];
    buttons.forEach((btn) => {
      const onEnter = () => gsap.to(btn, { scale: 1.08, duration: 0.2, ease: "back.out(3)" });
      const onLeave = () => gsap.to(btn, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.4)" });
      btn.addEventListener("mouseenter", onEnter);
      btn.addEventListener("mouseleave", onLeave);
      handlers.push({ btn, onEnter, onLeave });
    });
    return () => handlers.forEach(({ btn, onEnter, onLeave }) => {
      btn.removeEventListener("mouseenter", onEnter);
      btn.removeEventListener("mouseleave", onLeave);
    });
  }, []);
}

// ── Product card hover ──
export function useProductCardHover() {
  useEffect(() => {
    const observe = () => {
      const cards = document.querySelectorAll(".product-card");
      const handlers = [];
      cards.forEach((card) => {
        const onEnter = () => gsap.to(card, { y: -8, scale: 1.03, duration: 0.3, ease: "back.out(2)" });
        const onLeave = () => gsap.to(card, { y: 0, scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
        handlers.push({ card, onEnter, onLeave });
      });
      return handlers;
    };
    const handlers = observe();
    return () => handlers.forEach(({ card, onEnter, onLeave }) => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    });
  }, []);
}

// ── Alltoys grid stagger ──
export function useAlltoyAnimation(containerRef) {
  useEffect(() => {
    if (!containerRef?.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".products-grid .product-card-link", {
        y: 50, opacity: 0, scale: 0.9, duration: 0.55, ease: "back.out(2)", stagger: 0.06,
      });
    }, containerRef);
    return () => ctx.revert();
  });
}

// ── PDP hero bounce in ──
export function usePdpAnimation(ref) {
  useEffect(() => {
    if (!ref?.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-section__top-text", { y: -20, opacity: 0, duration: 0.5, ease: "back.out(2)" });
      gsap.from(".product-description__images", { x: -60, opacity: 0, duration: 0.8, ease: "back.out(1.7)", delay: 0.1 });
      gsap.from(".product-description__content", { x: 60, opacity: 0, duration: 0.8, ease: "back.out(1.7)", delay: 0.2 });
      gsap.from(".product-details__item", { y: 30, opacity: 0, duration: 0.5, ease: "back.out(2)", stagger: 0.1, delay: 0.4 });
    }, ref);
    return () => ctx.revert();
  }, []);
}

// ── Page transition (fade+slide up on mount) ──
export function usePageTransition(ref) {
  useEffect(() => {
    if (!ref?.current) return;
    gsap.from(ref.current, { y: 30, opacity: 0, duration: 0.6, ease: "power3.out", clearProps: "all" });
  }, []);
}
