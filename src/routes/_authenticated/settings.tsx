import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Upload, Camera, Moon, Sun } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useProfile, useUpdateProfile } from "@/hooks/use-finance";
import { useTheme } from "@/lib/theme";
import { useSignedAvatar } from "@/hooks/use-signed-avatar";
import { CURRENCIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings · Smart Expense Tracker" }] }),
  component: SettingsPage,
});

const ALLOWED_AVATAR_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function SettingsPage() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const update = useUpdateProfile();
  const { theme, setTheme } = useTheme();
  const avatarUrl = useSignedAvatar(profile?.avatar_url);
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [uploading, setUploading] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [savingPass, setSavingPass] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setCurrency(profile.currency ?? "USD");
    }
  }, [profile]);

  const initials = (profile?.name || profile?.email || "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSaveProfile = async () => {
    try {
      await update.mutateAsync({ name: name.trim(), currency });
      toast.success("Profile updated");
    } catch {
      toast.error("Could not update profile");
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    // Validate MIME type against an allowlist — do not trust the filename extension.
    const ext = ALLOWED_AVATAR_TYPES[file.type];
    if (!ext) {
      if (fileRef.current) fileRef.current.value = "";
      return toast.error("Only JPG, PNG, WebP, or GIF images are allowed");
    }
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5MB");
    setUploading(true);
    try {
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      // Store only the storage path; a short-lived signed URL is generated on demand for display.
      await update.mutateAsync({ avatar_url: path });
      toast.success("Profile picture updated");
    } catch {
      toast.error("Could not upload image");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleChangePassword = async () => {
    if (newPass.length < 6) return toast.error("Password must be at least 6 characters");
    if (newPass !== confirmPass) return toast.error("Passwords do not match");
    setSavingPass(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });
    setSavingPass(false);
    if (error) return toast.error(error.message);
    setNewPass("");
    setConfirmPass("");
    toast.success("Password updated");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border border-border">
                {avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
                <AvatarFallback className="bg-primary/15 text-lg font-semibold text-primary">{initials}</AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
                aria-label="Change photo"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Upload photo
              </Button>
              <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WebP, or GIF, up to 5MB.</p>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleUpload} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile?.email ?? ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.symbol} {c.code} — {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleSaveProfile} disabled={update.isPending}>
            {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
          <CardDescription>Choose your preferred theme.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${theme === "light" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}
            >
              <Sun className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Light</p>
                <p className="text-xs text-muted-foreground">Bright & clean</p>
              </div>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}
            >
              <Moon className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Dark</p>
                <p className="text-xs text-muted-foreground">Easy on the eyes</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Change Password</CardTitle>
          <CardDescription>Use at least 6 characters.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="np">New password</Label>
              <Input id="np" type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cp">Confirm password</Label>
              <Input id="cp" type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder="••••••••" />
            </div>
          </div>
          <Button onClick={handleChangePassword} disabled={savingPass}>
            {savingPass && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
