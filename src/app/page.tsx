import Navbar from "@/components/Navbar";
import QRForm from "@/components/qr-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Navbar />
      <QRForm />
    </div>
  );
}
