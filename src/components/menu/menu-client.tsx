"use client";

import { useEffect, useState } from "react";
import { medusaClient } from "@/lib/medusa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ToastContainer, toast } from "react-toastify";
import { Product } from "@/types/products";
import { MenuSection } from "@/types/menu";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "@/context/CartContext";
import { MenuItemDialog } from "@/components/menu/menu-item-dialog";
import { PickupPlanner } from "@/components/menu/pickup-planner";
import { MenuSearch } from "@/components/menu/menu-search";
import Image from "next/image";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const Address = "898 County Line Road, Tempa, FL 33634";
const RestaurantName = "El BBQ Mexique"

function useHasMounted() {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);
    return hasMounted;
}

export function MenuClient() {
    const hasMounted = useHasMounted();
    const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
    const [filteredSections, setFilteredSections] = useState<MenuSection[]>([]);
    const [selectedItem, setSelectedItem] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { cart, fetchCart } = useCart();

    useEffect(() => {
        if (!hasMounted) return;

        async function fetchData() {
            try {
                console.log('Starting data fetch...');

                // Fetch products with region ID for proper price calculation
                const { products } = await medusaClient.products.list({
                    region_id: "reg_01JD3KMQAR3FGDPEWQKWS235ZD"
                });

                console.log('Products fetched:', products);

                // Group products by collection
                const groupedProducts = (products as Product[]).reduce<Record<string, MenuSection>>((acc, product) => {
                    if (product.collection && product.collection.id) {
                        const collectionId = product.collection.id;
                        if (!acc[collectionId]) {
                            acc[collectionId] = {
                                collection: {
                                    ...product.collection,
                                    products: [] // Initialize required products array
                                },
                                products: []
                            };
                        }
                        // Update both the collection's products and section's products
                        acc[collectionId].products.push(product);
                        acc[collectionId].collection.products = acc[collectionId].products;
                    }
                    return acc;
                }, {});

                const sections = Object.values(groupedProducts);
                const sortedSections = sections.sort((a, b) => 
                    (a.collection.title || '').localeCompare(b.collection.title || '')
                );

                console.log('Processed sections:', sortedSections);

                setMenuSections(sortedSections);
                setFilteredSections(sortedSections);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load menu items');
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [hasMounted]);

    console.log('Rendering MenuClient:', { hasMounted, isLoading, sectionsCount: filteredSections.length });

    if (!hasMounted) {
        console.log('Not mounted yet, returning loading...');
        return <div>Loading...</div>;
    }

    const handleSearch = (query: string) => {
        if (!query.trim()) {
            setFilteredSections(menuSections);
            return;
        }

        const searchTerm = query.toLowerCase();
        const filtered = menuSections.map(section => ({
            ...section,
            products: section.products.filter(product =>
                product.title?.toLowerCase().includes(searchTerm) ||
                product.description?.toLowerCase().includes(searchTerm)
            )
        })).filter(section => section.products.length > 0);

        setFilteredSections(filtered);
    };

    const addToCart = async (variantId: string, quantity: number = 1) => {
        if (!cart?.id) {
            toast.error("Cart is not initialized.");
            return;
        }

        try {
            await medusaClient.carts.lineItems.create(cart.id, {
                variant_id: variantId,
                quantity,
            });
            await fetchCart();
            toast.success("Item added to cart!");
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Failed to add item to cart.");
        }
    };

    const handleItemClick = (item: Product) => {
        setSelectedItem(item);
    };

    const renderMenuItem = (item: Product) => (
        <div
            key={item.id}
            onClick={() => handleItemClick(item)}
            className="w-full cursor-pointer bg-white rounded-lg shadow-[0_1px_2px_0_rgba(0,0,0,0.1)] hover:shadow-[0_8px_16px_0_rgba(0,0,0,0.1)] transition-shadow duration-200 flex h-[130px]"
        >
            <div className="w-40 relative bg-slate-200 rounded-l-lg overflow-hidden">
                <Image
                    src={item.thumbnail || "/placeholder-image.png"}
                    alt={item.title || "Menu item"}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 160px, 200px"
                />
            </div>
            <div className="flex flex-col flex-grow p-4">
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground flex-grow">
                    {item.description || "No description available"}
                </p>
                <p className="text-sm black mt-auto">
                    {item.variants?.[0]?.calculated_price?.original_amount
                        ? `$${item.variants[0].calculated_price.original_amount.toFixed(2)}`
                        : "Price not available"}
                </p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            <div className="px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold">{RestaurantName}</h1>
                        <p className="text-base">{Address}</p>
                    </div>
                    <div className="text-center md:text-left">
                        <PickupPlanner />
                    </div>
                </div>

                <Separator className="my-4 h-1" />
                <div className="flex items-center justify-between gap-4">
                    <Select
                        onValueChange={(value) => {
                            if (value === "menu") {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            } else {
                                const element = document.getElementById(value);
                                if (element) {
                                    element.scrollIntoView({ behavior: "smooth" });
                                }
                            }
                        }}
                    >
                        <SelectTrigger className="w-[180px] border-0 bg-transparent shadow-none font-bold">
                            <SelectValue placeholder="Menu" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="menu">Menu</SelectItem>
                            {filteredSections.map((section) => (
                                <SelectItem key={section.collection.id} value={section.collection.id}>
                                    {section.collection.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex-1 max-w-[250px]">
                        <MenuSearch onSearch={handleSearch} />
                    </div>
                </div> 
                <Separator className="my-4 h-1" />

                <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-8">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : filteredSections.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No menu items found
                            </div>
                        ) : (
                            filteredSections.map((section) => (
                                <div key={section.collection.id} className="space-y-6">
                                    <h2 className="text-2xl font-semibold sticky top-0 bg-background py-4 z-10">
                                        {section.collection.title}
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {section.products.map(renderMenuItem)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {selectedItem && (
                <MenuItemDialog
                    item={selectedItem}
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onAddToCart={addToCart}
                />
            )}
            
            <ToastContainer />
        </div>
    );
}
