'use client';

import React from 'react';
import { Card, Button } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import { PlanReviewModal } from '.';

interface AIPlan {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  generatedAt: string;
  status: 'pending' | 'approved' | 'needs_revision' | 'rejected';
  planCategory: 'meal' | 'workout'; // MEAL hoặc WORKOUT
  planType: 'weight-loss' | 'muscle-gain' | 'maintenance';
  duration: string; // "7 ngày", "14 ngày", "30 ngày"
  // Meal plan specific - AI đã gen món ăn cụ thể
  totalCalories?: number;
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
  };
  mealsPerDay?: number;
  sampleDishes?: string[]; // Các món ăn AI đã gen (preview)
  // Workout plan specific - AI đã gen video bài tập
  workoutsPerWeek?: number;
  sessionsPerWorkout?: number;
  focusAreas?: string[];
  sampleExercises?: string[]; // Các bài tập AI đã gen (preview)
  aiConfidence: number; // 0-100
  specialNotes?: string;
}

export default function AIPlansList() {
  const [filter, setFilter] = React.useState<'pending' | 'approved' | 'needs_revision' | 'all'>('pending');
  const [categoryFilter, setCategoryFilter] = React.useState<'all' | 'meal' | 'workout'>('all');
  const [selectedPlan, setSelectedPlan] = React.useState<AIPlan | null>(null);
  const [showModal, setShowModal] = React.useState(false);

  const plans: AIPlan[] = [
    // MEAL PLANS - AI đã gen món ăn cụ thể
    {
      id: '1',
      userId: 'u1',
      userName: 'Nguyễn Văn A',
      generatedAt: '5 phút trước',
      status: 'pending',
      planCategory: 'meal',
      planType: 'weight-loss',
      duration: '30 ngày',
      totalCalories: 1800,
      macros: { protein: 120, carbs: 180, fat: 60 },
      mealsPerDay: 5,
      sampleDishes: ['Cháo yến mạch chuối', 'Ức gà nướng rau củ', 'Cá hồi áp chảo', 'Salad bơ tôm', 'Sữa chua Hy Lạp'],
      aiConfidence: 92,
      specialNotes: 'Khách hàng yêu cầu không ăn thịt đỏ',
    },
    {
      id: '2',
      userId: 'u2',
      userName: 'Trần Thị B',
      generatedAt: '15 phút trước',
      status: 'pending',
      planCategory: 'meal',
      planType: 'muscle-gain',
      duration: '30 ngày',
      totalCalories: 2500,
      macros: { protein: 200, carbs: 280, fat: 70 },
      mealsPerDay: 6,
      sampleDishes: ['Trứng chiên bơ đậu phộng', 'Cơm gà teriyaki', 'Bít tết bò Úc', 'Pasta carbonara', 'Whey protein shake'],
      aiConfidence: 88,
      specialNotes: 'Tăng cơ nhanh, ăn nhiều protein',
    },
    // WORKOUT PLANS - AI đã gen video bài tập có sẵn
    {
      id: '3',
      userId: 'u3',
      userName: 'Lê Văn C',
      generatedAt: '30 phút trước',
      status: 'pending',
      planCategory: 'workout',
      planType: 'muscle-gain',
      duration: '30 ngày',
      workoutsPerWeek: 5,
      sessionsPerWorkout: 6,
      focusAreas: ['Ngực', 'Lưng', 'Chân', 'Vai', 'Tay'],
      sampleExercises: ['Bench Press', 'Deadlift', 'Squat', 'Pull-ups', 'Shoulder Press'],
      aiConfidence: 95,
      specialNotes: 'Tập gym, có kinh nghiệm 6 tháng',
    },
    {
      id: '4',
      userId: 'u4',
      userName: 'Phạm Thị D',
      generatedAt: '1 giờ trước',
      status: 'pending',
      planCategory: 'workout',
      planType: 'weight-loss',
      duration: '14 ngày',
      workoutsPerWeek: 4,
      sessionsPerWorkout: 5,
      focusAreas: ['Cardio', 'Full Body', 'HIIT'],
      sampleExercises: ['Burpees', 'Mountain Climbers', 'Jumping Jacks', 'Plank', 'Jump Squats'],
      aiConfidence: 90,
      specialNotes: 'Mới bắt đầu, cần bài tập nhẹ nhàng',
    },
    {
      id: '5',
      userId: 'u5',
      userName: 'Hoàng Văn E',
      generatedAt: '2 giờ trước',
      status: 'approved',
      planCategory: 'meal',
      planType: 'muscle-gain',
      duration: '30 ngày',
      totalCalories: 2800,
      macros: { protein: 220, carbs: 320, fat: 80 },
      mealsPerDay: 6,
      aiConfidence: 94,
    },
    {
      id: '6',
      userId: 'u6',
      userName: 'Đặng Thị F',
      generatedAt: '3 giờ trước',
      status: 'needs_revision',
      planCategory: 'workout',
      planType: 'maintenance',
      duration: '30 ngày',
      workoutsPerWeek: 3,
      sessionsPerWorkout: 4,
      focusAreas: ['Yoga', 'Pilates', 'Cardio nhẹ'],
      aiConfidence: 85,
      specialNotes: 'Cần giảm cường độ, tránh chấn thương',
    },
    {
      id: '7',
      userId: 'u7',
      userName: 'Võ Văn G',
      generatedAt: '4 giờ trước',
      status: 'pending',
      planCategory: 'meal',
      planType: 'maintenance',
      duration: '7 ngày',
      totalCalories: 2000,
      macros: { protein: 150, carbs: 200, fat: 65 },
      mealsPerDay: 4,
      aiConfidence: 91,
      specialNotes: 'Ăn chay, không gluten',
    },
  ];

  const filteredPlans = plans.filter((plan) => {
    const statusMatch = filter === 'all' || plan.status === filter;
    const categoryMatch = categoryFilter === 'all' || plan.planCategory === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const handleReview = (plan: AIPlan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const getPlanTypeLabel = (type: string) => {
    switch (type) {
      case 'weight-loss': return { 
        label: 'Giảm cân', 
        style: { background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' },
        icon: '📉' 
      };
      case 'muscle-gain': return { 
        label: 'Tăng cơ', 
        style: { background: 'rgba(59, 130, 246, 0.1)', color: 'var(--info)' },
        icon: '💪' 
      };
      case 'maintenance': return { 
        label: 'Duy trì', 
        style: { background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)' },
        icon: '⚖️' 
      };
      default: return { 
        label: 'Khác', 
        style: { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' },
        icon: '📋' 
      };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return { 
        label: 'Chờ duyệt', 
        style: { 
          background: 'rgba(249, 115, 22, 0.1)', 
          color: 'var(--warning)', 
          borderColor: 'var(--warning)' 
        }
      };
      case 'approved': return { 
        label: 'Đã duyệt', 
        style: { 
          background: 'rgba(34, 197, 94, 0.1)', 
          color: 'var(--success)', 
          borderColor: 'var(--success)' 
        }
      };
      case 'needs_revision': return { 
        label: 'Cần sửa', 
        style: { 
          background: 'rgba(59, 130, 246, 0.1)', 
          color: 'var(--info)', 
          borderColor: 'var(--info)' 
        }
      };
      case 'rejected': return { 
        label: 'Từ chối', 
        style: { 
          background: 'rgba(239, 68, 68, 0.1)', 
          color: 'var(--error)', 
          borderColor: 'var(--error)' 
        }
      };
      default: return { 
        label: status, 
        style: { 
          background: 'var(--bg-secondary)', 
          color: 'var(--text-secondary)', 
          borderColor: 'var(--border)' 
        }
      };
    }
  };

  return (
    <>
      <Card className="p-6">
        {/* Category Filter */}
        <div className="flex gap-2 mb-4 pb-4 border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => setCategoryFilter('all')}
            className="px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all"
            style={{
              background: categoryFilter === 'all' ? 'var(--primary)' : 'var(--bg-secondary)',
              color: categoryFilter === 'all' ? 'var(--text-inverse)' : 'var(--text-secondary)',
              boxShadow: categoryFilter === 'all' ? '0 4px 12px var(--shadow-medium)' : 'none',
            }}
          >
            🤖 Tất cả AI Plans ({plans.length})
          </button>
          <button
            onClick={() => setCategoryFilter('meal')}
            className="px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all"
            style={{
              background: categoryFilter === 'meal' ? 'var(--success)' : 'var(--bg-secondary)',
              color: categoryFilter === 'meal' ? 'var(--text-inverse)' : 'var(--text-secondary)',
              boxShadow: categoryFilter === 'meal' ? '0 4px 12px var(--shadow-medium)' : 'none',
            }}
          >
            🍽️ Plan ăn uống ({plans.filter(p => p.planCategory === 'meal').length})
          </button>
          <button
            onClick={() => setCategoryFilter('workout')}
            className="px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all"
            style={{
              background: categoryFilter === 'workout' ? 'var(--warning)' : 'var(--bg-secondary)',
              color: categoryFilter === 'workout' ? 'var(--text-inverse)' : 'var(--text-secondary)',
              boxShadow: categoryFilter === 'workout' ? '0 4px 12px var(--shadow-medium)' : 'none',
            }}
          >
            💪 Plan tập luyện ({plans.filter(p => p.planCategory === 'workout').length})
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setFilter('pending')}
            className="px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all"
            style={{
              background: filter === 'pending' ? 'var(--primary)' : 'var(--bg-secondary)',
              color: filter === 'pending' ? 'var(--text-inverse)' : 'var(--text-secondary)',
              boxShadow: filter === 'pending' ? '0 4px 6px var(--shadow-medium)' : 'none',
            }}
          >
            ⏳ Chờ duyệt ({plans.filter(p => p.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className="px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all"
            style={{
              background: filter === 'approved' ? 'var(--primary)' : 'var(--bg-secondary)',
              color: filter === 'approved' ? 'var(--text-inverse)' : 'var(--text-secondary)',
              boxShadow: filter === 'approved' ? '0 4px 6px var(--shadow-medium)' : 'none',
            }}
          >
            ✅ Đã duyệt ({plans.filter(p => p.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('needs_revision')}
            className="px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all"
            style={{
              background: filter === 'needs_revision' ? 'var(--primary)' : 'var(--bg-secondary)',
              color: filter === 'needs_revision' ? 'var(--text-inverse)' : 'var(--text-secondary)',
              boxShadow: filter === 'needs_revision' ? '0 4px 6px var(--shadow-medium)' : 'none',
            }}
          >
            ✏️ Cần sửa ({plans.filter(p => p.status === 'needs_revision').length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className="px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all"
            style={{
              background: filter === 'all' ? 'var(--primary)' : 'var(--bg-secondary)',
              color: filter === 'all' ? 'var(--text-inverse)' : 'var(--text-secondary)',
              boxShadow: filter === 'all' ? '0 4px 6px var(--shadow-medium)' : 'none',
            }}
          >
            📊 Tất cả ({plans.length})
          </button>
        </div>

        {/* Plans List */}
        <div className="space-y-4">
          {filteredPlans.map((plan) => {
            const planType = getPlanTypeLabel(plan.planType);
            const statusBadge = getStatusBadge(plan.status);

            return (
              <div
                key={plan.id}
                className="border rounded-lg p-6 hover:shadow-lg transition-all"
                style={{
                  background: 'linear-gradient(to right, var(--bg), var(--bg-secondary))',
                  borderColor: 'var(--border)',
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0"
                    style={{
                      background: 'linear-gradient(to bottom right, var(--primary), var(--primary-dark))',
                      color: 'var(--text-inverse)',
                    }}
                  >
                    {plan.userName.charAt(0)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>{plan.userName}</h3>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{plan.generatedAt}</p>
                      </div>
                      <div className="flex gap-2">
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={planType.style}
                        >
                          {planType.icon} {planType.label}
                        </span>
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-semibold border"
                          style={statusBadge.style}
                        >
                          {statusBadge.label}
                        </span>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div 
                        className="p-3 rounded-lg border"
                        style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
                      >
                        <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Thời gian</p>
                        <p className="font-semibold" style={{ color: 'var(--text)' }}>{plan.duration}</p>
                      </div>
                      
                      {plan.planCategory === 'meal' ? (
                        <>
                          <div 
                            className="p-3 rounded-lg border"
                            style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
                          >
                            <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Calories/ngày</p>
                            <p className="font-semibold" style={{ color: 'var(--info)' }}>{plan.totalCalories} kcal</p>
                          </div>
                          <div 
                            className="p-3 rounded-lg border"
                            style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
                          >
                            <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Bữa ăn/ngày</p>
                            <p className="font-semibold" style={{ color: 'var(--text)' }}>{plan.mealsPerDay} bữa</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div 
                            className="p-3 rounded-lg border"
                            style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
                          >
                            <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Buổi tập/tuần</p>
                            <p className="font-semibold" style={{ color: 'var(--warning)' }}>{plan.workoutsPerWeek} buổi</p>
                          </div>
                          <div 
                            className="p-3 rounded-lg border"
                            style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
                          >
                            <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Bài tập/buổi</p>
                            <p className="font-semibold" style={{ color: 'var(--text)' }}>{plan.sessionsPerWorkout} bài</p>
                          </div>
                        </>
                      )}
                      
                      <div 
                        className="p-3 rounded-lg border"
                        style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
                      >
                        <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Độ tin cậy AI</p>
                        <div className="flex items-center gap-2">
                          <div 
                            className="flex-1 rounded-full h-2"
                            style={{ background: 'var(--bg-secondary)' }}
                          >
                            <div
                              className="h-2 rounded-full"
                              style={{ 
                                width: `${plan.aiConfidence}%`,
                                background: plan.aiConfidence >= 90 ? 'var(--success)' :
                                           plan.aiConfidence >= 80 ? 'var(--warning)' : 'var(--error)'
                              }}
                            ></div>
                          </div>
                          <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{plan.aiConfidence}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Macros for Meal Plans */}
                    {plan.planCategory === 'meal' && plan.macros && (
                      <div className="flex gap-3 mb-4">
                        <div 
                          className="flex items-center gap-2 px-3 py-2 rounded-lg"
                          style={{ background: 'rgba(59, 130, 246, 0.1)' }}
                        >
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Protein:</span>
                          <span className="font-semibold" style={{ color: 'var(--info)' }}>{plan.macros.protein}g</span>
                        </div>
                        <div 
                          className="flex items-center gap-2 px-3 py-2 rounded-lg"
                          style={{ background: 'rgba(234, 179, 8, 0.1)' }}
                        >
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Carbs:</span>
                          <span className="font-semibold" style={{ color: 'var(--warning)' }}>{plan.macros.carbs}g</span>
                        </div>
                        <div 
                          className="flex items-center gap-2 px-3 py-2 rounded-lg"
                          style={{ background: 'rgba(249, 115, 22, 0.1)' }}
                        >
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Fat:</span>
                          <span className="font-semibold" style={{ color: 'var(--warning)' }}>{plan.macros.fat}g</span>
                        </div>
                      </div>
                    )}

                    {/* Preview Dishes for Meal Plans */}
                    {plan.planCategory === 'meal' && plan.sampleDishes && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>🍽️ Món ăn AI đã gen (mẫu):</p>
                        <div className="flex gap-2 flex-wrap">
                          {plan.sampleDishes.slice(0, 4).map((dish, idx) => (
                            <span 
                              key={idx} 
                              className="px-3 py-1 text-xs font-semibold rounded-full"
                              style={{ 
                                background: 'var(--success)',
                                color: 'var(--text-inverse)'
                              }}
                            >
                              {dish}
                            </span>
                          ))}
                          {plan.sampleDishes.length > 4 && (
                            <span 
                              className="px-3 py-1 text-xs font-semibold rounded-full"
                              style={{ 
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-secondary)'
                              }}
                            >
                              +{plan.sampleDishes.length - 4} món khác
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Preview Exercises for Workout Plans */}
                    {plan.planCategory === 'workout' && plan.sampleExercises && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>💪 Bài tập AI đã gen (mẫu):</p>
                        <div className="flex gap-2 flex-wrap">
                          {plan.sampleExercises.slice(0, 4).map((exercise, idx) => (
                            <span 
                              key={idx} 
                              className="px-3 py-1 text-xs font-semibold rounded-full"
                              style={{ 
                                background: 'var(--warning)',
                                color: 'var(--text-inverse)'
                              }}
                            >
                              {exercise}
                            </span>
                          ))}
                          {plan.sampleExercises.length > 4 && (
                            <span 
                              className="px-3 py-1 text-xs font-semibold rounded-full"
                              style={{ 
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-secondary)'
                              }}
                            >
                              +{plan.sampleExercises.length - 4} bài khác
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Focus Areas for Workout Plans */}
                    {plan.planCategory === 'workout' && plan.focusAreas && (
                      <div className="flex gap-2 mb-4 flex-wrap">
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>🎯 Focus:</span>
                        {plan.focusAreas.map((area, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-1 text-xs font-semibold rounded"
                            style={{ 
                              background: 'rgba(168, 85, 247, 0.1)',
                              color: 'var(--primary)'
                            }}
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Special Notes */}
                    {plan.specialNotes && (
                      <div 
                        className="border-l-4 p-3 mb-4"
                        style={{ 
                          background: 'rgba(168, 85, 247, 0.05)',
                          borderLeftColor: 'var(--primary)'
                        }}
                      >
                        <p className="text-sm" style={{ color: 'var(--text)' }}>
                          <span className="font-semibold">Ghi chú đặc biệt:</span> {plan.specialNotes}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        onClick={() => handleReview(plan)}
                      >
                        <Icon name="mdi:file-document-edit-outline" className="mr-2" />
                        {plan.status === 'pending' ? 'Duyệt ngay' : 'Xem chi tiết'}
                      </Button>
                      <Button variant="secondary">
                        <Icon name="mdi:account-outline" className="mr-2" />
                        Xem hồ sơ KH
                      </Button>
                      <Button variant="ghost">
                        <Icon name="mdi:message-outline" className="mr-2" />
                        Nhắn tin
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không có plan nào trong mục này
            </h3>
            <p className="text-gray-500">Bạn đã xem xét tất cả các plan AI</p>
          </div>
        )}
      </Card>

      {/* Review Modal */}
      {showModal && selectedPlan && (
        <PlanReviewModal
          plan={selectedPlan}
          onClose={() => {
            setShowModal(false);
            setSelectedPlan(null);
          }}
        />
      )}
    </>
  );
}
