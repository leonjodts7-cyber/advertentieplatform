"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface CategoryChipButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label: string;
  active?: boolean;
  href?: undefined;
}

interface CategoryChipLinkProps {
  label: string;
  active?: boolean;
  href: string;
  className?: string;
}

type CategoryChipProps = CategoryChipButtonProps | CategoryChipLinkProps;

function ChipContent({ label, active }: { label: string; active?: boolean }) {
  return (
    <>
      {active && (
        <span className="category-chip__dot" aria-hidden>
          <Check className="h-3 w-3" strokeWidth={2.5} />
        </span>
      )}
      {label}
    </>
  );
}

export function CategoryChip(props: CategoryChipProps) {
  const { label, active = false, className } = props;
  const classes = cn(
    "category-chip",
    active && "category-chip-active",
    className
  );

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        className={classes}
        aria-current={active ? "page" : undefined}
      >
        <ChipContent label={label} active={active} />
      </Link>
    );
  }

  const { href: _href, label: _l, active: _a, className: _c, ...buttonProps } =
    props as CategoryChipButtonProps;

  return (
    <button
      type="button"
      aria-pressed={active}
      className={classes}
      {...buttonProps}
    >
      <ChipContent label={label} active={active} />
    </button>
  );
}
