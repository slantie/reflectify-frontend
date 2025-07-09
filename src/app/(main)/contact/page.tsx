// src/app/(main)/contact/page.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { UploadHeader } from "@/components/upload/UploadHeader";
import {
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    GlobeAltIcon,
    ChatBubbleLeftIcon,
    UserIcon,
} from "@heroicons/react/24/outline";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Reset form
        setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
        });
        setIsSubmitting(false);

        alert("Thank you for your message! We'll get back to you soon.");
    };

    const contactInfo = [
        {
            icon: EnvelopeIcon,
            title: "Email",
            value: "reflectify@example.com",
            link: "mailto:reflectify@example.com",
        },
        {
            icon: PhoneIcon,
            title: "Phone",
            value: "+1 (555) 123-4567",
            link: "tel:+15551234567",
        },
        {
            icon: MapPinIcon,
            title: "Address",
            value: "123 Education Street, Learning City, LC 12345",
            link: "https://maps.google.com",
        },
        {
            icon: GlobeAltIcon,
            title: "Website",
            value: "www.reflectify.com",
            link: "https://www.reflectify.com",
        },
    ];

    const teamContacts = [
        {
            name: "Harsh Patel",
            role: "Full Stack Developer",
            email: "harsh@reflectify.com",
            specialization: "Backend Architecture & API Development",
        },
        {
            name: "Kandarp Joshi",
            role: "Frontend Developer",
            email: "kandarp@reflectify.com",
            specialization: "UI/UX Design & React Development",
        },
        {
            name: "Parin Naik",
            role: "Full Stack Developer",
            email: "parin@reflectify.com",
            specialization: "Database Design & System Integration",
        },
    ];

    return (
        <div className="min-h-screen bg-light-muted-background dark:bg-dark-background">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
                <div className="space-y-12">
                    {/* Header Section */}
                    <UploadHeader title="Contact Us" />

                    {/* Hero Section */}
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-800">
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                    <ChatBubbleLeftIcon className="h-12 w-12 text-blue-600" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                                    Get in Touch
                                </h2>
                                <p className="text-lg text-blue-800 dark:text-blue-200 max-w-3xl mx-auto">
                                    Have questions about Reflectify? Need
                                    technical support? Want to collaborate?
                                    We&apos;d love to hear from you!
                                </p>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <Card className="p-8">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        Send us a Message
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Fill out the form below and we&apos;ll
                                        get back to you as soon as possible.
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            type="text"
                                            name="name"
                                            placeholder="Your Name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full"
                                        />
                                        <Input
                                            type="email"
                                            name="email"
                                            placeholder="Your Email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full"
                                        />
                                    </div>

                                    <Input
                                        type="text"
                                        name="subject"
                                        placeholder="Subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full"
                                    />

                                    <textarea
                                        name="message"
                                        placeholder="Your Message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={5}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent resize-vertical"
                                    />

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Sending...
                                            </span>
                                        ) : (
                                            "Send Message"
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </Card>

                        {/* Contact Information */}
                        <div className="space-y-6">
                            <Card className="p-6">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Contact Information
                                </h3>
                                <div className="space-y-4">
                                    {contactInfo.map((info, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="p-3 bg-primary-lighter rounded-lg">
                                                <info.icon className="h-5 w-5 text-primary-dark" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {info.title}
                                                </p>
                                                <a
                                                    href={info.link}
                                                    className="text-primary-dark hover:text-primary-main transition-colors"
                                                    target={
                                                        info.title ===
                                                            "Address" ||
                                                        info.title === "Website"
                                                            ? "_blank"
                                                            : undefined
                                                    }
                                                    rel={
                                                        info.title ===
                                                            "Address" ||
                                                        info.title === "Website"
                                                            ? "noopener noreferrer"
                                                            : undefined
                                                    }
                                                >
                                                    {info.value}
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Quick Contact */}
                            <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
                                <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                                    Quick Contact
                                </h4>
                                <p className="text-sm text-green-800 dark:text-green-200 mb-4">
                                    For urgent technical support or immediate
                                    assistance
                                </p>
                                <div className="space-y-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            window.open(
                                                "mailto:support@reflectify.com",
                                                "_blank"
                                            )
                                        }
                                        className="w-full border-green-300 text-green-700 hover:bg-green-100"
                                    >
                                        <EnvelopeIcon className="h-4 w-4 mr-2" />
                                        Email Support
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            window.open(
                                                "tel:+15551234567",
                                                "_blank"
                                            )
                                        }
                                        className="w-full border-green-300 text-green-700 hover:bg-green-100"
                                    >
                                        <PhoneIcon className="h-4 w-4 mr-2" />
                                        Call Support
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Team Contact Section */}
                    <div className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Development Team
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                Get in touch with our development team for
                                technical inquiries or collaboration
                                opportunities
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {teamContacts.map((member, index) => (
                                <Card
                                    key={index}
                                    className="p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="text-center space-y-4">
                                        <div className="flex justify-center">
                                            <div className="p-3 bg-primary-lighter rounded-full">
                                                <UserIcon className="h-8 w-8 text-primary-dark" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                {member.name}
                                            </h3>
                                            <p className="text-primary-dark font-medium mb-2">
                                                {member.role}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                                {member.specialization}
                                            </p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    window.open(
                                                        `mailto:${member.email}`,
                                                        "_blank"
                                                    )
                                                }
                                                className="flex items-center gap-2"
                                            >
                                                <EnvelopeIcon className="h-4 w-4" />
                                                Contact
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Office Hours */}
                    <Card className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                        <div className="text-center space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Support Hours
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        General Support
                                    </h3>
                                    <div className="space-y-2 text-gray-600 dark:text-gray-300">
                                        <p>
                                            Monday - Friday: 9:00 AM - 6:00 PM
                                        </p>
                                        <p>Saturday: 10:00 AM - 4:00 PM</p>
                                        <p>Sunday: Closed</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        Emergency Support
                                    </h3>
                                    <div className="space-y-2 text-gray-600 dark:text-gray-300">
                                        <p>24/7 for critical system issues</p>
                                        <p>Response time: Within 2 hours</p>
                                        <p>Available via email and phone</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
