
import React from 'react';
import { PricingTable } from '@clerk/nextjs';
const Pricing = () => {
  return (
    <section id="pricing" style={{ position: 'relative', padding: 'clamp(60px, 10vw, 120px) 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <PricingTable />
      </div>
    </section>
  );
};

export default Pricing;


