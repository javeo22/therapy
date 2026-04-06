"use client";

import { useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { uploadAvatar } from "@/lib/actions/profile";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { Camera } from "lucide-react";

interface AvatarUploadProps {
  name: string;
  currentUrl?: string | null;
}

export function AvatarUpload({ name, currentUrl }: AvatarUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.set("avatar", file);

    const result = await uploadAvatar(formData);
    setUploading(false);

    if (result.error) {
      toast(result.error, "error");
      return;
    }

    toast("Foto actualizada");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="relative group"
      >
        <Avatar name={name} src={currentUrl} size="lg" />
        <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera size={16} className="text-white" />
        </div>
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
