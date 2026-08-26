import {
  buildGeneralMessage,
  buildKitMessage,
  buildWhatsAppUrl,
} from "@/config/business";

interface WhatsAppButtonProps {
  /** Active festival's collection name, e.g. "Navratri" / "Diwali" /
   *  "Holi" — used to build the default pre-filled message. */
  collectionName: string;
  /** Kit/product name — auto-builds the "Hi! I'm interested in the ... " message. */
  productName?: string;
  /** Use instead of `productName` for a fully custom pre-filled message. */
  message?: string;
  /** Visual style. */
  variant?: "primary" | "secondary" | "outline";
  /** Button size. */
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

const sizeClasses: Record<NonNullable<WhatsAppButtonProps["size"]>, string> = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-6 py-3 text-base gap-2",
  lg: "px-8 py-4 text-lg gap-2.5",
};

const variantClasses: Record<
  NonNullable<WhatsAppButtonProps["variant"]>,
  string
> = {
  primary:
    "bg-accent text-onaccent hover:bg-accent-400 shadow-lg shadow-accent-900/20",
  secondary:
    "bg-primary text-surface hover:bg-primary-600 shadow-lg shadow-primary-900/20",
  outline:
    "bg-transparent text-surface border-2 border-surface hover:bg-surface/10",
};

/**
 * Reusable "Order on WhatsApp" button, used across the whole site
 * (hero, product cards, final CTA). Reads the business phone number
 * from `config/business.ts` and opens a `wa.me` deep link with a
 * pre-filled message — opens the WhatsApp app on mobile, WhatsApp Web
 * on desktop. No cart, no checkout — this IS the checkout flow.
 */
export default function WhatsAppButton({
  collectionName,
  productName,
  message,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: WhatsAppButtonProps) {
  const text =
    message ??
    (productName
      ? buildKitMessage(productName, collectionName)
      : buildGeneralMessage(collectionName));
  const url = buildWhatsAppUrl(text);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group press-feedback inline-flex items-center justify-center rounded-full font-semibold tracking-wide transition-all duration-300 ease-[var(--ease-spring)] hover:-translate-y-1 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      <WhatsAppIcon className="h-[1.1em] w-[1.1em] shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
      <span>{children ?? "Order on WhatsApp"}</span>
    </a>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.001 2C6.478 2 2 6.478 2 12c0 1.887.525 3.649 1.437 5.152L2 22l4.978-1.408A9.953 9.953 0 0012.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2zm0 18.16a8.13 8.13 0 01-4.146-1.132l-.297-.176-3.037.859.822-2.98-.194-.307A8.128 8.128 0 013.84 12c0-4.5 3.66-8.16 8.161-8.16 4.5 0 8.159 3.66 8.159 8.16 0 4.501-3.659 8.16-8.159 8.16z" />
    </svg>
  );
}
