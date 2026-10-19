/**
 * Mulwa Clinical Exam Portal
 * Home Dashboard View
 *
 * Displays session-level analytics (questions answered, correct count, accuracy rate),
 * instant resume card for active revision sets, quick navigation, and recent activity logs.
 * Minimalist, decluttered layout matching modern medical exam preparation portals.
 *
 * @author MULWA <martinmulwa95@gmail.com>
 * @version 6.0.0
 */

import React, { useState } from 'react';
import {
  ChevronRight,
  Play,
  BookOpen,
  RotateCcw,
  Trash2,
  X,
  FileText,
  GraduationCap,
  AlertCircle,
  Award,
  CheckCircle2
} from 'lucide-react';
import { SessionProgress, AppNavTab } from '../types';
import { getPaperMetrics, getMetrics, getActivityLog, parseSetKey } from '../utils/storage';
import { PAST_PAPERS, findPaper, BOARD_PAST_PAPERS, TNH_PRACTICE_PAPERS } from '../data/questions';
import { ALL_SAQ_QUESTIONS } from '../data/saqData';

interface HomeDashboardProps {
  progress: SessionProgress;
  onNavigate: (tab: AppNavTab) => void;
  onContinueSet: (paperId: string, setId: string) => void;
  onClearProgress: () => void;
}

export default function HomeDashboard({
  progress,
  onNavigate,
  onContinueSet,
  onClearProgress
}: HomeDashboardProps) {
  const [showClearModal, setShowClearModal] = useState(false);
  const paperMetrics = getPaperMetrics(progress);
  const sessionMetrics = getMetrics(progress);
  const logs = getActivityLog(progress);

  // Determine the most recently updated in-progress set
  const inProgressList = Object.entries(progress.inProgressSets);
  let continuePaperId = PAST_PAPERS[0]?.id || '';
  let continueSetId = 'set1';
  let continueText = 'Resume Practice';

  if (inProgressList.length > 0) {
    const sortedIP = inProgressList.sort(
      (a, b) => new Date(b[1].timestamp).getTime() - new Date(a[1].timestamp).getTime()
    );
    const [id, state] = sortedIP[0];
    const { paperId, setId } = parseSetKey(id);
    const paper = findPaper(paperId);
    continuePaperId = paper ? paper.id : paperId;
    continueSetId = setId;
    const setNum = parseInt(setId.replace('set', ''), 10) || 1;
    continueText = paper ? `${paper.title} · Set ${setNum}` : `Set ${setNum} · In Progress`;
  }

  const hasAnyProgress =
    paperMetrics.papersAttempted > 0 ||
    inProgressList.length > 0 ||
    Object.keys(progress.completedSets).length > 0 ||
    progress.incorrectQuestions.length > 0;

  const handleConfirmClear = () => {
    onClearProgress();
    setShowClearModal(false);
  };

  return (
    <div className="space-y-4 sm:space-y-5" id="screen-home-dashboard">
      {/* 1. Quick Resume Card (if an in-progress set exists) */}
      {inProgressList.length > 0 && (
        <button
          onClick={() => onContinueSet(continuePaperId, continueSetId)}
          className="w-full bg-gradient-to-r from-[#0B1B3D] via-[#112754] to-[#1e3a8a] text-left p-4 sm:p-4.5 flex justify-between items-center rounded-2xl group transition-all hover:shadow-md hover:scale-[1.005] active:scale-[0.99] min-h-[68px] shadow-sm cursor-pointer border border-indigo-900/40"
          id="continue-revision-card"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 text-white shadow-xs group-hover:scale-105 transition-transform">
              <Play className="w-4.5 h-4.5 fill-white ml-0.5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-bold text-sm sm:text-base leading-snug truncate">
                Resume Practice
              </h2>
              <p className="text-indigo-200 text-xs sm:text-sm mt-0.5 font-medium truncate">
                {continueText}
              </p>
            </div>
          </div>
          <ChevronRight
            className="w-5 h-5 text-indigo-300 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2"
            strokeWidth={2.5}
          />
        </button>
      )}

      {/* 2. Quick Metrics Bar (when candidate has attempted questions) */}
      {sessionMetrics.questionsAnswered > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3" id="dashboard-metrics-bar">
          <div className="bg-gradient-to-br from-indigo-50/90 to-blue-50/60 border border-indigo-200/80 rounded-xl p-2.5 sm:p-3 text-center shadow-2xs">
            <div className="text-base sm:text-xl font-extrabold text-indigo-950">
              {sessionMetrics.questionsAnswered}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-indigo-700 uppercase tracking-wider mt-0.5">
              Answered
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/60 border border-emerald-200/80 rounded-xl p-2.5 sm:p-3 text-center shadow-2xs">
            <div className="text-base sm:text-xl font-extrabold text-emerald-950">
              {sessionMetrics.accuracy}%
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-emerald-700 uppercase tracking-wider mt-0.5">
              Accuracy
            </div>
          </div>
          <div className="bg-gradient-to-br from-sky-50/90 to-cyan-50/60 border border-sky-200/80 rounded-xl p-2.5 sm:p-3 text-center shadow-2xs">
            <div className="text-base sm:text-xl font-extrabold text-sky-950">
              {sessionMetrics.setsCompletedCount}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-sky-700 uppercase tracking-wider mt-0.5">
              Completed
            </div>
          </div>
        </div>
      )}

      {/* 3. Past Papers Group */}
      <div className="space-y-2">
        <h2 className="text-xs uppercase tracking-wider font-extrabold text-slate-500 px-1">
          Past Papers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {/* MCQ Bank Tile */}
          <button
            onClick={() => onNavigate('papers')}
            className="bg-gradient-to-br from-white via-white to-indigo-50/60 rounded-2xl border border-slate-200/90 hover:border-indigo-400 p-3.5 sm:p-4 flex justify-between items-center transition-all text-left group min-h-[64px] shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer"
            id="dashboard-mcq-bank-tile"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-100/80 border border-indigo-200/90 flex items-center justify-center text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-indigo-950 transition-colors leading-snug truncate">
                  MCQ Bank
                </h3>
                <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                  {BOARD_PAST_PAPERS.length} Papers
                </p>
              </div>
            </div>
            <ChevronRight
              className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5"
              strokeWidth={2}
            />
          </button>

          {/* SAQ Bank Tile */}
          <button
            onClick={() => onNavigate('saqs')}
            className="bg-gradient-to-br from-white via-white to-purple-50/60 rounded-2xl border border-slate-200/90 hover:border-purple-400 p-3.5 sm:p-4 flex justify-between items-center transition-all text-left group min-h-[64px] shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer"
            id="dashboard-saqs-tile"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-purple-100/80 border border-purple-200/90 flex items-center justify-center text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-all shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-purple-950 transition-colors leading-snug truncate">
                  SAQ Bank
                </h3>
                <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                  Block 1: Respiratory & Trauma
                </p>
              </div>
            </div>
            <ChevronRight
              className="w-4 h-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5"
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      {/* 4. Practice & Review Group */}
      <div className="space-y-2">
        <h2 className="text-xs uppercase tracking-wider font-extrabold text-slate-500 px-1">
          Practice & Review
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {/* TNH Practice Tile */}
          <button
            onClick={() => onNavigate('tnh_practice')}
            className="bg-gradient-to-br from-white via-white to-teal-50/60 rounded-2xl border border-slate-200/90 hover:border-teal-400 p-3.5 sm:p-4 flex justify-between items-center transition-all text-left group min-h-[64px] shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer"
            id="dashboard-tnh-practice-tile"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-teal-100/80 border border-teal-200/90 flex items-center justify-center text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-all shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-teal-950 transition-colors leading-snug truncate">
                  TNH Practice
                </h3>
                <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                  MCQ & SAQ Practice Modules
                </p>
              </div>
            </div>
            <ChevronRight
              className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5"
              strokeWidth={2}
            />
          </button>

          {/* Mistakes Review Tile */}
          <button
            onClick={() => onNavigate('review')}
            className="bg-gradient-to-br from-white via-white to-rose-50/60 rounded-2xl border border-slate-200/90 hover:border-rose-400 p-3.5 sm:p-4 flex justify-between items-center transition-all text-left group min-h-[64px] shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer"
            id="dashboard-review-mistakes-tile"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-rose-100/80 border border-rose-200/90 flex items-center justify-center text-rose-700 group-hover:bg-rose-600 group-hover:text-white transition-all shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-rose-950 transition-colors leading-snug truncate">
                  Review Mistakes
                </h3>
                <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                  Targeted Weak Areas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${
                  progress.incorrectQuestions.length > 0
                    ? 'bg-rose-50 text-rose-800 border-rose-200 shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                {progress.incorrectQuestions.length}
              </span>
              <ChevronRight
                className="w-4 h-4 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all"
                strokeWidth={2}
              />
            </div>
          </button>
        </div>
      </div>

      {/* 4. Activity Log Section */}
      <div className="space-y-2.5 pt-1" id="section-recent-activity">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Recent Activity
          </h2>

          {hasAnyProgress && (
            <button
              onClick={() => setShowClearModal(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer min-h-[36px] px-2 rounded-lg"
              id="clear-progress-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {logs.length > 0 ? (
          <div className="border border-slate-200/90 rounded-2xl divide-y divide-slate-100 overflow-hidden bg-white shadow-2xs">
            {logs.slice(0, 4).map(log => (
              <button
                key={log.id}
                onClick={() => onContinueSet(log.paperId, log.setId)}
                className="w-full p-3 sm:p-3.5 flex justify-between items-center hover:bg-slate-50 transition-colors text-left min-h-[52px] cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-slate-100 flex items-center justify-center text-[#0B1B3D] rounded-xl shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                      {log.paperTitle} – {log.setName}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                      {log.timestamp}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-lg border ${
                      log.scoreText.includes('%') && !log.scoreText.includes('answered')
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-amber-50 text-amber-800 border-amber-100'
                    }`}
                  >
                    {log.scoreText}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="border border-slate-200/90 p-6 sm:p-8 text-center rounded-2xl bg-white shadow-2xs">
            <button
              onClick={() => onNavigate('papers')}
              className="w-10 h-10 mx-auto bg-[#0B1B3D] text-white flex items-center justify-center rounded-xl hover:bg-[#162f5f] transition-all active:scale-95 shadow-sm cursor-pointer"
              title="Start Practice"
            >
              <Play className="w-4 h-4 fill-white ml-0.5" />
            </button>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-2.5">
              Select a past paper to start practicing
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Resetting Session Progress */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <Trash2 className="w-5 h-5" />
              </div>
              <button
                onClick={() => setShowClearModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">Reset Session Progress?</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                This will reset questions answered, active set positions, scores, and mistakes review list.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-xs min-h-[44px]"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
