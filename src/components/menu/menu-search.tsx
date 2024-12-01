import { useState, KeyboardEvent } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface MenuSearchProps {
  onSearch: (query: string) => void
}

export function MenuSearch({ onSearch }: MenuSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch(searchQuery)
    }
  }

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder="Search menu..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value)
          onSearch(e.target.value)
        }}
        onKeyDown={handleKeyDown}
        className="pl-10 bg-white rounded-full w-full text-base"
      />
    </div>
  )
}
