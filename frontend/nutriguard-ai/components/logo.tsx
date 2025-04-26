import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <span className="text-lg font-bold">N</span>
      </div>
      <span className="text-lg font-medium">NutriGuard AI</span>
    </Link>
  )
}
