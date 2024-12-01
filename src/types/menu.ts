import { Product } from "./products"

export interface MenuCollection {
  id: string
  title: string
  handle: string
  products: Product[]
}

export interface MenuSection {
  collection: MenuCollection
  products: Product[]
}
