"use client";

import { Supplier } from "@/interfaces/supplier"
import { Eye, Mail, Send, X } from "lucide-react";
import { useState } from "react"

export default function EmailOutreachModal({ supplier, onClose, onSend }: {
    supplier: Supplier
    onClose: () => void
    onSend: (supplier: Supplier, subject: string, body: string) => void
}) {
    const [subject, setSubject] = useState(`Partnership Inquiry - JourneyFoods`)
    const [body, setBody] = useState(
        `Hi ${supplier.name} Team,\n\nI hope this message finds you well. My name is Riana Lynn from JourneyFoods, and I'm reaching out because we're impressed with your ingredient offerings.\n\nWe're currently looking for suppliers who can provide high-quality ingredients for our food manufacturing partners. Based on your profile, we believe there could be a great opportunity for collaboration.\n\nWould you be interested in setting up a call to discuss potential partnership opportunities?\n\nAdditionally, we'd love to invite you to create a supplier profile on our platform, which will help streamline communication and enable us to better match your products with our clients' needs.\n\nLooking forward to hearing from you.\n\nBest regards,\nRiana Lynn\nJourneyFoods`
    )

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Mail className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">Send Outreach Email</h2>
                                <p className="text-sm text-slate-500">To: {supplier.email}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5 text-slate-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                        <input
                            id="subject"
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="body" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                        <textarea
                            id="body"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={12}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-semibold text-slate-800">Email Tracking Enabled</h3>
                                <p className="text-xs text-slate-600 mt-1">
                                    You&apos;ll be notified when the recipient opens this email. The email includes an invitation for the supplier to sign up for a profile on JourneyFoods.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-200 flex gap-3">
                    <button
                        type="button"
                        onClick={() => onSend(supplier, subject, body)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Send className="h-4 w-4" />
                        Send Email
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-3 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}