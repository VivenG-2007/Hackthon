import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "../components/navbar";
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div className="flex"><NavBar /> </div>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}