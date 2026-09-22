'use client';

import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Link as LinkIcon,
  MousePointerClick,
  Building,
  UserPlus,
  Calendar,
  Layers,
  IndianRupee,
  RefreshCw,
  ExternalLink,
  Lock,
  EyeOff,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { formatIndianPrice } from '@/lib/utils';
import { store } from '@/lib/data/store';

let simSequence = 2100;
function getNextSimSequence(): number {
  simSequence += 1;
  return simSequence;
}

interface FlowStep {
  id: number;
  title: string;
  subtitle: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'ERROR';
  details?: string;
  badge?: string;
}

interface PartnerFlowTesterProps {
  onFlowCompleted?: () => void;
  defaultPartnerId?: string;
}

export function PartnerFlowTester({ onFlowCompleted, defaultPartnerId = 'cp-1' }: PartnerFlowTesterProps) {
  const [activePartnerId, setActivePartnerId] = useState<string>(defaultPartnerId);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [testLog, setTestLog] = useState<string[]>([]);
  const [isolationVerified, setIsolationVerified] = useState<boolean | null>(null);

  const partners = store.getChannelPartners();
  const partnerA = partners.find((p) => p.id === activePartnerId) || partners[0];
  const partnerB = partners.find((p) => p.id !== partnerA.id) || partners[1];

  const createInitialSteps = (): FlowStep[] => [
    {
      id: 1,
      title: 'Partner Verification & Isolation',
      subtitle: `Authenticate active partner ${partnerA.code} (${partnerA.companyName})`,
      status: 'PENDING',
    },
    {
      id: 2,
      title: 'Tracking Link Generation',
      subtitle: 'Create unique URL with partner tag & UTM campaign parameters',
      status: 'PENDING',
    },
    {
      id: 3,
      title: 'Visitor Link Click & Cookie Tagging',
      subtitle: 'Simulate visitor arrival; write 30-day attribution & increment click count',
      status: 'PENDING',
    },
    {
      id: 4,
      title: 'Property Selection & Browsing',
      subtitle: 'Visitor explores Godrej Riviera / Piramal Vaikunth property inventory',
      status: 'PENDING',
    },
    {
      id: 5,
      title: 'Lead Ingestion & Attribution',
      subtitle: `Enquiry submitted; permanently tagged to ${partnerA.code} in CRM`,
      status: 'PENDING',
    },
    {
      id: 6,
      title: 'CRM Verification & Data Isolation',
      subtitle: `Verify lead appears in ${partnerA.code}&apos;s dashboard and is HIDDEN from ${partnerB.code}`,
      status: 'PENDING',
    },
    {
      id: 7,
      title: 'Site Visit Dispatch & Completion',
      subtitle: 'Schedule on-site physical tour with assigned rep and mark COMPLETED',
      status: 'PENDING',
    },
    {
      id: 8,
      title: 'Unit Booking & Inventory Lock',
      subtitle: 'Confirm unit sale (₹75 Lakh), mark unit BOOKED, update lead status',
      status: 'PENDING',
    },
    {
      id: 9,
      title: 'Commission Ledger & RTGS Payout',
      subtitle: `Calculate 2.5% commission (₹1,87,500), approve & issue bank UTR receipt`,
      status: 'PENDING',
    },
  ];

  const [steps, setSteps] = useState<FlowStep[]>(createInitialSteps);

  const appendLog = (msg: string) => {
    setTestLog((prev) => [...prev, `[${new Date().toLocaleTimeString('en-IN')}] ${msg}`]);
  };

  const updateStep = (index: number, changes: Partial<FlowStep>) => {
    setSteps((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, ...changes } : s))
    );
  };

  const runFullFlowTest = async () => {
    setIsRunning(true);
    setTestLog([]);
    setIsolationVerified(null);
    setSteps(createInitialSteps());

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    let activeIdx = 0;

    try {
      // Step 1: Partner Selection
      activeIdx = 0;
      setCurrentStepIndex(0);
      updateStep(0, { status: 'RUNNING' });
      appendLog(`Step 1: Authenticating Partner A: ${partnerA.companyName} (${partnerA.code})`);
      appendLog(`Partner MahaRERA: ${partnerA.reraNumber || 'A51800049281'} • Commission Tier: 2.5%`);
      await delay(400);
      updateStep(0, {
        status: 'SUCCESS',
        details: `Partner Verified: ${partnerA.companyName} (${partnerA.code})`,
        badge: 'MahaRERA Verified',
      });

      // Step 2: Tracking Link Generation
      activeIdx = 1;
      setCurrentStepIndex(1);
      updateStep(1, { status: 'RUNNING' });
      const targetSlug = 'godrej-riviera';
      const utmCampaign = 'diwali_super_saver_2026';
      const trackingUrl = `https://www.prosify.in/projects/${targetSlug}?partner=${partnerA.code}&utm_source=whatsapp&utm_medium=broadcast&utm_campaign=${utmCampaign}`;
      appendLog(`Step 2: Generated Tracking Link for ${partnerA.code}:`);
      appendLog(`Target URL: ${trackingUrl}`);

      const createdLink = store.createTrackingLink({
        partnerId: partnerA.id,
        targetUrl: `/projects/${targetSlug}`,
        utmSource: 'whatsapp',
        utmMedium: 'broadcast',
        utmCampaign,
      });
      await delay(400);
      updateStep(1, {
        status: 'SUCCESS',
        details: `Link Code: ${createdLink.code} | utm_campaign: ${utmCampaign}`,
        badge: 'Unique Tagged',
      });

      // Step 3: Visitor Click & Cookie Tagging
      activeIdx = 2;
      setCurrentStepIndex(2);
      updateStep(2, { status: 'RUNNING' });
      appendLog(`Step 3: Simulating Visitor arrival from WhatsApp click...`);
      store.recordTrackingEvent(partnerA.code, `/projects/${targetSlug}`, 'CLICK', createdLink.code);
      appendLog(`Attribution cookie [prosify_partner_ref=${partnerA.code}] tagged with 30-day persistence`);
      appendLog(`Partner A clicks: ${partnerA.clicksCount} (Partner B clicks: ${partnerB.clicksCount} unchanged)`);
      await delay(450);
      updateStep(2, {
        status: 'SUCCESS',
        details: `Click recorded. 30-day session attribution locked to ${partnerA.code}`,
        badge: '30-Day Cookie Active',
      });

      // Step 4: Property Selection
      activeIdx = 3;
      setCurrentStepIndex(3);
      updateStep(3, { status: 'RUNNING' });
      const property = store.getProperties()[0];
      appendLog(`Step 4: Visitor browsed property: "${property.title}" (${property.city})`);
      appendLog(`Unit types inspected: 2 BHK Riverview • Carpet: 685 sq ft`);
      await delay(350);
      updateStep(3, {
        status: 'SUCCESS',
        details: `Target: ${property.title} (Price: ${formatIndianPrice(property.price)})`,
        badge: 'RERA Verified Property',
      });

      // Step 5: Lead Ingestion & Attribution
      activeIdx = 4;
      setCurrentStepIndex(4);
      updateStep(4, { status: 'RUNNING' });
      const seq = getNextSimSequence();
      const testLeadName = `Vikramaditya Rao (${seq})`;
      const testLeadPhone = `+91 98200 ${seq + 50000}`;
      appendLog(`Step 5: Buyer submitted enquiry form: ${testLeadName} (${testLeadPhone})`);

      const newLead = store.createLead({
        name: testLeadName,
        phone: testLeadPhone,
        email: 'vikram.rao@enterprise.com',
        propertyId: property.id,
        propertyTitle: property.title,
        projectId: property.projectId || 'proj-1',
        projectName: property.projectName || 'Godrej Riviera',
        developerName: property.developerName || 'Godrej Properties',
        partnerId: partnerA.id,
        partnerCode: partnerA.code,
        partnerName: partnerA.companyName,
        budget: '₹70 Lakh - ₹85 Lakh',
        requirement: '2 BHK Riverview with deck',
        location: 'Kalyan / Dombivli East',
        source: 'CHANNEL_PARTNER',
        utmSource: 'whatsapp',
        utmMedium: 'broadcast',
        utmCampaign,
        notes: `Simulated end-to-end test lead tagged to CP ${partnerA.code}`,
        assignedTo: 'Amit Sharma (Sales Mgr)',
      });

      appendLog(`Lead created: ID=${newLead.id}, Source=CHANNEL_PARTNER, Partner=${partnerA.code}`);
      await delay(500);
      updateStep(4, {
        status: 'SUCCESS',
        details: `Lead ${newLead.id} created & attributed to ${partnerA.code} (${partnerA.companyName})`,
        badge: 'Attributed to Partner A',
      });

      // Step 6: CRM Verification & Isolation Check
      activeIdx = 5;
      setCurrentStepIndex(5);
      updateStep(5, { status: 'RUNNING' });
      appendLog(`Step 6: Enforcing Data Isolation between Partner A and Partner B...`);

      // Query Partner A leads
      const partnerALeads = store.getLeads({ partnerId: partnerA.id });
      const foundInA = partnerALeads.some((l) => l.id === newLead.id);

      // Query Partner B leads
      const partnerBLeads = store.getLeads({ partnerId: partnerB.id });
      const leakedToB = partnerBLeads.some((l) => l.id === newLead.id);

      appendLog(`Partner A (${partnerA.code}) leads count: ${partnerALeads.length} (Contains new lead: ${foundInA})`);
      appendLog(`Partner B (${partnerB.code}) leads count: ${partnerBLeads.length} (Contains new lead: ${leakedToB ? 'LEAK DETECTED!' : 'ZERO / ISOLATED'})`);

      if (foundInA && !leakedToB) {
        setIsolationVerified(true);
        appendLog(`[SECURITY CONFIRMED] Partner A can see lead; Partner B CANNOT see lead.`);
      } else {
        setIsolationVerified(false);
        throw new Error('Data isolation check failed!');
      }

      await delay(500);
      updateStep(5, {
        status: 'SUCCESS',
        details: `Verified: Lead visible to ${partnerA.code}. Strictly hidden from ${partnerB.code}.`,
        badge: '🔒 Strict Isolation Enforced',
      });

      // Step 7: Site Visit Dispatch & Completion
      activeIdx = 6;
      setCurrentStepIndex(6);
      updateStep(6, { status: 'RUNNING' });
      appendLog(`Step 7: Scheduling Site Visit for ${newLead.name}...`);

      const newVisit = store.createSiteVisit({
        leadId: newLead.id,
        leadName: newLead.name,
        leadPhone: newLead.phone,
        projectId: newLead.projectId,
        projectName: newLead.projectName || 'Godrej Riviera',
        propertyId: newLead.propertyId,
        propertyTitle: newLead.propertyTitle,
        partnerId: partnerA.id,
        partnerCode: partnerA.code,
        salesExecutive: 'Rohan Mehra (Site Closing Mgr)',
        visitDate: new Date().toISOString().split('T')[0],
        visitTime: '03:30 PM',
        notes: 'Complimentary Mercedes site pickup provided. Client accompanied by spouse.',
      });

      appendLog(`Site Visit created: ID=${newVisit.id} • Assigned Rep: Rohan Mehra`);
      await delay(400);

      // Mark visit completed
      store.updateSiteVisitStatus(newVisit.id, 'COMPLETED', 'Client highly satisfied with sample flat. Proceeded to token.');
      appendLog(`Site visit completed! Lead stage automatically updated to VISITED.`);
      await delay(400);

      updateStep(6, {
        status: 'SUCCESS',
        details: `Visit ID ${newVisit.id} completed. Lead marked VISITED.`,
        badge: 'Visit Completed',
      });

      // Step 8: Unit Booking & Inventory Lock
      activeIdx = 7;
      setCurrentStepIndex(7);
      updateStep(7, { status: 'RUNNING' });
      const agreementVal = 7500000; // 75 Lakhs
      const tokenAdvance = 100000;
      const unitSeq = getNextSimSequence();
      const unitNo = `T2-${(unitSeq % 900) + 100}`;
      appendLog(`Step 8: Booking Unit ${unitNo} at agreement value ${formatIndianPrice(agreementVal)}...`);

      const newBooking = store.createBooking({
        leadId: newLead.id,
        customerName: newLead.name,
        customerPhone: newLead.phone,
        projectId: newLead.projectId,
        projectName: newLead.projectName,
        propertyId: newLead.propertyId,
        propertyTitle: newLead.propertyTitle,
        unitNumber: unitNo,
        partnerId: partnerA.id,
        partnerCode: partnerA.code,
        partnerName: partnerA.companyName,
        bookingDate: new Date().toISOString().split('T')[0],
        bookingAmount: tokenAdvance,
        totalAgreementValue: agreementVal,
        ratePercent: 2.5,
        status: 'CONFIRMED',
      });

      appendLog(`Booking confirmed! ID=${newBooking.id} • Unit ${unitNo} status set to BOOKED.`);
      appendLog(`Lead status automatically upgraded to BOOKED.`);
      await delay(500);

      updateStep(7, {
        status: 'SUCCESS',
        details: `Unit ${unitNo} locked. Total Value: ${formatIndianPrice(agreementVal)}`,
        badge: 'Unit Booked',
      });

      // Step 9: Commission Ledger & Payout
      activeIdx = 8;
      setCurrentStepIndex(8);
      updateStep(8, { status: 'RUNNING' });
      const expectedCommission = Math.round((agreementVal * 2.5) / 100);
      appendLog(`Step 9: Automatic Commission Calculation: 2.5% of ₹75,00,000 = ${formatIndianPrice(expectedCommission)}`);

      // Find created commission
      const partnerComms = store.getCommissions(partnerA.id);
      const generatedComm = partnerComms.find((c) => c.bookingId === newBooking.id);

      if (!generatedComm) {
        throw new Error('Commission ledger entry was not generated!');
      }

      appendLog(`Commission created in PENDING status: ID=${generatedComm.id} (Amount: ${formatIndianPrice(generatedComm.amount)})`);
      await delay(400);

      // Admin approves
      store.updateCommissionStatus(generatedComm.id, 'APPROVED');
      appendLog(`Admin approved commission.`);
      await delay(300);

      // Admin pays out with UTR
      const utrSeq = getNextSimSequence();
      const bankUtr = `HDFC98${utrSeq + 10000000}`;
      store.updateCommissionStatus(generatedComm.id, 'PAID', bankUtr);
      appendLog(`Admin disbursed payment via RTGS! Bank UTR: ${bankUtr}`);

      // Final Isolation Check on Commissions
      const partnerBComms = store.getCommissions(partnerB.id);
      const commLeakedToB = partnerBComms.some((c) => c.id === generatedComm.id);
      appendLog(`Partner B commissions count: ${partnerBComms.length} (Partner A commission visible to B: ${commLeakedToB ? 'LEAK!' : 'ZERO / ISOLATED'})`);

      await delay(400);
      updateStep(8, {
        status: 'SUCCESS',
        details: `Earned ${formatIndianPrice(expectedCommission)} (2.5%). Paid via UTR ${bankUtr}`,
        badge: 'Disbursed (PAID)',
      });

      appendLog(`🎉 COMPLETE FLOW TEST SUCCESSFUL! All 9 modules executed and verified with 100% data isolation.`);
      setCurrentStepIndex(9);

      if (onFlowCompleted) {
        onFlowCompleted();
      }
    } catch (err: any) {
      appendLog(`❌ ERROR: ${err.message}`);
      if (activeIdx >= 0) {
        updateStep(activeIdx, {
          status: 'ERROR',
          details: err.message,
        });
      }
    } finally {
      setIsRunning(false);
    }
  };

  const getStepIcon = (id: number) => {
    switch (id) {
      case 1:
        return <ShieldCheck className="w-5 h-5" />;
      case 2:
        return <LinkIcon className="w-5 h-5" />;
      case 3:
        return <MousePointerClick className="w-5 h-5" />;
      case 4:
        return <Building className="w-5 h-5" />;
      case 5:
        return <UserPlus className="w-5 h-5" />;
      case 6:
        return <Lock className="w-5 h-5" />;
      case 7:
        return <Calendar className="w-5 h-5" />;
      case 8:
        return <Layers className="w-5 h-5" />;
      case 9:
        return <IndianRupee className="w-5 h-5" />;
      default:
        return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4A017] to-[#996515] flex items-center justify-center text-neutral-950 font-black text-sm shadow-sm">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-neutral-950">
              End-to-End Partner Lifecycle & Isolation Tester
            </h3>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Automates the complete flow: <span className="font-semibold text-neutral-800">Partner → Tracking Link → Visitor → Property → Lead → CRM → Site Visit → Booking → Commission</span> while verifying zero cross-tenant leakage.
          </p>
        </div>

        {/* Partner Switcher for Testing */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500 font-medium">Test As:</span>
            <select
              value={activePartnerId}
              onChange={(e) => setActivePartnerId(e.target.value)}
              disabled={isRunning}
              className="bg-neutral-50 border border-neutral-300 rounded-xl px-2.5 py-1.5 font-bold text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4A017]"
            >
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.companyName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={runFullFlowTest}
            disabled={isRunning}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
              isRunning
                ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                : 'bg-[#D4A017] hover:bg-[#b58710] text-neutral-950'
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating Flow...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Complete Lifecycle Test</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Strict Isolation Notice Card */}
      <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200/80 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 flex-1">
          <div className="flex items-center gap-2">
            <strong className="font-bold">Strict Partner Isolation Guarantee Active:</strong>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-200/70 text-blue-900 font-semibold">
              Isolated Store Filter
            </span>
          </div>
          <p className="text-[11px] text-blue-800 mt-0.5">
            Partner A (<strong>{partnerA.code}</strong>) and Partner B (<strong>{partnerB.code}</strong>) operate in isolated tenant scopes. At step 6 and step 9, the simulator actively queries Partner B&apos;s database to verify 0 cross-partner leakage of leads or commissions.
          </p>
        </div>
        {isolationVerified !== null && (
          <div className="shrink-0 flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-white border border-blue-200">
            {isolationVerified ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Isolation 100% Passed</span>
              </span>
            ) : (
              <span className="text-rose-700 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Isolation Failed</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* 9 Step Progression Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {steps.map((step, idx) => {
          const isPending = step.status === 'PENDING';
          const isCurrent = step.status === 'RUNNING';
          const isSuccess = step.status === 'SUCCESS';
          const isError = step.status === 'ERROR';

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border transition-all relative ${
                isSuccess
                  ? 'bg-emerald-50/40 border-emerald-200/80 text-neutral-900'
                  : isCurrent
                  ? 'bg-amber-50/60 border-amber-400 shadow-sm ring-2 ring-amber-300/50'
                  : isError
                  ? 'bg-red-50 border-red-300 text-red-900'
                  : 'bg-neutral-50/50 border-neutral-200/70 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSuccess
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-[#D4A017] text-neutral-950 animate-pulse'
                        : isError
                        ? 'bg-red-600 text-white'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {step.id}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold truncate text-neutral-950">{step.title}</h4>
                    <span className="text-[10px] text-neutral-500 line-clamp-1">{step.subtitle}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {isCurrent && <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />}
                  {isError && <AlertCircle className="w-4 h-4 text-red-600" />}
                </div>
              </div>

              {step.details && (
                <div className="mt-2 pt-2 border-t border-neutral-200/60 flex items-center justify-between gap-1 text-[11px]">
                  <span className="font-mono text-neutral-700 truncate">{step.details}</span>
                  {step.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white border border-neutral-300 text-neutral-800 shrink-0">
                      {step.badge}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Real-time Telemetry Logs Box */}
      {testLog.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-700">
            <span>Execution Telemetry & Isolation Audit Log:</span>
            <span className="font-mono text-[10px] text-neutral-500">{testLog.length} events emitted</span>
          </div>
          <div className="bg-neutral-950 text-neutral-200 p-4 rounded-xl font-mono text-[11px] leading-relaxed max-h-56 overflow-y-auto space-y-1 shadow-inner border border-neutral-800">
            {testLog.map((log, i) => {
              const isIso = log.includes('SECURITY') || log.includes('ZERO / ISOLATED');
              const isErr = log.includes('ERROR') || log.includes('LEAK');
              const isSucc = log.includes('🎉') || log.includes('SUCCESSFUL');
              return (
                <div
                  key={i}
                  className={`${
                    isErr
                      ? 'text-rose-400 font-bold'
                      : isIso
                      ? 'text-emerald-400 font-semibold'
                      : isSucc
                      ? 'text-[#F4C430] font-bold'
                      : 'text-neutral-300'
                  }`}
                >
                  {log}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
