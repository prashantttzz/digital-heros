import { Navbar } from '@/components/layout/navbar'
import { Search, Heart, MapPin, Globe, ArrowRight } from 'lucide-react'

export default function CharitiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-16">
            <h1 className="text-5xl font-bold mb-6 tracking-tight">Our Heroes' Causes</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Every round you log supports one of these incredible organisations. Choose the cause that resonates with you.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="relative mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search charities by name or cause..." 
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg shadow-sm"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-12">
            {['All', 'Environmental', 'Health', 'Education', 'Mental Health', 'Crisis Relief'].map((cat) => (
              <button key={cat} className="px-4 py-2 rounded-full border border-border text-sm font-semibold hover:border-primary hover:text-primary transition-all bg-card">
                {cat}
              </button>
            ))}
          </div>

          {/* Charities Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CharityCard 
              name="Eden Reforestation"
              cause="Environmental"
              description="Restoring landscapes and providing sustainable employment to local communities through tree planting."
              impact="Every £1.00 plants 10 trees."
              isFeatured
            />
            <CharityCard 
              name="Mental Health Foundation"
              cause="Mental Health"
              description="Taking a public health approach to mental health, providing everyone with the tools to thrive."
              impact="Supporting 1m+ people annually."
            />
            <CharityCard 
              name="Cancer Research UK"
              cause="Health"
              description="The world's leading independent cancer charity dedicated to saving lives through research."
              impact="Funding 4,000+ scientists."
            />
          </div>
        </div>
      </main>
    </div>
  )
}

function CharityCard({ name, cause, description, impact, isFeatured }: { name: string, cause: string, description: string, impact: string, isFeatured?: boolean }) {
  return (
    <div className={`p-8 rounded-3xl border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col ${isFeatured ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Heart className="w-8 h-8 text-primary" />
        </div>
        {isFeatured && (
          <span className="text-[10px] font-black uppercase tracking-widest bg-primary text-white px-2 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">{cause}</p>
      
      <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
        {description}
      </p>

      <div className="pt-6 border-t border-border mt-auto">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-slate-400">Impact</span>
          <span className="font-bold">{impact}</span>
        </div>
        <button className="w-full mt-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group/btn">
          Select Charity
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}
