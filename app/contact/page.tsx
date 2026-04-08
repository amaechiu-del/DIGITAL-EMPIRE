"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1200);
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-3 text-4xl font-extrabold md:text-5xl">
            Contact <span className="text-brand-gold">Us</span>
          </h1>
          <p className="mx-auto max-w-lg text-slate-300">
            Have a question or need help? Our team is ready to assist you. Reach
            out and we&apos;ll respond within 24 hours.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Contact Info */}
          <div className="space-y-4">
            {[
              {
                icon: Mail,
                label: "Email",
                value: "support@domislink.com",
                href: "mailto:support@domislink.com",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: Phone,
                label: "Phone",
                value: "+234 800 000 0000",
                href: "tel:+2348000000000",
                color: "bg-green-50 text-green-600",
              },
              {
                icon: MapPin,
                label: "Address",
                value: "Lekki Phase 1, Lagos, Nigeria",
                href: "#",
                color: "bg-orange-50 text-orange-600",
              },
              {
                icon: Clock,
                label: "Hours",
                value: "Mon–Fri, 9am – 6pm WAT",
                href: "#",
                color: "bg-purple-50 text-purple-600",
              },
            ].map(({ icon: Icon, label, value, href, color }) => (
              <Card key={label}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {label}
                    </p>
                    <a href={href} className="text-sm font-medium text-slate-800 hover:text-brand-gold">
                      {value}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Form */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-bold text-slate-900">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell us more about your inquiry…"
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="mt-1 flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                  {loading ? (
                    "Sending…"
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
