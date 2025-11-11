'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/shared/ui/core/Card';
import { Flex } from '@/shared/ui/core/Flex';
import { Icon } from '@/shared/ui/icon';
import { CardTable } from '@/shared/ui/core/CardTable';
import { FeedbackFilter } from './components/FeedbackFilter';
import { FeedbackCard } from './components/FeedbackCard';
import { FEEDBACK_SUBMISSIONS } from './data';
import type { FeedbackSubmission, FeedbackStatus, FeedbackReviewPayload } from './types';
import ReviewModal from './components/ReviewModal';

const computeSummary = (submissions: FeedbackSubmission[]) => {
	const total = submissions.length;
	const pending = submissions.filter((item) => item.status === 'pending').length;
	const rework = submissions.filter((item) => item.status === 'rework').length;
	const reviewed = submissions.filter((item) => item.status === 'reviewed').length;
	const videos = submissions.filter((item) => item.mediaType === 'video').length;

	return {
		total,
		pending,
		rework,
		reviewed,
		videos,
	};
};

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

export const AdvisorFeedbackRequests: React.FC = () => {
	const [submissions] = useState<FeedbackSubmission[]>(FEEDBACK_SUBMISSIONS);
	const [selectedStatus, setSelectedStatus] = useState<string>('all');
	const [selectedMedia, setSelectedMedia] = useState<string>('all');
		const [selectedSubmission, setSelectedSubmission] = useState<FeedbackSubmission | null>(null);
		const [isReviewModalOpen, setReviewModalOpen] = useState(false);

	const summary = useMemo(() => computeSummary(submissions), [submissions]);

	const filteredSubmissions = useMemo(() => {
		return submissions
			.filter((item) => (selectedStatus === 'all' ? true : item.status === selectedStatus))
			.filter((item) => (selectedMedia === 'all' ? true : item.mediaType === selectedMedia));
	}, [submissions, selectedStatus, selectedMedia]);

		const handleAction = (action: string, submission: FeedbackSubmission) => {
			if (action === 'review') {
				setSelectedSubmission(submission);
				setReviewModalOpen(true);
				return;
			}
			console.log('Advisor feedback action', action, submission.id);
	};

	const handleBulkAction = (action: string) => {
		console.log('Advisor feedback bulk', action);
	};

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<Flex wrap="wrap" gap={16} className="md:flex-nowrap">
					<SummaryTile icon="mdi:inbox-arrow-down" label="Tổng cần đánh giá" value={summary.total} helper={`${summary.pending} đang chờ`} />
					<SummaryTile icon="mdi:clock-outline" label="Chờ đánh giá" value={summary.pending} accent="rgba(250,140,22,0.12)" iconColor="#fa8c16" />
					<SummaryTile icon="mdi:alert-circle-outline" label="Cần làm lại" value={summary.rework} accent="rgba(255,77,79,0.12)" iconColor="var(--error)" />
					<SummaryTile icon="mdi:video-outline" label="Video" value={summary.videos} helper={`${summary.total - summary.videos} hình ảnh`} accent="rgba(56,189,248,0.12)" />
				</Flex>
			</Card>

			<Card title={<span className="text-base font-semibold text-[var(--text)]">Danh sách cần đánh giá</span>}>
				<div className="flex flex-col gap-4">
					<FeedbackFilter
						selectedStatus={selectedStatus}
						onStatusChange={setSelectedStatus}
						selectedMedia={selectedMedia}
						onMediaChange={setSelectedMedia}
						onBulkAction={handleBulkAction}
					/>

					<CardTable
						items={filteredSubmissions}
						pageSize={4}
						renderItem={(item) => (
							<FeedbackCard key={item.id} submission={item} onAction={handleAction} />
						)}
					/>
				</div>
			</Card>

						<ReviewModal
							submission={selectedSubmission}
							isOpen={isReviewModalOpen}
							onClose={() => setReviewModalOpen(false)}
									onSubmit={(payload: FeedbackReviewPayload) => {
											console.log('Submit review', selectedSubmission?.id, payload);
								setReviewModalOpen(false);
							}}
						/>
		</div>
	);
};

export default AdvisorFeedbackRequests;
