import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Product } from "@/types/products"
import { Plus, Minus, X } from "lucide-react"
import Image from "next/image"

interface MenuItemDialogProps {
  item: Product
  isOpen: boolean
  onClose: () => void
  onAddToCart: (variantId: string, quantity: number) => void
}

export function MenuItemDialog({ item, isOpen, onClose, onAddToCart }: MenuItemDialogProps) {
  const [quantity, setQuantity] = useState(1)

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

  const handleAddToCart = () => {
    if (item.variants?.[0]?.id) {
      onAddToCart(item.variants[0].id, quantity)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-primary sm:max-w-[500px] p-0">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {item.thumbnail && (
          <div className="w-full aspect-[16/9] relative bg-slate-200">
            <Image
              src={item.thumbnail}
              alt={item.title || "Menu item"}
              fill
              className="object-cover py-1"
              sizes="(max-width: 500px) 100vw, 500px"
              priority
            />
          </div>
        )}

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{item.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => decrementQuantity()}
                disabled={quantity <= 1}
                className="h-6 w-6 rounded-full bg-background hover:bg-background hover:brightness-95 border-0 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => incrementQuantity()}
                className="h-6 w-6 rounded-full bg-background hover:bg-background hover:brightness-95 border-0 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={handleAddToCart}
              className="bg-black hover:bg-black/90 text-white h-8 px-6 text-sm min-w-[200px]"
            >
              Add to Cart - $
              {item.variants?.[0]?.calculated_price?.original_amount
                ? (item.variants[0].calculated_price.original_amount * quantity).toFixed(2)
                : "N/A"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
