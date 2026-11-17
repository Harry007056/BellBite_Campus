import { ArrowLeft, Filter, ShoppingCart } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Footer } from '../../components/layout/Footer';
import { Navbar } from '../../components/layout/Navbar';
import { FoodCard } from '../../components/food/FoodCard';
import { categories, menuItems } from '../../data/mockData';

export function CategoryPage() {
  const { categorySlug } = useParams();

  const category = categories.find((item) => item.slug === categorySlug) ?? categories[0];
  const items = menuItems.filter((item) => item.category === category.name);

  return (
    <div className="min-h-screen bg-[#FFF3E7] text-[#4A2922]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className={`rounded-[30px] border border-[#F0D5C8] ${category.accent} p-8 shadow-sm`}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Link to="/menu" className="inline-flex items-center gap-2 text-sm font-semibold text-[#963F2B]">
                <ArrowLeft size={16} /> Back to menu
              </Link>
              <div className="mt-4 flex items-center gap-4">
                <span className="text-4xl">{category.emoji}</span>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#963F2B]">Category</p>
                  <h1 className="font-display text-4xl font-semibold">{category.name}</h1>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#4A2922] shadow-sm">
              <Filter size={16} /> {items.length} items available
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-base text-[#614B46]">{category.description}</p>
          <Link to="/orders" className="inline-flex items-center gap-2 rounded-full bg-[#963F2B] px-4 py-2.5 font-semibold text-white">
            <ShoppingCart size={16} /> Checkout
          </Link>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {items.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
