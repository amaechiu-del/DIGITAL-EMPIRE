import type { Metadata } from "next";
import Image from "next/image";
import { Target, Eye, Users, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about DOMISLINK INTERNATIONAL and our mission to empower digital excellence.",
};

const team = [
  {
    name: "Dominic Okafor",
    role: "Founder & CEO",
    bio: "Serial entrepreneur with 10+ years in digital business development across West Africa.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop",
  },
  {
    name: "Simisola Adeyemi",
    role: "Head of Product",
    bio: "Product strategist passionate about creating tools that solve real problems for African businesses.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=300&auto=format&fit=crop",
  },
  {
    name: "Emeka Nwachukwu",
    role: "Lead Developer",
    bio: "Full-stack engineer building scalable digital products that work across Africa.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-brand py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
            About <span className="text-brand-gold">DOMISLINK</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            We are DOMISLINK INTERNATIONAL — a Nigerian digital company on a
            mission to empower entrepreneurs, professionals, and businesses with
            world-class digital products and knowledge.
          </p>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card>
              <CardContent className="p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="mb-3 text-xl font-bold text-slate-900">Our Mission</h2>
                <p className="leading-relaxed text-slate-600">
                  To democratise access to premium digital products, education,
                  and business tools for Nigerian and African entrepreneurs —
                  making excellence affordable and accessible to all.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="mb-3 text-xl font-bold text-slate-900">Our Vision</h2>
                <p className="leading-relaxed text-slate-600">
                  To become Africa&apos;s most trusted digital marketplace by
                  2030 — a platform where every product drives measurable
                  business growth and personal transformation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 md:text-3xl">
            Our Values
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Lightbulb, label: "Innovation", color: "bg-yellow-100 text-yellow-600", desc: "We push boundaries to deliver cutting-edge solutions." },
              { icon: Users, label: "Community", color: "bg-green-100 text-green-600", desc: "We build products that bring people together to grow." },
              { icon: Target, label: "Excellence", color: "bg-blue-100 text-blue-600", desc: "We hold ourselves to the highest standards of quality." },
              { icon: Eye, label: "Transparency", color: "bg-purple-100 text-purple-600", desc: "We operate with honesty and openness in everything we do." },
            ].map(({ icon: Icon, label, color, desc }) => (
              <Card key={label}>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold text-slate-900">{label}</h3>
                  <p className="text-sm text-slate-500">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 md:text-3xl">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <Card key={member.name}>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full bg-slate-200">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <h3 className="font-semibold text-slate-900">{member.name}</h3>
                  <p className="mb-2 text-sm font-medium text-brand-gold">{member.role}</p>
                  <p className="text-sm text-slate-500">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
