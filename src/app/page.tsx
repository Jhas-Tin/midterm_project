// src/app/page.tsx
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

async function getImages() {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE;
    if (!baseURL) throw new Error("NEXT_PUBLIC_API_BASE is not set");

    const url = baseURL.endsWith("/images") ? baseURL : `${baseURL}/images`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      console.error("Response status:", res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error("Error fetching images:", err);
    return [];
  }
}

export default async function HomePage() {
  const images = await getImages();

  return (
    <main className="min-h-screen w-full bg-gray-50">
      <SignedOut>
        <div className="flex items-center justify-center h-screen text-2xl font-medium">
          Please Sign In Above to Continue!
        </div>
      </SignedOut>

      <SignedIn>
        <section className="relative h-[60vh] w-full bg-gray-900 text-white flex items-center justify-center">
          <img
            src={images[0]?.imageUrl || "/placeholder.jpg"}
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-wide">
              FINE ARTS
            </h1>
            <p className="mt-2 text-lg md:text-2xl font-light">For the Home</p>
          </div>
        </section>

        <section className="bg-white py-12 px-6 md:px-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Featured Artists
              </h2>
              <p className="text-gray-600 max-w-2xl">
                Cloud Storage Gallery introduces great art and artists. Now
                showing paintings and artworks from our collection.
              </p>
            </div>
            <button className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
              View All
            </button>
          </div>
        </section>

        <section className="bg-yellow-100 py-12 px-6 md:px-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {images.length === 0 ? (
              <p className="text-center text-lg text-gray-500 col-span-full">
                No images available
              </p>
            ) : (
              images.map((image: any) => (
                <Link
                  href={`/image/${image.id}`}
                  key={image.id}
                  className="bg-white rounded-md shadow hover:shadow-lg overflow-hidden block"
                >
                  <div className="aspect-video">
                    <img
                      src={image.imageUrl}
                      alt={image.ImageName || image.filename || "Image"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                      {image.ImageName || image.filename}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Artist Gallery</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </SignedIn>
    </main>
  );
}
