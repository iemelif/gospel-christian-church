import { wrap } from "@/lib/ui";

export default function PageHero({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand-2))] pt-9 pb-10 text-onbrand [&_:focus-visible]:outline-gold">
      <div className={wrap}>
        <h1 className="text-[length:clamp(30px,5vw,46px)]">{title}</h1>
        {intro && <p className="mt-2.5 mb-0 text-[#f4dbe1]">{intro}</p>}
      </div>
    </div>
  );
}
