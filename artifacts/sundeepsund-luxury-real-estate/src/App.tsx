import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ArrowDownRight, ArrowRight, Building2, Check, ChevronDown, ChevronUp, Home as HomeIcon, Mail, MapPin, Menu, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const listings = [
  { id: 1, title: 'The Cedar House', area: 'North Vancouver', type: 'Single Family', price: 2495000, beds: 4, baths: 3, sqft: '2,418', image: '/hero-vancouver.jpg', featured: true },
  { id: 2, title: 'Pacific Pearl', area: 'Kitsilano', type: 'Condo', price: 1098000, beds: 2, baths: 2, sqft: '1,012', image: '/feature-home.jpg', featured: false },
  { id: 3, title: 'Maplewood Residence', area: 'East Vancouver', type: 'Townhouse', price: 1395000, beds: 3, baths: 3, sqft: '1,486', image: '/communities.jpg', featured: false },
  { id: 4, title: 'Coal Harbour Outlook', area: 'Downtown Vancouver', type: 'Condo', price: 1795000, beds: 2, baths: 2, sqft: '1,104', image: '/hero-vancouver.jpg', featured: false },
  { id: 5, title: 'The Alder Collection', area: 'Burnaby', type: 'Multi-family', price: 2180000, beds: 6, baths: 4, sqft: '3,260', image: '/feature-home.jpg', featured: true },
  { id: 6, title: 'Kerrisdale Garden Suite', area: 'Kerrisdale', type: 'Duplex', price: 1985000, beds: 4, baths: 3, sqft: '2,077', image: '/communities.jpg', featured: false },
];
const communities = [
  { name: 'North Vancouver', note: 'Forest trails, harbour views, and a quieter pace.', image: '/hero-vancouver.jpg' },
  { name: 'Kitsilano', note: 'Beach days, character homes, and an easy west-side rhythm.', image: '/feature-home.jpg' },
  { name: 'East Vancouver', note: 'Independent spirit, vibrant streets, and room to grow.', image: '/communities.jpg' },
  { name: 'Burnaby', note: 'Connected, considered, and made for the next chapter.', image: '/hero-vancouver.jpg' },
];

function useCountUp(target: number) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let current = 0;
    const timer = window.setInterval(() => {
      current += Math.ceil(target / 24);
      if (current >= target) { current = target; window.clearInterval(timer); }
      setValue(current);
    }, 40);
    return () => window.clearInterval(timer);
  }, [target]);
  return value;
}

function Meta({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = title;
    const tag = document.querySelector('meta[name="description"]') ?? document.createElement('meta');
    tag.setAttribute('name', 'description');
    tag.setAttribute('content', description);
    document.head.appendChild(tag);
  }, [title, description]);
  return null;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const nav = [['Properties', '/properties'], ['Communities', '/communities'], ['Services', '/services'], ['About Sunny', '/about']];
  return (
    <header className={`fixed top-0 z-40 w-full transition-all ${scrolled ? 'nav-scrolled' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-[76px] max-w-[1380px] items-center justify-between px-5 md:px-10">
        <Link href="/" onClick={() => setOpen(false)} className="group flex items-center gap-3" data-testid="link-brand">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[hsl(var(--secondary))] text-[hsl(var(--secondary))]"><span className="font-serif text-xl italic">S</span></span>
          <span className={`hidden text-xs tracking-[.16em] md:block ${scrolled || location !== '/' ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--background))]'}`}>SUNNY SUND <span className="opacity-50">/</span> REALTOR®</span>
        </Link>
        <nav className={`hidden items-center gap-8 lg:flex ${scrolled || location !== '/' ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--background))]'}`}>
          {nav.map(([label, href]) => <Link key={href} href={href} className="line-link text-[11px] uppercase tracking-[.15em] opacity-80 hover:opacity-100" data-testid={`link-nav-${label.toLowerCase().replace(' ', '-')}`}>{label}</Link>)}
        </nav>
        <div className="hidden lg:block">
          <Link href="/contact" className={`rounded-full px-5 py-3 text-[11px] uppercase tracking-[.15em] transition hover:-translate-y-0.5 ${scrolled || location !== '/' ? 'bg-[hsl(var(--primary))] text-[hsl(var(--background))]' : 'bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]'}`} data-testid="link-header-contact">Let's talk <ArrowRight className="ml-2 inline h-3.5 w-3.5" /></Link>
        </div>
        <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)} className={`lg:hidden ${scrolled || location !== '/' ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--background))]'}`} data-testid="button-mobile-menu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="border-t border-[hsl(var(--border))] bg-[hsl(var(--background))] px-5 pb-7 pt-4 text-[hsl(var(--primary))] shadow-xl lg:hidden">
        {nav.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-[hsl(var(--border))] py-4 text-sm uppercase tracking-[.15em]" data-testid={`link-mobile-${label.toLowerCase().replace(' ', '-')}`}>{label}</Link>)}
        <Link href="/contact" onClick={() => setOpen(false)} className="mt-5 inline-flex items-center rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-xs uppercase tracking-[.15em] text-[hsl(var(--background))]" data-testid="link-mobile-contact">Start a conversation <ArrowRight className="ml-2 h-4 w-4" /></Link>
      </div>}
    </header>
  );
}

function Footer() {
  return <footer className="bg-[hsl(var(--primary))] px-5 py-14 text-[hsl(var(--background))] md:px-10 md:py-20">
    <div className="mx-auto max-w-[1380px]">
      <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div><div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full border border-[hsl(var(--secondary))] text-[hsl(var(--secondary))]"><span className="font-serif text-xl italic">S</span></span><span className="text-xs tracking-[.16em]">SUNNY SUND</span></div><p className="max-w-xs text-sm leading-7 text-[hsl(var(--background)/.65)]">A considered approach to Vancouver real estate, grounded in local knowledge and clear advice.</p></div>
        <div><p className="eyebrow mb-5 text-[hsl(var(--secondary))]">Explore</p><div className="grid gap-3 text-sm text-[hsl(var(--background)/.7)]"><Link href="/properties" className="hover:text-[hsl(var(--background))]" data-testid="link-footer-properties">Properties</Link><Link href="/communities" className="hover:text-[hsl(var(--background))]" data-testid="link-footer-communities">Communities</Link><Link href="/services" className="hover:text-[hsl(var(--background))]" data-testid="link-footer-services">Services</Link></div></div>
        <div><p className="eyebrow mb-5 text-[hsl(var(--secondary))]">Connect</p><div className="grid gap-3 text-sm text-[hsl(var(--background)/.7)]"><Link href="/about" className="hover:text-[hsl(var(--background))]" data-testid="link-footer-about">About Sunny</Link><Link href="/contact" className="hover:text-[hsl(var(--background))]" data-testid="link-footer-contact">Contact</Link><a href="mailto:hello@sunnysund.com" className="hover:text-[hsl(var(--background))]" data-testid="link-footer-email">Email Sunny</a></div></div>
        <div><p className="eyebrow mb-5 text-[hsl(var(--secondary))]">Based in</p><p className="text-sm leading-7 text-[hsl(var(--background)/.7)]">Vancouver, British Columbia<br />Serving Greater Vancouver</p></div>
      </div>
      <div className="mt-16 flex flex-col justify-between gap-4 border-t border-[hsl(var(--background)/.15)] pt-6 text-[10px] uppercase tracking-[.13em] text-[hsl(var(--background)/.4)] md:flex-row"><span>© 2024 Sunny Sund · REALTOR® with eXp Realty - Greater Vancouver</span><span>Privacy · Accessibility</span></div>
    </div>
  </footer>;
}

function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <section className="bg-[hsl(var(--primary))] px-5 pb-20 pt-36 text-[hsl(var(--background))] md:px-10 md:pb-28"><div className="mx-auto max-w-[1380px]"><p className="eyebrow mb-6 text-[hsl(var(--secondary))] reveal">{eyebrow}</p><h1 className="display-serif max-w-4xl text-5xl leading-[.98] md:text-7xl reveal reveal-delay-1">{title}</h1><p className="mt-8 max-w-xl text-base leading-7 text-[hsl(var(--background)/.65)] reveal reveal-delay-2">{copy}</p></div></section>;
}

function Home() {
  const sold = useCountUp(214);
  const years = useCountUp(12);
  const [query, setQuery] = useState('');
  return <div className="grain overflow-hidden">
    <Meta title="Sunny Sund | Vancouver REALTOR®" description="Thoughtful guidance for buying, selling, and living well across Greater Vancouver with Sunny Sund, REALTOR®." />
    <section className="relative min-h-[760px] overflow-hidden bg-[hsl(var(--primary))] text-[hsl(var(--background))]">
      <img src="/hero-vancouver.jpg" alt="Modern Vancouver home overlooking the North Shore mountains" className="hero-drift absolute inset-0 h-full w-full object-cover opacity-65" />
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary)/.9)] via-[hsl(var(--primary)/.4)] to-transparent" />
      <Header />
      <div className="relative mx-auto flex min-h-[760px] max-w-[1380px] items-end px-5 pb-24 pt-36 md:px-10 md:pb-32">
        <div className="max-w-3xl"><p className="eyebrow mb-7 text-[hsl(var(--secondary))] reveal">Vancouver real estate, considered</p><h1 className="display-serif text-6xl leading-[.9] md:text-8xl reveal reveal-delay-1">Find your<br /><em className="text-[hsl(var(--secondary))]">place</em> here.</h1><p className="mt-8 max-w-md text-base leading-7 text-[hsl(var(--background)/.75)] reveal reveal-delay-2">Thoughtful guidance for buying, selling, and living well across Greater Vancouver.</p><Link href="/properties" className="mt-9 inline-flex items-center rounded-full bg-[hsl(var(--secondary))] px-6 py-4 text-xs uppercase tracking-[.14em] text-[hsl(var(--primary))] transition hover:-translate-y-1 reveal reveal-delay-3" data-testid="link-hero-search">Explore the market <ArrowDownRight className="ml-3 h-4 w-4" /></Link></div>
        <div className="absolute bottom-10 right-10 hidden items-center gap-3 text-[10px] uppercase tracking-[.17em] text-[hsl(var(--background)/.6)] md:flex"><span className="h-px w-12 bg-[hsl(var(--background)/.4)]" /> Vancouver · BC</div>
      </div>
    </section>
    <section className="relative z-10 mx-5 -mt-8 rounded-2xl bg-[hsl(var(--background))] p-5 shadow-[0_15px_60px_rgba(17,38,47,.12)] md:mx-auto md:max-w-5xl md:p-7">
      <div className="mb-4 flex items-center justify-between"><span className="eyebrow text-[hsl(var(--accent))]">Start your search</span><span className="text-xs text-[hsl(var(--muted-foreground))]">Updated daily · Greater Vancouver</span></div>
      <div className="flex flex-col gap-3 md:flex-row"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by neighbourhood, address, or MLS®" className="h-14 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] pl-11 pr-4 text-sm outline-none transition focus:border-[hsl(var(--accent))]" data-testid="input-hero-search" /></div><Link href={`/properties${query ? `?search=${encodeURIComponent(query)}` : ''}`} className="flex h-14 items-center justify-center rounded-xl bg-[hsl(var(--primary))] px-7 text-xs uppercase tracking-[.14em] text-[hsl(var(--background))] transition hover:bg-[hsl(var(--accent))]" data-testid="link-search-submit">Search homes <ArrowRight className="ml-3 h-4 w-4" /></Link></div>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[hsl(var(--muted-foreground))]"><span>Looking for</span>{['Single family','Condos','Townhouses','Multi-family'].map(item => <Link key={item} href={`/properties?type=${encodeURIComponent(item)}`} className="line-link hover:text-[hsl(var(--primary))]" data-testid={`link-search-${item.toLowerCase().replace('-', '')}`}>{item}</Link>)}</div>
    </section>
    <section className="px-5 py-24 md:px-10 md:py-36"><div className="mx-auto grid max-w-[1380px] gap-14 md:grid-cols-[.8fr_1.2fr] md:items-end"><div><p className="eyebrow mb-6 text-[hsl(var(--accent))]">The Sunny point of view</p><h2 className="display-serif max-w-xl text-5xl leading-[.98] md:text-7xl">A home is more than a <em>listing.</em></h2></div><div><p className="max-w-lg text-lg leading-8 text-[hsl(var(--muted-foreground))]">It is the backdrop for your next season. My role is to make the decisions around it feel clear, informed, and quietly confident — whether you are buying your first condo or making a meaningful move.</p><Link href="/about" className="mt-8 inline-flex items-center text-xs uppercase tracking-[.15em] text-[hsl(var(--accent))] line-link" data-testid="link-home-about">Meet Sunny <ArrowRight className="ml-3 h-4 w-4" /></Link></div></div></section>
    <section className="bg-[hsl(var(--muted))] px-5 py-20 md:px-10 md:py-28"><div className="mx-auto max-w-[1380px]"><div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow mb-5 text-[hsl(var(--accent))]">A few places to begin</p><h2 className="display-serif text-5xl md:text-6xl">Featured homes</h2></div><Link href="/properties" className="inline-flex items-center text-xs uppercase tracking-[.15em] line-link" data-testid="link-featured-all">View all properties <ArrowRight className="ml-3 h-4 w-4" /></Link></div><div className="grid gap-5 md:grid-cols-3">{listings.slice(0,3).map((home, i) => <PropertyCard key={home.id} home={home} index={i} />)}</div></div></section>
    <section className="px-5 py-24 md:px-10 md:py-36"><div className="mx-auto grid max-w-[1380px] gap-12 md:grid-cols-[.9fr_1.1fr] md:items-center"><div className="image-frame relative overflow-hidden rounded-2xl"><img src="/feature-home.jpg" alt="Bright west coast living room with oak and stone" className="aspect-[4/3] w-full object-cover" /><div className="absolute bottom-5 left-5 rounded-full bg-[hsl(var(--background)/.9)] px-4 py-2 text-[10px] uppercase tracking-[.15em]">West Coast living</div></div><div className="md:pl-12"><p className="eyebrow mb-6 text-[hsl(var(--accent))]">Advice that earns its place</p><h2 className="display-serif max-w-xl text-5xl leading-[1] md:text-6xl">Local knowledge.<br /><em>Human</em> attention.</h2><p className="mt-7 max-w-lg leading-7 text-[hsl(var(--muted-foreground))]">The market moves quickly. Your decisions do not have to. I bring a measured process, honest context, and a deep understanding of the neighbourhoods that make up this city.</p><div className="mt-10 grid grid-cols-2 gap-8 border-t border-[hsl(var(--border))] pt-7"><div><strong className="display-serif text-5xl">{sold}+</strong><p className="mt-2 text-xs uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))]">homes guided</p></div><div><strong className="display-serif text-5xl">{years}</strong><p className="mt-2 text-xs uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))]">years in market</p></div></div></div></div></section>
    <section className="bg-[hsl(var(--primary))] px-5 py-24 text-[hsl(var(--background))] md:px-10 md:py-32"><div className="mx-auto max-w-[1380px]"><div className="grid gap-12 md:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow mb-6 text-[hsl(var(--secondary))]">Neighbourhood notes</p><h2 className="display-serif text-5xl leading-[1] md:text-6xl">Vancouver,<br /><em>in detail.</em></h2><Link href="/communities" className="mt-8 inline-flex items-center text-xs uppercase tracking-[.15em] text-[hsl(var(--secondary))] line-link" data-testid="link-home-communities">Explore communities <ArrowRight className="ml-3 h-4 w-4" /></Link></div><div className="grid gap-4 sm:grid-cols-2">{communities.slice(0,4).map((community) => <Link href="/communities" key={community.name} className="group relative min-h-[220px] overflow-hidden rounded-xl" data-testid={`card-home-community-${community.name.toLowerCase().replace(' ','-')}`}><img src={community.image} alt={community.name} className="absolute inset-0 h-full w-full object-cover opacity-65 transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary)/.9)] to-transparent" /><div className="absolute bottom-5 left-5 right-5"><h3 className="display-serif text-3xl">{community.name}</h3><p className="mt-1 text-xs text-[hsl(var(--background)/.65)]">{community.note}</p></div></Link>)}</div></div></div></section>
    <section className="px-5 py-24 md:px-10 md:py-32"><div className="mx-auto max-w-[900px] text-center"><p className="eyebrow mb-6 text-[hsl(var(--accent))]">A good next step</p><h2 className="display-serif text-5xl leading-[1] md:text-7xl">Let’s make room<br /><em>for what’s next.</em></h2><p className="mx-auto mt-7 max-w-lg leading-7 text-[hsl(var(--muted-foreground))]">Tell me what you are considering. No pressure, no polished pitch — just a useful first conversation.</p><Link href="/contact" className="mt-9 inline-flex items-center rounded-full bg-[hsl(var(--primary))] px-7 py-4 text-xs uppercase tracking-[.15em] text-[hsl(var(--background))] transition hover:-translate-y-1" data-testid="link-home-contact">Start a conversation <ArrowRight className="ml-3 h-4 w-4" /></Link></div></section>
    <Footer />
  </div>;
}

function PropertyCard({ home, index = 0 }: { home: typeof listings[number]; index?: number }) {
  return <article className={`group ${index === 1 ? 'md:mt-12' : ''}`} data-testid={`card-property-${home.id}`}><Link href={`/properties/${home.id}`} className="block"><div className="image-frame relative overflow-hidden rounded-xl"><img src={home.image} alt={`${home.title} in ${home.area}`} className="aspect-[4/3] w-full object-cover" /><span className="absolute left-4 top-4 rounded-full bg-[hsl(var(--background)/.9)] px-3 py-2 text-[10px] uppercase tracking-[.13em]">{home.type}</span><span className="absolute bottom-4 right-4 rounded-full bg-[hsl(var(--primary)/.9)] px-3 py-2 text-[10px] text-[hsl(var(--background))]">{home.area}</span></div><div className="flex items-start justify-between gap-4 pt-5"><div><h3 className="display-serif text-3xl">{home.title}</h3><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{home.beds} beds · {home.baths} baths · {home.sqft} sq ft</p></div><p className="whitespace-nowrap text-sm font-semibold">${home.price.toLocaleString()}</p></div></Link></article>;
}

function Properties() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All homes');
  const [max, setMax] = useState('Any price');
  const [filters, setFilters] = useState(false);
  const filtered = useMemo(() => listings.filter(item => {
    const matchSearch = !search || `${item.title} ${item.area} ${item.type}`.toLowerCase().includes(search.toLowerCase());
    const matchType = type === 'All homes' || item.type === type;
    const matchPrice = max === 'Any price' || (max === 'Under $1.5M' ? item.price < 1500000 : item.price >= 1500000);
    return matchSearch && matchType && matchPrice;
  }), [search, type, max]);
  return <div><Meta title="Properties | Sunny Sund" description="Browse Sunny Sund's curated Vancouver-area listings, including condos, single family homes, townhouses, duplexes, and more." /><Header /><PageIntro eyebrow="The collection" title="Homes with a sense of place." copy="Explore a curated selection of single family, condo, multi-family, commercial, duplex, and townhouse properties across Greater Vancouver." /><main className="bg-[hsl(var(--background))] px-5 py-12 md:px-10 md:py-20"><div className="mx-auto max-w-[1380px]"><div className="flex flex-col gap-4 border-b border-[hsl(var(--border))] pb-6 md:flex-row md:items-center md:justify-between"><div className="relative flex-1 md:max-w-md"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search neighbourhood or home" className="h-12 w-full rounded-full border border-[hsl(var(--border))] bg-transparent pl-11 pr-4 text-sm outline-none focus:border-[hsl(var(--accent))]" data-testid="input-property-search" /></div><button onClick={() => setFilters(!filters)} className="inline-flex items-center justify-center gap-2 rounded-full border border-[hsl(var(--border))] px-5 py-3 text-xs uppercase tracking-[.13em]" data-testid="button-toggle-filters"><SlidersHorizontal className="h-4 w-4" /> Filters</button><span className="text-xs text-[hsl(var(--muted-foreground))]" data-testid="text-property-count">{filtered.length} homes</span></div>{filters && <div className="grid gap-3 border-b border-[hsl(var(--border))] py-5 sm:grid-cols-2"><label className="text-xs uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))]">Property type<select value={type} onChange={e => setType(e.target.value)} className="mt-2 h-11 w-full rounded-lg border border-[hsl(var(--border))] bg-transparent px-3 text-sm normal-case tracking-normal" data-testid="select-property-type"><option>All homes</option><option>Single Family</option><option>Condo</option><option>Townhouse</option><option>Multi-family</option><option>Duplex</option></select></label><label className="text-xs uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))]">Price range<select value={max} onChange={e => setMax(e.target.value)} className="mt-2 h-11 w-full rounded-lg border border-[hsl(var(--border))] bg-transparent px-3 text-sm normal-case tracking-normal" data-testid="select-property-price"><option>Any price</option><option>Under $1.5M</option><option>$1.5M and above</option></select></label></div>}<div className="mt-12 grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((home, i) => <PropertyCard key={home.id} home={home} index={i} />)}</div>{filtered.length === 0 && <div className="py-24 text-center"><HomeIcon className="mx-auto h-8 w-8 text-[hsl(var(--accent))]" /><h3 className="display-serif mt-5 text-4xl">Nothing here yet.</h3><p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">Try another neighbourhood or widen your filters.</p><button onClick={() => { setSearch(''); setType('All homes'); setMax('Any price'); }} className="mt-6 text-xs uppercase tracking-[.15em] underline underline-offset-4" data-testid="button-clear-filters">Clear filters</button></div>}</div></main><Footer /></div>;
}

function About() {
  return <div><Meta title="About Sunny Sund | Vancouver REALTOR®" description="Meet Sunny Sund, a Vancouver REALTOR® known for local perspective, clear communication, and measured strategy." /><Header /><PageIntro eyebrow="About Sunny" title="The calm in a fast-moving market." copy="A Vancouver REALTOR® with a practical eye, a long memory for neighbourhoods, and a belief that the best advice starts with listening." /><main><section className="px-5 py-20 md:px-10 md:py-32"><div className="mx-auto grid max-w-[1100px] gap-12 md:grid-cols-[.8fr_1.2fr] md:items-center"><div className="image-frame overflow-hidden rounded-2xl"><img src="/about-portrait.jpg" alt="Sunny Sund, Vancouver REALTOR®" className="aspect-[3/4] w-full object-cover" /></div><div><p className="eyebrow mb-6 text-[hsl(var(--accent))]">A little context</p><h2 className="display-serif text-5xl leading-[1] md:text-6xl">Good real estate advice should feel <em>human.</em></h2><p className="mt-7 text-lg leading-8 text-[hsl(var(--muted-foreground))]">I have spent more than a decade learning the small signals that make Vancouver feel like Vancouver — the light on a west-facing street, the school catchment a family will grow into, the difference one block can make.</p><p className="mt-5 leading-7 text-[hsl(var(--muted-foreground))]">With eXp Realty - Greater Vancouver, I bring that local perspective together with a modern, connected way of working. You will always know what is happening, why it matters, and what comes next.</p><div className="mt-9 flex flex-wrap gap-3">{['Local perspective','Clear communication','Measured strategy'].map(item => <span key={item} className="rounded-full border border-[hsl(var(--border))] px-4 py-2 text-xs">{item}</span>)}</div></div></div></section><section className="bg-[hsl(var(--muted))] px-5 py-20 md:px-10 md:py-28"><div className="mx-auto max-w-[1100px]"><p className="eyebrow mb-10 text-[hsl(var(--accent))]">The way I work</p><div className="grid gap-8 md:grid-cols-3">{[['01','Listen first','The right strategy starts with understanding your life, not just your wish list.'],['02','Make it legible','Good advice turns complexity into a few clear, useful decisions.'],['03','Stay close','From first showing to final signature, you will never wonder where things stand.']].map(([num,title,copy]) => <div key={num} className="border-t border-[hsl(var(--border))] pt-5"><span className="font-mono text-xs text-[hsl(var(--accent))]">{num}</span><h3 className="display-serif mt-12 text-3xl">{title}</h3><p className="mt-4 text-sm leading-7 text-[hsl(var(--muted-foreground))]">{copy}</p></div>)}</div></div></section></main><Footer /></div>;
}

function Services() {
  const services = [['Buying a home','A clear-eyed search shaped around how you want to live, with thoughtful negotiation when the right place appears.'],['Selling with intention','Positioning, preparation, and a point of view that helps the right buyers see what makes your home special.'],['Relocation to Vancouver','A local introduction to the streets, schools, rituals, and practical details that turn a new city into home.'],['Property advisory','A second opinion for a purchase, sale, or investment decision that deserves more than a quick answer.']];
  return <div><Header /><PageIntro eyebrow="Advisory services" title="A steady hand for significant decisions." copy="Real estate is rarely just a transaction. Choose the kind of support that fits the move in front of you." /><main className="px-5 py-20 md:px-10 md:py-32"><div className="mx-auto max-w-[1100px]">{services.map(([title,copy], i) => <div key={title} className="group grid gap-4 border-b border-[hsl(var(--border))] py-9 md:grid-cols-[.28fr_1fr_auto] md:items-center"><span className="font-mono text-xs text-[hsl(var(--accent))]">0{i+1}</span><div><h2 className="display-serif text-4xl transition group-hover:text-[hsl(var(--accent))] md:text-5xl">{title}</h2><p className="mt-3 max-w-xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">{copy}</p></div><Link href="/contact" className="mt-3 inline-flex items-center text-xs uppercase tracking-[.13em] line-link md:mt-0" data-testid={`link-service-${i}`}>Learn more <ArrowRight className="ml-3 h-4 w-4" /></Link></div>)}</div><div className="mx-auto mt-24 max-w-[1100px] rounded-2xl bg-[hsl(var(--primary))] px-7 py-12 text-[hsl(var(--background))] md:px-14 md:py-16"><p className="eyebrow text-[hsl(var(--secondary))]">Not sure where to begin?</p><h2 className="display-serif mt-5 max-w-2xl text-5xl leading-[1] md:text-6xl">Bring me the question<br />before the <em>property.</em></h2><Link href="/contact" className="mt-8 inline-flex items-center rounded-full bg-[hsl(var(--secondary))] px-6 py-4 text-xs uppercase tracking-[.13em] text-[hsl(var(--primary))]" data-testid="link-services-contact">Let's talk <ArrowRight className="ml-3 h-4 w-4" /></Link></div></main><Footer /></div>;
}

function Communities() {
  const [active, setActive] = useState(0);
  return <div><Header /><PageIntro eyebrow="Neighbourhood guide" title="The city is made of small worlds." copy="Vancouver-area expertise goes beyond a pin on a map. Spend a little time with the places that might become yours." /><main><section className="px-5 py-16 md:px-10 md:py-24"><div className="mx-auto max-w-[1380px]"><div className="grid gap-4 md:grid-cols-4">{communities.map((community, i) => <button key={community.name} onClick={() => setActive(i)} className={`border-t pt-4 text-left transition ${active === i ? 'border-[hsl(var(--accent))]' : 'border-[hsl(var(--border))]'}`} data-testid={`button-community-${i}`}><span className="font-mono text-xs text-[hsl(var(--accent))]">0{i+1}</span><h2 className="display-serif mt-8 text-3xl">{community.name}</h2><p className="mt-2 text-xs leading-5 text-[hsl(var(--muted-foreground))]">{community.note}</p></button>)}</div><div className="mt-10 grid gap-8 md:grid-cols-[1.25fr_.75fr] md:items-end"><div className="image-frame overflow-hidden rounded-2xl"><img src={communities[active].image} alt={`${communities[active].name} neighbourhood in Vancouver`} className="aspect-[16/9] w-full object-cover" /></div><div className="pb-4"><p className="eyebrow text-[hsl(var(--accent))]">A local read</p><h3 className="display-serif mt-5 text-4xl">“The details are what make a neighbourhood feel like yours.”</h3><p className="mt-5 text-sm leading-7 text-[hsl(var(--muted-foreground))]">Let’s walk it together. I can help you compare the daily rhythm, housing stock, and future potential of each place on your list.</p><Link href="/contact" className="mt-7 inline-flex items-center text-xs uppercase tracking-[.13em] line-link" data-testid="link-community-contact">Plan a neighbourhood tour <ArrowRight className="ml-3 h-4 w-4" /></Link></div></div></div></section><section className="bg-[hsl(var(--muted))] px-5 py-20 md:px-10"><div className="mx-auto grid max-w-[1100px] gap-10 md:grid-cols-3"><div><MapPin className="h-5 w-5 text-[hsl(var(--accent))]" /><h3 className="display-serif mt-5 text-3xl">West side</h3><p className="mt-3 text-sm leading-7 text-[hsl(var(--muted-foreground))]">Kitsilano, Kerrisdale, Dunbar, Point Grey and beyond.</p></div><div><Building2 className="h-5 w-5 text-[hsl(var(--accent))]" /><h3 className="display-serif mt-5 text-3xl">City & east</h3><p className="mt-3 text-sm leading-7 text-[hsl(var(--muted-foreground))]">The Drive, Mount Pleasant, East Vancouver, Burnaby.</p></div><div><Sparkles className="h-5 w-5 text-[hsl(var(--accent))]" /><h3 className="display-serif mt-5 text-3xl">North shore</h3><p className="mt-3 text-sm leading-7 text-[hsl(var(--muted-foreground))]">North Vancouver, West Vancouver and the mountains close by.</p></div></div></section></main><Footer /></div>;
}

function Contact() {
  const [sent, setSent] = useState(false);
  return <div><Header /><PageIntro eyebrow="Start a conversation" title="Tell me what you are considering." copy="A first conversation can be as simple as a question. Share a little context and Sunny will be in touch shortly." /><main className="px-5 py-20 md:px-10 md:py-32"><div className="mx-auto grid max-w-[1100px] gap-14 md:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow text-[hsl(var(--accent))]">Reach Sunny</p><div className="mt-8 space-y-5 text-sm text-[hsl(var(--muted-foreground))]"><a href="mailto:hello@sunnysund.com" className="flex items-center gap-3 hover:text-[hsl(var(--primary))]" data-testid="link-contact-email"><Mail className="h-4 w-4 text-[hsl(var(--accent))]" /> hello@sunnysund.com</a><p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-[hsl(var(--accent))]" /> Vancouver, British Columbia</p><p className="leading-7">Available for buyers, sellers, relocations, and thoughtful second opinions across Greater Vancouver.</p></div></div>{sent ? <div className="rounded-2xl bg-[hsl(var(--muted))] p-10"><Check className="h-7 w-7 text-[hsl(var(--accent))]" /><h2 className="display-serif mt-6 text-5xl">Message received.</h2><p className="mt-4 leading-7 text-[hsl(var(--muted-foreground))]">Thank you for reaching out. Sunny will be in touch soon.</p><button onClick={() => setSent(false)} className="mt-8 text-xs uppercase tracking-[.14em] underline underline-offset-4" data-testid="button-send-another">Send another note</button></div> : <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-7"><div className="grid gap-7 sm:grid-cols-2"><label className="text-xs uppercase tracking-[.13em]">Your name<input required name="name" className="mt-3 h-12 w-full border-b border-[hsl(var(--border))] bg-transparent text-base outline-none focus:border-[hsl(var(--accent))]" data-testid="input-contact-name" /></label><label className="text-xs uppercase tracking-[.13em]">Email address<input required type="email" name="email" className="mt-3 h-12 w-full border-b border-[hsl(var(--border))] bg-transparent text-base outline-none focus:border-[hsl(var(--accent))]" data-testid="input-contact-email" /></label></div><label className="block text-xs uppercase tracking-[.13em]">I’m thinking about<select className="mt-3 h-12 w-full border-b border-[hsl(var(--border))] bg-transparent text-base outline-none focus:border-[hsl(var(--accent))]" data-testid="select-contact-intent"><option>Buying a home</option><option>Selling a home</option><option>Relocating to Vancouver</option><option>Something else</option></select></label><label className="block text-xs uppercase tracking-[.13em]">A little more detail<textarea required rows={4} className="mt-3 w-full resize-none border-b border-[hsl(var(--border))] bg-transparent py-3 text-base outline-none focus:border-[hsl(var(--accent))]" data-testid="textarea-contact-message" /></label><button type="submit" className="inline-flex items-center rounded-full bg-[hsl(var(--primary))] px-7 py-4 text-xs uppercase tracking-[.14em] text-[hsl(var(--background))] transition hover:-translate-y-1" data-testid="button-submit-contact">Send your note <ArrowRight className="ml-3 h-4 w-4" /></button></form>}</div></main><Footer /></div>;
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [['Do I need to be ready to buy before we talk?','Not at all. The best time to get advice is often before you are ready to make an offer. We can talk through timing, neighbourhoods, and what is realistic for your goals.'],['Which areas do you work in?','Sunny works across Vancouver, North Vancouver, West Vancouver, Burnaby, and the broader Greater Vancouver market.'],['Can you help me prepare my home for sale?','Yes. Preparation is part of the strategy — from positioning and small improvements to photography, launch timing, and negotiation.']];
  return <section className="px-5 py-20 md:px-10"><div className="mx-auto grid max-w-[1100px] gap-10 md:grid-cols-[.7fr_1.3fr]"><div><p className="eyebrow text-[hsl(var(--accent))]">Good questions</p><h2 className="display-serif mt-5 text-5xl">Before we begin.</h2></div><div>{items.map(([q,a], i) => <div key={q} className="border-t border-[hsl(var(--border))] py-5"><button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between text-left" data-testid={`button-faq-${i}`}><span className="display-serif text-2xl">{q}</span>{open === i ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}</button>{open === i && <p className="max-w-xl pt-4 text-sm leading-7 text-[hsl(var(--muted-foreground))]">{a}</p>}</div>)}</div></div></section>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/properties" component={Properties} /><Route path="/properties/:id" component={Properties} /><Route path="/about" component={About} /><Route path="/services" component={Services} /><Route path="/communities" component={Communities} /><Route path="/contact" component={Contact} /><Route path="/faq" component={FAQ} /><Route component={() => <div className="min-h-screen bg-[hsl(var(--background))] px-5 py-32 text-center"><Header /><h1 className="display-serif text-6xl">Page not found.</h1><Link href="/" className="mt-8 inline-block text-xs uppercase tracking-[.14em] underline" data-testid="link-not-found-home">Return home</Link></div>} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
