import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function PickupPlanner() {
  return (
    <div className="flex items-center justify-center md:justify-end">
      <div className="flex items-center bg-background rounded-lg border border-primary/20">
        <div className="px-4 py-2 border-r border-primary/20 font-bold">Pickup</div>
        <Select>
          <SelectTrigger className="w-[200px] border-0 bg-transparent focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="As soon as possible" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asap">As soon as possible</SelectItem>
            <SelectItem value="later">Schedule for later</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
