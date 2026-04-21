"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  ShieldCheck, 
  Code2, 
  Zap, 
  Info, 
  ArrowRight, 
  Calculator,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { calculateTax, TaxCalculationResult } from '@/lib/tax-engine';
import taxData from '@/data/tax-rules.json';

export default function GlobalTaxDashboard() {
  const [buyerLoc, setBuyerLoc] = useState('US');
  const [buyerState, setBuyerState] = useState('CA');
  const [amount, setAmount] = useState(100);
  const [annualSales, setAnnualSales] = useState(0);
  const [result, setResult] = useState<TaxCalculationResult | null>(null);

  const usStates = Object.entries(taxData.regions.US.states).map(([code, data]) => ({
    code,
    name: data.name
  }));

  useEffect(() => {
    const res = calculateTax({
      vendor_loc: 'KR',
      buyer_loc: buyerLoc,
      buyer_state: buyerLoc === 'US' ? buyerState : undefined,
      amount,
      currency: buyerLoc === 'US' ? 'USD' : (buyerLoc === 'EU' ? 'EUR' : (buyerLoc === 'JP' ? 'JPY' : 'KRW')),
      product_type: 'digital_service',
      annual_sales: annualSales
    });
    setResult(res);
  }, [buyerLoc, buyerState, amount, annualSales]);

  return (
    <div className="relative min-h-screen">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[20%] w-[35rem] h-[35rem] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-slate-300">Enterprise-Grade Tax Compliance</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
            Micro-Tax <span className="text-gradient">&</span> VAT Lookup
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            The deterministic tax engine for indie hackers and global SaaS. 
            Instant nexus detection for 50 US states, EU, Japan, and South Korea.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { name: 'Free', price: '$0', calls: '10/mo', desc: 'Testing & Small MVPs' },
              { name: 'Pro', price: '$19', calls: '1k/mo', desc: 'Indie Hackers & Startups', highlight: true },
              { name: 'Ultra', price: '$99', calls: '100k/mo', desc: 'Enterprise Scaling' },
            ].map((tier) => (
              <div key={tier.name} className={`glass p-6 text-center ${tier.highlight ? 'border-blue-500/50 bg-blue-500/5' : ''}`}>
                <div className="text-sm font-bold text-blue-400 mb-1">{tier.name}</div>
                <div className="text-3xl font-bold mb-1">{tier.price}<span className="text-sm text-slate-500 font-normal"> /mo</span></div>
                <div className="text-xs text-slate-400 mb-4">{tier.calls} API calls</div>
                <p className="text-[10px] text-slate-500">{tier.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Calculator Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-12 xl:col-span-8"
          >
            <div className="glass p-8 h-full">
              <div className="flex items-center gap-3 mb-8">
                <Calculator className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-semibold">Tax Prediction Simulator</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Buyer Location</label>
                    <select 
                      value={buyerLoc}
                      onChange={(e) => setBuyerLoc(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                    >
                      <option value="US">🇺🇸 United States</option>
                      <option value="EU">🇪🇺 European Union (OSS)</option>
                      <option value="JP">🇯🇵 Japan (JCT)</option>
                      <option value="KR">🇰🇷 South Korea (VAT)</option>
                    </select>
                  </div>

                  {buyerLoc === 'US' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <label className="block text-sm font-medium text-slate-400 mb-2">Target State</label>
                      <select 
                        value={buyerState}
                        onChange={(e) => setBuyerState(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                      >
                        {usStates.map(state => (
                          <option key={state.code} value={state.code}>{state.name}</option>
                        ))}
                      </select>
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Transaction Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                      <input 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                      Annual Sales (Nexus Check)
                      <Info className="w-3 h-3 text-slate-500 cursor-help" />
                    </label>
                    <input 
                      type="number"
                      value={annualSales}
                      onChange={(e) => setAnnualSales(Number(e.target.value))}
                      placeholder="Cumulative sales in region..."
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {result && (
                      <motion.div 
                        key={`${buyerLoc}-${buyerState}-${amount}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 border-blue-500/20"
                      >
                        <div className="text-sm font-medium text-blue-400 mb-1 uppercase tracking-wider">Estimated Tax</div>
                        <div className="text-5xl font-bold mb-6">
                          ${(amount * result.vat_rate).toFixed(2)}
                          <span className="text-xl text-slate-500 ml-2">({(result.vat_rate * 100).toFixed(1)}%)</span>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            {result.nexus_threshold_hit ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                            )}
                            <div>
                              <div className="font-medium text-slate-200">
                                {result.nexus_threshold_hit ? "Nexus Triggered" : "Below Nexus Threshold"}
                              </div>
                              <p className="text-sm text-slate-400">{result.legal_nexus_text}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <ArrowRight className="w-5 h-5 text-blue-400 mt-0.5" />
                            <div>
                              <div className="font-medium text-slate-200">Required Action</div>
                              <p className="text-sm text-slate-400">{result.action_required}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats / Features */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.4 }}
             className="lg:col-span-12 xl:col-span-4 flex flex-col gap-8"
          >
            <div className="glass p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                Global Coverage
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-900/50 rounded-lg text-sm border border-slate-700/30">🇺🇸 50 US States</div>
                <div className="p-3 bg-slate-900/50 rounded-lg text-sm border border-slate-700/30">🇪🇺 All EU (OSS)</div>
                <div className="p-3 bg-slate-900/50 rounded-lg text-sm border border-slate-700/30">🇯🇵 Japan (JCT)</div>
                <div className="p-3 bg-slate-900/50 rounded-lg text-sm border border-slate-700/30">🇰🇷 S. Korea (VAT)</div>
              </div>
            </div>

            <div className="glass p-6 bg-blue-600/5 border-blue-500/20">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Edge Distributed
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Deployed via Serverless Edge. Sub-millisecond tax lookups from 250+ global edge locations. Zero latency for your checkout.
              </p>
            </div>

            <div className="glass p-6 flex-1">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-purple-400" />
                Developer SDK
              </h3>
              <pre className="bg-black/40 p-4 rounded-lg text-[10px] text-slate-300 font-mono overflow-x-auto border border-white/5">
{`// Flutter/Dart Integration
final response = await http.get(
  Uri.parse('https://tax-api.global/lookup?country=US&state=CA')
);

// JavaScript/Node.js
const { tax_rate } = await taxApi.calculate({
  buyer_loc: 'JP',
  amount: 25000
});`}
              </pre>
            </div>
          </motion.div>
        </div>

        {/* Legal Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs"
        >
          <p>© 2026 Global Tax API. Data for reference purposes only. Not a replacement for professional tax advice.</p>
          <p className="mt-2">Last Database Update: {taxData.last_updated}</p>
        </motion.div>
      </main>
    </div>
  );
}
