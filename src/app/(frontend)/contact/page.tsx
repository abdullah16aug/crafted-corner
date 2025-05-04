import React from 'react'

export default function ContactPage() {
  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Page header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-3">
            Contact Us
          </h1>
          <p className="text-stone-600 max-w-2xl mx-auto">
            We&apos;d love to hear from you. Whether you have a question about our products, orders,
            or custom requests.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Contact form */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-xl font-serif font-semibold mb-4 text-stone-800">
                Send a Message
              </h2>
              <form>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-stone-700 mb-1"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-stone-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact info */}
            <div>
              <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
                <h2 className="text-xl font-serif font-semibold mb-4 text-stone-800">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-amber-800 mb-1">Email</h3>
                    <p className="text-stone-700">contact@craftedcorner.com</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-amber-800 mb-1">Phone</h3>
                    <p className="text-stone-700">+91 98765 43210</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-amber-800 mb-1">Address</h3>
                    <p className="text-stone-700">
                      123 Crafters Lane
                      <br />
                      Artisan District
                      <br />
                      Mumbai, Maharashtra 400001
                      <br />
                      India
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-xl font-serif font-semibold mb-4 text-stone-800">
                  Store Hours
                </h2>
                <div className="space-y-2 text-stone-700">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>10:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>11:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ section */}
          <div className="bg-amber-50 shadow-sm rounded-lg p-6 md:p-8 mb-8">
            <h2 className="text-xl font-serif font-semibold mb-5 text-amber-900 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-5">
              <div>
                <h3 className="font-medium text-stone-800 mb-1">How long does shipping take?</h3>
                <p className="text-stone-600 text-sm">
                  We process orders within 1-2 business days. Domestic shipping typically takes 3-5
                  business days, while international shipping can take 7-14 business days.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-stone-800 mb-1">Do you offer custom orders?</h3>
                <p className="text-stone-600 text-sm">
                  Yes! We love creating custom pieces. Please contact us with your requirements, and
                  we&apos;ll be happy to discuss the possibilities.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-stone-800 mb-1">What is your return policy?</h3>
                <p className="text-stone-600 text-sm">
                  We accept returns within 14 days of delivery. Items must be unused and in their
                  original packaging. Custom orders are non-returnable.
                </p>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="bg-stone-200 rounded-lg h-64 flex items-center justify-center mb-8">
            <p className="text-stone-600 text-center">
              Map will be displayed here
              <br />
              <span className="text-sm">(Google Maps integration)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
