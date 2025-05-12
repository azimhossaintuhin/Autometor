'use client';

import React from 'react';
import { FaStar, FaCodeBranch } from 'react-icons/fa';
import { GoRepo } from 'react-icons/go';
import Link from 'next/link';
interface Repo {
    id: number;
    name: string;
    description: string;
    language?: string;
    languageColor?: string;
    stars?: number;
    forks?: number;
    updatedAt?: string;
}

const RepoCards: React.FC<{ repo: Repo }> = ({ repo }) => {
    return (
        <div className="flex flex-col justify-between bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition duration-200 p-4 w-full h-full">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
                <GoRepo className="text-lg text-gray-700 dark:text-gray-300" />
                <Link href={`/repo/${repo.name}`}>
                    <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400 break-words">
                        {repo.name}
                    </h2>
                </Link>
            </div>

            {/* Description */}
            <p className="text-sm text-start text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {repo.description || 'No description provided.'}
            </p>

            {/* Footer */}
            <div className="flex flex-wrap justify-between text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-3">
                    {repo.language && (
                        <span className="flex items-center gap-1">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: repo.languageColor || '#ccc' }}
                            ></span>
                            {repo.language}
                        </span>
                    )}
                    {repo.stars !== undefined && (
                        <span className="flex items-center gap-1">
                            <FaStar className="text-yellow-400" /> {repo.stars}
                        </span>
                    )}
                    {repo.forks !== undefined && (
                        <span className="flex items-center gap-1">
                            <FaCodeBranch /> {repo.forks}
                        </span>
                    )}
                </div>

                {repo.updatedAt && (
                    <span className="text-xs text-gray-500 mt-2 sm:mt-0">
                        Updated {new Date(repo.updatedAt).toLocaleDateString()}
                    </span>
                )}
            </div>
        </div>
    );
};

export default RepoCards;
