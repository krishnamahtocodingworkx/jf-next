"use client";

import Link from "next/link";
import { FaReact } from "react-icons/fa";

type AuthSuccessCardProps = {
  title: string;
  description: React.ReactNode;
  ctaLabel: string;
  ctaHref: string;
};

export function AuthSuccessCard({ title, description, ctaLabel, ctaHref }: AuthSuccessCardProps) {
  return (
    <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
        <FaReact className="h-6 w-6 text-sky-500" />
      </div>
      <h2 className="mb-3 text-xl font-semibold text-slate-900">{title}</h2>
      <div className="mb-6 text-sm text-slate-600">{description}</div>
      <Link
        href={ctaHref}
        className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-teal-500 px-4 font-medium text-white transition hover:bg-teal-600"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
