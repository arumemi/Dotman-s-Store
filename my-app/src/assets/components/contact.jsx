import React from 'react'


const Contact = () => {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phoneNumber: '',
    country: 'US',
    message: '',
    agreeToPolicy: false
  });

  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build email content
    const subject = 'New Contact Form Submission from Website';
    const body = `
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.country} ${formData.phoneNumber}
${formData.company ? `Company: ${formData.company}` : ''}

Message:
${formData.message}
    `;
    
    // Create mailto link
    const mailtoLink = `mailto:rolfadinternational@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        phoneNumber: '',
        country: 'NIG',
        message: '',
        agreeToPolicy: false
      });
    }, 3000);
  };

  return (
    <div className="isolate bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
  <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
    <div style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}} className="relative left-1/2 -z-10 /aspect-[1155/678] /w-[36.125rem] max-w-none -translate-x-1/2 /rotate-[30deg] /bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-40rem)] /sm:w-[72.1875rem]"></div>
  </div>
  
  {/* Success Modal Popup */}
  {submitted && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform animate-bounce-in">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          {/* Success Message */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
          <p className="text-gray-600 mb-6">
            Your message has been successfully sent to our email. We will get back to you soon!
          </p>
          
          {/* Close Button */}
          <button
            onClick={() => setSubmitted(false)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )}
  
  <div className="mx-auto max-w-2xl text-center">
    <h2 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">Contact Us</h2>
    <p className="mt-2 text-lg/8 text-gray-200">We are here to help. Send us a message and we will get back to you soon.</p>
  </div>
  
  {error && (
    <div className="mx-auto mt-8 max-w-xl">
      <div className="rounded-md bg-red-500/20 border border-red-500 p-4">
        <p className="text-center text-red-400 font-semibold">{error}</p>
      </div>
    </div>
  )}
  
  <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
      <div>
        <label htmlFor="firstName" className="block text-sm/6 font-semibold text-white">Name</label>
        <div className="mt-2.5">
          <input 
            id="firstName" 
            type="text" 
            name="firstName" 
            value={formData.firstName}
            onChange={handleChange}
            autoComplete="given-name" 
            required
            className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500" 
          />
        </div>
      </div>
      <div>
        <label htmlFor="lastName" className="block text-sm/6 font-semibold text-white">Last Name</label>
        <div className="mt-2.5">
          <input 
            id="lastName" 
            type="text" 
            name="lastName" 
            value={formData.lastName}
            onChange={handleChange}
            autoComplete="family-name" 
            required
            className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500" 
          />
        </div>
      </div>
     
      <div className="sm:col-span-2">
        <label htmlFor="email" className="block text-sm/6 font-semibold text-white">Email</label>
        <div className="mt-2.5">
          <input 
            id="email" 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            autoComplete="email" 
            required
            className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500" 
          />
        </div>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="phoneNumber" className="block text-sm/6 font-semibold text-white">Phone Number</label>
        <div className="mt-2.5">
          <div className="flex rounded-md bg-white/5 outline-1 -outline-offset-1 outline-white/10 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-500">
            <div className="grid shrink-0 grid-cols-1 focus-within:relative">
              <select 
                id="country" 
                name="country" 
                value={formData.country}
                onChange={handleChange}
                autoComplete="country" 
                aria-label="Country" 
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-transparent py-2 pr-7 pl-3.5 text-base text-gray-400 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              >
                <option>NIG</option>
                <option>GH</option>
                <option>EU</option>
                <option>BR</option>
              </select>
              <svg viewBox="0 0 16 16" fill="currentColor" data-slot="icon" aria-hidden="true" className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 sm:size-4">
                <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" fillRule="evenodd" />
              </svg>
            </div>
            <input 
              id="phoneNumber" 
              type="text" 
              name="phoneNumber" 
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="123-456-7890" 
              className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6" 
            />
          </div>
        </div>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className="block text-sm/6 font-semibold text-white">Message</label>
        <div className="mt-2.5">
          <textarea 
            id="message" 
            name="message" 
            value={formData.message}
            onChange={handleChange}
            rows="4" 
            required
            className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
          ></textarea>
        </div>
      </div>
      <div className="flex gap-x-4 sm:col-span-2">
        <div className="flex h-6 items-center">
          <input 
            id="agreeToPolicy" 
            type="checkbox" 
            name="agreeToPolicy" 
            checked={formData.agreeToPolicy}
            onChange={handleChange}
            required
            aria-label="Agree to policies" 
            className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
          />
        </div>
        <label htmlFor="agreeToPolicy" className="text-sm/6 text-gray-400">
          By selecting, you agree to our{' '}
          <a href="#" className="font-semibold whitespace-nowrap text-indigo-400">privacy policy</a>.
        </label>
      </div>
    </div>
    <div className="mt-10">
      <button 
        type="submit"
        className="block w-full rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors duration-200"
      >
        Send Message
      </button>
    </div>
  </form>
</div>

  )
}

export default Contact