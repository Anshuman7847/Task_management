const PageHeader = ({ eyebrow, title, description, actions }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div className="max-w-2xl">
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">{eyebrow}</p> : null}
      <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">{title}</h1>
      {description ? <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p> : null}
    </div>
    {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
  </div>
);

export default PageHeader;
