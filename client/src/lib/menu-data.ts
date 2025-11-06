export interface MenuItem {
  name: string;
  category: string;
  description?: string;
  price?: number;
  image?: string;
}

export interface MenuCategory {
  name: string;
  image: string;
  description: string;
  items: MenuItem[];
}

export const menuCategories: MenuCategory[] = [
  {
    name: "Alcohol",
    image: "/images/menu/alcohol.jpg",
    description: "Selection of local and imported beverages.",
    items: [
      { name: "Arbormist", description: "Sweet rose wine", category: "Alcohol", price: 530 },
      { name: "Bacardi Superior 750ml", description: "White rum", category: "Alcohol", price: 1055 },
      { name: "Carlo Rossi", description: "Table wine", category: "Alcohol", price: 545 }
    ]
  },
  {
    name: "Beef",
    image: "/images/menu/beef.jpg",
    description: "Premium beef dishes prepared to perfection.",
    items: [
      { name: "Beef Caldereta", description: "Traditional Filipino beef stew in rich tomato sauce", category: "Beef", price: 380 },
      { name: "Beef Steak", description: "Classic Bistek Tagalog with caramelized onions", category: "Beef", price: 320 },
      { name: "Bulalo", description: "Hearty bone marrow soup with vegetables", category: "Beef", price: 420 }
    ]
  },
  {
    name: "Chicken",
    image: "/images/menu/chicken.jpg",
    description: "Farm-fresh chicken specialties.",
    items: [
      { name: "Buffalo Wings", description: "Crispy wings with special sauce", category: "Chicken", price: 220 },
      { name: "Buttered Chicken", description: "Tender chicken in creamy butter sauce", category: "Chicken", price: 260 },
      { name: "Manangs Barbeque Chicken", description: "Signature grilled chicken with special marinade", category: "Chicken", price: 240 },
      { name: "Manangs Fried Chicken (Half)", description: "Crispy fried chicken", category: "Chicken", price: 180 },
      { name: "Manangs Fried Chicken (Whole)", description: "Family-size crispy fried chicken", category: "Chicken", price: 350 },
      { name: "Manangs Native Tinolang Manok", description: "Traditional ginger-based chicken soup", category: "Chicken", price: 280 }
    ]
  },
  {
    name: "Coffee",
    image: "/images/menu/coffee.jpg",
    description: "Premium coffee beverages hot or cold.",
    items: [
      { name: "Americano (Hot) 8oz", description: "Espresso with hot water", category: "Coffee", price: 80 },
      { name: "Americano (Cold) 16oz", description: "Chilled espresso with cold water", category: "Coffee", price: 100 },
      { name: "Americano (Cold) 22oz", description: "Large chilled espresso with cold water", category: "Coffee", price: 120 },
      { name: "Cafe Latte (Hot) 8oz", description: "Espresso with steamed milk", category: "Coffee", price: 95 },
      { name: "Cafe Latte (Cold) 16oz", description: "Chilled espresso with cold milk", category: "Coffee", price: 115 },
      { name: "Cafe Latte (Cold) 22oz", description: "Large chilled espresso with cold milk", category: "Coffee", price: 135 },
      { name: "Cappuccino (Hot) 8oz", description: "Espresso topped with foamed milk", category: "Coffee", price: 95 },
      { name: "Cappuccino (Cold) 16oz", description: "Chilled espresso with cold foamed milk", category: "Coffee", price: 115 },
      { name: "Cappuccino (Cold) 22oz", description: "Large chilled espresso with cold foamed milk", category: "Coffee", price: 135 }
    ]
  },
  {
    name: "Desserts",
    image: "/images/menu/desserts.jpg",
    description: "Sweet treats and refreshing shakes.",
    items: [
      { name: "Avocado Shake", description: "Creamy avocado blended with milk", category: "Desserts", price: 140 },
      { name: "Dragonfruit Shake", description: "Fresh dragon fruit smoothie", category: "Desserts", price: 150 },
      { name: "Gulaman", description: "Traditional Filipino jelly drink", category: "Desserts", price: 80 },
      { name: "Leche Flan", description: "Classic Filipino caramel custard", category: "Desserts", price: 90 },
      { name: "Mango Shake", description: "Sweet mango blended with milk", category: "Desserts", price: 140 }
    ]
  },
  {
    name: "Drinks",
    image: "/images/menu/drinks.jpg",
    description: "Refreshing beverages and fresh juices.",
    items: [
      { name: "Blue Lemonade 16oz", description: "Refreshing blue-colored lemonade", category: "Drinks", price: 65 },
      { name: "Blue Lemonade 22oz", description: "Large refreshing blue-colored lemonade", category: "Drinks", price: 85 },
      { name: "Bottled Water", description: "Purified drinking water", category: "Drinks", price: 30 },
      { name: "Iced Tea (Pitcher)", description: "Freshly brewed iced tea", category: "Drinks", price: 120 },
      { name: "Fresh Fruit Juice", description: "Selection of seasonal fresh fruit juices", category: "Drinks", price: 95 }
    ]
  },
  {
    name: "Noodles",
    image: "/images/menu/noodles.jpg",
    description: "Traditional Filipino noodle dishes.",
    items: [
      { name: "Lomi", description: "Thick egg noodles in rich broth", category: "Noodles", price: 160 },
      { name: "Pancit Bam-i", description: "Mixed noodles with vegetables and meat", category: "Noodles", price: 150 },
      { name: "Pancit Bihon", description: "Rice noodles with vegetables and meat", category: "Noodles", price: 150 },
      { name: "Pancit Canton", description: "Yellow wheat noodles with vegetables and meat", category: "Noodles", price: 150 },
      { name: "Pancit Sotanghon", description: "Glass noodles with vegetables and meat", category: "Noodles", price: 150 }
    ]
  },
  {
    name: "Pork",
    image: "/images/menu/pork.jpg",
    description: "Savory pork specialties.",
    items: [
      { name: "Barbeque Pork", description: "Grilled marinated pork skewers", category: "Pork", price: 180 },
      { name: "Crispy Kare-Kare", description: "Crispy pork in peanut sauce", category: "Pork", price: 320 },
      { name: "Crispy Pata", description: "Deep-fried pork knuckles", category: "Pork", price: 450 },
      { name: "Lechon Kawali", description: "Crispy deep-fried pork belly", category: "Pork", price: 340 },
      { name: "Sinigang na Baboy", description: "Sour tamarind-based pork soup", category: "Pork", price: 280 },
      { name: "Sizzling Sisig", description: "Chopped pork face on sizzling plate", category: "Pork", price: 290 }
    ]
  },
  {
    name: "Rice",
    image: "/images/menu/rice.jpg",
    description: "Steamed rice and rice specialties.",
    items: [
      { name: "Garlic Rice (Cup)", description: "Individual serving of garlic fried rice", category: "Rice", price: 45 },
      { name: "Garlic Rice Platter", description: "Family serving of garlic fried rice", category: "Rice", price: 140 },
      { name: "Plain Rice (Cup)", description: "Individual serving of steamed rice", category: "Rice", price: 30 },
      { name: "Plain Rice Platter", description: "Family serving of steamed rice", category: "Rice", price: 90 }
    ]
  },
  {
    name: "Seafood",
    image: "/images/menu/seafood.jpg",
    description: "Fresh seafood dishes.",
    items: [
      { name: "Alimango sa Gata", description: "Crab in coconut milk", category: "Seafood", price: 420 },
      { name: "Baked Bangus", description: "Baked milkfish with cheese", category: "Seafood", price: 280 },
      { name: "Calamares", description: "Crispy fried squid rings", category: "Seafood", price: 220 },
      { name: "Garlic Buttered Shrimp", description: "Shrimp sautéed in garlic butter", category: "Seafood", price: 320 },
      { name: "Sinigang na Hipon", description: "Sour tamarind-based shrimp soup", category: "Seafood", price: 360 },
      { name: "Sizzling Squid", description: "Squid on sizzling plate", category: "Seafood", price: 300 }
    ]
  },
  {
    name: "Snacks",
    image: "/images/menu/snacks.jpg",
    description: "Light meals and appetizers.",
    items: [
      { name: "Clubhouse Sandwich", description: "Triple-decker sandwich with chicken and bacon", category: "Snacks", price: 180 },
      { name: "Potato Fries", description: "Crispy golden french fries", category: "Snacks", price: 85 },
      { name: "Siomai", description: "Steamed pork dumplings", category: "Snacks", price: 95 },
      { name: "Spaghetti", description: "Filipino-style sweet spaghetti", category: "Snacks", price: 120 },
      { name: "Tuna Sandwich", description: "Classic tuna sandwich", category: "Snacks", price: 160 }
    ]
  },
  {
    name: "Vegetables",
    image: "/images/menu/vegetables.jpg",
    description: "Fresh vegetable dishes.",
    items: [
      { name: "Chopsuey", description: "Stir-fried mixed vegetables", category: "Vegetables", price: 160 },
      { name: "Lumpiang Gulay", description: "Vegetable spring rolls", category: "Vegetables", price: 120 },
      { name: "Mixed Vegetables", description: "Seasonal vegetables in garlic sauce", category: "Vegetables", price: 150 }
    ]
  }
];