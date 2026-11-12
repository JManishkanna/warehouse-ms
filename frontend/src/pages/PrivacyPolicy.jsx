import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10 border border-slate-200 rounded-lg shadow-xs">
        <Link
          to="/"
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
          Back to Terminal
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 pb-4 border-b border-slate-200">
          Warehouse Management System Privacy Policy
        </h1>
        <p className="mt-2 text-xs text-slate-500 font-mono">Effective Date: October 31, 2026</p>

        <div className="mt-8 space-y-6 text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">1. Scope and Applicability</h2>
            <p>
              This Privacy Policy governs data processing activities within the Warehouse Management System
              (the "System") deployed for enterprise logistics and facility node tracking. This policy explains
              how technical telemetry, operator account credentials, and inventory transaction records are collected,
              processed, and protected.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">2. Information Collected</h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Operator Account Data:</strong> Username, organizational email, role assignments, and cryptographically salted password hashes (BCrypt).</li>
              <li><strong>Operational Transaction Records:</strong> Inbound purchase orders, dispatch manifests, inventory adjustments, and barcode/QR verification events.</li>
              <li><strong>System Audit Logs:</strong> Timestamps of stock updates, user authentication sessions, and shelf reallocations for regulatory compliance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">3. Purpose of Processing</h2>
            <p>
              Data is processed strictly for warehouse facility operations, demand forecasting algorithms,
              safety stock threshold triggers, and chain-of-custody tracking. No operational or personnel data
              is sold, commercialized, or shared with third-party tracking networks.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">4. Data Security Standards</h2>
            <p>
              All communication between client workstations and backend services is routed over secure encrypted
              protocols. Access control is strictly enforced through role-based access levels (ADMIN, MANAGER, WORKER),
              and session verification utilizes JSON Web Tokens (JWT) with mandatory expiration timeouts.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">5. Data Retention and Custody</h2>
            <p>
              Audit records and stock movement history are retained for the duration specified by enterprise
              regulatory standards. System administrators maintain authorized controls to purge or archive past records.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">6. Contact Information</h2>
            <p>
              For security compliance inquiries or administrative access requests, contact the designated
              facility systems administrator or internal logistics compliance officer.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
