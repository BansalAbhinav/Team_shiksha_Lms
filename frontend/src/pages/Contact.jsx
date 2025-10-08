function Contact() {
    return (
      <div className="max-w-md mx-auto space-y-4 text-center">
        <h2 className="text-2xl font-bold text-indigo-700">Contact Us</h2>
        <p className="text-gray-600">
          Have questions or feedback? We'd love to hear from you.
        </p>
        <form className="space-y-3">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
          />
          <textarea
            placeholder="Your Message"
            rows="4"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
          ></textarea>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    );
  }
  
  export default Contact;
  