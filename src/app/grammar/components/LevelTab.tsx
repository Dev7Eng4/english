import { Tab } from '@headlessui/react';
import React, { useEffect, useState } from 'react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface Props {
  value: string;
  setting: ISetting;
  onChange: (key: string, value: string) => void;
}

const LevelTab = ({ setting, value, onChange }: Props) => {
  const { id, key, type, label, isPremium, description, levels } = setting;

  const [selectedTab, setSelectedTab] = useState(-1);

  const handleChangeTab = (idx: any) => {
    if (isPremium) return;
    setSelectedTab(idx);
    onChange(key, levels[idx].id);
  };

  useEffect(() => {
    const idxDefaultTab = levels.findIndex(lvl => lvl.id === value);

    if (idxDefaultTab >= 0) {
      setSelectedTab(idxDefaultTab);
    }
  }, [value, levels]);

  return (
    <Tab.Group selectedIndex={selectedTab} onChange={handleChangeTab}>
      <div className='flex items-center gap-4 mb-2'>
        <div className='w-1/4'>
          <b>{label}</b>
        </div>

        <Tab.List className='flex space-x-0.5 rounded-xl'>
          {levels.map((level, idx) => (
            <Tab
              key={`${id}${level.id}`}
              className={({ selected }) => {
                return classNames(
                  'px-3 py-1.5 text-sm leading-5 outline-none',
                  selected ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600',
                  idx === 0 ? 'rounded-tl-md rounded-bl-md' : '',
                  idx === levels.length - 1 ? 'rounded-tr-md rounded-br-md' : '',
                  isPremium ? 'cursor-not-allowed' : 'cursor-pointer',
                  !selected && isPremium ? 'bg-blue-50 text-blue-300' : ''
                );
              }}
            >
              {level.label}
            </Tab>
          ))}
        </Tab.List>
      </div>

      <div className='flex gap-4'>
        <div className='w-1/4 shrink-0'></div>
        <Tab.Panels className='mt-2'>
          {levels.map((level, idx) => (
            <Tab.Panel
              key={level.id}
              className={classNames(
                'rounded-xl bg-white text-xs',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}
            >
              {description}
              {level.description && (
                <>
                  <strong>
                    {level.label}
                    {`${level.isDefault ? ' (default)' : ''}`}:
                  </strong>{' '}
                  {level.description}
                </>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </div>
    </Tab.Group>
  );
};

export default LevelTab;
