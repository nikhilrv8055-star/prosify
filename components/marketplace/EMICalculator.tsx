'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, IndianRupee, PieChart } from 'lucide-react';
import { formatIndianPrice } from '@/lib/utils';

interface EMICalculatorProps {
  initialPrice?: number;
  propertyPrice?: number;
}

export function EMICalculator({ initialPrice, propertyPrice }: EMICalculatorProps) {
  const basePrice = propertyPrice || initialPrice || 7500000;
  // Down payment default 20%
  const [loanAmount, setLoanAmount] = useState(Math.round(basePrice * 0.8));
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  const calculations = useMemo(() => {
    const principal = loanAmount;
    const ratePerMonth = interestRate / (12 * 100);
    const months = tenureYears * 12;

    const emi =
      (principal * ratePerMonth * Math.pow(1 + ratePerMonth, months)) /
      (Math.pow(1 + ratePerMonth, months) - 1);

    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;

    return {
      monthlyEmi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      principalPercent: Math.round((principal / totalAmount) * 100),
      interestPercent: Math.round((totalInterest / totalAmount) * 100),
    };
  }, [loanAmount, interestRate, tenureYears]);

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] space-y-6">
      <div className="flex items-center gap-2 border-b border-neutral-100 pb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#D4A017] flex items-center justify-center">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-neutral-950 text-base">Home Loan EMI Calculator</h3>
          <p className="text-xs text-neutral-500">Estimate your monthly mortgage payments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Sliders */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1">
              <span>Loan Amount</span>
              <span className="text-neutral-900 font-bold">{formatIndianPrice(loanAmount)}</span>
            </div>
            <input
              type="range"
              min="1000000"
              max="50000000"
              step="200000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-[#D4A017] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1">
              <span>Interest Rate (% per annum)</span>
              <span className="text-neutral-900 font-bold">{interestRate}%</span>
            </div>
            <input
              type="range"
              min="7.0"
              max="14.0"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-[#D4A017] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1">
              <span>Tenure</span>
              <span className="text-neutral-900 font-bold">{tenureYears} Years ({tenureYears * 12} mos)</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-[#D4A017] cursor-pointer"
            />
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-200 text-center space-y-4">
          <div>
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Monthly EMI Payable
            </span>
            <div className="text-3xl font-extrabold text-neutral-950 mt-1">
              ₹{calculations.monthlyEmi.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-neutral-400">per month</span>
          </div>

          {/* Breakdown progress bar */}
          <div className="space-y-1.5">
            <div className="h-3 w-full bg-neutral-200 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${calculations.principalPercent}%` }}
                className="bg-[#D4A017] h-full"
                title={`Principal: ${calculations.principalPercent}%`}
              />
              <div
                style={{ width: `${calculations.interestPercent}%` }}
                className="bg-neutral-800 h-full"
                title={`Interest: ${calculations.interestPercent}%`}
              />
            </div>
            <div className="flex justify-between text-[11px] text-neutral-600 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#D4A017]" />
                Principal: {formatIndianPrice(loanAmount)}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-neutral-800" />
                Total Interest: {formatIndianPrice(calculations.totalInterest)}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-200 text-xs text-neutral-600 flex justify-between">
            <span>Total Repayment (P + I):</span>
            <strong className="text-neutral-900">{formatIndianPrice(calculations.totalAmount)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
