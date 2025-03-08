'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { commonStyles } from '@/styles/theme';

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className={commonStyles.container}>
      <div className={commonStyles.contentWrapper}>
        <div className="max-w-2xl mx-auto">
          <div className={commonStyles.card}>
            <h1 className={commonStyles.heading}>Payment Cancelled</h1>
            <p className={`${commonStyles.text.secondary} mb-8`}>
              Your payment was cancelled. No charges were made.
            </p>
            <button
              onClick={() => router.push('/')}
              className={commonStyles.button.primary}
            >
              Return to Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 