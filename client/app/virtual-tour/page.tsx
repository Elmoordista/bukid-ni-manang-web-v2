"use client";
import React, { useState } from 'react';
import Image from 'next/image';

const tourLocations = [
  {
    id: "main-entrance",
    name: "Main Entrance & Welcome Area",
    description: "Our welcoming entrance area, your gateway to a memorable stay.",
    image: "/images/virtual-tour/IMG_9890_1759418259559.jpeg"
  },
  {
    id: "water-park",
    name: "Water Park & Pool Area",
    description: "Our expansive water park with multiple pools and recreation areas.",
    image: "/images/virtual-tour/IMG_9893_1759418259559.jpeg"
  },
  {
    id: "resort-grounds",
    name: "Resort Grounds & Gardens",
    description: "Beautiful landscaped grounds and garden paths throughout the resort.",
    image: "/images/virtual-tour/att.rfPtVeaJwnebcgbjD5jlXsCNy5QOqkVLuGlJdqan_2c_1759384034742.jpeg"
  }
];

export default function VirtualTourPage() {
  const [selectedLocation, setSelectedLocation] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-6 text-center">Virtual Resort Tour</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="relative rounded-lg overflow-hidden aspect-video bg-gray-200">
              <Image 
                src={tourLocations[selectedLocation].image}
                alt={tourLocations[selectedLocation].name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Info Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {tourLocations[selectedLocation].name}
              </h2>
              <p className="text-gray-600">
                {tourLocations[selectedLocation].description}
              </p>
            </div>
          </div>
        </div>

        {/* Location Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tourLocations.map((location, index) => (
            <button
              key={location.id}
              onClick={() => setSelectedLocation(index)}
              className={`p-4 rounded-lg ${
                selectedLocation === index 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white hover:bg-blue-100'
              }`}
            >
              <div className="relative aspect-video mb-2">
                <Image 
                  src={location.image}
                  alt={location.name}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
              <h3 className="font-semibold mt-2">{location.name}</h3>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}