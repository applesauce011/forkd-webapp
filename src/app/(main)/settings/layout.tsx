import { SettingsNav } from "@/components/settings/SettingsNav";

export const metadata = { title: "Settings — Fork'd" };

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 md:mb-8">Settings</h1>
      <div className="flex gap-8">
        <SettingsNav />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
