"use client";

import { Button } from "@/components/ui/button";

export default function NewsletterForm() {
  return (
    <form
      className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Enter your email"
        className="flex-1 rounded-md border border-slate-600 bg-brand-secondary px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
      />
      <Button className="bg-brand-gold text-white hover:bg-brand-gold/90">
        Subscribe
      </Button>
    </form>
  );
}
