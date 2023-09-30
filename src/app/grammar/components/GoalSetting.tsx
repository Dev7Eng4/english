'use client';

import { Dialog, Transition } from '@headlessui/react';
import React from 'react';
import { Fragment } from 'react';
import { useState } from 'react';

const mock = [
  {
    type: 'A',
    label: 'Audience',
    level: [
      {
        label: 'General',
        description: 'Easy for anyone to read with minimal effort.',
      },
      {
        label: 'Knowledgeable',
        description: 'Requires focus to read and understand.',
        isDefault: true,
      },
      {
        label: 'Expert',
        description: 'May require rereading to understand.',
      },
    ],
  },
  {
    type: 'F',
    label: 'Formality',
    level: [
      {
        label: 'Informal',
        description: 'Allows slang and other more casual usages.',
      },
      {
        label: 'Neutral',
        description: 'Restricts slang but allows standard casual expressions.',
        isDefault: true,
      },
      {
        label: 'Formal',
        description: 'Restricts slang and colloquialisms.',
      },
    ],
  },
  {
    type: 'D',
    label: 'Domain',
    isPremium: true,
    level: [
      {
        label: 'Academic',
      },
      {
        label: 'Business',
      },
      {
        label: 'General',
        description:
          'Get customized suggestions for business writing, academic assignments, and more.',
      },
      {
        label: 'Email',
      },
      {
        label: 'Casual',
      },
      {
        label: 'Creative',
      },
    ],
  },
  {
    type: 'I',
    label: 'Intent',
    description:
      "Experimental. What are you trying to do? This helps us build new suggestions and won't affect your feedback today.",
    level: [
      {
        label: 'Inform',
      },
      {
        label: 'Describe',
      },
      {
        label: 'Convince',
      },
      {
        label: 'Tell A Story',
      },
    ],
  },
];

const GoalSetting = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {};

  return (
    <Transition
      show={isOpen}
      enter='transition duration-100 ease-out'
      enterFrom='transform scale-95 opacity-0'
      enterTo='transform scale-100 opacity-100'
      leave='transition duration-75 ease-out'
      leaveFrom='transform scale-100 opacity-100'
      leaveTo='transform scale-95 opacity-0'
      as={Fragment}
    >
      <Dialog open={isOpen} onClose={handleClose}>
        <Dialog.Panel>
          <Dialog.Title>Set Goals</Dialog.Title>
          <Dialog.Description>
            Get tailored writing suggestions based on your goals and audience.
          </Dialog.Description>

          <div>
            <div>
              <div>Audience</div>

              <div>
                <div>
                  <span>General</span>
                  <span>Knowledgeable</span>
                  <span>Expert</span>
                </div>

                <div>
                  <span>Expert:</span> May require rereading to understand.
                </div>
              </div>
            </div>
          </div>

          <div>
            <div>
              <input type='checkbox' name='' id='' />
              <label htmlFor=''>
                Show <span>Set Goals</span> when I start a new document
              </label>
            </div>

            <button>Reset to defaults</button>
            <button>Done</button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </Transition>
  );
};

export default GoalSetting;
