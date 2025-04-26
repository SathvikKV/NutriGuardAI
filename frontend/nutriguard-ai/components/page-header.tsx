import type React from "react"

interface PageHeaderProps {
  title: string
  description: string
  icon?: React.ReactNode
}

export default function PageHeader({ title, description, icon }: PageHeaderProps) {
  return (
    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div className="flex items-center space-x-2">
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">{icon}</div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}
