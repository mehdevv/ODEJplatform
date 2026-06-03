import { Link } from "wouter";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export interface BreadcrumbItemConfig {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItemConfig[];
  className?: string;
  variant?: "default" | "hero";
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  className,
  variant = "default",
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        variant === "hero"
          ? "bg-primary text-white py-16 md:py-20 border-b"
          : "bg-primary/5 py-12 border-b",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              {breadcrumbs.map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {item.href ? (
                      <BreadcrumbLink asChild>
                        <Link
                          href={item.href}
                          className={
                            variant === "hero"
                              ? "text-white/80 hover:text-white"
                              : ""
                          }
                        >
                          {item.label}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage
                        className={
                          variant === "hero" ? "text-white" : ""
                        }
                      >
                        {item.label}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </span>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <h1
          className={cn(
            "text-3xl md:text-4xl font-bold mb-4",
            variant === "hero" ? "text-white" : "text-primary",
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              "max-w-2xl text-lg",
              variant === "hero"
                ? "text-white/90"
                : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
