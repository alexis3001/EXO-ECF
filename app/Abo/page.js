import { Geist_Mono } from "next/font/google";
import { Geist } from "next/font/google";
// export default function RootLayout({ children }) {
//   return (
//     <html>
//       <body>{children}</body>
//     </html>
//   )
// }




const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    });

 const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
 });

 export const metadata = {
   title: "Abonnement",
   description: "Abonnement page",
 };

export default async function IndexPage({ searchParams }) {
  const { canceled } = await searchParams

  if (canceled) {
    console.log(
      'Order canceled -- continue to shop around and checkout when you’re ready.'
    )
  }
  return (
    <form action="/api/checkout_sessions" method="POST">
      <section>
        <button type="submit" role="link">
          Checkout
        </button>
      </section>
    </form>
  )
}