'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/shared/ui/core/Card';
import { Flex } from '@/shared/ui/core/Flex';
import { Icon } from '@/shared/ui/icon';
import { CardTable } from '@/shared/ui/core/CardTable';
import { FeedbackFilter } from './components/FeedbackFilter';
import { FeedbackCard } from './components/FeedbackCard';
import ReviewModal from './components/ReviewModal';
import {
	usePendingWorkoutReviews,
	usePendingMealReviews,
	useReviewedMeals,
	useReviewedWorkouts,
} from '@/tanstack/hooks/advisorreview';
import type {
	WorkoutReview,
	MealReview,
	MealReviewedItem,
	WorkoutReviewedItem,
} from '@/types/advisorreview';

// UI-specific types
type FeedbackCategory = 'training' | 'nutrition';

interface FeedbackReviewPayload {
	advisorNotes: string;
	status: 'reviewed';
	rating: number;
	quickRemarks: string[];
}

const SummaryTile: React.FC<{ icon: string; label: string; value: React.ReactNode; helper?: React.ReactNode; accent?: string; iconColor?: string }> = ({ icon, label, value, helper, accent, iconColor }) => (
	<div className="flex flex-1 min-w-[160px] items-center gap-3 rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm">
		<div className="flex h-10 w-10 items-center justify-center rounded-md" style={{ background: accent ?? 'rgba(56, 189, 248, 0.12)' }}>
			<Icon name={icon} size={20} color={iconColor ?? 'var(--primary)'} />
		</div>
		<div className="flex flex-col">
			<span className="text-sm text-[var(--text-secondary)]">{label}</span>
			<span className="text-lg font-semibold text-[var(--text)]">{value}</span>
			{helper && <span className="text-xs text-[var(--text-secondary)]">{helper}</span>}
		</div>
	</div>
);

type CategoryFilter = 'all' | FeedbackCategory;

const CATEGORY_TABS: { value: CategoryFilter; label: string; icon: string }[] = [
	{ value: 'all', label: 'Tất cả', icon: 'mdi:playlist-check' },
	{ value: 'training', label: 'Tập luyện', icon: 'mdi:dumbbell' },
	{ value: 'nutrition', label: 'Ăn uống', icon: 'mdi:food-apple' },
];

export const AdvisorFeedbackRequests: React.FC = () => {
	// 1. Lấy danh sách submission chưa đánh giá (pending)
	const { data: workoutApiData, isLoading: isLoadingWorkouts, error: workoutError } = usePendingWorkoutReviews();
	const { data: mealApiData, isLoading: isLoadingMeals, error: mealError } = usePendingMealReviews();
	// 2. Lấy danh sách đã đánh giá để hiển thị trong tab "Đã đánh giá/Đã duyệt"
	const {
		data: reviewedWorkoutData,
		isLoading: isLoadingReviewedWorkouts,
		error: reviewedWorkoutError,
	} = useReviewedWorkouts();
	const {
		data: reviewedMealData,
		isLoading: isLoadingReviewedMeals,
		error: reviewedMealError,
	} = useReviewedMeals();
	const [selectedStatus, setSelectedStatus] = useState<string>('all');
	const [selectedMedia, setSelectedMedia] = useState<string>('all');
	const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
	const [selectedSubmission, setSelectedSubmission] = useState<WorkoutReview | MealReview | null>(null);
	const [isReviewModalOpen, setReviewModalOpen] = useState(false);

	// Trong giao diện, loading/error được gộp để tránh hiển thị từng block riêng
	const isLoading =
		isLoadingWorkouts || isLoadingMeals || isLoadingReviewedWorkouts || isLoadingReviewedMeals;
	const error = workoutError || mealError || reviewedMealError || reviewedWorkoutError;

	// Get workout reviews from API
	const workoutReviews = useMemo(() => {
		let reviews: WorkoutReview[] = [];

		if (Array.isArray(workoutApiData?.data)) {
			reviews = workoutApiData.data;
		} else if (Array.isArray(workoutApiData?.data?.data)) {
			reviews = workoutApiData.data.data;
		}

		console.log('✅ [Feedback] Workout reviews:', reviews);
		return reviews;
	}, [workoutApiData]);

	// Get meal reviews from API
	const mealReviews = useMemo(() => {
		let reviews: MealReview[] = [];

		if (Array.isArray(mealApiData?.data)) {
			reviews = mealApiData.data;
		} else if (Array.isArray(mealApiData?.data?.data)) {
			reviews = mealApiData.data.data;
		}

		console.log('✅ [Feedback] Meal reviews:', reviews);
		return reviews;
	}, [mealApiData]);

	// Reviewed lists
	const reviewedWorkouts = useMemo(() => {
		let items: WorkoutReviewedItem[] = [];
		if (Array.isArray(reviewedWorkoutData?.data)) {
			items = reviewedWorkoutData.data;
		}
		return items;
	}, [reviewedWorkoutData]);

	const reviewedMeals = useMemo(() => {
		let items: MealReviewedItem[] = [];
		if (Array.isArray(reviewedMealData?.data)) {
			items = reviewedMealData.data;
		}
		return items;
	}, [reviewedMealData]);

	// Compute summary from both workout and meal reviews
	// Summary sử dụng cho các tile phía trên
	const summary = useMemo(() => {
		const total =
			workoutReviews.length + mealReviews.length + reviewedWorkouts.length + reviewedMeals.length;
		const pending =
			workoutReviews.filter((r) => !r.hasComments).length +
			mealReviews.filter((r) => !r.hasComments).length;
		const reviewed =
			workoutReviews.filter((r) => r.hasComments && r.lastCommentFrom === 'advisor').length +
			mealReviews.filter((r) => r.hasComments && r.lastCommentFrom === 'advisor').length +
			reviewedWorkouts.length +
			reviewedMeals.length;
		const videos = workoutReviews.length; // Only workouts are videos
		const images = mealReviews.length; // Meals are images

		return {
			total,
			pending,
			reviewed,
			videos,
			images,
		};
	}, [workoutReviews, mealReviews, reviewedWorkouts, reviewedMeals]);

	// Filter and combine reviews
	// Tạo danh sách hiển thị theo filter hiện tại (pending/reviewed, media, category)
	const filteredItems = useMemo(() => {
		const showPending = ['all', 'pending'].includes(selectedStatus);
		const showReviewed = ['all', 'reviewed'].includes(selectedStatus);

		const filteredWorkouts = showPending
			? workoutReviews.filter((review) => {
				// Status filter
				if (selectedStatus !== 'all') {
					if (selectedStatus === 'pending' && review.hasComments) return false;
					if (selectedStatus === 'reviewed' && !review.hasComments) return false;
				}
				// Media filter - all are videos, so only show if 'all' or 'video'
				if (selectedMedia !== 'all' && selectedMedia !== 'video') return false;
				// Category filter - all are training
				if (activeCategory !== 'all' && activeCategory !== 'training') return false;
				return true;
			})
			: [];

		const filteredReviewedWorkouts = showReviewed
			? reviewedWorkouts.filter(() => {
				if (selectedMedia !== 'all' && selectedMedia !== 'video') return false;
				if (activeCategory !== 'all' && activeCategory !== 'training') return false;
				return true;
			})
			: [];

		const filteredMeals = showPending
			? mealReviews.filter((review) => {
				// Status filter
				if (selectedStatus !== 'all') {
					if (selectedStatus === 'pending' && review.hasComments) return false;
					if (selectedStatus === 'reviewed' && !review.hasComments) return false;
				}
				// Media filter - all are images, so only show if 'all' or 'image'
				if (selectedMedia !== 'all' && selectedMedia !== 'image') return false;
				// Category filter - all are nutrition
				if (activeCategory !== 'all' && activeCategory !== 'nutrition') return false;
				return true;
			})
			: [];

		const filteredReviewedMeals = showReviewed
			? reviewedMeals.filter(() => {
				if (selectedMedia !== 'all' && selectedMedia !== 'image') return false;
				if (activeCategory !== 'all' && activeCategory !== 'nutrition') return false;
				return true;
			})
			: [];

		// Combine and sort by createdAt (newest first)
		const combined = [
			...filteredWorkouts.map(w => ({ type: 'workout' as const, review: w })),
			...filteredMeals.map(m => ({ type: 'meal' as const, review: m })),
			...filteredReviewedWorkouts.map(w => ({ type: 'workout-reviewed' as const, review: w })),
			...filteredReviewedMeals.map(m => ({ type: 'meal-reviewed' as const, review: m })),
		].sort((a, b) => {
			const dateA = new Date(a.review.createdAt).getTime();
			const dateB = new Date(b.review.createdAt).getTime();
			return dateB - dateA; // Newest first
		});

		return combined;
	}, [workoutReviews, mealReviews, reviewedWorkouts, reviewedMeals, selectedStatus, selectedMedia, activeCategory]);

	// Khi người dùng bấm action trên thẻ
	const handleAction = (action: string, submission: WorkoutReview | MealReview) => {
		if (action === 'review') {
			setSelectedSubmission(submission);
			setReviewModalOpen(true);
			return;
		}
		if (action === 'view-feedback') {
			setSelectedSubmission(submission);
			setReviewModalOpen(true);
			return;
		}
		const id = 'workoutLogId' in submission ? submission.workoutLogId : submission.mealLogId;
		console.log('Advisor feedback action', action, id);
	};

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<Flex wrap="wrap" gap={16} className="md:flex-nowrap">
					<SummaryTile
						icon="mdi:inbox-arrow-down"
						label="Tổng cần đánh giá"
						value={summary.total}
						helper={`${summary.pending} đang chờ`}
					/>
					<SummaryTile
						icon="mdi:clock-outline"
						label="Chờ đánh giá"
						value={summary.pending}
						accent="rgba(250,140,22,0.12)"
						iconColor="#fa8c16"
					/>
					<SummaryTile
						icon="mdi:check-circle-outline"
						label="Đã đánh giá"
						value={summary.reviewed}
						accent="rgba(34,197,94,0.12)"
						iconColor="#22c55e"
					/>
					<SummaryTile
						icon="mdi:video-outline"
						label="Video"
						value={summary.videos}
						helper={`${summary.images} hình ảnh`}
						accent="rgba(56,189,248,0.12)"
					/>
				</Flex>
			</Card>

			<Card title={<span className="text-base font-semibold text-[var(--text)]">Danh sách cần đánh giá</span>}>
				<div className="flex flex-col gap-4">
					<div className="flex flex-wrap items-center gap-2">
						{CATEGORY_TABS.map((tab) => {
							const isActive = activeCategory === tab.value;
							return (
								<button
									key={tab.value}
									type="button"
									onClick={() => setActiveCategory(tab.value)}
									className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${isActive
											? 'bg-[var(--primary)] text-white border-[var(--primary)]'
											: 'bg-[var(--bg)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--primary)]/40'
										}`}
								>
									<Icon name={tab.icon} size={16} className={isActive ? 'text-white' : 'text-[var(--primary)]'} />
									<span>{tab.label}</span>
								</button>
							);
						})}

						<div className="flex-1 min-w-[220px]">
							<FeedbackFilter
								selectedStatus={selectedStatus}
								onStatusChange={setSelectedStatus}
								selectedMedia={selectedMedia}
								onMediaChange={setSelectedMedia}
								layout="inline"
							/>
						</div>
					</div>

					{isLoading && (
						<div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-tertiary)]/40 p-6 text-center text-sm text-[var(--text-secondary)]">
							Đang tải danh sách cần đánh giá...
						</div>
					)}

					{!isLoading && error && (
						<div className="rounded-lg border border-dashed border-red-200 bg-red-50/60 p-6 text-center text-sm text-red-600">
							Không thể tải danh sách cần đánh giá. Vui lòng thử lại sau.
						</div>
					)}

					{!isLoading && !error && filteredItems.length === 0 && (
						<div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-tertiary)]/60 p-6 text-center text-sm text-[var(--text-secondary)]">
							Không có phản hồi nào cần đánh giá.
						</div>
					)}

					{!isLoading && !error && filteredItems.length > 0 && (
						<CardTable
							items={filteredItems}
							pageSize={4}
							renderItem={(item) => (
								item.type === 'workout' ? (
									<FeedbackCard
										key={item.review.workoutLogId}
										workoutReview={item.review}
										onAction={(action) => handleAction(action, item.review)}
									/>
								) : item.type === 'meal' ? (
									<FeedbackCard
										key={item.review.mealLogId}
										mealReview={item.review}
										onAction={(action) => handleAction(action, item.review)}
									/>
								) : item.type === 'workout-reviewed' ? (
									<FeedbackCard
										key={item.review.workoutLogId}
										reviewedWorkout={item.review}
										onAction={(action) =>
											handleAction(
												action,
												{
													...item.review,
													hasComments: true,
													lastCommentFrom: 'advisor',
												} as WorkoutReview
											)
										}
									/>
								) : (
									<FeedbackCard
										key={item.review.mealLogId}
										reviewedMeal={item.review}
										onAction={(action) =>
											handleAction(
												action,
												{
													...item.review,
													hasComments: true,
													lastCommentFrom: 'advisor',
												} as MealReview
											)
										}
									/>
								)
							)}
						/>
					)}
				</div>
			</Card>

			<ReviewModal
				submission={selectedSubmission}
				isOpen={isReviewModalOpen}
				onClose={() => setReviewModalOpen(false)}
				onSubmit={(payload: FeedbackReviewPayload) => {
					const id = selectedSubmission
						? ('workoutLogId' in selectedSubmission ? selectedSubmission.workoutLogId : selectedSubmission.mealLogId)
						: null;
					console.log('Submit review', id, payload);
					setReviewModalOpen(false);
				}}
			/>
		</div>
	);
};

export default AdvisorFeedbackRequests;
