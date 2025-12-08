import type { CustomerDetail as CustomerDetailModel, CustomerProfileResponse } from '@/types/advisordashboard';

export const normalizeCustomerProfile = (profileData: CustomerProfileResponse): CustomerDetailModel => {
  const profile = profileData?.profile || {};
  const bodyStats = profileData?.bodyStats || {};
  const goals = profileData?.goals || {};
  const measurementHistory = profileData?.measurementHistory || [];

  const now = new Date();
  const fallbackMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Normalize gender
  const normalizeGender = (gender?: string): 'male' | 'female' | 'other' => {
    if (!gender || gender === 'N/A') return 'other';
    const lower = gender.toLowerCase();
    if (lower.includes('male') || lower.includes('nam')) return 'male';
    if (lower.includes('female') || lower.includes('nữ')) return 'female';
    return 'other';
  };

  // Normalize measurements
  const normalizedMeasurements = measurementHistory.map(m => ({
    date: m?.date || '',
    weight: Number(m?.weight ?? 0),
    bodyFat: m?.bodyFatPercent,
    muscleMass: m?.muscleKg,
    boneMass: undefined, // API không có field này
  }));

  // Format joinDate
  const formatJoinDate = (dateStr?: string) => {
    if (!dateStr) return undefined;
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return dateStr;
    }
  };

  return {
    id: profileData?.userId || '',
    name: profile?.name || 'Chưa cập nhật',
    email: profile?.email || 'Không có email',
    phone: profile?.phone && profile.phone !== 'Chưa có thông tin' ? profile.phone : undefined,
    avatarUrl: undefined,
    month: fallbackMonth,
    goal: goals?.primary || 'Chưa cập nhật mục tiêu',
    plan: profile?.subscriptionType || 'Chưa có kế hoạch',
    status: 'on-track', // Default vì API profile không có field này
    engagement: 'medium', // Default vì API profile không có field này
    sessionsCompleted: 0, // API profile không có field này
    sessionsTarget: 0, // API profile không có field này
    progressPercent: 0, // API profile không có field này
    lastCheckIn: 'Chưa cập nhật', // API profile không có field này
    nextSession: 'Chưa sắp lịch', // API profile không có field này
    weightChange: bodyStats?.targetWeight ? `${bodyStats.targetWeight > 0 ? '+' : ''}${bodyStats.targetWeight}kg` : undefined,
    notes: goals?.notes || undefined,
    age: profile?.age,
    gender: normalizeGender(profile?.gender),
    joinedDate: formatJoinDate(profile?.joinDate),
    packageName: profile?.subscriptionType,
    height: bodyStats?.height,
    currentWeight: bodyStats?.currentWeight && bodyStats.currentWeight > 0 ? bodyStats.currentWeight : undefined,
    bmi: bodyStats?.currentWeight && bodyStats?.height 
      ? Number((bodyStats.currentWeight / Math.pow(bodyStats.height / 100, 2)).toFixed(1))
      : undefined,
    medicalHistory: profileData?.medicalHistory && profileData.medicalHistory !== 'Dữ liệu y tế không có sẵn'
      ? profileData.medicalHistory
      : undefined,
    remarks: goals?.notes || undefined,
    measurements: normalizedMeasurements.length > 0 ? normalizedMeasurements : undefined,
  };
};

