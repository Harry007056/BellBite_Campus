import type { MenuItem } from '../../data/mockData';

type FoodCardProps = {
  food: MenuItem;
};

export function FoodCard({ food }: FoodCardProps) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-[#F2D8CC] bg-white shadow-[0_20px_40px_rgba(86,46,34,0.08)] transition-transform duration-200 hover:-translate-y-1">
      <div className="relative">
        <img src={food.image} alt={food.name} className="h-52 w-full object-cover" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#963F2B] shadow-sm">
          {food.tag}
        </span>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#C96C4B]">{food.category}</p>
            <h3 className="mt-2 text-xl font-bold text-[#4A2922]">{food.name}</h3>
          </div>
          <span className="rounded-full bg-[#FFF3E7] px-3 py-1 text-sm font-semibold text-[#963F2B]">
            ₹{food.price}
          </span>
        </div>

        <p className="text-sm leading-6 text-[#5C3D37]">{food.description}</p>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-[#4A2922]">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            {food.available ? 'Available now' : 'Unavailable'}
          </div>

          <button
            type="button"
            className="rounded-full bg-[#963F2B] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
