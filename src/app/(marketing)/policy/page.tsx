"use client";

import React, { useState, useMemo } from "react";
import { useGetPolicies } from "@/tanstack/hooks/policy";
import { Policy } from "@/types/policy";
import { Skeleton } from "antd";
import Footer from "@/shared/ui/layout/marketing/components/Footer";

const PolicyView: React.FC = () => {
  const [selectedPolicyType, setSelectedPolicyType] = useState<string | null>(null);
  const [expandedPolicyId, setExpandedPolicyId] = useState<string | null>(null);

  // Fetch active policies
  const { data: policiesData, isLoading } = useGetPolicies({ isActive: true });

  const policies = useMemo(() => {
    if (!policiesData?.data || !Array.isArray(policiesData.data)) {
      return [];
    }
    return policiesData.data as Policy[];
  }, [policiesData]);

  // Group policies by type
  const policiesByType = useMemo(() => {
    const grouped: Record<string, Policy[]> = {};
    policies.forEach((policy) => {
      const type = policy.policyType || "Khác";
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(policy);
    });
    return grouped;
  }, [policies]);

  const policyTypes = Object.keys(policiesByType);

  // Get policies to display
  const displayedPolicies = useMemo(() => {
    if (selectedPolicyType) {
      return policiesByType[selectedPolicyType] || [];
    }
    return policies;
  }, [selectedPolicyType, policiesByType, policies]);

  const handlePolicyTypeClick = (type: string) => {
    if (selectedPolicyType === type) {
      setSelectedPolicyType(null);
    } else {
      setSelectedPolicyType(type);
    }
    setExpandedPolicyId(null);
  };

  const handlePolicyClick = (policyId: string) => {
    if (expandedPolicyId === policyId) {
      setExpandedPolicyId(null);
    } else {
      setExpandedPolicyId(policyId);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="w-full bg-gradient-to-r from-orange-400 to-orange-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-4xl md:text-5xl font-bold text-white text-center mb-4"
            style={{ fontFamily: "Phudu, sans-serif" }}
          >
            Chính Sách & Điều Khoản
          </h1>
          <p className="text-white/90 text-lg text-center max-w-3xl mx-auto">
            Tìm hiểu về các chính sách và điều khoản sử dụng của chúng tôi
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} active paragraph={{ rows: 4 }} className="h-32" />
            ))}
          </div>
        ) : policies.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              Hiện tại chưa có chính sách nào được công bố.
            </p>
          </div>
        ) : (
          <>
            {/* Policy Type Filters */}
            {policyTypes.length > 1 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={() => setSelectedPolicyType(null)}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedPolicyType === null
                        ? "bg-orange-500 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    Tất cả
                  </button>
                  {policyTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => handlePolicyTypeClick(type)}
                      className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                        selectedPolicyType === type
                          ? "bg-orange-500 text-white shadow-md"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Policies List */}
            <div className="space-y-6">
              {displayedPolicies.map((policy) => (
                <div
                  key={policy.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Policy Header */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => handlePolicyClick(policy.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3
                            className="text-2xl font-bold text-gray-900"
                            style={{ fontFamily: "Phudu, sans-serif" }}
                          >
                            {policy.title}
                          </h3>
                          {policy.policyType && (
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                              {policy.policyType}
                            </span>
                          )}
                        </div>
                        {policy.version && (
                          <p className="text-sm text-gray-500 mb-2">
                            Phiên bản: {policy.version}
                          </p>
                        )}
                        {(policy.lastUpdate || policy.lastCreate) && (
                          <p className="text-xs text-gray-400">
                            Cập nhật lần cuối:{" "}
                            {formatDate(policy.lastUpdate || policy.lastCreate)}
                          </p>
                        )}
                      </div>
                      <div className="ml-4">
                        <svg
                          className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
                            expandedPolicyId === policy.id ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Policy Content */}
                  {expandedPolicyId === policy.id && (
                    <div className="border-t border-gray-200 px-6 py-6 bg-gray-50">
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {policy.content.split('\n').map((line, index) => {
                          // Check if line looks like HTML
                          if (line.trim().startsWith('<')) {
                            return (
                              <div
                                key={index}
                                className="mb-4"
                                dangerouslySetInnerHTML={{ __html: line }}
                              />
                            );
                          }
                          // Regular text line
                          if (line.trim() === '') {
                            return <br key={index} />;
                          }
                          // Check if line is a heading (starts with #)
                          if (line.trim().startsWith('#')) {
                            const level = line.match(/^#+/)?.[0]?.length || 1;
                            const text = line.replace(/^#+\s*/, '');
                            const HeadingTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
                            return (
                              <HeadingTag
                                key={index}
                                className={`font-bold text-gray-900 mb-3 mt-4 ${
                                  level === 1 ? 'text-2xl' :
                                  level === 2 ? 'text-xl' :
                                  level === 3 ? 'text-lg' : 'text-base'
                                }`}
                                style={{ fontFamily: "Phudu, sans-serif" }}
                              >
                                {text}
                              </HeadingTag>
                            );
                          }
                          // Regular paragraph
                          return (
                            <p key={index} className="mb-3">
                              {line}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PolicyView;
