"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white font-bold text-lg">
            {(user.displayName ?? user.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back, {user.displayName ?? "User"}!
            </h1>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={signOut}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <LayoutDashboard className="h-5 w-5 text-brand" /> Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/products">
                <ShoppingBag className="mr-2 h-4 w-4" /> Browse Products
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/cart">
                <ShoppingBag className="mr-2 h-4 w-4" /> View Cart
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShoppingBag className="h-5 w-5 text-brand" /> Order History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ShoppingBag className="mb-3 h-12 w-12 text-slate-200" />
              <p className="text-sm text-slate-500">No orders yet.</p>
              <p className="mt-1 text-xs text-slate-400">
                Your completed orders will appear here.
              </p>
              <Button className="mt-4" size="sm" asChild>
                <Link href="/products">Start Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-5 w-5 text-brand" /> Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">
                    Profile Information
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  <strong>Name:</strong> {user.displayName ?? "Not set"}
                </p>
                <p className="text-sm text-slate-500">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Account management via Firebase Authentication.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">
                    Preferences
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Notification and display preferences coming soon.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
