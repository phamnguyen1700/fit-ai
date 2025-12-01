'use client';

import React from 'react';
import { Card } from '@/shared/ui';

interface WorkoutScheduleProps {
  clientId: string;
}

export default function WorkoutSchedule({ clientId }: WorkoutScheduleProps) {
  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
  const [selectedDay, setSelectedDay] = React.useState(0);

  const weekSchedule = [
    {
      day: 'Thứ 2',
      focus: 'Ngực & Vai',
      exercises: [
        { name: 'Bench Press', sets: 4, reps: '8-12', rest: '90s', notes: 'Tập trung vào form đúng' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '60s', notes: '' },
        { name: 'Cable Fly', sets: 3, reps: '12-15', rest: '60s', notes: 'Nén đỉnh 2 giây' },
        { name: 'Shoulder Press', sets: 4, reps: '8-12', rest: '90s', notes: '' },
        { name: 'Lateral Raises', sets: 3, reps: '12-15', rest: '45s', notes: 'Kiểm soát chuyển động' },
      ],
    },
    {
      day: 'Thứ 3',
      focus: 'Lưng & Bắp tay sau',
      exercises: [
        { name: 'Deadlift', sets: 4, reps: '6-8', rest: '2-3 phút', notes: 'Khởi động kỹ' },
        { name: 'Pull-ups', sets: 4, reps: 'Max', rest: '90s', notes: 'Có thể dùng hỗ trợ' },
        { name: 'Barbell Row', sets: 4, reps: '8-10', rest: '90s', notes: '' },
        { name: 'Lat Pulldown', sets: 3, reps: '10-12', rest: '60s', notes: '' },
        { name: 'Triceps Pushdown', sets: 3, reps: '12-15', rest: '45s', notes: '' },
      ],
    },
    {
      day: 'Thứ 4',
      focus: 'Nghỉ ngơi/Cardio nhẹ',
      exercises: [
        { name: 'Đi bộ nhanh', sets: 1, reps: '30 phút', rest: '', notes: 'Tốc độ vừa phải' },
        { name: 'Giãn cơ', sets: 1, reps: '15 phút', rest: '', notes: 'Tập trung vào nhóm cơ đã tập' },
      ],
    },
    {
      day: 'Thứ 5',
      focus: 'Chân',
      exercises: [
        { name: 'Squat', sets: 4, reps: '8-12', rest: '2-3 phút', notes: 'Xuống sâu' },
        { name: 'Leg Press', sets: 4, reps: '10-12', rest: '90s', notes: '' },
        { name: 'Lunges', sets: 3, reps: '10/chân', rest: '60s', notes: 'Giữ thăng bằng' },
        { name: 'Leg Curl', sets: 3, reps: '12-15', rest: '60s', notes: '' },
        { name: 'Calf Raises', sets: 4, reps: '15-20', rest: '45s', notes: 'Kéo giãn đỉnh' },
      ],
    },
    {
      day: 'Thứ 6',
      focus: 'Tay & Bụng',
      exercises: [
        { name: 'Barbell Curl', sets: 4, reps: '8-12', rest: '60s', notes: 'Không swing' },
        { name: 'Hammer Curl', sets: 3, reps: '10-12', rest: '60s', notes: '' },
        { name: 'Concentration Curl', sets: 3, reps: '12-15', rest: '45s', notes: '' },
        { name: 'Plank', sets: 3, reps: '60s', rest: '60s', notes: 'Giữ thẳng lưng' },
        { name: 'Russian Twist', sets: 3, reps: '20/bên', rest: '45s', notes: '' },
      ],
    },
    {
      day: 'Thứ 7',
      focus: 'Cardio & HIIT',
      exercises: [
        { name: 'Chạy bộ', sets: 1, reps: '20 phút', rest: '', notes: 'Tốc độ ổn định' },
        { name: 'Burpees', sets: 3, reps: '10-15', rest: '60s', notes: '' },
        { name: 'Mountain Climbers', sets: 3, reps: '30s', rest: '60s', notes: '' },
        { name: 'Jump Rope', sets: 3, reps: '2 phút', rest: '60s', notes: '' },
      ],
    },
    {
      day: 'Chủ nhật',
      focus: 'Nghỉ ngơi hoàn toàn',
      exercises: [
        { name: 'Nghỉ ngơi', sets: 1, reps: '', rest: '', notes: 'Phục hồi cơ bắp' },
        { name: 'Giãn cơ nhẹ', sets: 1, reps: '10 phút', rest: '', notes: 'Thư giãn' },
      ],
    },
  ];

  const selectedWorkout = weekSchedule[selectedDay];

  return (
    <div className="space-y-4">
      {/* Day Selector */}
      <Card className="p-4">
        <div className="flex gap-2 overflow-x-auto">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(index)}
              className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedDay === index
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </Card>

      {/* Workout Focus */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
            💪
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">{selectedWorkout.focus}</h2>
            <p className="text-gray-600">{selectedWorkout.day}</p>
          </div>
        </div>
      </Card>

      {/* Exercises */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Bài tập ({selectedWorkout.exercises.length})</h3>
        <div className="space-y-4">
          {selectedWorkout.exercises.map((exercise, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{exercise.name}</h4>
                    {exercise.notes && (
                      <p className="text-sm text-gray-500 mt-1">💡 {exercise.notes}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pl-13">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Sets</p>
                  <p className="text-lg font-bold text-blue-600">{exercise.sets}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Reps</p>
                  <p className="text-lg font-bold text-green-600">{exercise.reps}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Nghỉ</p>
                  <p className="text-lg font-bold text-purple-600">{exercise.rest || '-'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Workout Summary */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
        <h3 className="font-semibold mb-3">Tổng kết buổi tập</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Tổng bài tập</p>
            <p className="text-2xl font-bold text-primary">{selectedWorkout.exercises.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tổng Sets</p>
            <p className="text-2xl font-bold text-primary">
              {selectedWorkout.exercises.reduce((sum, ex) => sum + ex.sets, 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Thời gian dự kiến</p>
            <p className="text-2xl font-bold text-primary">60-90 phút</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
