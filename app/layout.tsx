import '@/app/ui/global.css';
import { AuthProvider } from '@/app/providers';
import { MeshBackground } from '@/app/ui/mesh-background';

export const metadata = {
  title: 'VocabCards - Learn English with AI',
  description: 'AI-powered flashcard app for learning English vocabulary using spaced repetition',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MeshBackground />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

