import { useEffect, useRef, useState } from "react";
import "./header-menu.css";

const OPEN = "styles_open__X9ppk";

type MenuLink = { title: string; description: string; href: string };

const MENU_GROUPS: { label: string; links: MenuLink[] }[] = [
  {
    label: "Products",
    links: [
      { title: "Mindenity App", description: "Therapy, mood tracking, and AI check-ins.", href: "/app" },
      { title: "Mindenity Pro", description: "Specialist-led clinical programs.", href: "/pro" },
      { title: "Mindenity Kit", description: "Embed care into your own product.", href: "/build" },
    ],
  },
  {
    label: "Programs",
    links: [
      { title: "Individual", description: "Anxiety, stress, and everyday well-being.", href: "/programs/individual" },
      { title: "Couples & Family", description: "Communication, grief, and family work.", href: "/programs/together" },
      { title: "Clinical Track", description: "EMDR, CPTSD, and trauma recovery.", href: "/programs/restore" },
    ],
  },
  {
    label: "Company",
    links: [
      { title: "About", description: "Our mission and clinical standards.", href: "/about" },
      { title: "Careers", description: "Join the team building better care.", href: "/careers" },
      { title: "Help & Support", description: "Answers, contact, and crisis resources.", href: "/help" },
    ],
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Measure the menu so the header can animate to its natural height.
  useEffect(() => {
    if (!open) {
      setNavHeight(0);
      return;
    }
    const measure = () => {
      const inner = navRef.current?.firstElementChild as HTMLElement | undefined;
      if (inner) setNavHeight(inner.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open]);

  // Close on Escape, and when the viewport grows back to desktop.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  return (
<>
<header className={`styles_header__fpulf ${scrolled ? "styles_scrolled__p_MGt" : ""} ${open ? OPEN : ""}`}>
<div className="styles_headerContent__gYxXy">
<div className="styles_headerLogoContainer__Y2Zyw">
<div style={{position:"relative"}}>
<a className="styles_headerLogoWrapper__ehVoY" href="/">
<svg className="styles_logo__EKrVz styles_headerLogo___xqC_" width="94" height="16" viewBox="0 0 94 16" xmlns="http://www.w3.org/2000/svg">
<path d="M86.2267 12.3723C84.2104 12.3723 82.4186 10.9191 81.9571 8.91278H93.9286C93.9286 8.91278 93.9927 8.18584 93.9927 7.92867C93.9927 3.67036 90.5098 0.205078 86.2288 0.205078C81.9478 0.205078 78.4648 3.66964 78.4648 7.92867C78.4648 12.1877 81.9283 15.5718 86.2288 15.5718C90.5293 15.5718 93.0402 12.4204 93.667 10.139H90.0179C90.0179 10.139 88.8575 12.3723 86.2267 12.3723ZM86.2288 3.40312C88.162 3.40312 89.8402 4.67315 90.4152 6.56599H82.0424C82.615 4.67315 84.294 3.40312 86.2288 3.40312Z">
</path>
<path d="M40.5454 15.5718C36.2644 15.5718 32.9062 12.1432 32.9062 7.92867C32.9062 3.71416 36.3892 0.205078 40.6702 0.205078C44.9512 0.205078 48.4344 3.80612 48.4344 7.88771C48.4344 9.62682 48.4344 15.1889 48.4344 15.1889H45.4199V12.7523L45.2005 12.6948C44.6696 13.9893 42.7474 15.5718 40.5454 15.5718ZM40.6702 3.40312C38.2523 3.40312 36.2844 5.42239 36.2844 7.90496C36.2844 10.3875 38.2518 12.373 40.6702 12.373C43.0889 12.373 45.056 10.3689 45.056 7.90496C45.056 5.44104 43.0889 3.40312 40.6702 3.40312Z">
</path>
<path d="M57.0368 15.5718C52.7558 15.5718 49.3984 12.1432 49.3984 7.92867C49.3984 3.71416 52.8814 0.205078 57.1624 0.205078C61.4434 0.205078 64.9266 3.80612 64.9266 7.88771C64.9266 9.62682 64.9266 15.1889 64.9266 15.1889H61.9121V12.7523L61.6927 12.6948C61.1618 13.9893 59.2388 15.5718 57.0368 15.5718ZM57.1624 3.40312C54.7448 3.40312 52.7769 5.42239 52.7769 7.90496C52.7769 10.3875 54.744 12.373 57.1624 12.373C59.5811 12.373 61.5482 10.3689 61.5482 7.90496C61.5482 5.44104 59.5811 3.40312 57.1624 3.40312Z">
</path>
<path d="M69.9877 15.1874L63.8008 0.589355H67.1856L71.7202 11.3429L76.2554 0.589355H79.6394L73.4533 15.1874H69.9877Z">
</path>
<path d="M14.985 0C6.70823 0 -0.00216598 6.80197 5.24457e-07 15.19H3.82821C3.82821 8.90381 8.78373 3.8072 14.985 3.8072C21.1862 3.8072 26.1418 8.90381 26.1418 15.19H29.9699C29.9715 6.80197 23.261 0 14.985 0Z">
</path>
<g className="logo-eyes">
<path className="logo-eye-left" d="M11.007 15.5481C12.6893 15.5481 14.053 14.1915 14.053 12.5182C14.053 10.8448 12.6893 9.48828 11.007 9.48828C9.32471 9.48828 7.96094 10.8448 7.96094 12.5182C7.96094 14.1915 9.32471 15.5481 11.007 15.5481Z">
</path>
<path className="logo-eye-right" d="M18.9679 15.5481C20.6502 15.5481 22.014 14.1915 22.014 12.5182C22.014 10.8448 20.6502 9.48828 18.9679 9.48828C17.2856 9.48828 15.9219 10.8448 15.9219 12.5182C15.9219 14.1915 17.2856 15.5481 18.9679 15.5481Z">
</path>
</g>
</svg>
</a>
</div>
</div>
<div className="styles_headerNavigationButtonsContainer__Ti3NP" style={{opacity:"1"}}>
<button className="styles_headerNavigationButton__gzr6Z " type="button">Products</button>
<button className="styles_headerNavigationButton__gzr6Z " type="button">Solutions</button>
<button className="styles_headerNavigationButton__gzr6Z " type="button">Developers</button>
<button className="styles_headerNavigationButton__gzr6Z " type="button">Resources</button>
<button className="styles_headerNavigationButton__gzr6Z " type="button">About</button>
</div>
<div className="styles_headerButtonContainer__EYWrL">
<button className="styles_button__dr0t2 styles_variant-solid__XVs0U styles_size-small__RFuhw styles_color-black__vSVW0 styles_headerButton__ZWBgI" type="button">Use Aave</button>
<div className="styles_headerButtonMenuBackdrop__Kuzty">
</div>
</div>
<button
  className="styles_headerMobileButton__Qebto"
  type="button"
  aria-label={open ? "Close menu" : "Open menu"}
  aria-expanded={open}
  aria-controls="header-mobile-nav"
  onClick={() => setOpen((v) => !v)}
>
<svg className={`styles_headerMobileButtonIcon__TqSuL ${open ? OPEN : ""}`} width="32" height="32" viewBox="0 0 32 32" fill="none">
<path className="styles_headerMobileButtonIconTop__KbUaZ" d="M5.25 11H26.75" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
</path>
<path className="styles_headerMobileButtonIconBottom__K8wIJ" d="M5.25 21H26.75" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
</path>
</svg>
</button>
</div>
<nav
  id="header-mobile-nav"
  ref={navRef}
  className={`styles_navigation__LrkPB ${open ? OPEN : ""}`}
  style={{ height: navHeight }}
  aria-hidden={!open}
>
<div className="styles_navigationLinksContainerWrapper__SZrco">
{MENU_GROUPS.map((group) => (
  <div key={group.label} className="header-menu-group">
    <p className="styles_navTitle__vbCUj">{group.label}</p>
    <div className="styles_navigationLinksContainer__1k_ff">
      {group.links.map((link) => (
        <a
          key={link.title}
          className="styles_navigationLink__rq9hz"
          href={link.href}
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        >
          <span className="styles_navigationLinkContent__TDaF9">
            <span className="styles_navigationLinkTitleContainer__rCZWR">
              <span className="styles_navigationLinkTitle__0RD_r">{link.title}</span>
            </span>
            <span className="styles_navigationLinkDescription__vK9JY">{link.description}</span>
          </span>
          <svg
            className="styles_navigationLinkArrow__p8d8F"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 8.5H12.5M12.5 8.5L8.5 4.5M12.5 8.5L8.5 12.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      ))}
    </div>
  </div>
))}
</div>
</nav>
</header>
</>
  );
}
