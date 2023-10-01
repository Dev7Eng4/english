'use client';

import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import React, { useMemo } from 'react';
import { Fragment } from 'react';
import { useState } from 'react';

import rightArrowIcon from '@/app/assets/right-arrow.svg';
import goalSettingIcon from '@/app/assets/goal-setting.png';
import LevelTab from './LevelTab';

const mock: ISetting[] = [
  {
    id: '1',
    key: 'audience',
    type: 'A',
    label: 'Audience',
    levels: [
      {
        id: '11',
        label: 'General',
        description: 'Easy for anyone to read with minimal effort.',
      },
      {
        id: '12',
        label: 'Knowledgeable',
        description: 'Requires focus to read and understand.',
        isDefault: true,
      },
      {
        id: '13',
        label: 'Expert',
        description: 'May require rereading to understand.',
      },
    ],
  },
  {
    id: '2',
    key: 'formality',
    type: 'F',
    label: 'Formality',
    levels: [
      {
        id: '21',
        label: 'Informal',
        description: 'Allows slang and other more casual usages.',
      },
      {
        id: '22',
        label: 'Neutral',
        description: 'Restricts slang but allows standard casual expressions.',
        isDefault: true,
      },
      {
        id: '23',
        label: 'Formal',
        description: 'Restricts slang and colloquialisms.',
      },
    ],
  },
  {
    id: '3',
    key: 'domain',
    type: 'D',
    label: 'Domain',
    isPremium: true,
    levels: [
      {
        id: '31',
        label: 'Academic',
      },
      {
        id: '32',
        label: 'Business',
      },
      {
        id: '33',
        label: 'General',
        description:
          'Get customized suggestions for business writing, academic assignments, and more.',
        isDefault: true,
      },
      {
        id: '34',
        label: 'Email',
      },
      {
        id: '35',
        label: 'Casual',
      },
      {
        id: '36',
        label: 'Creative',
      },
    ],
  },
  {
    id: '4',
    key: 'intent',
    type: 'I',
    label: 'Intent',
    description:
      "Experimental. What are you trying to do? This helps us build new suggestions and won't affect your feedback today.",
    levels: [
      {
        id: '41',
        label: 'Inform',
      },
      {
        id: '42',
        label: 'Describe',
      },
      {
        id: '43',
        label: 'Convince',
      },
      {
        id: '44',
        label: 'Tell A Story',
      },
    ],
  },
];

type IKeySetting = keyof typeof defaultSettings;

const defaultSettings = {
  audience: '12',
  formality: '22',
  domain: '33',
  intent: '41',
  show: false,
};

const GoalSetting = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);

  const numberOfSettings = useMemo(() => {
    return Object.keys(settings).reduce(
      (sum, key) =>
        typeof settings[key as IKeySetting] !== 'boolean' && settings[key as IKeySetting]
          ? sum + 1
          : sum,
      0
    );
  }, [settings]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpenGoalSettings = () => {
    setIsOpen(true);
  };

  const handleResetToDefaults = () => {
    setSettings(defaultSettings);
  };

  const handleSaveSettings = () => {
    handleClose();
  };

  const handleChangeShow = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      show: e.target.checked,
    }));
  };

  const handleChangeSetting = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <>
      <div
        className='group flex items-center justify-between pl-4 pr-2 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100'
        onClick={handleOpenGoalSettings}
      >
        <div>
          <span className='font-medium'>Goals</span>
          <br />
          <span>{numberOfSettings} of 4 set</span>
        </div>
        <Image
          src={rightArrowIcon}
          alt='Right Arrow'
          className='w-6 h-6 group-hover:text-blue-300'
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
                <Dialog.Panel className='w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all'>
                  <div className='flex gap-4 m-6'>
                    <div className='w-1/4'>
                      <Image src={goalSettingIcon} alt='Goal Settings' className='w-20' />
                    </div>

                    <div>
                      <Dialog.Title as='h2' className='mb-4 text-2xl font-bold text-gray-900'>
                        Set Goals
                      </Dialog.Title>
                      <Dialog.Description className='text-xs'>
                        Get tailored writing suggestions based on your goals and audience.
                      </Dialog.Description>
                    </div>
                  </div>

                  <div className='m-6'>
                    {mock.map(m => (
                      <div key={m.id}>
                        <hr className='my-3' />
                        <LevelTab
                          setting={m}
                          value={settings[m.key]}
                          onChange={handleChangeSetting}
                        />
                      </div>
                    ))}
                  </div>

                  <div className='flex gap-2 justify-between items-center p-6 bg-gray-100'>
                    <div className='flex gap-x-2 items-center'>
                      <input
                        id='comments'
                        name='comments'
                        type='checkbox'
                        checked={settings.show}
                        onChange={handleChangeShow}
                        className='h-3.5 w-3.5 rounded border-gray-300 cursor-pointer text-indigo-600 focus:ring-indigo-600'
                      />
                      <label htmlFor='comments' className='text-gray-400 text-xs cursor-pointer'>
                        Show <span className='text-gray-700'>Set Goals</span> when I start a new
                        document
                      </label>
                    </div>

                    <div>
                      <button
                        className='mr-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-200 rounded-md transition-colors'
                        onClick={handleResetToDefaults}
                      >
                        Reset to defaults
                      </button>
                      <button
                        className='px-3 py-1.5 rounded-md text-sm bg-blue-600 text-white'
                        onClick={handleSaveSettings}
                      >
                        Done
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

export default GoalSetting;
