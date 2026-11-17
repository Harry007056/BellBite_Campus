import { ArrowRight, Coffee, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../../components/layout/Footer';
import { Navbar } from '../../components/layout/Navbar';
import { FoodCard } from '../../components/food/FoodCard';
import { categories, menuItems } from '../../data/mockData';

export function ViewMenuPage() {
  return (
    <div className="min-h-screen bg-[#FFF3E7] text-[#4A2922]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-[#F1D7C8] bg-[#FFF9F4] p-8 shadow-[0_20px_50px_rgba(74,41,34,0.06)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#963F2B]">View menu</p>
              <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">BellBite Campus favourites</h1>
            </div>
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 rounded-full bg-[#963F2B] px-5 py-3 font-semibold text-white shadow-lg shadow-[#963F2B]/20"
            >
              View my order <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <section className="mt-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-3xl font-semibold text-[#4A2922]">Browse by category</h2>
            <div className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#963F2B] shadow-sm md:flex">
              <Sparkles size={15} /> Fresh and quick campus meals
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/menu/${category.slug}`}
                className={`rounded-[28px] border border-[#F0D5C8] ${category.accent} p-6 shadow-sm transition-transform hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{category.emoji}</span>
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#963F2B]">
                    {category.name}
                  </span>
                </div>
                <h3 className="mt-5 text-2xl font-bold text-[#4A2922]">{category.name}</h3>
                <p className="mt-3 text-sm leading-6 text-[#55413D]">{category.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#963F2B]">
                  Explore now <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-6 flex items-center gap-3">
            <Coffee className="text-[#963F2B]" />
            <h2 className="font-display text-3xl font-semibold text-[#4A2922]">All menu favourites</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {menuItems.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
