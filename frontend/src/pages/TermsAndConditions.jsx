import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function TermsAndConditions() {
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
          Warehouse Management System Terms &amp; Conditions
        </h1>
        <p className="mt-2 text-xs text-slate-500 font-mono">Effective Date: October 31, 2026</p>

        <div className="mt-8 space-y-6 text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">1. Acceptance of Terms</h2>
            <p>
              By authenticating into and utilizing this Warehouse Management System ("System"), you agree
              to abide by these operational terms, role authorization limits, and security directives.
              If you do not possess authorized credentials granted by facility administration, terminate session access immediately.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">2. User Account Responsibilities</h2>
            <p>
              Operators are issued distinct role credentials (Admin, Manager, or Floor Operative).
              Users are strictly prohibited from sharing credentials or bypassing role authorization constraints.
              Any action taken under an authenticated operator session is cryptographically tied to that account in system audit logs.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">3. Inventory Integrity and Auditing</h2>
            <p>
              All inventory inputs, physical shelf movements, dispatch orders, and cycle count entries must accurately
              reflect physical facility stock. Intentional falsification of receiving manifests, inventory quantities,
              or quality inspection flags constitutes a material breach of operational policy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">4. Automated Demand Forecasts</h2>
            <p>
              Predictive models and regression calculations provided within the System serve as operational planning aids.
              Actual stock allocation decisions must account for physical dock capacity, vendor lead times, and certified purchase contracts.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">5. System Availability and Maintenance</h2>
            <p>
              Facility administration reserves the authority to perform scheduled system maintenance, data integrity
              audits, or software updates. Operators will be notified in advance through official shift channels.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">6. Modifications</h2>
            <p>
              These operational terms may be amended to maintain alignment with logistics industry regulations and
              facility safety protocols. Continued utilization of the System confirms acceptance of amended terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
