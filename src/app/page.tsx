// src/app/page.tsx
import { SignedIn, SignedOut } from "@clerk/nextjs";

// Always fetch fresh data
export const dynamic = "force-dynamic";

// Fetch images from Web A
async function getImages() {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE; // Web A API
    if (!baseURL) throw new Error("NEXT_PUBLIC_API_BASE is not set");

    // Only append /images if baseURL is just /api
    const res = await fetch(`${baseURL}/images`, { cache: "no-store" });

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
      {/* If not signed in */}
      <SignedOut>
        <div className="flex items-center justify-center h-screen text-2xl font-medium">
          Please Sign In Above to Continue!
        </div>
      </SignedOut>

      {/* If signed in */}
      <SignedIn>
        <div className="max-w-7xl mx-auto px-4 py-8 w-full">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
            Cloud Storage Gallery
          </h1>

          {images.length === 0 ? (
            <p className="text-center text-lg text-gray-500">No images available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image: any) => (
                <div
                  key={image.id}
                  className="flex flex-col border rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-video bg-zinc-900">
                    <img
                      src={image.imageUrl}
                      alt={image.ImageName || image.filename || "Image"}
                      className="h-full w-full object-contain object-top"
                    />
                  </div>
                  <div className="text-center p-2 text-sm font-medium truncate">
                    {image.ImageName || image.filename}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SignedIn>
    </main>
  );
}
