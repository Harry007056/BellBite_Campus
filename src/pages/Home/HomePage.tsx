import { ArrowRight, BadgeCheck, Clock3, HeartHandshake, Leaf, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FoodCard } from '../../components/food/FoodCard';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Footer } from '../../components/layout/Footer';
import { Navbar } from '../../components/layout/Navbar';
import {
  benefits,
  categories,
  featuredFoods,
  howSteps,
  testimonials,
  todaySpecial
} from '../../data/mockData';

export function HomePage() {
  return (
    <div className="min-h-screen bg-[#FFF3E7] text-[#4A2922]">
      <Navbar />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(201,108,75,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(255,138,53,0.15),_transparent_30%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr,0.8fr] lg:px-8 lg:py-24">
            <div className="flex flex-col justify-center">
              <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#FBE7D6] px-4 py-2 text-sm font-semibold text-[#963F2B] shadow-sm">
                <BadgeCheck size={16} />
                Campus food, delivered with speed
              </span>

              <h1 className="max-w-xl font-display text-4xl font-semibold leading-tight text-[#4A2922] md:text-6xl">
                Your Campus Cravings, <span className="text-[#963F2B]">Just a Click Away!</span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-[#5B3B35]">
                BellBite Campus brings fast, fresh and student-friendly food ordering to every lecture break, all without waiting in long canteen queues.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link to="/menu" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#963F2B] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#963F2B]/20 transition-transform hover:scale-[1.02]">
                  Browse Menu
                  <ArrowRight size={18} />
                </Link>
                <Link to="/orders" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D48B6F] bg-white px-6 py-3.5 text-base font-semibold text-[#4A2922] shadow-sm transition-colors hover:bg-[#FDE7DE]">
                  Order Now
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-6 text-sm text-[#603C35]">
                <div className="flex items-center gap-2"><Leaf size={18} className="text-[#C96C4B]" />Fresh ingredients</div>
                <div className="flex items-center gap-2"><Clock3 size={18} className="text-[#C96C4B]" />Pickup in 15 mins</div>
                <div className="flex items-center gap-2"><Star size={18} className="text-[#C96C4B]" />4.9 student rating</div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-8 top-12 h-24 w-24 rounded-full bg-[#FF8A35]/20 blur-2xl" />
              <div className="absolute -right-6 bottom-8 h-24 w-24 rounded-full bg-[#963F2B]/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-[30px] border border-[#F1D3C0] bg-white p-5 shadow-[0_40px_80px_rgba(74,41,34,0.12)]">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80"
                  alt="Fresh campus food"
                  className="h-[520px] w-full rounded-[24px] object-cover"
                />
                <div className="absolute left-10 top-10 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#963F2B] shadow-lg">
                  Beat the Bell. Grab a Bite!
                </div>
                <div className="absolute bottom-8 left-8 rounded-[24px] bg-[#4A2922]/85 p-4 text-white shadow-xl backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#F3C7A8]">Today’s special</p>
                  <p className="mt-1 text-2xl font-bold">₹399</p>
                  <p className="mt-2 max-w-[220px] text-sm text-[#F0D7CE]">Combo Feast with wrap, fries and cooling drink</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Popular categories"
            title="Campus favourites for every mood"
            description="From breakfast bites to dessert treats, BellBite Campus keeps the canteen menu fast, flexible and student-friendly."
            align="center"
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <div key={category.name} className={`rounded-[28px] border border-[#F5D8C7] ${category.accent} p-6 shadow-sm`}>
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{category.emoji}</span>
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-[#963F2B]">{category.name}</span>
                </div>
                <h3 className="mt-5 text-2xl font-bold text-[#4A2922]">{category.name}</h3>
                <p className="mt-3 text-sm leading-6 text-[#4F3B36]">{category.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#FDEFE9] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Featured picks"
              title="Fresh favourites students keep ordering"
              description="Smart menu highlights designed around campus cravings, class schedules and busy midday breaks."
            />

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {featuredFoods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[30px] border border-[#F1D3C0] bg-[#4A2922] text-white shadow-[0_30px_60px_rgba(54,29,26,0.15)] lg:grid lg:grid-cols-[1.1fr,0.9fr]">
            <div className="p-8 md:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F8C0A1]">Today’s special</p>
              <h3 className="mt-4 font-display text-3xl font-semibold md:text-4xl">{todaySpecial.name}</h3>
              <p className="mt-4 max-w-lg text-base leading-7 text-[#F5D7CD]">{todaySpecial.description}</p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <span className="rounded-full bg-[#FF8A35] px-4 py-2 text-xl font-bold">₹{todaySpecial.price}</span>
                <Link to="/menu" className="rounded-full border border-[#F9B892] bg-white/10 px-5 py-3 font-semibold text-white">
                  Claim today’s deal
                </Link>
              </div>
            </div>

            <img
              src={todaySpecial.image}
              alt={todaySpecial.name}
              className="h-full min-h-[280px] w-full object-cover"
            />
          </div>
        </section>

        <section id="how-it-works" className="bg-[#FFF9F4] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="How it works"
              title="From menu browse to pickup in four quick steps"
              description="BellBite Campus keeps ordering clear, useful and surprisingly fast, even during exam rushes."
              align="center"
            />

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {howSteps.map((step, index) => (
                <div key={step} className="rounded-[28px] border border-[#F2D7C9] bg-white p-6 shadow-sm">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#963F2B] text-lg font-bold text-white">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-[#4A2922]">{step}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#5C3D37]">
                    {index === 0 && 'Browse curated campus favourites and filter by category or craving.'}
                    {index === 1 && 'Add your favourite items and make quick quantity adjustments in the cart.'}
                    {index === 2 && 'Select payment, review the order and confirm your pickup timing.'}
                    {index === 3 && 'Track the order and collect it when the canteen marks it ready.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Why students love it"
            title="Made for smooth campus dining experiences"
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="rounded-[26px] border border-[#F1D5C4] bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF3E7] text-[#963F2B]">
                  <HeartHandshake size={18} />
                </div>
                <p className="text-base font-medium leading-7 text-[#4A2922]">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#FDEFE9] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Student stories"
              title="A food experience built for campus life"
              align="center"
            />

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((person) => (
                <div key={person.name} className="rounded-[28px] border border-[#F2D5C5] bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#963F2B] text-lg font-bold text-white">
                      {person.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#4A2922]">{person.name}</p>
                      <p className="text-sm text-[#7A5A53]">{person.course}</p>
                    </div>
                  </div>
                  <p className="text-base leading-7 text-[#4E3936]">“{person.quote}”</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[30px] bg-[#FFF3E7] p-8 shadow-[0_24px_50px_rgba(116,64,50,0.08)] ring-1 ring-[#F0D5C8] md:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C96C4B]">Stay hungry, stay happy</p>
                <h3 className="mt-3 font-display text-3xl font-semibold text-[#4A2922] md:text-4xl">Ready to skip the queue?</h3>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/orders" className="rounded-full bg-[#963F2B] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#963F2B]/20">
                  Start ordering
                </Link>
                <Link to="/menu" className="rounded-full border border-[#DDA58A] bg-white px-6 py-3.5 font-semibold text-[#4A2922]">
                  View menu
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
