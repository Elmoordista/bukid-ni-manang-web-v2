"use client";

export default function TourPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-6 text-center">Resort Tour</h1>
        
        {/* Test image */}
        <div className="max-w-2xl mx-auto bg-gray-100 rounded-lg p-4">
          <img 
            src="/attached_assets/IMG_9890_1759418259559.jpeg"
            alt="Resort View"
            className="w-full h-auto rounded-lg"
          />
          <p className="mt-4 text-center text-gray-600">Main Entrance View</p>
        </div>
      </div>
    </div>
  );
}