import React, { useState } from "react";
import { makeRequest } from "../../makeRequest";
import "./ContactPage.scss";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ submitting: false, success: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: null });
    try {
      const locale = typeof navigator !== "undefined" ? navigator.language : "en";
      await makeRequest.post("/contacts", {
        data: {
          name: form.name,
          email: form.email,
          subject: form.subject,
          // Backend expects `messaage` per API example
          messaage: form.message,
       //   locale,
        },
      });
      setStatus({ submitting: false, success: true });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({ submitting: false, success: false });
    }
  };

  return (
    <div className="contact-page">
      <div className="hero">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Send us a message and we will respond as soon as possible.</p>
      </div>

      <div className="content">
        <div className="info">
          <h2>Get in Touch</h2>
          <p>
            Have questions about products, orders, or partnerships? Drop us a line. Our team typically responds within 1–2 business days.
          </p>
          <div className="cards">
            <div className="card">
              <h3>Email</h3>
              <span>support@lamastore.example</span>
            </div>
            <div className="card">
              <h3>Phone</h3>
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="card">
              <h3>Address</h3>
              <span>123 Market Street, Suite 200, Cityville</span>
            </div>
          </div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="How can we help?"
              value={form.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Write your message here..."
              rows={6}
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={status.submitting}>
            {status.submitting ? "Sending..." : "Send Message"}
          </button>

          {status.success === true && (
            <div className="alert success">Thanks! Your message has been sent.</div>
          )}
          {status.success === false && (
            <div className="alert error">Something went wrong. Please try again.</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactPage;


