export default function PageHero({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="page-hero">
      <div className="wrap">
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
    </div>
  );
}
