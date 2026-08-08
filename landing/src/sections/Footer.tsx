import type { JSX } from "react";
import "./footer.css";



/* TODO: LinkedIn profile URL still unknown — '#' rather than inheriting the
   scrape's aave.com account. The other three are Mindenity's own. */
const SOCIALS: { label: string; href: string; icon: JSX.Element }[] = [
  {
    label: "X",
    href: "https://x.com/mymindenity",
    icon: (
      <svg className="styles_socialIcon__QGAbm" width="17.6" height="22" viewBox="0 0 16 20">
        <path d="M12.6 2.94H15.05L9.69 8.92L16 17.06H11.06L7.2 12.12L2.77 17.06H0.32L6.05 10.66L0 2.94H5.06L8.56 7.45L12.6 2.94ZM11.74 15.63H13.1L4.32 4.3H2.87L11.74 15.63Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/mymindenity",
    icon: (
      <svg className="styles_socialIcon__QGAbm" width="18" height="18" viewBox="0 0 18 18">
        <path d="M5.27 0.06C4.31 0.11 3.66 0.26 3.09 0.49C2.5 0.72 2 1.03 1.5 1.53C1 2.03 0.69 2.53 0.46 3.12C0.24 3.69 0.09 4.35 0.05 5.31C0.01 6.27 0 6.57 0 9.02C0.01 11.46 0.02 11.77 0.06 12.73C0.11 13.69 0.26 14.34 0.49 14.91C0.72 15.5 1.03 16 1.53 16.5C2.03 17 2.53 17.31 3.12 17.54C3.7 17.76 4.35 17.91 5.31 17.95C6.27 17.99 6.57 18 9.02 18C11.46 17.99 11.77 17.98 12.73 17.94C13.69 17.89 14.34 17.74 14.91 17.52C15.5 17.28 16 16.98 16.5 16.47C17 15.97 17.31 15.47 17.54 14.88C17.76 14.31 17.91 13.65 17.95 12.69C17.99 11.73 18 11.43 18 8.98C17.99 6.54 17.98 6.23 17.94 5.27C17.89 4.31 17.74 3.66 17.52 3.09C17.28 2.5 16.98 2 16.47 1.5C15.97 1 15.47 0.69 14.88 0.46C14.31 0.24 13.65 0.09 12.69 0.05C11.74 0.01 11.43 0 8.98 0C6.54 0.01 6.23 0.02 5.27 0.06ZM5.38 16.33C4.5 16.3 4.02 16.15 3.71 16.03C3.29 15.87 2.99 15.67 2.67 15.36C2.35 15.04 2.16 14.74 1.99 14.32C1.87 14.01 1.72 13.53 1.68 12.65C1.64 11.7 1.63 11.42 1.62 9.02C1.62 6.61 1.63 6.33 1.67 5.38C1.71 4.5 1.85 4.03 1.97 3.71C2.14 3.29 2.33 2.99 2.65 2.67C2.96 2.36 3.26 2.16 3.68 2C4 1.87 4.47 1.73 5.35 1.68C6.3 1.64 6.58 1.63 8.99 1.62C11.39 1.62 11.67 1.63 12.62 1.67C13.5 1.71 13.98 1.85 14.29 1.98C14.71 2.14 15.01 2.33 15.33 2.65C15.65 2.96 15.84 3.26 16 3.68C16.13 4 16.28 4.47 16.32 5.35C16.36 6.3 16.37 6.59 16.38 8.99C16.38 11.39 16.37 11.68 16.33 12.62C16.29 13.5 16.15 13.98 16.03 14.3C15.86 14.72 15.67 15.02 15.35 15.33C15.04 15.65 14.74 15.84 14.32 16.01C14 16.13 13.53 16.28 12.65 16.32C11.7 16.36 11.42 16.37 9.01 16.38C6.61 16.38 6.33 16.37 5.38 16.33M12.71 4.19C12.71 4.4 12.78 4.61 12.9 4.79C13.02 4.97 13.19 5.11 13.38 5.19C13.58 5.27 13.8 5.29 14.01 5.25C14.22 5.21 14.41 5.1 14.56 4.95C14.71 4.8 14.81 4.61 14.85 4.4C14.9 4.19 14.87 3.97 14.79 3.77C14.71 3.58 14.57 3.41 14.39 3.29C14.21 3.17 14.01 3.11 13.79 3.11C13.51 3.11 13.23 3.22 13.03 3.43C12.83 3.63 12.71 3.9 12.71 4.19ZM4.38 9.01C4.38 11.56 6.46 13.63 9.01 13.62C11.56 13.62 13.63 11.54 13.62 8.99C13.62 6.44 11.54 4.37 8.99 4.38C6.44 4.38 4.37 6.46 4.38 9.01ZM6 9.01C6 8.41 6.17 7.83 6.5 7.34C6.83 6.84 7.3 6.46 7.85 6.23C8.39 6 9 5.94 9.58 6.06C10.16 6.17 10.7 6.46 11.12 6.87C11.54 7.29 11.82 7.83 11.94 8.41C12.06 8.99 12 9.59 11.77 10.14C11.55 10.69 11.16 11.16 10.67 11.49C10.18 11.82 9.6 12 9.01 12C8.61 12 8.22 11.92 7.86 11.77C7.49 11.62 7.16 11.4 6.88 11.13C6.6 10.85 6.38 10.52 6.23 10.15C6.08 9.79 6 9.4 6 9.01Z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@mymindenity",
    icon: (
      <svg className="styles_socialIcon__QGAbm" width="16" height="18" viewBox="0 0 16 18">
        <path d="M11.3 0H8.27v12.26c0 1.46-1.17 2.66-2.62 2.66s-2.62-1.2-2.62-2.66c0-1.44 1.14-2.61 2.54-2.66V6.52C2.49 6.57 0 9.1 0 12.26 0 15.44 2.54 18 5.68 18s5.68-2.58 5.68-5.74V5.97a7.03 7.03 0 0 0 4.02 1.36V4.25c-2.28-.078-4.07-1.96-4.07-4.25" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg className="styles_socialIcon__QGAbm" width="18" height="18" viewBox="0 0 18 18">
        <path d="M16.65 0H1.35A1.35 1.35 0 0 0 0 1.35v15.3A1.35 1.35 0 0 0 1.35 18h15.3A1.35 1.35 0 0 0 18 16.65V1.35A1.35 1.35 0 0 0 16.65 0M5.4 15.3H2.7V7.2h2.7zM4.05 5.62A1.57 1.57 0 1 1 5.67 4.05a1.6 1.6 0 0 1-1.62 1.57M15.3 15.3h-2.7v-4.27c0-1.28-.54-1.74-1.24-1.74A1.57 1.57 0 0 0 9.9 10.97a.6.6 0 0 0 0 .126V15.3H7.2V7.2h2.61v1.17a2.8 2.8 0 0 1 2.43-1.26c1.4 0 3.02.774 3.02 3.29z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
<>
<section className="styles_section__UnXri ">
<div className="styles_bg__CyOTP " style={{top:"auto",height:"1600px",opacity:"1.5"}}>
<canvas className="styles_canvas__wxK5l">
</canvas>
</div>
<footer className="styles_footer__1cZ8q undefined">

<div className="styles_footerBottom__NC5WI">
<a className="styles_logoWrapper__yZsX7" href="/">
<img className="styles_logo__bl3eo footer-logo" src="/mindenity-logo-main.png" alt="Mindenity" width="420" height="100"/>
</a>
<div className="styles_footerBottomTrailing__XP8pk">
<nav className="footer-legal" aria-label="Legal">
<a href="/faq">FAQ</a>
<a href="/privacy">Privacy Policy</a>
<a href="/terms">Terms &amp; Conditions</a>
</nav>
<div className="styles_allLinksContainer__4cVXF">
<div className="styles_socialsContainer__iETG5">
{SOCIALS.map((social) => {
const external = social.href.startsWith("http");
return (
<a
  key={social.label}
  className="styles_socialIconWrapper__IOQPi"
  href={social.href}
  aria-label={social.label}
  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
>
{social.icon}
</a>
);
})}
</div>
</div>
</div>
</div>
<div className="styles_legalText__n3Rqf">Mindenity connects you with licensed therapists and provides self-guided tools for mood, sleep and stress. Mindenity is not an emergency service &mdash; if you or someone else is in immediate danger, contact your local emergency number. Nigeria pays in naira; international clients pay in US dollars.</div>
</footer>
</section>
</>
  );
}
