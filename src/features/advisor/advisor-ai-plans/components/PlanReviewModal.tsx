'use client';

import React from 'react';
import { Card, Button } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';

interface AIPlan {
  id: string;
  userId: string;
  userName: string;
  generatedAt: string;
  status: 'pending' | 'approved' | 'needs_revision' | 'rejected';
  planType: 'weight-loss' | 'muscle-gain' | 'maintenance';
  planCategory: 'meal' | 'workout';
  duration: string;
  totalCalories?: number;
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
  };
  mealsPerDay?: number;
  sampleDishes?: string[]; // Món ăn AI đã gen
  workoutsPerWeek?: number;
  sessionsPerWorkout?: number;
  focusAreas?: string[];
  sampleExercises?: string[]; // Bài tập AI đã gen
  aiConfidence: number;
  specialNotes?: string;
}

interface PlanReviewModalProps {
  plan: AIPlan;
  onClose: () => void;
}

export default function PlanReviewModal({ plan, onClose }: PlanReviewModalProps) {
  const [selectedDay, setSelectedDay] = React.useState(1);
  const [action, setAction] = React.useState<'approve' | 'revise' | 'reject' | null>(null);
  const [comments, setComments] = React.useState('');

  // Mock workout data - Bài tập AI đã gen với video có sẵn
  const workoutSchedule = [
    {
      day: 1,
      focus: 'Ngực - Vai',
      exercises: [
        { 
          name: 'Bench Press', 
          sets: 4, 
          reps: '8-10', 
          rest: '90s', 
          weight: '60kg',
          videoUrl: '/videos/exercises/bench-press.mp4',
          thumbnailUrl: '/public/img/exercises/bench-press-thumb.jpg',
          instruction: 'Nằm ngửa trên ghế, hạ tạ xuống ngực, đẩy lên hết cỡ'
        },
        { 
          name: 'Incline Dumbbell Press', 
          sets: 3, 
          reps: '10-12', 
          rest: '60s', 
          weight: '20kg',
          videoUrl: '/videos/exercises/incline-press.mp4',
          thumbnailUrl: '/public/img/exercises/incline-press-thumb.jpg',
          instruction: 'Ngồi ghế nghiêng 45°, đẩy tạ từ vai lên cao'
        },
        { 
          name: 'Cable Flyes', 
          sets: 3, 
          reps: '12-15', 
          rest: '45s', 
          weight: '15kg',
          videoUrl: '/videos/exercises/cable-flyes.mp4',
          thumbnailUrl: '/public/img/exercises/cable-flyes-thumb.jpg',
          instruction: 'Đứng giữa 2 cable, kéo 2 tay vào giữa theo cung tròn'
        },
        { 
          name: 'Shoulder Press', 
          sets: 4, 
          reps: '8-10', 
          rest: '90s', 
          weight: '40kg',
          videoUrl: '/videos/exercises/shoulder-press.mp4',
          thumbnailUrl: '/public/img/exercises/shoulder-press-thumb.jpg',
          instruction: 'Đẩy bar từ vai lên trên đầu, hạ xuống chạm vai'
        },
      ],
    },
    {
      day: 2,
      focus: 'Lưng - Tay sau',
      exercises: [
        { 
          name: 'Deadlift', 
          sets: 4, 
          reps: '6-8', 
          rest: '2m', 
          weight: '80kg',
          videoUrl: '/videos/exercises/deadlift.mp4',
          thumbnailUrl: '/public/img/exercises/deadlift-thumb.jpg',
          instruction: 'Nâng bar từ sàn lên bằng cách duỗi hông và đầu gối'
        },
        { 
          name: 'Pull-ups', 
          sets: 3, 
          reps: '8-10', 
          rest: '90s', 
          weight: 'BW',
          videoUrl: '/videos/exercises/pullups.mp4',
          thumbnailUrl: '/public/img/exercises/pullups-thumb.jpg',
          instruction: 'Kéo người lên xà, cằm vượt qua xà'
        },
        { 
          name: 'Barbell Rows', 
          sets: 4, 
          reps: '8-10', 
          rest: '90s', 
          weight: '50kg',
          videoUrl: '/videos/exercises/barbell-rows.mp4',
          thumbnailUrl: '/public/img/exercises/barbell-rows-thumb.jpg',
          instruction: 'Cúi người, kéo bar về phía bụng'
        },
        { 
          name: 'Tricep Dips', 
          sets: 3, 
          reps: '10-12', 
          rest: '60s', 
          weight: 'BW',
          videoUrl: '/videos/exercises/tricep-dips.mp4',
          thumbnailUrl: '/public/img/exercises/tricep-dips-thumb.jpg',
          instruction: 'Đẩy người lên xuống trên 2 xà song song'
        },
      ],
    },
    {
      day: 3,
      isRestDay: true,
    },
    {
      day: 4,
      focus: 'Chân - Mông',
      exercises: [
        { name: 'Squats', sets: 4, reps: '8-10', rest: '2m', weight: '80kg' },
        { name: 'Leg Press', sets: 3, reps: '10-12', rest: '90s', weight: '120kg' },
        { name: 'Romanian Deadlift', sets: 3, reps: '10-12', rest: '90s', weight: '60kg' },
        { name: 'Calf Raises', sets: 4, reps: '15-20', rest: '45s', weight: '60kg' },
      ],
    },
    {
      day: 5,
      focus: 'Tay trước - Bụng',
      exercises: [
        { name: 'Barbell Curls', sets: 4, reps: '8-10', rest: '60s', weight: '30kg' },
        { name: 'Hammer Curls', sets: 3, reps: '10-12', rest: '60s', weight: '15kg' },
        { name: 'Plank', sets: 3, reps: '60s', rest: '60s', weight: 'BW' },
        { name: 'Russian Twists', sets: 3, reps: '20', rest: '45s', weight: '10kg' },
      ],
    },
    {
      day: 6,
      focus: 'Full Body HIIT',
      exercises: [
        { name: 'Burpees', sets: 4, reps: '15', rest: '30s', weight: 'BW' },
        { name: 'Mountain Climbers', sets: 4, reps: '20', rest: '30s', weight: 'BW' },
        { name: 'Jump Squats', sets: 4, reps: '15', rest: '30s', weight: 'BW' },
        { name: 'Push-ups', sets: 4, reps: '15', rest: '30s', weight: 'BW' },
      ],
    },
    {
      day: 7,
      isRestDay: true,
    },
  ];

  // Mock meal data - Món ăn AI đã gen cho người dùng
  const sampleMeals = [
    {
      meal: 'Bữa sáng',
      time: '7:00 AM',
      dishName: '🍚 Cháo yến mạch chuối hạnh nhân',
      description: 'Món ăn sáng giàu chất xơ, cung cấp năng lượng bền vững',
      imageUrl: '/public/img/meals/oatmeal.jpg', // Ảnh reference món ăn
      items: [
        { name: 'Yến mạch', amount: '100g', calories: 250, protein: 12, carbs: 35, fat: 6 },
        { name: 'Chuối', amount: '1 trái', calories: 105, protein: 1, carbs: 27, fat: 0.4 },
        { name: 'Hạnh nhân rang', amount: '30g', calories: 160, protein: 6, carbs: 6, fat: 14 },
      ],
    },
    {
      meal: 'Bữa phụ sáng',
      time: '10:00 AM',
      dishName: '🥛 Sữa chua Hy Lạp việt quất',
      description: 'Bữa phụ nhẹ nhàng, giàu protein',
      imageUrl: '/public/img/meals/yogurt.jpg',
      items: [
        { name: 'Sữa chua Hy Lạp', amount: '150g', calories: 130, protein: 17, carbs: 9, fat: 3 },
        { name: 'Quả việt quất', amount: '50g', calories: 30, protein: 0.5, carbs: 8, fat: 0.2 },
      ],
    },
    {
      meal: 'Bữa trưa',
      time: '12:30 PM',
      dishName: '🍗 Cơm gạo lứt gà nướng rau củ',
      description: 'Bữa trưa cân bằng dinh dưỡng, đầy đủ chất',
      imageUrl: '/public/img/meals/chicken-rice.jpg',
      items: [
        { name: 'Cơm gạo lứt', amount: '150g', calories: 215, protein: 5, carbs: 45, fat: 2 },
        { name: 'Ức gà nướng mật ong', amount: '150g', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
        { name: 'Rau xanh luộc', amount: '200g', calories: 45, protein: 3, carbs: 9, fat: 0.5 },
        { name: 'Dầu olive', amount: '1 thìa', calories: 120, protein: 0, carbs: 0, fat: 14 },
      ],
    },
    {
      meal: 'Bữa phụ chiều',
      time: '3:30 PM',
      dishName: '🍎 Táo xanh bơ đậu phộng',
      description: 'Bữa phụ cung cấp năng lượng và chất béo tốt',
      imageUrl: '/public/img/meals/apple-pb.jpg',
      items: [
        { name: 'Táo xanh', amount: '1 trái', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
        { name: 'Bơ đậu phộng tự nhiên', amount: '2 thìa', calories: 190, protein: 8, carbs: 7, fat: 16 },
      ],
    },
    {
      meal: 'Bữa tối',
      time: '7:00 PM',
      dishName: '🐟 Cá hồi nướng bơ tỏi salad',
      description: 'Bữa tối giàu omega-3, nhẹ nhàng dễ tiêu',
      imageUrl: '/public/img/meals/salmon.jpg',
      items: [
        { name: 'Cơm gạo lứt', amount: '100g', calories: 143, protein: 3, carbs: 30, fat: 1.3 },
        { name: 'Cá hồi nướng bơ tỏi', amount: '180g', calories: 206, protein: 22, carbs: 0, fat: 13 },
        { name: 'Súp lơ xanh hấp', amount: '150g', calories: 55, protein: 4, carbs: 11, fat: 0.6 },
        { name: 'Salad rau trộn', amount: '100g', calories: 65, protein: 2, carbs: 13, fat: 1 },
      ],
    },
  ];

  const handleAction = (actionType: 'approve' | 'revise' | 'reject') => {
    setAction(actionType);
  };

  const handleSubmit = () => {
    // API call để submit action
    console.log('Action:', action, 'Comments:', comments);
    alert(`Plan đã được ${action === 'approve' ? 'duyệt' : action === 'revise' ? 'yêu cầu chỉnh sửa' : 'từ chối'}!`);
    onClose();
  };

  const quickComments = {
    approve: [
      '✅ Plan rất tốt, phù hợp với mục tiêu',
      '✅ Cân đối dinh dưỡng hợp lý',
      '✅ Đã kiểm tra kỹ, có thể áp dụng ngay',
    ],
    revise: [
      '📝 Cần tăng lượng protein thêm 20g/ngày',
      '📝 Giảm carbs buổi tối xuống',
      '📝 Thêm rau xanh vào bữa trưa',
      '📝 Điều chỉnh khẩu phần phù hợp hơn',
    ],
    reject: [
      '❌ Không phù hợp với tiền sử bệnh lý',
      '❌ Calories quá thấp, không an toàn',
      '❌ Thiếu nhóm dưỡng chất quan trọng',
    ],
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                🤖 Plan AI - {plan.userName}
              </h2>
              <div className="flex gap-3">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Tạo bởi AI: {plan.generatedAt}</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                  Độ tin cậy: {plan.aiConfidence}%
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
            >
              <Icon name="mdi:close" size={28} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Plan Details */}
            <div className="lg:col-span-2 space-y-4">
              {/* Summary Cards - Meal Plans */}
              {plan.planCategory === 'meal' && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
                    <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Calories/ngày</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--info)' }}>{plan.totalCalories}</p>
                  </div>
                  <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(34, 197, 94, 0.05)' }}>
                    <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Protein</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>{plan.macros?.protein}g</p>
                  </div>
                  <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(234, 179, 8, 0.05)' }}>
                    <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Carbs</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>{plan.macros?.carbs}g</p>
                  </div>
                </div>
              )}

              {/* Summary Cards - Workout Plans */}
              {plan.planCategory === 'workout' && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(249, 115, 22, 0.05)' }}>
                    <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Buổi tập/tuần</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>{plan.workoutsPerWeek}</p>
                  </div>
                  <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(239, 68, 68, 0.05)' }}>
                    <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Bài tập/buổi</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--error)' }}>{plan.sessionsPerWorkout}</p>
                  </div>
                  <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(168, 85, 247, 0.05)' }}>
                    <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Nhóm cơ</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--primary)' }}>{plan.focusAreas?.length || 0}</p>
                  </div>
                </div>
              )}

              {/* Day Selector */}
              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
                  {plan.planCategory === 'meal' ? 'Xem thực đơn theo ngày:' : 'Xem lịch tập theo ngày:'}
                </p>
                <div className="flex gap-2 overflow-x-auto">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className="px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all"
                      style={{
                        background: selectedDay === day ? 'var(--primary)' : 'var(--bg)',
                        color: selectedDay === day ? 'var(--text-inverse)' : 'var(--text-secondary)',
                        boxShadow: selectedDay === day ? '0 4px 6px var(--shadow-medium)' : 'none',
                      }}
                    >
                      Ngày {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meals for Selected Day - Món ăn AI đã gen */}
              {plan.planCategory === 'meal' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: 'var(--text)' }}>
                    <div style={{ color: 'var(--success)' }}>
                      <Icon name="mdi:food-apple" />
                    </div>
                    Thực đơn AI đã gen - Ngày {selectedDay}
                  </h3>
                  {sampleMeals.map((meal, idx) => (
                    <Card 
                      key={idx} 
                      className="p-4 border-2"
                      style={{
                        background: 'linear-gradient(to right, var(--bg), rgba(34, 197, 94, 0.05))',
                        borderColor: 'var(--success)',
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-lg" style={{ color: 'var(--text)' }}>{meal.dishName}</h4>
                            <span 
                              className="px-2 py-1 text-xs rounded-full"
                              style={{ background: 'var(--success)', color: 'var(--text-inverse)' }}
                            >
                              AI Gen
                            </span>
                          </div>
                          <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>⏰ {meal.meal} - {meal.time}</p>
                          <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>{meal.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Tổng calo</p>
                          <p className="font-bold text-xl" style={{ color: 'var(--success)' }}>
                            {meal.items.reduce((sum, item) => sum + item.calories, 0)} kcal
                          </p>
                        </div>
                      </div>
                      
                      {/* Dish Image Preview */}
                      <div className="rounded-lg p-2 mb-3 text-center" style={{ background: 'var(--bg-secondary)' }}>
                        <div 
                          className="w-full h-32 rounded flex items-center justify-center"
                          style={{ background: 'linear-gradient(to bottom right, var(--bg-secondary), var(--bg-tertiary))' }}
                        >
                          <div style={{ color: 'var(--text-tertiary)' }}>
                            <Icon name="mdi:image" size={48} />
                          </div>
                          <span className="ml-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Ảnh món ăn tham khảo</span>
                        </div>
                      </div>

                      {/* Ingredients */}
                      <div className="rounded-lg p-3 border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                        <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>🥗 Thành phần món ăn:</p>
                        <div className="space-y-2">
                          {meal.items.map((item, itemIdx) => (
                            <div 
                              key={itemIdx} 
                              className="flex justify-between items-center p-2 rounded"
                              style={{ background: 'var(--bg-secondary)' }}
                            >
                              <div className="flex-1">
                                <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>{item.name}</span>
                                <span className="text-xs ml-2" style={{ color: 'var(--text-secondary)' }}>({item.amount})</span>
                              </div>
                              <div className="flex gap-3 text-xs">
                                <span style={{ color: 'var(--info)' }}>P: {item.protein}g</span>
                                <span style={{ color: 'var(--warning)' }}>C: {item.carbs}g</span>
                                <span style={{ color: 'var(--warning)' }}>F: {item.fat}g</span>
                                <span className="font-semibold" style={{ color: 'var(--text)' }}>{item.calories} kcal</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Workouts for Selected Day */}
              {plan.planCategory === 'workout' && (() => {
                const dayWorkout = workoutSchedule.find(w => w.day === selectedDay);
                if (!dayWorkout) return null;

                if ('isRestDay' in dayWorkout && dayWorkout.isRestDay) {
                  return (
                    <div className="text-center py-12 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                      <div className="text-6xl mb-4">😴</div>
                      <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>Ngày nghỉ</h3>
                      <p style={{ color: 'var(--text-secondary)' }}>Cơ thể cần thời gian phục hồi</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: 'var(--text)' }}>
                        <div style={{ color: 'var(--warning)' }}>
                          <Icon name="mdi:weight-lifter" />
                        </div>
                        Bài tập AI đã gen - Ngày {selectedDay}
                      </h3>
                      {'focus' in dayWorkout && (
                        <span 
                          className="px-4 py-2 rounded-full font-semibold"
                          style={{
                            background: 'var(--warning)',
                            color: 'var(--text-inverse)',
                          }}
                        >
                          🎯 {dayWorkout.focus}
                        </span>
                      )}
                    </div>
                    {'exercises' in dayWorkout && dayWorkout.exercises?.map((exercise, idx) => (
                      <Card key={idx} className="p-4 bg-gradient-to-r from-white to-orange-50 border-2 border-orange-200">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-lg">{exercise.name}</h4>
                              <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">AI Gen</span>
                            </div>
                            {'instruction' in exercise && (
                              <p className="text-sm text-gray-600 mb-2">� {exercise.instruction}</p>
                            )}
                          </div>
                        </div>

                        {/* Video Preview */}
                        {'videoUrl' in exercise && (
                          <div className="bg-gray-900 rounded-lg mb-3 overflow-hidden">
                            <div className="relative w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
                              <Icon name="mdi:play-circle" size={64} className="text-white opacity-80 mb-2" />
                              <p className="text-white text-sm font-semibold">Video hướng dẫn bài tập</p>
                              <p className="text-gray-400 text-xs mt-1">Click để xem video</p>
                            </div>
                          </div>
                        )}

                        {/* Exercise Stats */}
                        <div className="grid grid-cols-4 gap-2 mb-2">
                          <div className="bg-white p-3 rounded-lg border-2 border-orange-200 text-center">
                            <p className="text-xs text-gray-500 mb-1">Sets</p>
                            <p className="font-bold text-orange-600">{exercise.sets}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border-2 border-red-200 text-center">
                            <p className="text-xs text-gray-500 mb-1">Reps</p>
                            <p className="font-bold text-red-600">{exercise.reps}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border-2 border-purple-200 text-center">
                            <p className="text-xs text-gray-500 mb-1">Rest</p>
                            <p className="font-bold text-purple-600">{exercise.rest}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border-2 border-blue-200 text-center">
                            <p className="text-xs text-gray-500 mb-1">Tải</p>
                            <p className="font-bold text-blue-600">{exercise.weight}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Right: Review Panel */}
            <div className="space-y-4">
              {/* Action Buttons */}
              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <p className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Quyết định của bạn:</p>
                <div className="space-y-2">
                  <button
                    onClick={() => handleAction('approve')}
                    className="w-full px-4 py-3 rounded-lg font-medium transition-all border"
                    style={{
                      background: action === 'approve' ? 'var(--success)' : 'var(--bg)',
                      color: action === 'approve' ? 'var(--text-inverse)' : 'var(--text)',
                      borderColor: action === 'approve' ? 'transparent' : 'var(--border)',
                      boxShadow: action === 'approve' ? '0 8px 16px var(--shadow-dark)' : 'none',
                    }}
                  >
                    ✅ Duyệt plan
                  </button>
                  <button
                    onClick={() => handleAction('revise')}
                    className="w-full px-4 py-3 rounded-lg font-medium transition-all border"
                    style={{
                      background: action === 'revise' ? 'var(--info)' : 'var(--bg)',
                      color: action === 'revise' ? 'var(--text-inverse)' : 'var(--text)',
                      borderColor: action === 'revise' ? 'transparent' : 'var(--border)',
                      boxShadow: action === 'revise' ? '0 8px 16px var(--shadow-dark)' : 'none',
                    }}
                  >
                    ✏️ Yêu cầu chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleAction('reject')}
                    className="w-full px-4 py-3 rounded-lg font-medium transition-all border"
                    style={{
                      background: action === 'reject' ? 'var(--error)' : 'var(--bg)',
                      color: action === 'reject' ? 'var(--text-inverse)' : 'var(--text)',
                      borderColor: action === 'reject' ? 'transparent' : 'var(--border)',
                      boxShadow: action === 'reject' ? '0 8px 16px var(--shadow-dark)' : 'none',
                    }}
                  >
                    ❌ Từ chối plan
                  </button>
                </div>
              </div>

              {/* Quick Comments */}
              {action && (
                <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <p className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Nhận xét nhanh:</p>
                  <div className="space-y-2">
                    {quickComments[action].map((comment, idx) => (
                      <button
                        key={idx}
                        onClick={() => setComments(comment)}
                        className="w-full text-left px-3 py-2 rounded border transition-colors text-sm"
                        style={{
                          background: 'var(--bg)',
                          color: 'var(--text)',
                          borderColor: 'var(--border)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--primary)';
                          e.currentTarget.style.color = 'var(--text-inverse)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'var(--bg)';
                          e.currentTarget.style.color = 'var(--text)';
                        }}
                      >
                        {comment}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments */}
              <div>
                <label className="block font-semibold mb-2" style={{ color: 'var(--text)' }}>Nhận xét chi tiết:</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Nhập nhận xét của bạn về plan này..."
                  className="w-full h-32 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                />
              </div>

              {/* Special Notes */}
              {plan.specialNotes && (
                <div 
                  className="border-l-4 p-3"
                  style={{
                    background: 'rgba(168, 85, 247, 0.05)',
                    borderLeftColor: 'var(--primary)',
                  }}
                >
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>Ghi chú đặc biệt:</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{plan.specialNotes}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!action || !comments}
                className="w-full"
              >
                Gửi quyết định
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
