"use client";

import Link from "next/link";

const links = [
  { href: "/", label: "Strona główna" },
  { href: "/unschool", label: "Unschool" },
  { href: "/elearning", label: "E-learning" },
] as const;

export function AdminQuickLinks() {
  return (
    <nav className="unschool-admin-quicklinks" aria-label="Skróty do serwisu">
      <p className="unschool-admin-quicklinks__title">Twój serwis</p>
      <ul className="unschool-admin-quicklinks__list">
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="unschool-admin-quicklinks__link" target="_blank">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
