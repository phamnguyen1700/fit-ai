"use client";

import React, { useState } from "react";
import { Card } from '@/shared/ui';
import TableImEx from "../TableImEx";

const ArchiveTab = () => {

  return (
    <Card className="archive-tab-container">
      <div className="p-6">
        <header className="mb-6">
          <h4 className="text-2xl font-bold text-[var(--text)]">
            Lịch sử Import/Export
          </h4>
        </header>
        <TableImEx />
      </div>
    </Card>
  );
};

export default ArchiveTab;
