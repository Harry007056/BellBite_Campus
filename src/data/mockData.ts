export type Category = {
  name: string;
  slug: string;
  emoji: string;
  accent: string;
  description: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tag: string;
  vegetarian: boolean;
  available: boolean;
};

export const categories: Category[] = [
  {
    name: 'Breakfast',
    slug: 'breakfast',
    emoji: '🥞',
    accent: 'bg-[#FDE7DE]',
    description: 'Warm and quick bites to power your campus day.'
  },
  {
    name: 'Snacks',
    slug: 'snacks',
    emoji: '🍟',
    accent: 'bg-[#FFF2CF]',
    description: 'Crispy favourites for midday energy.'
  },
  {
    name: 'Meals',
    slug: 'meals',
    emoji: '🍛',
    accent: 'bg-[#EAF7EA]',
    description: 'Satisfying, wholesome meals for every hunger level.'
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    emoji: '🥤',
    accent: 'bg-[#E4F4FF]',
    description: 'Fresh shakes, juice and coolers to beat the heat.'
  },
  {
    name: 'Fast Food',
    slug: 'fast-food',
    emoji: '🍔',
    accent: 'bg-[#F7E9DF]',
    description: 'Campus classics, loaded and ready in minutes.'
  },
  {
    name: 'Desserts',
    slug: 'desserts',
    emoji: '🍰',
    accent: 'bg-[#FDE9F2]',
    description: 'Sweet little rewards after a long lecture block.'
  }
];

export const featuredFoods: MenuItem[] = [
  {
    id: 'tandoori-wrap',
    name: 'Tandoori Crunch Wrap',
    description: 'Chargrilled paneer, crunchy slaw and smoky mint sauce in a soft wrap.',
    price: 149,
    category: 'Fast Food',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    tag: 'Popular',
    vegetarian: true,
    available: true
  },
  {
    id: 'aloo-paratha',
    name: 'Aloo Paratha Plate',
    description: 'Freshly cooked paratha served with curd, pickle and house chaat masala.',
    price: 99,
    category: 'Breakfast',
    image:
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80',
    tag: 'Top Rated',
    vegetarian: true,
    available: true
  },
  {
    id: 'iced-latte',
    name: 'Café Cold Brew',
    description: 'Smooth and chilled coffee, crafted for late-night study sessions.',
    price: 119,
    category: 'Beverages',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
    tag: 'Fresh',
    vegetarian: true,
    available: true
  },
  {
    id: 'butter-masala',
    name: 'Butter Masala Bowl',
    description: 'Creamy tomato gravy, fragrant rice and soft cottage cheese goodness.',
    price: 179,
    category: 'Meals',
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80',
    tag: 'Student Favorite',
    vegetarian: true,
    available: true
  }
];

export const menuItems: MenuItem[] = [
  ...featuredFoods,
  {
    id: 'masala-dosa',
    name: 'Masala Dosa',
    description: 'Crispy golden dosa filled with spiced potato and coconut chutney.',
    price: 89,
    category: 'Breakfast',
    image:
      'https://images.unsplash.com/photo-1669149719682-50d4c8b4ca95?auto=format&fit=crop&w=900&q=80',
    tag: 'Classic',
    vegetarian: true,
    available: true
  },
  {
    id: 'poha-special',
    name: 'Poha Special',
    description: 'Soft poha cooked with peanuts, curry leaves and a zesty lemon finish.',
    price: 79,
    category: 'Breakfast',
    image:
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80',
    tag: 'Quick Bite',
    vegetarian: true,
    available: true
  },
  {
    id: 'veggie-sandwich',
    name: 'Veg Grill Sandwich',
    description: 'Toasted bread packed with veggies, cheese and a smoky herb spread.',
    price: 109,
    category: 'Snacks',
    image:
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80',
    tag: 'Popular',
    vegetarian: true,
    available: true
  },
  {
    id: 'fries-basket',
    name: 'Masala Fries Basket',
    description: 'Hot crispy fries tossed with peri-peri seasoning and lemon salt.',
    price: 99,
    category: 'Snacks',
    image:
      'https://images.unsplash.com/photo-1576106678449-b2149d5a5ca9?auto=format&fit=crop&w=900&q=80',
    tag: 'Hot',
    vegetarian: true,
    available: true
  },
  {
    id: 'paneer-biryani',
    name: 'Paneer Biryani',
    description: 'Fragrant biryani rice layered with paneer cubes, saffron and herbs.',
    price: 189,
    category: 'Meals',
    image:
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80',
    tag: 'Chef Pick',
    vegetarian: true,
    available: true
  },
  {
    id: 'dal-rice',
    name: 'Dal Rice Combo',
    description: 'Comforting yellow dal with steamed rice and pickle on the side.',
    price: 129,
    category: 'Meals',
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80',
    tag: 'Protein',
    vegetarian: true,
    available: true
  },
  {
    id: 'mango-smoothie',
    name: 'Mango Smoothie',
    description: 'Rich mango blended with yogurt, mint and a splash of tropical goodness.',
    price: 109,
    category: 'Beverages',
    image:
      'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80',
    tag: 'Fresh',
    vegetarian: true,
    available: true
  },
  {
    id: 'lemon-mint-soda',
    name: 'Lemon Mint Soda',
    description: 'Cold, fizzy and refreshing with fresh mint and a citrus zing.',
    price: 69,
    category: 'Beverages',
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80',
    tag: 'Cool',
    vegetarian: true,
    available: true
  },
  {
    id: 'choco-brownie',
    name: 'Choco Brownie',
    description: 'Warm brownie with a gooey middle and a crunchy top layer.',
    price: 119,
    category: 'Desserts',
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
    tag: 'Sweet',
    vegetarian: true,
    available: true
  },
  {
    id: 'gulab-jamun',
    name: 'Gulab Jamun',
    description: 'Soft, syrupy dessert bites finished with cardamom and rose notes.',
    price: 79,
    category: 'Desserts',
    image:
      'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=900&q=80',
    tag: 'Classic',
    vegetarian: true,
    available: true
  },
  {
    id: 'cheese-burger',
    name: 'Cheese Burst Burger',
    description: 'Double patty, melted cheese and house sauce in a toasted bun.',
    price: 169,
    category: 'Fast Food',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
    tag: 'Fan Pick',
    vegetarian: false,
    available: true
  },
  {
    id: 'veggie-pizza-slice',
    name: 'Veggie Pizza Slice',
    description: 'Loaded with mozzarella, capsicum, olives and herbed tomato sauce.',
    price: 139,
    category: 'Fast Food',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80',
    tag: 'Popular',
    vegetarian: true,
    available: true
  }
];

export const todaySpecial = {
  name: 'BellBite Combo Feast',
  description: 'A balanced combo of paneer wrap, masala fries and mango cooler for only ₹399.',
  price: 399,
  image:
    'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80'
};

export const testimonials = [
  {
    name: 'Aisha',
    course: 'B.Tech CSE',
    quote:
      'BellBite Campus saved me from queue stress during exam week. The food is fresh, fast, and surprisingly affordable.'
  },
  {
    name: 'Rohan',
    course: 'MBA Student',
    quote:
      'The interface is super easy to use and the tracking flow feels premium. It feels like a real food-tech app.'
  },
  {
    name: 'Neha',
    course: 'Design Student',
    quote:
      'I can order my favourite snacks in under a minute and pick up my batch without wasting any lecture time.'
  }
];

export const benefits = [
  'One-tap ordering from any campus building',
  'Faster pickup with order tracking and prep alerts',
  'Smart menu sorting for breakfast, lunch and late-night cravings',
  'Student-first pricing and favorite meal quick access'
];

export const howSteps = [
  'Explore the Menu',
  'Add Your Favourite Food',
  'Place Your Order',
  'Pick Up When Ready'
];
