// Date formatting
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date)
}

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

// Number formatting
export const formatCalories = (calories: number): string => {
  return `${Math.round(calories)} cal`
}

export const formatMacro = (value: number): string => {
  return `${value.toFixed(1)}g`
}

export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return "0%"
  return `${Math.round((value / total) * 100)}%`
}

// Text formatting
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return ""
  return text.charAt(0).toUpperCase() + text.slice(1)
}
