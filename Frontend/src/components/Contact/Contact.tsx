"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import "./Contact.css";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Placeholder function for form submission
    setTimeout(() => {
      setLoading(false);
      alert("Form submitted!");
    }, 2000);
  };

  return (
    <div className="contact-us-page-container">
      <div className="contact-us-content">
        <div className="contact-us-info">
          <h1>Contact Us</h1>
          <p>
            Welcome to Tech Chronicles! If you have any questions, feedback, or
            suggestions, feel free to reach out to us. We're here to help you
            with all things tech. Our team is dedicated to providing you with
            the best service and support.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="contact-us-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
