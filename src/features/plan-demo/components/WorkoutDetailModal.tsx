import React, { useState } from 'react';
import { Modal, Card, Flex } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import type { WorkoutDemoDay, WorkoutDemoExercise } from '@/types/workoutdemo';

interface WorkoutDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  workouts: WorkoutDemoDay[];
}

const TABLE_HEADERS = ['Buổi tập', 'Nhóm cơ / Loại bài tập', 'Bài tập', 'Sets', 'Reps', 'Thời gian'];
const COL_WIDTHS = [150, undefined, undefined, 80, 80, 100];

export const WorkoutDetailModal: React.FC<WorkoutDetailModalProps> = ({
  isOpen,
  onClose,
  planName,
  workouts,
}) => {
  const [expandedDays, setExpandedDays] = useState<number[]>([]);

  const toggleDay = (day: number) => 
    setExpandedDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);

  const DayHeader = ({ day, dayName, total, isExpanded, onClick }: any) => (
    <div onClick={onClick} style={{
      padding: '16px 20px',
      cursor: 'pointer',
      backgroundColor: isExpanded ? 'var(--primay-extralight)' : 'var(--bg)',
      borderRadius: isExpanded ? '8px 8px 0 0' : '8px',
      transition: 'all 0.2s ease',
    }}>
      <Flex justify="space-between" align="center">
        <Flex gap={10} align="center">
          <Icon name="mdi:calendar" size={20} color="var(--primary)" />
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
            Ngày {day}{dayName ? ` - ${dayName}` : ''}
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            • {total} bài tập
          </span>
        </Flex>
        <Icon name={isExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'} size={20} color="var(--text-secondary)" />
      </Flex>
    </div>
  );

  const DayContent = ({ exercises }: { exercises: WorkoutDemoExercise[] }) => (
    <div style={{ padding: '16px 20px 20px' }}>
      <div style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
              {TABLE_HEADERS.map((header, i) => (
                <th key={i} style={{
                  padding: '12px',
                  textAlign: i > 2 ? 'center' : 'left',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  width: COL_WIDTHS[i],
                  borderBottom: '2px solid var(--border)',
                }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exercises.map((ex, i) => (
              <tr key={`${ex.name ?? 'exercise'}-${i}`} style={{
                borderBottom: i === exercises.length - 1 ? 'none' : '1px solid var(--border)',
              }}>
                <td style={{ padding: '12px', fontWeight: 500, color: 'var(--primary)' }}>
                  {ex.name || 'Buổi tập'}
                </td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                  {ex.category?.name || 'Nhóm cơ'}
                </td>
                <td style={{ padding: '12px', color: 'var(--text)' }}>
                  {ex.description || 'Bài tập'}
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text)' }}>
                  {ex.sets ?? '-'}
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text)' }}>
                  {ex.reps ?? '-'}
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text)' }}>
                  {ex.minutes ? `${ex.minutes}p` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <Modal title={planName} isOpen={isOpen} onClose={onClose} size="xl">
      <div style={{ padding: '4px 0' }}>
        {workouts.map((day) => {
          const isExpanded = expandedDays.includes(day.day);
          
          return (
            <Card key={day.day} style={{
              marginBottom: 12,
              border: '1px solid var(--border)',
              borderRadius: 8,
            }} styles={{ body: { padding: 0 } }}>
              <DayHeader 
                day={day.day}
                dayName={day.dayName}
                total={day.exercises.length}
                isExpanded={isExpanded}
                onClick={() => toggleDay(day.day)}
              />
              {isExpanded && (
                <DayContent exercises={day.exercises} />
              )}
            </Card>
          );
        })}
      </div>
    </Modal>
  );
};

export default WorkoutDetailModal;
