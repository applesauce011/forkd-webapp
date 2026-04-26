import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LandingCarousel } from "@/components/landing/LandingCarousel";
import type { CarouselRecipe } from "@/components/landing/LandingCarousel";
import { BookOpen, BarChart3, Users, ChefHat } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/feed");

  const [countRes, recipesRes] = await Promise.all([
    supabase
      .from("recipes_visible")
      .select("id", { count: "exact", head: true })
      .eq("visibility", "public"),
    supabase
      .from("recipes_visible")
      .select(`
        id, title, cuisine_primary,
        recipe_photos(url, position),
        profiles!recipes_author_fk(display_name, username)
      `)
      .eq("visibility", "public")
      .order("created_at", { ascending: false })
      .limit(16),
  ]);

  const recipeCount = countRes.count ?? 0;

  const carouselRecipes: CarouselRecipe[] = (recipesRes.data ?? []).filter((r): r is typeof r & { id: string } => r.id !== null).map((r) => {
    const photos = Array.isArray(r.recipe_photos)
      ? r.recipe_photos
      : r.recipe_photos
      ? [r.recipe_photos]
      : [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sorted = [...(photos as any[])].sort((a, b) => a.position - b.position);
    const photoUrl = sorted[0]?.url ?? null;
    const profile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
    return {
      id: r.id,
      title: r.title,
      photoUrl,
      authorName: (profile as { display_name?: string | null; username?: string | null } | null)?.display_name
        || (profile as { display_name?: string | null; username?: string | null } | null)?.username
        || null,
      cuisinePrimary: r.cuisine_primary,
    };
  });

  const countDisplay = recipeCount >= 1000
    ? `${(recipeCount / 1000).toFixed(1).replace(/\.0$/, "")}k`
    : recipeCount.toLocaleString();

  const features = [
    {
      icon: <ChefHat className="h-5 w-5 text-primary" />,
      title: "Post & share your recipes",
      desc: "Upload photos, list ingredients, write step-by-step instructions. Share your creations and see exactly who's cooking your food.",
    },
    {
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      title: "Build your personal cookbook",
      desc: "Save and collect recipes you love. Your own digital cookbook — everything organised in one place, always available.",
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-primary" />,
      title: "In-depth recipe stats",
      desc: "Go beyond likes. See how many people have made your recipes, how they rate them, and detailed analytics over time.",
    },
    {
      icon: <Users className="h-5 w-5 text-primary" />,
      title: "Follow your favourite home cooks",
      desc: "Discover talented home cooks and follow their culinary journey. Get inspired by real people cooking in real kitchens.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 h-14 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Fork'd" width={28} height={28} className="rounded-[6px]" />
            <span className="text-xl font-bold text-primary">Fork&apos;d</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-10 text-center">
        <div className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
          🍴 {countDisplay} recipes from real home cooks
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight tracking-tight">
          Recipes worth making,<br />
          <span className="text-primary">from real home cooks</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Fork&apos;d is where home cooks share what actually works in their kitchens.
          No restaurants, no food bloggers — just real people, sharing recipes you can actually make.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button asChild size="lg" className="text-base px-8">
            <Link href="/feed">Browse Recipes</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="text-base text-muted-foreground hover:text-foreground">
            <Link href="/signup">Join Fork&apos;d free →</Link>
          </Button>
        </div>
      </section>

      {/* Recent Recipes Carousel */}
      {carouselRecipes.length > 0 && (
        <section className="py-6 px-4 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wide text-xs">Recently posted</h2>
            <Link href="/feed" className="text-sm text-primary hover:underline">See all →</Link>
          </div>
          <LandingCarousel recipes={carouselRecipes} />
        </section>
      )}

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">More than just a recipe website</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Fork&apos;d is a community of home cooks sharing what works. Post, discover, cook, and connect.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f) => (
            <div key={f.title} className="p-6 rounded-2xl bg-card border flex gap-4 items-start">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                {f.icon}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="border-t py-12 px-4 text-center">
        <p className="text-muted-foreground text-sm mb-3">Ready to share your kitchen?</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/signup">Create a free account</Link>
        </Button>
      </footer>
    </div>
  );
}
