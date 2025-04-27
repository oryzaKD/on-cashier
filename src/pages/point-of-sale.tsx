"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Search, Plus, Minus, ShoppingCart, CreditCard, Banknote, Trash2 } from "lucide-react"
// import { useToast } from "@/components/ui/use-toast"

interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string
}

interface CartItem extends Product {
  quantity: number
}

export default function PointOfSale() {
  // const { toast } = useToast()
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  // Mock product data
  const products: Product[] = [
    { id: 1, name: "Espresso", price: 3.5, category: "coffee", image: "/placeholder.svg?height=80&width=80" },
    { id: 2, name: "Cappuccino", price: 4.5, category: "coffee", image: "/placeholder.svg?height=80&width=80" },
    { id: 3, name: "Latte", price: 4.75, category: "coffee", image: "/placeholder.svg?height=80&width=80" },
    { id: 4, name: "Mocha", price: 5.0, category: "coffee", image: "/placeholder.svg?height=80&width=80" },
    { id: 5, name: "Green Tea", price: 3.25, category: "tea", image: "/placeholder.svg?height=80&width=80" },
    { id: 6, name: "Black Tea", price: 3.0, category: "tea", image: "/placeholder.svg?height=80&width=80" },
    { id: 7, name: "Croissant", price: 2.5, category: "pastry", image: "/placeholder.svg?height=80&width=80" },
    { id: 8, name: "Chocolate Muffin", price: 3.25, category: "pastry", image: "/placeholder.svg?height=80&width=80" },
    { id: 9, name: "Blueberry Scone", price: 3.5, category: "pastry", image: "/placeholder.svg?height=80&width=80" },
    { id: 10, name: "Sandwich", price: 6.5, category: "food", image: "/placeholder.svg?height=80&width=80" },
    { id: 11, name: "Salad", price: 7.25, category: "food", image: "/placeholder.svg?height=80&width=80" },
    { id: 12, name: "Soup", price: 5.75, category: "food", image: "/placeholder.svg?height=80&width=80" },
  ]

  const categories = ["all", "coffee", "tea", "pastry", "food"]

  const filteredProducts = searchQuery
    ? products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : products

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)

      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  const updateQuantity = (id: number, change: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = Math.max(0, item.quantity + change)
            return { ...item, quantity: newQuantity }
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    })
  }

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleCheckout = (paymentMethod: string) => {
    if (cart.length === 0) {
      // toast({
      //   title: "Cart is empty",
      //   description: "Please add items to your cart before checkout.",
      //   variant: "destructive",
      // })
      return
    }

    // toast({
    //   title: "Payment successful!",
    //   description: `$${calculateTotal().toFixed(2)} paid with ${paymentMethod}.`,
    // })

    clearCart()
  }

  return (
    <div className="flex h-full">
      {/* Products Section */}
      <div className="flex-1 p-4 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Point of Sale</h2>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="flex-1 flex flex-col">
          <TabsList className="mb-4">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="flex-1 mt-0">
              <ScrollArea className="h-[calc(100vh-220px)]">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts
                    .filter((p) => category === "all" || p.category === category)
                    .map((product) => (
                      <Card
                        key={product.id}
                        className="overflow-hidden cursor-pointer hover:border-primary transition-colors"
                        onClick={() => addToCart(product)}
                      >
                        <div className="aspect-square bg-muted flex items-center justify-center">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="h-20 w-20 object-cover"
                          />
                        </div>
                        <CardContent className="p-3">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">${product.price.toFixed(2)}</div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Cart Section */}
      <div className="w-96 border-l flex flex-col h-full">
        <Card className="flex-1 border-0 rounded-none">
          <CardHeader className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Current Order
              </CardTitle>
              {cart.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="h-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Clear
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-[calc(100vh-350px)]">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <p className="text-xs text-muted-foreground mt-1">Add items from the menu to get started</p>
                </div>
              ) : (
                <div className="divide-y">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center p-4">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">${item.price.toFixed(2)}</div>
                      </div>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 ml-2 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex-col p-0 border-t">
            <div className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8%)</span>
                <span>${(calculateTotal() * 0.08).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${(calculateTotal() * 1.08).toFixed(2)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 p-4 pt-0">
              <Button variant="outline" className="w-full" onClick={() => handleCheckout("Cash")}>
                <Banknote className="mr-2 h-4 w-4" />
                Cash
              </Button>
              <Button className="w-full" onClick={() => handleCheckout("Card")}>
                <CreditCard className="mr-2 h-4 w-4" />
                Card
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
