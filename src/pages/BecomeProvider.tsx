import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { facilities as allFacilities, cities } from "@/data/rooms";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const BecomeProvider = () => {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    roomName: "",
    city: "",
    pincode: "",
    location: "",
    price: "",
    facilities: [] as string[],
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleFacility = (f: string) =>
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(f)
        ? prev.facilities.filter((x) => x !== f)
        : [...prev.facilities, f],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.roomName || !form.city || !form.price) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("provider_submissions").insert({
      name: form.name,
      phone: form.phone,
      email: form.email || null,
      room_name: form.roomName,
      city: form.city,
      location: form.location || null,
      price: parseInt(form.price),
      facilities: form.facilities,
      submitted_by: user?.id || null,
    });
    setLoading(false);

    if (error) {
      toast.error("Failed to submit. Please try again.");
      console.error(error);
      return;
    }
    setSubmitted(true);
    toast.success("Your listing has been submitted for review!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-24 max-w-lg mx-auto section-padding text-center">
          <ScrollReveal>
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h1 className="text-2xl font-bold mb-3">Submission Received!</h1>
            <p className="text-muted-foreground mb-8">
              Your room listing has been submitted and is pending approval. Our team will review it and get back to you shortly.
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline">
              Submit Another Listing
            </Button>
          </ScrollReveal>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-24 max-w-2xl mx-auto section-padding">
        <ScrollReveal>
          <h1 className="text-3xl font-bold mb-2">Become a Room Provider</h1>
          <p className="text-muted-foreground mb-10">
            List your room or PG on ROOM HAI and connect with thousands of tenants.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-semibold mb-4">Your Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Your full name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Phone *</label>
                  <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Your phone number" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="your@email.com" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-semibold mb-4">Room Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium mb-1.5 block">Room / PG Name *</label>
                  <input type="text" value={form.roomName} onChange={(e) => update("roomName", e.target.value)} className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. Sunrise PG for Boys" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">City *</label>
                  <select value={form.city} onChange={(e) => update("city", e.target.value)} className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">Select city</option>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Location / Area</label>
                  <input type="text" value={form.location} onChange={(e) => update("location", e.target.value)} className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. Andheri West" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Price per Month (₹) *</label>
                  <input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. 8500" />
                </div>
              </div>
              <div className="mt-5">
                <label className="text-sm font-medium mb-2 block">Facilities</label>
                <div className="flex flex-wrap gap-2">
                  {allFacilities.map((f) => (
                    <button key={f} type="button" onClick={() => toggleFacility(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.facilities.includes(f) ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary/50"}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button type="submit" variant="hero" size="xl" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Listing for Review"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Your listing will be reviewed by our team before being published.
            </p>
          </form>
        </ScrollReveal>
      </div>
      <Footer />
    </div>
  );
};

export default BecomeProvider;
