"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Camera } from "lucide-react";

interface UserInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  userEmail: string;
  onSave?: (data: UserInfoData) => void;
}

export interface UserInfoData {
  name: string;
  email: string;
  username: string;
  bio: string;
  avatar?: string;
}

export function UserInfoDialog({
  open,
  onOpenChange,
  userName,
  userEmail,
  onSave,
}: UserInfoDialogProps) {
  const [formData, setFormData] = useState<UserInfoData>({
    name: userName || "",
    email: userEmail || "",
    username: userName?.toLowerCase().replace(/\s+/g, "") || "",
    bio: "",
    avatar: "",
  });

  // Update form data when props change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: userName || "",
      email: userEmail || "",
      username: userName?.toLowerCase().replace(/\s+/g, "") || "",
    }));
  }, [userName, userEmail]);

  const handleSave = () => {
    onSave?.(formData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      name: userName || "",
      email: userEmail || "",
      username: userName?.toLowerCase().replace(/\s+/g, "") || "",
      bio: "",
      avatar: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information and profile details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white text-2xl font-semibold">
                {formData.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="gap-2">
              <Camera className="h-4 w-4" />
              Change Avatar
            </Button>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              className="bg-background"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              className="bg-background"
            />
          </div>

          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Choose a username"
              className="bg-background"
            />
          </div>

          {/* Bio Field */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself"
              className="bg-background resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
