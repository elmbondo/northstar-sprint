import React from 'react';
import StatusBadge from './StatusBadge.jsx';
import { Calendar, Package, Clock, Truck } from 'lucide-react';

const STATUS_STEPS = ['Processing', 'Shipped', 'In Transit', 'Delivered'];

export default function OrderResult({ order }) {
  if (!order) return null;

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);
  
  return (
    <div className="w-full max-w-xl mx-auto bg-white border border-brand-taupe/15 p-8 sm:p-10 space-y-8">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-brand-taupe/15">
        <div>
          <span className="block text-[10px] uppercase tracking-widest text-brand-espresso/50 font-bold mb-1">
            Order Reference
          </span>
          <h2 className="font-serif text-2xl text-brand-espresso font-medium">
            {order.orderNumber}
          </h2>
        </div>
        <div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="py-2" aria-label="Order progress tracker">
        <div className="relative flex items-center justify-between">
          {/* Progress bar background line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-brand-sand z-0" />
          
          {/* Active progress line */}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-brand-espresso z-0 transition-all duration-500" 
            style={{ 
              width: `${currentStepIndex >= 0 ? (currentStepIndex / (STATUS_STEPS.length - 1)) * 100 : 0}%` 
            }}
          />

          {/* Timeline Nodes */}
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step} className="relative z-10 flex flex-col items-center">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 text-[10px] font-bold transition-all duration-300 ${
                    isCurrent 
                      ? 'bg-brand-espresso text-brand-cream border-brand-espresso ring-4 ring-brand-taupe/15'
                      : isCompleted
                      ? 'bg-brand-espresso text-brand-cream border-brand-espresso'
                      : 'bg-white text-brand-espresso/30 border-brand-taupe/20'
                  }`}
                >
                  {idx + 1}
                </div>
                <span 
                  className={`absolute top-8 whitespace-nowrap text-[10px] uppercase tracking-widest font-semibold ${
                    isCurrent 
                      ? 'text-brand-espresso font-bold' 
                      : 'text-brand-espresso/45'
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spacing spacer for absolute positioned labels in timeline */}
      <div className="h-6" />

      {/* Details List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-brand-taupe/15">
        
        <div className="flex items-start gap-3">
          <div className="text-brand-espresso/45 mt-0.5">
            <Package className="w-4 h-4 stroke-[1.5]" />
          </div>
          <div>
            <span className="block text-[9px] uppercase tracking-wider text-brand-espresso/50 font-bold">
              Item Ordered
            </span>
            <span className="block text-sm text-brand-espresso font-medium mt-0.5">
              {order.product}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="text-brand-espresso/45 mt-0.5">
            <Calendar className="w-4 h-4 stroke-[1.5]" />
          </div>
          <div>
            <span className="block text-[9px] uppercase tracking-wider text-brand-espresso/50 font-bold">
              Purchase Date
            </span>
            <span className="block text-sm text-brand-espresso font-medium mt-0.5">
              {new Date(order.orderDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="text-brand-espresso/45 mt-0.5">
            <Truck className="w-4 h-4 stroke-[1.5]" />
          </div>
          <div>
            <span className="block text-[9px] uppercase tracking-wider text-brand-espresso/50 font-bold">
              Estimated Delivery
            </span>
            <span className="block text-sm text-brand-espresso font-medium mt-0.5">
              {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="text-brand-espresso/45 mt-0.5">
            <Clock className="w-4 h-4 stroke-[1.5]" />
          </div>
          <div>
            <span className="block text-[9px] uppercase tracking-wider text-brand-espresso/50 font-bold">
              Last Updated
            </span>
            <span className="block text-sm text-brand-espresso font-medium mt-0.5">
              {new Date(order.lastUpdated).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
