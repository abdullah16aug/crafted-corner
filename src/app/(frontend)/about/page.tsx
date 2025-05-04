import React from 'react'

export default function AboutPage() {
  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-amber-900 text-center">
          About Crafted Corner
        </h1>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-serif font-semibold mb-4 text-stone-800">Our Story</h2>
          <p className="mb-4 text-stone-700">
            Crafted Corner was founded in 2020 with a simple mission: to bring unique, handcrafted
            items to people who appreciate quality craftsmanship and attention to detail.
          </p>
          <p className="mb-4 text-stone-700">
            What started as a small workshop has grown into a community of artisans and craftspeople
            who share a passion for creating beautiful, functional pieces that stand the test of
            time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-serif font-semibold mb-4 text-stone-800">Our Values</h2>
            <ul className="space-y-3 text-stone-700">
              <li className="flex items-start">
                <span className="text-amber-700 mr-2">✦</span>
                <span>Quality craftsmanship in every product</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-700 mr-2">✦</span>
                <span>Sustainable materials and practices</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-700 mr-2">✦</span>
                <span>Supporting local artisans and communities</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-700 mr-2">✦</span>
                <span>Creating unique pieces with character</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-700 mr-2">✦</span>
                <span>Providing exceptional customer service</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-serif font-semibold mb-4 text-stone-800">Our Process</h2>
            <p className="mb-4 text-stone-700">
              Each item in our collection is thoughtfully designed and meticulously crafted using
              traditional techniques and high-quality materials.
            </p>
            <p className="text-stone-700">
              We work directly with skilled artisans who take pride in their craft, ensuring that
              every product meets our standards for quality and beauty.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-serif font-semibold mb-6 text-stone-800 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-amber-50 w-24 h-24 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-amber-700 text-2xl">S</span>
              </div>
              <h3 className="font-medium text-stone-800">Sarah Johnson</h3>
              <p className="text-sm text-stone-600">Founder</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-50 w-24 h-24 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-amber-700 text-2xl">M</span>
              </div>
              <h3 className="font-medium text-stone-800">Michael Chen</h3>
              <p className="text-sm text-stone-600">Lead Designer</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-50 w-24 h-24 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-amber-700 text-2xl">E</span>
              </div>
              <h3 className="font-medium text-stone-800">Emma Rodriguez</h3>
              <p className="text-sm text-stone-600">Artisan</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-50 w-24 h-24 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-amber-700 text-2xl">J</span>
              </div>
              <h3 className="font-medium text-stone-800">James Taylor</h3>
              <p className="text-sm text-stone-600">Customer Service</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-serif font-semibold mb-4 text-center text-amber-900">
            Visit Our Workshop
          </h2>
          <p className="text-center mb-6 text-stone-700">
            We welcome visitors to our workshop. Come see our artisans at work and browse our
            collection in person.
          </p>
          <div className="text-center">
            <a
              href="/contact"
              className="inline-block bg-amber-700 hover:bg-amber-800 text-white px-5 py-2 rounded-md transition-colors"
            >
              Contact Us for Details
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
