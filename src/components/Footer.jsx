export default function Footer() {
  return (
    <footer className="mt-10 bg-neutral-800 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-3">
        {[
          ["About", ["How it works", "Featured", "Partnership"]],
          ["Community", ["Events", "Blog", "Invite a friend"]],
          ["Support", ["Help Center", "Safety", "Cancellation"]],
        ].map(([title, links]) => (
          <div key={title}>
            <h5 className="mb-3 font-semibold text-white">{title}</h5>
            {links.map((l) => (
              <p key={l} className="mb-1 cursor-pointer text-sm hover:text-white">{l}</p>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-sm">
        <span className="font-bold text-rose-500">StayEasy</span> · © {new Date().getFullYear()} All rights reserved.
      </div>
    </footer>
  );
}