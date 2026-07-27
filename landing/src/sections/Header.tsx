import { useEffect, useRef, useState } from "react";
import "./header-menu.css";

const OPEN = "styles_open__X9ppk";

type MenuLink = { title: string; description: string; href: string };

const MENU_GROUPS: { label: string; links: MenuLink[] }[] = [
  {
    label: "Product",
    links: [
      { title: "The app", description: "Therapy, mood, sleep and an AI companion.", href: "/app" },
      { title: "Plans & pricing", description: "Nine plans in naira and dollars.", href: "/plans" },
      { title: "Find my plan", description: "Answer a few questions, get a match.", href: "/find-my-plan" },
    ],
  },
  {
    label: "Plans",
    links: [
      { title: "Individual", description: "One-to-one therapy, from a single session.", href: "/plans#individual" },
      { title: "Couple", description: "Two people, one room.", href: "/plans#couple" },
      { title: "Family", description: "Up to five people, one household.", href: "/plans#family" },
    ],
  },
  {
    label: "Company",
    links: [
      { title: "For therapists", description: "Practise with Mindenity.", href: "/therapists" },
      { title: "About", description: "Our mission and clinical standards.", href: "/about" },
      { title: "Help & support", description: "Answers, contact and crisis resources.", href: "/help" },
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
<img className="styles_logo__EKrVz styles_headerLogo___xqC_" src="/mindenity-Logo.svg" alt="Mindenity" width="149" height="32"/>
</a>
</div>
</div>
<div className="styles_headerNavigationButtonsContainer__Ti3NP" style={{opacity:"1"}}>
<button className="styles_headerNavigationButton__gzr6Z " type="button">Product</button>
<button className="styles_headerNavigationButton__gzr6Z " type="button">Plans</button>
<button className="styles_headerNavigationButton__gzr6Z " type="button">Company</button>
</div>
<div className="styles_headerButtonContainer__EYWrL">
<button className="styles_button__dr0t2 styles_variant-solid__XVs0U styles_size-small__RFuhw styles_color-black__vSVW0 styles_headerButton__ZWBgI" type="button">Get the app</button>
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
