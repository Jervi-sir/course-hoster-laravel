import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Camera, Globe, Heart, Layers, PlayCircle, Share2, Smartphone, Star, TrendingUp, Users, Video } from 'lucide-react';
import { SharedData } from '@/types';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome to Course Hoster" />

            <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans">
                {/* Navigation */}
                <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
                    <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                            <Share2 className="h-6 w-6 text-primary" />
                            <span>Course<span className="text-primary">Hoster</span></span>
                        </div>

                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                            <a href="#course" className="hover:text-foreground transition-colors">The Course</a>
                            <a href="#about" className="hover:text-foreground transition-colors">About</a>
                            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                        </nav>

                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link href={dashboard()}>
                                    <Button variant="default">Dashboard</Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={login()}>
                                        <Button variant="ghost">Log in</Button>
                                    </Link>
                                    <Link href={register()}>
                                        <Button>Get Started</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main className="pt-24 pb-16">
                    {/* Hero Section */}
                    <section className="container mx-auto px-4 lg:px-8 py-12 lg:py-20 flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
                        <Badge variant="secondary" className="px-4 py-1.5 text-sm rounded-full bg-secondary/50 border-secondary-foreground/10 text-secondary-foreground">
                            <Star className="w-3.5 h-3.5 mr-1 fill-current opacity-70" />
                            #1 Social Media Academy
                        </Badge>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight max-w-4xl text-balance bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60">
                            Dominate Social Media & <br className="hidden md:block" />
                            <span className="text-primary">Build Your Personal Brand</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl text-balance leading-relaxed">
                            Stop scrolling and start creating. Learn the secrets behind viral content, audience growth, and community engagement to turn your passion into influence.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Link href="/courses">
                                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base shadow-lg shadow-primary/20 transition-transform hover:scale-105">
                                    Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <a href="#course">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base">
                                    Explore Strategies
                                </Button>
                            </a>
                        </div>
                    </section>

                    {/* Featured Course Section (The "Course Itself") */}
                    <section id="course" className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative rounded-2xl overflow-hidden bg-card border border-border shadow-2xl">
                                    {/* Social Media Post Visual */}
                                    <div className="aspect-video bg-muted/30 flex items-center justify-center p-8 relative overflow-hidden">
                                        {/* Abstract Social Interface Background */}
                                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                                            <div className="absolute top-4 right-4"><Heart className="w-12 h-12" /></div>
                                            <div className="absolute bottom-8 left-8"><Share2 className="w-16 h-16" /></div>
                                            <div className="absolute top-1/2 left-1/4"><PlayCircle className="w-8 h-8" /></div>
                                        </div>

                                        <div className="w-64 bg-background rounded-xl border border-border p-4 shadow-lg z-10 flex flex-col gap-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500"></div>
                                                <div className="flex flex-col">
                                                    <div className="h-2 w-24 bg-muted rounded"></div>
                                                    <div className="h-1.5 w-16 bg-muted/60 rounded mt-1"></div>
                                                </div>
                                            </div>
                                            <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center text-muted-foreground/50">
                                                <Video className="w-8 h-8 opacity-50" />
                                            </div>
                                            <div className="flex gap-4 text-muted-foreground">
                                                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                                                <div className="w-5 h-5 rounded-full border-2 border-current opacity-50"></div>
                                                <Share2 className="w-5 h-5" />
                                            </div>
                                            <div className="space-y-1.5 pt-1">
                                                <div className="h-2 w-full bg-muted rounded"></div>
                                                <div className="h-2 w-4/5 bg-muted rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold tracking-tight">The Recap: What We Are Achieving</h2>
                                <p className="text-muted-foreground text-lg">
                                    We are building more than just a course platform. We are creating an ecosystem where creativity meets strategy.
                                    This "Course Hoster" project is your gateway to mastering digital influence.
                                </p>

                                <div className="grid gap-4">
                                    <Card className="bg-card/50 border-border/60 hover:bg-card transition-colors">
                                        <CardContent className="p-4 flex gap-4 items-start">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                                                <TrendingUp className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">Viral Growth Strategy</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Understand the algorithms that drive views and how to replicate success consistently.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-card/50 border-border/60 hover:bg-card transition-colors">
                                        <CardContent className="p-4 flex gap-4 items-start">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                                                <Users className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">Community Building</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Turn passive followers into loyal fans, brand ambassadors, and paying customers.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-card/50 border-border/60 hover:bg-card transition-colors">
                                        <CardContent className="p-4 flex gap-4 items-start">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                                                <Star className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">Brand Authority</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Establish yourself as an expert in your niche and monetize your influence.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Grid */}
                    <section id="features" className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 border-t border-border/40">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose This Platform?</h2>
                            <p className="text-muted-foreground">Everything you need to take your social media game to the next level.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors duration-300">
                                <div className="h-12 w-12 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                                    <Smartphone className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Content Creation</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Master mobile photography, videography, and editing tools to create professional content on the go.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors duration-300">
                                <div className="h-12 w-12 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                                    <BarChart className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Analytics Mastery</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Learn to read the data, understand viewer retention, and optimize your posting schedule.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors duration-300">
                                <div className="h-12 w-12 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
                                    <Globe className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Cross-Platform Strategy</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Dominate TikTok, Instagram Reels, YouTube Shorts, and LinkedIn with tailored strategies.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-border/40 py-8 bg-muted/20">
                    <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                        <p>&copy; {new Date().getFullYear()} Course Hoster. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-foreground">Terms</a>
                            <a href="#" className="hover:text-foreground">Privacy</a>
                            <a href="#" className="hover:text-foreground">Contact</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

function ArrowRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
