'use client';

import React, { Fragment, useState } from 'react';
import Image from 'next/image';

import rightArrowIcon from '@/app/assets/right-arrow.svg';
import { Dialog, Transition } from '@headlessui/react';
import ProgressPercent from './ProgressCycle/ProgressCycle';
import ProgressCycle from './ProgressCycle/ProgressCycle';
import SpinnerSvgIcon from '@/app/components/icons/SpinnerSvgIcon';
import ScoreSvgIcon from '@/app/components/icons/ScoreSvgIcon';

const workCounts = [
  {
    key: 'characters',
    label: 'Characters',
    value: 2297,
  },
  {
    key: 'readingTime',
    label: 'Reading time',
    value: '1 min 35 sec',
  },
  {
    key: 'words',
    label: 'Words',
    value: 0,
  },
  {
    key: 'speakingTime',
    label: 'Speaking time',
    value: '3 min 3 sec',
  },
  {
    key: 'sentences',
    label: 'Sentences',
    value: 20,
  },
];

const readabilities = [
  {
    key: 'numberOfWords',
    label: 'Word length',
    value: 4.6,
    average: 16,
  },
  {
    key: 'numberOfSentences',
    label: 'Sentence Length',
    value: 19.9,
    average: 78,
  },
  {
    key: 'readabilityScore',
    label: 'Readability score',
    value: 56,
    average: 55,
  },
];

const vocabularies = [
  {
    key: 'uniqueWords',
    label: 'Unique words',
    value: 13,
    average: -18,
  },
  {
    key: 'rareWords',
    label: 'Rare words',
    value: 22,
    average: -32,
  },
];

interface Props {
  isLoading: boolean;
  score: number;
}

const PerformanceScore = ({ isLoading, score }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div
        className='group flex items-center justify-between pl-4 pr-2 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100'
        onClick={handleOpen}
      >
        <div className='flex items-center'>
          {isLoading ? (
            <SpinnerSvgIcon />
          ) : (
            <>
              {score > 0 && <strong className='mr-1 text-md'>{score}</strong>}

              <span className='font-medium text-[13px]'>Overall score</span>
              {/* <span className='text-sm'>See performance</span> */}
            </>
          )}
        </div>
        <Image
          src={rightArrowIcon}
          alt='Right Arrow'
          className='w-5 h-5 group-hover:text-blue-300'
        />
      </div>

      <Transition
        // appear
        show={isOpen}
        as={Fragment}
      >
        <Dialog as='div' className='relative z-50' open={isOpen} onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all'>
                  <div className='m-6 mb-0'>
                    <Dialog.Title as='h2' className='mb-2 text-2xl font-bold text-gray-900'>
                      Performance
                    </Dialog.Title>

                    <hr />
                  </div>

                  <div className='max-h-[calc(80vh-140px)] overflow-auto scrollbar'>
                    <div className='flex gap-10 m-6 mt-3'>
                      <span>
                        Text score: 80 out of 100. This score represents the quality of writing in
                        this document. You can increase it by addressing Grammarly&apos;s
                        suggestions.
                      </span>

                      <div className='w-20 h-20 shrink-0 relative'>
                        <ScoreSvgIcon />
                        <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-medium'>
                          80
                        </span>
                      </div>
                    </div>

                    <div className='m-6 mt-8'>
                      <h3 className='mb-2 text-xl font-bold text-gray-900'>Word Count</h3>

                      <hr className='mb-4' />

                      <div className='flex gap-3 flex-wrap justify-between'>
                        {workCounts.map(workCount => (
                          <div key={workCount.key} className='w-5/12 flex justify-between'>
                            <span>{workCount.label}</span>
                            <span className='text-blue-600 font-medium'>{workCount.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className='m-6 mt-8'>
                      <h3 className='flex justify-between items-center mb-2 text-xl font-bold text-gray-900'>
                        Readability
                        <span className='font-light text-sm text-gray-500'>
                          Metrics compared to other Grammarly users
                        </span>
                      </h3>

                      <hr className='mb-4' />

                      <div className='mb-2'>
                        {readabilities.map(readability => (
                          <div
                            key={readability.key}
                            className='flex justify-between items-center gap-2 mb-2'
                          >
                            <div className='w-5/12 flex justify-between'>
                              <span>{readability.label}</span>
                              <span className='text-blue-600 font-medium'>{readability.value}</span>
                            </div>

                            <div className='w-5/12 flex items-center text-sm'>
                              <div className='w-12 bg-gray-200 rounded-full rounded-tr-none rounded-br-none h-1.5 dark:bg-gray-700'></div>
                              <span className='w-[1px] h-4 bg-gray-200' />
                              <div className='w-12 bg-gray-200 rounded-full rounded-tl-none rounded-bl-none h-1.5 dark:bg-gray-700'>
                                <div
                                  className={`bg-blue-600 h-1.5 rounded-full rounded-tl-none rounded-bl-none dark:bg-blue-500 w-[${readability.average}%]`}
                                ></div>
                              </div>
                              <span className='grow text-right'>Above average</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <span className='text-sm'>
                        Your text is likely to be understood by a reader who has at least a
                        9th-grade education (age 15). Aim for the score of at least 60-70 to ensure
                        your text is easily readable by 80% of English speakers.
                      </span>
                    </div>

                    <div className='m-6 mt-8'>
                      <h3 className='flex justify-between items-center mb-2 text-xl font-bold text-gray-900'>
                        Vocabulary
                        <span className='font-light text-sm text-gray-500'>
                          Metrics compared to other Grammarly users
                        </span>
                      </h3>

                      <hr className='mb-4' />

                      <div className=''>
                        {vocabularies.map(vocab => (
                          <div
                            key={vocab.key}
                            className='flex justify-between items-center gap-2 mb-2'
                          >
                            <div className='w-2/5 flex justify-between'>
                              <span>{vocab.label}</span>
                              <span className='text-blue-600 font-medium'>{vocab.value}</span>
                            </div>

                            <div className='w-5/12 flex items-center text-sm'>
                              <div className='w-12 bg-gray-200 rounded-full rounded-tr-none rounded-br-none h-1.5 dark:bg-gray-700'>
                                <div
                                  className={`bg-blue-600 h-1.5 rounded-full rounded-tr-none rounded-br-none dark:bg-blue-500 ml-auto w-[${Math.abs(
                                    vocab.average
                                  )}%]`}
                                ></div>
                              </div>
                              <span className='w-[1px] h-4 bg-gray-200' />
                              <div className='w-12 bg-gray-200 rounded-full rounded-tl-none rounded-bl-none h-1.5 dark:bg-gray-700'></div>
                              <span className='grow text-right'>Under average</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='flex gap-2 justify-between items-center p-6 bg-gray-100'>
                    <div className='ml-auto'>
                      <button className='mr-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-200 rounded-md transition-colors outline-none'>
                        Download PDF report
                      </button>
                      <button
                        className='px-3 py-1.5 rounded-md text-sm bg-blue-600 text-white'
                        onClick={handleClose}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default PerformanceScore;
